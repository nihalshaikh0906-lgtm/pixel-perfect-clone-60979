import { animate, motion, useInView, useReducedMotion, useSpring } from 'framer-motion';
import { Link } from '@tanstack/react-router';
import {
  ArrowRight,
  Check,
  ChevronDown,
  Sparkles,
  Users,
  ShieldCheck,
  Landmark,
  Building2,
  Lock,
  MessageCircle,
  User,
  Calculator,
  RotateCcw,
  CheckCircle2,
  Loader2,
  CreditCard,
  ChevronRight,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import {
  DEFAULT_PLAN,
  PLANS,
  AGENCY_TIERS,
  aedPrice,
  type PlanId,
  type AgencyTierId,
} from '@/lib/pricing';
import { RevealText, Scene } from './primitives';
import { CorporateInvoiceModal } from '@/components/pricing/CorporateInvoiceModal';
import { openWhatsApp, getWhatsAppNativeUrl } from '@/lib/whatsapp-send';
import { PaymentMethodsModal } from '@/components/pricing/PaymentMethodsModal';
import { Button } from '@/components/ui/button';

function RollingPrice({ value }: { value: number }) {
  const [n, setN] = useState(value);
  const prev = useRef(value);
  const reduce = useReducedMotion();
  useEffect(() => {
    const c = animate(prev.current, value, {
      duration: reduce ? 0 : 0.4,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: setN,
    });
    prev.current = value;
    return c.stop;
  }, [value, reduce]);
  return <>{aedPrice(n)}</>;
}

const FAQ = [
  ['Can I cancel anytime?', 'Yes, your plan stays active until the end of the paid period with zero cancellation penalties.'],
  ['What happens after the launch offer?', 'Your discounted price stays locked for as long as your subscription stays active.'],
  ['Can I switch plans or add broker seats later?', 'Yes, upgrade anytime; your unused days are automatically prorated and credited.'],
  ['How do agency teams pay by UAE Corporate Bank Wire (IBAN)?', 'Click the Bank Wire link to generate an official UAE tax invoice with our Emirates NBD or Wio Bank IBAN.'],
] as const;

export function Pricing() {
  // Plan type: solo broker vs agency
  const [planType, setPlanType] = useState<'broker' | 'agency'>('broker');

  // Solo Broker Plan state
  const [id, setId] = useState<PlanId>(DEFAULT_PLAN);
  const [faq, setFaq] = useState<number | null>(null);
  const plan = PLANS.find((p) => p.id === id) ?? PLANS[3]!;
  const idx = PLANS.findIndex((p) => p.id === id);

  // Dynamic discount calculation for solo broker
  const discountPercent = Math.round((1 - plan.price / plan.originalPrice) * 100);
  const savingsAmount = plan.originalPrice - plan.price;

  // Agency Interactive Quote State
  const [agencyName, setAgencyName] = useState('');
  const [agentTierId, setAgentTierId] = useState<AgencyTierId>('growth');
  const [contactName, setContactName] = useState('');
  const [agencyEmail, setAgencyEmail] = useState('');
  const [agencyPhone, setAgencyPhone] = useState('+971 ');
  const [agencyBilling, setAgencyBilling] = useState<'annual' | 'quarterly'>('annual');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [quoteCode, setQuoteCode] = useState('DEALOS-AGY-8492');

  // Corporate Invoice & Payment Modals state
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showPaymentMethodsModal, setShowPaymentMethodsModal] = useState(false);
  const [invoicePrefill, setInvoicePrefill] = useState({
    agencyName: '',
    contactName: '',
    email: '',
    phone: '',
    plan: '',
    billing: 'annual' as 'annual' | 'quarterly',
  });

  const activeAgencyTier = AGENCY_TIERS.find((t) => t.id === agentTierId) ?? AGENCY_TIERS[1]!;

  // Agency pricing calculation
  const agencyMonthlyRate = agencyBilling === 'annual'
    ? activeAgencyTier.annualEquivalentMonthly
    : activeAgencyTier.monthlyPrice;
  const agencyTotalCharge = agencyBilling === 'annual'
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

  const handleResetAgencyQuote = () => {
    setIsVerified(false);
    setIsVerifying(false);
  };

  const handleLaunchAgencyInvoice = () => {
    setInvoicePrefill({
      agencyName: agencyName.trim() || 'Verified Brokerage LLC',
      contactName: contactName.trim() || 'Managing Director',
      email: agencyEmail.trim() || 'finance@agency.ae',
      phone: agencyPhone.trim() || '+971 50 000 0000',
      plan: `${activeAgencyTier.name} (${activeAgencyTier.agentRangeLabel} · AED ${agencyMonthlyRate}/mo)`,
      billing: agencyBilling,
    });
    setShowInvoiceModal(true);
  };

  const agencyQuoteMsg = `Hello DealOS Team! We verified Agency Quote (${quoteCode}) for ${agencyName || 'our brokerage'} (${activeAgencyTier.agentRangeLabel}). We would like to proceed with team activation.`;
  const waAgencyUrl = getWhatsAppNativeUrl("971500000000", agencyQuoteMsg);

  return (
    <Scene id="pricing">
      <div className="d-container d-pr max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Heading */}
        <div className="d-section-heading text-center max-w-3xl mx-auto space-y-3">
          <span className="d-pill inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold font-mono bg-amber-500/10 text-amber-500 border border-amber-500/30">
            <Sparkles size={13} className="text-amber-500" />
            {planType === 'broker'
              ? `Official Launch Offer · ${discountPercent}% Savings Applied`
              : 'Enterprise Brokerage Licensing · Custom Company Scale'}
          </span>
          <RevealText>Institutional value./Zero hidden fees.</RevealText>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
            {planType === 'broker'
              ? 'Complete Dubai real estate workspace with verified off-plan data & AI CRM. Choose your billing cadence.'
              : 'Centralized brokerage governance, automated lead round-robin, and multi-broker seats tailored to your headcount.'}
          </p>

          {/* Master License Type Switcher: Solo Broker vs Agency Teams */}
          <div className="pt-2 flex justify-center">
            <div className="inline-flex p-1 rounded-2xl bg-secondary/80 border border-border shadow-sm max-w-md w-full">
              <button
                type="button"
                onClick={() => setPlanType('broker')}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  planType === 'broker'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <User size={15} />
                <span>Individual Broker</span>
              </button>
              <button
                type="button"
                onClick={() => setPlanType('agency')}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  planType === 'agency'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Building2 size={15} />
                <span>Agency &amp; Brokerage</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold">
                  Quote
                </span>
              </button>
            </div>
          </div>

          {/* Cadence Switcher ONLY for Solo Broker Pro */}
          {planType === 'broker' && (
            <div className="pt-3">
              <div
                className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-1.5 p-1.5 rounded-2xl sm:rounded-full bg-secondary/80 border border-border shadow-sm max-w-xl w-full mx-auto relative"
                role="radiogroup"
                aria-label="Billing period"
              >
                {PLANS.map((p) => {
                  const discount = Math.round((1 - p.price / p.originalPrice) * 100);
                  const isSelected = p.id === id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      className={`flex flex-col items-center justify-center py-2.5 px-3 rounded-xl sm:rounded-full text-xs font-bold transition-all relative z-10 cursor-pointer min-h-[46px] ${
                        isSelected
                          ? 'bg-primary text-primary-foreground shadow-md'
                          : 'text-foreground hover:bg-secondary/70'
                      }`}
                      onClick={() => setId(p.id)}
                    >
                      <span>{p.label}</span>
                      <small className={`text-[10px] font-mono font-bold mt-0.5 ${isSelected ? 'text-white/90' : 'text-emerald-500'}`}>
                        −{discount}%
                      </small>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* ══════════════════════════════════════════════════════════ */}
        {/* VIEW A: INDIVIDUAL BROKER PRO PLAN                          */}
        {/* ══════════════════════════════════════════════════════════ */}
        {planType === 'broker' && (
          <div className="mt-8 rounded-3xl sm:rounded-[36px] border border-border/80 bg-card/95 backdrop-blur-2xl shadow-2xl p-6 sm:p-10 lg:p-12 relative overflow-hidden">
            {/* Top subtle ambient gradient accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-emerald-400 to-primary" />

            {/* Dynamic Badge reflecting the active plan's discount */}
            <div className="absolute top-4 right-4 sm:top-6 sm:right-8">
              <span
                className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-mono font-extrabold uppercase tracking-wider shadow-sm ${
                  plan.id === 'annual'
                    ? 'bg-primary text-primary-foreground shadow-primary/20'
                    : plan.id === 'semiannual'
                    ? 'bg-primary/15 text-primary border border-primary/30'
                    : plan.id === 'quarterly'
                    ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                    : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                }`}
              >
                <Sparkles size={12} />
                {plan.id === 'annual'
                  ? `★ Best Value · ${discountPercent}% Off`
                  : plan.id === 'semiannual'
                  ? `★ Semiannual Saver · ${discountPercent}% Off`
                  : plan.id === 'quarterly'
                  ? `★ Quarterly Pick · ${discountPercent}% Off`
                  : `★ Launch Rate · ${discountPercent}% Off`}
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* ── LEFT COLUMN: PRICING & CHECKOUT (5 Cols) ── */}
              <div className="lg:col-span-5 space-y-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary">
                      Individual Broker License
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Instant Access
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground font-display">
                    DealOS Broker Pro
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Complete Dubai real estate workspace with verified off-plan data &amp; AI CRM.
                  </p>
                </div>

                {/* Price Display */}
                <div className="p-5 sm:p-6 rounded-2xl bg-secondary/50 border border-border/70 space-y-2.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <s className="text-sm font-semibold text-muted-foreground line-through">
                      {aedPrice(plan.originalPrice)}
                    </s>
                    <span className="text-[11px] font-bold font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      Save {discountPercent}% · {aedPrice(savingsAmount)}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-2 flex-wrap">
                    <strong className="text-4xl sm:text-5xl font-black text-foreground font-display tracking-tight">
                      <RollingPrice value={plan.price} />
                    </strong>
                    <span className="text-sm text-muted-foreground font-semibold">
                      {plan.period}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground font-mono">
                    {plan.months > 1 ? (
                      <span className="font-bold text-foreground">
                        Equivalent to {aedPrice(plan.perMonth)} / month
                      </span>
                    ) : (
                      'Flexible 30-day billing · No lock-in'
                    )}
                  </p>

                  {/* 4 Crisp Feature Bullets (Mobile-only, replaces 6 huge stacked boxes) */}
                  <ul className="lg:hidden space-y-2 text-xs text-foreground/90 font-medium pt-3 border-t border-border/50 text-left">
                    <li className="flex items-center gap-2">
                      <Check className="size-3.5 text-emerald-400 shrink-0" />
                      <span>34,850+ Units &amp; 1,355+ Off-Plan Projects</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="size-3.5 text-emerald-400 shrink-0" />
                      <span>Live DLD Escrow &amp; Price Yield Radar</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="size-3.5 text-emerald-400 shrink-0" />
                      <span>1-Tap WhatsApp Pitch &amp; Client Profiles</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="size-3.5 text-emerald-400 shrink-0" />
                      <span>DealOS AI Copilot &amp; Voice CRM</span>
                    </li>
                  </ul>
                </div>

                {/* Spacious, Dominant Primary CTA */}
                <div className="pt-4 pb-1 space-y-2">
                  <Button
                    asChild
                    className="w-full h-14 rounded-2xl text-base font-extrabold bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl shadow-primary/25 gap-2.5 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                  >
                    <Link to="/signup" search={{ plan: plan.id }}>
                      <span>Get Started Now</span>
                      <ArrowRight size={18} />
                    </Link>
                  </Button>

                  <p className="text-[11px] text-center text-muted-foreground/80 font-medium flex items-center justify-center gap-1.5">
                    <ShieldCheck size={13} className="text-emerald-500 shrink-0" />
                    <span>Instant activation · Cancel anytime</span>
                  </p>
                </div>

                {/* Sleek Minimalist Payment & Wire Options */}
                <div className="pt-4 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
                  <button
                    type="button"
                    onClick={() => setShowPaymentMethodsModal(true)}
                    className="hover:text-foreground inline-flex items-center gap-1.5 font-medium transition-colors cursor-pointer"
                  >
                    <CreditCard size={14} className="text-primary" />
                    <span>Cards, Apple Pay &amp; Wire</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setInvoicePrefill({
                        agencyName: '',
                        contactName: '',
                        email: '',
                        phone: '+971 ',
                        plan: `Solo Broker (${plan.label} · AED ${plan.price})`,
                        billing: 'annual',
                      });
                      setShowInvoiceModal(true);
                    }}
                    className="text-amber-500 hover:text-amber-400 font-semibold inline-flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Landmark size={13} />
                    <span>UAE Bank Wire ➔</span>
                  </button>
                </div>

                {/* Mobile Agency Link */}
                <div className="lg:hidden pt-3 border-t border-border/60 text-center">
                  <button
                    type="button"
                    onClick={() => setPlanType('agency')}
                    className="text-xs font-bold text-amber-500 hover:underline inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Building2 size={13} />
                    <span>Managing 5+ agents? Get Brokerage Quote ➔</span>
                  </button>
                </div>
              </div>

              {/* ── RIGHT COLUMN: STRUCTURED FEATURES & CAPABILITIES (Desktop only) ── */}
              <div className="hidden lg:block lg:col-span-7 space-y-6 lg:border-l lg:border-border/60 lg:pl-10">
                <div className="space-y-1.5">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-500">
                    Included in Every License
                  </span>
                  <h4 className="text-lg sm:text-xl font-bold text-foreground font-display">
                    Everything you need to source, pitch, and close Dubai property
                  </h4>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    Zero tiered feature gates. You get the complete institutional suite from day one:
                  </p>
                </div>

                {/* Structured Feature Categories Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div className="p-4 sm:p-5 rounded-2xl bg-secondary/25 border border-border/70 space-y-2 hover:border-border transition-all">
                    <div className="flex items-center gap-2.5 text-foreground font-bold text-sm">
                      <div className="size-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                        <Check size={13} />
                      </div>
                      <span>1,355+ Off-Plan Registry</span>
                    </div>
                    <p className="text-xs sm:text-[13px] text-muted-foreground pl-7 leading-relaxed">
                      Official UAE catalog with verified payment plans, milestones, and unit inventory.
                    </p>
                  </div>

                  <div className="p-4 sm:p-5 rounded-2xl bg-secondary/25 border border-border/70 space-y-2 hover:border-border transition-all">
                    <div className="flex items-center gap-2.5 text-foreground font-bold text-sm">
                      <div className="size-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                        <Check size={13} />
                      </div>
                      <span>DLD Market Context</span>
                    </div>
                    <p className="text-xs sm:text-[13px] text-muted-foreground pl-7 leading-relaxed">
                      DLD market context with verified transaction sources and sample sizes.
                    </p>
                  </div>

                  <div className="p-4 sm:p-5 rounded-2xl bg-secondary/25 border border-border/70 space-y-2 hover:border-border transition-all">
                    <div className="flex items-center gap-2.5 text-foreground font-bold text-sm">
                      <div className="size-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                        <Check size={13} />
                      </div>
                      <span>1-Click WhatsApp Pitch</span>
                    </div>
                    <p className="text-xs sm:text-[13px] text-muted-foreground pl-7 leading-relaxed">
                      Instant tailored investor scripts formatted for WhatsApp with payment plan breakdowns.
                    </p>
                  </div>

                  <div className="p-4 sm:p-5 rounded-2xl bg-secondary/25 border border-border/70 space-y-2 hover:border-border transition-all">
                    <div className="flex items-center gap-2.5 text-foreground font-bold text-sm">
                      <div className="size-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                        <Check size={13} />
                      </div>
                      <span>Voice Note Capture</span>
                    </div>
                    <p className="text-xs sm:text-[13px] text-muted-foreground pl-7 leading-relaxed">
                      AI transcribes client voice notes &amp; drive-time audio directly into CRM lead profiles.
                    </p>
                  </div>

                  <div className="p-4 sm:p-5 rounded-2xl bg-secondary/25 border border-border/70 space-y-2 hover:border-border transition-all">
                    <div className="flex items-center gap-2.5 text-foreground font-bold text-sm">
                      <div className="size-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                        <Check size={13} />
                      </div>
                      <span>Bespoke Investor Profiles</span>
                    </div>
                    <p className="text-xs sm:text-[13px] text-muted-foreground pl-7 leading-relaxed">
                      Prioritized speed-to-lead queue (Hot, Warm, Follow-ups) with client criteria matching.
                    </p>
                  </div>

                  <div className="p-4 sm:p-5 rounded-2xl bg-secondary/25 border border-border/70 space-y-2 hover:border-border transition-all">
                    <div className="flex items-center gap-2.5 text-foreground font-bold text-sm">
                      <div className="size-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                        <Check size={13} />
                      </div>
                      <span>Client Presentation Mode</span>
                    </div>
                    <p className="text-xs sm:text-[13px] text-muted-foreground pl-7 leading-relaxed">
                      100% white-label client view that hides agency internal commission margins during live meetings.
                    </p>
                  </div>
                </div>

                {/* Agency Switcher Callout */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-secondary/50 via-secondary/20 to-secondary/40 border border-border/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                      <Users size={16} />
                    </div>
                    <div>
                      <span className="font-bold text-xs text-foreground block">
                        Managing a Team of 5+ Agents?
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        Get centralized governance, broker leaderboards, and corporate volume pricing.
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setPlanType('agency')}
                    className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs shrink-0 transition-all cursor-pointer shadow-sm"
                  >
                    <Building2 size={13} />
                    <span>Get Agency Quote ➔</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════ */}
        {/* VIEW B: AGENCY & BROKERAGE INTERACTIVE QUOTE & CHECKOUT    */}
        {/* ══════════════════════════════════════════════════════════ */}
        {planType === 'agency' && (
          <div className="mt-8 rounded-3xl border border-amber-500/40 bg-card/95 backdrop-blur-2xl shadow-2xl p-6 sm:p-10 lg:p-12 relative overflow-hidden">
            {/* Top gold accent line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-amber-500 to-emerald-400" />

            {!isVerified ? (
              /* ── STEP 1: INTERACTIVE AGENCY QUESTIONNAIRE (NO UPFRONT AMOUNT) ── */
              <div className="max-w-3xl mx-auto space-y-8">
                <div className="text-center space-y-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-amber-500/10 text-amber-500 border border-amber-500/30">
                    <Building2 size={13} />
                    DealOS Agency &amp; Brokerage Suite
                  </span>
                  <h3 className="text-2xl sm:text-4xl font-extrabold text-foreground font-display">
                    Configure Your Brokerage License
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto">
                    Never overpay for individual broker seats. Tell us your agency scale to verify and calculate volume licensing with centralized administrative controls.
                  </p>
                </div>

                <form onSubmit={handleVerifyQuote} className="space-y-6">
                  {/* Question 1: Agency Name */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center justify-between">
                      <span>1. What is your Brokerage / Agency Name? *</span>
                      <span className="text-[11px] font-normal text-muted-foreground">Trade license / ORN name</span>
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Metropolitan Premium Properties, Royal Vista Real Estate LLC"
                      value={agencyName}
                      onChange={(e) => setAgencyName(e.target.value)}
                      className="w-full h-12 px-4 rounded-xl border border-border bg-secondary/40 text-sm text-foreground focus:outline-none focus:border-amber-500 font-medium transition-all"
                    />
                  </div>

                  {/* Question 2: Number of Agents / Company Size */}
                  <div className="space-y-2.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center justify-between">
                      <span>2. How many active brokers / consultants are on your team? *</span>
                      <span className="text-[11px] font-normal text-amber-500">Tier volume rates apply</span>
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
                                ? 'border-amber-500 bg-amber-500/10 ring-2 ring-amber-500/20'
                                : 'border-border/80 bg-secondary/20 hover:bg-secondary/40'
                            }`}
                          >
                            {tier.recommended && (
                              <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-amber-500 text-black uppercase">
                                Popular
                              </span>
                            )}
                            <div>
                              <span className="font-extrabold text-sm text-foreground block">
                                {tier.agentRangeLabel}
                              </span>
                              <span className="text-xs font-semibold text-amber-500 mt-0.5 block">
                                {tier.name}
                              </span>
                              <div className="mt-1.5 flex flex-wrap items-center gap-1">
                                <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/15 px-1.5 py-0.5 rounded border border-emerald-500/25">
                                  AED {tier.perSeatAnnual} / person / mo
                                </span>
                              </div>
                            </div>
                            <div className="mt-2.5 pt-2 border-t border-border/50 text-[11px] text-muted-foreground space-y-0.5">
                              <div className="text-[10px] font-semibold text-emerald-400/90">{tier.savingsPercentVsSolo}</div>
                              <div>{tier.adminSeats}</div>
                              <div>{tier.brokerSeats}</div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Question 3: Primary License Holder Contact */}
                  <div className="space-y-2.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-foreground block">
                      3. Primary Administrator / Decision Maker Contact *
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <input
                          required
                          type="text"
                          placeholder="Your Full Name"
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          className="w-full h-11 px-3.5 rounded-xl border border-border bg-secondary/40 text-xs text-foreground focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <div>
                        <input
                          required
                          type="email"
                          placeholder="Work Email (e.g. md@agency.ae)"
                          value={agencyEmail}
                          onChange={(e) => setAgencyEmail(e.target.value)}
                          className="w-full h-11 px-3.5 rounded-xl border border-border bg-secondary/40 text-xs text-foreground focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <div>
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
                  </div>

                  {/* Question 4: Billing Cadence */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-foreground block">
                      4. Preferred Billing Cadence
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setAgencyBilling('annual')}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                          agencyBilling === 'annual'
                            ? 'border-amber-500 bg-amber-500/10 text-foreground'
                            : 'border-border bg-secondary/20 text-muted-foreground'
                        }`}
                      >
                        <div>
                          <span className="font-bold text-xs block text-foreground">Annual Agency Agreement</span>
                          <span className="text-[11px] text-muted-foreground">Save 20% + 2 Months Free Included</span>
                        </div>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Best Value
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setAgencyBilling('quarterly')}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                          agencyBilling === 'quarterly'
                            ? 'border-amber-500 bg-amber-500/10 text-foreground'
                            : 'border-border bg-secondary/20 text-muted-foreground'
                        }`}
                      >
                        <div>
                          <span className="font-bold text-xs block text-foreground">Quarterly Billing</span>
                          <span className="text-[11px] text-muted-foreground">Flexible 90-day renewal</span>
                        </div>
                        <span className="text-[10px] font-mono text-muted-foreground">Standard</span>
                      </button>
                    </div>
                  </div>

                  {/* Submission & Verification Button */}
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
                        <>
                          <span>Verify Company Size &amp; Generate Official Quote ➔</span>
                        </>
                      )}
                    </Button>

                    <p className="text-[11px] text-center text-muted-foreground flex items-center justify-center gap-1.5">
                      <ShieldCheck size={13} className="text-emerald-500" />
                      <span>Zero commitment · Instant verified quote tailored to your team headcount</span>
                    </p>
                  </div>
                </form>
              </div>
            ) : (
              /* ── STEP 2: VERIFIED AGENCY BREAKDOWN & TAILORED PAYMENT ROUTING ── */
              <div className="space-y-8 animate-in fade-in duration-300">
                {/* Verified Header Pill */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/80">
                  <div className="flex items-center gap-2.5">
                    <div className="size-9 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 border border-emerald-500/30">
                      <CheckCircle2 size={18} />
                    </div>
                    <div>
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 block">
                        Verified Corporate Rate
                      </span>
                      <h3 className="text-lg sm:text-xl font-extrabold text-foreground font-display">
                        Official DealOS Quote for {agencyName || 'Your Brokerage'}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg bg-secondary border border-border text-muted-foreground">
                      Quote #{quoteCode}
                    </span>
                    <button
                      type="button"
                      onClick={handleResetAgencyQuote}
                      className="text-xs text-amber-500 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                    >
                      <RotateCcw size={12} />
                      <span>Edit Parameters</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                  {/* Left Column: Tailored Calculation & Checkout Actions (5 Cols) */}
                  <div className="lg:col-span-5 space-y-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-500">
                          {activeAgencyTier.agentRangeLabel} · {activeAgencyTier.name}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
                          Verified Scale
                        </span>
                      </div>
                      <h4 className="text-2xl font-black text-foreground font-display">
                        Tailored Team Operating System
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        Includes {activeAgencyTier.adminSeats} + {activeAgencyTier.brokerSeats}.
                      </p>
                    </div>

                    {/* Calculated Price Box */}
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
                          <RollingPrice value={agencyTotalCharge} />
                        </strong>
                        <span className="text-sm text-muted-foreground font-semibold">
                          {agencyBilling === 'annual' ? '/ year' : '/ 3 months'}
                        </span>
                      </div>

                      <p className="text-xs text-muted-foreground">
                        <span className="font-mono font-bold text-foreground">
                          Equivalent to {aedPrice(agencyMonthlyRate)} / month
                        </span>{' '}
                        (Corporate volume rate applied for {agencyName})
                      </p>

                      <div className="pt-2 border-t border-border/50 flex flex-wrap items-center justify-between gap-1 text-xs">
                        <span className="text-muted-foreground font-medium">Per-person rate:</span>
                        <span className="font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          AED {agencyBilling === 'annual' ? activeAgencyTier.perSeatAnnual : activeAgencyTier.perSeatMonthly} / broker / mo ({activeAgencyTier.savingsPercentVsSolo})
                        </span>
                      </div>
                    </div>

                    {/* Direct Payment Page Routing Actions */}
                    <div className="space-y-2.5">
                      <Button
                        asChild
                        className="w-full h-12 rounded-xl text-sm font-extrabold bg-gradient-to-r from-amber-500 to-amber-600 hover:opacity-95 text-black shadow-lg shadow-amber-500/25 gap-2 transition-all cursor-pointer"
                      >
                        <Link
                          to="/signup"
                          search={{
                            plan: 'annual',
                            agency: agencyName.trim() || undefined,
                          }}
                        >
                          <span>Proceed to Corporate Checkout ➔</span>
                        </Link>
                      </Button>

                      {/* Pay via Corporate Bank Wire (IBAN) */}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleLaunchAgencyInvoice}
                        className="w-full h-11 rounded-xl text-xs font-bold border-amber-500/40 bg-secondary/60 hover:bg-secondary text-foreground hover:border-amber-400 hover:text-amber-400 gap-2 transition-all shadow-xs cursor-pointer"
                      >
                        <Landmark size={15} className="text-amber-500" />
                        <span>Pay via UAE Bank Wire · Instant Proforma Tax Invoice</span>
                      </Button>

                      {/* Instant WhatsApp Concierge Activation */}
                      <a
                        href={waAgencyUrl}
                        onClick={(e) => {
                          e.preventDefault();
                          openWhatsApp({ phone: "971500000000", text: agencyQuoteMsg, recipientName: "DealOS Team" });
                        }}
                        className="w-full h-11 rounded-xl text-xs font-bold border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 flex items-center justify-center gap-2 transition-all cursor-pointer"
                      >
                        <MessageCircle size={15} />
                        <span>Activate Quote via WhatsApp Concierge</span>
                      </a>
                    </div>

                    <p className="text-[11px] text-muted-foreground flex items-center justify-center gap-1.5 text-center">
                      <ShieldCheck size={13} className="text-emerald-500" />
                      <span>Formal UAE Tax Invoice + VAT 5% receipt generated for your accounting</span>
                    </p>
                  </div>

                  {/* Right Column: Tailored Agency Inclusions (7 Cols) */}
                  <div className="lg:col-span-7 space-y-5 lg:border-l lg:border-border/60 lg:pl-10">
                    <div className="space-y-1">
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-500">
                        Tailored Agency Infrastructure
                      </span>
                      <h4 className="text-lg font-bold text-foreground font-display">
                        Built for multi-agent governance &amp; institutional speed
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        Your verified license for {agencyName} includes full access to:
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

                    {/* Dedicated Concierge Box */}
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-secondary/30 to-amber-500/5 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <span className="text-xs font-bold text-foreground block">
                          VIP Onboarding &amp; Custom Team Training
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          Dedicated Dubai account manager assists with CRM migration and agent orientation.
                        </span>
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-amber-500 text-black shrink-0">
                        Included
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══ FAQ ACCORDION ═══ */}
        <div className="mt-14 max-w-3xl mx-auto space-y-3">
          <div className="text-center space-y-1 pb-2">
            <h4 className="text-base font-bold text-foreground font-display">Frequently Asked Questions</h4>
            <p className="text-xs text-muted-foreground">Clear answers about DealOS licensing and payment terms.</p>
          </div>

          <div className="space-y-2">
            {FAQ.map(([q, a], i) => (
              <div
                key={q}
                className="rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md overflow-hidden transition-all"
              >
                <button
                  type="button"
                  aria-expanded={faq === i}
                  onClick={() => setFaq(faq === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-left text-xs font-bold text-foreground cursor-pointer hover:bg-secondary/20"
                >
                  <span>{q}</span>
                  <ChevronDown
                    size={15}
                    className={`text-muted-foreground transition-transform duration-200 ${
                      faq === i ? 'rotate-180 text-foreground' : ''
                    }`}
                  />
                </button>
                {faq === i && (
                  <div className="px-4 pb-4 pt-1 text-xs text-muted-foreground leading-relaxed border-t border-border/40 font-normal">
                    {a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Corporate Wire & Proforma Modal */}
      <CorporateInvoiceModal
        isOpen={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
        defaultPlan={invoicePrefill.plan || `Solo Broker (${plan.label} · AED ${plan.price})`}
        initialAgencyName={invoicePrefill.agencyName}
        initialContactName={invoicePrefill.contactName}
        initialEmail={invoicePrefill.email}
        initialPhone={invoicePrefill.phone}
        initialBillingCycle={invoicePrefill.billing}
      />

      {/* Payment Methods Breakdown Modal */}
      <PaymentMethodsModal
        isOpen={showPaymentMethodsModal}
        onClose={() => setShowPaymentMethodsModal(false)}
        onOpenBankWireInvoice={() => {
          setInvoicePrefill({
            agencyName: planType === 'agency' ? agencyName : '',
            contactName: planType === 'agency' ? contactName : '',
            email: planType === 'agency' ? agencyEmail : '',
            phone: planType === 'agency' ? agencyPhone : '+971 ',
            plan: `Solo Broker (${plan.label} · AED ${plan.price})`,
            billing: 'annual',
          });
          setShowInvoiceModal(true);
        }}
      />
    </Scene>
  );
}
