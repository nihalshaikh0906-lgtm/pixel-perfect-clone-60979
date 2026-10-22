import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  Banknote, DoorClosed, Key, ShieldCheck, AlertTriangle, CheckCircle2,
  Calendar, Building2, User, Phone, MessageCircle, FileText, ArrowUpRight,
  Plus, Check, Clock
} from "lucide-react";
import { workspaceHead } from "@/components/app/WorkspacePlaceholder";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export const Route = createFileRoute("/_authenticated/app/tenancies")({
  head: () => workspaceHead("Tenancies & Ejari"),
  component: Page,
});

type Tenancy = {
  id: string;
  property: string;
  unit: string;
  area: string;
  tenant: string;
  tenantPhone: string;
  rentAnnual: number;
  rentMonthly: number;
  cheques: number;
  lastPaid: string;
  arrears: number;
  expiry: string;
  daysRemaining: number;
  status: "Active" | "Ended";
  ejariNumber: string;
};

const START_TENANCIES: Tenancy[] = [
  {
    id: "TN-201",
    property: "Marina Quay Luxury Residence",
    unit: "Unit #1402 · 2 BR",
    area: "Dubai Marina",
    tenant: "Daniel Brooks",
    tenantPhone: "+971 50 112 3344",
    rentAnnual: 145000,
    rentMonthly: 12083,
    cheques: 4,
    lastPaid: "Oct 01, 2026",
    arrears: 0,
    expiry: "Mar 31, 2027",
    daysRemaining: 170,
    status: "Active",
    ejariNumber: "EJARI-DXB-99201",
  },
  {
    id: "TN-202",
    property: "JLT Cluster D Tower",
    unit: "Unit #608 · Studio Suite",
    area: "JLT (Jumeirah Lakes Towers)",
    tenant: "Aisha Rahman",
    tenantPhone: "+971 55 223 4455",
    rentAnnual: 52000,
    rentMonthly: 4333,
    cheques: 4,
    lastPaid: "Sep 01, 2026",
    arrears: 4333,
    expiry: "Jan 14, 2027",
    daysRemaining: 94,
    status: "Active",
    ejariNumber: "EJARI-DXB-88104",
  },
  {
    id: "TN-203",
    property: "Hills Estate Green Boulevard",
    unit: "Unit #1901 · 3 BR Park View",
    area: "Dubai Hills Estate",
    tenant: "Marco Bianchi",
    tenantPhone: "+971 52 334 5566",
    rentAnnual: 210000,
    rentMonthly: 17500,
    cheques: 2,
    lastPaid: "Oct 03, 2026",
    arrears: 0,
    expiry: "Aug 31, 2027",
    daysRemaining: 323,
    status: "Active",
    ejariNumber: "EJARI-DXB-77291",
  },
  {
    id: "TN-204",
    property: "Executive Towers Canal Suite",
    unit: "Unit #1105 · 1 BR",
    area: "Business Bay",
    tenant: "Hana Yoshida",
    tenantPhone: "+971 54 445 6677",
    rentAnnual: 85000,
    rentMonthly: 7083,
    cheques: 4,
    lastPaid: "Aug 01, 2026",
    arrears: 14166,
    expiry: "Dec 31, 2026",
    daysRemaining: 80,
    status: "Active",
    ejariNumber: "EJARI-DXB-66108",
  },
  {
    id: "TN-205",
    property: "Arjan Garden Residence",
    unit: "Unit #304 · 1 BR",
    area: "Arjan",
    tenant: "Tom Fischer",
    tenantPhone: "+971 56 556 7788",
    rentAnnual: 66000,
    rentMonthly: 5500,
    cheques: 4,
    lastPaid: "Jun 01, 2026",
    arrears: 0,
    expiry: "Jun 30, 2026",
    daysRemaining: 0,
    status: "Ended",
    ejariNumber: "EJARI-DXB-55019",
  },
  {
    id: "TN-206",
    property: "Al Furjan Family Townhouse",
    unit: "Townhouse #42 · 3 BR",
    area: "Al Furjan",
    tenant: "Nadia Karim",
    tenantPhone: "+971 58 667 8899",
    rentAnnual: 165000,
    rentMonthly: 13750,
    cheques: 2,
    lastPaid: "Oct 05, 2026",
    arrears: 0,
    expiry: "May 31, 2027",
    daysRemaining: 231,
    status: "Active",
    ejariNumber: "EJARI-DXB-44912",
  },
];

const aed = (n: number) => `AED ${n.toLocaleString("en-US")}`;

function Page() {
  const [tenancies, setTenancies] = useState<Tenancy[]>(START_TENANCIES);
  const [filter, setFilter] = useState<"All" | "Active" | "Arrears" | "Ended">("All");
  const [selectedTenancy, setSelectedTenancy] = useState<Tenancy | null>(null);

  const active = tenancies.filter((r) => r.status === "Active");
  const totalRentRoll = active.reduce((s, r) => s + r.rentMonthly, 0);
  const totalArrears = active.reduce((s, r) => s + r.arrears, 0);
  const arrearsCount = active.filter((r) => r.arrears > 0).length;

  const filtered = tenancies.filter((t) => {
    if (filter === "All") return true;
    if (filter === "Active") return t.status === "Active";
    if (filter === "Arrears") return t.status === "Active" && t.arrears > 0;
    if (filter === "Ended") return t.status === "Ended";
    return true;
  });

  const recordPayment = (e: React.MouseEvent, t: Tenancy) => {
    e.stopPropagation();
    if (t.status === "Ended") {
      toast.info("This tenancy has ended.");
      return;
    }
    setTenancies((prev) =>
      prev.map((x) =>
        x.id === t.id
          ? { ...x, arrears: Math.max(0, x.arrears - x.rentMonthly), lastPaid: "Today (Cleared)" }
          : x
      )
    );
    toast.success(`Recorded rent payment of ${aed(t.rentMonthly)} from ${t.tenant}.`);
  };

  const handleWhatsAppTenant = (e: React.MouseEvent, t: Tenancy) => {
    e.stopPropagation();
    const text = t.arrears > 0
      ? `Dear ${t.tenant.split(" ")[0]}, polite reminder from property management regarding pending rent of ${aed(t.arrears)} for ${t.property} (${t.unit}). Please confirm cheque clearance date.`
      : `Dear ${t.tenant.split(" ")[0]}, following up on your tenancy at ${t.property} (${t.unit}). Next scheduled inspection is upcoming. Let us know if you need any maintenance support.`;
    window.open(`https://wa.me/${t.tenantPhone.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`, "_blank");
    toast.success(`WhatsApp message prepared for ${t.tenant}`);
  };

  return (
    <div className="w-full space-y-6 pb-24 animate-in fade-in-50 duration-300">
      {/* ═══ 1. CLEAN EXECUTIVE BRIEFING ═══ */}
      <section className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-r from-card via-card to-secondary/30 p-6 sm:p-7 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-primary">
                Managed Leases & Rent Roll
              </span>
              <span className="text-muted-foreground">•</span>
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                <ShieldCheck size={14} /> DLD Ejari Registered
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-display">
              Tenancies & Leases
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Real-time rent roll tracking, cheque clearances, and automated arrears recovery.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => toast("Tenancy report downloaded.")}
              variant="outline"
              className="h-10 rounded-2xl text-xs font-bold border-border gap-1.5"
            >
              <FileText size={14} />
              <span>Download Statement</span>
            </Button>
            <Button
              onClick={() => toast("New tenancy contract generator opened.")}
              className="h-10 rounded-2xl text-xs font-bold bg-primary text-primary-foreground gap-1.5 shadow-sm"
            >
              <Plus size={15} />
              <span>New Tenancy</span>
            </Button>
          </div>
        </div>
      </section>

      {/* ═══ 2. RENT ROLL HUD (4 STAT PILLARS) ═══ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-sm space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Active Tenancies</span>
          <p className="text-2xl sm:text-3xl font-black text-foreground font-mono">{active.length}</p>
          <p className="text-[11px] text-muted-foreground">Managed rental units</p>
        </div>

        <div className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-sm space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-primary">Monthly Rent Roll</span>
          <p className="text-2xl sm:text-3xl font-black text-foreground font-mono">{aed(totalRentRoll)}</p>
          <p className="text-[11px] text-muted-foreground">{aed(totalRentRoll * 12)} / year</p>
        </div>

        <div className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-sm space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">Collected On Time</span>
          <p className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
            {aed(Math.max(0, totalRentRoll - totalArrears))}
          </p>
          <p className="text-[11px] text-muted-foreground">Clean collection rate</p>
        </div>

        <div className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-sm space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400">Overdue Arrears</span>
          <p className="text-2xl sm:text-3xl font-black text-rose-400 font-mono">{aed(totalArrears)}</p>
          <p className="text-[11px] text-muted-foreground">{arrearsCount} tenants flagged</p>
        </div>
      </div>

      {/* ═══ 3. FILTER PILL SELECTOR ═══ */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border/60 pb-3">
        {[
          { id: "All", label: `All Leases (${tenancies.length})` },
          { id: "Active", label: `Active (${active.length})` },
          { id: "Arrears", label: `⚠️ In Arrears (${arrearsCount})` },
          { id: "Ended", label: `Ended (${tenancies.filter((t) => t.status === "Ended").length})` },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setFilter(t.id as typeof filter)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filter === t.id
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-secondary/60 text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ═══ 4. BESPOKE HORIZONTAL TENANCY DOSSIER CARDS (NO TABLE) ═══ */}
      <div className="space-y-3.5">
        {filtered.map((tenancy) => (
          <div
            key={tenancy.id}
            onClick={() => setSelectedTenancy(tenancy)}
            className="group cursor-pointer rounded-2xl border border-border/80 bg-card hover:border-primary/60 hover:shadow-md p-4 sm:p-5 transition-all duration-200 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
          >
            {/* Property Identity (Left) */}
            <div className="flex items-center gap-4 min-w-0 lg:min-w-[280px]">
              <div className="size-13 rounded-2xl bg-secondary border border-border/80 flex items-center justify-center text-primary font-bold shrink-0 shadow-sm">
                <Key size={22} />
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-base text-foreground font-display group-hover:text-primary transition-colors">
                    {tenancy.property}
                  </h3>
                  <span
                    className={`rounded-full px-2 py-0.2 text-[10px] font-bold font-mono border ${
                      tenancy.status === "Active"
                        ? tenancy.arrears > 0
                          ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                          : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                        : "bg-secondary text-muted-foreground border-border"
                    }`}
                  >
                    {tenancy.status === "Active" && tenancy.arrears > 0 ? "Arrears Due" : tenancy.status}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{tenancy.unit} · {tenancy.area}</p>
                <p className="text-[11px] text-muted-foreground font-mono">
                  {tenancy.id} · {tenancy.ejariNumber}
                </p>
              </div>
            </div>

            {/* Financials & Tenant Focus (Middle) */}
            <div className="flex-1 space-y-1.5 lg:px-4 lg:border-l lg:border-r lg:border-border/60">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-muted-foreground">Tenant:</span>
                <strong className="text-sm text-foreground">{tenancy.tenant}</strong>
                <span className="text-muted-foreground text-xs">•</span>
                <span className="text-xs text-muted-foreground">Rent:</span>
                <span className="font-mono font-bold text-emerald-400 text-sm">
                  {aed(tenancy.rentMonthly)}/mo
                </span>
                <span className="text-xs text-muted-foreground font-mono">
                  ({aed(tenancy.rentAnnual)}/yr · {tenancy.cheques} Cheques)
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span>Last Paid: <strong className="text-foreground font-mono">{tenancy.lastPaid}</strong></span>
                <span>•</span>
                <span>Expiry: <strong className="text-foreground font-mono">{tenancy.expiry}</strong></span>
                {tenancy.arrears > 0 && (
                  <span className="text-rose-400 font-bold font-mono bg-rose-500/10 px-2 py-0.5 rounded">
                    ⚠️ Arrears: {aed(tenancy.arrears)}
                  </span>
                )}
              </div>
            </div>

            {/* Actions Hub (Right) */}
            <div
              className="flex items-center gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-border/50"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={(e) => handleWhatsAppTenant(e, tenancy)}
                className="inline-flex items-center gap-1.5 h-9 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all"
                title="WhatsApp tenant"
              >
                <MessageCircle size={14} />
                <span>WhatsApp</span>
              </button>

              {tenancy.status === "Active" && tenancy.arrears > 0 && (
                <button
                  type="button"
                  onClick={(e) => recordPayment(e, tenancy)}
                  className="inline-flex items-center gap-1.5 h-9 px-3 rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-sm transition-all"
                >
                  <Banknote size={14} />
                  <span>Clear Arrears</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setSelectedTenancy(tenancy)}
                className="inline-flex items-center gap-1.5 h-9 px-3 rounded-xl border border-border bg-secondary/50 hover:bg-secondary text-foreground font-bold text-xs transition-all"
              >
                <span>Dossier</span>
                <ArrowUpRight size={13} className="text-primary" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ═══ 5. FULL-SCREEN TENANCY IMMERSION DIALOG ═══ */}
      {selectedTenancy && (
        <Dialog open={!!selectedTenancy} onOpenChange={(open) => { if (!open) setSelectedTenancy(null); }}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-card border-border p-6 sm:p-8 space-y-5">
            <DialogHeader className="border-b border-border/60 pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <DialogTitle className="text-2xl font-extrabold text-foreground font-display">
                    {selectedTenancy.property}
                  </DialogTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {selectedTenancy.unit} · {selectedTenancy.area}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-emerald-400 font-mono font-display">
                    {aed(selectedTenancy.rentAnnual)}
                  </span>
                  <p className="text-xs text-muted-foreground font-mono">Annual Ejari Rent</p>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-4 text-xs">
              <div className="rounded-2xl bg-secondary/30 border border-border/70 p-4 space-y-2">
                <span className="font-bold text-foreground">Tenant Information:</span>
                <p className="text-foreground text-sm font-bold">{selectedTenancy.tenant}</p>
                <p className="text-muted-foreground">Phone: {selectedTenancy.tenantPhone}</p>
                <p className="text-emerald-400 font-mono font-bold">Registration: {selectedTenancy.ejariNumber}</p>
              </div>

              <div className="rounded-2xl bg-secondary/30 border border-border/70 p-4 space-y-2">
                <span className="font-bold text-foreground">Lease Financial Terms:</span>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="p-2.5 rounded-xl bg-card border border-border/60">
                    <span className="text-muted-foreground text-[10px] uppercase font-bold">Monthly Rent</span>
                    <p className="font-mono font-bold text-foreground">{aed(selectedTenancy.rentMonthly)}</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-card border border-border/60">
                    <span className="text-muted-foreground text-[10px] uppercase font-bold">Payment Mode</span>
                    <p className="font-mono font-bold text-foreground">{selectedTenancy.cheques} Cheques / yr</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-card border border-border/60">
                    <span className="text-muted-foreground text-[10px] uppercase font-bold">Last Recorded</span>
                    <p className="font-mono font-bold text-foreground">{selectedTenancy.lastPaid}</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-card border border-border/60">
                    <span className="text-muted-foreground text-[10px] uppercase font-bold">Current Arrears</span>
                    <p className={`font-mono font-bold ${selectedTenancy.arrears > 0 ? "text-rose-400" : "text-emerald-400"}`}>
                      {selectedTenancy.arrears > 0 ? aed(selectedTenancy.arrears) : "Zero (Up to Date)"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/60">
              <Button variant="outline" onClick={() => setSelectedTenancy(null)} className="rounded-xl text-xs">
                Close
              </Button>
              <Button
                onClick={(e) => {
                  handleWhatsAppTenant(e, selectedTenancy);
                  setSelectedTenancy(null);
                }}
                className="rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
              >
                <MessageCircle size={14} />
                <span>Message Tenant</span>
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
