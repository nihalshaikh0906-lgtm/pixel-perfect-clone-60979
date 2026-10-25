import { deepMedia, mediaUrl, absoluteMediaUrl } from "@/lib/media";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { BookOpen, MapPin, CarFront, FileText, Receipt, Loader2, MessageCircle, Play, Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { PaymentPlanModal } from "@/components/PaymentPlanModal";
import { PhotoLightbox } from "@/components/PhotoLightbox";
import { ProjectTourModal } from "@/components/ProjectTourModal";

import { ProjectMap } from "@/components/ProjectMap";
import { PackOverview } from "@/components/PackOverview";
import type { MatchRow } from "@/components/UnitCard";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";
import { aed, beds, quarterOf, sqft } from "@/lib/format";
import { findTourUrl } from "@/lib/youtube";
import { openWhatsApp } from "@/lib/whatsapp-send";


type PackDoc = { type: string; name: string | null; url: string | null };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Pack = any;

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h3 className="eyebrow">{title}</h3>
      {children}
    </section>
  );
}

export function PropertyPackDrawer({
  unit,
  clientId,
  clientPhone,
  onClose,
}: {
  unit: MatchRow | null;
  clientId: string | null;
  clientPhone: string | null;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const [photoIndex, setPhotoIndex] = useState<number | null>(null);
  const [planOpen, setPlanOpen] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const [tourOpen, setTourOpen] = useState(false);
  const { data, isLoading, error } = useQuery({
    queryKey: ["pack", unit?.project_id, unit?.unit_id],
    enabled: !!unit,
    staleTime: Infinity,
    queryFn: async () => {
      if (!unit) return null;
      const { data: pack, error: rpcError } = await supabase.rpc("get_property_pack", {
        p_project_id: unit.project_id,
        p_unit_id: unit.unit_id,
      });
      if (rpcError) throw new Error(rpcError.message);
      return deepMedia(pack) as Pack;
    },
  });

  const documents: PackDoc[] = Array.isArray(data?.documents) ? data.documents : [];
  const photos: string[] = Array.isArray(data?.photos) ? data.photos.filter(Boolean) : [];
  const brochure = documents.find((d) => d.type === "brochure");
  const floorPlan = mediaUrl(
    data?.selected_unit?.floor_plan_urls?.[0] ?? documents.find((d) => d.type === "floor_plan")?.url
  );
  const tourUrl = findTourUrl(data);

  async function copyPitch() {
    const plan = data?.payment_plans?.[0];
    const steps: string[] = Array.isArray(plan?.steps)
      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
      plan.steps.map((s: any) => `  • ${s.step}: ${s.percent}%`)
      : [];
    const pitch = [
      `${unit?.project_name} — ${unit?.developer ?? ""}`.trim(),
      `${beds(unit?.bedrooms)} · ${sqft(unit?.size_sqft)}`,
      `Price: ${aed(unit?.price_aed)}`,
      `Handover: ${quarterOf(unit?.handover_date)}`,
      plan ? `Payment plan: ${plan.name}` : null,
      ...steps,
      brochure?.url ? `Brochure: ${absoluteMediaUrl(brochure.url)}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    try {
      await navigator.clipboard.writeText(pitch);
      toast.success("Pitch copied to clipboard");
    } catch {
      toast.error("Could not copy the pitch");
    }
    openWhatsApp({ phone: clientPhone, text: pitch, recipientName: clientName || "client" });
  }

  async function saveToShortlist() {
    if (!unit || !clientId) return;
    const { error: insertError } = await supabase.from("shortlists").insert({
      client_id: clientId,
      project_id: unit.project_id,
      unit_id: unit.unit_id,
      score: unit.score ?? null,
      reason: `AI match ${Math.round(unit.score ?? 0)}%`,
      status: "saved",
    });
    if (insertError) toast.error(insertError.message);
    else {
      toast.success("Saved to shortlist");
      void queryClient.invalidateQueries({ queryKey: ["shortlists", clientId] });
    }
  }

  return (
    <Sheet open={!!unit} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="property-pack flex w-full max-w-full flex-col overflow-hidden p-0 sm:max-w-3xl">
        <SheetHeader className="shrink-0 border-b border-border px-5 py-5 pr-12 text-left">
          <SheetTitle className="font-display text-xl">
            {unit?.project_name ?? "Property pack"}
          </SheetTitle>
          <p className="text-sm text-muted-foreground">
            {unit?.developer} · {unit?.district}
          </p>
        </SheetHeader>

        <div className="min-h-0 flex-1 space-y-7 overflow-y-auto overscroll-contain px-4 py-5 sm:px-6">
          {isLoading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" /> Loading pack…
            </div>
          ) : null}
          {error ? (
            <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {(error as Error).message}
            </p>
          ) : null}

          <div className="grid grid-cols-1 gap-2 min-[440px]:grid-cols-2 [&_button]:h-auto [&_button]:min-h-10 [&_button]:whitespace-normal [&_button]:py-2 [&_button]:text-left">
            <Button onClick={() => brochure?.url && window.open(mediaUrl(brochure.url)!, "_blank", "noopener")} disabled={!brochure?.url}>
              <BookOpen className="size-4" /> Open Brochure
            </Button>
            <Button
              variant="outline"
              onClick={() => floorPlan && window.open(floorPlan, "_blank", "noopener")}
              disabled={!floorPlan}
            >
              <FileText className="size-4" /> View Floorplan
            </Button>
            <Button
              variant="outline"
              className="border-primary/50"
              onClick={() => setPlanOpen(true)}
              disabled={!Array.isArray(data?.payment_plans) || !data.payment_plans.length}
            >
              <Receipt className="size-4" /> View Payment Plan
            </Button>
            {tourUrl ? (
              <Button
                variant="outline"
                className="border-gold/50 text-gold hover:bg-gold/10 hover:text-gold"
                onClick={() => setTourOpen(true)}
              >
                <Play className="size-4 fill-current" /> Watch Project Tour
              </Button>
            ) : null}
            <Button variant="outline" className="border-primary/50" onClick={() => setMapOpen(true)} disabled={!unit}>
              <MapPin className="size-4" /> View Location
            </Button>
            <Button variant="outline" onClick={copyPitch}>
              <MessageCircle className="size-4" /> Copy Pitch & WhatsApp
            </Button>
            <Button variant="outline" onClick={saveToShortlist} disabled={!clientId} title={!clientId ? "Open a saved client profile to save a shortlist" : undefined}>
              <Star className="size-4" /> Save to shortlist
            </Button>
          </div>

          {photos.length ? (
            <Section title="Photos">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {photos.slice(0, 9).map((url, i) => (
                  <button
                    key={url}
                    type="button"
                    onClick={() => setPhotoIndex(i)}
                    className="aspect-[4/3] min-w-0 overflow-hidden rounded-lg bg-secondary"
                    aria-label={`Open photo ${i + 1}`}
                  >
                    <img
                      src={url}
                      alt=""
                      loading="lazy"
                      className="size-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </button>
                ))}
              </div>
            </Section>
          ) : null}

          <Section title="Selected unit">
            <div className="panel grid grid-cols-2 gap-3 p-4 text-sm">
              <Row label="Price" value={aed(unit?.price_aed)} />
              <Row label="Size" value={sqft(unit?.size_sqft)} />
              <Row label="Bedrooms" value={beds(unit?.bedrooms)} />
              <Row label="Handover" value={quarterOf(unit?.handover_date)} />
            </div>
          </Section>

          <Section title="Location">
            <ProjectMap
              name={unit?.project_name ?? "Project"}
              district={unit?.district ?? data?.project?.district}
              latitude={data?.project?.latitude ?? null}
              longitude={data?.project?.longitude ?? null}
            />
          </Section>

          {documents.length ? (
            <Section title="Documents">
              <ul className="space-y-2">
                {documents.map((doc, i) => (
                  <li key={`${doc.url}-${i}`}>
                    <a
                      href={doc.url ? mediaUrl(doc.url)! : "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-lg border border-border bg-secondary/40 px-3 py-2 text-sm hover:bg-secondary"
                    >
                      <FileText className="size-4 text-primary" />
                      <span className="truncate">{doc.name ?? doc.type}</span>
                      <span className="eyebrow ml-auto">{doc.type}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </Section>
          ) : null}

          {Array.isArray(data?.payment_plans) && data!.payment_plans.length ? (
            <Section title="Payment plan">
              <div className="space-y-3">
                {data!.payment_plans.map((plan: Pack, i: number) => (
                  <div key={i} className="panel p-4">
                    <p className="font-semibold">{String(plan.name ?? "Plan")}</p>
                    {plan.post_handover ? (
                      <p className="text-xs text-success">Includes post-handover</p>
                    ) : null}
                    <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                      {(Array.isArray(plan.steps) ? plan.steps : []).map(
                        (s: Pack, j: number) => (
                          <li key={j} className="flex justify-between gap-3">
                            <span className="truncate">{String(s.step ?? "")}</span>
                            <span className="text-foreground">{String(s.percent ?? "")}%</span>
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                ))}
              </div>
            </Section>
          ) : null}

          {Array.isArray(data?.available_units) && data!.available_units.length ? (
            <Section title="Units available">
              <div className="space-y-2">
                {data!.available_units.map((u: Pack, i: number) => (
                  <div
                    key={i}
                     className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-secondary/40 px-3 py-2 text-sm"
                  >
                    <span>
                      {beds(u.bedrooms)} · {String(u.unit_type ?? "")} ({String(u.units ?? "")})
                    </span>
                    <span className="text-muted-foreground">
                      {aed(u.from_price)} – {aed(u.to_price)}
                    </span>
                  </div>
                ))}
              </div>
            </Section>
          ) : null}

          {Array.isArray(data?.parking) && data!.parking.length ? (
            <Section title="Parking">
              <div className="flex flex-wrap gap-2">
                {data!.parking.map((p: Pack, i: number) => (
                  <span
                    key={i}
                    className="flex items-center gap-1.5 rounded-md border border-border bg-secondary/40 px-2.5 py-1 text-xs"
                  >
                    <CarFront className="size-3.5" />
                    {beds(p.bedrooms)} · {String(p.spaces ?? "")} space(s)
                  </span>
                ))}
              </div>
            </Section>
          ) : null}

          {data?.project ? (
            <Section title="Overview">
              <PackOverview overview={String(data.project.overview ?? "")} project={data.project} />
            </Section>
          ) : null}
        </div>
        <PhotoLightbox
          photos={photos}
          index={photoIndex}
          title={unit?.project_name ?? "Property"}
          onIndex={setPhotoIndex}
          onClose={() => setPhotoIndex(null)}
        />
        <ProjectMap
          open={mapOpen}
          onOpenChange={setMapOpen}
          name={unit?.project_name ?? "Project"}
          developer={unit?.developer ?? null}
          district={unit?.district ?? data?.project?.district}
          latitude={data?.project?.latitude ?? null}
          longitude={data?.project?.longitude ?? null}
        />
        <ProjectTourModal
          open={tourOpen}
          onOpenChange={setTourOpen}
          url={tourUrl}
          title={unit?.project_name ?? "Project tour"}
          subtitle={[unit?.developer, unit?.district].filter(Boolean).join(" · ") || null}
        />
        <PaymentPlanModal
          open={planOpen}
          onOpenChange={setPlanOpen}
          plans={Array.isArray(data?.payment_plans) ? data.payment_plans : []}
          price={unit?.price_aed ?? null}
          handover={unit?.handover_date ?? null}
          projectName={unit?.project_name ?? "Property"}
        />
      </SheetContent>
    </Sheet>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="eyebrow">{label}</p>
      <p className="mt-0.5 font-medium">{value}</p>
    </div>
  );
}
