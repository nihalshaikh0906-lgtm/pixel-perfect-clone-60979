import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";

import { workspaceHead } from "@/components/app/WorkspacePlaceholder";

export const Route = createFileRoute("/_authenticated/app/users")({
  head: () => workspaceHead("Users Management"),
  component: Page,
});

type Role = "Admin" | "Manager" | "Agent";

type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  active: boolean;
  created: string;
};

// Sample account records — illustrative demo data, not saved anywhere.
const START: User[] = [
  { id: "USR-1001", name: "Aisha Al Mansouri", email: "aisha.almansouri@example.com", role: "Admin", active: true, created: "12 Mar 2024" },
  { id: "USR-1002", name: "Daniel Reyes", email: "daniel.reyes@example.com", role: "Manager", active: true, created: "28 Mar 2024" },
  { id: "USR-1003", name: "Sara Khan", email: "sara.khan@example.com", role: "Agent", active: true, created: "04 Apr 2024" },
  { id: "USR-1004", name: "Victor Andrade", email: "victor.andrade@example.com", role: "Agent", active: true, created: "19 Apr 2024" },
  { id: "USR-1005", name: "Noura Al Blooshi", email: "noura.alblooshi@example.com", role: "Admin", active: true, created: "02 May 2024" },
  { id: "USR-1006", name: "Tom Whitfield", email: "tom.whitfield@example.com", role: "Agent", active: false, created: "17 May 2024" },
  { id: "USR-1007", name: "Leila Haddad", email: "leila.haddad@example.com", role: "Agent", active: true, created: "09 Jun 2024" },
  { id: "USR-1008", name: "Krishna Nair", email: "krishna.nair@example.com", role: "Agent", active: true, created: "25 Jun 2024" },
  { id: "USR-1009", name: "Emma Lindqvist", email: "emma.lindqvist@example.com", role: "Manager", active: false, created: "11 Jul 2024" },
  { id: "USR-1010", name: "Omar Zaki", email: "omar.zaki@example.com", role: "Agent", active: true, created: "30 Jul 2024" },
];

const BLANK: User = { id: "", name: "", email: "", role: "Agent", active: true, created: "" };

const ROLE_CHIP: Record<Role, string> = { Admin: "c-ready", Manager: "c-warm", Agent: "c-ok" };

const ROLES: Role[] = ["Admin", "Manager", "Agent"];

function initialsOf(name: string) {
  return (
    name
      .split(/\s+/)
      .map((p) => p[0] ?? "")
      .join("")
      .slice(0, 2)
      .toUpperCase() || "—"
  );
}

function today() {
  return new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function Page() {
  const [rows, setRows] = useState<User[]>(START);
  const [draft, setDraft] = useState<User | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const total = rows.length;
  const activeAgents = rows.filter((u) => u.role === "Agent" && u.active).length;
  const inactive = rows.filter((u) => !u.active).length;
  const admins = rows.filter((u) => u.role === "Admin").length;

  const openAdd = () => {
    setDraft({ ...BLANK });
    setEditingId(null);
  };
  const openEdit = (u: User) => {
    setDraft({ ...u });
    setEditingId(u.id);
  };
  const close = () => {
    setDraft(null);
    setEditingId(null);
  };
  const save = () => {
    if (!draft) return;
    if (!draft.name.trim() || !draft.email.trim()) return;
    if (editingId) {
      setRows((r) => r.map((u) => (u.id === editingId ? { ...draft, id: editingId } : u)));
    } else {
      setRows((r) => [{ ...draft, id: `USR-${2000 + r.length + 1}`, created: today() }, ...r]);
    }
    close();
  };
  const remove = (id: string) => setRows((r) => r.filter((u) => u.id !== id));
  const toggle = (id: string) => setRows((r) => r.map((u) => (u.id === id ? { ...u, active: !u.active } : u)));

  const canSave = Boolean(draft && draft.name.trim() && draft.email.trim());

  return (
    <>
      <section className="a-band a-fade">
        <div>
          <p className="eyebrow-a">SYSTEM</p>
          <h1>Users Management</h1>
          <p className="sub">Accounts, roles and access for your workspace.</p>
        </div>
        <div className="a-band-actions">
          <span className="a-chip c-stage">Sample records — demo data</span>
          <button type="button" className="a-btn a-btn-gold" onClick={openAdd}>
            <Plus size={15} /> Add user
          </button>
        </div>
      </section>

      <section className="a-kpis a-fade" style={{ marginTop: 20 }}>
        <div className="a-card a-kpi a-lift">
          <p className="eyebrow-a" style={{ marginTop: 0 }}>Total Users</p>
          <strong className="num">{total}</strong>
          <p>Accounts with workspace access</p>
        </div>
        <div className="a-card a-kpi a-lift">
          <p className="eyebrow-a" style={{ marginTop: 0 }}>Active Agents</p>
          <strong className="num t-ok">{activeAgents}</strong>
          <p>Agents currently taking leads</p>
        </div>
        <div className="a-card a-kpi a-lift">
          <p className="eyebrow-a" style={{ marginTop: 0 }}>Inactive</p>
          <strong className="num t-hot">{inactive}</strong>
          <p>Accounts signed out of rotation</p>
        </div>
        <div className="a-card a-kpi a-lift">
          <p className="eyebrow-a" style={{ marginTop: 0 }}>Admins</p>
          <strong className="num">{admins}</strong>
          <p>Full access to settings and billing</p>
        </div>
      </section>

      <div className="a-card a-fade" style={{ marginTop: 20 }}>
        <div className="a-card-head">
          <h2>All users</h2>
          <span className="a-count num">{total} users</span>
        </div>

        <div className="a-table-wrap">
          <table className="a-table a-deal-table a-usr-table">
            <thead>
              <tr>
                <th scope="col">User</th>
                <th scope="col">Role</th>
                <th scope="col">Status</th>
                <th scope="col">Created</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((u) => (
                <tr key={u.id}>
                  <td>
                    <span className="a-usr-who">
                      <span className="a-avatar" aria-hidden="true">{initialsOf(u.name)}</span>
                      <span>
                        <b>{u.name}</b>
                        <small>{u.email}</small>
                      </span>
                    </span>
                  </td>
                  <td>
                    <span className={`a-chip ${ROLE_CHIP[u.role]}`}>{u.role}</span>
                  </td>
                  <td>
                    <StatusToggle user={u} onToggle={toggle} />
                  </td>
                  <td>
                    <span className="num">{u.created}</span>
                  </td>
                  <td>
                    <span className="a-deal-acts">
                      <button
                        type="button"
                        className="a-btn a-btn-line a-btn-sm"
                        aria-label={`Edit ${u.name}`}
                        onClick={() => openEdit(u)}
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        type="button"
                        className="a-btn a-btn-line a-btn-sm"
                        aria-label={`Remove ${u.name}`}
                        onClick={() => remove(u.id)}
                      >
                        <Trash2 size={13} />
                      </button>
                    </span>
                  </td>
                </tr>
              ))}
              {!rows.length && (
                <tr>
                  <td colSpan={5} className="a-deal-empty">
                    No user accounts right now.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="a-cards">
          {rows.map((u) => (
            <div key={u.id} className="a-lcard">
              <span className="a-usr-who">
                <span className="a-avatar" aria-hidden="true">{initialsOf(u.name)}</span>
                <span>
                  <b>{u.name}</b>
                  <small>{u.email}</small>
                </span>
              </span>
              <span className="a-usr-meta">
                <span className={`a-chip ${ROLE_CHIP[u.role]}`}>{u.role}</span>
                <StatusToggle user={u} onToggle={toggle} />
                <span className="num a-mut" style={{ margin: 0 }}>{u.created}</span>
              </span>
              <span className="a-deal-acts">
                <button type="button" className="a-btn a-btn-line a-btn-sm" aria-label={`Edit ${u.name}`} onClick={() => openEdit(u)}>
                  <Pencil size={13} />
                </button>
                <button type="button" className="a-btn a-btn-line a-btn-sm" aria-label={`Remove ${u.name}`} onClick={() => remove(u.id)}>
                  <Trash2 size={13} />
                </button>
              </span>
            </div>
          ))}
          {!rows.length && <p className="a-mut">No user accounts right now.</p>}
        </div>

        <p className="a-mut">
          Every row here is sample data for the layout — nothing on this page is saved to your database.
        </p>
      </div>

      {draft && (
        <div
          className="a-modal a-deal-modal a-usr-modal"
          role="dialog"
          aria-modal="true"
          aria-label={editingId ? "Edit user" : "Add user"}
          onClick={(e) => e.target === e.currentTarget && close()}
        >
          <div>
            <div className="a-deal-head">
              <div>
                <h2 style={{ margin: 0 }}>{editingId ? "Edit user" : "Add user"}</h2>
                <p className="a-note" style={{ margin: 0 }}>Give the account a name, an email and a role.</p>
              </div>
              <button
                type="button"
                className="a-btn a-btn-line a-btn-sm"
                aria-label="Close user form"
                onClick={close}
              >
                <X size={14} />
              </button>
            </div>

            <div className="a-deal-fields">
              <label className="a-deal-span">
                Name
                <input
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                  placeholder="Full name"
                  autoFocus
                />
              </label>
              <label>
                Email
                <input
                  type="email"
                  value={draft.email}
                  onChange={(e) => setDraft({ ...draft, email: e.target.value })}
                  placeholder="name@example.com"
                />
              </label>
              <label>
                Role
                <select
                  value={draft.role}
                  onChange={(e) => setDraft({ ...draft, role: e.target.value as Role })}
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </label>
              <div className="a-lst-switch">
                <b>Account status</b>
                <StatusToggle user={draft} onToggle={() => setDraft({ ...draft, active: !draft.active })} />
              </div>
            </div>

            <div className="a-modal-actions">
              <button type="button" className="a-btn a-btn-line" onClick={close}>
                Cancel
              </button>
              <button type="button" className="a-btn a-btn-gold" onClick={save} disabled={!canSave}>
                {editingId ? "Save changes" : "Add user"}
              </button>
            </div>
            <p className="a-mut" style={{ margin: 0 }}>
              Demo only — this updates the on-screen table. Nothing is written to your database.
            </p>
          </div>
        </div>
      )}
    </>
  );
}

function StatusToggle({ user, onToggle }: { user: User; onToggle: (id: string) => void }) {
  return (
    <span className="a-usr-status">
      <button
        type="button"
        className="a-switch"
        role="switch"
        aria-checked={user.active}
        aria-label={`${user.name || "This account"} — ${user.active ? "active" : "inactive"}`}
        onClick={() => onToggle(user.id)}
      >
        <span />
      </button>
      <small>{user.active ? "Active" : "Inactive"}</small>
    </span>
  );
}
