import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Settings, DollarSign, Users, Sparkles, MessageCircle, ShieldCheck,
  Check, RotateCcw, Plug, Eye, EyeOff, Building2, Key, Info
} from "lucide-react";
import { toast } from "sonner";
import { workspaceHead } from "@/components/app/WorkspacePlaceholder";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/app/settings")({
  head: () => workspaceHead("System Settings"),
  component: Page,
});

const DEFAULT_AGENTS = ["Adam Rahman", "Aisha Salem", "Saad Khan", "Omar Farooq", "Priya Nair"];
const DEFAULT_MODELS = ["gpt-4o (OpenAI Flagship)", "deepseek-chat (DeepSeek V3)", "claude-3-5-sonnet", "gpt-4o-mini"];

function Page() {
  // Panel 1: Agency Financial Defaults
  const [commission, setCommission] = useState("2.0");
  const [agentSplit, setAgentSplit] = useState("50.0");
  const [vat, setVat] = useState("5.0");

  // Panel 2: Lead Routing & Speed-to-Lead
  const [roundRobin, setRoundRobin] = useState(true);
  const [fallbackAgent, setFallbackAgent] = useState("Aisha Salem");
  const [maxResponseMinutes, setMaxResponseMinutes] = useState("5");

  // Panel 3: AI Intelligence Engine
  const [aiModel, setAiModel] = useState("gpt-4o (OpenAI Flagship)");
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);

  // Panel 4: WhatsApp Gateway
  const [whatsappConnected, setWhatsappConnected] = useState(true);

  // Live Split Computation
  const commRate = parseFloat(commission) || 0;
  const splitRate = parseFloat(agentSplit) || 0;
  const sampleDeal = 2000000; // AED 2M sample deal
  const sampleAgencyFee = (sampleDeal * commRate) / 100;
  const sampleAgentPayout = (sampleAgencyFee * splitRate) / 100;
  const sampleAgencyRetained = sampleAgencyFee - sampleAgentPayout;

  const handleSave = () => {
    toast.success("Agency system settings saved successfully!");
  };

  const handleReset = () => {
    setCommission("2.0");
    setAgentSplit("50.0");
    setVat("5.0");
    setRoundRobin(true);
    setFallbackAgent("Aisha Salem");
    toast.info("Settings restored to standard DLD defaults.");
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 pb-24 animate-in fade-in-50 duration-300">
      {/* ═══ 1. CLEAN EXECUTIVE HEADER ═══ */}
      <section className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-r from-card via-card to-secondary/30 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-primary">
                Agency Administration
              </span>
              <span className="text-muted-foreground">•</span>
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                <ShieldCheck size={14} /> DLD Compliance Active
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-display">
              Agency & System Settings
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Configure broker commission splits, automated lead routing, and the AI copilot engine.
            </p>
          </div>

          <div className="flex items-center gap-2">
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

      {/* ═══ 2. COMMISSION & FINANCIAL SPLITS ═══ */}
      <section className="rounded-3xl border border-border/80 bg-card p-6 sm:p-7 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <DollarSign size={16} className="text-primary" />
            <h2 className="text-base font-extrabold text-foreground font-display">Brokerage Commission & Splits</h2>
          </div>
          <span className="text-xs text-emerald-400 font-mono font-bold">UAE VAT 5% Standard</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Default Agency Fee (%)</label>
            <div className="relative">
              <input
                value={commission}
                onChange={(e) => setCommission(e.target.value)}
                className="w-full h-11 px-4 pr-8 rounded-xl border border-border bg-secondary/40 text-xs font-bold text-foreground focus:outline-none focus:border-primary font-mono"
              />
              <span className="absolute right-3 top-3 text-xs text-muted-foreground font-bold">%</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Agent Commission Split (%)</label>
            <div className="relative">
              <input
                value={agentSplit}
                onChange={(e) => setAgentSplit(e.target.value)}
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

        {/* Live Calculation Preview Banner */}
        <div className="rounded-2xl bg-secondary/30 border border-border/70 p-4 space-y-2 text-xs">
          <span className="font-bold text-foreground">Live Simulation on AED 2,000,000 Sale:</span>
          <div className="grid grid-cols-3 gap-2 pt-1 font-mono">
            <div className="p-2.5 rounded-xl bg-card border border-border/60">
              <span className="text-muted-foreground text-[10px] uppercase font-bold block">Total Agency Fee</span>
              <strong className="text-foreground text-sm">AED {sampleAgencyFee.toLocaleString()}</strong>
            </div>
            <div className="p-2.5 rounded-xl bg-card border border-border/60">
              <span className="text-muted-foreground text-[10px] uppercase font-bold block">Agent Payout ({agentSplit}%)</span>
              <strong className="text-emerald-400 text-sm">AED {sampleAgentPayout.toLocaleString()}</strong>
            </div>
            <div className="p-2.5 rounded-xl bg-card border border-border/60">
              <span className="text-muted-foreground text-[10px] uppercase font-bold block">Agency Retained</span>
              <strong className="text-primary text-sm">AED {sampleAgencyRetained.toLocaleString()}</strong>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 3. LEAD ROUTING & SPEED-TO-LEAD ═══ */}
      <section className="rounded-3xl border border-border/80 bg-card p-6 sm:p-7 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-primary" />
            <h2 className="text-base font-extrabold text-foreground font-display">Automated Lead Distribution</h2>
          </div>
          <span className="text-xs text-muted-foreground font-mono">Real-time allocation</span>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-secondary/30 border border-border/60">
            <div>
              <p className="text-xs font-bold text-foreground">Round-Robin Rotation Across Licensed Brokers</p>
              <p className="text-[11px] text-muted-foreground">Distributes incoming Bayut and Property Finder leads evenly among active team members.</p>
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
                value={maxResponseMinutes}
                onChange={(e) => setMaxResponseMinutes(e.target.value)}
                className="w-full h-11 px-4 rounded-xl border border-border bg-secondary/40 text-xs font-bold text-foreground focus:outline-none focus:border-primary"
              >
                <option value="3">&lt; 3 Minutes (Ultra High-Priority)</option>
                <option value="5">&lt; 5 Minutes (Company Standard)</option>
                <option value="15">&lt; 15 Minutes (Extended)</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 4. AI MASTERMIND & WHATSAPP GATEWAY ═══ */}
      <section className="rounded-3xl border border-border/80 bg-card p-6 sm:p-7 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-primary" />
            <h2 className="text-base font-extrabold text-foreground font-display">AI Copilot & WhatsApp Gateway</h2>
          </div>
          <span className="text-xs text-emerald-400 font-mono font-bold">Connected</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">AI Mastermind Model</label>
            <select
              value={aiModel}
              onChange={(e) => setAiModel(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-secondary/40 text-xs font-bold text-foreground focus:outline-none focus:border-primary"
            >
              {DEFAULT_MODELS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Custom OpenAI / DeepSeek Key</label>
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="text-[11px] text-primary hover:underline font-bold"
              >
                {showKey ? "Hide" : "Show"}
              </button>
            </div>
            <input
              type={showKey ? "text" : "password"}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-proj-•••••••••••••••• (Leave blank to use default)"
              className="w-full h-11 px-4 rounded-xl border border-border bg-secondary/40 text-xs font-semibold text-foreground focus:outline-none focus:border-primary font-mono"
            />
          </div>
        </div>

        {/* WhatsApp Business API Integration */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-secondary/30 border border-border/60">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <MessageCircle size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">WhatsApp Business Official API</p>
              <p className="text-[11px] text-muted-foreground">Direct 1-click client pitch generator & automated brochure dispatches.</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setWhatsappConnected(!whatsappConnected);
              toast.success(whatsappConnected ? "WhatsApp disconnected." : "WhatsApp connected.");
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              whatsappConnected ? "bg-emerald-600 text-white" : "border border-border bg-secondary text-muted-foreground"
            }`}
          >
            {whatsappConnected ? "Connected" : "Connect"}
          </button>
        </div>
      </section>
    </div>
  );
}
