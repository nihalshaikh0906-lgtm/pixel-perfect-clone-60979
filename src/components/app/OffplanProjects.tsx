import { Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Building2, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mediaUrl } from "@/lib/media";
import { aed, quarterOf } from "@/lib/format";
import { offplanProjectsOptions } from "@/lib/inventory.functions";
import { INVENTORY_PAGE_SIZE } from "@/lib/inventory-category";

function bedLabel(n: number): string {
  return n === 0 ? "Studio" : `${n} BR`;
}

export function OffplanProjects({ page, q, onSearch }: {
  page: number; q: string;
  onSearch: (search: { page: number; q: string }) => void;
}) {
  const { data } = useSuspenseQuery(offplanProjectsOptions(page, q));
  return <section className="od-live-inventory">
    <div className="a-card-head"><div><p className="eyebrow-a">Supabase inventory</p><h1>Offplan Projects</h1></div><span className="a-count num">{data.count.toLocaleString("en-US")} projects</span></div>
    <form className="od-inventory-search" onSubmit={(event) => { event.preventDefault(); const form = new FormData(event.currentTarget); onSearch({ page: 1, q: String(form.get("q") ?? "") }); }}>
      <input key={q} name="q" className="a-in" defaultValue={q} placeholder="Search projects" aria-label="Search projects" />
      <Button type="submit" variant="ghost" className="a-btn a-btn-line"><Search /> Search</Button>
    </form>
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
      {data.rows.map((project) => (
        <Link
          key={project.id}
          to="/app/project/$id"
          params={{ id: String(project.id) }}
          className="group block overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-secondary">
            {project.cover_image_url ? (
              <img
                src={mediaUrl(project.cover_image_url)}
                alt={project.name}
                loading="lazy"
                className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="flex size-full items-center justify-center text-muted-foreground">
                <Building2 className="size-8" />
              </div>
            )}
            <span className="metric absolute right-3 top-3 rounded-full border border-border bg-background/80 px-2.5 py-1 text-xs text-muted-foreground backdrop-blur">
              {quarterOf(project.handover_date)}
            </span>
          </div>
          <div className="space-y-2 p-4">
            <h3 className="truncate font-display text-lg font-semibold">{project.name}</h3>
            <p className="truncate text-sm text-muted-foreground">{project.developer_name ?? project.district ?? "—"}</p>
            <p className="metric text-lg text-primary">{project.starting_price_aed != null ? `From ${aed(project.starting_price_aed)}` : "Price on request"}</p>
            <div className="flex flex-wrap gap-1.5">
              {project.bed_types.slice(0, 4).map((bed) => (
                <span key={bed} className="metric rounded-md border border-border bg-secondary/60 px-2 py-1 text-xs text-muted-foreground">{bedLabel(bed)}</span>
              ))}
              {project.bed_types.length > 4 ? (
                <span className="metric rounded-md border border-border bg-secondary/60 px-2 py-1 text-xs text-muted-foreground">+{project.bed_types.length - 4}</span>
              ) : null}
            </div>
          </div>
        </Link>
      ))}
    </div>
    {!data.rows.length ? <p className="a-note">{q ? "No projects match this search." : "No off-plan projects are recorded in Supabase."}</p> : null}
    <div className="od-pagination"><span className="num">Page {page} of {Math.max(1, Math.ceil(data.count / INVENTORY_PAGE_SIZE))}</span>
      <Button variant="ghost" size="icon" className="a-btn a-btn-line" aria-label="Previous projects page" disabled={page <= 1} onClick={() => onSearch({ page: page - 1, q })}><ChevronLeft /></Button>
      <Button variant="ghost" size="icon" className="a-btn a-btn-line" aria-label="Next projects page" disabled={page * INVENTORY_PAGE_SIZE >= data.count} onClick={() => onSearch({ page: page + 1, q })}><ChevronRight /></Button>
    </div>
  </section>;
}
