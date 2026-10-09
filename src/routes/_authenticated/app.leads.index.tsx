import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Info, Link2, Mail, MessageCircle, Plus, Upload, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { PriorityChip, TypeChip } from "@/components/app/chips";
import { Button } from "@/components/ui/button";
import { ago, formatAed, LEAD_BY_ID, QUEUES, queueCount, queueLeads, SOURCES, wants, type Lead, type LeadType, type Queue } from "@/lib/demo-leads";

const QIDS: Queue[] = ["respond", "hot", "followup", "nurture", "all"];
type Search = { queue: Queue; q?: string | undefined; lead?: string | undefined };

export const Route = createFileRoute("/_authenticated/app/leads/")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    queue: QIDS.includes(s["queue"] as Queue) ? (s["queue"] as Queue) : "respond",
    q: typeof s["q"] === "string" && s["q"] ? (s["q"] as string) : undefined,
    lead: typeof s["lead"] === "string" && s["lead"] ? (s["lead"] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Leads inbox — DealOS Workspace" },
      { name: "description", content: "Every lead sorted by what needs you first: respond now, hot, follow-up due and nurture queues." },
      { property: "og:title", content: "Leads inbox — DealOS Workspace" },
      { property: "og:description", content: "Work your leads queue by queue." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Inbox,
});

const PAGE = 25;
const waLink = (l: Lead) => `https://wa.me/${l.phone.replace(/\D/g, "")}?text=${encodeURIComponent(`Hi ${l.name.split(" ")[0]}, thanks for your enquiry about ${wants(l)}. When is a good time for a quick call?`)}`;
function timeOf(l: Lead) {
  if (l.followUpDueInHours !== null && l.followUpDueInHours <= 0) return { text: `${ago(-l.followUpDueInHours || 0.5)} overdue`, late: true };
  return { text: ago(l.receivedHoursAgo), late: l.stage === "New" && l.receivedHoursAgo > 0.1 };
}

function Inbox() {
  const { queue, q, lead } = Route.useSearch();
  const navigate = Route.useNavigate();
  const [type, setType] = useState<"All" | LeadType>("All");
  const [source, setSource] = useState("All");
  const [text, setText] = useState(q ?? "");
  const [page, setPage] = useState(0);
  const [sel, setSel] = useState<Set<string>>(new Set());

  const base = useMemo(() => queueLeads(queue), [queue]);
  const rows = useMemo(() => {
    const t = text.trim().toLowerCase();
    return base.filter((l) => (type === "All" || l.type === type) && (source === "All" || l.source === source) && (!t || l.name.toLowerCase().includes(t) || l.area.toLowerCase().includes(t) || l.id.toLowerCase().includes(t)));
  }, [base, type, source, text]);
  const pages = Math.max(1, Math.ceil(rows.length / PAGE));
  const view = rows.slice(page * PAGE, page * PAGE + PAGE);
  const info = QUEUES.find((x) => x.id === queue);
  const open = (l: Lead) => void navigate({ search: (s) => ({ ...s, lead: l.id }) });
  const openLead = (l: Lead) => void navigate({ to: "/app/leads/$id", params: { id: l.id } });
  const close360 = () => void navigate({ search: (s) => ({ ...s, lead: undefined }) });
  const toggle = (id: string) => setSel((s) => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  const allOn = view.length > 0 && view.every((l) => sel.has(l.id));
  const bulk = (what: string) => toast(`${what}: ${sel.size} lead${sel.size === 1 ? "" : "s"} (demo — nothing was sent)`);
  const active = lead ? LEAD_BY_ID.get(lead) ?? null : null;

  return (
    <>
      <section className="a-band a-fade">
        <div>
          <p className="eyebrow-a">Work</p>
          <h1>Leads inbox</h1>
          <p className="sub">1,000 example leads from portals, ads, WhatsApp and referrals, sorted by what needs you first</p>
        </div>
        <div className="a-band-actions">
          <button type="button" className="a-btn a-btn-line" onClick={() => toast("Import is not connected in the demo yet.")}><Upload size={16} /> Import leads</button>
          <Button asChild className="a-btn a-btn-ink"><Link to="/app/crm" search={{ action: "add" }}><Plus size={16} /> New lead</Link></Button>
        </div>
      </section>

      <div className="a-tabs" role="tablist" aria-label="Queues">
        {QUEUES.map((x) => (
          <Link key={x.id} role="tab" aria-selected={queue === x.id} to="/app/leads" search={{ queue: x.id }} onClick={() => { setPage(0); setSel(new Set()); }} className={`a-tab ${queue === x.id ? "active" : ""}`}>
            {x.label} <span className="num">{queueCount(x.id).toLocaleString("en-US")}</span>
          </Link>
        ))}
      </div>
      {info ? <div className="a-info"><Info size={17} /> {info.info}</div> : null}

      <section className="a-card" style={{ padding: 0 }}>
        <div className="a-filters">
          {(["All", "Off-plan", "Ready", "Rent"] as const).map((t) => (
            <button key={t} type="button" className={`a-pill ${type === t ? "active" : ""}`} aria-pressed={type === t} onClick={() => { setType(t); setPage(0); }}>{t === "All" ? "All types" : t}</button>
          ))}
          <select className="a-select" value={source} onChange={(e) => { setSource(e.target.value); setPage(0); }} aria-label="Source">
            <option value="All">All sources</option>
            {SOURCES.map((s) => <option key={s}>{s}</option>)}
          </select>
          <input className="a-input" value={text} onChange={(e) => { setText(e.target.value); setPage(0); }} placeholder="Filter by name or area" aria-label="Filter by name or area" />
          <span className="a-count num">{rows.length.toLocaleString("en-US")} leads</span>
        </div>

        <div className="a-table-wrap">
          <table className="a-table">
            <thead><tr>
              <th style={{ width: 44 }}><input type="checkbox" aria-label="Select all on this page" checked={allOn} onChange={() => setSel((s) => { const n = new Set(s); view.forEach((l) => (allOn ? n.delete(l.id) : n.add(l.id))); return n; })} /></th>
              <th>Lead</th><th>Type</th><th>Wants</th><th>Priority</th><th>Stage</th><th>Source</th><th>Time</th><th />
            </tr></thead>
            <tbody>
              {view.map((l) => { const t = timeOf(l); return (
                <tr key={l.id} onClick={() => open(l)} tabIndex={0} aria-label={`Open Lead 360 for ${l.name}`} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); open(l); } }}>
                  <td onClick={(e) => e.stopPropagation()}><input type="checkbox" aria-label={`Select ${l.name}`} checked={sel.has(l.id)} onChange={() => toggle(l.id)} /></td>
                  <td><b>{l.name}</b><small className="num">{l.id} · {l.country}</small></td>
                  <td><TypeChip type={l.type} /></td>
                  <td><b style={{ fontWeight: 600 }}>{wants(l)}</b><small className="num">{formatAed(l.budget)}{l.type === "Rent" ? "/yr" : ""} · {l.payment}</small></td>
                  <td><PriorityChip lead={l} /></td>
                  <td><span className="a-chip c-stage">{l.stage}</span></td>
                  <td style={{ whiteSpace: "nowrap" }}>{l.source}</td>
                  <td className={`a-time ${t.late ? "t-hot" : ""}`}>{t.text}</td>
                  <td onClick={(e) => e.stopPropagation()}><a className="a-btn a-btn-line a-btn-sm" href={waLink(l)} target="_blank" rel="noreferrer"><MessageCircle size={14} /> WhatsApp</a></td>
                </tr>
              ); })}
            </tbody>
          </table>
        </div>

        <div className="a-cards">
          {view.map((l) => { const t = timeOf(l); return (
            <button key={l.id} type="button" className="a-lcard" aria-label={`Open Lead 360 for ${l.name}`} onClick={() => open(l)}>
              <span style={{ display: "flex", justifyContent: "space-between", gap: 10 }}><b>{l.name}</b><span className={`a-time ${t.late ? "t-hot" : ""}`} style={{ fontSize: 13.5 }}>{t.text}</span></span>
              <span className="muted" style={{ fontSize: 14 }}>{wants(l)} · <span className="num">{formatAed(l.budget)}</span></span>
              <span className="a-chips"><TypeChip type={l.type} /><PriorityChip lead={l} /><span className="a-chip c-stage">{l.stage}</span></span>
            </button>
          ); })}
        </div>

        {rows.length === 0 ? <p className="muted" style={{ padding: 24 }}>No leads match these filters.</p> : null}
        <div className="a-pager">
          <span className="num">Page {page + 1} of {pages}</span>
          <span style={{ display: "flex", gap: 8 }}>
            <button type="button" className="a-btn a-btn-line a-btn-sm" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>Previous</button>
            <button type="button" className="a-btn a-btn-line a-btn-sm" disabled={page >= pages - 1} onClick={() => setPage((p) => p + 1)}>Next</button>
          </span>
        </div>
      </section>

      {active ? <Lead360 l={active} onClose={close360} onOpenLead={() => openLead(active)} /> : null}

      {sel.size ? (
        <div className="a-bulk" role="toolbar" aria-label="Bulk actions">
          <b className="num">{sel.size} selected</b>
          {["Assign", "Change stage", "Send WhatsApp template", "Add tag", "Export"].map((a) => <button key={a} type="button" className="a-btn a-btn-line a-btn-sm" onClick={() => bulk(a)}>{a}</button>)}
          <button type="button" className="a-btn a-btn-line a-btn-sm" style={{ marginLeft: "auto" }} onClick={() => setSel(new Set())}>Clear</button>
        </div>
      ) : null}
    </>
  );
}

const L360_TABS = ["Overview", "Timeline", "Follow-Ups", "Viewings", "Offers", "Matching"] as const;
type L360Tab = (typeof L360_TABS)[number];

const L360_NOTE: Record<L360Tab, string> = {
  Overview: "Overview is a placeholder while this lead's profile is being built — qualification notes and the next best action will land here.",
  Timeline: "Every reply, stage change and note for this lead will collect here as they happen.",
  "Follow-Ups": "Follow-up tasks you set for this lead will show here with their due dates.",
  Viewings: "No viewings booked yet. Booked and completed visits will be listed here with dates.",
  Offers: "No offer recorded yet. Offers, token money and agreements for this lead will show here.",
  Matching: "Matched units come from your own inventory search, which runs on the full lead page.",
};

function Lead360({ l, onClose, onOpenLead }: { l: Lead; onClose: () => void; onOpenLead: () => void }) {
  const [tab, setTab] = useState<L360Tab>("Overview");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const link = `${window.location.origin}/app/leads?lead=${l.id}`;
  const summary = `${l.name} — ${wants(l)} · ${formatAed(l.budget)}`;
  const copy = async () => {
    try { await navigator.clipboard.writeText(link); toast.success("Lead link copied"); }
    catch { toast.error("Your browser blocked the copy — grab it from the address bar"); }
  };
  const email = () => { window.location.href = `mailto:?subject=${encodeURIComponent(`Lead: ${l.name}`)}&body=${encodeURIComponent(`${summary}\n${link}`)}`; };

  const due = l.followUpDueInHours === null
    ? null
    : l.followUpDueInHours <= 0
      ? `${ago(-l.followUpDueInHours || 0.5)} overdue`
      : `due in ${Math.round(l.followUpDueInHours)} h`;

  const events: { h: string; s: string }[] = [
    { h: `Now at stage ${l.stage}`, s: "current stage" },
    l.contacted ? { h: "First contact made", s: "by you" } : { h: "Waiting for a first reply", s: "nobody has answered yet" },
    { h: `“${l.message}”`, s: `Message via ${l.source} · ${ago(l.receivedHoursAgo)}` },
    { h: "Lead created", s: `${l.source} · ${ago(l.receivedHoursAgo)}` },
  ];

  return (
    <div className="a-modal a-360-modal" role="dialog" aria-modal="true" aria-label={`Lead 360 — ${l.name}`} onClick={(e) => e.target === e.currentTarget && onClose()}><div>
      <div className="a-deal-head">
        <div style={{ minWidth: 0 }}>
          <p className="eyebrow-a" style={{ margin: 0 }}>Lead <span className="num">{l.id}</span> · {l.country}</p>
          <h2 style={{ margin: "2px 0 0" }}>{l.name}</h2>
          <div className="a-chips" style={{ marginTop: 8 }}>
            <PriorityChip lead={l} />
            <TypeChip type={l.type} />
            <span className="a-chip c-stage">{l.stage}</span>
          </div>
        </div>
        <div className="a-360-acts">
          <a className="a-btn a-btn-line a-btn-sm" href={waLink(l)} target="_blank" rel="noreferrer"><MessageCircle size={14} /> WhatsApp</a>
          <button type="button" className="a-btn a-btn-line a-btn-sm" onClick={email}><Mail size={14} /> Email</button>
          <button type="button" className="a-btn a-btn-line a-btn-sm" onClick={() => void copy()}><Link2 size={14} /> Link</button>
          <button type="button" className="a-btn a-btn-line a-btn-sm" onClick={onOpenLead}><ArrowUpRight size={14} /> Open lead</button>
          <button type="button" className="a-btn a-btn-line a-btn-sm" aria-label="Close lead 360" onClick={onClose}><X size={14} /></button>
        </div>
      </div>

      <div className="a-tabs" role="tablist" aria-label="Lead 360 sections">
        {L360_TABS.map((t) => (
          <button key={t} type="button" role="tab" aria-selected={tab === t} className={`a-tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>

      <div role="tabpanel" aria-label={tab} className="a-360-panel">
        <p className="a-note" style={{ margin: 0 }}>{L360_NOTE[tab]}</p>

        {tab === "Overview" ? (
          <>
            <p style={{ margin: "10px 0 0", fontSize: 14.5, lineHeight: 1.6 }}>
              {l.name} came in through {l.source} asking about {wants(l)}, on a {l.payment.toLowerCase()} basis at {formatAed(l.budget)}.
              The enquiry is still open at {l.stage.toLowerCase()} with a {l.score} score, so this file needs a reply and a shortlist before anything else.
              This panel is a placeholder — the qualification summary and the next best action will be written here.
            </p>
            <dl className="a-kv" style={{ margin: "14px 0 0" }}>
              <dt>Wants</dt><dd>{wants(l)}</dd>
              <dt>Budget</dt><dd className="num">{formatAed(l.budget)}{l.type === "Rent" ? " / year" : ""}</dd>
              <dt>Payment</dt><dd>{l.payment}</dd>
              <dt>Phone</dt><dd className="num">{l.phone}</dd>
              <dt>Source</dt><dd>{l.source}</dd>
              <dt>Received</dt><dd>{ago(l.receivedHoursAgo)}</dd>
            </dl>
          </>
        ) : null}

        {tab === "Timeline" ? (
          <ul className="a-timeline" style={{ margin: "12px 0 0" }}>
            {events.map((e) => <li key={e.h}>{e.h}<small>{e.s}</small></li>)}
          </ul>
        ) : null}

        {tab === "Follow-Ups" ? (
          due ? (
            <dl className="a-kv" style={{ margin: "14px 0 0" }}>
              <dt>Next task</dt><dd>{l.task}</dd>
              <dt>Due</dt><dd>{due}</dd>
            </dl>
          ) : <p className="a-note" style={{ margin: 0 }}>No follow-up is scheduled for this lead yet.</p>
        ) : null}

        {tab === "Matching" ? (
          <button type="button" className="a-btn a-btn-gold a-btn-sm" style={{ justifySelf: "start" }} onClick={onOpenLead}><ArrowUpRight size={14} /> Run the inventory search</button>
        ) : null}
      </div>
    </div></div>
  );
}
