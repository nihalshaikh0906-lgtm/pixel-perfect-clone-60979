import { useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UnitCard, type MatchRow } from "@/components/UnitCard";
import { PropertyPackDrawer } from "@/components/PropertyPackDrawer";
import { inventoryPageOptions } from "@/lib/inventory.functions";
import { INVENTORY_PAGE_SIZE } from "@/lib/inventory-category";

export function LiveInventory({ title, category, page, q, onSearch }: {
  title: string; category: "offplan" | "ready" | "rental"; page: number; q: string;
  onSearch: (search: { page: number; q: string }) => void;
}) {
  const { data } = useSuspenseQuery(inventoryPageOptions(category, page, q));
  const [selected, setSelected] = useState<MatchRow | null>(null);
  return <section className="od-live-inventory">
    <div className="a-card-head"><div><p className="eyebrow-a">Supabase inventory</p><h1>{title}</h1></div><span className="a-count num">{data.count.toLocaleString("en-US")} units</span></div>
    <form className="od-inventory-search" onSubmit={(event) => { event.preventDefault(); const form = new FormData(event.currentTarget); onSearch({ page: 1, q: String(form.get("q") ?? "") }); }}>
      <input key={q} name="q" className="a-in" defaultValue={q} placeholder="Search projects" aria-label="Search projects" />
      <Button type="submit" variant="ghost" className="a-btn a-btn-line"><Search /> Search</Button>
    </form>
    <div className="od-unit-grid">{data.rows.map((unit: { id: number; unit_number: string | null; price_aed: number | null; bedrooms: number | null; size_sqft: number | null; projects: { id: number; name: string; developer_name: string | null; district: string | null; handover_date: string | null; cover_image_url: string | null } }) => {
      const project = unit.projects;
      const row: MatchRow = { unit_id: unit.id, project_id: project.id, project_name: `${project.name}${unit.unit_number ? ` · ${unit.unit_number}` : ""}`, developer: project.developer_name, district: project.district, price_aed: unit.price_aed, bedrooms: unit.bedrooms, size_sqft: unit.size_sqft, handover_date: project.handover_date, cover_image_url: project.cover_image_url, score: null };
      return <UnitCard key={unit.id} row={row} onOpen={setSelected} />;
    })}</div>
    {!data.rows.length ? <p className="a-note">{q ? "No units match this project search." : `No ${title.toLowerCase()} units are recorded in Supabase.`}</p> : null}
    <div className="od-pagination"><span className="num">Page {page} of {Math.max(1, Math.ceil(data.count / INVENTORY_PAGE_SIZE))}</span>
      <Button variant="ghost" size="icon" className="a-btn a-btn-line" aria-label="Previous units page" disabled={page <= 1} onClick={() => onSearch({ page: page - 1, q })}><ChevronLeft /></Button>
      <Button variant="ghost" size="icon" className="a-btn a-btn-line" aria-label="Next units page" disabled={page * INVENTORY_PAGE_SIZE >= data.count} onClick={() => onSearch({ page: page + 1, q })}><ChevronRight /></Button>
    </div>
    <PropertyPackDrawer unit={selected} clientId={null} clientPhone={null} onClose={() => setSelected(null)} />
  </section>;
}
