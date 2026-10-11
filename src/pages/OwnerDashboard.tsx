import { Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  Building2, Construction, Key, ArrowRight, ChevronLeft, ChevronRight,
  ShieldCheck, TrendingUp, Users, DollarSign, Clock, AlertTriangle,
  Send, CheckCircle2, Sparkles, Layers, ArrowUpRight
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { inventorySummaryOptions, projectPageOptions } from "@/lib/inventory.functions";
import { INVENTORY_PAGE_SIZE } from "@/lib/inventory-category";
import { aed, quarterOf } from "@/lib/format";
import { toast } from "sonner";

const count = (n: number) => n.toLocaleString("en-US");

const DEVELOPER_DEBTS = [
  { developer: "Emaar Properties", amount: "AED 340,000", days: 45, status: "Verified", deals: 3, project: "Address Creek / Emaar South" },
  { developer: "Sobha Realty", amount: "AED 280,000", days: 18, status: "Processing", deals: 2, project: "Sobha Hartland II" },
  { developer: "Danube Properties", amount: "AED 190,000", days: 62, status: "Overdue Alert", deals: 2, project: "Aspirz / Bayz 102" },
  { developer: "Reef Luxury Development", amount: "AED 145,000", days: 12, status: "Escrow Confirmed", deals: 1, project: "Reef 995 DLRC" },
  { developer: "Binghatti Developers", amount: "AED 85,000", days: 24, status: "Invoiced", deals: 1, project: "Binghatti Hills" },
];

const BROKER_LEADERBOARD = [
  { name: "Aisha Khan", deals: 14, revenue: "AED 4.2M", speed: "3.2 min", conv: "6.8%", status: "Top Producer" },
  { name: "Omar Haddad", deals: 11, revenue: "AED 3.6M", speed: "3.8 min", conv: "5.4%", status: "Active" },
  { name: "Priya Nair", deals: 9, revenue: "AED 2.9M", speed: "4.5 min", conv: "4.9%", status: "Active" },
  { name: "Daniel Ross", deals: 8, revenue: "AED 2.4M", speed: "6.8 min", conv: "4.2%", status: "Active" },
  { name: "Saad Malik", deals: 5, revenue: "AED 1.5M", speed: "18.2 min", conv: "3.1%", status: "Follow-up Needed" },
];

const SECTORS = [
  { label: "Off-Plan Sales", pct: 58, value: "AED 37.5M", color: "bg-blue-500" },
  { label: "Secondary Resales", pct: 24, value: "AED 15.5M", color: "bg-emerald-500" },
  { label: "Leasing / Ejari", pct: 12, value: "AED 7.8M", color: "bg-amber-500" },
  { label: "Commercial", pct: 6, value: "AED 4.0M", color: "bg-purple-500" },
];

export function OwnerDashboard({ page = 1, onPage }: { page?: number; onPage?: (page: number) => void }) {
  const { data } = useSuspenseQuery(inventorySummaryOptions());
  const { data: projects } = useSuspenseQuery(projectPageOptions(page));
  const [activeTab, setActiveTab] = useState<"overview" | "team" | "receivables" | "catalog">("overview");
  const [reminded, setReminded] = useState<Record<string, boolean>>({});

  const sendReminder = (dev: string) => {
    setReminded((prev) => ({ ...prev, [dev]: true }));
    toast.success(`DLD-compliant commission escalation dispatched to ${dev} finance department.`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in-50 duration-300">
      {/* ═══ CLEAN EXECUTIVE HEADER ═══ */}
      <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-gradient-to-r from-card via-card to-secondary/30 p-6 sm:p-7 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-primary">
                Executive Cockpit
              </span>
              <span className="text-muted-foreground">•</span>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-400">
                <ShieldCheck size={14} /> DLD Escrow Synced
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-display">
              Agency Master Command
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Total agency oversight: 12 brokers · AED 64.8M Q4 GMV · 1,450+ verified Dubai developments
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild className="h-9 rounded-xl text-xs font-semibold gap-1.5 border-border">
              <Link to="/app/ai-assistant">
                <Sparkles className="size-3.5 text-primary" />
                <span>AI Mastermind</span>
              </Link>
            </Button>
            <Button size="sm" asChild className="h-9 rounded-xl text-xs font-semibold gap-1.5 bg-primary text-primary-foreground">
              <Link to="/app/reports">
                <TrendingUp className="size-3.5" />
                <span>Q4 Financial Report</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* ═══ TOP 4 ESSENTIAL METRICS (STREAMLINED & ELEGANT) ═══ */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {/* Metric 1 */}
        <div className="group rounded-2xl border border-border/80 bg-card/70 backdrop-blur-sm p-4 sm:p-5 shadow-sm hover:border-primary/50 hover:-translate-y-0.5 transition-all duration-300">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Gross Commission (YTD)</span>
            <div className="size-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <DollarSign size={16} />
            </div>
          </div>
          <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight font-display">
            AED 18.4M
          </p>
          <p className="mt-1 text-[11px] font-medium text-emerald-400 flex items-center gap-1">
            <TrendingUp size={12} /> +18.2% vs target
          </p>
        </div>

        {/* Metric 2 */}
        <div className="group rounded-2xl border border-border/80 bg-card/70 backdrop-blur-sm p-4 sm:p-5 shadow-sm hover:border-primary/50 hover:-translate-y-0.5 transition-all duration-300">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Active Pipeline</span>
            <div className="size-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
              <Layers size={16} />
            </div>
          </div>
          <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight font-display">
            AED 142M
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground">
            86 deals in active negotiation
          </p>
        </div>

        {/* Metric 3 */}
        <div className="group rounded-2xl border border-border/80 bg-card/70 backdrop-blur-sm p-4 sm:p-5 shadow-sm hover:border-amber-500/50 hover:-translate-y-0.5 transition-all duration-300">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300/90">Pending Receivables</span>
            <div className="size-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <AlertTriangle size={16} />
            </div>
          </div>
          <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight font-display">
            AED 1.04M
          </p>
          <p className="mt-1 text-[11px] text-amber-400 font-medium">
            5 developer vouchers due
          </p>
        </div>

        {/* Metric 4 */}
        <div className="group rounded-2xl border border-border/80 bg-card/70 backdrop-blur-sm p-4 sm:p-5 shadow-sm hover:border-primary/50 hover:-translate-y-0.5 transition-all duration-300">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Speed-To-Lead</span>
            <div className="size-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Clock size={16} />
            </div>
          </div>
          <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight font-display">
            4.1 min
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground">
            92% contacted in &lt; 5 mins
          </p>
        </div>
      </div>

      {/* ═══ CLEAN SEGMENTED NAVIGATION (SIDEBAR-INSPIRED) ═══ */}
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-secondary/50 border border-border/60">
          {[
            { id: "overview", label: "Executive Pulse", icon: TrendingUp },
            { id: "team", label: "Broker Leaderboard", icon: Users },
            { id: "receivables", label: "Developer Receivables", icon: DollarSign, badge: "AED 1.04M" },
            { id: "catalog", label: "Dubai Catalog", icon: Building2 },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                  active
                    ? "bg-card text-foreground shadow-sm border border-border"
                    : "text-muted-foreground hover:text-foreground hover:bg-card/40"
                }`}
              >
                <Icon size={14} className={active ? "text-primary" : "text-muted-foreground"} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="rounded-full bg-amber-500/15 border border-amber-500/30 px-1.5 py-0.2 text-[10px] text-amber-300 font-mono">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <span className="hidden sm:inline-block text-xs text-muted-foreground">
          Real-time sync · Updated 2 min ago
        </span>
      </div>

      {/* ═══ TAB 1: EXECUTIVE PULSE (BALANCED & CLEAN) ═══ */}
      {activeTab === "overview" && (
        <div className="space-y-6 animate-in fade-in-50 duration-200">
          {/* Revenue by Sector & Live Alerts */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Revenue Distribution */}
            <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-border/50 pb-3">
                <div>
                  <h3 className="font-bold text-sm text-foreground">Revenue by Sector (Q4)</h3>
                  <p className="text-xs text-muted-foreground">Aggregated across all licensed transactions</p>
                </div>
                <span className="text-xs font-mono font-bold text-foreground">AED 64.8M Total</span>
              </div>

              <div className="space-y-3.5 pt-1">
                {SECTORS.map((s) => (
                  <div key={s.label} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-foreground">{s.label}</span>
                      <div className="flex items-center gap-2 font-mono">
                        <span className="text-muted-foreground">{s.value}</span>
                        <span className="font-bold text-foreground">{s.pct}%</span>
                      </div>
                    </div>
                    <div className="h-2 rounded-full bg-secondary/80 overflow-hidden">
                      <div className={`h-full rounded-full ${s.color}`} style={{ width: `${s.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Agency Alerts */}
            <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-border/50 pb-3">
                <div>
                  <h3 className="font-bold text-sm text-foreground">Live Executive Action Items</h3>
                  <p className="text-xs text-muted-foreground">Items requiring CEO sign-off or escalation</p>
                </div>
                <span className="rounded-full bg-red-500/10 border border-red-500/30 px-2 py-0.5 text-[10px] font-bold text-red-400">
                  2 Action Needed
                </span>
              </div>

              <div className="space-y-3 pt-1">
                <div className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/5 p-3 text-xs">
                  <AlertTriangle className="size-4 shrink-0 text-amber-400 mt-0.5" />
                  <div className="flex-1 space-y-0.5">
                    <p className="font-bold text-foreground">Danube Properties: AED 190,000 Overdue</p>
                    <p className="text-muted-foreground">Deal #1042 reached 62 days since SPA title registration.</p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => sendReminder("Danube Properties")} className="h-7 text-[11px] font-bold border-amber-500/40 text-amber-300">
                    Escalate
                  </Button>
                </div>

                <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-secondary/20 p-3 text-xs">
                  <Clock className="size-4 shrink-0 text-blue-400 mt-0.5" />
                  <div className="flex-1 space-y-0.5">
                    <p className="font-bold text-foreground">Speed-to-Lead Audit: Saad Malik</p>
                    <p className="text-muted-foreground">Average contact time is 18.2 min vs company target of &lt; 5 min.</p>
                  </div>
                  <Button size="sm" variant="ghost" asChild className="h-7 text-[11px] font-semibold text-primary">
                    <Link to="/app/users">View Broker</Link>
                  </Button>
                </div>

                <div className="flex items-start gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3 text-xs">
                  <CheckCircle2 className="size-4 shrink-0 text-emerald-400 mt-0.5" />
                  <div className="flex-1 space-y-0.5">
                    <p className="font-bold text-foreground">RERA Compliance Clean Sheet</p>
                    <p className="text-muted-foreground">All 38 portal listings hold verified Trakheesi permits with 0 fine exposure.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Portfolio Snapshot */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link to="/app/offplan" className="group rounded-2xl border border-border/80 bg-card p-5 hover:border-primary/50 transition-all shadow-sm">
              <div className="flex items-center justify-between text-muted-foreground mb-2">
                <span className="text-xs font-semibold text-primary flex items-center gap-1.5">
                  <Construction size={14} /> Off-Plan Projects
                </span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-2xl font-extrabold text-foreground font-display">{count(data.categories.offplan.units)} Units</p>
              <p className="text-xs text-muted-foreground mt-1">{aed(data.categories.offplan.value)} active pipeline</p>
            </Link>

            <Link to="/app/listings" className="group rounded-2xl border border-border/80 bg-card p-5 hover:border-primary/50 transition-all shadow-sm">
              <div className="flex items-center justify-between text-muted-foreground mb-2">
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                  <Building2 size={14} /> Ready / Secondary
                </span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-2xl font-extrabold text-foreground font-display">{count(data.categories.ready.units)} Units</p>
              <p className="text-xs text-muted-foreground mt-1">{aed(data.categories.ready.value)} verified inventory</p>
            </Link>

            <Link to="/app/rentals" className="group rounded-2xl border border-border/80 bg-card p-5 hover:border-primary/50 transition-all shadow-sm">
              <div className="flex items-center justify-between text-muted-foreground mb-2">
                <span className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                  <Key size={14} /> Tenancies & Rentals
                </span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-2xl font-extrabold text-foreground font-display">{count(data.categories.rental.units)} Units</p>
              <p className="text-xs text-muted-foreground mt-1">{aed(data.categories.rental.value)} Ejari leasehold</p>
            </Link>
          </div>
        </div>
      )}

      {/* ═══ TAB 2: BROKER TEAM LEADERBOARD ═══ */}
      {activeTab === "team" && (
        <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-sm animate-in fade-in-50 duration-200">
          <div className="p-5 border-b border-border/60 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-foreground">Broker Team Performance & Speed-to-Lead Audit</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Real-time metrics for all 12 licensed Dubai agents</p>
            </div>
            <span className="text-xs text-muted-foreground">Target Response: &lt; 5 mins</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground bg-secondary/30">
                  <th className="py-3.5 pl-5">#</th>
                  <th className="py-3.5">Broker Name</th>
                  <th className="py-3.5">Deals Closed</th>
                  <th className="py-3.5">Revenue Generated</th>
                  <th className="py-3.5">Avg Response Time</th>
                  <th className="py-3.5">Conversion</th>
                  <th className="py-3.5 text-right pr-5">Audit Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {BROKER_LEADERBOARD.map((b, i) => (
                  <tr key={b.name} className="hover:bg-secondary/30 transition-colors">
                    <td className="py-3.5 pl-5 font-bold text-primary font-mono text-xs">{i + 1}</td>
                    <td className="py-3.5 font-bold text-foreground">{b.name}</td>
                    <td className="py-3.5 font-mono text-xs">{b.deals} deals</td>
                    <td className="py-3.5 font-mono text-xs font-bold text-emerald-400">{b.revenue}</td>
                    <td className="py-3.5 font-mono text-xs">
                      <span className={`inline-flex items-center gap-1 ${parseFloat(b.speed) > 10 ? "text-amber-400 font-bold" : "text-emerald-400"}`}>
                        <Clock size={12} /> {b.speed}
                      </span>
                    </td>
                    <td className="py-3.5 font-mono text-xs">{b.conv}</td>
                    <td className="py-3.5 text-right pr-5">
                      <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                        b.status === "Top Producer"
                          ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                          : b.status === "Follow-up Needed"
                          ? "bg-red-500/15 text-red-400 border border-red-500/30"
                          : "bg-secondary text-muted-foreground"
                      }`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ═══ TAB 3: DEVELOPER RECEIVABLES ═══ */}
      {activeTab === "receivables" && (
        <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-sm animate-in fade-in-50 duration-200">
          <div className="p-5 border-b border-border/60 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-foreground">Developer Commission Recovery Ledger</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Track and enforce outstanding developer commission vouchers (Total: AED 1,040,000)</p>
            </div>
            <span className="rounded-full bg-amber-500/15 border border-amber-500/30 px-2.5 py-1 text-xs font-bold text-amber-300">
              AED 190K Flagged &gt; 60 Days
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground bg-secondary/30">
                  <th className="py-3.5 pl-5">Master Developer</th>
                  <th className="py-3.5">Development Project</th>
                  <th className="py-3.5">Deals</th>
                  <th className="py-3.5">Pending Amount</th>
                  <th className="py-3.5">Aging</th>
                  <th className="py-3.5">Status</th>
                  <th className="py-3.5 text-right pr-5">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {DEVELOPER_DEBTS.map((d) => (
                  <tr key={d.developer} className="hover:bg-secondary/30 transition-colors">
                    <td className="py-3.5 pl-5 font-bold text-foreground">{d.developer}</td>
                    <td className="py-3.5 text-xs text-muted-foreground">{d.project}</td>
                    <td className="py-3.5 font-mono text-xs">{d.deals}</td>
                    <td className="py-3.5 font-mono text-xs font-bold text-emerald-400">{d.amount}</td>
                    <td className="py-3.5 font-mono text-xs">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        d.days > 60 ? "bg-red-500/15 text-red-400" : d.days > 30 ? "bg-amber-500/15 text-amber-300" : "bg-blue-500/15 text-blue-400"
                      }`}>
                        {d.days} days
                      </span>
                    </td>
                    <td className="py-3.5">
                      <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-medium text-foreground">
                        {d.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-right pr-5">
                      {reminded[d.developer] ? (
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-bold">
                          <CheckCircle2 size={13} /> Reminder Sent
                        </span>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => sendReminder(d.developer)}
                          className="h-7 text-[11px] font-bold gap-1 border-amber-500/40 text-amber-300 hover:bg-amber-500/10"
                        >
                          <Send size={11} /> Send Escalation
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ═══ TAB 4: DUBAI CATALOG REGISTRY ═══ */}
      {activeTab === "catalog" && (
        <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-sm animate-in fade-in-50 duration-200">
          <div className="p-5 border-b border-border/60 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-foreground">Dubai Developments Master Catalog</h2>
              <p className="text-xs text-muted-foreground mt-0.5">{count(projects.count)} verified Dubai developments active in DealOS</p>
            </div>
            <Button size="sm" variant="outline" asChild className="h-8 text-xs font-semibold">
              <Link to="/app/offplan">Open Full Catalog →</Link>
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground bg-secondary/30">
                  <th className="py-3.5 pl-5">Project Name</th>
                  <th className="py-3.5">Master Developer</th>
                  <th className="py-3.5">Community</th>
                  <th className="py-3.5">Target Handover</th>
                  <th className="py-3.5">Status</th>
                  <th className="py-3.5 text-right pr-5">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {projects.rows.slice(0, 10).map((p) => (
                  <tr key={p.id} className="hover:bg-secondary/30 transition-colors">
                    <td className="py-3.5 pl-5 font-bold text-foreground">
                      <Link to="/app/project/$id" params={{ id: String(p.id) }} className="hover:text-primary transition-colors">
                        {p.name}
                      </Link>
                    </td>
                    <td className="py-3.5 text-muted-foreground text-xs">{p.developer_name ?? "—"}</td>
                    <td className="py-3.5 text-muted-foreground text-xs">{p.district ?? "Dubai"}</td>
                    <td className="py-3.5 font-mono text-xs">{quarterOf(p.handover_date)}</td>
                    <td className="py-3.5">
                      <span className="inline-flex rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-foreground capitalize">
                        {(p.sale_status ?? "Active").replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="py-3.5 text-right pr-5">
                      <Link
                        to="/app/project/$id"
                        params={{ id: String(p.id) }}
                        className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
                      >
                        <span>Dossier</span>
                        <ArrowUpRight size={12} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Clean Pagination */}
          <div className="p-4 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
            <span>Page {page} of {Math.max(1, Math.ceil(projects.count / INVENTORY_PAGE_SIZE))}</span>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="icon" className="size-8" disabled={page <= 1 || !onPage} onClick={() => onPage?.(page - 1)}>
                <ChevronLeft className="size-4" />
              </Button>
              <Button variant="outline" size="icon" className="size-8" disabled={page * INVENTORY_PAGE_SIZE >= projects.count || !onPage} onClick={() => onPage?.(page + 1)}>
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
