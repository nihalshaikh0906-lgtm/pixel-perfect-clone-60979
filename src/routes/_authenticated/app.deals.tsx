import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Banknote, ChevronDown, Copy, Download, Plus, X, LayoutGrid,
  List, TrendingUp, CheckCircle2, Clock, AlertCircle, ArrowRight,
  User, Building2, Share2, DollarSign, ShieldCheck
} from "lucide-react";
import { toast } from "sonner";
import { useShell } from "@/components/app/AppShell";
import { workspaceHead } from "@/components/app/WorkspacePlaceholder";
import { formatAed } from "@/lib/demo-leads";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export const Route = createFileRoute("/_authenticated/app/deals")({
  head: () => workspaceHead("Deals & Commissions"),
  component: Page,
});

type Stage = "EOI Token" | "SPA Contract" | "DLD Registration" | "Commission Due" | "Closed Won";
type Pipe = "All" | Stage;

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
    unit: "Unit #1006 · Studio",
    area: "JVC",
    buyer: "Tariq Mansoor",
    source: "WhatsApp Referral",
    type: "Off-Plan Sale",
    amount: 498000,
    paid: 49800,
    commission: 14940,
    agent: "Saad Khan",
    stage: "EOI Token",
    plan: "10 / 50 / 40",
    nextMilestone: "SPA signing scheduled 15 Oct",
    updated: "Today",
  },
  {
    id: "DL-1042",
    property: "09 Life Residences",
    unit: "Unit #101 · 1 BR",
    area: "DLRC",
    buyer: "Sophie Laurent",
    source: "Meta Campaign",
    type: "Off-Plan Sale",
    amount: 1545000,
    paid: 154500,
    commission: 38625,
    agent: "Aisha Salem",
    stage: "EOI Token",
    plan: "10 / 20 / 70",
    nextMilestone: "Awaiting developer KYC review",
    updated: "Yesterday",
  },
  {
    id: "DL-1035",
    property: "Binghatti Dusk",
    unit: "Unit #402 · 2 BR",
    area: "JVC",
    buyer: "Elena Petrova",
    source: "Property Finder",
    type: "Off-Plan Sale",
    amount: 1890000,
    paid: 378000,
    commission: 47250,
    agent: "Omar Farooq",
    stage: "SPA Contract",
    plan: "20 / 50 / 30",
    nextMilestone: "Buyer legal counsel reviewing SPA",
    updated: "2 days ago",
  },
  {
    id: "DL-1036",
    property: "Amali Residences",
    unit: "Unit #1204 · 3 BR",
    area: "Business Bay",
    buyer: "Khalid Al Suwaidi",
    source: "Client Referral",
    type: "Off-Plan Sale",
    amount: 4250000,
    paid: 850000,
    commission: 106250,
    agent: "Saad Khan",
    stage: "DLD Registration",
    plan: "20 / 40 / 40",
    nextMilestone: "DLD 4% Oqood certificate pending",
    updated: "3 days ago",
  },
  {
    id: "DL-1025",
    property: "DIFC Heights Tower",
    unit: "Unit #805 · 1 BR",
    area: "DIFC",
    buyer: "Marcus Vance",
    source: "Bayut Direct",
    type: "Off-Plan Sale",
    amount: 2150000,
    paid: 860000,
    commission: 53750,
    agent: "Priya Nair",
    stage: "Commission Due",
    plan: "40 / 60",
    nextMilestone: "Developer invoice #INV-492 submitted",
    updated: "4 days ago",
  },
  {
    id: "DL-1018",
    property: "Marina Heights",
    unit: "Unit #1802 · 2 BR",
    area: "Dubai Marina",
    buyer: "Daniel Okonkwo",
    source: "Direct Broker Network",
    type: "Secondary Sale",
    amount: 2850000,
    paid: 2850000,
    commission: 57000,
    agent: "Saad Khan",
    stage: "Closed Won",
    plan: "Full Cash Transfer",
    nextMilestone: "Title Deed issued · Commission distributed",
    updated: "Last week",
  },
];

function moneyAed(val: number) {
  if (val >= 1_000_000) return `AED ${(val / 1_000_000).toFixed(2)}M`;
  if (val >= 1_000) return `AED ${Math.round(val / 1_000)}K`;
  return `AED ${val.toLocaleString()}`;
}

function Page() {
  const { clientMode } = useShell();
  const [deals, setDeals] = useState<Deal[]>(INITIAL_DEALS);
  const [viewMode, setViewMode] = useState<"kanban" | "table">("kanban");
  const [activeStage, setActiveStage] = useState<Pipe>("All");
  const [newDealOpen, setNewDealOpen] = useState(false);

  // New deal form state
  const [propName, setPropName] = useState("");
  const [unitLabel, setUnitLabel] = useState("");
  const [areaLabel, setAreaLabel] = useState("");
  const [buyerName, setBuyerName] = useState("");
  const [dealAmount, setDealAmount] = useState("");
  const [dealStage, setDealStage] = useState<Stage>("EOI Token");

  // KPI Calculations
  const totalVolume = useMemo(() => deals.reduce((acc, d) => acc + d.amount, 0), [deals]);
  const totalCollected = useMemo(() => deals.reduce((acc, d) => acc + d.paid, 0), [deals]);
  const totalCommissions = useMemo(() => deals.reduce((acc, d) => acc + d.commission, 0), [deals]);
  const closedVolume = useMemo(
    () => deals.filter((d) => d.stage === "Closed Won").reduce((acc, d) => acc + d.amount, 0),
    [deals],
  );

  const filteredDeals = useMemo(() => {
    if (activeStage === "All") return deals;
    return deals.filter((d) => d.stage === activeStage);
  }, [deals, activeStage]);

  const handleStageChange = (dealId: string, nextStage: Stage) => {
    setDeals((prev) =>
      prev.map((d) => {
        if (d.id !== dealId) return d;
        return {
          ...d,
          stage: nextStage,
          updated: "Just now",
        };
      }),
    );
    toast.success(`Deal moved to ${nextStage}`);
  };

  const handleCreateDeal = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(dealAmount.replace(/[^0-9.]/g, "")) || 1000000;
    const comm = Math.round(amountNum * 0.025); // 2.5% avg Dubai off-plan commission
    const newDeal: Deal = {
      id: `DL-${Math.floor(1000 + Math.random() * 9000)}`,
      property: propName || "Off-Plan Project",
      unit: unitLabel || "1 BR Apartment",
      area: areaLabel || "Dubai",
      buyer: buyerName || "Investor Client",
      source: "Manual Entry",
      type: "Off-Plan Sale",
      amount: amountNum,
      paid: Math.round(amountNum * 0.1),
      commission: comm,
      agent: "You",
      stage: dealStage,
      plan: "10 / 20 / 70",
      nextMilestone: "Initial deposit confirmation",
      updated: "Just now",
    };
    setDeals([newDeal, ...deals]);
    setNewDealOpen(false);
    toast.success("New deal logged in pipeline!");
    setPropName("");
    setUnitLabel("");
    setBuyerName("");
    setDealAmount("");
  };

  const exportCsv = () => {
    const headers = ["Deal ID", "Property", "Unit", "Area", "Buyer", "Type", "Amount (AED)", "Paid (AED)", "Commission (AED)", "Agent", "Stage"];
    const rows = deals.map((d) => [
      d.id,
      `"${d.property}"`,
      `"${d.unit}"`,
      `"${d.area}"`,
      `"${d.buyer}"`,
      d.type,
      d.amount,
      d.paid,
      d.commission,
      `"${d.agent}"`,
      d.stage,
    ]);
    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `dealos-pipeline-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Pipeline exported to CSV");
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* ═══ TOP HEADER ═══ */}
      <div className="border-b border-border/70 bg-card/60 backdrop-blur px-4 py-6 sm:px-8">
        <div className="mx-auto max-w-7xl flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Brokerage Money</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-xs text-muted-foreground">Dubai Land Department & Escrow Tracked</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight mt-1 font-display">
              Deals & Commission Pipeline
            </h1>
          </div>

          <div className="flex items-center gap-2.5">
            {/* View Switcher */}
            <div className="flex items-center rounded-lg border border-border bg-secondary/80 p-0.5">
              <button
                onClick={() => setViewMode("kanban")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  viewMode === "kanban"
                    ? "bg-card text-foreground shadow-sm border border-border"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <LayoutGrid className="size-3.5" />
                <span>Kanban</span>
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  viewMode === "table"
                    ? "bg-card text-foreground shadow-sm border border-border"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <List className="size-3.5" />
                <span>Table</span>
              </button>
            </div>

            <Button variant="outline" size="sm" onClick={exportCsv} className="h-9 gap-1.5 text-xs font-semibold">
              <Download className="size-3.5" />
              <span>Export</span>
            </Button>

            <Button size="sm" onClick={() => setNewDealOpen(true)} className="h-9 gap-1.5 text-xs font-bold bg-primary text-primary-foreground">
              <Plus className="size-3.5" />
              <span>New Deal</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-8 space-y-6">
        {/* ═══ EXECUTIVE KPI CARDS ═══ */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Pipeline</span>
              <Building2 className="size-4 text-primary" />
            </div>
            <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              {moneyAed(totalVolume)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{deals.length} active off-plan & ready deals</p>
          </div>

          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-semibold uppercase tracking-wider">Escrow Collected</span>
              <ShieldCheck className="size-4 text-emerald-400" />
            </div>
            <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-emerald-400 tracking-tight">
              {moneyAed(totalCollected)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {Math.round((totalCollected / (totalVolume || 1)) * 100)}% of total transaction value
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-semibold uppercase tracking-wider">Commission Forecast</span>
              <Banknote className="size-4 text-amber-400" />
            </div>
            <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-amber-400 tracking-tight">
              {moneyAed(totalCommissions)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Agent split (50%): <span className="font-semibold text-foreground">{moneyAed(totalCommissions * 0.5)}</span>
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-semibold uppercase tracking-wider">Closed Won</span>
              <CheckCircle2 className="size-4 text-teal-400" />
            </div>
            <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              {moneyAed(closedVolume)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Title deeds cleared & paid</p>
          </div>
        </div>

        {/* ═══ KANBAN PIPELINE VIEW ═══ */}
        {viewMode === "kanban" ? (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-5 items-start">
            {STAGES.map((stage) => {
              const stageDeals = deals.filter((d) => d.stage === stage);
              const stageTotal = stageDeals.reduce((acc, d) => acc + d.amount, 0);
              const cfg = STAGE_CONFIG[stage];

              return (
                <div key={stage} className="flex flex-col rounded-2xl border border-border bg-card/40 p-3 min-h-[480px]">
                  {/* Column Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-border/60">
                    <div className="flex items-center gap-2">
                      <span className={`size-2 rounded-full ${cfg.bg} border ${cfg.border}`} />
                      <span className="text-xs font-bold text-foreground">{stage}</span>
                    </div>
                    <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-bold text-muted-foreground">
                      {stageDeals.length}
                    </span>
                  </div>

                  <p className="text-[11px] font-mono text-muted-foreground py-2 border-b border-border/40">
                    Vol: {moneyAed(stageTotal)}
                  </p>

                  {/* Deals in this stage */}
                  <div className="space-y-3 pt-3 flex-1">
                    {stageDeals.map((deal) => (
                      <div
                        key={deal.id}
                        className="group relative rounded-xl border border-border bg-card p-4 shadow-sm hover:border-primary/50 transition-all hover:shadow-md space-y-3"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-mono text-muted-foreground">{deal.id}</span>
                            <h4 className="text-sm font-bold text-foreground line-clamp-1">{deal.property}</h4>
                            <p className="text-xs text-muted-foreground">{deal.unit}</p>
                          </div>
                          <span className="text-[10px] rounded bg-secondary px-1.5 py-0.5 text-muted-foreground shrink-0 font-medium">
                            {deal.area}
                          </span>
                        </div>

                        <div className="rounded-lg bg-secondary/50 p-2.5 space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Deal Value:</span>
                            <span className="font-bold text-foreground">{moneyAed(deal.amount)}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Commission:</span>
                            <span className="font-bold text-amber-400">{moneyAed(deal.commission)}</span>
                          </div>
                        </div>

                        <div className="space-y-1 text-xs">
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <User className="size-3 text-primary" />
                            <span className="font-medium text-foreground truncate">{deal.buyer}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-muted-foreground text-[11px]">
                            <Clock className="size-3" />
                            <span className="truncate">{deal.nextMilestone}</span>
                          </div>
                        </div>

                        {/* Move stage selector */}
                        <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px]">
                          <span className="text-muted-foreground font-mono">{deal.agent}</span>
                          <select
                            value={deal.stage}
                            onChange={(e) => handleStageChange(deal.id, e.target.value as Stage)}
                            className="bg-secondary text-foreground text-[11px] rounded px-2 py-1 border border-border focus:outline-none focus:border-primary cursor-pointer"
                          >
                            {STAGES.map((st) => (
                              <option key={st} value={st}>
                                → {st}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ))}

                    {stageDeals.length === 0 && (
                      <div className="h-32 flex items-center justify-center rounded-xl border border-dashed border-border/60 text-xs text-muted-foreground">
                        No deals
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* ═══ TABLE PIPELINE VIEW ═══ */
          <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-foreground">Filter by Stage:</span>
                <div className="flex gap-1">
                  {(["All", ...STAGES] as Pipe[]).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveStage(tab)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                        activeStage === tab
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>
              <span className="text-xs text-muted-foreground font-mono">{filteredDeals.length} transactions</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground bg-secondary/30">
                    <th className="py-3.5 pl-4">Deal & Property</th>
                    <th className="py-3.5">Buyer</th>
                    <th className="py-3.5">Amount</th>
                    <th className="py-3.5">Collected</th>
                    <th className="py-3.5">Broker Commission</th>
                    <th className="py-3.5">Agent</th>
                    <th className="py-3.5">Stage</th>
                    <th className="py-3.5 text-right pr-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredDeals.map((deal) => {
                    const cfg = STAGE_CONFIG[deal.stage];
                    return (
                      <tr key={deal.id} className="hover:bg-secondary/40 transition-colors">
                        <td className="py-3.5 pl-4">
                          <span className="font-bold text-foreground block">{deal.property}</span>
                          <span className="text-xs text-muted-foreground">
                            {deal.unit} · {deal.area}
                          </span>
                        </td>
                        <td className="py-3.5">
                          <span className="font-semibold text-foreground block">{deal.buyer}</span>
                          <span className="text-xs text-muted-foreground">{deal.source}</span>
                        </td>
                        <td className="py-3.5 font-bold font-mono text-foreground">{moneyAed(deal.amount)}</td>
                        <td className="py-3.5 font-mono text-emerald-400">
                          {moneyAed(deal.paid)}
                          <span className="block text-[10px] text-muted-foreground">
                            {Math.round((deal.paid / deal.amount) * 100)}%
                          </span>
                        </td>
                        <td className="py-3.5">
                          <span className="font-bold text-amber-400 font-mono block">{moneyAed(deal.commission)}</span>
                          <span className="text-[10px] text-muted-foreground">50% Agent: {moneyAed(deal.commission * 0.5)}</span>
                        </td>
                        <td className="py-3.5 text-xs text-foreground font-medium">{deal.agent}</td>
                        <td className="py-3.5">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${cfg.bg} ${cfg.color} border ${cfg.border}`}
                          >
                            {deal.stage}
                          </span>
                        </td>
                        <td className="py-3.5 text-right pr-4">
                          <select
                            value={deal.stage}
                            onChange={(e) => handleStageChange(deal.id, e.target.value as Stage)}
                            className="bg-secondary text-foreground text-xs rounded-lg px-2.5 py-1.5 border border-border focus:outline-none focus:border-primary cursor-pointer"
                          >
                            {STAGES.map((st) => (
                              <option key={st} value={st}>
                                Move: {st}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ═══ NEW DEAL MODAL ═══ */}
      <Dialog open={newDealOpen} onOpenChange={setNewDealOpen}>
        <DialogContent className="max-w-md rounded-2xl bg-card border-border p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-foreground">Log New Transaction</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Add a new off-plan or secondary property deal to track escrow and commissions.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateDeal} className="mt-4 space-y-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Project / Property Name</label>
              <input
                required
                value={propName}
                onChange={(e) => setPropName(e.target.value)}
                placeholder="e.g. Celestara Residences"
                className="mt-1 h-10 w-full rounded-xl border border-border bg-secondary px-3 text-sm focus:border-primary focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Unit Details</label>
                <input
                  required
                  value={unitLabel}
                  onChange={(e) => setUnitLabel(e.target.value)}
                  placeholder="e.g. Unit 402 · 1 BR"
                  className="mt-1 h-10 w-full rounded-xl border border-border bg-secondary px-3 text-sm focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Community / Area</label>
                <input
                  required
                  value={areaLabel}
                  onChange={(e) => setAreaLabel(e.target.value)}
                  placeholder="e.g. JVC, Dubai"
                  className="mt-1 h-10 w-full rounded-xl border border-border bg-secondary px-3 text-sm focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground">Buyer Name</label>
              <input
                required
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                placeholder="e.g. Tariq Mansoor"
                className="mt-1 h-10 w-full rounded-xl border border-border bg-secondary px-3 text-sm focus:border-primary focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Sale Price (AED)</label>
                <input
                  required
                  value={dealAmount}
                  onChange={(e) => setDealAmount(e.target.value)}
                  placeholder="1,250,000"
                  className="mt-1 h-10 w-full rounded-xl border border-border bg-secondary px-3 text-sm focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Initial Stage</label>
                <select
                  value={dealStage}
                  onChange={(e) => setDealStage(e.target.value as Stage)}
                  className="mt-1 h-10 w-full rounded-xl border border-border bg-secondary px-3 text-sm focus:border-primary focus:outline-none"
                >
                  {STAGES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <Button type="submit" className="w-full h-11 bg-primary text-primary-foreground font-bold">
              Add Deal to Pipeline
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
