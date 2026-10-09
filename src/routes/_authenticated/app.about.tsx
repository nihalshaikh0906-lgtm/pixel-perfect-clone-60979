import { createFileRoute } from "@tanstack/react-router";
import { MessageCircle, Youtube } from "lucide-react";
import { workspaceHead } from "@/components/app/WorkspacePlaceholder";

export const Route = createFileRoute("/_authenticated/app/about")({
  head: () => workspaceHead("About App"),
  component: Page,
});

const RULES: [string, string][] = [
  ["Overdue follow-up", "status = Pending AND dueAt < NOW()"],
  ["Due now follow-up", "status = Pending AND dueAt within the next 60 minutes"],
  ["Deal balance", "Deal Amount − total payments recorded"],
  ["Commission", "Deal Amount × Commission %"],
  ["Agent share", "Commission × Agent Split %"],
  ["Agency share", "Commission − Agent share"],
  ["Rent arrears", "Monthly rent × months unpaid since Last Paid"],
  ["Unassigned lead", "agent IS NULL AND stage = New"],
  ["Round-robin assignment", "Next active agent after the last one assigned"],
];

const STORAGE: [string, string][] = [
  ["Inventory", "Projects and units with prices, floorplans and documents, read-only for brokers."],
  ["CRM", "Clients, leads, shortlists and meetings — each row is visible only to the broker who owns it."],
  ["Company", "Organisation members and roles, checked on every request so agents only see their own work."],
  ["Spreadsheet import", "Google Sheets or CSV files are mapped column by column and loaded into the CRM tables."],
  ["Sample pages", "Deals, tenancies, follow-ups and similar pages currently run on sample data kept in the page."],
];

function Page() {
  return (
    <>
      <section className="a-band a-fade">
        <div><p className="eyebrow-a">SYSTEM</p><h1>About App</h1><p className="sub">How DealOS calculates, stores and routes your work.</p></div>
      </section>

      <div className="a-card a-fade">
        <div className="a-card-head"><h2>Formulas & Business Logic</h2><span className="a-count num">{RULES.length} rules</span></div>
        <div className="a-table-wrap">
          <table className="a-table">
            <thead><tr><th>Rule</th><th>Logic</th></tr></thead>
            <tbody>{RULES.map(([r, l]) => <tr key={r}><td><b>{r}</b></td><td><code>{l}</code></td></tr>)}</tbody>
          </table>
        </div>
        <div className="a-cards">{RULES.map(([r, l]) => <div key={r} className="a-lcard"><b>{r}</b><small><code>{l}</code></small></div>)}</div>
      </div>

      <div className="a-card a-fade" style={{ marginTop: 20 }}>
        <div className="a-card-head"><h2>Data Storage</h2></div>
        <dl className="a-kv" style={{ margin: 0 }}>
          {STORAGE.map(([k, v]) => <><dt key={`${k}-t`}>{k}</dt><dd key={`${k}-d`} style={{ fontWeight: 500 }}>{v}</dd></>)}
        </dl>
      </div>

      <div className="a-card a-fade" style={{ marginTop: 20 }}>
        <p className="eyebrow-a" style={{ marginTop: 0 }}>Developer</p>
        <div className="a-dev">
          <span className="a-dev-mark">RI</span>
          <div style={{ marginRight: "auto" }}><b style={{ fontSize: 17 }}>Mohammad Rameez Imdad</b><p className="a-mut" style={{ margin: 0 }}>Rameez Scripts</p></div>
          <a className="a-btn a-btn-line a-btn-sm" href="https://wa.me/" target="_blank" rel="noreferrer"><MessageCircle size={14} /> WhatsApp</a>
          <a className="a-btn a-btn-line a-btn-sm" href="https://www.youtube.com/results?search_query=Rameez+Scripts" target="_blank" rel="noreferrer"><Youtube size={14} /> YouTube</a>
        </div>
      </div>
    </>
  );
}
