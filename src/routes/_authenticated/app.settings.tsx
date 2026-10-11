import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Settings, DollarSign, Users, Sparkles, MessageCircle, ShieldCheck,
  Check, RotateCcw, Building2, User, Phone, Send, ExternalLink,
  Target, Clock, Bell, Sparkle
} from "lucide-react";
import { toast } from "sonner";
import { workspaceHead } from "@/components/app/WorkspacePlaceholder";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/app/settings")({
  head: () => workspaceHead("System Settings"),
  component: Page,
});

const DEFAULT_AGENTS = ["Adam Rahman", "Aisha Salem", "Saad Khan", "Omar Farooq", "Priya Nair"];

export function Page() {
  // Role Detection (Broker Agent vs Company Owner)
  const [userRole, setUserRole] = useState<"company_admin" | "agent">("company_admin");
  const [viewTab, setViewTab] = useState<"broker" | "owner">("broker");

  // ═══ 1. USER / BROKER PERSONAL SETTINGS ═══
  const [brokerPhone, setBrokerPhone] = useState("+971 50 892 4119");
  const [whatsappConnected, setWhatsappConnected] = useState(true);
  const [whatsappGreeting, setWhatsappGreeting] = useState("Hello! Reaching out regarding your Dubai luxury property inquiry on DealOS.");
  const [personalTargetVolume, setPersonalTargetVolume] = useState("3,000,000");
  const [personalTargetDeals, setPersonalTargetDeals] = useState("2");
  const [brokerSplit, setBrokerSplit] = useState("50.0");
  const [autoAcceptLeads, setAutoAcceptLeads] = useState(true);
  const [preferredChannel, setPreferredChannel] = useState("WhatsApp Direct (One-Click)");
  const [slaAlertMinutes, setSlaAlertMinutes] = useState("5");
  const [copilotTone, setCopilotTone] = useState("Luxury Closer (High-Net-Worth)");
  const [copilotLanguage, setCopilotLanguage] = useState("English (UAE Business)");

  // ═══ 2. OWNER-ONLY AGENCY SETTINGS ═══
  const [agencyFee, setAgencyFee] = useState("2.0");
  const [agencyAgentSplit, setAgencyAgentSplit] = useState("50.0");
  const [vat, setVat] = useState("5.0");
  const [roundRobin, setRoundRobin] = useState(true);
  const [fallbackAgent, setFallbackAgent] = useState("Aisha Salem");
  const [agencyWhatsapp, setAgencyWhatsapp] = useState("+971 4 398 2000");

  useEffect(() => {
    void supabase.auth.getUser().then(({ data }) => {
      const user = data.user;
      if (!user) return;
      const m = (user.user_metadata ?? {}) as Record<string, unknown>;
      if (m.phone && typeof m.phone === "string") setBrokerPhone(m.phone);
      (supabase as unknown as { from: (t: string) => any })
        .from("org_members")
        .select("role")
        .eq("user_id", user.id)
        .maybeSingle()
        .then((r: { data: { role: string } | null }) => {
          const rRole = r.data?.role === "company_admin" ? "company_admin" : "agent";
          setUserRole(rRole);
          // Default tab: broker view for agents, owner option for admins
          if (rRole === "agent") setViewTab("broker");
        });
    });
  }, []);

  // Live Broker Earnings Calculation
  const sampleDeal = 2000000; // AED 2M sample deal
  const agencyCommissionPct = parseFloat(agencyFee) || 2.0;
  const userSplitPct = viewTab === "broker" ? (parseFloat(brokerSplit) || 50.0) : (parseFloat(agencyAgentSplit) || 50.0);
  const totalCommission = (sampleDeal * agencyCommissionPct) / 100;
  const sampleBrokerPayout = (totalCommission * userSplitPct) / 100;
  const sampleAgencyRetained = totalCommission - sampleBrokerPayout;

  const handleSave = () => {
    toast.success("Settings saved successfully!");
  };

  const handleReset = () => {
    if (viewTab === "broker") {
      setBrokerSplit("50.0");
      setPersonalTargetVolume("3,000,000");
      setPersonalTargetDeals("2");
      setAutoAcceptLeads(true);
      setPreferredChannel("WhatsApp Direct (One-Click)");
      setCopilotTone("Luxury Closer (High-Net-Worth)");
      toast.info("Broker preferences restored to standard profile defaults.");
    } else {
      setAgencyFee("2.0");
      setAgencyAgentSplit("50.0");
      setVat("5.0");
      setRoundRobin(true);
      setFallbackAgent("Aisha Salem");
      toast.info("Agency settings restored to standard DLD defaults.");
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
    <div className="w-full max-w-4xl mx-auto space-y-6 pb-24 animate-in fade-in-50 duration-300">
      {/* ═══ 1. CLEAN EXECUTIVE HEADER ═══ */}
      <section className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-r from-card via-card to-secondary/30 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-primary">
                {viewTab === "broker" ? "Broker Profile & Outreach" : "Agency Administration"}
              </span>
              <span className="text-muted-foreground">•</span>
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                <ShieldCheck size={14} /> DLD Compliance Active
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-display">
              {viewTab === "broker" ? "Broker & Outreach Settings" : "Agency Master Settings"}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {viewTab === "broker"
                ? "Configure your personal WhatsApp dispatcher, commission goals, and AI copilot tone."
                : "Manage agency-wide commission splits, team lead distribution, and company compliance."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Role Tab Switcher for Company Owners */}
            {userRole === "company_admin" && (
              <div className="flex items-center bg-secondary/80 p-1 rounded-2xl border border-border mr-1">
                <button
                  type="button"
                  onClick={() => setViewTab("broker")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    viewTab === "broker" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <User size={13} />
                  <span>My Broker View</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewTab("owner")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    viewTab === "owner" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Building2 size={13} />
                  <span>Agency Owner</span>
                </button>
              </div>
            )}

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

      {/* ═══ 2. COMMISSION & FINANCIAL TARGETS (SAME LAYOUT) ═══ */}
      <section className="rounded-3xl border border-border/80 bg-card p-6 sm:p-7 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <DollarSign size={16} className="text-primary" />
            <h2 className="text-base font-extrabold text-foreground font-display">
              {viewTab === "broker" ? "My Broker Commission & Monthly Goals" : "Brokerage Commission & Agency Splits"}
            </h2>
          </div>
          <span className="text-xs text-emerald-400 font-mono font-bold">
            {viewTab === "broker" ? "Live Earnings Projection" : "UAE VAT 5% Standard"}
          </span>
        </div>

        {viewTab === "broker" ? (
          /* BROKER USER LAYOUT */
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">My Broker Split (%)</label>
              <div className="relative">
                <input
                  value={brokerSplit}
                  onChange={(e) => setBrokerSplit(e.target.value)}
                  className="w-full h-11 px-4 pr-8 rounded-xl border border-border bg-secondary/40 text-xs font-bold text-foreground focus:outline-none focus:border-primary font-mono"
                />
                <span className="absolute right-3 top-3 text-xs text-muted-foreground font-bold">%</span>
              </div>
              <p className="text-[11px] text-muted-foreground">Contract commission percentage with agency</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Monthly Target Volume (AED)</label>
              <div className="relative">
                <input
                  value={personalTargetVolume}
                  onChange={(e) => setPersonalTargetVolume(e.target.value)}
                  className="w-full h-11 px-4 pr-12 rounded-xl border border-border bg-secondary/40 text-xs font-bold text-foreground focus:outline-none focus:border-primary font-mono"
                />
                <span className="absolute right-3 top-3 text-xs text-muted-foreground font-bold">AED</span>
              </div>
              <p className="text-[11px] text-muted-foreground">Monthly closed transaction goal</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Target Closed Deals</label>
              <div className="relative">
                <input
                  value={personalTargetDeals}
                  onChange={(e) => setPersonalTargetDeals(e.target.value)}
                  className="w-full h-11 px-4 pr-14 rounded-xl border border-border bg-secondary/40 text-xs font-bold text-foreground focus:outline-none focus:border-primary font-mono"
                />
                <span className="absolute right-3 top-3 text-xs text-muted-foreground font-bold">Deals</span>
              </div>
              <p className="text-[11px] text-muted-foreground">Target monthly signed SPAs / contracts</p>
            </div>
          </div>
        ) : (
          /* OWNER AGENCY LAYOUT */
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Default Agency Fee (%)</label>
              <div className="relative">
                <input
                  value={agencyFee}
                  onChange={(e) => setAgencyFee(e.target.value)}
                  className="w-full h-11 px-4 pr-8 rounded-xl border border-border bg-secondary/40 text-xs font-bold text-foreground focus:outline-none focus:border-primary font-mono"
                />
                <span className="absolute right-3 top-3 text-xs text-muted-foreground font-bold">%</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Agent Commission Split (%)</label>
              <div className="relative">
                <input
                  value={agencyAgentSplit}
                  onChange={(e) => setAgencyAgentSplit(e.target.value)}
                  className="w-full h-11 px-4 pr-8 rounded-xl border border-border bg-secondary/40 text-xs font-bold text-foreground focus:outline-none focus:border-primary font-mono"
                />
                <span className="absolute right-3 top-3 text-xs text-muted-foreground font-bold">%</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">UAE Federal VAT (%)</label>
              <div className="relative">
                <input
                  value={vat}
                  onChange={(e) => setVat(e.target.value)}
                  className="w-full h-11 px-4 pr-8 rounded-xl border border-border bg-secondary/40 text-xs font-bold text-foreground focus:outline-none focus:border-primary font-mono"
                />
                <span className="absolute right-3 top-3 text-xs text-muted-foreground font-bold">%</span>
              </div>
            </div>
          </div>
        )}

        {/* Live Calculation Preview Banner */}
        <div className="rounded-2xl bg-secondary/30 border border-border/70 p-4 space-y-2 text-xs">
          <span className="font-bold text-foreground">
            {viewTab === "broker"
              ? "Live Take-Home Simulation on AED 2,000,000 Property Deal (2% Agency Fee):"
              : "Live Agency Simulation on AED 2,000,000 Property Deal (2% Agency Fee):"}
          </span>
          <div className="grid grid-cols-3 gap-2 pt-1 font-mono">
            <div className="p-2.5 rounded-xl bg-card border border-border/60">
              <span className="text-muted-foreground text-[10px] uppercase font-bold block">Total 2% Fee</span>
              <strong className="text-foreground text-sm">AED {totalCommission.toLocaleString()}</strong>
            </div>
            <div className="p-2.5 rounded-xl bg-card border border-border/60">
              <span className="text-muted-foreground text-[10px] uppercase font-bold block">
                {viewTab === "broker" ? `Your Take-Home (${userSplitPct}%)` : `Broker Payout (${userSplitPct}%)`}
              </span>
              <strong className="text-emerald-400 text-sm">AED {sampleBrokerPayout.toLocaleString()}</strong>
            </div>
            <div className="p-2.5 rounded-xl bg-card border border-border/60">
              <span className="text-muted-foreground text-[10px] uppercase font-bold block">Agency Share</span>
              <strong className="text-primary text-sm">AED {sampleAgencyRetained.toLocaleString()}</strong>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 3. LEAD ROUTING & PERSONAL OUTREACH (SAME LAYOUT) ═══ */}
      <section className="rounded-3xl border border-border/80 bg-card p-6 sm:p-7 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-primary" />
            <h2 className="text-base font-extrabold text-foreground font-display">
              {viewTab === "broker" ? "Inbound Lead Response & Availability" : "Automated Agency Lead Distribution"}
            </h2>
          </div>
          <span className="text-xs text-muted-foreground font-mono">
            {viewTab === "broker" ? "Instant Alert Active" : "Real-time allocation"}
          </span>
        </div>

        {viewTab === "broker" ? (
          /* BROKER USER LAYOUT */
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-secondary/30 border border-border/60">
              <div>
                <p className="text-xs font-bold text-foreground">Auto-Accept Inbound Leads Assigned to Me</p>
                <p className="text-[11px] text-muted-foreground">
                  Immediately open new buyer/tenant dossiers in your priority queue without waiting for manual confirmation.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAutoAcceptLeads(!autoAcceptLeads)}
                className={`size-6 rounded-lg border flex items-center justify-center transition-all ${
                  autoAcceptLeads ? "bg-emerald-600 border-emerald-500 text-white" : "border-border bg-card"
                }`}
              >
                {autoAcceptLeads && <Check size={14} />}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Preferred Client Outreach Channel</label>
                <select
                  value={preferredChannel}
                  onChange={(e) => setPreferredChannel(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-border bg-secondary/40 text-xs font-bold text-foreground focus:outline-none focus:border-primary"
                >
                  <option value="WhatsApp Direct (One-Click)">WhatsApp Direct (One-Click Link)</option>
                  <option value="Direct Phone Call">Direct Phone Call First</option>
                  <option value="Email Presentation">Email PDF Presentation First</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Speed-To-Lead SLA Alert</label>
                <select
                  value={slaAlertMinutes}
                  onChange={(e) => setSlaAlertMinutes(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-border bg-secondary/40 text-xs font-bold text-foreground focus:outline-none focus:border-primary"
                >
                  <option value="3">&lt; 3 Minutes (Ultra High-Priority Alert)</option>
                  <option value="5">&lt; 5 Minutes (Standard Recommendation)</option>
                  <option value="15">&lt; 15 Minutes (Relaxed Window)</option>
                </select>
              </div>
            </div>
          </div>
        ) : (
          /* OWNER AGENCY LAYOUT */
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-secondary/30 border border-border/60">
              <div>
                <p className="text-xs font-bold text-foreground">Round-Robin Rotation Across Licensed Brokers</p>
                <p className="text-[11px] text-muted-foreground">Distributes incoming Bayut, Property Finder and direct leads evenly across active brokers.</p>
              </div>
              <button
                type="button"
                onClick={() => setRoundRobin(!roundRobin)}
                className={`size-6 rounded-lg border flex items-center justify-center transition-all ${
                  roundRobin ? "bg-emerald-600 border-emerald-500 text-white" : "border-border bg-card"
                }`}
              >
                {roundRobin && <Check size={14} />}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Default Escalation Broker</label>
                <select
                  value={fallbackAgent}
                  onChange={(e) => setFallbackAgent(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-border bg-secondary/40 text-xs font-bold text-foreground focus:outline-none focus:border-primary"
                >
                  {DEFAULT_AGENTS.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Speed-To-Lead SLA Alert</label>
                <select
                  value={slaAlertMinutes}
                  onChange={(e) => setSlaAlertMinutes(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-border bg-secondary/40 text-xs font-bold text-foreground focus:outline-none focus:border-primary"
                >
                  <option value="3">&lt; 3 Minutes (Ultra High-Priority)</option>
                  <option value="5">&lt; 5 Minutes (Company Standard)</option>
                  <option value="15">&lt; 15 Minutes (Extended)</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ═══ 4. DIRECT WHATSAPP NUMBER CONNECTION (ZERO API KEYS) ═══ */}
      <section className="rounded-3xl border border-border/80 bg-card p-6 sm:p-7 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <MessageCircle size={16} className="text-emerald-400" />
            <h2 className="text-base font-extrabold text-foreground font-display">
              {viewTab === "broker" ? "My WhatsApp Phone Number (Direct Link)" : "Agency WhatsApp Dispatcher Number"}
            </h2>
          </div>
          <span className="text-xs text-emerald-400 font-mono font-bold flex items-center gap-1">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            {whatsappConnected ? "Direct Number Active" : "Disconnected"}
          </span>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                {viewTab === "broker" ? "Your WhatsApp Mobile Number" : "Agency Official WhatsApp Number"}
              </label>
              <div className="relative">
                <input
                  value={viewTab === "broker" ? brokerPhone : agencyWhatsapp}
                  onChange={(e) => (viewTab === "broker" ? setBrokerPhone(e.target.value) : setAgencyWhatsapp(e.target.value))}
                  placeholder="+971 50 123 4567"
                  className="w-full h-11 px-4 rounded-xl border border-border bg-secondary/40 text-xs font-bold text-foreground focus:outline-none focus:border-primary font-mono"
                />
              </div>
              <p className="text-[11px] text-muted-foreground">
                🇦🇪 Enter your direct number with country code (+971). No API keys or developer setup needed.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Default Quick Outreach Greeting</label>
              <input
                value={whatsappGreeting}
                onChange={(e) => setWhatsappGreeting(e.target.value)}
                placeholder="Hello, reaching out regarding your property inquiry…"
                className="w-full h-11 px-4 rounded-xl border border-border bg-secondary/40 text-xs font-medium text-foreground focus:outline-none focus:border-primary"
              />
              <p className="text-[11px] text-muted-foreground">
                Pre-filled when dispatching one-click property brochures to clients
              </p>
            </div>
          </div>

          {/* Connection & Test Dispatch Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-2xl bg-secondary/30 border border-border/60">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <MessageCircle size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">Direct WhatsApp Web & App Dispatch</p>
                <p className="text-[11px] text-muted-foreground">
                  Connects directly from your number. Outbound messages, floor plans, and pitches launch instantly in WhatsApp.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={testWhatsAppDispatch}
                className="h-8 rounded-xl text-xs font-bold border-border gap-1 text-emerald-400 hover:bg-emerald-500/10"
              >
                <ExternalLink size={13} />
                <span>Test WhatsApp</span>
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={() => {
                  setWhatsappConnected(!whatsappConnected);
                  toast.success(whatsappConnected ? "WhatsApp disconnected." : "WhatsApp connected successfully to your number.");
                }}
                className={`h-8 rounded-xl text-xs font-bold transition-all ${
                  whatsappConnected ? "bg-emerald-600 text-white" : "border border-border bg-secondary text-muted-foreground"
                }`}
              >
                {whatsappConnected ? "Connected" : "Connect"}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 5. AI COPILOT ENGINE (ZERO API KEYS) ═══ */}
      <section className="rounded-3xl border border-border/80 bg-card p-6 sm:p-7 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-primary" />
            <h2 className="text-base font-extrabold text-foreground font-display">
              {viewTab === "broker" ? "My AI Copilot Tone & Language" : "Agency AI Mastermind Engine"}
            </h2>
          </div>
          <span className="text-xs text-primary font-mono font-bold flex items-center gap-1">
            <span className="size-2 rounded-full bg-primary" />
            Native AI Powered
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">AI Pitch Strategy & Persona</label>
            <select
              value={copilotTone}
              onChange={(e) => setCopilotTone(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-secondary/40 text-xs font-bold text-foreground focus:outline-none focus:border-primary"
            >
              <option value="Luxury Closer (High-Net-Worth)">Luxury Closer (High-Net-Worth Investors)</option>
              <option value="Executive Financial Analyst (ROI & Yields)">Executive Financial Analyst (ROI & Yields)</option>
              <option value="Warm & Consultative Broker">Warm & Consultative (First-Time Buyers)</option>
              <option value="Direct & Concise Executive">Direct & Concise Executive</option>
            </select>
            <p className="text-[11px] text-muted-foreground">Adjusts how the AI copilot drafts client WhatsApp pitches</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Default Translation & Output Language</label>
            <select
              value={copilotLanguage}
              onChange={(e) => setCopilotLanguage(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-secondary/40 text-xs font-bold text-foreground focus:outline-none focus:border-primary"
            >
              <option value="English (UAE Business)">English (UAE Business Standard)</option>
              <option value="Arabic (Formal Real Estate)">Arabic (Formal Real Estate & DLD)</option>
              <option value="Russian (Prime & Luxury)">Russian (Prime & Luxury Focus)</option>
              <option value="French (European Investors)">French (European Investors)</option>
            </select>
            <p className="text-[11px] text-muted-foreground">Direct multilingual investor responses</p>
          </div>
        </div>

        {/* Built-in AI Info Banner (No API keys needed) */}
        <div className="rounded-2xl bg-secondary/30 border border-border/70 p-4 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5">
            <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
            <span className="text-muted-foreground">
              DealOS AI copilot is integrated natively with real-time Dubai Land Department data. <strong className="text-foreground">Zero external API keys required.</strong>
            </span>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 font-bold shrink-0">Included</span>
        </div>
      </section>
    </div>
  );
}
