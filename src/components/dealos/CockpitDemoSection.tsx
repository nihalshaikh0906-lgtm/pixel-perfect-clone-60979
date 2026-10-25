import { useState } from "react";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Building2,
  Users,
  Video,
  Play,
  Zap,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export function CockpitDemoSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("+971 ");
  const [agency, setAgency] = useState("");
  const [agents, setAgents] = useState("1-5 agents");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || loading) return;

    setLoading(true);
    const payload = {
      name: name.trim() || "Amina Al Mansoori",
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      agency: agency.trim() || "Luxury Realty Dubai",
      agent_count: agents,
      created_at: new Date().toISOString(),
      status: "new",
    };

    try {
      await (supabase as unknown as { from: (t: string) => any })
        .from("demo_requests")
        .insert(payload);
    } catch (err) {
      console.warn("Supabase demo request notice:", err);
    }

    try {
      const existing = JSON.parse(localStorage.getItem("dealos_demo_requests") || "[]");
      existing.push(payload);
      localStorage.setItem("dealos_demo_requests", JSON.stringify(existing));
    } catch {
      // localstorage safe
    }

    setLoading(false);
    setSubmitted(true);
    toast.success("Walkthrough Request Confirmed! Our Dubai team will connect via WhatsApp.");
  };

  const handleInstantDemo = (role: "agent" | "company") => {
    if (typeof window !== "undefined") {
      localStorage.setItem("dealos_demo_mode", "true");
      localStorage.setItem("dealos_subscription_active", "true");
      localStorage.setItem("dealos_role", role);
      localStorage.setItem("dealos_active_email", role === "company" ? "demo-owner@dealos.ae" : "demo-agent@dealos.ae");
      window.location.href = role === "company" ? "/owner-dashboard" : "/app";
    }
  };

  return (
    <section id="cockpit-demo" className="relative z-20 py-12 sm:py-16 px-4 max-w-4xl mx-auto">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-primary/20 via-[#7B4DFF]/15 to-transparent blur-[110px] rounded-full pointer-events-none -z-10" />

      <div className="rounded-3xl sm:rounded-[36px] border border-border/80 bg-card/95 backdrop-blur-2xl p-6 sm:p-10 shadow-2xl space-y-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-mono font-bold shadow-xs">
            <Sparkles size={13} className="text-primary" />
            <span>EXECUTIVE WALKTHROUGH · DUBAI RERA READY</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground font-display">
            See your cockpit.
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Request your personalised DealOS walkthrough. Discover how 34,850+ DLD units, instant WhatsApp investor scripts, and owner commission aging power Dubai's top 1% brokers.
          </p>
        </div>

        {/* Form or Confirmation Receipt */}
        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label htmlFor="demo-name" className="text-xs font-bold text-foreground block">
                  Full Name
                </label>
                <input
                  id="demo-name"
                  type="text"
                  autoComplete="name"
                  required
                  maxLength={120}
                  placeholder="Amina Al Mansoori"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all shadow-xs"
                />
              </div>

              {/* Work Email */}
              <div className="space-y-1.5">
                <label htmlFor="demo-email" className="text-xs font-bold text-foreground block">
                  Work Email
                </label>
                <input
                  id="demo-email"
                  type="email"
                  autoComplete="email"
                  required
                  maxLength={200}
                  placeholder="you@brokerage.ae"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all shadow-xs"
                />
              </div>

              {/* WhatsApp Number */}
              <div className="space-y-1.5">
                <label htmlFor="demo-phone" className="text-xs font-bold text-foreground block">
                  WhatsApp Number
                </label>
                <input
                  id="demo-phone"
                  type="tel"
                  autoComplete="tel"
                  required
                  maxLength={40}
                  placeholder="+971 50 123 4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all shadow-xs font-mono"
                />
              </div>

              {/* Agency */}
              <div className="space-y-1.5">
                <label htmlFor="demo-agency" className="text-xs font-bold text-foreground block">
                  Agency / Brokerage
                </label>
                <input
                  id="demo-agency"
                  type="text"
                  autoComplete="organization"
                  required
                  maxLength={160}
                  placeholder="Luxury Realty Dubai"
                  value={agency}
                  onChange={(e) => setAgency(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all shadow-xs"
                />
              </div>

              {/* Number of Agents */}
              <div className="sm:col-span-2 space-y-1.5">
                <label htmlFor="demo-agents" className="text-xs font-bold text-foreground block">
                  Number of Agents in Brokerage
                </label>
                <select
                  id="demo-agents"
                  value={agents}
                  onChange={(e) => setAgents(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all shadow-xs"
                >
                  <option value="1-5 agents">1–5 agents (Solo &amp; Boutique)</option>
                  <option value="6-15 agents">6–15 agents (Growth Team)</option>
                  <option value="16-50 agents">16–50 agents (Enterprise Agency)</option>
                  <option value="50+ agents">50+ agents (Master Brokerage)</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-13 rounded-2xl text-sm font-extrabold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 gap-2 transition-all cursor-pointer"
            >
              <span>{loading ? "Confirming Request..." : "Book Demo Walkthrough"}</span>
              <ArrowRight size={16} />
            </Button>
          </form>
        ) : (
          <div className="p-6 sm:p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-4 max-w-xl mx-auto animate-in fade-in zoom-in-95">
            <div className="size-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">Demo Walkthrough Confirmed!</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                We've received your request for <strong>{agency || "your agency"}</strong>. Our team will contact you via WhatsApp ({phone}) to conduct your personalized cockpit tour.
              </p>
            </div>
            <div className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setSubmitted(false)}
                className="rounded-xl text-xs"
              >
                Submit another request
              </Button>
            </div>
          </div>
        )}

        {/* Instant Sandbox Alternative (No Wait) */}
        <div className="pt-6 border-t border-border/70 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground text-center sm:text-left">
          <div>
            <p className="font-semibold text-foreground">
              Prefer to explore right away without scheduling a call?
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Instant public review mode with preloaded Dubai leads &amp; off-plan catalog.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => handleInstantDemo("agent")}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary/80 hover:opacity-95 text-white font-extrabold text-xs shadow-md shadow-primary/20 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Zap size={14} className="text-amber-300" />
              <span>Try Live Demo Now ⚡</span>
            </button>
            <Link
              to="/demo"
              className="px-3.5 py-2.5 rounded-xl bg-secondary/80 hover:bg-secondary text-foreground font-bold text-xs border border-border/80 transition-colors"
            >
              Pick Role ⇄
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function SeeTheBrokerHeader() {
  return (
    <div id="see-the-broker" className="relative z-10 py-12 sm:py-16 text-center max-w-4xl mx-auto px-4">
      {/* Visual glowing divider */}
      <div className="w-24 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-8 rounded-full" />
      
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-mono font-bold">
          <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>INSIDE DEALOS · THE BROKER DESK</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground font-display">
          See the broker.
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Explore sample leads, verified DLD property matches, and automated deal rooms. Experience how an institutional operating system transforms daily broker velocity.
        </p>
      </div>
    </div>
  );
}
