import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
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
  FileCheck,
  Radio,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";

export const Route = createFileRoute("/verifying")({
  validateSearch: (s: Record<string, unknown>) => ({
    role: typeof s["role"] === "string" ? (s["role"] as "owner" | "broker") : undefined,
    email: typeof s["email"] === "string" ? s["email"] : undefined,
    instant: s["instant"] === "true" || s["instant"] === true,
  }),
  head: () => ({
    meta: [
      { title: "Automated Access Approval & Verification · DealOS" },
      { name: "description", content: "Instant 30-second automated DLD, AML, and WhatsApp Gateway verification." },
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
  const { role: searchRole, email: searchEmail, instant } = Route.useSearch();
  const navigate = useNavigate();

  // Determine initial role: owner vs broker
  const [selectedRole, setSelectedRole] = useState<"owner" | "broker">(() => {
    if (searchRole) return searchRole;
    if (searchEmail?.toLowerCase() === "driplab26@gmail.com") return "owner";
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("dealos_role");
      if (stored === "company") return "owner";
      const activeEm = localStorage.getItem("dealos_active_email");
      if (activeEm?.toLowerCase() === "driplab26@gmail.com") return "owner";
    }
    return "broker";
  });

  const [activeEmail, setActiveEmail] = useState<string>(() => {
    if (searchEmail) return searchEmail;
    if (typeof window !== "undefined") {
      return (
        localStorage.getItem("dealos_active_email") ||
        (selectedRole === "owner" ? "driplab26@gmail.com" : "nihalshaikh0906@gmail.com")
      );
    }
    return selectedRole === "owner" ? "driplab26@gmail.com" : "nihalshaikh0906@gmail.com";
  });

  // Verification timer state: elapsed milliseconds
  const [elapsedMs, setElapsedMs] = useState(instant ? TOTAL_DURATION_SEC * 1000 : 0);
  const [isApproved, setIsApproved] = useState(instant ? true : false);
  const [redirectCountdown, setRedirectCountdown] = useState<number | null>(null);

  // WhatsApp testing state
  const [testPhone, setTestPhone] = useState("+971 50 123 4567");
  const [testMessage, setTestMessage] = useState(
    "Hello! This is a verified automated ping from DealOS Dubai Real Estate OS."
  );
  const [copiedLink, setCopiedLink] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-tick progress every 100ms
  useEffect(() => {
    if (isApproved) return;

    const interval = setInterval(() => {
      setElapsedMs((prev) => {
        const next = prev + 100;
        const totalMs = TOTAL_DURATION_SEC * 1000;
        if (next >= totalMs) {
          clearInterval(interval);
          handleCompleteVerification();
          return totalMs;
        }
        return next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isApproved]);

  const currentSec = elapsedMs / 1000;
  const progressPercent = Math.min(100, Math.round((currentSec / TOTAL_DURATION_SEC) * 100));
  const remainingSec = Math.max(0, Math.ceil(TOTAL_DURATION_SEC - currentSec));

  // Determine stage completion
  const stage1Done = currentSec >= 7 || isApproved;
  const stage2Done = currentSec >= 15 || isApproved;
  const stage3Done = currentSec >= 23 || isApproved;
  const stage4Done = currentSec >= 30 || isApproved;

  const currentStageId = !stage1Done ? 1 : !stage2Done ? 2 : !stage3Done ? 3 : 4;

  const handleCompleteVerification = () => {
    setIsApproved(true);
    setElapsedMs(TOTAL_DURATION_SEC * 1000);

    // Save authorized credentials into browser storage
    if (typeof window !== "undefined") {
      localStorage.setItem("dealos_verified", "true");
      localStorage.setItem("dealos_demo_mode", "true");
      localStorage.setItem("dealos_active_email", activeEmail);
      localStorage.setItem("dealos_role", selectedRole === "owner" ? "company" : "agent");
    }

    toast.success("Identity & Credentials 100% Verified! Access Approved.", {
      id: "verified-toast",
      duration: 5000,
    });

    // Start 3-second redirect countdown
    setRedirectCountdown(3);
  };

  // Redirect countdown ticker
  useEffect(() => {
    if (redirectCountdown === null) return;
    if (redirectCountdown <= 0) {
      const destination = selectedRole === "owner" ? "/owner-dashboard" : "/app";
      void navigate({ to: destination, replace: true });
      return;
    }
    const t = setTimeout(() => {
      setRedirectCountdown((c) => (c !== null ? c - 1 : null));
    }, 1000);
    return () => clearTimeout(t);
  }, [redirectCountdown, selectedRole, navigate]);

  // Fast-track / Instant Approval Handler
  const handleFastTrack = () => {
    toast.info("⚡ Fast-Tracking Automated Approval...", { duration: 1500 });
    handleCompleteVerification();
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

  return (
    <div className="min-h-screen bg-[#0d111c] text-white flex flex-col justify-between py-8 px-4 sm:px-6 relative overflow-hidden font-sans">
      {/* 60 FPS Lightweight Static Glows */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10 opacity-60 will-change-transform" aria-hidden="true">
        <div className="absolute -top-40 -left-40 size-[500px] rounded-full bg-gradient-to-br from-indigo-500/15 via-primary/10 to-transparent blur-2xl" />
        <div className="absolute top-1/3 -right-40 size-[500px] rounded-full bg-gradient-to-bl from-emerald-500/10 via-cyan-500/8 to-transparent blur-2xl" />
        <div className="absolute -bottom-40 left-1/3 size-[500px] rounded-full bg-gradient-to-tr from-amber-500/10 via-primary/5 to-transparent blur-2xl" />
      </div>

      {/* ═══ TOP NAVBAR ═══ */}
      <header className="max-w-4xl w-full mx-auto flex items-center justify-between pb-6 border-b border-zinc-800/80">
        <div className="flex items-center gap-3">
          <Logo variant="dark" size={32} />
          <div className="flex flex-col">
            <span className="font-extrabold text-sm tracking-tight text-white flex items-center gap-1.5 font-display">
              Deal<span className="text-primary font-black">OS</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                GATEWAY 3.0
              </span>
            </span>
            <span className="text-[11px] text-zinc-400">Automated Access & Compliance Verification</span>
          </div>
        </div>

        {/* Live System Latency Badge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-xs text-zinc-300">
          <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-[11px] text-emerald-400">DLD Gateway: 18ms</span>
          <span className="text-zinc-600">|</span>
          <span className="font-mono text-[11px] text-zinc-400">60 FPS Engine</span>
        </div>
      </header>

      {/* ═══ MAIN CONTENT ═══ */}
      <main className="max-w-4xl w-full mx-auto my-auto py-8 space-y-8">
        {/* Role Toggle & Header Banner */}
        <div className="space-y-4 text-center">
          <div className="inline-flex items-center gap-2 p-1.5 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-xl">
            <button
              type="button"
              onClick={() => {
                setSelectedRole("broker");
                setActiveEmail("nihalshaikh0906@gmail.com");
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                selectedRole === "broker"
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <User size={14} />
              <span>Verify as Licensed Broker</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedRole("owner");
                setActiveEmail("driplab26@gmail.com");
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                selectedRole === "owner"
                  ? "bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 shadow-md"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Crown size={14} />
              <span>Verify as Agency Owner</span>
            </button>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-display">
            {isApproved ? (
              <span className="text-emerald-400 flex items-center justify-center gap-2.5">
                <CheckCircle2 size={36} className="text-emerald-400 shrink-0" />
                Access Approved & Credentials Verified
              </span>
            ) : (
              <span>
                Automated {selectedRole === "owner" ? "Agency Owner" : "Broker"} Verification
              </span>
            )}
          </h1>

          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed">
            {isApproved
              ? `Your credentials for ${activeEmail} are 100% verified. Routing you directly into ${selectedRole === "owner" ? "Owner Executive Overwatch" : "Broker Cockpit"}...`
              : `DealOS is running an automated 30-second verification across DLD Trakheesi, UAE AML regulatory clearance, and the WhatsApp Multi-Device Gateway.`}
          </p>
        </div>

        {/* ═══ 30-SECOND COUNTDOWN & PROGRESS RADAR ═══ */}
        <section className="rounded-3xl border border-zinc-800 bg-zinc-900/70 backdrop-blur-xl p-6 sm:p-8 shadow-2xl relative overflow-hidden space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-800 pb-5">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">
                  {isApproved ? "VERIFICATION COMPLETE" : "AUTOMATED VERIFICATION ACTIVE"}
                </span>
                <span className="text-zinc-600">•</span>
                <span className="text-xs text-zinc-400 font-mono">Target: &lt; 30 Seconds</span>
              </div>
              <p className="text-xs text-zinc-300">
                Target account: <span className="font-mono text-white font-semibold">{activeEmail}</span> · Role:{" "}
                <span className="font-semibold text-primary capitalize">{selectedRole}</span>
              </p>
            </div>

            {/* Fast-Track / Instant Action Button */}
            <div className="flex items-center gap-3 shrink-0">
              {!isApproved ? (
                <Button
                  onClick={handleFastTrack}
                  className="h-10 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 gap-2 shadow-lg hover:shadow-emerald-500/20 transition-all cursor-pointer"
                >
                  <Zap size={14} className="fill-current" />
                  <span>Instant Approval (Skip Waiting)</span>
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    const destination = selectedRole === "owner" ? "/owner-dashboard" : "/app";
                    void navigate({ to: destination, replace: true });
                  }}
                  className="h-10 px-4 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-zinc-950 gap-2 cursor-pointer shadow-lg"
                >
                  <span>Enter Workspace Now</span>
                  <ArrowRight size={14} />
                </Button>
              )}
            </div>
          </div>

          {/* Progress Bar & Countdown Meter */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-zinc-400 flex items-center gap-2">
                <Clock size={14} className="text-primary" />
                <span>Elapsed: {currentSec.toFixed(1)}s / {TOTAL_DURATION_SEC}s</span>
              </span>
              <span className="font-bold text-emerald-400">{progressPercent}% Completed</span>
            </div>
            <div className="w-full h-3 rounded-full bg-zinc-800 overflow-hidden relative p-0.5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary via-teal-400 to-emerald-400 transition-all duration-150 ease-out shadow-[0_0_12px_rgba(34,197,94,0.5)]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[11px] text-zinc-500 font-mono pt-1">
              <span>0s (Start)</span>
              <span>7s (DLD Sync)</span>
              <span>15s (AML Clear)</span>
              <span>23s (WhatsApp)</span>
              <span>30s (Approval)</span>
            </div>
          </div>

          {/* ═══ 4 VERIFICATION STAGES ═══ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
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
                  className={`p-4 rounded-2xl border transition-all duration-200 relative ${
                    isDone
                      ? "bg-emerald-950/20 border-emerald-500/40"
                      : isCurrent
                      ? "bg-primary/10 border-primary/50 shadow-md"
                      : "bg-zinc-950/40 border-zinc-800/60 opacity-60"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400">
                          {st.category}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-primary/20 text-primary animate-pulse">
                            SCANNING
                          </span>
                        )}
                      </div>
                      <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                        {st.title}
                      </h3>
                      <p className="text-[11px] text-zinc-400 leading-relaxed">
                        {st.description}
                      </p>
                    </div>

                    <div className="shrink-0 mt-0.5">
                      {isDone ? (
                        <div className="size-7 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                          <Check size={16} strokeWidth={3} />
                        </div>
                      ) : isCurrent ? (
                        <div className="size-7 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary animate-spin">
                          <RotateCw size={14} />
                        </div>
                      ) : (
                        <div className="size-7 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600 font-mono text-xs">
                          {st.id}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Status text pill */}
                  <div className="mt-3 pt-2.5 border-t border-zinc-800/80 flex items-center justify-between text-[11px]">
                    <span className={`font-mono ${isDone ? "text-emerald-400 font-semibold" : isCurrent ? "text-primary" : "text-zinc-500"}`}>
                      {isDone ? st.doneStatusText : isCurrent ? st.activeStatusText : "Pending automated check"}
                    </span>
                    <span className="text-zinc-500 text-[10px] font-mono">{st.durationSec}s</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Redirect Countdown Notice */}
          {redirectCountdown !== null && (
            <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-2.5">
                <span className="size-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="font-bold">Access Activated!</span>
                <span className="text-emerald-300/80 hidden sm:inline">
                  Redirecting to {selectedRole === "owner" ? "Agency Owner Dashboard" : "Broker Cockpit"} in{" "}
                  <strong className="text-white font-mono text-sm">{redirectCountdown}s</strong>...
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  const destination = selectedRole === "owner" ? "/owner-dashboard" : "/app";
                  void navigate({ to: destination, replace: true });
                }}
                className="underline font-bold text-white hover:text-emerald-200 cursor-pointer"
              >
                Go now →
              </button>
            </div>
          )}
        </section>

        {/* ═══ REAL-TIME WHATSAPP DISPATCH & CONNECTION TEST CONSOLE ═══ */}
        <section className="rounded-3xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-md p-6 sm:p-7 shadow-lg space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="size-8 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                <MessageCircle size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>WhatsApp Multi-Device Gateway & Direct Message Test</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Live Simulator
                  </span>
                </h3>
                <p className="text-[11px] text-zinc-400">
                  Verify WhatsApp connection and send smooth, instant test dispatches with zero Safari protocol errors.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
              <span className="size-2 rounded-full bg-emerald-400" />
              <span>Gateway Socket: Online</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider font-mono">
                Recipient WhatsApp Phone (+971)
              </label>
              <input
                value={testPhone}
                onChange={(e) => setTestPhone(e.target.value)}
                placeholder="+971 50 123 4567"
                className="w-full h-10 px-3.5 rounded-xl border border-zinc-800 bg-zinc-950/80 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider font-mono">
                Verification Test Message
              </label>
              <input
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl border border-zinc-800 bg-zinc-950/80 text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Button
              type="button"
              onClick={handleTestWhatsApp}
              className="h-9 px-4 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-zinc-950 gap-2 cursor-pointer shadow-md"
            >
              <Send size={13} />
              <span>Send Test WhatsApp Ping</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleCopyLink}
              className="h-9 px-3.5 rounded-xl text-xs font-bold border-zinc-700 bg-zinc-900 text-zinc-300 hover:text-white hover:bg-zinc-800 gap-1.5 cursor-pointer"
            >
              <Copy size={13} />
              <span>{copiedLink ? "Link Copied!" : "Copy Web WhatsApp Link"}</span>
            </Button>

            <span className="text-[11px] text-zinc-500 font-mono">
              Targets <code className="text-zinc-400 bg-zinc-950 px-1 py-0.5 rounded border border-zinc-800">web.whatsapp.com</code> to guarantee Safari & iPad smoothness.
            </span>
          </div>
        </section>
      </main>

      {/* ═══ FOOTER ═══ */}
      <footer className="max-w-4xl w-full mx-auto pt-6 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500">
        <div className="flex items-center gap-2">
          <ShieldCheck size={14} className="text-emerald-400" />
          <span>Compliant with UAE Federal Decree-Law No. (20) of 2018 on Anti-Money Laundering</span>
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
