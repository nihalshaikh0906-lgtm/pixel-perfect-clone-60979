import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Activity, Building2, CalendarClock, CalendarDays, FileSignature, Handshake, Home, Inbox,
  KeyRound, LineChart, Lock, MapPinned, Settings, ShieldCheck, Trash2, Trees, Users,
} from "lucide-react";

import { workspaceHead } from "@/components/app/WorkspacePlaceholder";

export const Route = createFileRoute("/_authenticated/app/roles-permissions")({
  head: () => workspaceHead("Roles & Permissions"),
  component: Page,
});

type Level = "full" | "edit" | "view" | "none";

const KEYS = ["V", "A", "E", "D"] as const;
const KEY_LABEL: Record<(typeof KEYS)[number], string> = { V: "View", A: "Add", E: "Edit", D: "Delete" };
const ROLES = ["Admin", "Manager", "Agent"] as const;

// Static starting point for each level — illustrative only, not enforced anywhere yet.
const LEVEL_KEYS: Record<Level, boolean[]> = {
  full: [true, true, true, true],
  edit: [true, true, true, false],
  view: [true, false, false, false],
  none: [false, false, false, false],
};

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

function seedPerms(): Record<string, boolean[]> {
  const seed: Record<string, boolean[]> = {};
  for (const r of ROWS) {
    seed[`${r.page}|Manager`] = [...LEVEL_KEYS[r.levels[1]]];
    seed[`${r.page}|Agent`] = [...LEVEL_KEYS[r.levels[2]]];
  }
  return seed;
}

function Page() {
  const [perms, setPerms] = useState<Record<string, boolean[]>>(seedPerms);

  const toggle = (key: string, i: number) =>
    setPerms((prev) => {
      const cur = prev[key] ?? [false, false, false, false];
      const next = [...cur];
      next[i] = !next[i];
      return { ...prev, [key]: next };
    });

  // Rendered as a plain function (not a component) so focus stays on the button while toggling.
  const keys = (page: string, role: string, on: boolean[], locked = false) => (
    <span className="a-role-keys" role="group" aria-label={`${role} access for ${page}`}>
      {KEYS.map((k, i) => (
        <button
          key={k}
          type="button"
          className="a-role-key"
          aria-pressed={on[i]}
          disabled={locked}
          aria-label={`${KEY_LABEL[k]} access for ${role} on ${page}`}
          title={locked ? `${KEY_LABEL[k]} — Admin always has full access` : KEY_LABEL[k]}
          onClick={() => { if (!locked) toggle(`${page}|${role}`, i); }}
        >
          {k}
        </button>
      ))}
    </span>
  );

  const permFor = (page: string, role: string) =>
    role === "Admin" ? LEVEL_KEYS.full : (perms[`${page}|${role}`] ?? LEVEL_KEYS.none);

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
          <div className="a-role-keylist" aria-label="Permission key legend">
            {KEYS.map((k) => (
              <span key={k}><b>{k}</b>{KEY_LABEL[k]}</span>
            ))}
          </div>
        </div>

        <div className="a-table-wrap a-role-table">
          <table className="a-table">
            <thead>
              <tr>
                <th scope="col">Page</th>
                <th scope="col"><span className="a-role-th"><Lock size={12} /> Admin</span></th>
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
                  {ROLES.map((role) => (
                    <td key={role}>{keys(r.page, role, permFor(r.page, role), role === "Admin")}</td>
                  ))}
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
                {ROLES.map((role) => (
                  <span className="a-role-cell" key={role}>
                    <span className="a-role-legend">{role}</span>
                    {keys(r.page, role, permFor(r.page, role), role === "Admin")}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="a-mut">Tick or untick V/A/E/D to change Manager and Agent access. Admin is locked at full access. Counts and levels shown here are static demo data — nothing on this page writes to your database.</p>
      </div>
    </>
  );
}
