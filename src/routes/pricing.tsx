import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Check,
  ArrowRight,
  MessageCircle,
  Landmark,
  ShieldCheck,
  LogIn,
  Building2,
  User,
  Sparkles,
  CheckCircle2,
  RotateCcw,
  Loader2,
} from "lucide-react";

import { Eyebrow, meta, PublicLayout } from "@/components/public/PublicLayout";
import { PLANS, AGENCY_TIERS, aedPrice, type AgencyTierId } from "@/lib/pricing";
import { CorporateInvoiceModal } from "@/components/pricing/CorporateInvoiceModal";
import { Button } from "@/components/ui/button";
import { openWhatsApp, getWhatsAppNativeUrl } from "@/lib/whatsapp-send";

export const Route = createFileRoute("/pricing")({
  head: () =>
    meta(
      "Pricing · DealOS Institutional Broker Licenses",
      "DealOS Dubai real estate operating system licenses from AED 91/mo — official launch discounts and customized multi-agent brokerage volume tiers."
    ),
  component: PricingPage,
});

function PricingPage() {
  const [planType, setPlanType] = useState<"broker" | "agency">("broker");
  const [selectedPlanId, setSelectedPlanId] = useState<PlanId>("annual");

  const activePlan = PLANS.find((p) => p.id === selectedPlanId) || PLANS[3]!;
  const activeDiscount = Math.round((1 - activePlan.price / activePlan.originalPrice) * 100);
  const activeSavings = activePlan.originalPrice - activePlan.price;

  // Agency Quote State
  const [agencyName, setAgencyName] = useState("");
  const [agentTierId, setAgentTierId] = useState<AgencyTierId>("growth");
  const [contactName, setContactName] = useState("");
  const [agencyEmail, setAgencyEmail] = useState("");
  const [agencyPhone, setAgencyPhone] = useState("+971 ");
  const [agencyBilling, setAgencyBilling] = useState<"annual" | "quarterly">("annual");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [quoteCode, setQuoteCode] = useState("DEALOS-AGY-9142");

  // Invoice Modal state
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [invoicePrefill, setInvoicePrefill] = useState({
    agencyName: "",
    contactName: "",
    email: "",
    phone: "",
    plan: "",
    billing: "annual" as "annual" | "quarterly",
  });

  const activeAgencyTier = AGENCY_TIERS.find((t) => t.id === agentTierId) ?? AGENCY_TIERS[1]!;

  const agencyMonthlyRate = agencyBilling === "annual"
    ? activeAgencyTier.annualEquivalentMonthly
    : activeAgencyTier.monthlyPrice;
  const agencyTotalCharge = agencyBilling === "annual"
    ? activeAgencyTier.annualPrice
    : activeAgencyTier.monthlyPrice * 3;
  const agencySavings = activeAgencyTier.standardSoloAnnualCost - activeAgencyTier.annualPrice;

  const handleVerifyQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agencyName.trim()) return;
    setIsVerifying(true);
    setTimeout(() => {
      setQuoteCode(`DEALOS-AGY-${Math.floor(1000 + Math.random() * 9000)}`);
      setIsVerifying(false);
      setIsVerified(true);
    }, 1100);
  };

  const handleLaunchAgencyInvoice = () => {
    setInvoicePrefill({
      agencyName: agencyName.trim() || "Verified Brokerage LLC",
      contactName: contactName.trim() || "Managing Director",
      email: agencyEmail.trim() || "finance@agency.ae",
      phone: agencyPhone.trim() || "+971 50 000 0000",
      plan: `${activeAgencyTier.name} (${activeAgencyTier.agentRangeLabel} · AED ${agencyMonthlyRate}/mo)`,
      billing: agencyBilling,
    });
    setShowInvoiceModal(true);
  };

  const agencyQuoteMsg = `Hello DealOS Team! We verified Agency Quote (${quoteCode}) for ${agencyName || "our brokerage"} (${activeAgencyTier.agentRangeLabel}). We would like to proceed with team activation.`;
  const waAgencyUrl = getWhatsAppNativeUrl("971500000000", agencyQuoteMsg);

  return (
    <PublicLayout>
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-16 text-center">
        <Eyebrow>Institutional value · Zero hidden fees</Eyebrow>
        <h1 className="mx-auto mt-3 max-w-3xl text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground font-display">
          Simple, Transparent Pricing
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Full institutional access to 1,355+ Dubai off-plan developments, DLD escrow registry, and DealOS AI Copilot.
        </p>

        {/* Master License Type Switcher */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-2.5 max-w-md mx-auto">
          <div className="inline-flex p-1 rounded-2xl bg-secondary/80 border border-border shadow-xs w-full">
            <button
              type="button"
              onClick={() => setPlanType("broker")}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                planType === "broker"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <User size={14} />
              <span>Solo Broker</span>
            </button>
            <button
              type="button"
              onClick={() => setPlanType("agency")}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                planType === "agency"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Building2 size={14} />
              <span>Agency Teams</span>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-400 font-bold">
                Quote
              </span>
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-center">
            <Button
              asChild
              size="sm"
              variant="outline"
              className="rounded-xl border-border bg-card text-xs font-bold text-foreground hover:bg-secondary px-3 py-1.5 h-9"
            >
              <Link to="/login" search={{ mode: undefined }}>
                <LogIn size={13} className="text-primary mr-1" />
                <span>Sign In</span>
              </Link>
            </Button>
            <Button
              asChild
              size="sm"
              className="rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-extrabold px-3 py-1.5 h-9 shadow-xs"
            >
              <Link to="/demo">
                <span>Try Demo ⚡</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════ */}
        {/* VIEW A: SOLO BROKER PLANS                                  */}
        {/* ══════════════════════════════════════════════════════════ */}
        {planType === "broker" && (
          <div className="mt-8 max-w-5xl mx-auto">
            {/* MOBILE ONLY: ULTRA CLEAN SINGLE-CARD EXPERIENCE */}
            <div className="block sm:hidden space-y-4 text-left">
              {/* Clean 4-Pill Cadence Switcher */}
              <div className="grid grid-cols-4 gap-1.5 p-1 rounded-2xl bg-secondary/80 border border-border">
                {PLANS.map((p) => {
                  const discount = Math.round((1 - p.price / p.originalPrice) * 100);
                  const isSelected = p.id === selectedPlanId;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedPlanId(p.id)}
                      className={`py-2 px-1 rounded-xl text-center flex flex-col items-center justify-center transition-all cursor-pointer ${
                        isSelected
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <span className="text-[11px] font-bold">{p.label}</span>
                      <span className={`text-[9px] font-mono font-bold ${isSelected ? "text-white/90" : "text-emerald-500"}`}>
                        -{discount}%
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Single Focused Clean Card */}
              <div className="rounded-3xl border border-primary/40 bg-card/95 p-6 shadow-xl space-y-5 relative overflow-hidden backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary">
                      {activePlan.label} License
                    </span>
                    <h3 className="text-xl font-extrabold text-foreground font-display">
                      DealOS Broker Pro
                    </h3>
                  </div>
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    Save {activeDiscount}%
                  </span>
                </div>

                {/* Price Display */}
                <div className="p-4 rounded-2xl bg-secondary/40 border border-border/70 space-y-1">
                  <div className="flex items-center gap-2">
                    <s className="text-xs text-muted-foreground line-through font-semibold">
                      {aedPrice(activePlan.originalPrice)}
                    </s>
                    <span className="text-[11px] font-mono font-bold text-emerald-400">
                      Save {aedPrice(activeSavings)}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-4xl font-black text-foreground font-display tracking-tight">
                      {aedPrice(activePlan.price)}
                    </span>
                    <span className="text-xs text-muted-foreground font-semibold">
                      {activePlan.period}
                    </span>
                  </div>
                  <p className="text-xs text-emerald-400 font-semibold pt-0.5">
                    {activePlan.months > 1 ? `Equivalent to ${aedPrice(activePlan.perMonth)} / month` : "Flexible 30-day billing"}
                  </p>
                </div>

                {/* 4 Crisp Feature Bullets (No Walls of Text!) */}
                <ul className="space-y-2.5 text-xs text-foreground/90 font-medium">
                  <li className="flex items-center gap-2.5">
                    <Check className="size-4 shrink-0 text-emerald-400" />
                    <span>34,850+ Verified Units &amp; 1,355+ Off-Plan Projects</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="size-4 shrink-0 text-emerald-400" />
                    <span>Live DLD Escrow Accounts &amp; Yield Radar</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="size-4 shrink-0 text-emerald-400" />
                    <span>1-Tap WhatsApp Investor Pitches &amp; PDF Dossiers</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="size-4 shrink-0 text-emerald-400" />
                    <span>DealOS AI Copilot &amp; Voice CRM Integration</span>
                  </li>
                </ul>

                {/* Direct Action Buttons */}
                <div className="space-y-2 pt-1">
                  <Button
                    asChild
                    className="w-full h-12 rounded-xl text-xs font-extrabold bg-primary hover:bg-primary/90 text-primary-foreground shadow-md gap-2"
                  >
                    <Link to="/signup" search={{ plan: activePlan.id }}>
                      <span>Get Started Now</span>
                      <ArrowRight size={14} />
                    </Link>
                  </Button>

                  <div className="flex items-center gap-2">
                    <Button
                      asChild
                      variant="outline"
                      className="flex-1 h-10 rounded-xl text-xs font-bold border-border bg-secondary/50 text-foreground"
                    >
                      <Link to="/login" search={{ mode: undefined }}>
                        <span>Sign In ↗</span>
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="flex-1 h-10 rounded-xl text-xs font-bold border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                    >
                      <Link to="/demo">
                        <span>Live Demo ⚡</span>
                      </Link>
                    </Button>
                  </div>
                </div>

                {/* Bank Wire Link */}
                <div className="pt-2 text-center border-t border-border/50">
                  <button
                    type="button"
                    onClick={() => {
                      setInvoicePrefill({
                        agencyName: "",
                        contactName: "",
                        email: "",
                        phone: "+971 ",
                        plan: `Solo Broker (${activePlan.label} · AED ${activePlan.price})`,
                        billing: "annual",
                      });
                      setShowInvoiceModal(true);
                    }}
                    className="text-[11px] font-semibold text-muted-foreground hover:text-foreground inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Landmark size={12} className="text-amber-500" />
                    <span>Pay with Corporate UAE Bank Wire / IBAN ➔</span>
                  </button>
                </div>
              </div>
            </div>

            {/* DESKTOP VIEW: CLEAN 4-COLUMN COMPARISON WITH SHORT BULLETS */}
            <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
              {PLANS.map((p) => {
                const discount = Math.round((1 - p.price / p.originalPrice) * 100);
                return (
                  <div
                    key={p.id}
                    className={`relative flex flex-col rounded-2xl border bg-card/90 p-5 backdrop-blur-md transition-all duration-200 hover:-translate-y-1 ${
                      p.highlighted
                        ? "border-primary ring-2 ring-primary/20 shadow-lg"
                        : "border-border/80"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-primary">
                        {p.label}
                      </p>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        {discount}% Off
                      </span>
                    </div>

                    <div className="mt-4">
                      <s className="text-xs text-muted-foreground line-through font-semibold">
                        {aedPrice(p.originalPrice)}
                      </s>
                      <div className="flex items-baseline gap-1 mt-0.5">
                        <span className="text-3xl font-extrabold text-foreground font-display">
                          {aedPrice(p.price)}
                        </span>
                        <span className="text-xs text-muted-foreground">{p.period}</span>
                      </div>
                      <p className="text-xs text-emerald-400 font-semibold mt-0.5">
                        {p.months > 1 ? `${aedPrice(p.perMonth)}/mo` : "Flexible 30-day"}
                      </p>
                    </div>

                    <ul className="mt-5 flex-1 space-y-2 text-xs text-muted-foreground">
                      <li className="flex gap-2">
                        <Check className="mt-0.5 size-3.5 shrink-0 text-emerald-400" />
                        <span>34,850+ units &amp; 1,355+ projects</span>
                      </li>
                      <li className="flex gap-2">
                        <Check className="mt-0.5 size-3.5 shrink-0 text-emerald-400" />
                        <span>DLD escrow &amp; yield radar</span>
                      </li>
                      <li className="flex gap-2">
                        <Check className="mt-0.5 size-3.5 shrink-0 text-emerald-400" />
                        <span>1-tap WhatsApp investor pitches</span>
                      </li>
                      <li className="flex gap-2">
                        <Check className="mt-0.5 size-3.5 shrink-0 text-emerald-400" />
                        <span>DealOS AI Copilot &amp; CRM</span>
                      </li>
                    </ul>

                    <Link
                      to="/signup"
                      search={{ plan: p.id }}
                      className={`mt-6 rounded-xl py-2.5 px-3 text-center text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                        p.highlighted
                          ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs"
                          : "bg-secondary text-foreground hover:bg-secondary/80 border border-border"
                      }`}
                    >
                      <span>{p.buttonLabel}</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                );
              })}
            </div>

            {/* Corporate UAE Bank Wire Link (Desktop) */}
            <div className="hidden sm:flex items-center justify-between mt-6 p-4 rounded-2xl border border-border/80 bg-secondary/30 text-left">
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                  <Landmark size={16} />
                </div>
                <div>
                  <p className="font-bold text-xs text-foreground">
                    Corporate UAE Bank Wire / Manager's Cheque?
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Generate an instant official Proforma Invoice with our UAE IBAN.
                  </p>
                </div>
              </div>
              <Button
                type="button"
                onClick={() => {
                  setInvoicePrefill({
                    agencyName: "",
                    contactName: "",
                    email: "",
                    phone: "+971 ",
                    plan: `Solo Broker (${activePlan.label} · AED ${activePlan.price})`,
                    billing: "annual",
                  });
                  setShowInvoiceModal(true);
                }}
                className="h-9 px-3.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-black shrink-0 gap-1.5 shadow-xs cursor-pointer"
              >
                <Landmark size={13} />
                <span>Generate Proforma Invoice</span>
              </Button>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════ */}
        {/* VIEW B: AGENCY & BROKERAGE QUOTE & CHECKOUT ENGINE         */}
        {/* ══════════════════════════════════════════════════════════ */}
        {planType === "agency" && (
          <div className="mt-12 text-left">
            <div className="rounded-3xl border border-amber-500/40 bg-card/95 backdrop-blur-2xl shadow-2xl p-6 sm:p-10 lg:p-12 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-amber-500 to-emerald-400" />

              {!isVerified ? (
                <div className="max-w-3xl mx-auto space-y-8">
                  <div className="text-center space-y-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-amber-500/10 text-amber-500 border border-amber-500/30">
                      <Building2 size={13} />
                      Brokerage Volume Licensing
                    </span>
                    <h3 className="text-2xl sm:text-4xl font-extrabold text-foreground font-display">
                      Configure Agency Scale &amp; Instant Quote
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto">
                      No fixed arbitrary upfront pricing. Enter your agency size to verify volume discounts and configure team cockpits.
                    </p>
                  </div>

                  <form onSubmit={handleVerifyQuote} className="space-y-6 text-xs">
                    <div className="space-y-2">
                      <label className="font-bold uppercase tracking-wider text-foreground block">
                        1. Agency / Brokerage Legal Name *
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="e.g. Silverline Luxury Real Estate LLC, Metropolitan Homes"
                        value={agencyName}
                        onChange={(e) => setAgencyName(e.target.value)}
                        className="w-full h-12 px-4 rounded-xl border border-border bg-secondary/40 text-sm text-foreground focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div className="space-y-2.5">
                      <label className="font-bold uppercase tracking-wider text-foreground block">
                        2. How many active brokers / consultants on your team? *
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {AGENCY_TIERS.map((tier) => {
                          const isSelected = tier.id === agentTierId;
                          return (
                            <button
                              key={tier.id}
                              type="button"
                              onClick={() => setAgentTierId(tier.id)}
                              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative flex flex-col justify-between ${
                                isSelected
                                  ? "border-amber-500 bg-amber-500/10 ring-2 ring-amber-500/20"
                                  : "border-border/80 bg-secondary/20 hover:bg-secondary/40"
                              }`}
                            >
                              <div>
                                <span className="font-extrabold text-sm text-foreground block">
                                  {tier.agentRangeLabel}
                                </span>
                                <span className="text-xs font-semibold text-amber-500 mt-0.5 block">
                                  {tier.name}
                                </span>
                              </div>
                              <div className="mt-3 pt-2 border-t border-border/50 text-[11px] text-muted-foreground space-y-0.5">
                                <div>{tier.adminSeats}</div>
                                <div>{tier.brokerSeats}</div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      <label className="font-bold uppercase tracking-wider text-foreground block">
                        3. Authorized License Decision Maker *
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <input
                          required
                          type="text"
                          placeholder="Your Name (MD / Partner)"
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          className="w-full h-11 px-3.5 rounded-xl border border-border bg-secondary/40 text-xs text-foreground focus:outline-none focus:border-amber-500"
                        />
                        <input
                          required
                          type="email"
                          placeholder="Corporate Email"
                          value={agencyEmail}
                          onChange={(e) => setAgencyEmail(e.target.value)}
                          className="w-full h-11 px-3.5 rounded-xl border border-border bg-secondary/40 text-xs text-foreground focus:outline-none focus:border-amber-500"
                        />
                        <input
                          required
                          type="tel"
                          placeholder="WhatsApp Mobile (+971 50 ...)"
                          value={agencyPhone}
                          onChange={(e) => setAgencyPhone(e.target.value)}
                          className="w-full h-11 px-3.5 rounded-xl border border-border bg-secondary/40 text-xs text-foreground focus:outline-none focus:border-amber-500 font-mono"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="font-bold uppercase tracking-wider text-foreground block">
                        4. Billing Cadence
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setAgencyBilling("annual")}
                          className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                            agencyBilling === "annual"
                              ? "border-amber-500 bg-amber-500/10 text-foreground"
                              : "border-border bg-secondary/20 text-muted-foreground"
                          }`}
                        >
                          <div>
                            <span className="font-bold text-xs block text-foreground">Annual Agency Agreement</span>
                            <span className="text-[11px] text-muted-foreground">Save 20% + 2 Months Free</span>
                          </div>
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            Recommended
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setAgencyBilling("quarterly")}
                          className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                            agencyBilling === "quarterly"
                              ? "border-amber-500 bg-amber-500/10 text-foreground"
                              : "border-border bg-secondary/20 text-muted-foreground"
                          }`}
                        >
                          <div>
                            <span className="font-bold text-xs block text-foreground">Quarterly Term</span>
                            <span className="text-[11px] text-muted-foreground">Flexible 90-day renewal</span>
                          </div>
                          <span className="text-[10px] font-mono text-muted-foreground">Standard</span>
                        </button>
                      </div>
                    </div>

                    <div className="pt-2 space-y-3">
                      <Button
                        type="submit"
                        disabled={isVerifying}
                        className="w-full h-13 rounded-xl text-sm font-extrabold bg-gradient-to-r from-amber-500 to-amber-600 hover:opacity-95 text-black shadow-lg shadow-amber-500/25 gap-2 transition-all cursor-pointer"
                      >
                        {isVerifying ? (
                          <>
                            <Loader2 size={18} className="animate-spin text-black" />
                            <span>Verifying Brokerage Scale &amp; Calculating Volume Tier...</span>
                          </>
                        ) : (
                          <span>Verify Agency Scale &amp; Generate Official Quote ➔</span>
                        )}
                      </Button>
                      <p className="text-[11px] text-center text-muted-foreground flex items-center justify-center gap-1.5">
                        <ShieldCheck size={13} className="text-emerald-500" />
                        <span>Instant verified rate calculation · Direct checkout or UAE bank transfer</span>
                      </p>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="space-y-8 animate-in fade-in duration-300">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/80">
                    <div className="flex items-center gap-2.5">
                      <div className="size-9 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 border border-emerald-500/30">
                        <CheckCircle2 size={18} />
                      </div>
                      <div>
                        <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 block">
                          Verified Corporate Rate
                        </span>
                        <h3 className="text-xl font-extrabold text-foreground font-display">
                          DealOS Quote for {agencyName}
                        </h3>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg bg-secondary border border-border text-muted-foreground">
                        Quote #{quoteCode}
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsVerified(false)}
                        className="text-xs text-amber-500 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                      >
                        <RotateCcw size={12} />
                        <span>Edit Scale</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                    <div className="lg:col-span-5 space-y-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-500">
                            {activeAgencyTier.agentRangeLabel} · {activeAgencyTier.name}
                          </span>
                        </div>
                        <h4 className="text-2xl font-black text-foreground font-display">
                          Tailored Corporate License
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          Includes {activeAgencyTier.adminSeats} + {activeAgencyTier.brokerSeats}.
                        </p>
                      </div>

                      <div className="p-5 rounded-2xl bg-secondary/40 border border-border/80 space-y-2">
                        <div className="flex items-baseline gap-2">
                          <s className="text-sm font-semibold text-muted-foreground line-through">
                            {aedPrice(activeAgencyTier.standardSoloAnnualCost)} / yr
                          </s>
                          <span className="text-[11px] font-bold font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                            Save {aedPrice(agencySavings)} / yr
                          </span>
                        </div>

                        <div className="flex items-baseline gap-2">
                          <strong className="text-4xl sm:text-5xl font-black text-foreground font-display tracking-tight">
                            {aedPrice(agencyTotalCharge)}
                          </strong>
                          <span className="text-sm text-muted-foreground font-semibold">
                            {agencyBilling === "annual" ? "/ year" : "/ quarter"}
                          </span>
                        </div>

                        <p className="text-xs text-muted-foreground">
                          <span className="font-mono font-bold text-foreground">
                            Equivalent to {aedPrice(agencyMonthlyRate)} / month
                          </span>{" "}
                          (Corporate volume rate applied for {agencyName})
                        </p>
                      </div>

                      <div className="space-y-2.5">
                        <Button
                          asChild
                          className="w-full h-12 rounded-xl text-sm font-extrabold bg-gradient-to-r from-amber-500 to-amber-600 hover:opacity-95 text-black shadow-lg shadow-amber-500/25 gap-2 transition-all cursor-pointer"
                        >
                          <Link
                            to="/signup"
                            search={{
                              plan: "annual",
                              agency: agencyName.trim() || undefined,
                            }}
                          >
                            <span>Proceed to Corporate Checkout ➔</span>
                          </Link>
                        </Button>

                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleLaunchAgencyInvoice}
                          className="w-full h-11 rounded-xl text-xs font-bold border-amber-500/40 bg-secondary/60 hover:bg-secondary text-foreground hover:border-amber-400 hover:text-amber-400 gap-2 transition-all shadow-xs cursor-pointer"
                        >
                          <Landmark size={15} className="text-amber-500" />
                          <span>Pay via UAE Bank Wire (IBAN) Proforma Invoice</span>
                        </Button>

                        <a
                          href={waAgencyUrl}
                          onClick={(e) => {
                            e.preventDefault();
                            openWhatsApp({ phone: "971500000000", text: agencyQuoteMsg, recipientName: "DealOS Team" });
                          }}
                          className="w-full h-11 rounded-xl text-xs font-bold border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 flex items-center justify-center gap-2 transition-all cursor-pointer"
                        >
                          <MessageCircle size={15} />
                          <span>Activate via WhatsApp Concierge</span>
                        </a>
                      </div>
                    </div>

                    <div className="lg:col-span-7 space-y-5 lg:border-l lg:border-border/60 lg:pl-10">
                      <div className="space-y-1">
                        <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-500">
                          Tailored Agency Infrastructure
                        </span>
                        <h4 className="text-lg font-bold text-foreground font-display">
                          Multi-Agent Governance &amp; Velocity
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          Your verified license for {agencyName} includes:
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        {activeAgencyTier.features.map((feature, i) => (
                          <div
                            key={i}
                            className="p-3.5 rounded-2xl bg-secondary/20 border border-border/60 flex items-start gap-2.5"
                          >
                            <div className="size-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                              <Check size={12} />
                            </div>
                            <span className="text-xs text-foreground font-semibold leading-snug">
                              {feature}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Corporate Wire & Proforma Modal */}
      <CorporateInvoiceModal
        isOpen={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
        defaultPlan={invoicePrefill.plan || "Growth Brokerage (11–25 Agents · AED 999/mo)"}
        initialAgencyName={invoicePrefill.agencyName}
        initialContactName={invoicePrefill.contactName}
        initialEmail={invoicePrefill.email}
        initialPhone={invoicePrefill.phone}
        initialBillingCycle={invoicePrefill.billing}
      />
    </PublicLayout>
  );
}
