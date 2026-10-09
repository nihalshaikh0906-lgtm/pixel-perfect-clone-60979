import { createFileRoute } from "@tanstack/react-router";
import {
  Activity, Building2, CalendarClock, CalendarDays, FileSignature, Handshake, Home, Inbox,
  KeyRound, LineChart, MapPinned, Settings, ShieldCheck, Trash2, Trees, Users,
} from "lucide-react";

import { workspaceHead } from "@/components/app/WorkspacePlaceholder";

export const Route = createFileRoute("/_authenticated/app/roles-permissions")({
  head: () => workspaceHead("Roles & Permissions"),
  component: Page,
});

type Level = "full" | "edit" | "view" | "none";

const LEVEL: Record<Level, { label: string; cls: string }> = {
  full: { label: "Full", cls: "c-ok" },
  edit: { label: "Edit", cls: "c-offplan" },
  view: { label: "View", cls: "c-stage" },
  none: { label: "None", cls: "" },
};

// Static sample matrix — illustrative only, not enforced anywhere yet.
const ROWS: { page: string; detail: string; icon: typeof Home; levels: [Level, Level, Level] }[] = [
  { page: "Dashboard", detail: "Company KPIs, pipeline and team view", icon: Home, levels: ["full", "edit", "view"] },
  { page: "Properties", detail: "Inventory, statuses, photos and floor plans", icon: Building2, levels: ["full", "edit", "view"] },
  { page: "Leads", detail: "Inbox, assignment, stages and notes", icon: Inbox, levels: ["full", "edit", "view"] },
  { page: "Follow-Ups", detail: "Task queues, due dates and reminders", icon: CalendarClock, levels: ["full", "edit", "edit"] },
  { page: "Appointments", detail: "Viewings, confirmations and reschedules", icon: CalendarDays, levels: ["full", "edit", "edit"] },
  { page: "Deals", detail: "Pipeline stages, values and commission", icon: Handshake, levels: ["full", "edit", "view"] },
  { page: "Tenancies", detail: "Contracts, renewals and expiries", icon: KeyRound, levels: ["full", "edit", "none"] },
  { page: "Agreements", detail: "Forms, signatures and attachments", icon: FileSignature, levels: ["full", "edit", "none"] },
  { page: "Reports", detail: "Performance, source and conversion exports", icon: LineChart, levels: ["full", "view", "view"] },
  { page: "Owners", detail: "Landlord records and contact history", icon: Users, levels: ["full", "edit", "view"] },
  { page: "Locations", detail: "Communities, districts and building lists", icon: MapPinned, levels: ["full", "edit", "view"] },
  { page: "Amenities", detail: "Building and project amenity catalogues", icon: Trees, levels: ["full", "edit", "view"] },
  { page: "Users Management", detail: "Invite, remove and re-role teammates", icon: Users, levels: ["full", "none", "none"] },
  { page: "Settings", detail: "Company profile, branding and integrations", icon: Settings, levels: ["full", "none", "none"] },
  { page: "Activity Logs", detail: "Who changed what, and when", icon: Activity, levels: ["full", "view", "none"] },
  { page: "Trash", detail: "Restore or permanently delete records", icon: Trash2, levels: ["full", "edit", "none"] },
  { page: "Roles & Permissions", detail: "This matrix and future access rules", icon: ShieldCheck, levels: ["full", "none", "none"] },
];

function Cell({ level }: { level: Level }) {
  const l = LEVEL[level];
  return level === "none"
    ? <span className="a-role-none">{l.label}</span>
    : <span className={`a-chip ${l.cls}`}>{l.label}</span>;
}

function Page() {
  return (
    <>
      <section className="a-band a-fade">
        <div>
          <p className="eyebrow-a">System</p>
          <h1>Roles &amp; Permissions</h1>
          <p className="sub">What each role can open and change across the workspace.</p>
        </div>
        <div className="a-band-actions">
          <span className="a-chip c-stage">Sample matrix — not enforced yet</span>
        </div>
      </section>

      <div className="a-card" style={{ marginTop: 20 }}>
        <div className="a-card-head">
          <h2>Access matrix</h2>
          <div className="a-chips" aria-label="Legend">
            <span className="a-chip c-ok">Full</span>
            <span className="a-chip c-offplan">Edit</span>
            <span className="a-chip c-stage">View</span>
            <span className="a-role-none">None</span>
          </div>
        </div>

        <div className="a-table-wrap a-role-table">
          <table className="a-table">
            <thead>
              <tr>
                <th scope="col">Page</th>
                <th scope="col">Admin</th>
                <th scope="col">Manager</th>
                <th scope="col">Agent</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r) => (
                <tr key={r.page}>
                  <td>
                    <span className="a-role-page">
                      <r.icon size={17} />
                      <span><b>{r.page}</b><small>{r.detail}</small></span>
                    </span>
                  </td>
                  <td><Cell level={r.levels[0]} /></td>
                  <td><Cell level={r.levels[1]} /></td>
                  <td><Cell level={r.levels[2]} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="a-cards">
          {ROWS.map((r) => (
            <div className="a-lcard" key={r.page}>
              <span className="a-role-page">
                <r.icon size={17} />
                <span><b>{r.page}</b><small>{r.detail}</small></span>
              </span>
              <div className="a-role-grid">
                {([["Admin", r.levels[0]], ["Manager", r.levels[1]], ["Agent", r.levels[2]]] as const).map(([role, level]) => (
                  <span className="a-role-cell" key={role}>
                    <span className="a-role-legend">{role}</span>
                    <Cell level={level} />
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="a-mut">Counts and levels shown here are static demo data. Nothing on this page writes to your database.</p>
      </div>
    </>
  );
}
