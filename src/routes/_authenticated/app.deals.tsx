import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Building2, ChevronDown, CheckCircle2, Clock, AlertCircle, ArrowRight,
  User, DollarSign, ShieldCheck, Share2, Plus, MessageCircle, Phone,
  ArrowUpRight, Layers, FileText, Check, Award, Compass, ExternalLink
} from "lucide-react";
import { toast } from "sonner";
import { workspaceHead } from "@/components/app/WorkspacePlaceholder";
import { formatAed } from "@/lib/demo-leads";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export const Route = createFileRoute("/_authenticated/app/deals")({
  head: () => workspaceHead("Deals & Commissions"),
  component: Page,
});

type Stage = "EOI Token" | "SPA Contract" | "DLD Registration" | "Commission Due" | "Closed Won";

type Deal = {
  id: string;
  property: string;
  unit: string;
  area: string;
  buyer: string;
  source: string;
  type: "Off-Plan Sale" | "Secondary Sale" | "Rental";
  amount: number;
  paid: number;
  commission: number;
  agent: string;
  stage: Stage;
  plan: string;
  nextMilestone: string;
  updated: string;
  developer: string;
};

const STAGES: Stage[] = [
  "EOI Token",
  "SPA Contract",
  "DLD Registration",
  "Commission Due",
  "Closed Won",
];

const STAGE_CONFIG: Record<Stage, { color: string; bg: string; border: string }> = {
  "EOI Token": { color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/30" },
  "SPA Contract": { color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/30" },
  "DLD Registration": { color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/30" },
  "Commission Due": { color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/30" },
  "Closed Won": { color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30" },
};

const INITIAL_DEALS: Deal[] = [
  {
    id: "DL-1041",
    property: "Celestara Residences",
    unit: "Unit #1006 · Studio Suite",
    area: "JVC (Jumeirah Village Circle)",
    developer: "Celestara Developments",
    buyer: "Tariq Mansoor",
    source: "WhatsApp Referral",
    type: "Off-Plan Sale",
    amount: 498000,
    paid: 49800,
    commission: 14940,
    agent: "Saad Khan",
    stage: "EOI Token",
    plan: "10 / 50 / 40 Escrow Plan",
    nextMilestone: "SPA contract signing scheduled 15 Oct",
    updated: "2 hours ago",
  },
  {
    id: "DL-1042",
    property: "09 Life Residences",
    unit: "Unit #101 · 1 Bedroom",
    area: "DLRC (Dubai Land)",
    developer: "Reef Luxury",
    buyer: "Sophie Laurent",
    source: "Meta Campaign",
    type: "Off-Plan Sale",
    amount: 1545000,
    paid: 154500,
    commission: 38625,
    agent: "Aisha Salem",
    stage: "EOI Token",
    plan: "10 / 40 / 50 Milestone Plan",
    nextMilestone: "Awaiting developer compliance & KYC review",
    updated: "Yesterday",
  },
  {
    id: "DL-1035",
    property: "Binghatti Dusk",
    unit: "Unit #402 · 2 Bedroom Suite",
    area: "JVC",
    developer: "Binghatti Developers",
    buyer: "Elena Petrova",
    source: "Property Finder",
    type: "Off-Plan Sale",
    amount: 1890000,
    paid: 378000,
    commission: 47250,
    agent: "Omar Farooq",
    stage: "SPA Contract",
    plan: "70 / 30 Fast Handover Plan",
    nextMilestone: "Buyer legal counsel reviewing DLD SPA Form F",
    updated: "3 hours ago",
  },
  {
    id: "DL-1036",
    property: "Amali Island Waterfront",
    unit: "Villa #1204 · 3 Bedroom Beach Mansion",
    area: "Business Bay / Canal",
    developer: "Amali Properties",
    buyer: "Khalid Al Suwaidi",
    source: "Direct Broker Network",
    type: "Off-Plan Sale",
    amount: 4250000,
    paid: 850000,
    commission: 106250,
    agent: "Saad Khan",
    stage: "DLD Registration",
    plan: "80 / 20 Escrow Construction Plan",
    nextMilestone: "DLD 4% Oqood certificate issued; awaiting registry stamp",
    updated: "Yesterday",
  },
  {
    id: "DL-1025",
    property: "DIFC Heights Executive",
    unit: "Unit #805 · 1 Bedroom",
    area: "DIFC / Downtown",
    developer: "DIFC Properties",
    buyer: "Marcus Vance",
    source: "Website Direct",
    type: "Secondary Sale",
    amount: 2150000,
    paid: 2150000,
    commission: 53750,
    agent: "Priya Nair",
    stage: "Commission Due",
    plan: "100% Cash Settlement",
    nextMilestone: "Developer invoice #INV-882 approved; transfer in 48h",
    updated: "1 day ago",
  },
  {
    id: "DL-1018",
    property: "Marina Gate Tower 1",
    unit: "Unit #1802 · 2 Bedroom Waterfront",
    area: "Dubai Marina",
    developer: "Select Group",
    buyer: "Daniel Okonkwo",
    source: "Bayut VIP Lead",
    type: "Secondary Sale",
    amount: 2850000,
    paid: 2850000,
    commission: 57000,
    agent: "Aisha Salem",
    stage: "Closed Won",
    plan: "Mortgage Handover Completed",
    nextMilestone: "Title Deed cleared & broker commission disbursed",
    updated: "2 days ago",
  },
];

function Page() {
  const [deals, setDeals] = useState<Deal[]>(INITIAL_DEALS);
  const [activeStage, setActiveStage] = useState<string>("All");
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);

  const totalPipeline = useMemo(() => deals.reduce((acc, d) => acc + d.amount, 0), [deals]);
  const totalCommission = useMemo(() => deals.reduce((acc, d) => acc + d.commission, 0), [deals]);
  const totalEscrowPaid = useMemo(() => deals.reduce((acc, d) => acc + d.paid, 0), [deals]);
  const totalClosedWon = useMemo(
    () => deals.filter((d) => d.stage === "Closed Won").reduce((acc, d) => acc + d.amount, 0),
    [deals]
  );

  const filteredDeals = useMemo(() => {
    if (activeStage === "All") return deals;
    return deals.filter((d) => d.stage === activeStage);
  }, [deals, activeStage]);

  const advanceStage = (e: React.MouseEvent, dealId: string) => {
    e.stopPropagation();
    setDeals((prev) =>
      prev.map((d) => {
        if (d.id !== dealId) return d;
        const currentIdx = STAGES.indexOf(d.stage);
        if (currentIdx < STAGES.length - 1) {
          const nextStage = STAGES[currentIdx + 1];
          if (nextStage) {
            toast.success(`${d.property} advanced to ${nextStage}`);
            return { ...d, stage: nextStage };
          }
        }
        return d;
      })
    );
  };

  const handleWhatsAppBuyer = (e: React.MouseEvent, deal: Deal) => {
    e.stopPropagation();
    const text = `Hi ${deal.buyer.split(" ")[0]}, following up on your property transaction for *${deal.property}* (${deal.unit}) at ${deal.area}. Current status is: *${deal.stage}*. Next milestone: ${deal.nextMilestone}. Please let me know if you need any assistance!`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
    toast.success(`WhatsApp message prepared for ${deal.buyer}`);
  };

  return (
    <div className="w-full space-y-6 pb-24 animate-in fade-in-50 duration-300">
      {/* ═══ 1. CLEAN EXECUTIVE BRIEFING ═══ */}
      <section className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-r from-card via-card to-secondary/30 p-6 sm:p-7 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-primary">
                Brokerage Money & Escrow
              </span>
              <span className="text-muted-foreground">•</span>
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                <ShieldCheck size={14} /> DLD Trust Account Monitored
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-display">
              Deals & Commission Pipeline
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Total visibility into closed sales, escrow receipts, and pending broker commissions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => toast.success("DLD pipeline statement exported to PDF.")}
              variant="outline"
              className="h-10 rounded-2xl text-xs font-bold border-border gap-1.5"
            >
              <FileText size={14} />
              <span>Export PDF Statement</span>
            </Button>
            <Button
              onClick={() => toast("New transaction draft opened.")}
              className="h-10 rounded-2xl text-xs font-bold bg-primary text-primary-foreground gap-1.5 shadow-sm"
            >
              <Plus size={15} />
              <span>New Deal</span>
            </Button>
          </div>
        </div>
      </section>

      {/* ═══ 2. STREAMLINED REVENUE HUD ═══ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-sm space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Total Pipeline</span>
          <p className="text-2xl sm:text-3xl font-black text-foreground font-mono">{formatAed(totalPipeline)}</p>
          <p className="text-[11px] text-muted-foreground">{deals.length} active property deals</p>
        </div>

        <div className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-sm space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">Escrow Collected</span>
          <p className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">{formatAed(totalEscrowPaid)}</p>
          <p className="text-[11px] text-muted-foreground">39% of total contract volume</p>
        </div>

        <div className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-sm space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300">Commission Forecast</span>
          <p className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">{formatAed(totalCommission)}</p>
          <p className="text-[11px] text-muted-foreground">Agent payout pool (50% split)</p>
        </div>

        <div className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-sm space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">Closed Won</span>
          <p className="text-2xl sm:text-3xl font-black text-foreground font-mono">{formatAed(totalClosedWon)}</p>
          <p className="text-[11px] text-muted-foreground">Title deeds cleared & settled</p>
        </div>
      </div>

      {/* ═══ 3. HORIZONTAL STAGE SELECTOR (NOT 5 CRAMPED SQUEEZED COLUMNS) ═══ */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border/60 pb-3">
        <button
          onClick={() => setActiveStage("All")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeStage === "All"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-secondary/60 text-muted-foreground hover:text-foreground"
          }`}
        >
          All Stages ({deals.length})
        </button>

        {STAGES.map((st) => {
          const count = deals.filter((d) => d.stage === st).length;
          const conf = STAGE_CONFIG[st];
          return (
            <button
              key={st}
              onClick={() => setActiveStage(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeStage === st
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-secondary/60 text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className={`size-2 rounded-full ${conf.bg} border ${conf.border}`} />
              <span>{st}</span>
              <span className="text-[10px] font-mono opacity-80">({count})</span>
            </button>
          );
        })}
      </div>

      {/* ═══ 4. BESPOKE HORIZONTAL DEAL DOSSIER CARDS (NON-COLUMN, WIDE & CLEAN) ═══ */}
      <div className="space-y-3.5">
        {filteredDeals.map((deal) => {
          const conf = STAGE_CONFIG[deal.stage];
          return (
            <div
              key={deal.id}
              onClick={() => setSelectedDeal(deal)}
              className="group cursor-pointer rounded-2xl border border-border/80 bg-card hover:border-primary/60 hover:shadow-md p-4 sm:p-5 transition-all duration-200 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
            >
              {/* Property & Unit Identity */}
              <div className="flex items-center gap-4 min-w-[280px]">
                <div className="size-13 rounded-2xl bg-secondary border border-border/80 flex items-center justify-center text-primary font-bold shrink-0 shadow-sm">
                  <Building2 size={22} />
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-base text-foreground font-display group-hover:text-primary transition-colors">
                      {deal.property}
                    </h3>
                    <span className="text-xs text-muted-foreground font-mono">({deal.area.split(" ")[0]})</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{deal.unit}</p>
                  <p className="text-[11px] text-muted-foreground font-mono">
                    {deal.id} · Developer: <strong className="text-foreground">{deal.developer}</strong>
                  </p>
                </div>
              </div>

              {/* Financials & Milestone Progress */}
              <div className="flex-1 space-y-1.5 lg:px-4 lg:border-l lg:border-r lg:border-border/60">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-muted-foreground">Buyer:</span>
                  <strong className="text-sm text-foreground">{deal.buyer}</strong>
                  <span className="text-muted-foreground text-xs">•</span>
                  <span className="text-xs text-muted-foreground">Deal Value:</span>
                  <span className="font-mono font-black text-foreground text-sm">{formatAed(deal.amount)}</span>
                  <span className="text-muted-foreground text-xs">•</span>
                  <span className="text-xs text-muted-foreground">Commission:</span>
                  <span className="font-mono font-bold text-amber-400 text-sm">{formatAed(deal.commission)}</span>
                </div>

                {/* Milestone Detail */}
                <div className="flex items-center gap-2 text-xs">
                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border font-mono ${conf.bg} ${conf.color} ${conf.border}`}>
                    {deal.stage}
                  </span>
                  <span className="text-muted-foreground truncate italic">
                    "{deal.nextMilestone}"
                  </span>
                </div>
              </div>

              {/* Action Hub */}
              <div
                className="flex items-center gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-border/50"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={(e) => handleWhatsAppBuyer(e, deal)}
                  className="inline-flex items-center gap-1.5 h-9 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all"
                  title="WhatsApp client"
                >
                  <MessageCircle size={14} />
                  <span>WhatsApp</span>
                </button>

                {deal.stage !== "Closed Won" && (
                  <button
                    type="button"
                    onClick={(e) => advanceStage(e, deal.id)}
                    className="inline-flex items-center gap-1.5 h-9 px-3 rounded-xl border border-primary/40 bg-primary/10 hover:bg-primary/20 text-primary font-bold text-xs transition-all"
                    title="Advance to next milestone"
                  >
                    <span>Advance Stage</span>
                    <ArrowRight size={13} />
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setSelectedDeal(deal)}
                  className="inline-flex items-center gap-1.5 h-9 px-3 rounded-xl border border-border bg-secondary/50 hover:bg-secondary text-foreground font-bold text-xs transition-all"
                >
                  <span>Dossier</span>
                  <ArrowUpRight size={13} className="text-primary" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ═══ 5. FULL-SCREEN DEAL IMMERSION MODAL ═══ */}
      {selectedDeal && (
        <Dialog open={!!selectedDeal} onOpenChange={(open) => { if (!open) setSelectedDeal(null); }}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-card border-border p-6 sm:p-8 space-y-6">
            <DialogHeader className="border-b border-border/60 pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <DialogTitle className="text-2xl font-extrabold text-foreground font-display">
                    {selectedDeal.property}
                  </DialogTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {selectedDeal.unit} · {selectedDeal.area} · Deal #{selectedDeal.id}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-emerald-400 font-mono font-display">
                    {formatAed(selectedDeal.amount)}
                  </span>
                  <p className="text-xs text-amber-400 font-mono">Commission: {formatAed(selectedDeal.commission)}</p>
                </div>
              </div>
            </DialogHeader>

            {/* Financial Ledger & Breakdown */}
            <div className="rounded-2xl border border-border/70 bg-secondary/30 p-5 space-y-3 text-xs">
              <span className="font-bold text-foreground">Transaction Financial Ledger:</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="p-3 rounded-xl bg-card border border-border/60">
                  <span className="text-muted-foreground text-[10px] uppercase font-bold">Total Contract</span>
                  <p className="font-mono font-bold text-foreground mt-0.5">{formatAed(selectedDeal.amount)}</p>
                </div>
                <div className="p-3 rounded-xl bg-card border border-border/60">
                  <span className="text-muted-foreground text-[10px] uppercase font-bold">Paid to Escrow</span>
                  <p className="font-mono font-bold text-emerald-400 mt-0.5">{formatAed(selectedDeal.paid)}</p>
                </div>
                <div className="p-3 rounded-xl bg-card border border-border/60">
                  <span className="text-muted-foreground text-[10px] uppercase font-bold">Agency Fee (2%)</span>
                  <p className="font-mono font-bold text-amber-400 mt-0.5">{formatAed(selectedDeal.commission)}</p>
                </div>
                <div className="p-3 rounded-xl bg-card border border-border/60">
                  <span className="text-muted-foreground text-[10px] uppercase font-bold">Agent Split (50%)</span>
                  <p className="font-mono font-bold text-primary mt-0.5">{formatAed(selectedDeal.commission / 2)}</p>
                </div>
              </div>
            </div>

            {/* Milestone Roadmap */}
            <div className="space-y-3 text-xs">
              <span className="font-bold text-foreground">DLD Registration & Milestone Progress:</span>
              <div className="space-y-2">
                {STAGES.map((st, i) => {
                  const currentIdx = STAGES.indexOf(selectedDeal.stage);
                  const isDone = i <= currentIdx;
                  const isCurrent = i === currentIdx;
                  return (
                    <div
                      key={st}
                      className={`flex items-center justify-between p-3 rounded-xl border text-xs ${
                        isCurrent
                          ? "bg-primary/10 border-primary/40 font-bold text-foreground"
                          : isDone
                          ? "bg-secondary/40 border-border/50 text-foreground"
                          : "opacity-40 border-border/30 text-muted-foreground"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={`size-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          isDone ? "bg-emerald-500 text-white" : "bg-secondary text-muted-foreground"
                        }`}>
                          {isDone ? "✓" : i + 1}
                        </span>
                        <span>{st}</span>
                      </div>
                      <span className="text-[11px] font-mono">
                        {isCurrent ? "Active In Progress" : isDone ? "Completed" : "Pending"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/60">
              <Button variant="outline" onClick={() => setSelectedDeal(null)} className="rounded-xl text-xs">
                Close
              </Button>
              <Button
                onClick={(e) => {
                  handleWhatsAppBuyer(e, selectedDeal);
                  setSelectedDeal(null);
                }}
                className="rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
              >
                <MessageCircle size={14} />
                <span>Message {selectedDeal.buyer.split(" ")[0]}</span>
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
