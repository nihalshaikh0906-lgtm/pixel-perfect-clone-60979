import { createFileRoute, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import galleryA from "@/assets/project-gallery-1.jpg";
import galleryB from "@/assets/project-gallery-2.jpg";
import floorplan from "@/assets/floorplan-placeholder.jpg";
import { UnitCard, type MatchRow } from "@/components/UnitCard";
import { PropertyPackDrawer } from "@/components/PropertyPackDrawer";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Eye } from "lucide-react";
import { projectDetailOptions } from "@/lib/inventory.functions";
import { mediaUrl } from "@/lib/media";
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
  ] }),
  component: Page,
});

type UnitRow = MatchRow & { unit_number: string | null };

function Page() {
  const { data } = useSuspenseQuery(projectDetailOptions(Number(Route.useParams().id)));
  const [selected, setSelected] = useState<MatchRow | null>(null);
  const [pickedImage, setPickedImage] = useState<string | null>(null);
  const [unitModal, setUnitModal] = useState<UnitRow | null>(null);
  if (!data) return null;
  const project = data.project;
  const startingPrice = data.units.find((u) => u.price_aed != null)?.price_aed ?? null;
  const facts = [
    { label: "Location", value: project.district ?? "—" },
    { label: "Starting Price", value: startingPrice != null ? aed(startingPrice) : "Price on request" },
    { label: "Available Units", value: `${data.available_units.toLocaleString("en-US")}` },
    { label: "Payment Plan", value: data.payment_plan_summary ?? "On request" },
    { label: "Developer", value: project.developer_name ?? "—" },
    { label: "Handover", value: quarterOf(project.handover_date) },
  ];
  const unitTypes = [...new Set(data.units.map((u) => u.unit_type).filter((t): t is string => Boolean(t)))];
  const mainImage = pickedImage ?? (project.cover_image_url ? mediaUrl(project.cover_image_url) : galleryA);
  const details = [
    { label: "Project Name", value: project.name },
    { label: "Developer", value: project.developer_name ?? "—" },
    { label: "Property Class", value: "—" },
    { label: "Unit Types", value: unitTypes.length ? unitTypes.slice(0, 3).join(" · ") : "—" },
    { label: "Construction Status", value: "—" },
    { label: "Handover Quarter", value: quarterOf(project.handover_date) || "—" },
    { label: "Furnishing", value: "—" },
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
  const toRow = (unit: ProjectUnit): UnitRow => ({ unit_id: unit.id, project_id: project.id, project_name: `${project.name}${unit.unit_number ? ` · ${unit.unit_number}` : ""}`, developer: project.developer_name, district: project.district, price_aed: unit.price_aed, bedrooms: unit.bedrooms, size_sqft: unit.size_sqft, handover_date: project.handover_date, cover_image_url: project.cover_image_url, score: null, unit_number: unit.unit_number ?? null });
  return <section className="od-live-inventory">
    <div className="a-card-head"><div><p className="eyebrow-a">Project details</p><h1>{project.name}</h1></div><span className="a-count num">{data.units.length} units shown</span></div>
    <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[7fr_3fr]">
      <div className="min-w-0 space-y-5">
        <div className="space-y-3">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-border bg-secondary shadow-sm">
            <img src={mainImage} alt={project.name} className="size-full object-cover" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[galleryA, galleryB].map((thumb, i) => (
              <button key={i} type="button" onClick={() => setPickedImage(thumb)} aria-label={`Show view ${i + 1}`} className="relative aspect-[16/10] overflow-hidden rounded-xl border border-border bg-secondary shadow-sm transition-opacity hover:opacity-90" style={mainImage === thumb ? { boxShadow: "0 0 0 2px var(--brand-blue)" } : undefined}>
                <img src={thumb} alt={`${project.name} view ${i + 1}`} loading="lazy" width={1024} height={1024} className="size-full object-cover" />
              </button>
            ))}
          </div>
        </div>
        <div className="a-card p-5">
          <p className="eyebrow-a">Details</p>
          <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-4 md:grid-cols-3">
            {details.map((item) => (
              <div key={item.label} className="min-w-0">
                <p className="text-xs uppercase tracking-wide" style={{ color: "var(--a-ink-2)" }}>{item.label}</p>
                <p className="mt-1 truncate text-sm font-semibold" style={{ color: "var(--a-ink)" }}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="a-card p-5">
          <p className="eyebrow-a">Payment Plan</p>
          <div className="mt-3 flex h-3 w-full overflow-hidden rounded-full border border-border">
            <div style={{ width: "20%", background: "var(--brand-blue)" }} />
            <div style={{ width: "60%", background: "var(--brand-blue)", opacity: 0.55 }} />
            <div style={{ width: "20%", background: "var(--brand-blue)", opacity: 0.25 }} />
          </div>
          <div className="mt-3 grid grid-cols-3 gap-3">
            {[{ label: "On Booking", value: "20%" }, { label: "During Construction", value: "60%" }, { label: "On Handover", value: "20%" }].map((seg) => (
              <div key={seg.label} className="min-w-0">
                <p className="metric text-sm font-semibold" style={{ color: "var(--a-ink)" }}>{seg.value}</p>
                <p className="text-xs" style={{ color: "var(--a-ink-2)" }}>{seg.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="a-card p-5">
          <p className="eyebrow-a">Available Units</p>
          {bedGroups.length ? (
            <Accordion type="multiple" defaultValue={bedGroups.slice(0, 1).map((g) => g.key)} className="mt-2">
              {bedGroups.map((group) => (
                <AccordionItem key={group.key} value={group.key}>
                  <AccordionTrigger>
                    <span className="text-sm font-semibold" style={{ color: "var(--a-ink)" }}>{group.label}</span>
                    <span className="a-count num ml-auto mr-3">{group.units.length}</span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="a-table-wrap overflow-x-auto">
                      <table className="a-table w-full text-sm">
                        <thead>
                          <tr>
                            {["Plan", "Bedrooms", "Type", "Unit", "Floor", "Area", "Price", ""].map((h) => (
                              <th key={h} className="px-3 py-2 text-left text-xs uppercase tracking-wide" style={{ color: "var(--a-ink-2)" }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {group.units.map((unit) => (
                            <tr key={unit.id} className="border-t border-border" onClick={() => setUnitModal(toRow(unit))}>
                              <td className="px-3 py-2">
                                <div className="size-10 overflow-hidden rounded-lg border border-border bg-secondary">
                                  {project.cover_image_url ? <img src={mediaUrl(project.cover_image_url)} alt="" loading="lazy" className="size-full object-cover" /> : null}
                                </div>
                              </td>
                              <td className="px-3 py-2">{unit.bedrooms != null ? `${unit.bedrooms} BR` : "—"}</td>
                              <td className="px-3 py-2">{unit.unit_type ?? "—"}</td>
                              <td className="px-3 py-2">{unit.unit_number ?? "—"}</td>
                              <td className="px-3 py-2">—</td>
                              <td className="px-3 py-2 num">{unit.size_sqft != null ? `${unit.size_sqft.toLocaleString("en-US")} sqft` : "—"}</td>
                              <td className="px-3 py-2 num font-semibold" style={{ color: "var(--a-ink)" }}>{unit.price_aed != null ? aed(unit.price_aed) : "On request"}</td>
                              <td className="px-3 py-2">
                                <button type="button" aria-label="View unit" className="a-btn a-btn-line inline-flex size-8 items-center justify-center rounded-lg" onClick={(e) => { e.stopPropagation(); setUnitModal(toRow(unit)); }}>
                                  <Eye className="size-4" />
                                </button>
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
        <div className="od-unit-grid">{data.units.map((unit) => <UnitCard key={unit.id} row={toRow(unit)} onOpen={setSelected} />)}</div>
        {!data.units.length ? <p className="a-note">No units are recorded for this project.</p> : null}
      </div>
      <aside className="a-card space-y-4 self-start p-5 lg:sticky lg:top-24">
        <div>
          <p className="eyebrow-a">Project</p>
          <h2 className="font-display text-xl font-semibold">{project.name}</h2>
        </div>
        <div className="space-y-3">
          {facts.map((fact) => (
            <div key={fact.label} className="flex items-baseline justify-between gap-3 border-b border-border pb-2 last:border-0 last:pb-0">
              <span className="text-sm text-muted-foreground">{fact.label}</span>
              <span className="metric truncate text-right text-sm font-semibold">{fact.value}</span>
            </div>
          ))}
        </div>
        <div className="grid gap-2 pt-1">
          <Button type="button" className="a-btn a-btn-gold w-full">Generate Sales Offer</Button>
          <Button type="button" variant="ghost" className="a-btn a-btn-line w-full">Download Assets</Button>
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
                <img src={floorplan} alt={`Floor plan for ${unitModal.project_name}`} loading="lazy" width={1280} height={960} className="size-full object-cover" />
              </div>
              <p className="a-note">Illustrative floor plan — this unit's own plan replaces it once documents are attached.</p>
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
                <dt>Floor</dt><dd>—</dd>
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
    <PropertyPackDrawer unit={selected} clientId={null} clientPhone={null} onClose={() => setSelected(null)} />
  </section>;
}
