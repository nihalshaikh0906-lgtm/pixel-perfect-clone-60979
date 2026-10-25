import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import {
  Sparkles,
  Building2,
  UserCheck,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Zap,
  Check,
  RotateCcw,
  Clock,
  ChevronRight,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/auth/AuthShell";
import { toast } from "sonner";
import { DemoBookingModal } from "@/components/dealos/DemoBookingModal";

export const Route = createFileRoute("/demo")({
  head: () => ({
    meta: [
      { title: "Interactive Live Demo · DealOS Dubai" },
      {
        name: "description",
        content:
          "Experience DealOS without credentials or payment. Select demo as Solo Broker or Agency Owner to explore pre-seeded Dubai leads, DLD inventory, and commission ledgers.",
      },
    ],
  }),
  component: DemoPage,
});

function DemoPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<"agent" | "owner">("agent");
  const [isLaunching, setIsLaunching] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);

  const handleLaunchDemo = (role: "agent" | "owner") => {
    setIsLaunching(true);
    if (typeof window !== "undefined") {
      localStorage.setItem("dealos_demo_mode", "true");
      localStorage.setItem("dealos_subscription_active", "true");
      localStorage.setItem("dealos_verified", "true");
      localStorage.setItem("dealos_role", role === "owner" ? "company" : "agent");
      localStorage.setItem(
        "dealos_active_email",
        role === "owner" ? "demo-owner@dealos.ae" : "demo-agent@dealos.ae"
      );
    }

    toast.success(
      `✓ Demo Activated! Launching ${
        role === "owner" ? "Agency Owner Overwatch" : "Broker Cockpit"
      }...`,
      { duration: 3000 }
    );

    setTimeout(() => {
      const destination = role === "owner" ? "/owner-dashboard" : "/app";
      if (typeof window !== "undefined") {
        window.location.href = destination;
      } else {
        void router.navigate({ to: destination, replace: true });
      }
    }, 200);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between selection:bg-primary/20">
      {/* Top Header */}
      <header className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 flex items-center justify-between border-b border-border/60">
        <div className="flex items-center gap-3">
          <Link to="/welcome" className="flex items-center gap-2">
            <Logo size={32} />
          </Link>
          <span className="hidden sm:inline-block text-xs font-mono font-bold text-muted-foreground/60">
            /
          </span>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
            7-DAY OPEN DEMO ACCESS
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/welcome"
            className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to Homepage
          </Link>
          <Button
            asChild
            size="sm"
            variant="outline"
            className="border-primary/40 text-xs font-bold text-primary hover:bg-primary/10"
          >
            <Link to="/login">Sign In ↗</Link>
          </Button>
        </div>
      </header>

      {/* Main Role Selector Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-12 sm:py-16 flex flex-col items-center justify-center text-center">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-mono font-bold mb-4">
          <Sparkles size={13} />
          <span>NO SIGNUP · NO PAYMENT FIREWALL · INSTANT EXPLORATION</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground font-display max-w-3xl">
          Experience DealOS in Action
        </h1>

        <p className="mt-4 text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed">
          Select how you would like to test the operating system. We have pre-seeded the workspace with real Dubai off-plan allocations, buyer leads, and DLD escrow data.
        </p>

        {/* 2-Role Interactive Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mt-10 text-left">
          {/* Card 1: Solo Broker Cockpit */}
          <div
            onClick={() => setSelectedRole("agent")}
            className={`relative rounded-3xl p-6 sm:p-8 border transition-all duration-200 cursor-pointer flex flex-col justify-between backdrop-blur-xl ${
              selectedRole === "agent"
                ? "border-primary bg-primary/10 ring-2 ring-primary/30 shadow-2xl scale-[1.01]"
                : "border-border/80 bg-card/80 hover:border-primary/40 hover:bg-card"
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-extrabold uppercase tracking-wider text-primary bg-primary/15 border border-primary/30 px-3 py-1 rounded-full flex items-center gap-1.5">
                  <UserCheck size={13} />
                  SOLO BROKER COCKPIT
                </span>
                {selectedRole === "agent" && (
                  <span className="size-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shadow-sm">
                    ✓
                  </span>
                )}
              </div>

              <h3 className="text-2xl font-black text-foreground font-display mt-4">
                Demo as Licensed Broker
              </h3>

              <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed">
                Experience high-velocity deal execution: triage hot investor leads, auto-match off-plan units with DLD escrow, and send 1-click WhatsApp pitch dossiers.
              </p>

              <div className="mt-6 pt-5 border-t border-border/60 space-y-2.5 text-xs text-muted-foreground">
                <p className="font-bold text-foreground text-[11px] uppercase tracking-wider font-mono">
                  Pre-Seeded Sample Data Included:
                </p>
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-400 shrink-0" />
                  <span>14 Verified Dubai Investor Leads (Cash ready)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-400 shrink-0" />
                  <span>34,850+ DLD Off-Plan Units &amp; 1% Monthly Plans</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-400 shrink-0" />
                  <span>1-Click WhatsApp Pitch Scripts &amp; Client Dossiers</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-400 shrink-0" />
                  <span>Interactive Map &amp; Rental Yield Intelligence</span>
                </div>
              </div>
            </div>

            <Button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleLaunchDemo("agent");
              }}
              disabled={isLaunching}
              className="mt-8 w-full h-12 rounded-xl text-xs sm:text-sm font-extrabold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 gap-2 cursor-pointer"
            >
              <span>Launch Broker Cockpit</span>
              <ArrowRight size={15} />
            </Button>
          </div>

          {/* Card 2: Agency Owner Overwatch */}
          <div
            onClick={() => setSelectedRole("owner")}
            className={`relative rounded-3xl p-6 sm:p-8 border transition-all duration-200 cursor-pointer flex flex-col justify-between backdrop-blur-xl ${
              selectedRole === "owner"
                ? "border-emerald-500 bg-emerald-500/10 ring-2 ring-emerald-500/30 shadow-2xl scale-[1.01]"
                : "border-border/80 bg-card/80 hover:border-emerald-500/40 hover:bg-card"
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-extrabold uppercase tracking-wider text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 rounded-full flex items-center gap-1.5">
                  <Building2 size={13} />
                  AGENCY OWNER OVERWATCH
                </span>
                {selectedRole === "owner" && (
                  <span className="size-5 rounded-full bg-emerald-500 text-black flex items-center justify-center text-xs font-bold shadow-sm">
                    ✓
                  </span>
                )}
              </div>

              <h3 className="text-2xl font-black text-foreground font-display mt-4">
                Demo as Agency Owner
              </h3>

              <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed">
                Take the executive command view: monitor multi-agent commission splits, track developer receivable aging ledgers, and manage pipeline health.
              </p>

              <div className="mt-6 pt-5 border-t border-border/60 space-y-2.5 text-xs text-muted-foreground">
                <p className="font-bold text-foreground text-[11px] uppercase tracking-wider font-mono">
                  Pre-Seeded Sample Data Included:
                </p>
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-400 shrink-0" />
                  <span>AED 4.2M Quarterly Gross Transaction Volume</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-400 shrink-0" />
                  <span>AED 1.45M Developer Commission Aging Ledger</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-400 shrink-0" />
                  <span>12 Active Team Agents &amp; Commission Split Matrix</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-400 shrink-0" />
                  <span>Automated Corporate Proforma Invoicing &amp; IBAN</span>
                </div>
              </div>
            </div>

            <Button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleLaunchDemo("owner");
              }}
              disabled={isLaunching}
              className="mt-8 w-full h-12 rounded-xl text-xs sm:text-sm font-extrabold bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg shadow-emerald-500/25 gap-2 cursor-pointer"
            >
              <span>Launch Owner Overwatch</span>
              <ArrowRight size={15} />
            </Button>
          </div>
        </div>

        {/* 1-on-1 Walkthrough Callout */}
        <div className="mt-10 p-4 rounded-2xl border border-border/80 bg-secondary/30 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-3xl w-full text-left">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
              <Video size={18} />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-foreground">
                Prefer a personalized 1-on-1 demo walkthrough?
              </p>
              <p className="text-[11px] text-muted-foreground">
                Our Dubai product specialist can walk your agency leadership through live workflows.
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowDemoModal(true)}
            className="text-xs font-bold border-border hover:bg-secondary shrink-0 cursor-pointer"
          >
            Book 15-Min Zoom ↗
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 border-t border-border/60 text-xs text-muted-foreground flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ShieldCheck size={14} className="text-emerald-400" />
          <span>DealOS Dubai Real Estate Operating System · Temporary Open Testing</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/pricing" className="hover:text-foreground">
            Pricing Plans
          </Link>
          <span>•</span>
          <Link to="/faq" className="hover:text-foreground">
            FAQ
          </Link>
          <span>•</span>
          <Link to="/welcome" className="hover:text-foreground">
            Homepage
          </Link>
        </div>
      </footer>

      {/* 15-min zoom modal */}
      <DemoBookingModal
        isOpen={showDemoModal}
        onClose={() => setShowDemoModal(false)}
      />
    </div>
  );
}
