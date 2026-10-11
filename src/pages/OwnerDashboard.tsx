import { Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  Building2, Construction, Key, ArrowRight, ShieldCheck, TrendingUp,
  DollarSign, Clock, AlertTriangle, Send, CheckCircle2, Sparkles,
  Layers, ArrowUpRight, MessageCircle, ChevronRight, Target
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { inventorySummaryOptions } from "@/lib/inventory.functions";
import { aed } from "@/lib/format";
import { toast } from "sonner";

const count = (n: number) => n.toLocaleString("en-US");

export function OwnerDashboard({ page = 1, onPage }: { page?: number; onPage?: (page: number) => void }) {
  const { data } = useSuspenseQuery(inventorySummaryOptions());
  const [selectedPipelineStep, setSelectedPipelineStep] = useState<number>(0);
  const [escalated, setEscalated] = useState(false);

  const PIPELINE_FLOW = [
    {
      step: "01",
      title: "Inbound Leads",
      count: "24 New",
      metric: "92% < 5 min response",
      detail: "3 Hot priority investors waiting: Tariq Al-Hashimi (AED 3.5M cash), Elena Rostova (AED 2.2M off-plan), Ahmed K. (AED 1.4M rental).",
      actionLabel: "Open Leads Inbox",
      actionLink: "/app/leads",
      tagColor: "border-blue-500/40 text-blue-400 bg-blue-500/10",
    },
    {
      step: "02",
      title: "Active Viewings",
      count: "8 Scheduled",
      metric: "4 Today · 4 Tomorrow",
      detail: "Upcoming viewing at 2:30 PM with Dr. Sarah for Reef Luxury 995 DLRC suite. Broker assigned: Aisha Khan.",
      actionLabel: "View Calendar",
      actionLink: "/app/appointments",
      tagColor: "border-purple-500/40 text-purple-400 bg-purple-500/10",
    },
    {
      step: "03",
      title: "Contracts & SPA",
      count: "4 In Signing",
      metric: "AED 9.8M Volume",
      detail: "2 Emaar South Townhouses, 1 Sobha Hartland II apartment, and 1 Bayz 102 unit awaiting DLD Form F signatures.",
      actionLabel: "Open Deals",
      actionLink: "/app/deals",
      tagColor: "border-amber-500/40 text-amber-400 bg-amber-500/10",
    },
    {
      step: "04",
      title: "Developer Payouts",
      count: "AED 1.04M",
      metric: "5 Commission Vouchers",
      detail: "AED 190,000 Danube voucher reached 62 days. AED 340,000 Emaar voucher confirmed for processing.",
      actionLabel: "Claim Commission",
      actionLink: "/app/reports",
      tagColor: "border-emerald-500/40 text-emerald-400 bg-emerald-500/10",
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-20 animate-in fade-in-50 duration-300">
      {/* ═══ 1. ZEN EXECUTIVE BRIEFING (NATURAL LANGUAGE, ZERO CLUTTER) ═══ */}
      <section className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-r from-card via-card/95 to-secondary/30 p-6 sm:p-8 shadow-sm">
        <div className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-primary/10 blur-3xl" />

        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                <ShieldCheck size={13} /> Agency Velocity: 94% Peak Efficiency
              </span>
              <span className="text-muted-foreground">•</span>
              <span className="text-xs text-muted-foreground font-mono">DLD Escrow Live Synced</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-display">
              Good morning, Executive Director
            </h1>

            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
              Your 12 licensed brokers have closed <strong className="text-foreground font-mono">AED 18.4M YTD</strong>.
              Today you have <strong className="text-foreground">3 hot leads</strong> awaiting shortlists,
              and <strong className="text-foreground font-mono">AED 420,000</strong> in verified developer commission vouchers ready for drawdown.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Button variant="outline" asChild className="h-10 rounded-2xl text-xs font-bold gap-1.5 border-border">
              <Link to="/app/ai-assistant">
                <Sparkles size={15} className="text-primary" />
                <span>AI Mastermind</span>
              </Link>
            </Button>

            <Button asChild className="h-10 rounded-2xl text-xs font-bold gap-1.5 bg-primary text-primary-foreground shadow-sm">
              <Link to="/app/offplan">
                <Construction size={15} />
                <span>Explore Off-Plan</span>
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ═══ 2. VISUAL HUD: REVENUE DIAL & ESSENTIAL METRICS ═══ */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* The Golden Goal Dial (Radial Progress Ring) */}
        <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              October Agency Target
            </span>
            <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[11px] font-bold text-emerald-400 font-mono">
              84% Achieved
            </span>
          </div>

          <div className="flex items-center justify-center gap-6 py-2">
            {/* Visual Ring Representation */}
            <div className="relative size-28 rounded-full border-8 border-secondary flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-8 border-emerald-500 border-t-transparent -rotate-45" />
              <div className="text-center space-y-0.5">
                <span className="text-xl font-extrabold font-mono text-foreground">84%</span>
                <p className="text-[10px] text-muted-foreground font-semibold uppercase">Target</p>
              </div>
            </div>

            <div className="space-y-2">
              <div>
                <p className="text-xs text-muted-foreground">Closed Volume</p>
                <p className="text-xl font-black text-foreground font-mono">AED 4.2M</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Monthly Goal</p>
                <p className="text-sm font-bold text-muted-foreground font-mono">AED 5.0M</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-secondary/40 border border-border/60 p-3 text-xs text-muted-foreground flex items-center justify-between">
            <span>Pace to Target:</span>
            <strong className="text-emerald-400 font-mono">+12.4% ahead of schedule</strong>
          </div>
        </div>

        {/* 2 Essential Financial Pillars (No Spreadsheets) */}
        <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Active Pipeline Value
            </span>
            <span className="rounded-full bg-primary/10 border border-primary/30 px-2 py-0.5 text-[11px] font-bold text-primary font-mono">
              86 Active Deals
            </span>
          </div>

          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-black text-foreground font-mono font-display">
              AED 142.5M
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Total weighted transaction volume in negotiation across all licensed brokers.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-1">
            <div className="p-2.5 rounded-xl bg-secondary/40 border border-border/60">
              <span className="text-muted-foreground text-[10px] uppercase font-bold">Off-Plan</span>
              <p className="font-mono font-bold text-foreground">AED 94.2M</p>
            </div>
            <div className="p-2.5 rounded-xl bg-secondary/40 border border-border/60">
              <span className="text-muted-foreground text-[10px] uppercase font-bold">Secondary</span>
              <p className="font-mono font-bold text-foreground">AED 48.3M</p>
            </div>
          </div>
        </div>

        {/* Pending Developer Payouts */}
        <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
              Developer Receivables
            </span>
            <span className="rounded-full bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 text-[11px] font-bold text-amber-300 font-mono">
              5 Invoices Due
            </span>
          </div>

          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-black text-amber-400 font-mono font-display">
              AED 1.04M
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Approved broker commission vouchers pending direct transfer from master developers.
            </p>
          </div>

          <Button
            size="sm"
            onClick={() => {
              setEscalated(true);
              toast.success("DLD escalation notice dispatched to developer accounts department.");
            }}
            className="w-full h-10 rounded-2xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-black gap-1.5 shadow-sm"
          >
            <Send size={14} />
            <span>{escalated ? "Escalation Dispatched" : "One-Click Commission Drawdown"}</span>
          </Button>
        </div>
      </section>

      {/* ═══ 3. HORIZONTAL PIPELINE FLOW STREAM (NOT A BORING DATA TABLE) ═══ */}
      <section className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-border/60 pb-4">
          <div>
            <h2 className="text-lg font-extrabold text-foreground font-display flex items-center gap-2">
              <Layers size={18} className="text-primary" />
              <span>Agency Operational Flow</span>
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Click any stage to inspect today's volume and immediate next steps.
            </p>
          </div>

          <span className="text-xs text-muted-foreground font-mono">
            4 Linked Milestones
          </span>
        </div>

        {/* The Horizontal Flow Line */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PIPELINE_FLOW.map((item, idx) => (
            <div
              key={item.step}
              onClick={() => setSelectedPipelineStep(idx)}
              className={`cursor-pointer rounded-2xl border p-4 transition-all duration-200 space-y-2 ${
                selectedPipelineStep === idx
                  ? "bg-secondary/70 border-primary shadow-sm"
                  : "bg-card hover:bg-secondary/30 border-border/70"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-extrabold text-muted-foreground">
                  Step {item.step}
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

      {/* ═══ 4. 3 URGENT EXECUTIVE ACTIONS (NO LENGTHY AUDIT TABLES) ═══ */}
      <section className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-border/60 pb-4">
          <div>
            <h2 className="text-lg font-extrabold text-foreground font-display flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-400" />
              <span>Priority Action Items for Today</span>
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Only the 3 critical tasks requiring management sign-off or follow-up.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {/* Action 1 */}
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
            <div className="flex items-start gap-3">
              <AlertTriangle className="size-4 shrink-0 text-amber-400 mt-0.5" />
              <div className="space-y-0.5">
                <p className="font-bold text-foreground">Danube Properties: AED 190,000 Voucher Flagged</p>
                <p className="text-muted-foreground">Deal #1042 reached 62 days since SPA title registration.</p>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => toast.success("DLD commission notice sent to Danube Accounts department.")}
              className="h-8 text-xs font-bold border-amber-500/40 text-amber-300 hover:bg-amber-500/10 shrink-0"
            >
              Escalate Payout
            </Button>
          </div>

          {/* Action 2 */}
          <div className="rounded-2xl border border-blue-500/30 bg-blue-500/5 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
            <div className="flex items-start gap-3">
              <Clock className="size-4 shrink-0 text-blue-400 mt-0.5" />
              <div className="space-y-0.5">
                <p className="font-bold text-foreground">Speed-To-Lead Alert: 3 Unanswered Inquiries</p>
                <p className="text-muted-foreground">Inbound inquiries from Bayut received over 15 minutes ago.</p>
              </div>
            </div>
            <Button size="sm" asChild className="h-8 text-xs font-bold bg-primary text-primary-foreground shrink-0">
              <Link to="/app/leads" search={{ queue: "respond" }}>
                <span>Respond to Leads</span>
                <ChevronRight size={13} />
              </Link>
            </Button>
          </div>

          {/* Action 3 */}
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
            <div className="flex items-start gap-3">
              <ShieldCheck className="size-4 shrink-0 text-emerald-400 mt-0.5" />
              <div className="space-y-0.5">
                <p className="font-bold text-foreground">RERA Listing Compliance 100%</p>
                <p className="text-muted-foreground">All active portal listings hold verified Trakheesi permits with zero fine exposure.</p>
              </div>
            </div>
            <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 px-3 py-1 font-mono font-bold text-[11px] shrink-0">
              Compliant
            </span>
          </div>
        </div>
      </section>

      {/* ═══ 5. 1-CLICK CATALOG JUMP BAR ═══ */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          to="/app/offplan"
          className="group rounded-3xl border border-border/80 bg-card p-5 hover:border-primary/50 transition-all shadow-sm"
        >
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-xs font-bold text-primary flex items-center gap-1.5">
              <Construction size={14} /> Famous Off-Plan Showcase
            </span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </div>
          <p className="text-2xl font-extrabold text-foreground font-display">
            {count(data.categories.offplan.units)} Units
          </p>
          <p className="text-xs text-muted-foreground mt-1">7 Iconic Dubai Developments</p>
        </Link>

        <Link
          to="/app/rentals"
          className="group rounded-3xl border border-border/80 bg-card p-5 hover:border-primary/50 transition-all shadow-sm"
        >
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <Key size={14} /> Rental Suites & Ejari
            </span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </div>
          <p className="text-2xl font-extrabold text-foreground font-display">
            {count(data.categories.rental.units)} Units
          </p>
          <p className="text-xs text-muted-foreground mt-1">Synced with Live Demo Tenant Leads</p>
        </Link>

        <Link
          to="/app/listings"
          className="group rounded-3xl border border-border/80 bg-card p-5 hover:border-primary/50 transition-all shadow-sm"
        >
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
              <Building2 size={14} /> Ready Secondary Resales
            </span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </div>
          <p className="text-2xl font-extrabold text-foreground font-display">
            {count(data.categories.ready.units)} Units
          </p>
          <p className="text-xs text-muted-foreground mt-1">{aed(data.categories.ready.value)} Handed-over Units</p>
        </Link>
      </section>
    </div>
  );
}
