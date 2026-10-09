import { createFileRoute } from "@tanstack/react-router";
import { workspaceHead } from "@/components/app/WorkspacePlaceholder";

export const Route = createFileRoute("/_authenticated/app/activity-logs")({
  head: () => workspaceHead("Activity Logs"),
  component: Page,
});

type Log = { id: string; time: string; today: boolean; user: string; action: string; details: string };

// Sample system history — demo data only.
const LOGS: Log[] = [
  { id: "1", time: "Oct 09, 05:12 PM", today: true, user: "admin", action: "Document Generated", details: "Sale Agreement drafted for Marina Vista 2 BR" },
  { id: "2", time: "Oct 09, 03:48 PM", today: true, user: "sara.khan", action: "Deal Payment", details: "Token recorded on Palm Garden Villa · bank transfer" },
  { id: "3", time: "Oct 09, 11:05 AM", today: true, user: "admin", action: "Lead Assigned", details: "Website lead Ravi Menon → Omar Farooq (round-robin)" },
  { id: "4", time: "Oct 09, 09:30 AM", today: true, user: "layla.haddad", action: "Viewing Booked", details: "Creek Harbour 1 BR with Chen Wei, 4:00 PM" },
  { id: "5", time: "Oct 08, 06:22 PM", today: false, user: "omar.farooq", action: "Follow-Up Completed", details: "Call with Elena Rossi — sending floorplans" },
  { id: "6", time: "Oct 08, 02:10 PM", today: false, user: "admin", action: "User Invited", details: "New agent account for noor.ali" },
  { id: "7", time: "Oct 07, 10:41 AM", today: false, user: "sara.khan", action: "Listing Updated", details: "Downtown Loft Studio status → reserved" },
  { id: "8", time: "Aug 04, 02:22 AM", today: false, user: "admin", action: "Settings Changed", details: "Default commission set to 2%" },
];

function Page() {
  const users = new Set(LOGS.map((l) => l.user)).size;
  const today = LOGS.filter((l) => l.today).length;
  return (
    <>
      <section className="a-band a-fade">
        <div><p className="eyebrow-a">SYSTEM</p><h1>Activity Logs</h1><p className="sub">Everything that happened across the workspace, newest first.</p></div>
        <div className="a-band-actions"><span className="a-chip c-stage">Sample records — demo data</span></div>
      </section>
      <section className="a-kpis a-kpis-3 a-fade" style={{ marginTop: 20 }}>
        <div className="a-card a-kpi a-lift"><p className="eyebrow-a" style={{ marginTop: 0 }}>Total Activities</p><strong className="num">{LOGS.length}</strong><p>Events on record</p></div>
        <div className="a-card a-kpi a-lift"><p className="eyebrow-a" style={{ marginTop: 0 }}>Today's Activities</p><strong className="num t-ok">{today}</strong><p>Since midnight</p></div>
        <div className="a-card a-kpi a-lift"><p className="eyebrow-a" style={{ marginTop: 0 }}>Unique Users</p><strong className="num">{users}</strong><p>People who made changes</p></div>
      </section>
      <div className="a-card a-fade" style={{ marginTop: 20 }}>
        <div className="a-card-head"><h2>System history</h2><span className="a-count num">{LOGS.length} events</span></div>
        <div className="a-table-wrap">
          <table className="a-table a-deal-table">
            <thead><tr><th>Time</th><th>User</th><th>Action</th><th>Details</th></tr></thead>
            <tbody>
              {LOGS.map((l) => (
                <tr key={l.id}>
                  <td className="num">{l.time}</td>
                  <td><b>{l.user}</b></td>
                  <td><span className="a-chip c-stage">{l.action}</span></td>
                  <td><small>{l.details}</small></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="a-cards">
          {LOGS.map((l) => (
            <div key={l.id} className="a-lcard">
              <span className="a-deal-mrow"><span className="a-chip c-stage">{l.action}</span><small className="num">{l.time}</small></span>
              <b>{l.user}</b><small>{l.details}</small>
            </div>
          ))}
        </div>
        <p className="a-mut">Sample history for the layout — nothing here is read from or saved to your database.</p>
      </div>
    </>
  );
}
