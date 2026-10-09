import { createFileRoute } from "@tanstack/react-router";
import { byCategory } from "@/lib/inventory-mock";
import { DemoPropertyCards } from "@/components/app/InventoryTable";
import { workspaceHead } from "@/components/app/WorkspacePlaceholder";

export const Route = createFileRoute("/_authenticated/app/rentals")({
  head: () => workspaceHead("Rentals"),
  component: Page,
});

function Page() {
  const count = byCategory("rental").length;
  return (
    <div style={{ display: "grid", gap: 20 }}>
      <div style={{ display: "flex", alignItems: "end", gap: 8, flexWrap: "wrap" }}>
        <div style={{ marginRight: "auto" }}>
          <p className="eyebrow-a">Your inventory</p>
          <h1 style={{ margin: 0, fontSize: 32 }}>Rentals</h1>
          <p className="a-note" style={{ margin: "6px 0 0" }}>Leasing stock with annual rents.</p>
        </div>
        <span className="a-chip c-stage num">{count} properties</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 14 }}>
        <DemoPropertyCards category="rental" rent />
      </div>
    </div>
  );
}
