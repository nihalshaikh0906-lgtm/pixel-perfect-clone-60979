import { createFileRoute, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import floorplan from "@/assets/floorplan-placeholder.jpg";
import { UnitCard, type MatchRow } from "@/components/UnitCard";
import { PropertyPackDrawer } from "@/components/PropertyPackDrawer";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Baby, BellRing, BookOpen, Building2, Car, Download, Dumbbell, Eye, FileText, Film, Footprints, Map as MapIcon, PawPrint, ShieldCheck, ShoppingBag, Sparkles, Trees, Trophy, Umbrella, Utensils, Waves, Wifi, type LucideIcon } from "lucide-react";
import { projectDetailOptions } from "@/lib/inventory.functions";
import { mediaUrl, projectGalleryImages } from "@/lib/media";
import { aed, quarterOf } from "@/lib/format";
import { workspaceHead } from "@/components/app/WorkspacePlaceholder";

export const Route = createFileRoute("/_authenticated/app/project/$id")({
  loader: async ({ context, params }) => {
    const detail = await context.queryClient.ensureQueryData(projectDetailOptions(Number(params.id)));
    if (!detail) throw notFound();
    return detail;
  },
  errorComponent: ({ error }) => <div role="alert">Unable to load project: {error instanceof Error ? error.message : "Please try again."}</div>,
  notFoundComponent: () => <div>Project not found.</div>,
  head: ({ loaderData }) => ({ meta: [
    { title: `${loaderData?.project.name ?? "Project"} — DealOS Workspace` },
    { name: "description", content: "Project inventory in your DealOS broker workspace." },
    { property: "og:title", content: `${loaderData?.project.name ?? "Project"} — DealOS Workspace` },
    { property: "og:description", content: "Project inventory in your DealOS broker workspace." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
    ...(loaderData?.project.cover_image_url?.startsWith("https://") ? [
      { property: "og:image", content: loaderData.project.cover_image_url },
      { name: "twitter:image", content: loaderData.project.cover_image_url },
    ] : []),
  ] }),
  component: Page,
});

type UnitRow = MatchRow & { unit_number: string | null; floor?: string | null; plan?: string | null };

// Amenity labels are free text from the developer pack, so the icon is matched on keywords.
const AMENITY_ICONS: Array<{ keys: string[]; icon: LucideIcon }> = [
  { keys: ["pool", "jacuzzi", "lagoon", "aqua", "splash", "water"], icon: Waves },
  { keys: ["gym", "fitness", "crossfit", "strength", "pilates", "yoga", "training"], icon: Dumbbell },
  { keys: ["spa", "sauna", "steam", "massage", "therapy", "wellness", "cryo", "hyperbaric", "salon"], icon: Sparkles },
  { keys: ["parking", "garage", "valet"], icon: Car },
  { keys: ["security", "cctv", "surveillance", "guard"], icon: ShieldCheck },
  { keys: ["beach", "cabana", "sunbed", "marina", "boardwalk"], icon: Umbrella },
  { keys: ["pet", "paw", "dog"], icon: PawPrint },
  { keys: ["kid", "child", "playroom", "playground", "creche", "nursery", "teen"], icon: Baby },
  { keys: ["concierge", "reception", "lobby", "room service"], icon: BellRing },
  { keys: ["garden", "park", "green", "landscap", "courtyard", "tree", "bonsai", "picnic"], icon: Trees },
  { keys: ["wifi", "smart", "automat"], icon: Wifi },
  { keys: ["track", "jogging", "walking", "cycle", "cycling", "bike"], icon: Footprints },
  { keys: ["padel", "squash", "tennis", "basketball", "bowling", "games", "court", "sport", "golf", "pickleball"], icon: Trophy },
  { keys: ["cinema", "theatre", "theater", "screen"], icon: Film },
  { keys: ["co-working", "coworking", "working", "business", "boardroom", "meeting", "office", "studies", "clubhouse", "club house", "multipurpose", "function hall", "event space"], icon: Building2 },
  { keys: ["library", "reading", "study"], icon: BookOpen },
  { keys: ["retail", "shop", "boutique", "supermarket", "f&b"], icon: ShoppingBag },
  { keys: ["bbq", "dining", "restaurant", "cafe", "lounge", "bar", "kitchen"], icon: Utensils },
];

const amenityIcon = (name: string): LucideIcon => {
  const text = name.toLowerCase();
  return AMENITY_ICONS.find((rule) => rule.keys.some((key) => text.includes(key)))?.icon ?? Sparkles;
};

function DocLink({ label, url, icon: Icon }: { label: string; url: string | null; icon: LucideIcon }) {
  const className = "a-btn a-btn-line disabled:opacity-55 disabled:pointer-events-none";
  const inner = <><Icon className="size-4" style={{ color: "var(--brand-blue)" }} /><span>{label}</span>{url ? <Download className="size-4" /> : null}</>;
  return url
    ? <a href={url} target="_blank" rel="noopener noreferrer" className={className}>{inner}</a>
    : <button type="button" className={className} disabled title={`${label} is not attached to this project yet`}>{inner}</button>;
}

function ProjectImage({ src, alt, lazy = false }: { src: string | null; alt: string; lazy?: boolean }) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  return src && failedSrc !== src
    ? <img src={src} alt={alt} loading={lazy ? "lazy" : "eager"} onError={() => setFailedSrc(src)} className="absolute inset-0 size-full object-cover" />
    : <div role="img" aria-label={`${alt} — image unavailable`} className="absolute inset-0 flex items-center justify-center bg-secondary text-muted-foreground"><Building2 className="size-10 opacity-40" strokeWidth={1} /></div>;
}

function DocCard({ label, url, icon: Icon }: { label: string; url: string | null; icon: LucideIcon }) {
  const inner = <>
    <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-secondary"><Icon className="size-5" style={{ color: "var(--brand-blue)" }} /></span>
    <span className="min-w-0 flex-1"><span className="block font-semibold" style={{ color: "var(--a-ink)" }}>{label}</span><span className="block text-xs" style={{ color: "var(--a-ink-2)" }}>{url ? "Open document" : "Not attached yet"}</span></span>
    {url ? <Download className="size-4" style={{ color: "var(--a-ink-2)" }} /> : null}
  </>;
  const cls = "flex items-center gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow";
  return url ? <a href={url} target="_blank" rel="noopener noreferrer" className={`${cls} hover:shadow-md`}>{inner}</a> : <div className={`${cls} opacity-60`} aria-disabled="true">{inner}</div>;
}

function Page() {
  const { data } = useSuspenseQuery(projectDetailOptions(Number(Route.useParams().id)));
  const [selected, setSelected] = useState<MatchRow | null>(null);
  const [unitModal, setUnitModal] = useState<UnitRow | null>(null);
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  useEffect(() => {
    if (data?.project) console.log("Fetched Project Data:", data.project);
  }, [data?.project]);
  if (!data) return null;
  const project = data.project;
  const startingPrice = data.units.find((u) => u.price_aed != null)?.price_aed ?? null;
  const location = [project.district, project.emirate_or_country].filter(Boolean).join(", ") || "—";
  const galleryImages = projectGalleryImages(project.media, project.cover_image_url);
  const facts = [
    { label: "Location", value: location },
    { label: "Starting Price", value: startingPrice != null ? aed(startingPrice) : "Price on request" },
    { label: "Available Units", value: `${data.available_units.toLocaleString("en-US")}` },
    { label: "Payment Plan", value: data.payment_plan_summary ?? "On request" },
    { label: "Developer", value: project.developer_name ?? "—" },
    { label: "Handover", value: quarterOf(project.handover_date) },
  ];
  const unitTypes = [...new Set(data.units.map((u) => u.unit_type).filter((t): t is string => Boolean(t)))];
  const amenities = [...new Set((project.amenities ?? []).map((a) => (a ?? "").trim()).filter(Boolean))];
  const visibleAmenities = showAllAmenities ? amenities : amenities.slice(0, 9);
  const documents = data.documents ?? [];
  const floorPlanDoc = documents.find((d) => (d.type ?? "").includes("floor")) ?? null;
  const brochureDoc = documents.find((d) => (d.type ?? "").includes("brochure")) ?? null;
  const details = [
    { label: "Project Name", value: project.name },
    { label: "Developer", value: project.developer_name ?? "—" },
    { label: "Property Class", value: "—" },
    { label: "Unit Types", value: unitTypes.length ? unitTypes.slice(0, 3).join(" · ") : "—" },
    { label: "Construction Status", value: project.build_progress_pct != null ? `${Math.round(Number(project.build_progress_pct))}% built` : (project.sale_status ?? "—").replace(/_/g, " ") },
    { label: "Handover Quarter", value: quarterOf(project.handover_date) || "—" },
    { label: "Furnishing", value: project.furnishing ?? "—" },
  ];
  type ProjectUnit = (typeof data.units)[number];
  type BedGroup = { key: string; label: string; units: ProjectUnit[] };
  const bedGroups: BedGroup[] = [...data.units.reduce((map: Map<string, BedGroup>, unit: ProjectUnit) => {
    const key = unit.bedrooms != null ? `${unit.bedrooms}` : "other";
    const label = unit.bedrooms != null ? (unit.bedrooms === 0 ? "Studio" : `${unit.bedrooms} Bedroom${unit.bedrooms === 1 ? "" : "s"}`) : "Other";
    const entry = map.get(key) ?? { key, label, units: [] as ProjectUnit[] };
    entry.units.push(unit);
    return map.set(key, entry);
  }, new Map<string, BedGroup>()).values()].sort((a: BedGroup, b: BedGroup) => a.key.localeCompare(b.key, undefined, { numeric: true }));
  const toRow = (unit: ProjectUnit): UnitRow => ({ unit_id: unit.id, project_id: project.id, project_name: `${project.name}${unit.unit_number ? ` · ${unit.unit_number}` : ""}`, developer: project.developer_name, district: project.district, price_aed: unit.price_aed, bedrooms: unit.bedrooms, size_sqft: unit.size_sqft, handover_date: project.handover_date, cover_image_url: project.cover_image_url, score: null, unit_number: unit.unit_number ?? null, floor: unit.floor_label ?? null, plan: unit.floor_plan_urls?.[0] ? mediaUrl(unit.floor_plan_urls[0]) : null });
  const card = "rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8";
  const cover = project.cover_image_url ? mediaUrl(project.cover_image_url) : null;
  const keyDetails = [
    ...details.filter((d) => d.label !== "Developer").map((d) => d.label === "Handover Quarter" ? { ...d, label: "Handover Date" } : d),
    { label: "Service Charge", value: project.service_charge ?? "—" },
    { label: "Location", value: location },
  ];
  const realPlan = data.payment_plans?.[0] ?? null;
  const planTotal = realPlan ? realPlan.steps.reduce((t, st) => t + st.percent, 0) || 100 : 100;
  const plan = realPlan
    ? realPlan.steps.map((st, i, all) => ({ label: st.name, pct: Math.round((st.percent / planTotal) * 1000) / 10, o: 1 - (i / Math.max(1, all.length)) * 0.75 }))
    : [];
  return <section className="w-full">
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 bg-secondary/40 p-4 sm:p-8 lg:grid-cols-12">
      <div className="min-w-0 space-y-8 lg:col-span-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:grid-rows-2">
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-border shadow-sm sm:col-span-2 sm:row-span-2 sm:aspect-auto sm:min-h-[420px]">
            <ProjectImage src={cover} alt={project.name} />
          </div>
          {[0, 1].map((i) => (
            <div key={i} className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-border shadow-sm sm:aspect-auto">
              <ProjectImage src={galleryImages[i] ?? null} alt={`${project.name} gallery ${i + 1}`} lazy />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <DocCard label="PDF Floor Plan" url={floorPlanDoc?.url ?? null} icon={FileText} />
          <DocCard label="PDF Brochure" url={brochureDoc?.url ?? null} icon={BookOpen} />
        </div>

        <div className={`${card} flex items-center gap-5`}>
          <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl border border-border bg-secondary text-xl font-semibold" style={{ color: "var(--brand-blue)" }}>
            {(project.developer_name ?? "D").split(/\s+/).map((w: string) => w[0]).slice(0, 2).join("").toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="eyebrow-a">Developer</p>
            <p className="truncate text-lg font-semibold" style={{ color: "var(--a-ink)" }}>{project.developer_name ?? "—"}</p>
            <p className="text-sm" style={{ color: "var(--a-ink-2)" }}>Office hours: not listed — contact the developer sales office</p>
          </div>
        </div>

        <div className={card}>
          <p className="eyebrow-a">Key Details</p>
          <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
            {keyDetails.map((item) => (
              <div key={item.label} className="min-w-0 rounded-xl border border-border bg-secondary/60 p-4">
                <p className="text-xs uppercase tracking-wide" style={{ color: "var(--a-ink-2)" }}>{item.label}</p>
                <p className="mt-1 truncate text-sm font-semibold" style={{ color: "var(--a-ink)" }} title={String(item.value)}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className={card}>
          <div className="flex items-baseline justify-between gap-3"><p className="eyebrow-a">Payment Plan</p><span className="a-note">{realPlan?.name ?? ""}{realPlan?.post_handover ? " · Post-handover" : ""}</span></div>
          {plan.length ? <><div className="mt-5 flex h-4 w-full overflow-hidden rounded-full border border-border">
            {plan.map((s) => <div key={s.label} style={{ width: `${s.pct}%`, background: "var(--brand-blue)", opacity: s.o }} />)}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {plan.map((s, i) => (
              <div key={s.label} className="min-w-0 border-l-2 pl-3" style={{ borderColor: "var(--brand-blue)" }}>
                <p className="text-xs" style={{ color: "var(--a-ink-2)" }}>Milestone {i + 1}</p>
                <p className="num text-2xl font-semibold" style={{ color: "var(--a-ink)" }}>{s.pct}%</p>
                <p className="text-xs" style={{ color: "var(--a-ink-2)" }}>{s.label}</p>
              </div>
            ))}
          </div>
          </> : <p className="a-note mt-3">No payment plan is recorded for this project yet.</p>}
          {(data.payment_plans?.length ?? 0) > 1 ? <p className="a-note mt-4">{data.payment_plans.length} plans available — showing {realPlan?.name}.</p> : null}
        </div>

        <div className={card}>
          <p className="eyebrow-a">Features &amp; Amenities</p>
          {amenities.length ? (
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {amenities.slice(0, 9).map((item) => {
                const Icon = amenityIcon(item);
                return <div key={item} className="flex aspect-square flex-col items-center justify-center gap-3 rounded-xl border border-border bg-secondary p-4 shadow-sm">
                  <Icon className="size-7" style={{ color: "var(--brand-blue)" }} strokeWidth={1.5} />
                  <p className="line-clamp-3 text-center text-sm font-semibold" style={{ color: "var(--a-ink)" }}>{item}</p>
                </div>;
              })}
            </div>
          ) : <p className="a-note mt-2">Amenities are listed here once the developer pack is indexed.</p>}
          {amenities.length > 9 ? <p className="a-note mt-3">+{amenities.length - 9} more: {amenities.slice(9).join(" · ")}</p> : null}
        </div>

        <div className={card}>
          <p className="eyebrow-a">Units Available</p>
          {bedGroups.length ? (
            <Accordion type="multiple" defaultValue={bedGroups.slice(0, 1).map((g) => g.key)} className="mt-2">
              {bedGroups.map((group) => (
                <AccordionItem key={group.key} value={group.key}>
                  <AccordionTrigger>
                    <span className="text-base font-semibold" style={{ color: "var(--a-ink)" }}>{group.label} <span className="font-normal" style={{ color: "var(--a-ink-2)" }}>— {group.units.length} Unit{group.units.length === 1 ? "" : "s"}</span></span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="overflow-x-auto">
                      <table className="a-table w-full text-sm">
                        <thead><tr>{["Plan", "Type", "Area", "Price", ""].map((h) => <th key={h} className="px-3 py-2 text-left text-xs uppercase tracking-wide" style={{ color: "var(--a-ink-2)" }}>{h}</th>)}</tr></thead>
                        <tbody>
                          {group.units.map((unit) => (
                            <tr key={unit.id} className="cursor-pointer border-t border-border" onClick={() => setUnitModal(toRow(unit))}>
                              <td className="px-3 py-2"><div className="size-12 overflow-hidden rounded-lg border border-border bg-secondary"><img src={unit.floor_plan_urls?.[0] ? mediaUrl(unit.floor_plan_urls[0]) : floorplan} alt="" loading="lazy" className="size-full object-cover" /></div></td>
                              <td className="px-3 py-2">{unit.unit_type ?? "—"}{unit.unit_number ? <span className="block text-xs" style={{ color: "var(--a-ink-2)" }}>{unit.unit_number}</span> : null}</td>
                              <td className="px-3 py-2 num">{unit.size_sqft != null ? `${unit.size_sqft.toLocaleString("en-US")} sqft` : "—"}</td>
                              <td className="px-3 py-2 num font-semibold" style={{ color: "var(--a-ink)" }}>{unit.price_aed != null ? aed(unit.price_aed) : "On request"}</td>
                              <td className="px-3 py-2 text-right">
                                <button type="button" aria-label="View unit" className="a-btn a-btn-line inline-flex size-9 items-center justify-center rounded-lg" onClick={(e) => { e.stopPropagation(); setUnitModal(toRow(unit)); }}><Eye className="size-4" /></button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : <p className="a-note mt-2">No units are recorded for this project.</p>}
        </div>
      </div>

      <aside className="lg:col-span-4">
        <div className="sticky top-8 space-y-6">
          <div className={`${card} space-y-5`}>
            <div>
              <p className="eyebrow-a">Project</p>
              <h1 className="text-2xl font-semibold" style={{ color: "var(--a-ink)" }}>{project.name}</h1>
              <p className="mt-1 text-sm" style={{ color: "var(--a-ink-2)" }}>{location}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide" style={{ color: "var(--a-ink-2)" }}>Starting from</p>
              <p className="num text-4xl font-semibold leading-tight" style={{ color: "var(--a-ink)" }}>{startingPrice != null ? aed(startingPrice) : "On request"}</p>
            </div>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between gap-3 border-b border-border pb-3"><dt style={{ color: "var(--a-ink-2)" }}>Units in sale</dt><dd className="num font-semibold">{data.available_units.toLocaleString("en-US")}</dd></div>
              <div className="flex items-center justify-between gap-3 border-b border-border pb-3"><dt style={{ color: "var(--a-ink-2)" }}>Payment plan</dt><dd><span className="a-chip">{data.payment_plan_summary ?? "On request"}</span></dd></div>
              <div className="flex justify-between gap-3"><dt style={{ color: "var(--a-ink-2)" }}>Developer</dt><dd className="truncate font-semibold">{project.developer_name ?? "—"}</dd></div>
            </dl>
          </div>
          <Button type="button" className="h-14 w-full rounded-xl text-base font-semibold text-primary-foreground shadow-sm" style={{ background: "var(--brand-blue)" }} onClick={() => toast("Sales offer generation is coming soon")}>Generate Sales Offer</Button>
          <Button type="button" className="h-14 w-full rounded-xl bg-foreground text-base font-semibold text-background shadow-sm hover:bg-foreground/90" onClick={() => toast("Resale publishing is coming soon")}>Publish Resale Unit</Button>
        </div>
      </aside>
    </div>
    <Dialog open={unitModal !== null} onOpenChange={(open) => { if (!open) setUnitModal(null); }}>
      <DialogContent className="a-unit-modal max-h-[90vh] max-w-[min(1060px,94vw)] gap-0 overflow-y-auto rounded-2xl p-5 sm:p-6">
        <DialogHeader className="sr-only">
          <DialogTitle>{unitModal ? `${unitModal.project_name} — floor plan and price` : "Unit floor plan"}</DialogTitle>
          <DialogDescription>Floor plan, price and key details for this unit.</DialogDescription>
        </DialogHeader>
        {unitModal ? <div className="dapp a-dialog-scope">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-[6fr_4fr]">
            <div className="min-w-0 space-y-3">
              <p className="eyebrow-a">Floor Plan</p>
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-border bg-secondary shadow-sm">
                <img src={unitModal.plan ?? floorplan} alt={`Floor plan for ${unitModal.project_name}`} loading="lazy" width={1280} height={960} className="size-full object-cover" />
              </div>
              <p className="a-note">{unitModal.plan ? "Developer floor plan." : "Illustrative floor plan — no plan is attached to this unit yet."}</p>
            </div>
            <div className="flex min-w-0 flex-col gap-4">
              <div className="min-w-0">
                <p className="eyebrow-a">{unitModal.developer ?? unitModal.district ?? "Unit"}</p>
                <p className="num mt-1 text-3xl font-semibold sm:text-4xl" style={{ color: "var(--a-ink)" }}>{unitModal.price_aed != null ? aed(unitModal.price_aed) : "Price on request"}</p>
                <span className="a-chip c-ok mt-2">Available</span>
              </div>
              <dl className="a-kv">
                <dt>Bedrooms</dt><dd>{unitModal.bedrooms != null ? (unitModal.bedrooms === 0 ? "Studio" : `${unitModal.bedrooms} BR`) : "—"}</dd>
                <dt>Area</dt><dd className="num">{unitModal.size_sqft != null ? `${unitModal.size_sqft.toLocaleString("en-US")} sqft` : "—"}</dd>
                <dt>Floor</dt><dd>{unitModal.floor ?? "—"}</dd>
                <dt>Unit Number</dt><dd>{unitModal.unit_number ?? "—"}</dd>
              </dl>
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-amber-900">
                <p className="text-xs font-semibold uppercase tracking-wide">Please note</p>
                <p className="mt-1 text-xs leading-relaxed">Price, availability and payment terms are indicative and can change without notice. Service charges and transfer fees are not included. Confirm the final figures with the developer before signing.</p>
              </div>
              <Button type="button" className="a-btn a-btn-gold mt-auto w-full" onClick={() => { toast.success(`${unitModal.project_name} added to your presentation`); setUnitModal(null); }}>Add to presentation</Button>
            </div>
          </div>
        </div> : null}
      </DialogContent>
    </Dialog>
  </section>;
}
