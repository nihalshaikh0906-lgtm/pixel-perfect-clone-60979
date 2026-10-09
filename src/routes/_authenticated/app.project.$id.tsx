import { createFileRoute, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Building2 } from "lucide-react";
import { UnitCard, type MatchRow } from "@/components/UnitCard";
import { PropertyPackDrawer } from "@/components/PropertyPackDrawer";
import { projectDetailOptions } from "@/lib/inventory.functions";
import { mediaUrl } from "@/lib/media";
import { quarterOf } from "@/lib/format";
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
  if (!data) return null;
  const project = data.project;
  return <section className="od-live-inventory">
    <div className="a-card-head"><div><p className="eyebrow-a">Project</p><h1>{project.name}</h1></div><span className="a-count num">{data.units.length} units shown</span></div>
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-border bg-secondary shadow-sm lg:col-span-2">
        {project.cover_image_url ? (
          <img src={mediaUrl(project.cover_image_url)} alt={project.name} className="size-full object-cover" />
        ) : (
          <div className="flex size-full items-center justify-center text-muted-foreground"><Building2 className="size-8" /></div>
        )}
      </div>
      <div className="a-card space-y-3 p-5">
        <div><p className="eyebrow-a">Developer</p><p className="font-semibold">{project.developer_name ?? "—"}</p></div>
        <div><p className="eyebrow-a">District</p><p className="font-semibold">{project.district ?? "—"}</p></div>
        <div><p className="eyebrow-a">Handover</p><p className="font-semibold">{quarterOf(project.handover_date)}</p></div>
        <div><p className="eyebrow-a">Status</p><p className="font-semibold">{project.sale_status ?? "—"}</p></div>
      </div>
    </div>
    <div className="od-unit-grid">{data.units.map((unit) => {
      const row: MatchRow = { unit_id: unit.id, project_id: project.id, project_name: `${project.name}${unit.unit_number ? ` · ${unit.unit_number}` : ""}`, developer: project.developer_name, district: project.district, price_aed: unit.price_aed, bedrooms: unit.bedrooms, size_sqft: unit.size_sqft, handover_date: project.handover_date, cover_image_url: project.cover_image_url, score: null };
      return <UnitCard key={unit.id} row={row} onOpen={setSelected} />;
    })}</div>
    {!data.units.length ? <p className="a-note">No units are recorded for this project.</p> : null}
    <PropertyPackDrawer unit={selected} clientId={null} clientPhone={null} onClose={() => setSelected(null)} />
  </section>;
}
