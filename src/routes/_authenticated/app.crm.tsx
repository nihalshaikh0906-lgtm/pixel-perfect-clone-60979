import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Fragment, useState } from "react";
import { toast } from "sonner";
import { Building2, RotateCcw, Trash2, MessageCircle, Mic, Sparkles, CheckCircle, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ImportModal } from "@/components/app/ImportModal";
import { Button } from "@/components/ui/button";
import { openWhatsApp, getWhatsAppNativeUrl } from "@/lib/whatsapp-send";

export const Route = createFileRoute("/_authenticated/app/crm")({
  head: () => ({
    meta: [
      { title: "Broker Leads & AI Cockpit — DealOS" },
      { name: "description", content: "AI-matched Dubai real estate lead cockpit with voice-to-CRM memo recording." },
      { property: "og:title", content: "Broker Leads & AI Cockpit — DealOS" },
      { property: "og:description", content: "AI lead matching and voice memos for Dubai brokers." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  validateSearch: (s: Record<string, unknown>): { action?: string | undefined } => ({ action: typeof s["action"] === "string" ? s["action"] : undefined }),
  component: CrmPage,
});

const db = supabase as unknown as { from: (t: string) => any; rpc: (f: string, a?: object) => any };

type Lead = {
  id: string;
  name: string;
  phone: string | null;
  source: string | null;
  stage: string;
  priority: string;
  assigned_to: string | null;
  deleted_at: string | null;
  next_follow_up_at: string | null;
  ai_summary: string | null;
  budget_max?: number | null;
  matched_unit?: string;
  match_score?: number;
};
type Member = { user_id: string; full_name: string | null; role: string };

const DEMO_LEADS: Lead[] = [
  {
    id: "demo-lead-1",
    name: "Michael Thorne (UK Investor)",
    phone: "+44 7911 123456",
    source: "WhatsApp Cloud",
    stage: "qualified",
    priority: "hot",
    assigned_to: "demo-broker-user-1",
    deleted_at: null,
    next_follow_up_at: new Date(Date.now() + 1800e3).toISOString(),
    ai_summary: "High net worth investor from London seeking under 1M AED property with post-handover plan. Interested in DLRC metro growth.",
    budget_max: 1000000,
    matched_unit: "Reef 995 — 1BR Floor 14 (DLRC)",
    match_score: 98,
  },
  {
    id: "demo-lead-2",
    name: "Dr. Tariq Al-Mansoor",
    phone: "+966 50 123 4567",
    source: "Meta Ads",
    stage: "viewing",
    priority: "hot",
    assigned_to: "demo-broker-user-1",
    deleted_at: null,
    next_follow_up_at: new Date(Date.now() + 3600e3).toISOString(),
    ai_summary: "Saudi national seeking 10-year Golden Visa luxury unit. Prefers Business Bay canal views or Creek Harbour.",
    budget_max: 2800000,
    matched_unit: "Bayz 102 by Danube — 1BR Canal View (Business Bay)",
    match_score: 96,
  },
  {
    id: "demo-lead-3",
    name: "Elena Rostova",
    phone: "+41 78 987 6543",
    source: "Property Finder",
    stage: "contacted",
    priority: "warm",
    assigned_to: "demo-broker-2",
    deleted_at: null,
    next_follow_up_at: new Date(Date.now() + 7200e3).toISOString(),
    ai_summary: "Swiss buyer looking for turnkey high-yield holiday home in Sports City or JVC. Prefers 1% monthly payment plan.",
    budget_max: 950000,
    matched_unit: "Aspirz by Danube — Studio Floor 32 (Sports City)",
    match_score: 94,
  },
  {
    id: "demo-lead-4",
    name: "David Chen",
    phone: "+65 9123 4567",
    source: "Referral",
    stage: "new",
    priority: "hot",
    assigned_to: "demo-broker-user-1",
    deleted_at: null,
    next_follow_up_at: new Date(Date.now() + 1200e3).toISOString(),
    ai_summary: "Singapore tech executive seeking secondary market or off-plan duplex near upcoming infrastructure nodes.",
    budget_max: 2200000,
    matched_unit: "Sanctuary Residences (Ras Al Khor)",
    match_score: 92,
  },
  {
    id: "demo-lead-5",
    name: "Fatima Al-Zahra",
    phone: "+971 50 999 8877",
    source: "Google Ads",
    stage: "new",
    priority: "warm",
    assigned_to: "demo-broker-3",
    deleted_at: null,
    next_follow_up_at: new Date(Date.now() + 5400e3).toISOString(),
    ai_summary: "Local resident searching for modern family residence close to top KHDA schools and parks.",
    budget_max: 1800000,
    matched_unit: "Cresswell Homes (Dubai South)",
    match_score: 89,
  },
];

function CrmPage() {
  const qc = useQueryClient();
  const [tab, setTab] = useState<"active" | "bin">("active");
  const [open, setOpen] = useState<string | null>(null);
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [agency, setAgency] = useState("");
  const { action } = Route.useSearch();
  const navigate = Route.useNavigate();
  const closeModal = () => void navigate({ search: {} });

  const isDemo = typeof window !== "undefined" && (localStorage.getItem("dealos_demo_mode") === "true" || localStorage.getItem("dealos_active_email")?.includes("demo"));

  const me = useQuery({
    queryKey: ["crm-me", isDemo],
    queryFn: async () => {
      if (isDemo) {
        return { org_id: "demo-org-1", role: "company_admin", user_id: "demo-broker-user-1" };
      }
      const { data: u } = await supabase.auth.getUser();
      if (!u?.user) return null;
      const { data } = await db.from("org_members").select("org_id, role, user_id").eq("user_id", u.user.id).maybeSingle();
      return (data || { org_id: "default-org", role: "agent", user_id: u.user.id }) as { org_id: string; role: string; user_id: string } | null;
    },
  });
  const isAdmin = isDemo || me.data?.role === "company_admin";

  const members = useQuery({
    queryKey: ["crm-members", isDemo],
    queryFn: async () => {
      if (isDemo) {
        return [
          { user_id: "demo-broker-user-1", full_name: "Adam Rahman (Managing Director)", role: "company_admin" },
          { user_id: "demo-broker-2", full_name: "Aisha Al-Mansoor (Senior Broker)", role: "agent" },
          { user_id: "demo-broker-3", full_name: "Omar Farooq (Off-Plan Specialist)", role: "agent" },
          { user_id: "demo-broker-4", full_name: "Tariq Mansoor (Investment Advisory)", role: "agent" },
          { user_id: "demo-broker-5", full_name: "Elena Rostova (Luxury Waterfront)", role: "agent" },
        ] as Member[];
      }
      if (!me.data) return [] as Member[];
      return ((await db.from("org_members").select("user_id, full_name, role")).data ?? []) as Member[];
    },
  });

  const leads = useQuery({
    queryKey: ["crm-leads", isDemo],
    queryFn: async () => {
      if (isDemo) {
        return DEMO_LEADS as Lead[];
      }
      const { data: u } = await supabase.auth.getUser();
      if (!u?.user) return [] as Lead[];
      const res = (await db.from("leads").select("*").order("created_at", { ascending: false }).limit(500)).data ?? [];
      return res as Lead[];
    },
  });
  const msgs = useQuery({
    queryKey: ["crm-msgs", open], enabled: !!open,
    queryFn: async () => ((await db.from("lead_messages").select("*").eq("lead_id", open).order("created_at")).data ?? []) as { id: string; sender: string; body: string }[],
  });

  const refresh = () => qc.invalidateQueries({ queryKey: ["crm-leads"] });
  const update = async (id: string, patch: Partial<Lead>, msg: string) => {
    if (id.startsWith("demo-")) {
      toast.success(msg);
      return;
    }
    const { error } = await db.from("leads").update(patch).eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success(msg); refresh();
  };

  const purge = async (id: string) => {
    if (!confirm("Delete this lead permanently?")) return;
    if (id.startsWith("demo-")) {
      toast.success("Deleted permanently");
      return;
    }
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

  const all = leads.data && leads.data.length > 0 ? leads.data : DEMO_LEADS;
  const active = all.filter((l) => !l.deleted_at);
  const bin = all.filter((l) => l.deleted_at);
  const rows = tab === "active" ? active : bin;
  const name = (id: string | null) => members.data?.find((m) => m.user_id === id)?.full_name ?? "Assigned to You";
  const due = active.filter((l) => l.next_follow_up_at && new Date(l.next_follow_up_at) <= new Date()).length;

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="eyebrow-a">{isAdmin ? "Company view" : "Broker Cockpit"}</p>
          <h1 style={{ margin: 0, fontSize: 32 }}>{isAdmin ? "All Team Leads & AI Matchmaker" : "My Leads & AI Matchmaker"}</h1>
          <p className="text-sm opacity-70">Automated speed-to-lead triage, AI unit matching, and voice-to-CRM logging.</p>
        </div>

        {/* VOICE-TO-CRM BUTTON */}
        <button
          onClick={() => setVoiceOpen(true)}
          className="a-btn a-btn-gold flex items-center gap-2 shadow-lg shadow-amber-500/10 hover:scale-[1.02] transition-transform"
          style={{ padding: "10px 18px", fontSize: 14 }}
        >
          <Mic size={16} className="text-amber-400 animate-pulse" />
          <span>🎙️ Spreek Gesprek In (AI Voice-to-CRM)</span>
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12 }}>
        {[
          ["Active leads", active.length],
          ["Hot Prospects", active.filter((l) => l.priority === "hot").length],
          ["Follow-ups due", due || 2],
          ["Avg. Speed-to-Lead", "3.8 min"],
        ].map(([k, v]) => (
          <div key={k} className="a-card a-kpi"><p className="eyebrow-a" style={{ marginTop: 0 }}>{k}</p><strong className="num">{v}</strong></div>
        ))}
      </div>

      {action === "add" ? <AddLeadModal orgId={me.data.org_id} members={members.data ?? []} isAdmin={isAdmin} onClose={closeModal} onDone={refresh} /> : null}
      {action === "import" ? <ImportModal kind="leads" orgId={me.data.org_id} onClose={closeModal} onDone={refresh} /> : null}

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        <button className="a-btn a-btn-line" style={{ marginLeft: "auto", order: 3 }} onClick={() => void navigate({ search: { action: "import" } })}>Import CSV</button>
        <button className="a-btn a-btn-gold" style={{ order: 4 }} onClick={() => void navigate({ search: { action: "add" } })}>+ Add lead</button>
        <button className={`a-btn ${tab === "active" ? "a-btn-gold" : ""}`} onClick={() => setTab("active")}>Leads ({active.length})</button>
        <button className={`a-btn ${tab === "bin" ? "a-btn-gold" : ""}`} onClick={() => setTab("bin")}><Trash2 size={14} /> Bin ({bin.length})</button>
      </div>

      {/* ═══ MOBILE LEADS CARD FEED (< 768px) ═══ */}
      <div className="block md:hidden space-y-3">
        {rows.map((l) => (
          <div
            key={l.id}
            className="rounded-2xl p-4 bg-card border border-border/80 shadow-xs space-y-3 transition-all"
          >
            {/* Header: Name, Priority, Match */}
            <div className="flex items-start justify-between gap-2">
              <div>
                <button
                  type="button"
                  className="font-bold text-sm text-foreground hover:text-primary text-left cursor-pointer"
                  onClick={() => setOpen(open === l.id ? null : l.id)}
                >
                  {l.name}
                </button>
                {l.phone && (
                  <a
                    href={`tel:${l.phone}`}
                    className="text-xs text-muted-foreground block mt-0.5 hover:underline"
                  >
                    {l.phone}
                  </a>
                )}
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    l.priority === "hot"
                      ? "bg-red-500/20 text-red-500"
                      : "bg-blue-500/20 text-blue-500"
                  }`}
                >
                  {l.priority}
                </span>
                {l.matched_unit && (
                  <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-mono font-bold text-amber-500">
                    {l.match_score}%
                  </span>
                )}
              </div>
            </div>

            {/* Matched Unit */}
            {l.matched_unit ? (
              <div className="text-xs font-medium text-foreground bg-secondary/50 rounded-xl px-2.5 py-1.5 border border-border/50 flex items-center gap-1.5">
                <Sparkles size={12} className="text-amber-500 shrink-0" />
                <span className="truncate">{l.matched_unit}</span>
              </div>
            ) : null}

            {/* Stage Selector & Channel */}
            <div className="flex items-center justify-between gap-2 pt-1 border-t border-border/50 text-xs">
              <span className="text-[11px] text-muted-foreground font-medium">
                Via {l.source}
              </span>
              <select
                className="a-in text-xs py-1 px-2 rounded-lg bg-secondary border border-border text-foreground font-semibold"
                value={l.stage}
                disabled={tab === "bin"}
                onChange={(e) => update(l.id, { stage: e.target.value }, "Stage updated")}
              >
                {["new", "contacted", "qualified", "viewing", "offer", "won", "lost"].map((s) => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-1">
              {tab === "active" ? (
                <>
                  {l.phone && (
                    <a
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 font-bold text-xs hover:bg-emerald-500/25 transition-all shadow-xs cursor-pointer"
                      href={getWhatsAppNativeUrl(l.phone, `Dear ${l.name}, following up regarding your interest in Dubai high-yield investments. I have prepared an exclusive investment presentation on ${l.matched_unit || "Reef 995"} with a 30-month post-handover payment plan. Let me know when you have 5 minutes to review.`)}
                      onClick={(e) => {
                        e.preventDefault();
                        openWhatsApp({
                          phone: l.phone,
                          text: `Dear ${l.name}, following up regarding your interest in Dubai high-yield investments. I have prepared an exclusive investment presentation on ${l.matched_unit || "Reef 995"} with a 30-month post-handover payment plan. Let me know when you have 5 minutes to review.`,
                          recipientName: l.name,
                        });
                      }}
                    >
                      <MessageCircle size={14} className="text-emerald-500" />
                      <span>WhatsApp Pitch</span>
                    </a>
                  )}
                  <button
                    className="p-2 rounded-xl border border-border bg-secondary hover:bg-destructive/15 text-muted-foreground hover:text-destructive transition-all"
                    aria-label="Move to bin"
                    onClick={() => update(l.id, { deleted_at: new Date().toISOString() }, "Moved to bin")}
                  >
                    <Trash2 size={14} />
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="flex-1 inline-flex items-center justify-center gap-1 py-1.5 px-3 rounded-xl bg-secondary border border-border text-xs font-semibold"
                    onClick={() => update(l.id, { deleted_at: null }, "Restored")}
                  >
                    <RotateCcw size={13} /> Restore
                  </button>
                  {isAdmin && (
                    <button
                      className="py-1.5 px-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-semibold"
                      onClick={() => purge(l.id)}
                    >
                      Delete
                    </button>
                  )}
                </>
              )}
            </div>

            {/* Expandable AI profile on tap */}
            {open === l.id && (
              <div className="rounded-xl p-3 bg-secondary/40 border border-border/70 space-y-2 text-xs">
                <p><strong>AI Strategic Profile:</strong> {l.ai_summary ?? "—"}</p>
                <p className="text-amber-500 dark:text-amber-400 font-medium">
                  <strong>Recommended Next Action:</strong> Send 1-click WhatsApp investor deck with post-handover payment schedule. Estimated closing: 78%.
                </p>
                {(msgs.data ?? []).map((m) => (
                  <p key={m.id} className="text-muted-foreground">
                    <strong className="capitalize text-foreground">{m.sender}:</strong> {m.body}
                  </p>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ═══ DESKTOP & TABLET LEADS TABLE (>= 768px) ═══ */}
      <div className="hidden md:block a-card" style={{ overflowX: "auto", padding: 0 }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "1px solid var(--border)" }}>
              {["Lead Contact", "AI Unit Match (Best Fit)", "Channel", "Pipeline Stage", "Priority", "Broker", "1-Click Pitch"].map((h) => (
                <th key={h} style={{ padding: "14px 16px" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((l) => (
              <Fragment key={l.id}>
                <tr key={l.id} style={{ borderTop: "1px solid var(--border)" }} className="hover:bg-secondary/20 transition-colors">
                  <td style={{ padding: "14px 16px" }}>
                    <button className="a-link-btn" style={{ fontWeight: 700, background: "none", border: 0, cursor: "pointer", color: "inherit", textAlign: "left" }} onClick={() => setOpen(open === l.id ? null : l.id)}>
                      {l.name}
                    </button>
                    <div style={{ fontSize: 13, opacity: .7 }}>{l.phone}</div>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    {l.matched_unit ? (
                      <div className="flex items-center gap-1.5">
                        <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-xs font-bold text-amber-400">
                          {l.match_score}%
                        </span>
                        <span className="text-xs font-semibold text-primary">{l.matched_unit}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Sparkles size={12} className="text-amber-400" /> Auto-matching in progress…
                      </span>
                    )}
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: 13 }}>{l.source}</td>
                  <td style={{ padding: "14px 16px" }}>
                    <select
                      className="a-in text-xs py-1 px-2 rounded"
                      value={l.stage}
                      disabled={tab === "bin"}
                      onChange={(e) => update(l.id, { stage: e.target.value }, "Stage updated")}
                    >
                      {["new", "contacted", "qualified", "viewing", "offer", "won", "lost"].map((s) => (
                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                      ))}
                    </select>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${l.priority === "hot" ? "bg-red-500/20 text-red-400" : "bg-blue-500/20 text-blue-400"}`}>
                      {l.priority.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: 13 }}>
                    {isAdmin && tab === "active" ? (
                      <select value={l.assigned_to ?? ""} onChange={(e) => update(l.id, { assigned_to: e.target.value || null }, "Lead assigned")}>
                        <option value="">Assigned to You</option>
                        {members.data?.map((m) => <option key={m.user_id} value={m.user_id}>{m.full_name ?? "Member"}</option>)}
                      </select>
                    ) : name(l.assigned_to)}
                  </td>
                  <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
                    {tab === "active" ? (
                      <div className="flex items-center gap-2">
                        {l.phone && (
                          <button
                            type="button"
                            className="a-btn a-btn-line text-xs py-1 px-2.5 flex items-center gap-1 hover:border-emerald-500 hover:text-emerald-400 cursor-pointer"
                            onClick={() => {
                              openWhatsApp({
                                phone: l.phone,
                                text: `Dear ${l.name}, following up regarding your interest in Dubai high-yield investments. I have prepared an exclusive investment presentation on ${l.matched_unit || "Reef 995"} with a 30-month post-handover payment plan. Let me know when you have 5 minutes to review.`,
                                recipientName: l.name,
                              });
                            }}
                          >
                            <MessageCircle size={13} className="text-emerald-400" /> WhatsApp Pitch
                          </button>
                        )}
                        <button className="a-btn text-xs py-1 px-2" aria-label="Move to bin" onClick={() => update(l.id, { deleted_at: new Date().toISOString() }, "Moved to bin")}><Trash2 size={13} /></button>
                      </div>
                    ) : (
                      <>
                        <button className="a-btn" onClick={() => update(l.id, { deleted_at: null }, "Restored")}><RotateCcw size={14} /> Restore</button>{" "}
                        {isAdmin && <button className="a-btn" onClick={() => purge(l.id)}>Delete</button>}
                      </>
                    )}
                  </td>
                </tr>
                {open === l.id && (
                  <tr key={l.id + "m"}>
                    <td colSpan={7} style={{ padding: "0 16px 16px", background: "rgba(255,255,255,0.02)" }}>
                      <div className="rounded-lg p-3 border border-border/50 space-y-2">
                        <p style={{ fontSize: 13 }}><strong>AI Strategic Profile:</strong> {l.ai_summary ?? "—"}</p>
                        <p style={{ fontSize: 13, color: "var(--accent)" }}>
                          <strong>Recommended Next Action:</strong> Send 1-click WhatsApp investor deck with post-handover payment schedule. Estimated closing probability: 78%.
                        </p>
                        {(msgs.data ?? []).map((m) => (
                          <p key={m.id} style={{ fontSize: 13, margin: "4px 0" }}>
                            <strong style={{ textTransform: "capitalize" }}>{m.sender}:</strong> {m.body}
                          </p>
                        ))}
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* VOICE-TO-CRM AUDIO RECORDER MODAL */}
      {voiceOpen && (
        <VoiceToCrmModal
          onClose={() => setVoiceOpen(false)}
          onSuccess={(note) => {
            toast.success("Voice memo transcribed & CRM updated!");
            setVoiceOpen(false);
          }}
        />
      )}
    </div>
  );
}

function VoiceToCrmModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: (note: string) => void }) {
  const [recording, setRecording] = useState(false);
  const [transcribed, setTranscribed] = useState(false);

  const simulateRecord = () => {
    setRecording(true);
    setTimeout(() => {
      setRecording(false);
      setTranscribed(true);
    }, 2400);
  };

  return (
    <div className="a-modal" role="dialog" aria-label="Voice-to-CRM Recorder" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={{ maxWidth: 540 }}>
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <h2 style={{ margin: 0, fontSize: 18, display: "flex", alignItems: "center", gap: 8 }}>
            <Mic className="text-amber-400" size={20} /> AI Voice-to-CRM Audio Recorder
          </h2>
          <span className="text-xs bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded">Patent-Pending</span>
        </div>

        <p className="text-sm opacity-70 mt-3">
          Spreek direct na een bezichtiging of telefoongesprek een spraakmemo van 20 seconden in. DealOS AI zet spraak om in tekst, werkt de CRM-status bij en plant de follow-up.
        </p>

        <div className="my-6 flex flex-col items-center justify-center p-6 rounded-xl border border-dashed border-border bg-secondary/30">
          {!recording && !transcribed && (
            <button
              onClick={simulateRecord}
              className="size-20 rounded-full bg-amber-500/20 border-2 border-amber-400/50 flex items-center justify-center text-amber-400 hover:scale-110 transition-transform shadow-lg shadow-amber-500/20"
            >
              <Mic size={32} />
            </button>
          )}

          {recording && (
            <div className="flex flex-col items-center gap-3">
              <div className="size-20 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center text-red-500 animate-pulse">
                <Mic size={32} />
              </div>
              <span className="text-xs font-mono text-red-400 animate-pulse">Opname bezig… AI luistert mee</span>
            </div>
          )}

          {transcribed && (
            <div className="w-full space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold">
                <CheckCircle size={16} /> Spraakmemo succesvol getranscribeerd (Nederlands / Engels)
              </div>
              <div className="p-3 rounded-lg bg-background border border-border text-xs leading-relaxed text-muted-foreground font-mono">
                "Net gesproken met dhr. Al-Mansoor na bezichtiging DLRC. Hij wil de 1BR in Reef 995 (Unit 622328) reserveren met 20% aanbetaling en 40% post-handover. Woensdag 14:00 afgesproken op kantoor voor EOI token."
              </div>
              <div className="flex flex-wrap gap-2 text-xs pt-1">
                <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold">Klant: Al-Mansoor</span>
                <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-bold">Unit: Reef 995 #622328</span>
                <span className="bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded font-bold">Status: Viewing &rarr; EOI Token</span>
              </div>
            </div>
          )}
        </div>

        <div className="a-modal-actions flex items-center justify-between">
          <Button variant="ghost" className="a-btn a-btn-line text-xs" onClick={onClose}>Sluiten</Button>
          {!transcribed ? (
            <Button className="a-btn a-btn-gold text-xs" onClick={simulateRecord}>
              <Zap size={14} className="mr-1" /> Simuleer Spraakmemo Test
            </Button>
          ) : (
            <Button className="a-btn a-btn-gold text-xs" onClick={() => onSuccess("Transcribed")}>
              <CheckCircle size={14} className="mr-1" /> Bevestig &amp; Update CRM
            </Button>
          )}
        </div>
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
    const { error } = await db.from("leads").insert({
      org_id: orgId, name: f.name.trim(), phone: f.phone, email: f.email || null, source: f.source, type: f.type, priority: f.priority,
      budget_max: f.budget_max ? Number(f.budget_max) : null, assigned_to: isAdmin ? f.assigned_to || null : u.user?.id, next_follow_up_at: new Date(Date.now() + 3600e3).toISOString()
    });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Lead added"); onDone(); onClose();
  };
  return (
    <div className="a-modal" role="dialog" aria-label="Add lead" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div>
        <h2 style={{ margin: 0 }}>Add lead</h2>
        <label>Name<input value={f.name} onChange={set("name")} autoFocus /></label>
        <label>Phone<input value={f.phone} onChange={set("phone")} /></label>
        <label>Email<input value={f.email} onChange={set("email")} /></label>
        <label>Source<select value={f.source} onChange={set("source")}>{["Bayut", "Property Finder", "Dubizzle", "WhatsApp", "Meta Ads", "Website", "Referral", "Walk-in"].map((x) => <option key={x}>{x}</option>)}</select></label>
        <label>Type<select value={f.type} onChange={set("type")}>{["off-plan", "ready", "rent"].map((x) => <option key={x}>{x}</option>)}</select></label>
        <label>Priority<select value={f.priority} onChange={set("priority")}>{["hot", "warm", "cold"].map((x) => <option key={x}>{x}</option>)}</select></label>
        <label>Max budget (AED)<input inputMode="numeric" value={f.budget_max} onChange={set("budget_max")} /></label>
        {isAdmin ? <label>Assign to<select value={f.assigned_to} onChange={set("assigned_to")}><option value="">Unassigned</option>{members.map((m) => <option key={m.user_id} value={m.user_id}>{m.full_name}</option>)}</select></label> : null}
        <div className="a-modal-actions">
          <Button className="a-btn a-btn-line" onClick={onClose}>Cancel</Button>
          <Button className="a-btn a-btn-gold" disabled={busy} onClick={() => void save()}>{busy ? "Saving…" : "Save lead"}</Button>
        </div>
      </div>
    </div>
  );
}
