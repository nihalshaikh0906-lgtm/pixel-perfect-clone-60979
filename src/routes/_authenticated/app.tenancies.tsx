import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Banknote, DoorClosed } from "lucide-react";
import { workspaceHead } from "@/components/app/WorkspacePlaceholder";

export const Route = createFileRoute("/_authenticated/app/tenancies")({
  head: () => workspaceHead("Tenancies"),
  component: Page,
});

type T = { id: string; property: string; tenant: string; rent: number; lastPaid: string; arrears: number; expiry: string; status: "Active" | "Ended" };

// Sample tenancies — demo data only, nothing is saved.
const START: T[] = [
  { id: "TN-201", property: "Marina Quay 2 BR", tenant: "Daniel Brooks", rent: 12083, lastPaid: "Oct 01, 2026", arrears: 0, expiry: "Mar 31, 2027", status: "Active" },
  { id: "TN-202", property: "JLT Cluster D Studio", tenant: "Aisha Rahman", rent: 4333, lastPaid: "Sep 01, 2026", arrears: 4333, expiry: "Jan 14, 2027", status: "Active" },
  { id: "TN-203", property: "Hills Estate 3 BR", tenant: "Marco Bianchi", rent: 17500, lastPaid: "Oct 03, 2026", arrears: 0, expiry: "Aug 31, 2027", status: "Active" },
  { id: "TN-204", property: "Business Bay 1 BR", tenant: "Hana Yoshida", rent: 7083, lastPaid: "Aug 01, 2026", arrears: 14166, expiry: "Dec 31, 2026", status: "Active" },
  { id: "TN-205", property: "Arjan Garden 1 BR", tenant: "Tom Fischer", rent: 5500, lastPaid: "Jun 01, 2026", arrears: 0, expiry: "Jun 30, 2026", status: "Ended" },
  { id: "TN-206", property: "Al Furjan Townhouse", tenant: "Nadia Karim", rent: 13750, lastPaid: "Oct 05, 2026", arrears: 0, expiry: "May 31, 2027", status: "Active" },
];

const aed = (n: number) => `AED ${n.toLocaleString("en-US")}`;

function Page() {
  const [rows, setRows] = useState(START);
  const active = rows.filter((r) => r.status === "Active");
  const roll = active.reduce((s, r) => s + r.rent, 0);
  const arrears = active.reduce((s, r) => s + r.arrears, 0);
  const inArrears = active.filter((r) => r.arrears > 0).length;

  const pay = (t: T) => {
    if (t.status === "Ended") { toast.info("This tenancy has ended"); return; }
    setRows((r) => r.map((x) => (x.id === t.id ? { ...x, arrears: Math.max(0, x.arrears - x.rent), lastPaid: "Oct 09, 2026" } : x)));
    toast.success(`Recorded ${aed(t.rent)} from ${t.tenant}`);
  };
  const end = (t: T) => {
    if (t.status === "Ended") { toast.info("Already ended"); return; }
    setRows((r) => r.map((x) => (x.id === t.id ? { ...x, status: "Ended" } : x)));
    toast.success(`Tenancy for ${t.property} ended`);
  };

  const Acts = ({ t }: { t: T }) => (
    <span className="a-deal-acts">
      <button type="button" className="a-btn a-btn-line a-btn-sm" title="Record Payment" aria-label={`Record payment for ${t.tenant}`} onClick={() => pay(t)}><Banknote size={14} /></button>
      <button type="button" className="a-btn a-btn-line a-btn-sm" title="End Tenancy" aria-label={`End tenancy for ${t.tenant}`} onClick={() => end(t)}><DoorClosed size={14} /></button>
    </span>
  );

  return (
    <>
      <section className="a-band a-fade">
        <div><p className="eyebrow-a">MONEY</p><h1>Tenancies</h1><p className="sub">Leases, rent roll and arrears across your managed units.</p></div>
        <div className="a-band-actions"><span className="a-chip c-stage">Sample records — demo data</span></div>
      </section>

      <section className="a-kpis a-fade" style={{ marginTop: 20 }}>
        <div className="a-card a-kpi a-lift"><p className="eyebrow-a" style={{ marginTop: 0 }}>Active Tenancies</p><strong className="num">{active.length}</strong><p>Leases currently running</p></div>
        <div className="a-card a-kpi a-lift"><p className="eyebrow-a" style={{ marginTop: 0 }}>Rent Roll / mo</p><strong className="num">{aed(roll)}</strong><p>Monthly rent due</p></div>
        <div className="a-card a-kpi a-lift"><p className="eyebrow-a" style={{ marginTop: 0 }}>Collected</p><strong className="num t-ok">{aed(roll - arrears > 0 ? roll - Math.min(arrears, roll) : 0)}</strong><p>Received this month</p></div>
        <div className="a-card a-kpi a-lift"><p className="eyebrow-a" style={{ marginTop: 0 }}>In Arrears</p><strong className="num t-hot">{aed(arrears)}</strong><p>{inArrears} tenants behind</p></div>
      </section>

      <div className="a-card a-fade" style={{ marginTop: 20 }}>
        <div className="a-card-head"><h2>All tenancies</h2><span className="a-count num">{rows.length} tenancies</span></div>
        <div className="a-table-wrap">
          <table className="a-table a-deal-table">
            <thead><tr><th>Property</th><th>Tenant Name</th><th>Rent Amount</th><th>Last Paid</th><th>Arrears</th><th>Expiry</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {rows.map((t) => (
                <tr key={t.id}>
                  <td><b>{t.property}</b><small>{t.id}</small></td>
                  <td>{t.tenant}</td>
                  <td className="num">{aed(t.rent)}</td>
                  <td className="num">{t.lastPaid}</td>
                  <td className={`num ${t.arrears ? "t-hot" : ""}`}>{t.arrears ? aed(t.arrears) : "—"}</td>
                  <td className="num">{t.expiry}</td>
                  <td><span className={`a-chip ${t.status === "Active" ? "c-ok" : "c-cold"}`}>{t.status}</span></td>
                  <td><Acts t={t} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="a-cards">
          {rows.map((t) => (
            <div key={t.id} className="a-lcard">
              <b>{t.property}</b><small>{t.tenant} · expires {t.expiry}</small>
              <span className="a-deal-mrow"><span className="a-deal-mamt num">{aed(t.rent)} / mo</span><span className={`a-chip ${t.status === "Active" ? "c-ok" : "c-cold"}`}>{t.status}</span></span>
              {t.arrears ? <small className="t-hot num">Arrears {aed(t.arrears)}</small> : null}
              <Acts t={t} />
            </div>
          ))}
        </div>
        <p className="a-mut">Every row here is sample data — nothing on this page is saved to your database.</p>
      </div>
    </>
  );
}
