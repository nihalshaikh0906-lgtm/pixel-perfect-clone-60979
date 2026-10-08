import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Fragment, useState } from "react";
import { toast } from "sonner";
import { Building2, RotateCcw, Trash2, MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/app/crm")({
  head: () => ({
    meta: [
      { title: "Team leads — DealOS" },
      { name: "description", content: "Company and agent lead management: assign leads, follow conversations and restore from the bin." },
      { property: "og:title", content: "Team leads — DealOS" },
      { property: "og:description", content: "Role-based lead management for Dubai brokerages." },
    ],
  }),
  validateSearch: (s: Record<string, unknown>) => ({ action: typeof s.action === "string" ? s.action : undefined }),
  component: CrmPage,
});

// New tables aren't in generated types yet; use a loosely typed client.
const db = supabase as unknown as { from: (t: string) => any; rpc: (f: string, a?: object) => any };

type Lead = { id: string; name: string; phone: string | null; source: string | null; stage: string; priority: string; assigned_to: string | null; deleted_at: string | null; next_follow_up_at: string | null; ai_summary: string | null };
type Member = { user_id: string; full_name: string | null; role: string };

function CrmPage() {
  const qc = useQueryClient();
  const [tab, setTab] = useState<"active" | "bin">("active");
  const [open, setOpen] = useState<string | null>(null);
  const [agency, setAgency] = useState("");
  const { action } = Route.useSearch();
  const navigate = Route.useNavigate();
  const closeModal = () => void navigate({ search: { action: undefined } });

  const me = useQuery({
    queryKey: ["crm-me"],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      const { data } = await db.from("org_members").select("org_id, role, user_id").eq("user_id", u.user?.id ?? "").maybeSingle();
      return data as { org_id: string; role: string; user_id: string } | null;
    },
  });
  const isAdmin = me.data?.role === "company_admin";

  const members = useQuery({
    queryKey: ["crm-members"], enabled: !!me.data,
    queryFn: async () => ((await db.from("org_members").select("user_id, full_name, role")).data ?? []) as Member[],
  });
  const leads = useQuery({
    queryKey: ["crm-leads"], enabled: !!me.data,
    queryFn: async () => ((await db.from("leads").select("*").order("created_at", { ascending: false }).limit(500)).data ?? []) as Lead[],
  });
  const msgs = useQuery({
    queryKey: ["crm-msgs", open], enabled: !!open,
    queryFn: async () => ((await db.from("lead_messages").select("*").eq("lead_id", open).order("created_at")).data ?? []) as { id: string; sender: string; body: string }[],
  });

  const refresh = () => qc.invalidateQueries({ queryKey: ["crm-leads"] });
  const update = async (id: string, patch: Partial<Lead>, msg: string) => {
    const { error } = await db.from("leads").update(patch).eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success(msg); refresh();
  };
  const purge = async (id: string) => {
    if (!confirm("Delete this lead permanently?")) return;
    await db.from("lead_messages").delete().eq("lead_id", id);
    const { error } = await db.from("leads").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Deleted permanently"); refresh();
  };

  if (me.isLoading) return <div className="a-card">Loading…</div>;
  if (!me.data) {
    return (
      <div className="a-card" style={{ maxWidth: 520 }}>
        <h2><Building2 size={18} /> Set up your company</h2>
        <p>Create your agency to start managing leads with your team.</p>
        <input className="a-input" placeholder="Agency name" value={agency} onChange={(e) => setAgency(e.target.value)} />
        <button className="a-btn a-btn-gold" style={{ marginTop: 12 }} onClick={async () => {
          const { error } = await db.rpc("create_my_organization", { p_name: agency });
          if (error) { toast.error(error.message); return; }
          qc.invalidateQueries();
        }}>Create company</button>
      </div>
    );
  }

  const all = leads.data ?? [];
  const active = all.filter((l) => !l.deleted_at);
  const bin = all.filter((l) => l.deleted_at);
  const rows = tab === "active" ? active : bin;
  const name = (id: string | null) => members.data?.find((m) => m.user_id === id)?.full_name ?? "Unassigned";
  const due = active.filter((l) => l.next_follow_up_at && new Date(l.next_follow_up_at) <= new Date()).length;

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <div>
        <p className="eyebrow-a">{isAdmin ? "Company view" : "Agent view"}</p>
        <h1 style={{ margin: 0, fontSize: 32 }}>{isAdmin ? "All team leads" : "My leads"}</h1>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12 }}>
        {[["Active leads", active.length], ["Hot", active.filter((l) => l.priority === "hot").length], ["Follow-ups due", due], [isAdmin ? "Unassigned" : "Won", isAdmin ? active.filter((l) => !l.assigned_to).length : active.filter((l) => l.stage === "won").length]].map(([k, v]) => (
          <div key={k} className="a-card a-kpi"><p className="eyebrow-a" style={{ marginTop: 0 }}>{k}</p><strong className="num">{v}</strong></div>
        ))}
      </div>
      {action === "add" ? <AddLeadModal orgId={me.data.org_id} members={members.data ?? []} isAdmin={isAdmin} onClose={closeModal} onDone={refresh} /> : null}
      {action === "import" ? <ImportModal kind="leads" orgId={me.data.org_id} onClose={closeModal} onDone={refresh} /> : null}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button className="a-btn a-btn-line" style={{ marginLeft: "auto", order: 3 }} onClick={() => void navigate({ search: { action: "import" } })}>Import CSV</button>
        <button className="a-btn a-btn-gold" style={{ order: 4 }} onClick={() => void navigate({ search: { action: "add" } })}>+ Add lead</button>
        <button className={`a-btn ${tab === "active" ? "a-btn-gold" : ""}`} onClick={() => setTab("active")}>Leads ({active.length})</button>
        <button className={`a-btn ${tab === "bin" ? "a-btn-gold" : ""}`} onClick={() => setTab("bin")}><Trash2 size={14} /> Bin ({bin.length})</button>
      </div>
      <div className="a-card" style={{ overflowX: "auto", padding: 0 }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr style={{ textAlign: "left" }}>{["Lead", "Source", "Stage", "Priority", "Agent", ""].map((h) => <th key={h} style={{ padding: 12 }}>{h}</th>)}</tr></thead>
          <tbody>
            {rows.map((l) => (
              <Fragment key={l.id}>
                <tr key={l.id} style={{ borderTop: "1px solid var(--border)" }}>
                  <td style={{ padding: 12 }}><button className="a-link-btn" style={{ fontWeight: 700, background: "none", border: 0, cursor: "pointer", color: "inherit" }} onClick={() => setOpen(open === l.id ? null : l.id)}>{l.name}</button><div style={{ fontSize: 13, opacity: .7 }}>{l.phone}</div></td>
                  <td style={{ padding: 12 }}>{l.source}</td>
                  <td style={{ padding: 12 }}>
                    <select value={l.stage} disabled={tab === "bin"} onChange={(e) => update(l.id, { stage: e.target.value }, "Stage updated")}>
                      {["new", "contacted", "qualified", "viewing", "offer", "won", "lost"].map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                  <td style={{ padding: 12, textTransform: "capitalize" }}>{l.priority}</td>
                  <td style={{ padding: 12 }}>
                    {isAdmin && tab === "active" ? (
                      <select value={l.assigned_to ?? ""} onChange={(e) => update(l.id, { assigned_to: e.target.value || null }, "Lead assigned")}>
                        <option value="">Unassigned</option>
                        {members.data?.map((m) => <option key={m.user_id} value={m.user_id}>{m.full_name ?? "Member"}</option>)}
                      </select>
                    ) : name(l.assigned_to)}
                  </td>
                  <td style={{ padding: 12, whiteSpace: "nowrap" }}>
                    {tab === "active" ? (
                      <>
                        {l.phone && <a className="a-btn" href={`https://wa.me/${l.phone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer"><MessageCircle size={14} /></a>}{" "}
                        <button className="a-btn" aria-label="Move to bin" onClick={() => update(l.id, { deleted_at: new Date().toISOString() }, "Moved to bin")}><Trash2 size={14} /></button>
                      </>
                    ) : (
                      <>
                        <button className="a-btn" onClick={() => update(l.id, { deleted_at: null }, "Restored")}><RotateCcw size={14} /> Restore</button>{" "}
                        {isAdmin && <button className="a-btn" onClick={() => purge(l.id)}>Delete</button>}
                      </>
                    )}
                  </td>
                </tr>
                {open === l.id && (
                  <tr key={l.id + "m"}><td colSpan={6} style={{ padding: "0 12px 16px" }}>
                    <p style={{ fontSize: 14 }}><strong>AI summary:</strong> {l.ai_summary ?? "—"}</p>
                    {(msgs.data ?? []).map((m) => <p key={m.id} style={{ fontSize: 14, margin: "4px 0" }}><strong style={{ textTransform: "capitalize" }}>{m.sender}:</strong> {m.body}</p>)}
                  </td></tr>
                )}
              </Fragment>
            ))}
            {!rows.length && <tr><td colSpan={6} style={{ padding: 24, textAlign: "center" }}>{tab === "bin" ? "Bin is empty." : <>No leads yet. <Link to="/app">Back home</Link></>}</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AddLeadModal({ orgId, members, isAdmin, onClose, onDone }: { orgId: string; members: Member[]; isAdmin: boolean; onClose: () => void; onDone: () => void }) {
  const [f, setF] = useState({ name: "", phone: "+971", email: "", source: "WhatsApp", type: "off-plan", priority: "warm", budget_max: "", assigned_to: "" });
  const [busy, setBusy] = useState(false);
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF({ ...f, [k]: e.target.value });
  const save = async () => {
    if (!f.name.trim()) { toast.error("Name is required"); return; }
    setBusy(true);
    const { data: u } = await supabase.auth.getUser();
    const { error } = await db.from("leads").insert({ org_id: orgId, name: f.name.trim(), phone: f.phone, email: f.email || null, source: f.source, type: f.type, priority: f.priority,
      budget_max: f.budget_max ? Number(f.budget_max) : null, assigned_to: isAdmin ? f.assigned_to || null : u.user?.id, next_follow_up_at: new Date(Date.now() + 3600e3).toISOString() });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Lead added"); onDone(); onClose();
  };
  return (
    <div className="a-modal" role="dialog" aria-label="Add lead" onClick={(e) => e.target === e.currentTarget && onClose()}><div>
      <h2 style={{ margin: 0 }}>Add lead</h2>
      <label>Name<input value={f.name} onChange={set("name")} autoFocus /></label>
      <label>Phone<input value={f.phone} onChange={set("phone")} /></label>
      <label>Email<input value={f.email} onChange={set("email")} /></label>
      <label>Source<select value={f.source} onChange={set("source")}>{["Bayut", "Property Finder", "Dubizzle", "WhatsApp", "Meta Ads", "Website", "Referral", "Walk-in"].map((x) => <option key={x}>{x}</option>)}</select></label>
      <label>Type<select value={f.type} onChange={set("type")}>{["off-plan", "ready", "rent"].map((x) => <option key={x}>{x}</option>)}</select></label>
      <label>Priority<select value={f.priority} onChange={set("priority")}>{["hot", "warm", "cold"].map((x) => <option key={x}>{x}</option>)}</select></label>
      <label>Max budget (AED)<input inputMode="numeric" value={f.budget_max} onChange={set("budget_max")} /></label>
      {isAdmin ? <label>Assign to<select value={f.assigned_to} onChange={set("assigned_to")}><option value="">Unassigned</option>{members.map((m) => <option key={m.user_id} value={m.user_id}>{m.full_name}</option>)}</select></label> : null}
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}><button className="a-btn a-btn-line" onClick={onClose}>Cancel</button><button className="a-btn a-btn-gold" disabled={busy} onClick={() => void save()}>{busy ? "Saving…" : "Save lead"}</button></div>
    </div></div>
  );
}

export function parseCsv(text: string): string[][] {
  const rows: string[][] = []; let row: string[] = []; let cur = ""; let q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { if (c === '"' && text[i + 1] === '"') { cur += '"'; i++; } else if (c === '"') q = false; else cur += c; }
    else if (c === '"') q = true;
    else if (c === ",") { row.push(cur); cur = ""; }
    else if (c === "\n" || c === "\r") { if (c === "\r" && text[i + 1] === "\n") i++; row.push(cur); cur = ""; if (row.some((x) => x.trim())) rows.push(row); row = []; }
    else cur += c;
  }
  row.push(cur); if (row.some((x) => x.trim())) rows.push(row);
  return rows;
}

const FIELDS = { leads: ["name", "phone", "email", "source", "type", "priority", "budget_max"], listings: ["title", "community", "type", "bedrooms", "size_sqft", "price", "status"] } as const;

export function ImportModal({ kind, orgId, onClose, onDone }: { kind: "leads" | "listings"; orgId: string; onClose: () => void; onDone: () => void }) {
  const [rows, setRows] = useState<string[][]>([]);
  const [map, setMap] = useState<Record<string, number>>({});
  const [over, setOver] = useState(false);
  const [busy, setBusy] = useState(false);
  const fields = FIELDS[kind];
  const load = async (file?: File) => {
    if (!file) return;
    const r = parseCsv(await file.text());
    if (r.length < 2) { toast.error("The file needs a header row and at least one row"); return; }
    setRows(r);
    const head = r[0].map((h) => h.toLowerCase().replace(/[^a-z]/g, ""));
    const m: Record<string, number> = {};
    fields.forEach((f) => { const i = head.findIndex((h) => h.includes(f.replace(/_/g, "").replace("max", "")) || (f === "name" && h.includes("client")) || (f === "title" && h.includes("name"))); if (i >= 0) m[f] = i; });
    setMap(m);
  };
  const run = async () => {
    const req = kind === "leads" ? "name" : "title";
    if (map[req] === undefined) { toast.error(`Map a column to "${req}" first`); return; }
    setBusy(true);
    const num = new Set(["budget_max", "size_sqft", "price"]);
    const items = rows.slice(1).map((r) => { const o: Record<string, unknown> = { org_id: orgId }; fields.forEach((f) => { const i = map[f]; if (i !== undefined && r[i]?.trim()) o[f] = num.has(f) ? Number(r[i].replace(/[^0-9.]/g, "")) || null : r[i].trim(); }); return o; }).filter((o) => o[req]);
    let ok = 0;
    for (let i = 0; i < items.length; i += 200) { const { error } = await db.from(kind === "leads" ? "leads" : "org_listings").insert(items.slice(i, i + 200)); if (!error) ok += Math.min(200, items.length - i); }
    setBusy(false);
    await db.from("notifications").insert({ org_id: orgId, type: "import_done", title: `Import finished: ${ok} ${kind}`, body: `${items.length - ok} failed`, link: kind === "leads" ? "/app/crm" : "/app/listings" });
    toast.success(`Imported ${ok} of ${items.length} ${kind}`); onDone(); onClose();
  };
  return (
    <div className="a-modal" role="dialog" aria-label={`Import ${kind}`} onClick={(e) => e.target === e.currentTarget && onClose()}><div>
      <h2 style={{ margin: 0 }}>Import {kind} from CSV</h2>
      {!rows.length ? (
        <label className={`a-drop ${over ? "on" : ""}`} onDragOver={(e) => { e.preventDefault(); setOver(true); }} onDragLeave={() => setOver(false)} onDrop={(e) => { e.preventDefault(); setOver(false); void load(e.dataTransfer.files[0]); }}>
          <b>Drop a CSV file here</b><span className="muted">or click to choose one</span>
          <input type="file" accept=".csv,text/csv" hidden onChange={(e) => void load(e.target.files?.[0])} />
        </label>
      ) : (
        <>
          <p className="muted" style={{ margin: 0 }}>{rows.length - 1} rows found. Match your columns:</p>
          {fields.map((f) => (
            <label key={f}>{f.replace(/_/g, " ")}<select value={map[f] ?? ""} onChange={(e) => setMap({ ...map, [f]: e.target.value === "" ? (undefined as unknown as number) : Number(e.target.value) })}>
              <option value="">— skip —</option>{rows[0].map((h, i) => <option key={i} value={i}>{h}</option>)}
            </select></label>
          ))}
        </>
      )}
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}><button className="a-btn a-btn-line" onClick={onClose}>Cancel</button>{rows.length ? <button className="a-btn a-btn-gold" disabled={busy} onClick={() => void run()}>{busy ? "Importing…" : `Import ${rows.length - 1} rows`}</button> : null}</div>
    </div></div>
  );
}
