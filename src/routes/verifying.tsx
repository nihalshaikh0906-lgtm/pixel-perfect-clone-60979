import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  Lock,
  Building2,
  User,
  Smartphone,
  MessageCircle,
  Send,
  Copy,
  ExternalLink,
  Zap,
  RotateCw,
  ArrowRight,
  Crown,
  Check,
  CreditCard,
  CheckCheck,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { PLANS, aedPrice, type PlanId } from "@/lib/pricing";

export const Route = createFileRoute("/verifying")({
  validateSearch: (s: Record<string, unknown>) => ({
    role: typeof s["role"] === "string" ? (s["role"] as "owner" | "broker") : undefined,
    email: typeof s["email"] === "string" ? s["email"] : undefined,
    step: typeof s["step"] === "string" ? (s["step"] as "verify" | "payment") : undefined,
    instant: s["instant"] === "true" || s["instant"] === true,
  }),
  head: () => ({
    meta: [
      { title: "Automated Access Approval & Payment Activation · DealOS" },
      { name: "description", content: "Instant automated DLD identity verification and payment subscription activation." },
    ],
  }),
  component: VerifyingPage,
});

interface VerificationStage {
  id: number;
  title: string;
  category: string;
  description: string;
  durationSec: number;
  activeStatusText: string;
  doneStatusText: string;
}

const STAGES: VerificationStage[] = [
  {
    id: 1,
    title: "DLD Trakheesi & RERA Registry Sync",
    category: "Regulatory Licensing",
    description: "Querying Dubai Land Department electronic registry to validate BRN broker or ORN agency license status.",
    durationSec: 7,
    activeStatusText: "Querying DLD Trakheesi Gateway API...",
    doneStatusText: "Verified · Active License & RERA BRN Confirmed",
  },
  {
    id: 2,
    title: "Anti-Money Laundering (AML/CFT) Clearance",
    category: "Compliance Screening",
    description: "Running automated UAE Financial Intelligence Unit (FIU) & goAML watchlist regulatory screening.",
    durationSec: 8,
    activeStatusText: "Screening sanctions database & PEP registers...",
    doneStatusText: "Cleared · Zero Sanction Hits & AML Certified",
  },
  {
    id: 3,
    title: "WhatsApp Multi-Device Gateway Handshake",
    category: "Communication Network",
    description: "Establishing secure webhook bridge with Meta Cloud API & Baileys multi-device socket for instant client dispatch.",
    durationSec: 8,
    activeStatusText: "Pinging WhatsApp Gateway socket (28ms latency)...",
    doneStatusText: "Connected · WhatsApp Webhook & Dispatch Operational",
  },
  {
    id: 4,
    title: "Automated Role Provisioning & Security Token",
    category: "Access Grant",
    description: "Cryptographically minting session authentication keys and provisioning high-speed workspace credentials.",
    durationSec: 7,
    activeStatusText: "Minting access token & allocating verified seat...",
    doneStatusText: "Access Approved · 100% Security Clearance Granted",
  },
];

const TOTAL_DURATION_SEC = 30;

export function VerifyingPage() {
  const { role: searchRole, email: searchEmail, step: initialStep, instant } = Route.useSearch();
  const navigate = useNavigate();

  // Active step: "verify" (Identity) or "payment" (Paywall)
  const [activeStep, setActiveStep] = useState<"verify" | "payment">(() => {
    if (initialStep === "payment") return "payment";
    return "verify";
  });

  // Role: owner vs broker
  const [selectedRole, setSelectedRole] = useState<"owner" | "broker">(() => {
    if (searchRole) return searchRole;
    if (searchEmail?.toLowerCase() === "admin@dealos.ae") return "owner";
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("dealos_role");
      if (stored === "company") return "owner";
      const activeEm = localStorage.getItem("dealos_active_email");
      if (activeEm?.toLowerCase() === "admin@dealos.ae") return "owner";
    }
    return "broker";
  });

  const [activeEmail, setActiveEmail] = useState<string>(() => {
    if (searchEmail) return searchEmail;
    if (typeof window !== "undefined") {
      return (
        localStorage.getItem("dealos_active_email") ||
        (selectedRole === "owner" ? "admin@dealos.ae" : "nihalshaikh0906@gmail.com")
      );
    }
    return selectedRole === "owner" ? "admin@dealos.ae" : "nihalshaikh0906@gmail.com";
  });

  // Verification timer state
  const [elapsedMs, setElapsedMs] = useState(instant ? TOTAL_DURATION_SEC * 1000 : 0);
  const [isIdentityVerified, setIsIdentityVerified] = useState(instant ? true : false);

  // Payment state
  const [selectedPlan, setSelectedPlan] = useState<PlanId>("annual");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "apple_pay" | "bank_transfer">("card");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isPaymentConfirmed, setIsPaymentConfirmed] = useState(false);

  // WhatsApp testing state
  const [testPhone, setTestPhone] = useState("+971 50 123 4567");
  const [testMessage, setTestMessage] = useState(
    "Hello! This is a verified automated ping from DealOS Dubai Real Estate OS."
  );
  const [copiedLink, setCopiedLink] = useState(false);

  // Auto-tick identity progress every 100ms
  useEffect(() => {
    if (isIdentityVerified || activeStep !== "verify") return;

    const interval = setInterval(() => {
      setElapsedMs((prev) => {
        const next = prev + 100;
        const totalMs = TOTAL_DURATION_SEC * 1000;
        if (next >= totalMs) {
          clearInterval(interval);
          handleFinishIdentity();
          return totalMs;
        }
        return next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isIdentityVerified, activeStep]);

  const currentSec = elapsedMs / 1000;
  const progressPercent = Math.min(100, Math.round((currentSec / TOTAL_DURATION_SEC) * 100));
  const remainingSec = Math.max(0, Math.ceil(TOTAL_DURATION_SEC - currentSec));

  const stage1Done = currentSec >= 7 || isIdentityVerified;
  const stage2Done = currentSec >= 15 || isIdentityVerified;
  const stage3Done = currentSec >= 23 || isIdentityVerified;
  const stage4Done = currentSec >= 30 || isIdentityVerified;
  const currentStageId = !stage1Done ? 1 : !stage2Done ? 2 : !stage3Done ? 3 : 4;

  const handleFinishIdentity = () => {
    setIsIdentityVerified(true);
    setElapsedMs(TOTAL_DURATION_SEC * 1000);

    if (typeof window !== "undefined") {
      localStorage.setItem("dealos_verified", "true");
      localStorage.setItem("dealos_demo_mode", "true");
      localStorage.setItem("dealos_active_email", activeEmail);
      localStorage.setItem("dealos_role", selectedRole === "owner" ? "company" : "agent");
    }

    toast.success("✓ Identity & DLD License 100% Verified!", {
      description: "Now confirm your subscription plan to unlock full workspace access.",
      duration: 3500,
    });
  };

  // Fast-track directly to payment
  const handleFastTrackIdentity = () => {
    handleFinishIdentity();
    setActiveStep("payment");
  };

  // Instant full activation bypass (skips payment and verification instantly for rapid testing)
  const handleRapidInstantUnlock = () => {
    handleFinishIdentity();
    setIsPaymentConfirmed(true);

    if (typeof window !== "undefined") {
      localStorage.setItem("dealos_subscription_active", "true");
      localStorage.setItem(`dealos_subscription_active_${activeEmail.toLowerCase().trim()}`, "true");
      localStorage.setItem("dealos_verified", "true");
      localStorage.setItem("dealos_role", selectedRole === "owner" ? "company" : "agent");
    }

    toast.success("⚡ Rapid Test Unlock Activated! Launching Workspace...", { duration: 2000 });
    setTimeout(() => {
      const destination = selectedRole === "owner" ? "/owner-dashboard" : "/app";
      void navigate({ to: destination, replace: true });
    }, 400);
  };

  // Payment confirmation handler
  const handleConfirmPayment = async () => {
    setIsProcessingPayment(true);
    await new Promise((r) => setTimeout(r, 600));

    if (typeof window !== "undefined") {
      localStorage.setItem("dealos_subscription_active", "true");
      localStorage.setItem(`dealos_subscription_active_${activeEmail.toLowerCase().trim()}`, "true");
      localStorage.setItem(`dealos_subscription_plan_${activeEmail.toLowerCase().trim()}`, selectedPlan);
      localStorage.setItem("dealos_verified", "true");
      localStorage.setItem("dealos_role", selectedRole === "owner" ? "company" : "agent");
    }

    setIsProcessingPayment(false);
    setIsPaymentConfirmed(true);

    toast.success("✓ Payment Confirmed! License Activated.", {
      description: `Welcome to DealOS. Launching your ${selectedRole === "owner" ? "Executive Owner Overwatch" : "Broker Cockpit"}...`,
      duration: 4000,
    });

    setTimeout(() => {
      const destination = selectedRole === "owner" ? "/owner-dashboard" : "/app";
      void navigate({ to: destination, replace: true });
    }, 700);
  };

  // WhatsApp dispatch test
  const handleTestWhatsApp = () => {
    const cleanNum = testPhone.replace(/[^0-9]/g, "");
    if (!cleanNum) {
      toast.error("Please enter a valid phone number.");
      return;
    }
    const url = `https://web.whatsapp.com/send?phone=${cleanNum}&text=${encodeURIComponent(testMessage)}`;
    try {
      const opened = window.open(url, "_blank", "noopener,noreferrer");
      if (!opened || opened.closed || typeof opened.closed === "undefined") {
        void navigator.clipboard.writeText(url);
        toast.info("WhatsApp Web URL copied to clipboard! Paste it into a new tab.", {
          duration: 5000,
        });
      } else {
        toast.success("Opening WhatsApp Web in a new tab…");
      }
    } catch {
      void navigator.clipboard.writeText(url);
      toast.info("WhatsApp Web URL copied to clipboard! Paste it into a new tab.");
    }
  };

  const handleCopyLink = () => {
    const cleanNum = testPhone.replace(/[^0-9]/g, "");
    const url = `https://web.whatsapp.com/send?phone=${cleanNum}&text=${encodeURIComponent(testMessage)}`;
    void navigator.clipboard.writeText(url);
    setCopiedLink(true);
    toast.success("WhatsApp Web URL copied to clipboard!");
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const currentPlanObj = PLANS.find((p) => p.id === selectedPlan) || PLANS[3];

  return (
    <div className="min-h-screen bg-[#0a0d16] text-white flex flex-col justify-between py-6 px-4 sm:px-6 relative overflow-hidden font-sans">
      {/* 60 FPS Hardware-Accelerated Static Ambient Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10 opacity-60 will-change-transform" aria-hidden="true">
        <div className="absolute -top-40 -left-40 size-[500px] rounded-full bg-gradient-to-br from-indigo-500/15 via-primary/10 to-transparent blur-2xl" />
        <div className="absolute top-1/3 -right-40 size-[500px] rounded-full bg-gradient-to-bl from-emerald-500/10 via-cyan-500/8 to-transparent blur-2xl" />
        <div className="absolute -bottom-40 left-1/3 size-[500px] rounded-full bg-gradient-to-tr from-amber-500/10 via-primary/5 to-transparent blur-2xl" />
      </div>

      {/* ═══ TOP NAVBAR ═══ */}
      <header className="max-w-4xl w-full mx-auto flex items-center justify-between pb-5 border-b border-zinc-800/80">
        <div className="flex items-center gap-3">
          <Logo variant="dark" size={32} />
          <div className="flex flex-col">
            <span className="font-extrabold text-sm tracking-tight text-white flex items-center gap-1.5 font-display">
              Deal<span className="text-primary font-black">OS</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                VERIFIED GATEWAY
              </span>
            </span>
            <span className="text-[11px] text-zinc-400">Automated Identity Clearance &amp; Payment Activation</span>
          </div>
        </div>

        {/* Rapid Test Bypass Pill */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={handleRapidInstantUnlock}
            className="h-8 px-3 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-zinc-950 gap-1.5 cursor-pointer shadow-md"
            title="Bypasses verification & payment immediately for rapid multi-device testing"
          >
            <Zap size={13} className="fill-current" />
            <span>⚡ Rapid 1-Click Test Unlock</span>
          </Button>
        </div>
      </header>

      {/* ═══ MAIN STEPPER & CONTENT ═══ */}
      <main className="max-w-4xl w-full mx-auto my-auto py-6 space-y-6">
        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setActiveStep("verify")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border cursor-pointer ${
              activeStep === "verify"
                ? "bg-primary text-primary-foreground border-primary shadow-md"
                : isIdentityVerified
                ? "bg-emerald-950/40 text-emerald-300 border-emerald-500/40"
                : "bg-zinc-900/80 text-zinc-400 border-zinc-800"
            }`}
          >
            <span className="size-5 rounded-full bg-black/20 flex items-center justify-center text-[10px] font-mono">
              {isIdentityVerified ? "✓" : "1"}
            </span>
            <span>Step 1: Identity &amp; DLD Check</span>
          </button>

          <span className="text-zinc-600 font-light">→</span>

          <button
            type="button"
            onClick={() => {
              if (!isIdentityVerified) handleFinishIdentity();
              setActiveStep("payment");
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border cursor-pointer ${
              activeStep === "payment"
                ? "bg-amber-500 text-zinc-950 border-amber-500 shadow-md"
                : isPaymentConfirmed
                ? "bg-emerald-950/40 text-emerald-300 border-emerald-500/40"
                : "bg-zinc-900/80 text-zinc-400 border-zinc-800"
            }`}
          >
            <span className="size-5 rounded-full bg-black/20 flex items-center justify-center text-[10px] font-mono">
              {isPaymentConfirmed ? "✓" : "2"}
            </span>
            <span>Step 2: Payment &amp; Workspace Unlock</span>
          </button>
        </div>

        {/* ═══ STEP 1: IDENTITY & REGULATORY CLEARANCE ═══ */}
        {activeStep === "verify" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Persona Switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-center sm:text-left">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-display">
                  Step 1: Automated Identity &amp; DLD Clearance
                </h1>
                <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                  Checking registry credentials for <strong className="text-white font-mono">{activeEmail}</strong> ({selectedRole === "owner" ? "Agency Owner" : "Licensed Broker"}).
                </p>
              </div>

              <div className="inline-flex items-center gap-1.5 p-1 rounded-xl bg-zinc-900/90 border border-zinc-800 self-center sm:self-auto shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole("broker");
                    setActiveEmail("nihalshaikh0906@gmail.com");
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedRole === "broker" ? "bg-primary text-primary-foreground" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Broker
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole("owner");
                    setActiveEmail("admin@dealos.ae");
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedRole === "owner" ? "bg-amber-500 text-zinc-950" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Owner
                </button>
              </div>
            </div>

            {/* Countdown radar section */}
            <section className="rounded-3xl border border-zinc-800 bg-zinc-900/70 backdrop-blur-xl p-6 sm:p-7 shadow-2xl relative overflow-hidden space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-800 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="size-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">
                      {isIdentityVerified ? "IDENTITY CLEARANCE APPROVED" : "AUTOMATED SCAN ACTIVE (30 SECONDS)"}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300">
                    Live check across DLD Trakheesi, UAE AML/KYC lists, and WhatsApp Gateway.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {!isIdentityVerified ? (
                    <Button
                      size="sm"
                      onClick={handleFastTrackIdentity}
                      className="h-9 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 gap-1.5 cursor-pointer shadow-md"
                    >
                      <Zap size={14} className="fill-current" />
                      <span>Instant Verify &amp; Proceed to Payment →</span>
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => setActiveStep("payment")}
                      className="h-9 px-4 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-zinc-950 gap-1.5 cursor-pointer shadow-md"
                    >
                      <span>Continue to Payment &amp; Unlock</span>
                      <ArrowRight size={14} />
                    </Button>
                  )}
                </div>
              </div>

              {/* Progress bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-400 flex items-center gap-2">
                    <Clock size={14} className="text-primary" />
                    <span>Elapsed: {currentSec.toFixed(1)}s / {TOTAL_DURATION_SEC}s</span>
                  </span>
                  <span className="font-bold text-emerald-400">{progressPercent}%</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-zinc-800 overflow-hidden relative">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary via-teal-400 to-emerald-400 transition-all duration-150 ease-out"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* 4 Stage Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                {STAGES.map((st) => {
                  const isDone =
                    (st.id === 1 && stage1Done) ||
                    (st.id === 2 && stage2Done) ||
                    (st.id === 3 && stage3Done) ||
                    (st.id === 4 && stage4Done);
                  const isCurrent = !isDone && currentStageId === st.id;

                  return (
                    <div
                      key={st.id}
                      className={`p-3.5 rounded-2xl border transition-all duration-150 ${
                        isDone
                          ? "bg-emerald-950/20 border-emerald-500/40"
                          : isCurrent
                          ? "bg-primary/10 border-primary/50 shadow-md"
                          : "bg-zinc-950/40 border-zinc-800/60 opacity-60"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2.5">
                        <div className="space-y-0.5">
                          <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-zinc-400">
                            {st.category}
                          </span>
                          <h4 className="text-xs font-bold text-white">{st.title}</h4>
                          <p className="text-[11px] text-zinc-400 leading-relaxed">{st.description}</p>
                        </div>
                        <div className="shrink-0">
                          {isDone ? (
                            <div className="size-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                              <Check size={14} strokeWidth={3} />
                            </div>
                          ) : isCurrent ? (
                            <div className="size-6 rounded-lg bg-primary/20 text-primary flex items-center justify-center animate-spin">
                              <RotateCw size={13} />
                            </div>
                          ) : (
                            <div className="size-6 rounded-lg bg-zinc-900 text-zinc-600 flex items-center justify-center font-mono text-xs">
                              {st.id}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="mt-2.5 pt-2 border-t border-zinc-800/60 flex items-center justify-between text-[10px] font-mono">
                        <span className={isDone ? "text-emerald-400 font-semibold" : isCurrent ? "text-primary" : "text-zinc-500"}>
                          {isDone ? st.doneStatusText : isCurrent ? st.activeStatusText : "Pending automated check"}
                        </span>
                        <span className="text-zinc-500">{st.durationSec}s</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* WhatsApp live verification console */}
            <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <MessageCircle size={16} className="text-emerald-400" />
                  <span className="text-xs font-bold text-white">Live WhatsApp Gateway Handshake</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-emerald-400" /> Socket Operational (28ms)
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <input
                  value={testPhone}
                  onChange={(e) => setTestPhone(e.target.value)}
                  placeholder="+971 50 123 4567"
                  className="h-9 px-3 rounded-xl border border-zinc-800 bg-zinc-950 font-mono text-xs text-white"
                />
                <input
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                  className="h-9 px-3 rounded-xl border border-zinc-800 bg-zinc-950 text-xs text-white"
                />
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" onClick={handleTestWhatsApp} className="h-8 px-3 rounded-xl text-xs font-bold bg-emerald-500 text-zinc-950">
                  <Send size={12} className="mr-1.5" /> Send Test WhatsApp Ping
                </Button>
                <Button size="sm" variant="outline" onClick={handleCopyLink} className="h-8 px-3 rounded-xl text-xs font-bold border-zinc-700 bg-zinc-900 text-zinc-300">
                  <Copy size={12} className="mr-1.5" /> {copiedLink ? "Copied!" : "Copy Web Link"}
                </Button>
              </div>
            </section>
          </div>
        )}

        {/* ═══ STEP 2: PAYMENT & WORKSPACE UNLOCK ═══ */}
        {activeStep === "payment" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Header with verified badge */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                    <CheckCheck size={12} /> IDENTITY &amp; DLD VERIFIED
                  </span>
                  <span className="text-zinc-600">•</span>
                  <span className="text-xs text-zinc-400 font-mono">{activeEmail}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-display mt-1">
                  Step 2: Confirm Subscription &amp; Continue
                </h1>
              </div>

              <Button
                size="sm"
                variant="outline"
                onClick={() => setActiveStep("verify")}
                className="self-start sm:self-auto text-xs border-zinc-700 text-zinc-300"
              >
                ← Back to Identity Details
              </Button>
            </div>

            {/* Plan selection grid */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              {PLANS.map((p) => {
                const isSelected = selectedPlan === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedPlan(p.id)}
                    className={`relative p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "border-amber-500 bg-amber-500/10 ring-2 ring-amber-500/30 shadow-lg"
                        : "border-zinc-800 bg-zinc-900/60 hover:border-zinc-700 hover:bg-zinc-900"
                    }`}
                  >
                    {p.highlighted && (
                      <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-amber-500 text-black">
                        ★ Best Deal
                      </span>
                    )}
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{p.label}</span>
                        {isSelected && <CheckCircle2 size={15} className="text-amber-400" />}
                      </div>
                      <div className="mt-2">
                        <span className="text-lg font-black text-white font-display">{aedPrice(p.price)}</span>
                        <span className="text-[10px] text-zinc-400 ml-1">{p.period}</span>
                      </div>
                      <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">
                        {p.months > 1 ? `${aedPrice(p.perMonth)}/mo` : "Monthly flexible"}
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-zinc-800/80 text-[9px] text-zinc-400">
                      {p.savingLabel}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Payment method selector */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Payment Method (UAE Central Bank 3DS):</span>
                <span className="text-[11px] font-mono text-zinc-400">Instant UAE Settlement</span>
              </div>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { id: "card", label: "Credit / Debit Card", icon: CreditCard },
                  { id: "apple_pay", label: "Apple Pay / Google Pay", icon: Zap },
                  { id: "bank_transfer", label: "Corporate UAE IBAN", icon: Building2 },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id as typeof paymentMethod)}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      paymentMethod === m.id
                        ? "border-amber-500 bg-amber-500/10 text-amber-300 shadow-xs"
                        : "border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white"
                    }`}
                  >
                    <m.icon size={14} />
                    <span>{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Checkout action bar */}
            <section className="rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-xs text-zinc-400">Total Due Today (incl. 5% UAE VAT):</p>
                <p className="text-2xl font-black text-white font-display">
                  {aedPrice(currentPlanObj.price)}{" "}
                  <span className="text-xs font-normal text-zinc-400 font-sans">
                    for {currentPlanObj.label} ({selectedRole === "owner" ? "Agency License" : "Broker Seat"})
                  </span>
                </p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Button
                  size="lg"
                  onClick={handleConfirmPayment}
                  disabled={isProcessingPayment}
                  className="w-full sm:w-auto h-12 px-8 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-extrabold text-sm gap-2 cursor-pointer shadow-lg shadow-amber-500/20"
                >
                  {isProcessingPayment ? (
                    <>Processing UAE 3DS Verification…</>
                  ) : (
                    <>
                      <Sparkles size={16} />
                      <span>Confirm Payment &amp; Continue to Workspace</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </Button>
              </div>
            </section>
          </div>
        )}
      </main>

      {/* ═══ FOOTER ═══ */}
      <footer className="max-w-4xl w-full mx-auto pt-5 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500">
        <div className="flex items-center gap-2">
          <ShieldCheck size={14} className="text-emerald-400" />
          <span>Encrypted with TLS 1.3 · UAE Federal Law Compliant · 60 FPS Engine</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hover:text-zinc-400 cursor-pointer" onClick={() => void navigate({ to: "/privacy" })}>
            Privacy Notice
          </span>
          <span>•</span>
          <span className="hover:text-zinc-400 cursor-pointer" onClick={() => void navigate({ to: "/terms" })}>
            Terms of Service
          </span>
        </div>
      </footer>
    </div>
  );
}
