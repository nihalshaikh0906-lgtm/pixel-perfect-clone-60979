import { Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Building2, Construction, Key, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { inventorySummaryOptions, projectPageOptions } from "@/lib/inventory.functions";
import { INVENTORY_PAGE_SIZE } from "@/lib/inventory-category";

const money = (n: number) => `AED ${new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 2 }).format(n)}`;
const count = (n: number) => n.toLocaleString("en-US");
const CATEGORIES = [
  { key: "offplan", label: "Offplan", to: "/app/offplan", Icon: Construction },
  { key: "ready", label: "Ready Property", to: "/app/listings", Icon: Building2 },
  { key: "rental", label: "Rentals", to: "/app/rentals", Icon: Key },
] as const;

export function OwnerDashboard({ page = 1, onPage }: { page?: number; onPage?: (page: number) => void }) {
  const { data } = useSuspenseQuery(inventorySummaryOptions());
  const { data: projects } = useSuspenseQuery(projectPageOptions(page));
  const metrics = [
    { label: "Total Projects", value: count(data.projects), note: "Projects in Supabase" },
    { label: "Total Units", value: count(data.units), note: "Across all inventory categories" },
    { label: "Available Units", value: count(data.available), note: "Available or active status" },
    { label: "Total Inventory Value", value: money(data.value), note: data.unpriced ? `${count(data.unpriced)} units without a recorded price` : "Sum of recorded unit prices" },
  ];
  return (
    <div className="owner-dash">
      <section className="a-band">
        <div><p className="eyebrow-a">Company Owner</p><h1>Executive Overview</h1><p className="sub">Live projects and units</p></div>
        <span className="a-chip c-offplan">Supabase inventory</span>
      </section>
      <section className="a-kpis">
        {metrics.map((metric) => <div className="a-card a-kpi" key={metric.label}>
          <p className="eyebrow-a">{metric.label}</p><strong className="num od-value" title={metric.value}>{metric.value}</strong><p>{metric.note}</p>
        </div>)}
      </section>
      <section className="od-inventory-categories">
        {CATEGORIES.map(({ key, label, to, Icon }) => <Link className="a-card a-lift od-category" key={key} to={to}>
          <div className="a-card-head"><h2><Icon size={18} /> {label}</h2><ArrowRight size={17} /></div>
          <strong className="num od-value">{count(data.categories[key].units)}</strong>
          <p>{count(data.categories[key].available)} available · {money(data.categories[key].value)}</p>
        </Link>)}
      </section>
      {data.categories.other.units > 0 ? <p className="a-note">{count(data.categories.other.units)} units have an unclassified listing type.</p> : null}
      <section className="od-projects">
        <div className="a-card-head"><h2>All Projects</h2><span className="a-count num">{count(projects.count)} projects</span></div>
        <div className="a-table-wrap"><table className="a-table"><thead><tr>
          {["Project", "Developer", "Community", "Handover", "Sale Status"].map((label) => <th scope="col" key={label}>{label}</th>)}
        </tr></thead><tbody>{projects.rows.map((project) => <tr key={project.id}>
          <td><b>{project.name}</b></td><td>{project.developer_name ?? "—"}</td><td>{project.district ?? "—"}</td><td className="num">{project.handover_date ?? "—"}</td><td>{project.sale_status ?? "—"}</td>
        </tr>)}{!projects.rows.length ? <tr><td colSpan={5}>No projects recorded.</td></tr> : null}</tbody></table></div>
        <div className="od-pagination">
          <span className="num">Page {page} of {Math.max(1, Math.ceil(projects.count / INVENTORY_PAGE_SIZE))}</span>
          <Button className="a-btn a-btn-line" variant="ghost" size="icon" aria-label="Previous projects page" disabled={page <= 1 || !onPage} onClick={() => onPage?.(page - 1)}><ChevronLeft /></Button>
          <Button className="a-btn a-btn-line" variant="ghost" size="icon" aria-label="Next projects page" disabled={page * INVENTORY_PAGE_SIZE >= projects.count || !onPage} onClick={() => onPage?.(page + 1)}><ChevronRight /></Button>
        </div>
      </section>
    </div>
  );
}
