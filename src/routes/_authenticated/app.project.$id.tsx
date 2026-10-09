import { createFileRoute, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import galleryA from "@/assets/project-gallery-1.jpg";
import galleryB from "@/assets/project-gallery-2.jpg";
import { UnitCard, type MatchRow } from "@/components/UnitCard";
import { PropertyPackDrawer } from "@/components/PropertyPackDrawer";
import { Button } from "@/components/ui/button";
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

function Page() {
  const { data } = useSuspenseQuery(projectDetailOptions(Number(Route.useParams().id)));
  const [selected, setSelected] = useState<MatchRow | null>(null);
  const [pickedImage, setPickedImage] = useState<string | null>(null);
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
  return <section className="od-live-inventory">
    <div className="a-card-head"><div><p className="eyebrow-a">Project details</p><h1>{project.name}</h1></div><span className="a-count num">{data.units.length} units shown</span></div>
    <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[7fr_3fr]">
      <div className="min-w-0 space-y-5">
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-border bg-secondary shadow-sm">
          {project.cover_image_url ? (
            <img src={mediaUrl(project.cover_image_url)} alt={project.name} className="size-full object-cover" />
          ) : (
            <div className="flex size-full items-center justify-center text-muted-foreground"><Building2 className="size-8" /></div>
          )}
        </div>
        <div className="od-unit-grid">{data.units.map((unit) => {
          const row: MatchRow = { unit_id: unit.id, project_id: project.id, project_name: `${project.name}${unit.unit_number ? ` · ${unit.unit_number}` : ""}`, developer: project.developer_name, district: project.district, price_aed: unit.price_aed, bedrooms: unit.bedrooms, size_sqft: unit.size_sqft, handover_date: project.handover_date, cover_image_url: project.cover_image_url, score: null };
          return <UnitCard key={unit.id} row={row} onOpen={setSelected} />;
        })}</div>
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
    <PropertyPackDrawer unit={selected} clientId={null} clientPhone={null} onClose={() => setSelected(null)} />
  </section>;
}
