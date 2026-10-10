import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ProjectGallery, ProjectImage } from "@/components/app/ProjectGallery";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  ArrowLeft, Bath, BedDouble, BookOpen, Building2, Calendar,
  CheckCircle2, Download, Eye, FileText, Maximize, MessageSquare,
  Ruler, Share2, ShieldCheck, type LucideIcon,
} from "lucide-react";
import { projectDetailOptions } from "@/lib/inventory.functions";
import { mediaUrl, projectGalleryImages } from "@/lib/media";
import { aed, quarterOf } from "@/lib/format";

const toMedia = (u?: string | null): string | null => {
  if (!u) return null;
  try { if (typeof mediaUrl === "function") return mediaUrl(u); } catch {}
  if (u.startsWith("/media/")) return `https://reelly-backend.s3.amazonaws.com/${u.slice("/media/".length)}`;
  return u;
};

export const Route = createFileRoute("/_authenticated/app/project/$id")({
  loader: async ({ context, params }) => {
    const detail = await context.queryClient.ensureQueryData(projectDetailOptions(Number(params.id)));
    if (!detail) throw notFound();
    return detail;
  },
  errorComponent: ({ error }) => (
    <div className="flex h-96 flex-col items-center justify-center gap-4 text-center p-6">
      <Building2 className="size-10 text-muted-foreground" />
      <h2 className="text-xl font-bold">Unable to load project</h2>
      <p className="text-sm text-muted-foreground max-w-md">{error instanceof Error ? error.message : "Please try again."}</p>
      <Button variant="outline" onClick={() => window.location.reload()}>Retry</Button>
    </div>
  ),
  notFoundComponent: () => (
    <div className="flex h-96 flex-col items-center justify-center gap-4 text-center p-6">
      <Building2 className="size-12 text-muted-foreground" />
      <h2 className="text-xl font-bold">Project Not Found</h2>
    </div>
  ),
  head: ({ loaderData }) => ({ meta: [
    { title: `${loaderData?.project.name ?? "Project"} — DealOS` },
  ] }),
  component: Page,
});

/* ─── helpers ─── */
const bedLabel = (n: number) => n === 0 ? "Studio" : `${n} BR`;

function Page() {
  const { data } = useSuspenseQuery(projectDetailOptions(Number(Route.useParams().id)));
  const [bedFilter, setBedFilter] = useState<string>("all");
  const [lightbox, setLightbox] = useState<{ plan: string | null; unit: typeof data.units[0] } | null>(null);
  const [eoiOpen, setEoiOpen] = useState(false);
  const [buyerName, setBuyerName] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");

  if (!data) return null;
  const p = data.project;
  const startPrice = data.units.find((u) => u.price_aed != null)?.price_aed ?? null;
  const location = [p.district, p.emirate_or_country].filter(Boolean).join(", ") || "Dubai";
  const docs = data.documents ?? [];
  const gallery = projectGalleryImages(p.media, p.cover_image_url, docs);
  const brochure = docs.find((d) => (d.type ?? "").toLowerCase() === "brochure");
  const floorDoc = docs.find((d) => ["floorplan", "floor_plan"].includes((d.type ?? "").toLowerCase()));

  // Payment plan
  const realPlan = data.payment_plans?.[0] ?? null;
  const planTotal = realPlan ? realPlan.steps.reduce((t, st) => t + st.percent, 0) || 100 : 100;
  const planSteps = realPlan
    ? realPlan.steps.map((st) => ({ label: st.name, pct: Math.round((st.percent / planTotal) * 100) }))
    : [{ label: "Booking", pct: 10 }, { label: "Construction", pct: 20 }, { label: "Handover", pct: 70 }];

  // Units by bedroom
  const studioUnits = data.units.filter((u) => u.bedrooms === 0);
  const oneBR = data.units.filter((u) => u.bedrooms === 1);
  const twoBR = data.units.filter((u) => u.bedrooms === 2);
  const threePlus = data.units.filter((u) => (u.bedrooms ?? 0) >= 3);
  const filtered = bedFilter === "all" ? data.units
    : bedFilter === "0" ? studioUnits
    : bedFilter === "1" ? oneBR
    : bedFilter === "2" ? twoBR : threePlus;

  // Amenities
  const amenities = [...new Set((p.amenities ?? []).map((a) => (a ?? "").trim()).filter(Boolean))];

  // Progress
  const progress = Number(p.build_progress_pct ?? 0);

  const whatsapp = (unitPrice?: number | null) => {
    const price = unitPrice ?? startPrice;
    const text = `*${p.name}* — ${location}\n${p.developer_name ?? "Developer"}\n${price ? aed(price) : "Price on request"} · ${quarterOf(p.handover_date)}\n${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* ═══ BACK NAV ═══ */}
      <div className="border-b border-border/60 bg-card/80 backdrop-blur sticky top-0 z-30">
        <div className="mx-auto max-w-7xl flex items-center gap-3 px-4 py-2.5 sm:px-8">
          <Link to="/app/offplan" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="size-3.5" /> Back to Projects
          </Link>
          <span className="text-border">|</span>
          <span className="text-xs font-medium text-foreground truncate">{p.name}</span>
          <div className="ml-auto flex items-center gap-2">
            <button onClick={() => whatsapp()} className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-secondary transition-colors">
              <Share2 className="size-3" /> Share
            </button>
          </div>
        </div>
      </div>

      {/* ═══ HERO GALLERY ═══ */}
      <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-8">
        <div className="overflow-hidden rounded-2xl border border-border">
          <ProjectGallery key={p.id} photos={gallery} title={p.name} />
        </div>
      </div>

      {/* ═══ MAIN LAYOUT: LEFT + RIGHT SIDEBAR ═══ */}
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-8 grid grid-cols-1 gap-8 lg:grid-cols-12">

        {/* ─── LEFT COLUMN ─── */}
        <div className="min-w-0 space-y-6 lg:col-span-8">

          {/* Project Header */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              {p.sale_status && (
                <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400 capitalize">
                  {p.sale_status.replace(/_/g, " ")}
                </span>
              )}
              <span className="rounded-full bg-primary/10 border border-primary/30 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
                Freehold
              </span>
            </div>
            <h1 className="text-2xl font-bold sm:text-3xl text-foreground">{p.name}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {location} · by <span className="font-medium text-foreground">{p.developer_name ?? "Developer"}</span>
            </p>
          </div>

          {/* Key Stats Row */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard icon={BedDouble} label="Units" value={`${data.units.length}`} sub={`${data.available_units} available`} />
            <StatCard icon={Calendar} label="Handover" value={quarterOf(p.handover_date)} sub={progress > 0 ? `${Math.round(progress)}% built` : undefined} />
            <StatCard icon={Ruler} label="From" value={startPrice ? aed(startPrice) : "TBC"} sub={startPrice && data.units[0]?.size_sqft ? `${Math.round(startPrice / data.units[0].size_sqft).toLocaleString()} /sqft` : undefined} />
            <StatCard icon={ShieldCheck} label="Escrow" value="DLD Protected" sub="RERA Verified" />
          </div>

          {/* Payment Plan — simple horizontal bar */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="text-sm font-semibold text-foreground mb-4">Payment Plan</h2>
            <div className="flex rounded-lg overflow-hidden h-8 bg-secondary border border-border">
              {planSteps.map((s, i) => (
                <div
                  key={i}
                  className="flex items-center justify-center text-[11px] font-bold transition-all"
                  style={{
                    width: `${s.pct}%`,
                    background: i === 0 ? "var(--color-primary)" : i === planSteps.length - 1 ? "hsl(var(--muted))" : "hsl(var(--accent))",
                    color: i === 0 ? "var(--color-primary-foreground)" : "var(--color-foreground)",
                  }}
                >
                  {s.pct}%
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-[11px] text-muted-foreground">
              {planSteps.map((s, i) => (
                <span key={i} className={i === 0 ? "font-medium text-primary" : ""}>{s.label}</span>
              ))}
            </div>
          </div>

          {/* Overview — max 3 lines, no walls */}
          {p.overview && (
            <div className="rounded-xl border border-border bg-card p-5">
              <h2 className="text-sm font-semibold text-foreground mb-2">About</h2>
              <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3">
                {p.overview}
              </p>
            </div>
          )}

          {/* Amenities — compact pills */}
          {amenities.length > 0 && (
            <div className="rounded-xl border border-border bg-card p-5">
              <h2 className="text-sm font-semibold text-foreground mb-3">Amenities</h2>
              <div className="flex flex-wrap gap-2">
                {amenities.slice(0, 12).map((a) => (
                  <span key={a} className="rounded-full border border-border bg-secondary/60 px-3 py-1.5 text-xs text-foreground">
                    {a}
                  </span>
                ))}
                {amenities.length > 12 && (
                  <span className="rounded-full border border-border bg-secondary/60 px-3 py-1.5 text-xs text-muted-foreground">
                    +{amenities.length - 12} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* ═══ UNITS TABLE ═══ */}
          <div className="rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between gap-4 p-5 border-b border-border">
              <h2 className="text-sm font-semibold text-foreground">
                Available Units <span className="font-normal text-muted-foreground">({data.units.length})</span>
              </h2>
              <div className="flex gap-1 rounded-lg bg-secondary/80 p-0.5 border border-border">
                {[
                  { id: "all", label: "All" },
                  ...(studioUnits.length ? [{ id: "0", label: "Studio" }] : []),
                  ...(oneBR.length ? [{ id: "1", label: "1 BR" }] : []),
                  ...(twoBR.length ? [{ id: "2", label: "2 BR" }] : []),
                  ...(threePlus.length ? [{ id: "3", label: "3+" }] : []),
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setBedFilter(tab.id)}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                      bedFilter === tab.id
                        ? "bg-card text-foreground shadow-sm border border-border"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="divide-y divide-border">
              {filtered.slice(0, 25).map((unit) => {
                const plan = unit.floor_plan_urls?.[0] ? toMedia(unit.floor_plan_urls[0]) : null;
                return (
                  <div key={unit.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-secondary/30 transition-colors">
                    {/* Floor plan thumb */}
                    <button
                      onClick={() => setLightbox({ plan, unit })}
                      className="relative size-14 shrink-0 rounded-lg border border-border bg-secondary overflow-hidden hover:border-primary/50 transition-colors"
                    >
                      <ProjectImage src={plan} alt="Floor plan" contain />
                    </button>

                    {/* Unit info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-foreground">{bedLabel(unit.bedrooms ?? 0)}</span>
                        <span className="text-xs text-muted-foreground">
                          {unit.unit_type || "Apartment"}{unit.unit_number ? ` · #${unit.unit_number}` : ""}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground">
                        {unit.size_sqft && <span className="flex items-center gap-1"><Maximize className="size-3" />{Math.round(unit.size_sqft).toLocaleString()} sqft</span>}
                        {unit.floor_label && <span>Floor {unit.floor_label}</span>}
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-foreground">
                        {unit.price_aed ? aed(unit.price_aed) : "On Request"}
                      </p>
                      {unit.price_aed && unit.size_sqft && (
                        <p className="text-[11px] text-muted-foreground">
                          {Math.round(unit.price_aed / unit.size_sqft).toLocaleString()} /sqft
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-1.5 shrink-0">
                      <button
                        onClick={() => whatsapp(unit.price_aed)}
                        className="flex items-center gap-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1.5 text-xs font-medium text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                      >
                        <MessageSquare className="size-3" /> Pitch
                      </button>
                      <button
                        onClick={() => setLightbox({ plan, unit })}
                        className="flex items-center gap-1 rounded-lg border border-border bg-secondary px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-secondary/80 transition-colors"
                      >
                        <Eye className="size-3" /> View
                      </button>
                    </div>
                  </div>
                );
              })}
              {filtered.length === 0 && (
                <div className="py-12 text-center text-sm text-muted-foreground">No units match this filter.</div>
              )}
              {filtered.length > 25 && (
                <div className="py-3 text-center text-xs text-muted-foreground">
                  Showing 25 of {filtered.length} units
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ─── RIGHT SIDEBAR (STICKY) ─── */}
        <aside className="lg:col-span-4">
          <div className="sticky top-14 space-y-4">
            {/* Price Card */}
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Starting from</p>
              <p className="text-3xl font-bold text-foreground mt-1">
                {startPrice != null ? aed(startPrice) : "Price on Request"}
              </p>
              <div className="mt-4 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Available</span>
                  <span className="font-semibold">{data.available_units} units</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment</span>
                  <span className="font-semibold text-primary">{data.payment_plan_summary || `${planSteps[0]?.pct}/${planSteps[planSteps.length - 1]?.pct}`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Handover</span>
                  <span className="font-semibold">{quarterOf(p.handover_date)}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5">
              <Button
                onClick={() => {
                  const target = brochure?.url ? toMedia(brochure.url) : null;
                  if (target) window.open(target, "_blank", "noopener");
                  else toast.info("Brochure is being indexed.");
                }}
                className="w-full h-11 rounded-xl text-sm font-semibold gap-2"
              >
                <Download className="size-4" /> Download Brochure
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  const target = floorDoc?.url ? toMedia(floorDoc.url) : null;
                  if (target) window.open(target, "_blank", "noopener");
                  else toast.info("Floor plans are being indexed.");
                }}
                className="w-full h-11 rounded-xl text-sm font-semibold gap-2"
              >
                <FileText className="size-4" /> Floor Plans
              </Button>

              <Button
                variant="outline"
                onClick={() => whatsapp()}
                className="w-full h-11 rounded-xl text-sm font-semibold gap-2 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10"
              >
                <MessageSquare className="size-4" /> WhatsApp Pitch
              </Button>

              <Button
                onClick={() => setEoiOpen(true)}
                className="w-full h-11 rounded-xl text-sm font-semibold gap-2 bg-amber-500 hover:bg-amber-600 text-black"
              >
                Reserve Unit (EOI)
              </Button>
            </div>

            {/* Trust Badge */}
            <div className="flex items-start gap-2 rounded-xl border border-border bg-secondary/30 p-3 text-xs text-muted-foreground">
              <CheckCircle2 className="size-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>All deposits regulated by Dubai Land Department and RERA.</span>
            </div>

            {/* Developer mini-card */}
            {p.developer_name && (
              <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary text-sm font-bold">
                  {(p.developer_name).split(/\s+/).map((w: string) => w[0]).slice(0, 2).join("").toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{p.developer_name}</p>
                  <p className="text-[11px] text-muted-foreground">Developer</p>
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* ═══ FLOOR PLAN LIGHTBOX ═══ */}
      <Dialog open={lightbox !== null} onOpenChange={(open) => { if (!open) setLightbox(null); }}>
        <DialogContent className="max-h-[92vh] max-w-3xl overflow-y-auto rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              {lightbox?.unit ? `${bedLabel(lightbox.unit.bedrooms ?? 0)} · ${lightbox.unit.unit_type || "Apartment"}` : "Floor Plan"}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              {lightbox?.unit?.unit_number ? `Unit #${lightbox.unit.unit_number}` : "Floor plan preview"}
            </DialogDescription>
          </DialogHeader>

          {lightbox && (
            <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-12">
              <div className="md:col-span-7">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-border bg-secondary">
                  <ProjectImage src={lightbox.plan} alt="Floor plan" contain />
                </div>
              </div>
              <div className="md:col-span-5 space-y-4">
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {lightbox.unit.price_aed ? aed(lightbox.unit.price_aed) : "On Request"}
                  </p>
                </div>
                <div className="divide-y divide-border text-sm">
                  <Row label="Type" value={bedLabel(lightbox.unit.bedrooms ?? 0)} />
                  <Row label="Area" value={lightbox.unit.size_sqft ? `${Math.round(lightbox.unit.size_sqft).toLocaleString()} sqft` : "—"} />
                  <Row label="Floor" value={lightbox.unit.floor_label || "—"} />
                  <Row label="Handover" value={quarterOf(p.handover_date)} />
                  {lightbox.unit.price_aed && lightbox.unit.size_sqft && (
                    <Row label="Price/sqft" value={`${Math.round(lightbox.unit.price_aed / lightbox.unit.size_sqft).toLocaleString()} AED`} />
                  )}
                </div>
                <div className="space-y-2 pt-2">
                  <Button className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => { setLightbox(null); whatsapp(lightbox.unit.price_aed); }}>
                    <MessageSquare className="size-4" /> Pitch to Client
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => { setLightbox(null); setEoiOpen(true); }}>
                    Reserve This Unit
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ═══ EOI MODAL ═══ */}
      <Dialog open={eoiOpen} onOpenChange={setEoiOpen}>
        <DialogContent className="max-w-md rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle>Reserve Unit (EOI)</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Expression of Interest for {p.name}
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              toast.success(`EOI registered for ${buyerName || "Investor"}`);
              setEoiOpen(false);
            }}
            className="mt-4 space-y-4"
          >
            <div>
              <label className="text-xs font-medium text-muted-foreground">Buyer Name</label>
              <input required value={buyerName} onChange={(e) => setBuyerName(e.target.value)} placeholder="Full name"
                className="mt-1 h-10 w-full rounded-lg border border-border bg-secondary px-3 text-sm focus:border-primary focus:outline-none" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Phone / WhatsApp</label>
              <input required value={buyerPhone} onChange={(e) => setBuyerPhone(e.target.value)} placeholder="+971 50 123 4567"
                className="mt-1 h-10 w-full rounded-lg border border-border bg-secondary px-3 text-sm focus:border-primary focus:outline-none" />
            </div>
            <div className="rounded-lg border border-border bg-secondary/50 p-3 text-xs flex justify-between">
              <span>10% Booking Deposit</span>
              <span className="font-bold text-primary">{startPrice ? aed(Math.round(startPrice * 0.1)) : "TBC"}</span>
            </div>
            <Button type="submit" className="w-full">Confirm Reservation</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ─── Small reusable components ─── */

function StatCard({ icon: Icon, label, value, sub }: { icon: LucideIcon; label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-2 text-muted-foreground mb-2">
        <Icon className="size-4" />
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className="text-lg font-bold text-foreground">{value}</p>
      {sub && <p className="text-[11px] text-muted-foreground mt-0.5">{sub}</p>}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="py-2.5 flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}
