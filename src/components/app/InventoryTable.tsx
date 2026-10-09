import { byCategory, type InventoryCategory } from "@/lib/inventory-mock";

const aed = (n: number) => `AED ${n.toLocaleString("en-US")}`;

export function InventoryTable({ category, rent = false }: { category: InventoryCategory; rent?: boolean }) {
  const rows = byCategory(category);
  return (
    <div className="a-card" style={{ padding: 0, overflow: "hidden" }}>
      <div className="a-table-wrap">
        <table className="a-table">
          <thead>
            <tr>
              <th scope="col">Property</th>
              <th scope="col">Community</th>
              <th scope="col">Beds</th>
              <th scope="col">Size</th>
              <th scope="col">{rent ? "Rent / yr" : "Price"}</th>
              <th scope="col">Agent</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.id}>
                <td><b>{p.title}</b></td>
                <td>{p.community}</td>
                <td>{p.bedrooms === "Studio" ? "Studio" : `${p.bedrooms} BR`}</td>
                <td className="num">{p.size_sqft.toLocaleString("en-US")} sqft</td>
                <td className="num"><b>{aed(p.price)}</b></td>
                <td>{p.agent}</td>
                <td><span className="a-chip c-stage">{p.status}</span></td>
              </tr>
            ))}
            {!rows.length ? (
              <tr><td colSpan={7} style={{ textAlign: "center", color: "var(--a-ink-2)" }}>No properties in this category yet.</td></tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function DemoPropertyCard({ p, rent = false }: { p: MockProperty; rent?: boolean }) {
  return (
    <div className="a-card a-lift a-lst-card" style={{ display: "grid", gap: 6 }}>
      <p className="eyebrow-a" style={{ margin: 0 }}>{p.community} · demo</p>
      <b style={{ fontSize: 17 }}>{p.title}</b>
      <span className="muted">{p.bedrooms === "Studio" ? "Studio" : `${p.bedrooms} BR`} · {p.size_sqft.toLocaleString("en-US")} sqft</span>
      <strong className="num" style={{ fontSize: 20 }}>{aed(p.price)}{rent ? " / yr" : ""}</strong>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <span className="a-chip c-stage">{p.status}</span>
        <span className="a-chip c-stage" style={{ marginLeft: "auto" }}>Demo</span>
      </div>
    </div>
  );
}

export function DemoPropertyCards({ category, rent = false }: { category: InventoryCategory; rent?: boolean }) {
  return (
    <>
      {byCategory(category).map((p) => <DemoPropertyCard key={p.id} p={p} rent={rent} />)}
    </>
  );
}

export function InventoryPage({ title, blurb, category, rent = false }: { title: string; blurb: string; category: InventoryCategory; rent?: boolean }) {
  const count = byCategory(category).length;
  return (
    <div style={{ display: "grid", gap: 20 }}>
      <div style={{ display: "flex", alignItems: "end", gap: 8, flexWrap: "wrap" }}>
        <div style={{ marginRight: "auto" }}>
          <p className="eyebrow-a">Your inventory</p>
          <h1 style={{ margin: 0, fontSize: 32 }}>{title}</h1>
          <p className="a-note" style={{ margin: "6px 0 0" }}>{blurb}</p>
        </div>
        <span className="a-chip c-stage num">{count} properties</span>
      </div>
      <InventoryTable category={category} rent={rent} />
    </div>
  );
}
