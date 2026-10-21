import { animate, motion, useInView, useReducedMotion, useSpring } from 'framer-motion';
import { Link } from '@tanstack/react-router';
import {
  ArrowRight,
  Check,
  ChevronDown,
  Sparkles,
  Users,
  ShieldCheck,
  CreditCard,
  Landmark,
  Building2,
  Lock,
  MessageCircle,
  Zap,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { DEFAULT_PLAN, PLANS, PLAN_FEATURES, aedPrice, type PlanId } from '@/lib/pricing';
import { RevealText, Rise, Scene } from './primitives';
import { CorporateInvoiceModal } from '@/components/pricing/CorporateInvoiceModal';
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
  ['How do I pay by UAE Corporate Bank Wire (IBAN)?', 'Click the Proforma Invoice link below to generate an official UAE tax invoice with our Emirates NBD or Wio Bank IBAN.'],
] as const;

export function Pricing() {
  const [id, setId] = useState<PlanId>(DEFAULT_PLAN);
  const [faq, setFaq] = useState<number | null>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const plan = PLANS.find((p) => p.id === id) ?? PLANS[3]!;
  const idx = PLANS.findIndex((p) => p.id === id);
  const cardRef = useRef<HTMLDivElement>(null);
  const inView = useInView(cardRef, { once: true, amount: 0.3 });
  const reduce = useReducedMotion();
  const rx = useSpring(0, { stiffness: 160, damping: 20 });
  const ry = useSpring(0, { stiffness: 160, damping: 20 });

  const waEnterpriseUrl = `https://wa.me/971500000000?text=${encodeURIComponent(
    "Hello DealOS Team! I manage a team of 5+ property consultants in Dubai. I would like a quote for centralized brokerage seats and onboarding."
  )}`;

  return (
    <Scene id="pricing">
      <div className="d-container d-pr max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Heading */}
        <div className="d-section-heading text-center max-w-3xl mx-auto space-y-3">
          <span className="d-pill inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold font-mono bg-amber-500/10 text-amber-500 border border-amber-500/30">
            <Sparkles size={13} className="text-amber-500" />
            Official Launch Offer · Up to 54% Savings Applied
          </span>
          <RevealText>Institutional value./Zero hidden fees.</RevealText>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
            One comprehensive operating system with every feature. Choose your billing cadence. Cancel anytime.
          </p>

          {/* Luxury Segmented Billing Switcher */}
          <div className="pt-3">
            <div
              className="d-pr-toggle inline-grid grid-cols-4 p-1.5 rounded-full bg-secondary/80 border border-border shadow-sm max-w-xl w-full mx-auto relative"
              role="radiogroup"
              aria-label="Billing period"
              style={{ ['--i' as string]: idx }}
            >
              <span className="d-pr-indicator" aria-hidden />
              {PLANS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  role="radio"
                  aria-checked={p.id === id}
                  className={`flex flex-col items-center justify-center py-2 px-3 rounded-full text-xs font-bold transition-all relative z-10 cursor-pointer ${
                    p.id === id ? 'active text-white' : 'text-foreground hover:text-foreground/80'
                  }`}
                  onClick={() => setId(p.id)}
                >
                  <span>{p.label}</span>
                  {p.toggleBadge ? (
                    <small className={`text-[10px] font-mono font-bold mt-0.5 ${p.id === id ? 'text-white' : 'text-amber-500'}`}>
                      {p.toggleBadge}
                    </small>
                  ) : (
                    <small className="text-[10px] opacity-0">_</small>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ═══ REDESIGNED LUXURY PRICING HERO CARD ═══ */}
        <div className="mt-12 rounded-3xl border border-border/80 bg-card/95 backdrop-blur-2xl shadow-2xl p-6 sm:p-10 lg:p-12 relative overflow-hidden">
          {/* Top subtle ambient gradient accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-primary to-emerald-400" />

          {/* Floating Most Popular Badge for Annual */}
          {plan.highlighted && (
            <div className="absolute top-4 right-6 sm:top-6 sm:right-8">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-extrabold uppercase tracking-wider bg-amber-500 text-black shadow-md">
                <Sparkles size={12} />
                ★ Best Value · 54% Off
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* ── LEFT COLUMN: PRICING & CHECKOUT (5 Cols) ── */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-500">
                    Individual Broker License
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
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
              <div className="p-5 rounded-2xl bg-secondary/40 border border-border/60 space-y-2">
                <div className="flex items-baseline gap-2">
                  <s className="text-sm font-semibold text-muted-foreground line-through">
                    {aedPrice(plan.originalPrice)}
                  </s>
                  <span className="text-[11px] font-bold font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">
                    {plan.savingLabel}
                  </span>
                </div>

                <div className="flex items-baseline gap-2">
                  <strong className="text-4xl sm:text-5xl font-black text-foreground font-display tracking-tight">
                    <RollingPrice value={plan.price} />
                  </strong>
                  <span className="text-sm text-muted-foreground font-semibold">
                    {plan.period}
                  </span>
                </div>

                <p className="text-xs text-muted-foreground">
                  {plan.months > 1 ? (
                    <span className="font-mono font-bold text-foreground">
                      Equivalent to {aedPrice(plan.perMonth)} / month
                    </span>
                  ) : (
                    "Flexible 30-day billing · No lock-in"
                  )}
                  {plan.perMonthNote ? ` (${plan.perMonthNote})` : ""}
                </p>
              </div>

              {/* CTA Button */}
              <div className="space-y-2.5">
                <Button
                  asChild
                  className="w-full h-12 rounded-xl text-sm font-extrabold bg-gradient-to-r from-primary to-primary/90 hover:opacity-95 text-primary-foreground shadow-lg shadow-primary/25 gap-2 transition-all group"
                >
                  <Link to="/signup" search={{ plan: plan.id }}>
                    <span>Get Started Now</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>

                <p className="text-[11px] text-center text-muted-foreground flex items-center justify-center gap-1.5">
                  <ShieldCheck size={13} className="text-emerald-500" />
                  <span>Instant activation · 14-day money-back guarantee · Cancel anytime</span>
                </p>
              </div>

              {/* Payment Methods Badges */}
              <div className="space-y-2 pt-2 border-t border-border/60">
                <span className="text-[10px] uppercase font-mono font-bold text-muted-foreground block">
                  Accepted Payment Methods (Lemon Squeezy &amp; Stripe)
                </span>
                <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold text-foreground">
                  <span className="px-2.5 py-1 rounded-lg bg-secondary border border-border text-[11px] font-mono">Apple Pay</span>
                  <span className="px-2.5 py-1 rounded-lg bg-secondary border border-border text-[11px] font-mono">Google Pay</span>
                  <span className="px-2.5 py-1 rounded-lg bg-secondary border border-border text-[11px] font-mono">Visa</span>
                  <span className="px-2.5 py-1 rounded-lg bg-secondary border border-border text-[11px] font-mono">Mastercard</span>
                  <span className="px-2.5 py-1 rounded-lg bg-secondary border border-border text-[11px] font-mono">AMEX</span>
                  <span className="px-2.5 py-1 rounded-lg bg-secondary border border-border text-[11px] font-mono">PayPal</span>
                </div>
                <p className="text-[10px] text-muted-foreground flex items-center gap-1 pt-1">
                  <Lock size={11} className="text-muted-foreground" />
                  <span>256-Bit SSL Encrypted Checkout · Plus 5% UAE VAT with official Tax Invoice.</span>
                </p>
              </div>

              {/* UAE Corporate Bank Transfer Callout */}
              <div className="p-3.5 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-foreground">
                    <Landmark size={14} className="text-amber-500" />
                    <span>Paying by UAE Bank Wire (IBAN)?</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowInvoiceModal(true)}
                    className="text-[11px] font-bold text-amber-500 hover:underline cursor-pointer"
                  >
                    Generate Invoice ↗
                  </button>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Direct transfer to our Emirates NBD or Wio Bank corporate accounts.
                </p>
              </div>
            </div>

            {/* ── RIGHT COLUMN: STRUCTURED FEATURES & CAPABILITIES (7 Cols) ── */}
            <div className="lg:col-span-7 space-y-6 lg:border-l lg:border-border/60 lg:pl-10">
              <div className="space-y-1">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-500">
                  Included in Every License
                </span>
                <h4 className="text-lg font-bold text-foreground font-display">
                  Everything you need to source, pitch, and close Dubai property
                </h4>
                <p className="text-xs text-muted-foreground">
                  Zero tiered feature gates. You get the complete institutional suite from day one:
                </p>
              </div>

              {/* Structured Feature Categories Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Item 1 */}
                <div className="p-4 rounded-2xl bg-secondary/20 border border-border/60 space-y-1.5">
                  <div className="flex items-center gap-2 text-foreground font-bold text-xs">
                    <div className="size-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                      <Check size={12} />
                    </div>
                    <span>1,355+ Off-Plan Registry</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground pl-7">
                    Official UAE catalog with verified payment plans, milestones, and unit inventory.
                  </p>
                </div>

                {/* Item 2 */}
                <div className="p-4 rounded-2xl bg-secondary/20 border border-border/60 space-y-1.5">
                  <div className="flex items-center gap-2 text-foreground font-bold text-xs">
                    <div className="size-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                      <Check size={12} />
                    </div>
                    <span>DLD Market Context</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground pl-7">
                    Official Dubai Land Department registry stats with price/sq.ft and rental yield heatmaps.
                  </p>
                </div>

                {/* Item 3 */}
                <div className="p-4 rounded-2xl bg-secondary/20 border border-border/60 space-y-1.5">
                  <div className="flex items-center gap-2 text-foreground font-bold text-xs">
                    <div className="size-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                      <Check size={12} />
                    </div>
                    <span>1-Click WhatsApp Pitch</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground pl-7">
                    Instant tailored investor scripts formatted for WhatsApp with payment plan breakdowns.
                  </p>
                </div>

                {/* Item 4 */}
                <div className="p-4 rounded-2xl bg-secondary/20 border border-border/60 space-y-1.5">
                  <div className="flex items-center gap-2 text-foreground font-bold text-xs">
                    <div className="size-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                      <Check size={12} />
                    </div>
                    <span>WhatsApp Voice Transcriber</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground pl-7">
                    Whisper AI transcribes client audio notes &amp; live drive-time mic directly into CRM leads.
                  </p>
                </div>

                {/* Item 5 */}
                <div className="p-4 rounded-2xl bg-secondary/20 border border-border/60 space-y-1.5">
                  <div className="flex items-center gap-2 text-foreground font-bold text-xs">
                    <div className="size-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                      <Check size={12} />
                    </div>
                    <span>Bespoke Investor Lead Dossiers</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground pl-7">
                    Prioritized speed-to-lead queue (Hot, Warm, Follow-ups) with full client criteria matching.
                  </p>
                </div>

                {/* Item 6 */}
                <div className="p-4 rounded-2xl bg-secondary/20 border border-border/60 space-y-1.5">
                  <div className="flex items-center gap-2 text-foreground font-bold text-xs">
                    <div className="size-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                      <Check size={12} />
                    </div>
                    <span>Client Presentation Mode</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground pl-7">
                    100% white-label client view that hides agency internal commission margins during live meetings.
                  </p>
                </div>
              </div>

              {/* Agency / Team Provisioning Callout */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-secondary/50 via-secondary/20 to-secondary/40 border border-border/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                    <Users size={16} />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-foreground block">
                      Solo Setup · Agency Activation Ready
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      Start solo today. Join your brokerage team or invite other agents with 1 click anytime.
                    </span>
                  </div>
                </div>

                <a
                  href={waEnterpriseUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground font-bold text-xs border border-border shrink-0 transition-all"
                >
                  <MessageCircle size={13} className="text-emerald-500" />
                  <span>Team Rates (5+ Seats)</span>
                </a>
              </div>
            </div>
          </div>
        </div>

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
        defaultPlan={`Solo Broker (${plan.label} · AED ${plan.price})`}
      />
    </Scene>
  );
}
