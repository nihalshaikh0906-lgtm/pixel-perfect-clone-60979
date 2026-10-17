import type { SearchSchemaInput } from "@tanstack/react-router";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  Banknote, Building2, Calendar, CheckCircle2, ChevronRight, Clock,
  Compass, Eye, Filter, Flame, MessageCircle, MessageSquare, Phone,
  Plus, Search, Share2, ShieldCheck, Sparkles, Target, TrendingUp,
  User, Zap, ArrowUpRight
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { OwnerDashboard } from "@/pages/OwnerDashboard";
import { inventorySummaryOptions, projectPageOptions } from "@/lib/inventory.functions";
import { LEADS, queueLeads, stats, type Lead, formatAed } from "@/lib/demo-leads";
import { aed, quarterOf } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/app/")({
  validateSearch: (s: Record<string, unknown> & SearchSchemaInput) => ({
    page: Math.max(1, Math.floor(Number(s["page"]) || 1)),
  }),
  loaderDeps: ({ search }) => ({ page: search.page }),
  loader: async ({ context, deps }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(inventorySummaryOptions()),
      context.queryClient.ensureQueryData(projectPageOptions(deps.page)),
    ]);
  },
  errorComponent: ({ error }) => (
    <div className="flex h-96 flex-col items-center justify-center gap-4 text-center p-6">
      <div className="rounded-full bg-destructive/10 p-4 text-destructive">
        <Building2 className="size-10" />
      </div>
      <h2 className="text-xl font-bold">Unable to load dashboard</h2>
      <p className="text-sm text-muted-foreground max-w-md">{error instanceof Error ? error.message : "Please try again."}</p>
      <Button variant="outline" onClick={() => window.location.reload()}>Retry</Button>
    </div>
  ),
  notFoundComponent: () => <div>Dashboard not found.</div>,
  head: () => ({
    meta: [
      { title: "Agent Command Center — DealOS Dubai" },
      { name: "description", content: "High-performance Dubai real estate broker cockpit with priority action queue and instant inventory matching." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { page } = Route.useSearch();
  const navigate = Route.useNavigate();
  const [role, setRole] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    void supabase.auth.getUser().then(({ data }) =>
      (supabase as unknown as { from: (t: string) => any })
        .from("org_members")
        .select("role")
        .eq("user_id", data.user?.id ?? "")
        .maybeSingle()
        .then((r: { data: { role: string } | null }) => setRole(r.data?.role ?? null))
    );
  }, []);

  if (role === "company_admin") {
    return <OwnerDashboard page={page} onPage={(next) => void navigate({ search: { page: next } })} />;
  }
  return <AgentDashboard />;
}

/* ─────────────────────────────────────────────────────────────
   MASTER-DESIGNED AGENT DASHBOARD COCKPIT
────────────────────────────────────────────────────────────── */

function AgentDashboard() {
  const { data: projectData } = useSuspenseQuery(projectPageOptions(1));
  const [leadList, setLeadList] = useState<Lead[]>(() => queueLeads("all"));
  const [activeTab, setActiveTab] = useState<"urgent" | "hot" | "closing" | "all">("urgent");
  const [newLeadOpen, setNewLeadOpen] = useState(false);
  const [quickPitchModal, setQuickPitchModal] = useState<Lead | null>(null);

  // New Lead Form State
  const [leadName, setLeadName] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadCountry, setLeadCountry] = useState("UAE");
  const [leadBudget, setLeadBudget] = useState("1500000");
  const [leadArea, setLeadArea] = useState("JVC");
  const [leadBeds, setLeadBeds] = useState(1);

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    if (activeTab === "urgent") {
      return leadList.filter((l) => (l.followUpDueInHours ?? 99) <= 2 || l.score >= 80).slice(0, 8);
    }
    if (activeTab === "hot") {
      return leadList.filter((l) => l.score >= 70).slice(0, 8);
    }
    if (activeTab === "closing") {
      return leadList.filter((l) => ["Offer", "EOI / booking", "Site visit"].includes(l.stage)).slice(0, 8);
    }
    return leadList.slice(0, 10);
  }, [leadList, activeTab]);

  // Featured Hot Projects for Quick Matcher
  const featuredProjects = useMemo(() => {
    return (projectData?.rows ?? []).slice(0, 3);
  }, [projectData]);

  const handleStageChange = (id: string, newStage: Lead["stage"]) => {
    setLeadList((prev) =>
      prev.map((l) => (l.id === id ? { ...l, stage: newStage } : l))
    );
    toast.success(`Lead moved to ${newStage}`);
  };

  const handleWhatsApp = (l: Lead) => {
    const text = `Hi ${l.name.split(" ")[0]}, hope you're well!
Following up on your search for a ${l.beds} BR in ${l.area} (Budget: ${formatAed(l.budget)}).
We just secured exclusive developer allocation with a flexible payment plan.
When are you free today for a quick 2-minute overview?`;
    window.open(`https://wa.me/${l.phone.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`, "_blank");
  };

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    const newL: Lead = {
      id: `lead-user-${Date.now()}`,
      name: leadName || "New Investor",
      initials: (leadName || "N I").split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase(),
      country: leadCountry,
      phone: leadPhone || "+971 50 000 0000",
      type: "Off-plan",
      beds: leadBeds,
      area: leadArea,
      budget: Number(leadBudget) || 1200000,
      payment: "Payment Plan",
      score: 92,
      stage: "Qualified",
      source: "Manual Cockpit",
      receivedHoursAgo: 0,
      contacted: true,
      followUpDueInHours: 1,
      message: `Looking for ${leadBeds} BR in ${leadArea}. Budget around ${formatAed(Number(leadBudget))}.`,
      task: "Present Developer Shortlist",
    };
    setLeadList([newL, ...leadList]);
    setNewLeadOpen(false);
    toast.success(`Investor profile registered for ${newL.name}!`);
    setLeadName("");
    setLeadPhone("");
  };

  const [dashboardTab, setDashboardTab] = useState<"queue" | "inventory" | "targets">("queue");

  return (
    <div className="min-h-screen bg-background pb-20 space-y-6 max-w-7xl mx-auto animate-in fade-in-50 duration-300">
      {/* ═══ 1. CLEAN EXECUTIVE HERO BANNER ═══ */}
      <section className="relative overflow-hidden rounded-2xl border border-border/80 bg-gradient-to-r from-card via-card to-secondary/30 p-6 sm:p-7 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-bold text-emerald-400">
                <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Dubai Market Live · RERA Verified
              </span>
              <span className="text-muted-foreground">•</span>
              <span className="text-xs text-muted-foreground">
                Saturday, 10 October 2026
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-display">
              Good morning, Broker
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
              You have <span className="font-semibold text-foreground">4 priority client follow-ups</span> and <span className="font-semibold text-foreground">AED 14.8M</span> in active negotiations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              asChild
              className="h-9 rounded-xl text-xs font-semibold border-border gap-1.5"
            >
              <Link to="/app/deals">
                <Banknote className="size-3.5 text-amber-400" />
                <span>Deals Pipeline</span>
              </Link>
            </Button>

            <Button
              variant="outline"
              size="sm"
              asChild
              className="h-9 rounded-xl text-xs font-semibold border-border gap-1.5"
            >
              <Link to="/app/offplan">
                <Compass className="size-3.5 text-primary" />
                <span>Catalog</span>
              </Link>
            </Button>

            <Button
              size="sm"
              onClick={() => setNewLeadOpen(true)}
              className="h-9 rounded-xl text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 shadow-sm"
            >
              <Plus className="size-3.5" />
              <span>Log New Buyer</span>
            </Button>
          </div>
        </div>
      </section>

      {/* ═══ 2. TOP 3 ESSENTIAL METRICS (MINIMALIST & CRISP) ═══ */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: Projected Commission */}
        <div className="group rounded-2xl border border-border/80 bg-card/70 backdrop-blur-sm p-5 shadow-sm hover:border-amber-500/50 hover:-translate-y-0.5 transition-all duration-300">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300">Projected Commission</span>
            <div className="size-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Banknote size={16} />
            </div>
          </div>
          <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight font-display">
            AED 94.5K
          </p>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">October Target: 63%</span>
            <span className="font-semibold text-emerald-400">+18% vs last month</span>
          </div>
          <div className="mt-2.5 h-1.5 w-full rounded-full bg-secondary overflow-hidden">
            <div className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full" style={{ width: "63%" }} />
          </div>
        </div>

        {/* Card 2: Active Pipeline Volume */}
        <div className="group rounded-2xl border border-border/80 bg-card/70 backdrop-blur-sm p-5 shadow-sm hover:border-primary/50 hover:-translate-y-0.5 transition-all duration-300">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-300">Active Pipeline</span>
            <div className="size-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <TrendingUp size={16} />
            </div>
          </div>
          <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight font-display">
            AED 14.8M
          </p>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Across 6 buyer deals</span>
            <span className="font-semibold text-cyan-400">Avg. 1.8M / deal</span>
          </div>
        </div>

        {/* Card 3: Priority Follow-Ups */}
        <div className="group rounded-2xl border border-border/80 bg-card/70 backdrop-blur-sm p-5 shadow-sm hover:border-rose-500/50 hover:-translate-y-0.5 transition-all duration-300">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-300">Due Today</span>
            <div className="size-8 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Flame size={16} />
            </div>
          </div>
          <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight font-display">
            4 Priority
          </p>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">2 Waiting on SPA</span>
            <span className="font-semibold text-rose-400">High Conversion</span>
          </div>
        </div>
      </section>

      {/* ═══ 3. CLEAN SEGMENTED NAVIGATION (SIDEBAR-INSPIRED) ═══ */}
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-secondary/50 border border-border/60">
          {[
            { id: "queue", label: "Priority Action Queue", icon: Zap, badge: `${filteredLeads.length}` },
            { id: "inventory", label: "Featured Allocations", icon: Compass },
            { id: "targets", label: "Target & Bonus", icon: Target },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = dashboardTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setDashboardTab(tab.id as typeof dashboardTab)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                  active
                    ? "bg-card text-foreground shadow-sm border border-border"
                    : "text-muted-foreground hover:text-foreground hover:bg-card/40"
                }`}
              >
                <Icon size={14} className={active ? "text-primary" : "text-muted-foreground"} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="rounded-full bg-primary/15 border border-primary/30 px-1.5 py-0.2 text-[10px] text-primary font-mono">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {dashboardTab === "queue" && (
          <div className="flex items-center gap-1">
            {[
              { id: "urgent", label: "Due Today" },
              { id: "hot", label: "Hot (70+)" },
              { id: "closing", label: "Closing" },
              { id: "all", label: "All" },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setActiveTab(st.id as typeof activeTab)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === st.id
                    ? "bg-secondary text-foreground font-bold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ═══ 4. TAB CONTENT ═══ */}
      {dashboardTab === "queue" && (
        <div className="space-y-3.5 animate-in fade-in-50 duration-200">
          {filteredLeads.map((l) => (
            <div
              key={l.id}
              className="group rounded-2xl border border-border/80 bg-card p-4 sm:p-5 hover:border-primary/50 transition-all duration-200 shadow-sm space-y-3"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                {/* Investor Identity */}
                <div className="flex items-center gap-3.5">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-border bg-secondary font-display font-extrabold text-foreground text-sm">
                    {l.initials}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-foreground">{l.name}</h3>
                      <span className="text-xs text-muted-foreground">({l.country})</span>
                      <span className="rounded-full bg-amber-500/10 border border-amber-500/30 px-2 py-0.2 text-[10px] font-bold text-amber-300">
                        Score {l.score}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      <span>{l.beds === 0 ? "Studio" : `${l.beds} BR`} in <strong className="text-foreground">{l.area}</strong></span>
                      <span className="mx-1.5">•</span>
                      <span className="font-mono font-bold text-foreground">{formatAed(l.budget)}</span>
                    </p>
                  </div>
                </div>

                {/* Status Dropdown */}
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <select
                    value={l.stage}
                    onChange={(e) => handleStageChange(l.id, e.target.value as Lead["stage"])}
                    className="bg-secondary text-foreground text-xs rounded-lg px-2.5 py-1.5 border border-border focus:outline-none focus:border-primary cursor-pointer font-medium"
                  >
                    {["Qualified", "Viewing", "Offer", "EOI / booking", "Won"].map((st) => (
                      <option key={st} value={st}>
                        Stage: {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Requirement Context Note */}
              <p className="text-xs text-muted-foreground bg-secondary/30 rounded-xl p-2.5 italic border border-border/40">
                "{l.message}"
              </p>

              {/* Action Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-border/40">
                <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <Clock size={13} className="text-amber-400" />
                  <span>Next: <strong className="text-foreground">{l.task}</strong></span>
                </span>

                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${l.phone.replace(/\s/g, "")}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary/60 px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary transition-colors"
                  >
                    <Phone className="size-3 text-muted-foreground" />
                    <span>Call</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => handleWhatsApp(l)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                  >
                    <MessageSquare className="size-3" />
                    <span>WhatsApp Pitch</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setQuickPitchModal(l)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary/20 transition-colors"
                  >
                    <Sparkles className="size-3" />
                    <span>Match Property</span>
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredLeads.length === 0 && (
            <div className="py-12 text-center text-sm text-muted-foreground rounded-2xl border border-dashed border-border bg-card">
              No pending leads in this filter. All clients contacted!
            </div>
          )}
        </div>
      )}

      {/* ═══ TAB: FEATURED INVENTORY ALLOCATIONS ═══ */}
      {dashboardTab === "inventory" && (
        <div className="space-y-4 animate-in fade-in-50 duration-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {featuredProjects.map((p) => (
              <div
                key={p.id}
                className="group rounded-2xl border border-border/80 bg-card p-5 hover:border-primary/50 transition-all duration-200 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Link
                      to="/app/project/$id"
                      params={{ id: String(p.id) }}
                      className="font-bold text-sm text-foreground hover:text-primary transition-colors line-clamp-1"
                    >
                      {p.name}
                    </Link>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {p.district || "Dubai"} · {p.developer_name}
                    </p>
                  </div>
                  <span className="rounded bg-secondary px-2 py-0.5 text-[10px] font-bold text-foreground font-mono shrink-0">
                    {quarterOf(p.handover_date)}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-secondary/30 border border-border/40 text-xs flex justify-between items-center">
                  <span className="text-muted-foreground">Starting From</span>
                  <span className="font-bold font-mono text-emerald-400">AED 684,000</span>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="flex-1 h-8 text-xs font-semibold"
                  >
                    <Link to="/app/project/$id" params={{ id: String(p.id) }}>
                      <span>View Dossier</span>
                      <ArrowUpRight className="size-3 ml-1" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-2">
            <Button variant="outline" asChild className="h-9 text-xs font-semibold rounded-xl">
              <Link to="/app/offplan">Browse Complete Catalog (1,355+ Verified UAE Projects) →</Link>
            </Button>
          </div>
        </div>
      )}

      {/* ═══ TAB: TARGETS & BONUS ═══ */}
      {dashboardTab === "targets" && (
        <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm space-y-6 max-w-2xl mx-auto animate-in fade-in-50 duration-200">
          <div className="flex items-center justify-between border-b border-border/60 pb-4">
            <div>
              <h3 className="text-base font-bold text-foreground">Monthly Commission Target</h3>
              <p className="text-xs text-muted-foreground">October 2026 quota and Tier-1 accelerator</p>
            </div>
            <span className="rounded-full bg-primary/10 border border-primary/30 px-3 py-1 text-xs font-bold text-primary font-mono">
              63% Achieved
            </span>
          </div>

          <div>
            <div className="flex justify-between items-baseline mb-2">
              <span className="text-3xl font-extrabold text-foreground font-display">
                AED 94,500
              </span>
              <span className="text-sm text-muted-foreground font-mono">Target: AED 150,000</span>
            </div>
            <div className="h-3 w-full rounded-full bg-secondary overflow-hidden border border-border/80">
              <div className="h-full bg-gradient-to-r from-primary to-emerald-400 rounded-full" style={{ width: "63%" }} />
            </div>
          </div>

          <div className="rounded-xl border border-border/60 bg-secondary/30 p-4 text-xs space-y-2">
            <p className="font-bold text-foreground flex items-center gap-1.5">
              <Sparkles size={14} className="text-amber-400" />
              <span>Tier-1 Accelerator Qualification:</span>
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Close just <strong>1 more transaction</strong> (e.g. 1BR in DLRC or JVC) this week to elevate your commission split to <strong>60%</strong> on all subsequent deals closed before month-end.
            </p>
          </div>
        </div>
      )}

      {/* ═══ MODAL: REGISTER NEW BUYER ═══ */}
      <Dialog open={newLeadOpen} onOpenChange={setNewLeadOpen}>
        <DialogContent className="max-w-md rounded-2xl bg-card border-border p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-foreground">Register New Investor Lead</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Add a new qualified client profile to receive AI property matches and automated WhatsApp decks.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateLead} className="mt-4 space-y-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Client Full Name</label>
              <input
                required
                value={leadName}
                onChange={(e) => setLeadName(e.target.value)}
                placeholder="e.g. Dr. Tariq Al-Mansoor"
                className="mt-1 h-10 w-full rounded-xl border border-border bg-secondary px-3 text-sm focus:border-primary focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground">WhatsApp / Phone</label>
                <input
                  required
                  value={leadPhone}
                  onChange={(e) => setLeadPhone(e.target.value)}
                  placeholder="+971 50 123 4567"
                  className="mt-1 h-10 w-full rounded-xl border border-border bg-secondary px-3 text-sm focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Country / Nationality</label>
                <input
                  value={leadCountry}
                  onChange={(e) => setLeadCountry(e.target.value)}
                  placeholder="UAE, UK, France..."
                  className="mt-1 h-10 w-full rounded-xl border border-border bg-secondary px-3 text-sm focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Max Budget (AED)</label>
                <input
                  required
                  value={leadBudget}
                  onChange={(e) => setLeadBudget(e.target.value)}
                  placeholder="1,500,000"
                  className="mt-1 h-10 w-full rounded-xl border border-border bg-secondary px-3 text-sm focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Bedrooms</label>
                <select
                  value={leadBeds}
                  onChange={(e) => setLeadBeds(Number(e.target.value))}
                  className="mt-1 h-10 w-full rounded-xl border border-border bg-secondary px-3 text-sm focus:border-primary focus:outline-none"
                >
                  <option value={0}>Studio</option>
                  <option value={1}>1 Bedroom</option>
                  <option value={2}>2 Bedrooms</option>
                  <option value={3}>3+ Bedrooms</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground">Preferred Community</label>
              <input
                value={leadArea}
                onChange={(e) => setLeadArea(e.target.value)}
                placeholder="e.g. JVC, Dubai Marina, DLRC"
                className="mt-1 h-10 w-full rounded-xl border border-border bg-secondary px-3 text-sm focus:border-primary focus:outline-none"
              />
            </div>

            <Button type="submit" className="w-full h-11 bg-primary text-primary-foreground font-bold">
              Confirm & Add to Action Queue
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* ═══ MODAL: QUICK PROPERTY MATCHER ═══ */}
      <Dialog open={quickPitchModal !== null} onOpenChange={(open) => { if (!open) setQuickPitchModal(null); }}>
        <DialogContent className="max-w-lg rounded-2xl bg-card border-border p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-foreground">
              Instant Matches for {quickPitchModal?.name}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Matched against your live inventory: {quickPitchModal?.beds === 0 ? "Studio" : `${quickPitchModal?.beds} BR`} in {quickPitchModal?.area} (Budget: {quickPitchModal ? formatAed(quickPitchModal.budget) : ""})
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-3">
            {featuredProjects.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between rounded-xl border border-border bg-secondary/40 p-4 hover:border-primary/40 transition-all"
              >
                <div>
                  <h4 className="font-bold text-sm text-foreground">{p.name}</h4>
                  <p className="text-xs text-muted-foreground">
                    {p.district} · Handover {quarterOf(p.handover_date)}
                  </p>
                  <p className="text-xs font-bold text-emerald-400 mt-1">Starting from AED 684K</p>
                </div>

                <Button
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-1 text-xs"
                  onClick={() => {
                    const text = `Hi ${quickPitchModal?.name.split(" ")[0]}! I just matched your criteria with *${p.name}* in ${p.district}.\nView the official developer deck: ${window.location.origin}/app/project/${p.id}`;
                    window.open(`https://wa.me/${quickPitchModal?.phone.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`, "_blank");
                    setQuickPitchModal(null);
                  }}
                >
                  <MessageSquare className="size-3.5" />
                  <span>Send WhatsApp</span>
                </Button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
