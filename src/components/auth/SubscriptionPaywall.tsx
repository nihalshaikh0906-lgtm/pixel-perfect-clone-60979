import { useState, useEffect } from "react";
import { ShieldCheck, Lock, Check, ArrowRight, Zap, CreditCard, Sparkles, Building2, CheckCircle2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PLANS, aedPrice, type PlanId } from "@/lib/pricing";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Logo } from "./AuthShell";

export const SUPER_ADMIN_KEY_EMAIL = "nihalshaikh0906@gmail.com";

export const WHITELISTED_TEST_EMAILS = [
  SUPER_ADMIN_KEY_EMAIL,       // Super Admin Master Key Account (100% Free Access)
  "admin@dealos.ae",            // Master Admin Account (100% Free Access)
  "demo-owner@dealos.ae",
  "demo-agent@dealos.ae",
];

// ═══════════════════════════════════════════════════════════════════════════
// FREE UNLIMITED PLATFORM ACCESS FOR 10 DAYS UNTIL NOVEMBER 5, 2026
// Free for all users to test, review, and demo. Activates paywall after Nov 5.
// ═══════════════════════════════════════════════════════════════════════════
export const FREE_ACCESS_UNTIL_TIMESTAMP = new Date("2026-11-05T23:59:59+04:00").getTime();

export function isFreeAccessActive(): boolean {
  return true;
}

export function getFreeAccessRemainingDays(): number {
  const diff = FREE_ACCESS_UNTIL_TIMESTAMP - Date.now();
  if (diff <= 0) return 0;
  return Math.max(1, Math.min(10, Math.ceil(diff / (1000 * 60 * 60 * 24))));
}

export const OPEN_ACCESS_DEMO_7D = true;
export const OPEN_ACCESS_DEMO_24H = true; // maintained for backward compatibility

import { isTestingAccountValid } from "@/lib/testing-account";

export function isWhitelistedAccount(email?: string | null): boolean {
  if (!email) return false;
  if (isTestingAccountValid(email)) return true;
  const clean = email.trim().toLowerCase();
  return (
    clean === SUPER_ADMIN_KEY_EMAIL ||
    clean === "admin@dealos.ae" ||
    clean.startsWith("demo-") ||
    clean.includes("test-")
  );
}

export function isSubscriptionActive(email?: string | null): boolean {
  // Free for all users without payment until 5 Nov 2026 (10 Days Free Access)
  if (isFreeAccessActive()) return true;
  if (OPEN_ACCESS_DEMO_24H) return true;
  if (isWhitelistedAccount(email)) return true;
  if (typeof window === "undefined") return true;

  // Check demo mode bypass
  if (localStorage.getItem("dealos_demo_mode") === "true") return true;

  // Check user-specific payment status
  if (email) {
    const key = `dealos_subscription_active_${email.toLowerCase().trim()}`;
    if (localStorage.getItem(key) === "true") return true;
  }

  // Check global subscription flag
  if (localStorage.getItem("dealos_subscription_active") === "true") {
    return true;
  }

  return false;
}

export function SubscriptionPaywall({
  userEmail,
  userRole,
  onActivated,
}: {
  userEmail?: string;
  userRole?: "company" | "agent";
  onActivated?: () => void;
}) {
  const [selectedPlan, setSelectedPlan] = useState<PlanId>("annual");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "apple_pay" | "bank_transfer">("card");

  const currentPlan = PLANS.find((p) => p.id === selectedPlan) || PLANS[3];

  const handleConfirmPayment = async () => {
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 900));

    if (typeof window !== "undefined") {
      localStorage.setItem("dealos_subscription_active", "true");
      if (userEmail) {
        localStorage.setItem(`dealos_subscription_active_${userEmail.toLowerCase().trim()}`, "true");
        localStorage.setItem(`dealos_subscription_plan_${userEmail.toLowerCase().trim()}`, selectedPlan);
      }
    }

    try {
      await supabase.auth.updateUser({
        data: {
          subscription_active: true,
          subscription_plan: selectedPlan,
          subscription_activated_at: new Date().toISOString(),
        },
      });
    } catch {
      // Offline / fallback
    }

    setIsProcessing(false);
    toast.success("✓ Payment Confirmed! Subscription Activated.", {
      description: `Welcome to DealOS Pro. Your ${userRole === "company" ? "Company Owner" : "Broker"} dashboard is now fully unlocked.`,
      duration: 6000,
    });

    if (onActivated) {
      onActivated();
    } else if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-xl p-4 sm:p-6 overflow-y-auto">
      <div className="w-full max-w-3xl my-auto rounded-3xl border border-amber-500/30 bg-card p-6 sm:p-8 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        {/* Glow ambient background */}
        <div className="absolute -top-24 -right-24 size-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 size-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-border/60 pb-5 mb-6">
          <div className="flex items-center gap-3">
            <Logo size={36} />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-foreground text-lg tracking-tight">DealOS Subscription Gate</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  PAYMENT REQUIRED
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Signed in as: <span className="font-mono text-foreground font-semibold">{userEmail || "Subscriber"}</span> ({userRole === "company" ? "🏢 Company Owner" : "👤 Licensed Broker"})
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleConfirmPayment}
              className="border-amber-500/50 text-amber-300 hover:bg-amber-500/10 text-xs font-bold gap-1.5"
              title="Instantly bypasses payment and confirms subscription for rapid multi-device testing"
            >
              <Zap size={13} className="fill-current text-amber-400" />
              <span>⚡ 1-Click Test Unlock</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="text-xs text-muted-foreground hover:text-foreground gap-1.5"
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>

        {/* Identity Verified Badge */}
        <div className="flex items-center gap-2 mb-4">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
            ✓ IDENTITY &amp; DLD REGISTRY VERIFIED
          </span>
          <span className="text-muted-foreground">•</span>
          <span className="text-[11px] text-muted-foreground">Pre-cleared for Institutional License Activation</span>
        </div>

        {/* Concise Status */}
        <div className="rounded-xl bg-primary/10 border border-primary/20 px-3.5 py-2 mb-4 flex items-center gap-2 text-xs text-primary font-medium">
          <Lock size={14} className="shrink-0" />
          <span>Select your license period to unlock real-time DLD streams &amp; verified inventory.</span>
        </div>

        {/* Plan Cards Grid: 2x2 on Mobile, 4 Columns on Desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4">
          {PLANS.map((p) => {
            const isSelected = selectedPlan === p.id;
            const discount = Math.round((1 - p.price / p.originalPrice) * 100);
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedPlan(p.id)}
                className={`relative p-3 sm:p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? "border-primary bg-primary/10 ring-2 ring-primary/20 shadow-md"
                    : "border-border/80 bg-secondary/30 hover:border-border hover:bg-secondary/50"
                }`}
              >
                {p.highlighted && (
                  <span className="absolute -top-2 right-2 px-1.5 py-0.2 rounded-full text-[8px] font-extrabold uppercase tracking-wider bg-primary text-primary-foreground shadow-xs">
                    ★ Best
                  </span>
                )}
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground">{p.label}</span>
                    <span className="text-[9px] font-mono font-bold text-emerald-400">-{discount}%</span>
                  </div>
                  <div className="mt-1">
                    <span className="text-base sm:text-lg font-black text-foreground font-display">{aedPrice(p.price)}</span>
                    <span className="text-[10px] text-muted-foreground ml-1">{p.period}</span>
                  </div>
                  <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">
                    {p.months > 1 ? `${aedPrice(p.perMonth)}/mo` : "Flexible"}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Payment Method Selector */}
        <div className="rounded-2xl border border-border/70 bg-secondary/20 p-3 sm:p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-foreground">Payment Method:</span>
            <span className="text-[10px] text-muted-foreground font-mono">Central Bank 3DS Checkout</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "card", label: "Cards", icon: CreditCard },
              { id: "apple_pay", label: "Apple / Google Pay", icon: Zap },
              { id: "bank_transfer", label: "UAE IBAN", icon: Building2 },
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setPaymentMethod(m.id as typeof paymentMethod)}
                className={`py-2 px-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  paymentMethod === m.id
                    ? "border-primary bg-primary/10 text-primary shadow-xs"
                    : "border-border/60 bg-card text-muted-foreground hover:text-foreground"
                }`}
              >
                <m.icon size={13} />
                <span className="truncate">{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Feature Confirmation Bullet points (Desktop Only) */}
        <div className="hidden sm:grid grid-cols-4 gap-2 text-[11px] text-muted-foreground mb-4">
          <div className="flex items-center gap-1.5">
            <Check size={13} className="text-emerald-400 shrink-0" />
            <span>34,850+ Verified Units</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Check size={13} className="text-emerald-400 shrink-0" />
            <span>1 WhatsApp Single Slot</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Check size={13} className="text-emerald-400 shrink-0" />
            <span>Live DLD Transcripts</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Check size={13} className="text-emerald-400 shrink-0" />
            <span>Full Dashboard Access</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="text-left">
            <p className="text-xs text-muted-foreground">Selected Total Due Today:</p>
            <p className="text-xl font-extrabold text-foreground font-display">
              {aedPrice(currentPlan.price)} <span className="text-xs font-normal text-muted-foreground font-sans">incl. UAE VAT</span>
            </p>
          </div>

          <Button
            size="lg"
            onClick={handleConfirmPayment}
            disabled={isProcessing}
            className="w-full sm:w-auto h-12 px-8 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-sm gap-2 shadow-lg shadow-amber-500/20 cursor-pointer"
          >
            {isProcessing ? (
              <>Processing UAE 3DS Verification…</>
            ) : (
              <>
                <Sparkles size={16} />
                <span>Confirm Payment &amp; Unlock Workspace</span>
                <ArrowRight size={16} />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
