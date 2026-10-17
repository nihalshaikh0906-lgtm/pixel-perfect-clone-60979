import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Settings, DollarSign, Users, Sparkles, MessageCircle, ShieldCheck,
  Check, RotateCcw, Building2, User, Phone, Send, ExternalLink,
  Target, Clock, Bell, Crown, RefreshCw, Lock, Zap, CheckCircle2
} from "lucide-react";
import { toast } from "sonner";
import { workspaceHead } from "@/components/app/WorkspacePlaceholder";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/app/settings")({
  head: () => workspaceHead("System Settings · DealOS"),
  validateSearch: (s: Record<string, unknown>) => ({
    role: typeof s["role"] === "string" ? s["role"] : undefined,
    tab: typeof s["tab"] === "string" ? s["tab"] : undefined,
  }),
  component: SettingsPage,
});

export function SettingsPage() {
  const search = Route.useSearch();
  const [viewTab, setViewTab] = useState<"owner" | "broker">(
    search.role === "owner" || search.tab === "agency" ? "owner" : "owner"
  );

  // ═══ 1. COMPANY OWNER AGENCY SETTINGS ═══
  const [trakheesiUsername, setTrakheesiUsername] = useState("TRK-8921-SKYLINE");
  const [standardAgencyFee, setStandardAgencyFee] = useState("2.0");
  const [standardVat, setStandardVat] = useState("5.0");
  const [roundRobinActive, setRoundRobinActive] = useState(true);
  const [slaMinutes, setSlaMinutes] = useState("15");
  const [autoReassignOnSlaBreach, setAutoReassignOnSlaBreach] = useState(true);
  const [nightShiftHolding, setNightShiftHolding] = useState(true);
  const [restrictCsvExport, setRestrictCsvExport] = useState(true);
  const [leadLockDays, setLeadLockDays] = useState("180");
  const [maskInvestorContact, setMaskInvestorContact] = useState(true);
  const [agencyWhatsapp, setAgencyWhatsapp] = useState("+971 4 398 2000");
  const [agencyAiTone, setAgencyAiTone] = useState("High-Net-Worth Advisory & Ultra-Luxury Closer");

  // Developer Sync Integrations
  const [developerSync, setDeveloperSync] = useState({
    emaar: true,
    damac: true,
    sobha: true,
    danube: true,
  });

  // ═══ 2. BROKER PERSONAL SETTINGS ═══
  const [brokerPhone, setBrokerPhone] = useState("+971 50 892 4119");
  const [whatsappGreeting, setWhatsappGreeting] = useState(
    "Hello! Reaching out from Skyline Luxury Real Estate regarding your Dubai property inquiry on DealOS."
  );
  const [personalTargetVolume, setPersonalTargetVolume] = useState("15,000,000");
  const [personalTargetDeals, setPersonalTargetDeals] = useState("3");
  const [copilotTone, setCopilotTone] = useState("Luxury Closer (High-Net-Worth)");

  useEffect(() => {
    if (search.role === "owner" || search.tab === "agency") {
      setViewTab("owner");
    }
  }, [search.role, search.tab]);

  const handleSave = () => {
    toast.success(
      viewTab === "owner"
        ? "Agency Master Settings successfully saved!"
        : "Broker personal outreach preferences saved!"
    );
  };

  const handleReset = () => {
    if (viewTab === "owner") {
      setTrakheesiUsername("TRK-8921-SKYLINE");
      setStandardAgencyFee("2.0");
      setStandardVat("5.0");
      setRoundRobinActive(true);
      setSlaMinutes("15");
      setAutoReassignOnSlaBreach(true);
      toast.info("Agency master settings restored to standard DLD defaults.");
    } else {
      setPersonalTargetVolume("15,000,000");
      setPersonalTargetDeals("3");
      toast.info("Broker preferences restored to defaults.");
    }
  };

  const testWhatsAppDispatch = () => {
    const cleanNum = (viewTab === "broker" ? brokerPhone : agencyWhatsapp).replace(/[^0-9]/g, "");
    if (!cleanNum) {
      toast.error("Please enter a valid phone number first.");
      return;
    }
    const url = `https://wa.me/${cleanNum}?text=${encodeURIComponent(whatsappGreeting)}`;
    window.open(url, "_blank");
    toast.success("Test WhatsApp dispatch opened!");
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 pb-24 animate-in fade-in-50 duration-300">
      {/* ═══ 1. EXECUTIVE HEADER ═══ */}
      <section className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-r from-card via-card to-secondary/30 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-primary">
                {viewTab === "owner" ? "Agency Master Settings" : "Broker Profile & Outreach"}
              </span>
              <span className="text-muted-foreground">•</span>
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                <ShieldCheck size={14} /> DLD Compliance Active
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-display">
              {viewTab === "owner" ? "Agency Settings & Speed-to-Lead SLA" : "Broker & Outreach Settings"}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl">
              {viewTab === "owner"
                ? "Configure real-time DLD Trakheesi sync, automated Speed-to-Lead SLA reassignments, developer inventory webhooks, and client anti-poaching security."
                : "Configure your personal WhatsApp dispatcher, sales volume goals, and AI copilot tone."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* View Switcher */}
            <div className="flex items-center bg-secondary/80 p-1 rounded-2xl border border-border mr-1">
              <button
                type="button"
                onClick={() => setViewTab("owner")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  viewTab === "owner"
                    ? "bg-amber-500 text-zinc-950 font-black shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Crown size={13} />
                <span>Agency Owner</span>
              </button>
              <button
                type="button"
                onClick={() => setViewTab("broker")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  viewTab === "broker"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <User size={13} />
                <span>Broker Desk</span>
              </button>
            </div>

            <Button variant="outline" onClick={handleReset} className="h-10 rounded-2xl text-xs font-bold border-border gap-1.5">
              <RotateCcw size={14} />
              <span>Reset</span>
            </Button>
            <Button onClick={handleSave} className="h-10 px-5 rounded-2xl text-xs font-bold bg-primary text-primary-foreground gap-1.5 shadow-sm">
              <Check size={14} />
              <span>Save Changes</span>
            </Button>
          </div>
        </div>
      </section>

      {/* ═══ 2. OWNER VIEW ═══ */}
      {viewTab === "owner" ? (
        <div className="space-y-6">
          {/* Speed-to-Lead SLA & Auto Reassignment Engine */}
          <section className="rounded-3xl border border-border/80 bg-card p-6 sm:p-7 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <Zap size={16} className="text-amber-400" />
                <h2 className="text-base font-extrabold text-foreground font-display">
                  Speed-to-Lead SLA & Dynamic Reassignment Engine
                </h2>
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                <CheckCircle2 size={12} /> Active Auto-Reassign
              </span>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-muted-foreground uppercase tracking-wider text-[10px]">
                    Maximum First-Touch SLA (Minutes)
                  </label>
                  <select
                    value={slaMinutes}
                    onChange={(e) => setSlaMinutes(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-border bg-secondary/30 text-xs font-semibold text-foreground focus:outline-none focus:border-primary font-mono"
                  >
                    <option value="5">5 Minutes (Hyper-Aggressive Off-Plan)</option>
                    <option value="15">15 Minutes (Recommended UAE Industry Standard)</option>
                    <option value="30">30 Minutes (Standard Secondary)</option>
                    <option value="60">60 Minutes</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-muted-foreground uppercase tracking-wider text-[10px]">
                    Inbound Routing Distribution
                  </label>
                  <select
                    value={roundRobinActive ? "round_robin" : "manual"}
                    onChange={(e) => setRoundRobinActive(e.target.value === "round_robin")}
                    className="w-full h-10 px-3 rounded-xl border border-border bg-secondary/30 text-xs font-semibold text-foreground focus:outline-none focus:border-primary"
                  >
                    <option value="round_robin">Round-Robin (Equally to Active Brokers)</option>
                    <option value="manual">Manual Owner Assignment Only</option>
                  </select>
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-2.5 pt-2">
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-secondary/30 border border-border/60">
                  <div>
                    <p className="text-xs font-bold text-foreground">Instant Dynamic Reassignment on SLA Breach</p>
                    <p className="text-[11px] text-muted-foreground">
                      If the assigned broker does not log a call or WhatsApp within {slaMinutes} mins, the lead instantly vanishes from their box and appears in the next available agent's box.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAutoReassignOnSlaBreach(!autoReassignOnSlaBreach)}
                    className={`size-6 rounded-lg border flex items-center justify-center transition-all ${
                      autoReassignOnSlaBreach ? "bg-emerald-600 border-emerald-500 text-white" : "border-border bg-card"
                    }`}
                  >
                    {autoReassignOnSlaBreach && <Check size={14} />}
                  </button>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-secondary/30 border border-border/60">
                  <div>
                    <p className="text-xs font-bold text-foreground">Night-Shift Lead Holding (10:00 PM – 8:00 AM)</p>
                    <p className="text-[11px] text-muted-foreground">
                      Queues late-night investor registrations and dispatches them at 8:00 AM so response metrics remain pristine.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setNightShiftHolding(!nightShiftHolding)}
                    className={`size-6 rounded-lg border flex items-center justify-center transition-all ${
                      nightShiftHolding ? "bg-emerald-600 border-emerald-500 text-white" : "border-border bg-card"
                    }`}
                  >
                    {nightShiftHolding && <Check size={14} />}
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* DLD Trakheesi Gateway & Real-time Sync */}
          <section className="rounded-3xl border border-border/80 bg-card p-6 sm:p-7 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-primary" />
                <h2 className="text-base font-extrabold text-foreground font-display">
                  DLD Trakheesi Permit & Regulatory Gateway
                </h2>
              </div>
              <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1">
                <span className="size-2 rounded-full bg-emerald-400 animate-pulse" /> Live DLD Synced
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-muted-foreground uppercase tracking-wider text-[10px]">
                  Trakheesi System Account ID
                </label>
                <input
                  value={trakheesiUsername}
                  onChange={(e) => setTrakheesiUsername(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-border bg-secondary/30 text-xs font-semibold text-foreground focus:outline-none focus:border-primary font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-muted-foreground uppercase tracking-wider text-[10px]">
                  Standard UAE Brokerage Fee (%)
                </label>
                <input
                  value={standardAgencyFee}
                  onChange={(e) => setStandardAgencyFee(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-border bg-secondary/30 text-xs font-semibold text-foreground focus:outline-none focus:border-primary font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-muted-foreground uppercase tracking-wider text-[10px]">
                  UAE VAT Standard (%)
                </label>
                <input
                  value={standardVat}
                  onChange={(e) => setStandardVat(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-border bg-secondary/30 text-xs font-semibold text-foreground focus:outline-none focus:border-primary font-mono"
                />
              </div>
            </div>
          </section>

          {/* Client Data Protection & Anti-Poaching Shield */}
          <section className="rounded-3xl border border-border/80 bg-card p-6 sm:p-7 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-border/60 pb-3">
              <Lock size={16} className="text-primary" />
              <h2 className="text-base font-extrabold text-foreground font-display">
                Data Protection & Anti-Poaching Governance
              </h2>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-secondary/30 border border-border/60">
                <div>
                  <p className="text-xs font-bold text-foreground">Restrict CSV Client Exports to Company Owner & Directors Only</p>
                  <p className="text-[11px] text-muted-foreground">Blocks individual agents from downloading agency customer database to personal drives.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setRestrictCsvExport(!restrictCsvExport)}
                  className={`size-6 rounded-lg border flex items-center justify-center transition-all ${
                    restrictCsvExport ? "bg-emerald-600 border-emerald-500 text-white" : "border-border bg-card"
                  }`}
                >
                  {restrictCsvExport && <Check size={14} />}
                </button>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-secondary/30 border border-border/60">
                <div>
                  <p className="text-xs font-bold text-foreground">Anti-Poaching Client Masking</p>
                  <p className="text-[11px] text-muted-foreground">Masks investor contact numbers from junior brokers until deal reaches verified Form F or token deposit stage.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setMaskInvestorContact(!maskInvestorContact)}
                  className={`size-6 rounded-lg border flex items-center justify-center transition-all ${
                    maskInvestorContact ? "bg-emerald-600 border-emerald-500 text-white" : "border-border bg-card"
                  }`}
                >
                  {maskInvestorContact && <Check size={14} />}
                </button>
              </div>

              <div className="p-3.5 rounded-2xl bg-secondary/30 border border-border/60 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-foreground">Client Ownership Protection Period</p>
                  <p className="text-[11px] text-muted-foreground">Period in days an inbound lead is exclusively locked to the original registering broker.</p>
                </div>
                <div className="flex items-center gap-1.5 font-mono text-xs">
                  <input
                    value={leadLockDays}
                    onChange={(e) => setLeadLockDays(e.target.value)}
                    className="w-16 h-8 px-2 rounded-lg border border-border bg-card text-center font-bold"
                  />
                  <span className="text-muted-foreground">Days</span>
                </div>
              </div>
            </div>
          </section>

          {/* Developer Integrations & WhatsApp Gateway */}
          <section className="rounded-3xl border border-border/80 bg-card p-6 sm:p-7 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <Building2 size={16} className="text-primary" />
                <h2 className="text-base font-extrabold text-foreground font-display">
                  Developer Inventory Webhooks & WhatsApp Business API
                </h2>
              </div>
              <span className="text-xs font-mono text-emerald-400 font-bold">4 Feeds Connected</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-secondary/30 border border-border/60 text-center space-y-1">
                <p className="font-extrabold text-foreground">Emaar Broker Portal</p>
                <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Connected
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-secondary/30 border border-border/60 text-center space-y-1">
                <p className="font-extrabold text-foreground">DAMAC Connect</p>
                <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Connected
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-secondary/30 border border-border/60 text-center space-y-1">
                <p className="font-extrabold text-foreground">Sobha Realty API</p>
                <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Connected
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-secondary/30 border border-border/60 text-center space-y-1">
                <p className="font-extrabold text-foreground">Danube Direct</p>
                <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Connected
                </span>
              </div>
            </div>
          </section>
        </div>
      ) : (
        /* ═══ BROKER DESK VIEW ═══ */
        <div className="space-y-6">
          <section className="rounded-3xl border border-border/80 bg-card p-6 sm:p-7 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <MessageCircle size={16} className="text-primary" />
                <h2 className="text-base font-extrabold text-foreground font-display">
                  Personal WhatsApp Outreach Gateway
                </h2>
              </div>
              <span className="text-xs text-muted-foreground font-mono">1-Click Dispatch</span>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-muted-foreground uppercase tracking-wider text-[10px]">
                  My Direct WhatsApp Mobile (+971)
                </label>
                <input
                  value={brokerPhone}
                  onChange={(e) => setBrokerPhone(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-border bg-secondary/30 text-xs font-semibold text-foreground focus:outline-none focus:border-primary font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-muted-foreground uppercase tracking-wider text-[10px]">
                  Default 1-Click WhatsApp Client Greeting
                </label>
                <textarea
                  rows={3}
                  value={whatsappGreeting}
                  onChange={(e) => setWhatsappGreeting(e.target.value)}
                  className="w-full p-3.5 rounded-xl border border-border bg-secondary/30 text-xs font-semibold text-foreground focus:outline-none focus:border-primary resize-none"
                />
              </div>

              <Button variant="outline" size="sm" onClick={testWhatsAppDispatch} className="h-9 rounded-xl text-xs font-bold gap-1.5">
                <Send size={13} />
                <span>Test WhatsApp Dispatch</span>
              </Button>
            </div>
          </section>

          {/* Broker Goals */}
          <section className="rounded-3xl border border-border/80 bg-card p-6 sm:p-7 shadow-sm space-y-5">
            <div className="flex items-center gap-2 border-b border-border/60 pb-3">
              <Target size={16} className="text-primary" />
              <h2 className="text-base font-extrabold text-foreground font-display">
                Monthly Performance & Volume Targets
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-muted-foreground uppercase tracking-wider text-[10px]">
                  Personal Target Volume (AED)
                </label>
                <input
                  value={personalTargetVolume}
                  onChange={(e) => setPersonalTargetVolume(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-border bg-secondary/30 text-xs font-semibold text-foreground focus:outline-none focus:border-primary font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-muted-foreground uppercase tracking-wider text-[10px]">
                  Monthly Closed Deals Goal
                </label>
                <input
                  value={personalTargetDeals}
                  onChange={(e) => setPersonalTargetDeals(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-border bg-secondary/30 text-xs font-semibold text-foreground focus:outline-none focus:border-primary font-mono"
                />
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
