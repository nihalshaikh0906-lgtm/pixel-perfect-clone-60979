import { mediaUrl } from "@/lib/media";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Mail, MessageCircle, Phone, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { AiChat } from "@/components/app/AiChat";
import { useShell } from "@/components/app/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { ago, formatAed, LEAD_BY_ID, OPEN_STAGES, priorityOf, wants, type Lead, type Stage } from "@/lib/demo-leads";
import { PriorityChip, TypeChip } from "@/components/app/chips";
import { PropertyPackDrawer } from "@/components/PropertyPackDrawer";
import { UnitCard, type MatchRow } from "@/components/UnitCard";

export const Route = createFileRoute("/_authenticated/app/leads/$id")({
  head: () => ({
    meta: [
      { title: "Lead — DealOS Workspace" },
      { name: "description", content: "Lead profile, matched units from your inventory and an AI assistant for this client." },
      { property: "og:title", content: "Lead — DealOS Workspace" },
      { property: "og:description", content: "Everything about one lead in one place." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LeadPage,
});

const NOTES_KEY = (id: string) => `dealos-demo-notes:${id}`;

function LeadPage() {
  const { id } = Route.useParams();
  const lead = LEAD_BY_ID.get(id);
  if (!lead) return <div className="a-card"><h2>Lead not found</h2><p className="muted" style={{ marginTop: 8 }}>There is no lead with ID {id}.</p><Link to="/app/leads" search={{ queue: "all" }} className="a-link-gold" style={{ marginTop: 12 }}>Back to inbox</Link></div>;
  return <LeadDetail key={lead.id} lead={lead} />;
}

function LeadDetail({ lead }: { lead: Lead }) {
  const { clientMode } = useShell();
  const [stage, setStage] = useState<Stage>(lead.stage);
  const [openUnit, setOpenUnit] = useState<MatchRow | null>(null);
  const [notes, setNotes] = useState<{ at: string; text: string }[]>([]);
  useEffect(() => { try { setNotes(JSON.parse(localStorage.getItem(NOTES_KEY(lead.id)) ?? "[]")); } catch { setNotes([]); } }, [lead.id]);
  const saveNote = (text: string) => {
    const next = [{ at: new Date().toISOString(), text }, ...notes];
    setNotes(next); localStorage.setItem(NOTES_KEY(lead.id), JSON.stringify(next)); toast("Summary saved to this lead's notes");
  };

  const units = useQuery({
    queryKey: ["lead-units", lead.id],
    enabled: lead.type !== "Rent",
    queryFn: async () => {
      const { data, error } = await supabase.rpc("search_units", { p_limit: 6, p_budget_max: Math.round(lead.budget * 1.1), ...(lead.beds ? { p_bedrooms: [lead.beds] } : {}) });
      if (error) throw new Error(error.message);
      return data ?? [];
    },
  });

  const p = priorityOf(lead);
  const ringColor = p === "Hot" ? "var(--a-hot)" : p === "Warm" ? "var(--a-warm)" : "var(--a-cold)";
  const C = 2 * Math.PI * 36;
  const context = `Lead file (demo data): ${lead.name}, ${lead.country}. Wants ${wants(lead)}, ${lead.type}, budget ${formatAed(lead.budget)} (${lead.payment}). Stage ${stage}, score ${lead.score} (${p}). Source ${lead.source}, received ${ago(lead.receivedHoursAgo)}. Their message: "${lead.message}". Use only real inventory; never invent projects or prices.`;

  return (
    <>
      <Link to="/app/leads" search={{ queue: "all" }} className="a-link-gold"><ArrowLeft size={15} /> Leads inbox</Link>
      <div className="a-detail">
        <section className="a-card a-fade" aria-label="Lead profile">
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <div className="a-ring" aria-label={`Score ${lead.score}`}>
              <svg viewBox="0 0 84 84"><circle cx="42" cy="42" r="36" fill="none" stroke="var(--a-line)" strokeWidth="7" /><circle cx="42" cy="42" r="36" fill="none" stroke={ringColor} strokeWidth="7" strokeLinecap="round" strokeDasharray={`${(lead.score / 100) * C} ${C}`} /></svg>
              <span className="num">{lead.score}</span>
            </div>
            <div style={{ minWidth: 0 }}><h1 style={{ fontSize: 24 }}>{lead.name}</h1><p className="muted num" style={{ fontSize: 14 }}>{lead.id} · {lead.country}</p><div className="a-chips" style={{ marginTop: 8 }}><TypeChip type={lead.type} /><PriorityChip lead={lead} /></div></div>
          </div>
          <div className="a-chips" style={{ marginTop: 18 }}>
            <a className="a-btn a-btn-ink a-btn-sm" href={`tel:${lead.phone.replace(/\s/g, "")}`}><Phone size={14} /> Call</a>
            <a className="a-btn a-btn-line a-btn-sm" target="_blank" rel="noreferrer" href={`https://wa.me/${lead.phone.replace(/\D/g, "")}`}><MessageCircle size={14} /> WhatsApp</a>
            <button type="button" className="a-btn a-btn-line a-btn-sm" onClick={() => toast("Email is not connected in the demo yet.")}><Mail size={14} /> Email</button>
          </div>
          <h2 style={{ fontSize: 16, marginTop: 24 }}>Requirements</h2>
          <dl className="a-kv" style={{ marginTop: 10 }}>
            <dt>Wants</dt><dd>{wants(lead)}</dd>
            <dt>Budget</dt><dd className="num">{formatAed(lead.budget)}{lead.type === "Rent" ? " / year" : ""}</dd>
            <dt>Payment</dt><dd>{lead.payment}</dd>
            <dt>Phone</dt><dd className="num">{lead.phone}</dd>
            <dt>Source</dt><dd>{lead.source}</dd>
          </dl>
          <label style={{ display: "block", marginTop: 20 }}>
            <span className="eyebrow-a">Stage</span>
            <select className="a-select" style={{ width: "100%", marginTop: 6 }} value={stage} onChange={(e) => { setStage(e.target.value as Stage); toast(`Stage set to ${e.target.value} (demo only)`); }}>
              {[...OPEN_STAGES, "Won", "Lost"].map((s) => <option key={s}>{s}</option>)}
            </select>
          </label>
          <h2 style={{ fontSize: 16, marginTop: 24 }}>Activity</h2>
          <ul className="a-timeline" style={{ marginTop: 12 }}>
            {notes.filter(() => !clientMode).map((nt) => <li key={nt.at}>{nt.text}<small>AI summary · {new Date(nt.at).toLocaleString("en-GB", { timeZone: "Asia/Dubai", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</small></li>)}
            {lead.contacted ? <li>First contact made<small>by you</small></li> : null}
            <li>“{lead.message}”<small>Message via {lead.source} · {ago(lead.receivedHoursAgo)}</small></li>
            <li>Lead created<small>{lead.source} · {ago(lead.receivedHoursAgo)}</small></li>
          </ul>
        </section>

        <section className="a-card a-fade" style={{ animationDelay: "40ms" }} aria-label="Matched units">
          <div className="a-card-head"><h2>Matched units</h2><button type="button" className="a-btn a-btn-gold a-btn-sm" disabled={!units.data?.length} onClick={() => toast("Shortlist sending is not connected in the demo yet.")}><Send size={14} /> Send shortlist</button></div>
          {lead.type === "Rent" ? <p className="muted">Rental matching isn't available yet — your inventory currently lists sale units.</p>
            : units.isLoading ? <p className="muted">Searching your inventory…</p>
            : units.error ? <p className="a-err" role="alert">{(units.error as Error).message}</p>
            : !units.data?.length ? <p className="muted">No units in your inventory match this budget and size.</p>
            : <div className="a-property-grid">
                {units.data.map((u) => (
                  <UnitCard key={u.unit_id} row={u} onOpen={setOpenUnit} />
                ))}
              </div>}
        </section>

        <section className="a-card a-fade" style={{ animationDelay: "80ms", padding: 0, height: 600, display: "flex" }} aria-label="AI assistant for this lead">
          <AiChat title={`AI · ${lead.name}`} context={context} onSaveSummary={saveNote} suggestions={["What should I say on the first call?", "Draft a WhatsApp follow-up", "Which matched unit fits best and why?"]} />
        </section>
      </div>
      <PropertyPackDrawer unit={openUnit} clientId={null} clientPhone={lead.phone} onClose={() => setOpenUnit(null)} />
    </>
  );
}
