import { createFileRoute, Link } from "@tanstack/react-router";
import { Eye, MessageCircle, Phone, Plus, RotateCcw, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { OwnerOverview } from "@/components/app/OwnerOverview";
import { PriorityChip } from "@/components/app/chips";
import { LEADS, queueLeads, stats, type Lead } from "@/lib/demo-leads";

export const Route = createFileRoute("/_authenticated/app/")({
  head: () => ({
    meta: [
      { title: "Home — DealOS Workspace" },
      { name: "description", content: "Next best action, work queues, lead pipeline and follow-ups for today." },
      { property: "og:title", content: "Home — DealOS Workspace" },
      { property: "og:description", content: "Your day as a Dubai broker, prioritised." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const [role, setRole] = useState<string | null | undefined>(undefined);
  useEffect(() => { void supabase.auth.getUser().then(({ data }) => (supabase as unknown as { from: (t: string) => any }).from("org_members").select("role").eq("user_id", data.user?.id ?? "").maybeSingle().then((r: { data: { role: string } | null }) => setRole(r.data?.role ?? null))); }, []);
  if (role === "company_admin") return <OwnerOverview />;
  return <AgentHome />;
}

function AgentHome() {
  const s = useMemo(stats, []);
  const [tab, setTab] = useState<"leads" | "bin">("leads");
  const [discarded, setDiscarded] = useState<ReadonlySet<string>>(new Set());
  const myLeads = useMemo(() => queueLeads("all").slice(0, 10), []);
  const binLeads = useMemo(() => LEADS.filter((l) => l.stage === "Lost").slice(0, 5), []);
  const rows = tab === "leads" ? myLeads : binLeads.filter((l) => !discarded.has(l.id));

  const kpis = [
    { label: "Active Leads", value: s.open, note: "assigned to you" },
    { label: "Hot", value: s.hot, note: "score 75+ · active" },
    { label: "Follow-Ups Due", value: s.followup, note: "due or overdue" },
    { label: "Won", value: s.won, note: "closed deals" },
  ];

  return (
    <div className="space-y-6">
      <div className="min-w-0">
        <p className="eyebrow-a" style={{ marginTop: 0 }}>AGENT VIEW</p>
        <h1 className="text-2xl font-semibold sm:text-3xl" style={{ color: "var(--a-ink)" }}>My leads</h1>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className="a-card min-w-0 overflow-hidden p-5">
            <p className="eyebrow-a" style={{ marginTop: 0 }}>{k.label}</p>
            <strong className="num block truncate text-3xl font-semibold" style={{ color: "var(--a-ink)" }}>{k.value.toLocaleString("en-US")}</strong>
            <p className="mt-1 text-sm opacity-70">{k.note}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex overflow-hidden rounded-full" style={{ border: "1px solid var(--a-line, currentColor)" }} role="tablist" aria-label="Lead views">
          {(["leads", "bin"] as const).map((t) => (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={tab === t}
              className="a-btn"
              style={{
                borderRadius: 0,
                background: tab === t ? "var(--brand-blue)" : "transparent",
                color: tab === t ? "var(--a-ink)" : "inherit",
              }}
              onClick={() => setTab(t)}
            >
              {t === "leads" ? "Leads" : "Bin"}
            </button>
          ))}
        </div>
        {tab === "leads" ? (
          <Link to="/app/crm" search={{ action: "add" }} className="a-btn a-btn-gold"><Plus size={16} /> Add lead</Link>
        ) : (
          <span className="text-sm opacity-70">{binLeads.length} discarded</span>
        )}
      </div>

      <div className="a-card min-w-0 overflow-x-auto p-5">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left opacity-70">
              <th className="py-2">Lead</th><th>Source</th><th>Stage</th><th>Priority</th><th>Agent</th><th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((l) => (
              <LeadRow key={l.id} lead={l} bin={tab === "bin"} onRestore={() => setDiscarded((prev) => new Set(prev).add(l.id))} />
            ))}
            {rows.length === 0 ? (
              <tr><td colSpan={6} className="py-6 text-center opacity-70">Bin is empty.</td></tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function LeadRow({ lead, bin, onRestore }: { lead: Lead; bin: boolean; onRestore: () => void }) {
  const tel = lead.phone.replace(/\s/g, "");
  const wa = `https://wa.me/${lead.phone.replace(/\D/g, "")}?text=${encodeURIComponent(`Hi ${lead.name.split(" ")[0]}, following up on your enquiry — when is a good time for a quick call?`)}`;
  return (
    <tr style={{ borderTop: "1px solid var(--a-line, currentColor)" }}>
      <td className="py-2">
        <span className="flex items-center gap-2">
          <span className="a-avatar">{lead.initials}</span>
          <span className="min-w-0">
            <b className="block truncate">{lead.name}</b>
            <small className="num opacity-70">{lead.phone}</small>
          </span>
        </span>
      </td>
      <td>{lead.source}</td>
      <td>{lead.stage}</td>
      <td><PriorityChip lead={lead} /></td>
      <td>You</td>
      <td>
        <span className="flex justify-end gap-2">
          {bin ? (
            <button type="button" className="a-link-gold inline-flex items-center gap-1" onClick={onRestore}><RotateCcw size={15} /> Restore</button>
          ) : (
            <>
              <Link to="/app/leads/$id" params={{ id: lead.id }} className="a-link-gold inline-flex items-center gap-1" aria-label={`View ${lead.name}`}><Eye size={15} /> View</Link>
              <a className="a-link-gold inline-flex items-center gap-1" href={`tel:${tel}`} aria-label={`Call ${lead.name}`}><Phone size={15} /> Call</a>
              <a className="a-link-gold inline-flex items-center gap-1" target="_blank" rel="noreferrer" href={wa} aria-label={`WhatsApp ${lead.name}`}><MessageCircle size={15} /> WhatsApp</a>
            </>
          )}
        </span>
      </td>
    </tr>
  );
}

// Kept for reference: icon used in the discarded-lead affordance.
void Trash2;
