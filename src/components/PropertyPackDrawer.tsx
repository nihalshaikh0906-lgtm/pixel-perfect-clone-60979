import { useQuery } from "@tanstack/react-query";
import { BookOpen, CarFront, FileText, Loader2, MessageCircle, Star } from "lucide-react";
import { toast } from "sonner";

import type { MatchRow } from "@/components/UnitCard";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";
import { aed, beds, quarterOf, sqft } from "@/lib/format";

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
  clientId: string;
  clientPhone: string | null;
  onClose: () => void;
}) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["pack", unit?.project_id, unit?.unit_id],
    enabled: !!unit,
    staleTime: Infinity,
    queryFn: async () => {
      const { data: pack, error: rpcError } = await supabase.rpc("get_property_pack", {
        p_project_id: unit!.project_id,
        p_unit_id: unit!.unit_id,
      });
      if (rpcError) throw new Error(rpcError.message);
      return pack as Pack;
    },
  });

  const documents: PackDoc[] = Array.isArray(data?.documents) ? data!.documents : [];
  const photos: string[] = Array.isArray(data?.photos) ? data!.photos.filter(Boolean) : [];
  const brochure = documents.find((d) => d.type === "brochure");
  const floorPlan =
    data?.selected_unit?.floor_plan_urls?.[0] ?? documents.find((d) => d.type === "floor_plan")?.url;

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
      brochure?.url ? `Brochure: ${brochure.url}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    try {
      await navigator.clipboard.writeText(pitch);
      toast.success("Pitch copied to clipboard");
    } catch {
      toast.error("Could not copy the pitch");
    }
    const phone = (clientPhone ?? "").replace(/[^\d]/g, "");
    window.open(phone ? `https://wa.me/${phone}` : "https://wa.me/", "_blank", "noopener");
  }

  async function saveToShortlist() {
    if (!unit) return;
    const { error: insertError } = await supabase.from("shortlists").insert({
      client_id: clientId,
      project_id: unit.project_id,
      unit_id: unit.unit_id,
      score: unit.score ?? null,
      reason: `AI match ${Math.round(unit.score ?? 0)}%`,
      status: "saved",
    });
    if (insertError) toast.error(insertError.message);
    else toast.success("Saved to shortlist");
  }

  return (
    <Sheet open={!!unit} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
        <SheetHeader>
          <SheetTitle className="font-display text-xl">
            {unit?.project_name ?? "Property pack"}
          </SheetTitle>
          <p className="text-sm text-muted-foreground">
            {unit?.developer} · {unit?.district}
          </p>
        </SheetHeader>

        <div className="space-y-7 px-4 pb-10">
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

          <div className="grid grid-cols-2 gap-2">
            <Button onClick={() => brochure?.url && window.open(brochure.url, "_blank", "noopener")} disabled={!brochure?.url}>
              <BookOpen className="size-4" /> Open Brochure
            </Button>
            <Button
              variant="outline"
              onClick={() => floorPlan && window.open(floorPlan, "_blank", "noopener")}
              disabled={!floorPlan}
            >
              <FileText className="size-4" /> View Floorplan
            </Button>
            <Button variant="outline" onClick={copyPitch}>
              <MessageCircle className="size-4" /> Copy Pitch & WhatsApp
            </Button>
            <Button variant="outline" onClick={saveToShortlist}>
              <Star className="size-4" /> Save to shortlist
            </Button>
          </div>

          {photos.length ? (
            <Section title="Photos">
              <div className="grid grid-cols-3 gap-2">
                {photos.slice(0, 9).map((url) => (
                  <img
                    key={url}
                    src={url}
                    alt=""
                    loading="lazy"
                    className="h-24 w-full rounded-lg object-cover"
                  />
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

          {documents.length ? (
            <Section title="Documents">
              <ul className="space-y-2">
                {documents.map((doc, i) => (
                  <li key={`${doc.url}-${i}`}>
                    <a
                      href={doc.url ?? "#"}
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
                    className="flex items-center justify-between rounded-lg border border-border bg-secondary/40 px-3 py-2 text-sm"
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

          {data?.project?.overview ? (
            <Section title="Overview">
              <p className="text-sm leading-relaxed text-muted-foreground">
                {String(data.project.overview)}
              </p>
            </Section>
          ) : null}
        </div>
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
