import { Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  Building2, Construction, Key, ArrowRight, ShieldCheck, TrendingUp,
  DollarSign, Clock, AlertTriangle, Send, CheckCircle2, Sparkles,
  Layers, ArrowUpRight, MessageCircle, ChevronRight, Target,
  Inbox, CalendarDays, Handshake, FileSignature, KeyRound, Users,
  Video, Eye, Play, Share2, Award, Zap, PhoneCall, BarChart3,
  Flame, CheckCheck, Megaphone, X
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { inventorySummaryOptions } from "@/lib/inventory.functions";
import { aed } from "@/lib/format";
import { toast } from "sonner";

export type BrokerStats = {
  id: string;
  name: string;
  role: string;
  reraNumber: string;
  avatar: string;
  dealsClosed: number;
  closedVolumeAed: number;
  closedVolumeFormatted: string;
  speedToLeadMins: number;
  activeDealsCount: number;
  agencyNetRevenueAed: number;
  agencyNetRevenueFormatted: string;
  tier: "Top Producer" | "Speed Demon" | "Rising Star" | "Needs Coaching";
  tierColor: string;
  phone: string;
};

export const AGENCY_BROKERS: BrokerStats[] = [
  {
    id: "broker-aisha",
    name: "Aisha Khan",
    role: "Senior Off-Plan Specialist",
    reraNumber: "RERA #49281",
    avatar: "AK",
    dealsClosed: 14,
    closedVolumeAed: 18400000,
    closedVolumeFormatted: "AED 18.4M",
    speedToLeadMins: 1.8,
    activeDealsCount: 7,
    agencyNetRevenueAed: 368000,
    agencyNetRevenueFormatted: "AED 368,000",
    tier: "Top Producer",
    tierColor: "bg-amber-500/10 text-amber-300 border-amber-500/30",
    phone: "+971501234567",
  },
  {
    id: "broker-tariq",
    name: "Tariq Mansoor",
    role: "Luxury Waterfront Broker",
    reraNumber: "RERA #38192",
    avatar: "TM",
    dealsClosed: 11,
    closedVolumeAed: 14200000,
    closedVolumeFormatted: "AED 14.2M",
    speedToLeadMins: 2.4,
    activeDealsCount: 5,
    agencyNetRevenueAed: 284000,
    agencyNetRevenueFormatted: "AED 284,000",
    tier: "Top Producer",
    tierColor: "bg-amber-500/10 text-amber-300 border-amber-500/30",
    phone: "+971509876543",
  },
  {
    id: "broker-zainab",
    name: "Zainab Al-Balooshi",
    role: "Downtown & Business Bay Lead",
    reraNumber: "RERA #51049",
    avatar: "ZB",
    dealsClosed: 8,
    closedVolumeAed: 8900000,
    closedVolumeFormatted: "AED 8.9M",
    speedToLeadMins: 2.1,
    activeDealsCount: 6,
    agencyNetRevenueAed: 178000,
    agencyNetRevenueFormatted: "AED 178,000",
    tier: "Speed Demon",
    tierColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    phone: "+971523456789",
  },
  {
    id: "broker-khalid",
    name: "Khalid Al-Nuaimi",
    role: "Secondary & Resales Director",
    reraNumber: "RERA #29481",
    avatar: "KN",
    dealsClosed: 6,
    closedVolumeAed: 4800000,
    closedVolumeFormatted: "AED 4.8M",
    speedToLeadMins: 4.2,
    activeDealsCount: 4,
    agencyNetRevenueAed: 96000,
    agencyNetRevenueFormatted: "AED 96,000",
    tier: "Rising Star",
    tierColor: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    phone: "+971556789012",
  },
  {
    id: "broker-omar",
    name: "Omar Farooq",
    role: "Off-Plan Junior Consultant",
    reraNumber: "RERA #62194",
    avatar: "OF",
    dealsClosed: 2,
    closedVolumeAed: 2350000,
    closedVolumeFormatted: "AED 2.35M",
    speedToLeadMins: 24.5,
    activeDealsCount: 3,
    agencyNetRevenueAed: 47000,
    agencyNetRevenueFormatted: "AED 47,000",
    tier: "Needs Coaching",
    tierColor: "bg-rose-500/10 text-rose-400 border-rose-500/30",
    phone: "+971567890123",
  },
];

export function OwnerDashboard({ page = 1, onPage }: { page?: number; onPage?: (page: number) => void }) {
  const { data } = useSuspenseQuery(inventorySummaryOptions());
  const [timeframe, setTimeframe] = useState<"today" | "week" | "month" | "ytd">("month");
  const [brokerFilter, setBrokerFilter] = useState<"all" | "top" | "fast" | "coaching">("all");
  const [escalated, setEscalated] = useState(false);
  const [broadcastOpen, setBroadcastOpen] = useState(false);
  const [broadcastMsg, setBroadcastMsg] = useState("");
  const [selectedPipelineStep, setSelectedPipelineStep] = useState<number>(0);

  // AI Mastermind Interactive State
  const [ownerAiQuestion, setOwnerAiQuestion] = useState("");
  const [ownerAiChat, setOwnerAiChat] = useState<{ role: "user" | "assistant"; text: string }[]>([]);
  const [ownerAiLoading, setOwnerAiLoading] = useState(false);

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash) {
        const el = document.querySelector(hash);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    };
    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  const PIPELINE_FLOW = [
    {
      step: "01",
      title: "Inbound Leads",
      count: "38 New",
      metric: "94% < 5 min response",
      detail: "38 high-intent investor inquiries across Instagram Reels (48%), WhatsApp (32%), and Portals (20%). Lead response speed is at an optimal 3.4 minutes.",
      actionLabel: "Inspect Inbound Queue",
      actionLink: "/app/leads",
      tagColor: "border-blue-500/40 text-blue-400 bg-blue-500/10",
    },
    {
      step: "02",
      title: "Active Viewings",
      count: "16 Scheduled",
      metric: "8 Today · 8 Tomorrow",
      detail: "High-value viewing appointments locked across Reef Luxury 995, Bayz 102, and Palm Jebel Ali. Assigned to Aisha Khan & Tariq Mansoor.",
      actionLabel: "View Master Schedule",
      actionLink: "/app/appointments",
      tagColor: "border-purple-500/40 text-purple-400 bg-purple-500/10",
    },
    {
      step: "03",
      title: "Contracts & Form F",
      count: "6 In Drafting",
      metric: "AED 18.4M Volume",
      detail: "6 unified DLD Form F agreements awaiting electronic buyer signature. Expected revenue closing: AED 368,000 this week.",
      actionLabel: "Review Contracts",
      actionLink: "/app/deals",
      tagColor: "border-amber-500/40 text-amber-400 bg-amber-500/10",
    },
    {
      step: "04",
      title: "Developer Commission Vouchers",
      count: "AED 1.04M",
      metric: "5 Approved Vouchers",
      detail: "AED 190,000 Danube voucher has reached 62 days since SPA title registration. AED 340,000 Emaar voucher confirmed for processing.",
      actionLabel: "Drawdown Receivables",
      actionLink: "/app/reports",
      tagColor: "border-emerald-500/40 text-emerald-400 bg-emerald-500/10",
    },
  ];

  const filteredBrokers = AGENCY_BROKERS.filter((b) => {
    if (brokerFilter === "top") return b.tier === "Top Producer";
    if (brokerFilter === "fast") return b.tier === "Speed Demon";
    if (brokerFilter === "coaching") return b.tier === "Needs Coaching";
    return true;
  });

  const handleSendOwnerAi = (customText?: string) => {
    const q = (customText || ownerAiQuestion).trim();
    if (!q) return;

    setOwnerAiChat((prev) => [...prev, { role: "user", text: q }]);
    setOwnerAiQuestion("");
    setOwnerAiLoading(true);

    setTimeout(() => {
      let reply = "";
      if (q.toLowerCase().includes("coach") || q.toLowerCase().includes("omar") || q.toLowerCase().includes("slow")) {
        reply = `**Executive Coaching Plan for Agent Omar Farooq:**
* **Diagnosis:** Omar's average response time on 4 Instagram leads today slipped to **24.5 minutes** (agency benchmark is < 5 mins). In Dubai, conversion drops by 68% after 15 minutes.
* **Immediate Action:** We have prepared a 1-click WhatsApp speed-to-lead template for Omar. Click "WhatsApp Coach" in the broker table below to push this instruction directly to his phone.`;
      } else if (q.toLowerCase().includes("danube") || q.toLowerCase().includes("commission") || q.toLowerCase().includes("debt")) {
        reply = `**Developer Receivable Recovery (Danube Properties):**
* **Voucher #1042 (AED 190,000):** Overdue by **62 days** since official DLD Title Registration.
* **Recommended Legal Move:** Under RERA circular 44/2023, agencies are entitled to payment within 45 days of 20% milestone completion. Click **One-Click Commission Drawdown** to dispatch the formal demand letter to Danube's Accounts Director.`;
      } else if (q.toLowerCase().includes("reel") || q.toLowerCase().includes("marketing") || q.toLowerCase().includes("ad")) {
        reply = `**Social Ad & Reels ROI Analysis:**
* **Top Performer:** The **1% Monthly Post-Handover Hack (TikTok & IG)** is generating qualified buyer leads at **AED 29/lead** (54% cheaper than portal listings).
* **Strategic Reallocation:** Shift AED 4,500 from low-performing Facebook ads into the TikTok 1% campaign to generate an estimated 150+ additional off-plan leads this month.`;
      } else {
        reply = `**Executive Strategic Briefing:**
Your agency is pacing at **94% operational velocity** with **AED 48.65M YTD Volume**. Your highest leverage actions today:
1. Escalate the **AED 190,000 Danube commission voucher**.
2. Have Aisha Khan close the **AED 3.5M Tariq Al-Hashimi** cash deal.
3. Reallocate AED 4,500 into the **1% Monthly Reels campaign**.`;
      }

      setOwnerAiChat((prev) => [...prev, { role: "assistant", text: reply }]);
      setOwnerAiLoading(false);
    }, 650);
  };

  const handleBroadcastSubmit = () => {
    if (!broadcastMsg.trim()) return;
    toast.success(`Announcement broadcast to all 12 licensed brokers via WhatsApp & In-App!`);
    setBroadcastMsg("");
    setBroadcastOpen(false);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-24 animate-in fade-in-50 duration-300">
      {/* ═══ 1. ZEN EXECUTIVE COMMAND CANOPY ═══ */}
      <section className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-r from-card via-card/95 to-secondary/30 p-6 sm:p-8 shadow-sm">
        <div className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-primary/10 blur-3xl" />

        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                Agency Overwatch · 12 Licensed Brokers Live
              </span>
              <span className="text-muted-foreground">•</span>
              <span className="text-xs text-muted-foreground font-mono">
                94% Operational Velocity · DLD Trust Certified
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-display">
              Good morning, Managing Director
            </h1>

            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
              Your brokerage has closed <strong className="text-foreground font-mono">AED 48.65M YTD</strong>. Today you have <strong className="text-foreground">38 active buyer leads</strong> across your team, and <strong className="text-foreground font-mono">AED 1.04M</strong> in developer commission vouchers awaiting drawdown.
            </p>
          </div>

          {/* Executive Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {/* Timeframe Selector */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-secondary/70 border border-border/60 text-xs font-bold">
              {[
                { id: "today", label: "Today" },
                { id: "week", label: "Week" },
                { id: "month", label: "October" },
                { id: "ytd", label: "2026 YTD" },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTimeframe(t.id as typeof timeframe)}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    timeframe === t.id
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Broadcast Button */}
            <Button
              variant="outline"
              onClick={() => setBroadcastOpen(true)}
              className="h-10 rounded-2xl text-xs font-bold gap-1.5 border-border shadow-sm hover:bg-secondary"
            >
              <Megaphone size={14} className="text-amber-400" />
              <span>Broadcast to Team</span>
            </Button>

            {/* Switch to Broker Workspace */}
            <Button
              asChild
              className="h-10 rounded-2xl text-xs font-bold gap-1.5 bg-primary text-primary-foreground shadow-sm hover:brightness-105"
            >
              <Link to="/app/leads">
                <span>Broker Leads View ↗</span>
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ═══ 2. TOP 4 ADDICTIVE EXECUTIVE METRIC CARDS ═══ */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Closed GMV */}
        <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-border/50 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <TrendingUp size={14} className="text-emerald-400" /> Closed GMV (YTD)
            </span>
            <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-400 font-mono">
              +24.2% YoY
            </span>
          </div>

          <div className="space-y-1">
            <p className="text-3xl font-black text-foreground font-mono font-display">
              AED 48.65M
            </p>
            <p className="text-xs text-muted-foreground">
              41 Transactions closed across off-plan &amp; secondary.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-1">
            <div className="p-2 rounded-xl bg-secondary/40 border border-border/60">
              <span className="text-[10px] uppercase font-bold text-muted-foreground">Off-Plan</span>
              <p className="font-mono font-bold text-foreground">AED 36.4M</p>
            </div>
            <div className="p-2 rounded-xl bg-secondary/40 border border-border/60">
              <span className="text-[10px] uppercase font-bold text-muted-foreground">Secondary</span>
              <p className="font-mono font-bold text-foreground">AED 12.2M</p>
            </div>
          </div>
        </div>

        {/* Card 2: Net Agency Commission (With Radial Dial) */}
        <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-border/50 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <DollarSign size={14} className="text-primary" /> Net Agency Revenue
            </span>
            <span className="rounded-full bg-primary/10 border border-primary/30 px-2 py-0.5 text-[10px] font-bold text-primary font-mono">
              84% of Q4 Goal
            </span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-3xl font-black text-foreground font-mono font-display">
                AED 1.94M
              </p>
              <p className="text-xs text-muted-foreground">
                Company share after 50/50 broker commission splits.
              </p>
            </div>

            {/* Visual Ring Representation */}
            <div className="relative size-16 shrink-0 rounded-full border-4 border-secondary flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent -rotate-45" />
              <span className="text-xs font-black font-mono text-foreground">84%</span>
            </div>
          </div>

          <div className="rounded-xl bg-secondary/40 border border-border/60 p-2.5 text-xs text-muted-foreground flex items-center justify-between">
            <span>Quarterly Target:</span>
            <strong className="text-foreground font-mono">AED 2.30M</strong>
          </div>
        </div>

        {/* Card 3: Developer Debt / Receivables Ledger */}
        <div id="vouchers" className="rounded-3xl border border-amber-500/30 bg-amber-500/5 p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
              <Clock size={14} className="text-amber-400" /> Developer Receivables
            </span>
            <span className="rounded-full bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 text-[10px] font-bold text-amber-300 font-mono">
              5 Vouchers Due
            </span>
          </div>

          <div className="space-y-1">
            <p className="text-3xl font-black text-amber-400 font-mono font-display">
              AED 1.04M
            </p>
            <p className="text-xs text-amber-200/80">
              ⚠️ Danube voucher #1042 (AED 190,000) reached 62 days.
            </p>
          </div>

          <Button
            size="sm"
            onClick={() => {
              setEscalated(true);
              toast.success("DLD formal commission escalation letter dispatched to Danube Accounts Department.");
            }}
            className="w-full h-9 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-black gap-1.5 shadow-sm"
          >
            <Send size={13} />
            <span>{escalated ? "Notice Dispatched" : "1-Click Commission Drawdown"}</span>
          </Button>
        </div>

        {/* Card 4: Agency Speed-to-Lead Response */}
        <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-border/50 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Zap size={14} className="text-blue-400" /> Speed-To-Lead Pulse
            </span>
            <span className="rounded-full bg-blue-500/10 border border-blue-500/30 px-2 py-0.5 text-[10px] font-bold text-blue-400 font-mono">
              94.2% &lt; 5m
            </span>
          </div>

          <div className="space-y-1">
            <p className="text-3xl font-black text-foreground font-mono font-display">
              3.4 Mins
            </p>
            <p className="text-xs text-muted-foreground">
              Median time from inquiry arrival to first WhatsApp outreach.
            </p>
          </div>

          <div className="rounded-xl bg-secondary/40 border border-border/60 p-2.5 text-xs text-muted-foreground flex items-center justify-between">
            <span>Fastest Broker:</span>
            <strong className="text-emerald-400">Aisha Khan (1.8m)</strong>
          </div>
        </div>
      </section>

      {/* ═══ 3. BROKER OVERWATCH & EMPLOYEE LEADERBOARD ═══ */}
      <section id="brokers" className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/60 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-foreground font-display flex items-center gap-2">
                <Users size={18} className="text-primary" />
                <span>Broker &amp; Agent Overwatch</span>
              </h2>
              <span className="rounded-full bg-secondary border border-border px-2.5 py-0.5 text-[10px] font-mono font-bold text-muted-foreground">
                12 Active Agents
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Monitor individual revenue contribution, closing rates, response speeds, and coach underperforming agents in 1 click.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-secondary/70 border border-border/60 text-xs font-bold">
            {[
              { id: "all", label: "All Agents (12)" },
              { id: "top", label: "🏆 Top Producers" },
              { id: "fast", label: "⚡ Fast Responders" },
              { id: "coaching", label: "⚠️ Needs Coaching" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setBrokerFilter(f.id as typeof brokerFilter)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  brokerFilter === f.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* The Leaderboard List */}
        <div className="space-y-3">
          {filteredBrokers.map((broker, idx) => (
            <div
              key={broker.id}
              className="rounded-2xl border border-border/80 bg-secondary/30 hover:border-primary/50 hover:bg-secondary/50 p-4 transition-all duration-200 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 shadow-sm"
            >
              {/* Identity & Rank */}
              <div className="flex items-center gap-4 min-w-[240px]">
                <div className="relative flex size-12 shrink-0 items-center justify-center rounded-2xl bg-secondary border border-border/80 font-display font-black text-base text-foreground shadow-sm">
                  {broker.avatar}
                  <span className="size-2.5 rounded-full bg-emerald-500 absolute -top-1 -right-1 border-2 border-card" />
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-base text-foreground font-display">
                      #{idx + 1} {broker.name}
                    </h3>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold border font-mono ${broker.tierColor}`}>
                      {broker.tier}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground font-mono">
                    {broker.role} · {broker.reraNumber}
                  </p>
                </div>
              </div>

              {/* Performance Metrics Cluster */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs flex-1 lg:px-6 lg:border-l lg:border-r lg:border-border/60">
                <div>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">Closed Volume</span>
                  <p className="text-sm font-extrabold font-mono text-foreground">{broker.closedVolumeFormatted}</p>
                  <span className="text-[10px] text-muted-foreground">({broker.dealsClosed} closed deals)</span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">Speed to Lead</span>
                  <p className={`text-sm font-extrabold font-mono ${broker.speedToLeadMins > 10 ? "text-rose-400" : "text-emerald-400"}`}>
                    {broker.speedToLeadMins} mins
                  </p>
                  <span className="text-[10px] text-muted-foreground">{broker.speedToLeadMins < 5 ? "⚡ Instant" : "⚠️ Delayed"}</span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">Active Deals</span>
                  <p className="text-sm font-extrabold font-mono text-foreground">{broker.activeDealsCount} in flight</p>
                  <span className="text-[10px] text-muted-foreground">DLD Form F/Viewings</span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">Agency Net</span>
                  <p className="text-sm font-extrabold font-mono text-primary">{broker.agencyNetRevenueFormatted}</p>
                  <span className="text-[10px] text-muted-foreground">Company share</span>
                </div>
              </div>

              {/* 1-Click Management Triggers */}
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={`https://wa.me/${broker.phone.replace(/\D/g, "")}?text=${encodeURIComponent(
                    broker.tier === "Needs Coaching"
                      ? `Hi ${broker.name.split(" ")[0]}, noticed your average lead response time slipped to ${broker.speedToLeadMins} mins today. Let's make sure we hit inquiries within 5 minutes to keep conversion high!`
                      : `Great work ${broker.name.split(" ")[0]}! You've brought in ${broker.agencyNetRevenueFormatted} net for the agency this month. Keep up the great velocity!`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-xl border border-border bg-card hover:bg-secondary text-foreground font-bold text-xs shadow-sm transition-all"
                  title="WhatsApp Coaching Prompt"
                >
                  <MessageCircle size={14} className="text-emerald-500" />
                  <span>{broker.tier === "Needs Coaching" ? "Coach Agent" : "Congratulate"}</span>
                </a>

                <Button asChild size="sm" className="h-9 px-3.5 rounded-xl text-xs font-bold bg-primary text-primary-foreground shadow-sm">
                  <Link to="/app/leads">
                    <span>Inspect</span>
                    <ArrowUpRight size={13} className="ml-1" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ 4. COMPANY DEAL STAGES RADAR ═══ */}
      <section id="pipeline" className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-border/60 pb-4">
          <div>
            <h2 className="text-lg font-extrabold text-foreground font-display flex items-center gap-2">
              <Layers size={18} className="text-primary" />
              <span>Agency Operational Flow &amp; Pipeline Radar</span>
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Click any stage to inspect today's volume, bottlenecks, and broker distribution.
            </p>
          </div>
          <span className="text-xs text-muted-foreground font-mono">4 Linked Milestones</span>
        </div>

        {/* The Horizontal Flow Line */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PIPELINE_FLOW.map((item, idx) => (
            <div
              key={item.step}
              onClick={() => setSelectedPipelineStep(idx)}
              className={`cursor-pointer rounded-2xl border p-4 transition-all duration-200 space-y-2 ${
                selectedPipelineStep === idx
                  ? "bg-secondary/70 border-primary shadow-sm ring-2 ring-primary/20"
                  : "bg-card hover:bg-secondary/30 border-border/70"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-extrabold text-muted-foreground">
                  Stage {item.step}
                </span>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold border font-mono ${item.tagColor}`}>
                  {item.count}
                </span>
              </div>

              <h3 className="font-bold text-sm text-foreground">{item.title}</h3>
              <p className="text-xs text-muted-foreground font-mono">{item.metric}</p>
            </div>
          ))}
        </div>

        {/* Selected Stage Detail Banner */}
        <div className="rounded-2xl bg-secondary/30 border border-border/70 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-primary uppercase tracking-wider">
              {PIPELINE_FLOW[selectedPipelineStep].title} Focus:
            </span>
            <p className="text-xs sm:text-sm text-foreground leading-relaxed">
              {PIPELINE_FLOW[selectedPipelineStep].detail}
            </p>
          </div>

          <Button asChild size="sm" className="rounded-xl text-xs font-bold shrink-0">
            <Link to={PIPELINE_FLOW[selectedPipelineStep].actionLink}>
              <span>{PIPELINE_FLOW[selectedPipelineStep].actionLabel}</span>
              <ArrowUpRight size={13} className="ml-1" />
            </Link>
          </Button>
        </div>
      </section>

      {/* ═══ 5. REELS & SOCIAL AD CAMPAIGN OVERWATCH ═══ */}
      <section id="reels" className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/60 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-extrabold text-foreground font-display flex items-center gap-2">
                <Video size={18} className="text-rose-400" />
                <span>Reels &amp; Social Ad Lead Generation Overwatch</span>
              </h2>
              <span className="rounded-full bg-rose-500/10 border border-rose-500/30 px-2.5 py-0.5 text-[10px] font-mono font-bold text-rose-400">
                36.8x ROAS
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Live lead generation attribution across Instagram Reels, TikTok tours, and paid Meta investor corridors.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="text-muted-foreground">Total Spend: <strong className="text-foreground">AED 18,500</strong></span>
            <span className="text-muted-foreground">•</span>
            <span className="text-emerald-400 font-bold">Pipeline: AED 68.7M</span>
          </div>
        </div>

        {/* The 3 Campaigns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Reel 1 */}
          <div className="rounded-2xl border border-border/80 bg-secondary/30 p-5 space-y-3 shadow-sm">
            <div className="flex items-center justify-between text-xs">
              <span className="inline-flex items-center gap-1 font-bold text-rose-400">
                <Play size={12} fill="currentColor" /> Instagram Reel #1
              </span>
              <span className="font-mono text-muted-foreground">142k Views</span>
            </div>
            <h4 className="font-extrabold text-sm text-foreground">
              "Inside the AED 40M Penthouse with Helipad"
            </h4>
            <div className="space-y-1.5 text-xs pt-1">
              <div className="flex justify-between text-muted-foreground">
                <span>Qualified Leads:</span>
                <strong className="text-foreground font-mono">48 Leads</strong>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Cost Per Lead (CPL):</span>
                <strong className="text-emerald-400 font-mono">AED 38</strong>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Pipeline Generated:</span>
                <strong className="text-foreground font-mono">AED 24.2M</strong>
              </div>
            </div>
          </div>

          {/* Reel 2 */}
          <div className="rounded-2xl border border-border/80 bg-secondary/30 p-5 space-y-3 shadow-sm">
            <div className="flex items-center justify-between text-xs">
              <span className="inline-flex items-center gap-1 font-bold text-blue-400">
                <Play size={12} fill="currentColor" /> Instagram Reel #2
              </span>
              <span className="font-mono text-muted-foreground">98k Views</span>
            </div>
            <h4 className="font-extrabold text-sm text-foreground">
              "Why Palm Jebel Ali is Beating Palm Jumeirah in 2026"
            </h4>
            <div className="space-y-1.5 text-xs pt-1">
              <div className="flex justify-between text-muted-foreground">
                <span>Qualified Leads:</span>
                <strong className="text-foreground font-mono">32 Leads</strong>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Cost Per Lead (CPL):</span>
                <strong className="text-emerald-400 font-mono">AED 44</strong>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Pipeline Generated:</span>
                <strong className="text-foreground font-mono">AED 16.5M</strong>
              </div>
            </div>
          </div>

          {/* Reel 3 */}
          <div className="rounded-2xl border border-primary/40 bg-primary/5 p-5 space-y-3 shadow-sm">
            <div className="flex items-center justify-between text-xs">
              <span className="inline-flex items-center gap-1 font-bold text-primary">
                <Flame size={13} className="text-amber-400" /> TikTok Top Performer
              </span>
              <span className="font-mono text-muted-foreground">230k Views</span>
            </div>
            <h4 className="font-extrabold text-sm text-foreground">
              "The 1% Monthly Post-Handover Payment Plan Hack"
            </h4>
            <div className="space-y-1.5 text-xs pt-1">
              <div className="flex justify-between text-muted-foreground">
                <span>Qualified Leads:</span>
                <strong className="text-foreground font-mono">74 Leads</strong>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Cost Per Lead (CPL):</span>
                <strong className="text-emerald-400 font-mono">AED 29</strong>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Pipeline Generated:</span>
                <strong className="text-emerald-400 font-mono">AED 28.0M</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 6. DEDICATED COMPANY OWNER AI MASTERMIND ═══ */}
      <section id="mastermind" className="rounded-3xl border border-primary/40 bg-card p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/60 pb-5">
          <div className="flex items-center gap-3">
            <div className="size-11 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">
                Company Owner AI Mastermind
              </h2>
              <p className="text-xs text-muted-foreground">
                Strategic decision support: broker coaching, developer commission recovery, and ad budget optimization.
              </p>
            </div>
          </div>

          <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3 py-1 font-mono font-bold text-xs">
            Agency Executive Model Live
          </span>
        </div>

        {/* 3 Executive Strategy Suggestions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          <div
            onClick={() => handleSendOwnerAi("Coach underperforming agent Omar Farooq on speed to lead")}
            className="cursor-pointer rounded-2xl border border-rose-500/30 bg-rose-500/5 hover:bg-rose-500/10 p-4 space-y-2 transition-all shadow-sm"
          >
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
              <span>⚠️</span> Broker Coaching Alert
            </span>
            <p className="text-xs font-bold text-foreground">Omar's response time is 24 mins today.</p>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Click to generate personalized WhatsApp speed coaching for Omar.
            </p>
          </div>

          <div
            onClick={() => handleSendOwnerAi("Recover AED 190,000 overdue commission from Danube")}
            className="cursor-pointer rounded-2xl border border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10 p-4 space-y-2 transition-all shadow-sm"
          >
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <span>💳</span> Commission Claim Notice
            </span>
            <p className="text-xs font-bold text-foreground">Danube voucher is 62 days overdue.</p>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Click to review DLD Trust formal claim demand letter.
            </p>
          </div>

          <div
            onClick={() => handleSendOwnerAi("Scale budget on TikTok 1% monthly Reels campaign")}
            className="cursor-pointer rounded-2xl border border-primary/30 bg-primary/5 hover:bg-primary/10 p-4 space-y-2 transition-all shadow-sm"
          >
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-primary flex items-center gap-1.5">
              <span>📈</span> Ad Budget Scaling
            </span>
            <p className="text-xs font-bold text-foreground">TikTok Reel is at AED 29/lead.</p>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Click to review budget reallocation plan to gain 150+ extra leads.
            </p>
          </div>
        </div>

        {/* AI Stream */}
        {ownerAiChat.length > 0 && (
          <div className="space-y-3 pt-2">
            {ownerAiChat.map((item, idx) => (
              <div
                key={idx}
                className={`rounded-2xl p-4 text-xs leading-relaxed ${
                  item.role === "user"
                    ? "bg-primary text-primary-foreground font-semibold ml-auto max-w-xl text-right"
                    : "bg-secondary/40 border border-border/70 text-foreground max-w-2xl whitespace-pre-wrap"
                }`}
              >
                {item.text}
              </div>
            ))}
          </div>
        )}

        {ownerAiLoading && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground p-3">
            <Sparkles size={14} className="text-primary animate-spin" />
            <span>Owner AI Mastermind is computing strategic revenue recommendations...</span>
          </div>
        )}

        {/* Input Bar */}
        <div className="flex gap-2">
          <input
            value={ownerAiQuestion}
            onChange={(e) => setOwnerAiQuestion(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleSendOwnerAi(); }}
            placeholder="Ask Owner AI anything (e.g., 'What is our expected profit next month?', 'Which developer owes us money?')..."
            className="flex-1 h-11 rounded-2xl border border-border bg-secondary/40 px-4 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary shadow-sm"
          />
          <Button
            onClick={() => handleSendOwnerAi()}
            disabled={!ownerAiQuestion.trim()}
            className="h-11 px-5 rounded-2xl bg-primary text-primary-foreground text-xs font-bold gap-2 shadow-sm"
          >
            <span>Ask Mastermind</span>
            <Send size={14} />
          </Button>
        </div>
      </section>

      {/* ═══ TEAM BROADCAST MODAL ═══ */}
      {broadcastOpen && (
        <Dialog open={broadcastOpen} onOpenChange={setBroadcastOpen}>
          <DialogContent className="max-w-md rounded-3xl bg-card border-border p-6 space-y-4">
            <DialogHeader className="border-b border-border/60 pb-3">
              <DialogTitle className="text-lg font-black text-foreground font-display flex items-center gap-2">
                <Megaphone size={18} className="text-amber-400" />
                <span>Broadcast to All 12 Brokers</span>
              </DialogTitle>
              <p className="text-xs text-muted-foreground">
                Dispatches a high-priority push notice and WhatsApp ping to all active team members.
              </p>
            </DialogHeader>

            <textarea
              rows={4}
              value={broadcastMsg}
              onChange={(e) => setBroadcastMsg(e.target.value)}
              placeholder="e.g. Attention team: Sobha Orbis has released 10 new pool-view units with 1% monthly plan. Priority call all leads in DLRC and Motor City!"
              className="w-full rounded-2xl border border-border bg-secondary/40 p-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setBroadcastOpen(false)} className="rounded-xl text-xs">
                Cancel
              </Button>
              <Button
                onClick={handleBroadcastSubmit}
                disabled={!broadcastMsg.trim()}
                className="rounded-xl text-xs font-bold bg-primary text-primary-foreground gap-1.5"
              >
                <Send size={13} />
                <span>Send Broadcast</span>
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
