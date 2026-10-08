import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Info, MessageCircle, Plus, Upload } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { PriorityChip, TypeChip } from "@/components/app/chips";
import { Button } from "@/components/ui/button";
import { ago, formatAed, QUEUES, queueCount, queueLeads, SOURCES, wants, type Lead, type LeadType, type Queue } from "@/lib/demo-leads";

const QIDS: Queue[] = ["respond", "hot", "followup", "nurture", "all"];
type Search = { queue: Queue; q?: string | undefined };

export const Route = createFileRoute("/_authenticated/app/leads/")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    queue: QIDS.includes(s["queue"] as Queue) ? (s["queue"] as Queue) : "respond",
    q: typeof s["q"] === "string" && s["q"] ? (s["q"] as string) : undefined,
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
  const { queue, q } = Route.useSearch();
  const navigate = useNavigate();
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
  const open = (l: Lead) => navigate({ to: "/app/leads/$id", params: { id: l.id } });
  const toggle = (id: string) => setSel((s) => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  const allOn = view.length > 0 && view.every((l) => sel.has(l.id));
  const bulk = (what: string) => toast(`${what}: ${sel.size} lead${sel.size === 1 ? "" : "s"} (demo — nothing was sent)`);

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
                <tr key={l.id} onClick={() => open(l)}>
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
            <Link key={l.id} to="/app/leads/$id" params={{ id: l.id }} className="a-lcard">
              <span style={{ display: "flex", justifyContent: "space-between", gap: 10 }}><b>{l.name}</b><span className={`a-time ${t.late ? "t-hot" : ""}`} style={{ fontSize: 13.5 }}>{t.text}</span></span>
              <span className="muted" style={{ fontSize: 14 }}>{wants(l)} · <span className="num">{formatAed(l.budget)}</span></span>
              <span className="a-chips"><TypeChip type={l.type} /><PriorityChip lead={l} /><span className="a-chip c-stage">{l.stage}</span></span>
            </Link>
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
