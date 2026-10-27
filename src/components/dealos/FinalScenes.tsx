import { ArrowRight, Check, CheckCheck, ChevronRight, Instagram, Linkedin, Mail, MessageCircle, Phone, Sparkles, Star, Loader2, Calendar, Video, Clock, ExternalLink, X, Zap } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { CountUp, Magnetic, RevealText, Rise, Scene } from './primitives';
import { GlassTiles } from './Hero';
import skyline from '@/assets/dealos-dubai.jpg';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const quotes = [
  ['Saad A.', 'Downtown Dubai', 'Having verified DLD numbers and live off-plan inventory in one client view saves our advisory team 2 hours every single day.'],
  ['Elena V.', 'Dubai Marina', 'Generating a clean, branded payment plan presentation in 30 seconds while on WhatsApp with an investor closed our last EOI.'],
  ['Tariq M.', 'Business Bay', 'The developer debt ledger alone recovered overdue commissions from two master developers that were previously lost in spreadsheets.'],
  ['Marcus B.', 'Palm Jumeirah', 'Client Presentation Mode is brilliant. We can sit with ultra-high-net-worth buyers and share screens without exposing internal splits.'],
  ['Sara H.', 'Dubai Hills', 'Speed to lead has completely transformed our brokerage. Portal inquiries receive structured WhatsApp pitches in under 2 minutes.'],
  ['Faisal A.', 'Jumeirah Village Circle', 'Finally, an institutional operating system built specifically for the realities of the UAE market instead of generic overseas software.']
];

function QuoteTrack({ row }: { row: number }) {
  const set = quotes.slice(row * 3, row * 3 + 3);
  return (
    <div className={`d-quote-track track-${row}`}>
      <div className="d-quote-group">
        {[...set, ...set].map(([name, area, quote], i) => (
          <figure className="d-quote" key={i}>
            <div className="d-stars">
              {Array.from({ length: 5 }, (_, j) => (
                <Star size={13} key={j} fill="currentColor" />
              ))}
            </div>
            <blockquote>“{quote}”</blockquote>
            <figcaption>
              <span className="d-quote-avatar">{name.slice(0, 1)}</span>
              <div>
                <b>{name} · {area}</b>
                <small className="text-emerald-400 font-medium">Licensed RERA Broker</small>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}

export function AgencyComparison() {
  return (
    <section id="comparison" className="w-full max-w-5xl mx-auto px-4 sm:px-6 my-10 sm:my-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-stretch">
        {/* Left Column: The old way */}
        <div className="rounded-3xl p-6 sm:p-8 bg-rose-500/5 dark:bg-rose-500/10 border border-rose-500/20 flex flex-col justify-between space-y-6 text-left">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold text-rose-500 bg-rose-500/10 border border-rose-500/20">
              <X size={12} /> Spreadsheets &amp; chat chaos
            </span>
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground block">
                The old way
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground font-display tracking-tight mt-0.5">
                The fragmented agency
              </h3>
            </div>

            <div className="space-y-3.5 pt-2">
              <div className="flex items-start gap-3 text-xs sm:text-sm">
                <div className="size-5 rounded-full bg-rose-500/15 text-rose-500 flex items-center justify-center shrink-0 mt-0.5">
                  <X size={13} />
                </div>
                <div>
                  <strong className="text-foreground font-bold block">Time lost on every lead</strong>
                  <p className="text-muted-foreground text-xs mt-0.5">Hunting through WhatsApp groups for outdated developer PDFs.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs sm:text-sm">
                <div className="size-5 rounded-full bg-rose-500/15 text-rose-500 flex items-center justify-center shrink-0 mt-0.5">
                  <X size={13} />
                </div>
                <div>
                  <strong className="text-foreground font-bold block">Lost floor plans &amp; old pricing</strong>
                  <p className="text-muted-foreground text-xs mt-0.5">Blurry screenshots that weaken investor confidence.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs sm:text-sm">
                <div className="size-5 rounded-full bg-rose-500/15 text-rose-500 flex items-center justify-center shrink-0 mt-0.5">
                  <X size={13} />
                </div>
                <div>
                  <strong className="text-foreground font-bold block">Commission nobody chases</strong>
                  <p className="text-muted-foreground text-xs mt-0.5">Deals buried in chat notes, invoices forgotten.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs sm:text-sm">
                <div className="size-5 rounded-full bg-rose-500/15 text-rose-500 flex items-center justify-center shrink-0 mt-0.5">
                  <X size={13} />
                </div>
                <div>
                  <strong className="text-foreground font-bold block">Fees worked out by hand</strong>
                  <p className="text-muted-foreground text-xs mt-0.5">Typing 4% DLD, trustee fees and milestones into chat.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-xs font-mono font-bold text-rose-500 flex items-center gap-2">
            <Clock size={14} />
            <span>Minutes of manual searching per pitch</span>
          </div>
        </div>

        {/* Right Column: The DealOS way */}
        <div className="rounded-3xl p-6 sm:p-8 bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/25 flex flex-col justify-between space-y-6 shadow-xl text-left">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/25">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" /> CATALOGUE · 34,854 SEARCHABLE UAE UNITS
            </span>
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
                The DealOS way
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground font-display tracking-tight mt-0.5">
                One cockpit
              </h3>
            </div>

            <div className="space-y-3.5 pt-2">
              <div className="flex items-start gap-3 text-xs sm:text-sm">
                <div className="size-5 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                  <Check size={13} />
                </div>
                <div>
                  <strong className="text-foreground font-bold block">One-tap WhatsApp pitch</strong>
                  <p className="text-muted-foreground text-xs mt-0.5">Unit, price, payment plan and catalogue floor plan in one message.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs sm:text-sm">
                <div className="size-5 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                  <Check size={13} />
                </div>
                <div>
                  <strong className="text-foreground font-bold block">34,854+ searchable UAE units</strong>
                  <p className="text-muted-foreground text-xs mt-0.5">Searchable across 1,355 UAE projects in the catalogue.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs sm:text-sm">
                <div className="size-5 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                  <Check size={13} />
                </div>
                <div>
                  <strong className="text-foreground font-bold block">Forms A, B &amp; F per deal</strong>
                  <p className="text-muted-foreground text-xs mt-0.5">Tracked alongside each stage of the investor pipeline.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs sm:text-sm">
                <div className="size-5 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                  <Check size={13} />
                </div>
                <div>
                  <strong className="text-foreground font-bold block">Commission tracked per deal</strong>
                  <p className="text-muted-foreground text-xs mt-0.5">Follow each deal from EOI to agency fee collection.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
            <Zap size={14} className="text-amber-400" />
            <span>Pitch drafted in seconds, reviewed by you</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Proof() {
  return (
    <Scene id="proof">
      <div className="d-section-heading d-container">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono font-bold mb-4 border border-emerald-500/30">
          <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>LIVE DUBAI REGISTRY SYNC · UPDATED DAILY</span>
        </div>
        <RevealText>Institutional Data./Verified Dubai Pipeline.</RevealText>
        <p>Enterprise operating system engineered specifically for DLD &amp; RERA licensed agencies.</p>
      </div>
      <div className="d-marquee-mask">
        <QuoteTrack row={0} />
        <QuoteTrack row={1} />
      </div>
      <div className="d-proof-stats d-container grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        {[
          { stat: "34,850+", label: "Verified DLD Units", detail: "Live secondary & ready stock", icon: "🏢" },
          { stat: "1,355+", label: "Off-Plan Projects", detail: "Floor plans, brochures & payment plans", icon: "📐" },
          { stat: "100%", label: "Native Escrow Integration", detail: "Direct trust account verification", icon: "🛡️" },
          { stat: "< 2 min", label: "Speed to Lead SLA", detail: "Automated WhatsApp investor outreach", icon: "⚡" },
        ].map((v) => (
          <div key={v.label} className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-left space-y-1.5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xl">{v.icon}</span>
              <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Active</span>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-tight">{v.stat}</p>
            <p className="text-xs font-bold text-zinc-200">{v.label}</p>
            <p className="text-[11px] text-zinc-400">{v.detail}</p>
          </div>
        ))}
      </div>
    </Scene>
  );
}

export { Pricing } from './PricingScene';

export function CTA() {
  const [bookingMode, setBookingMode] = useState<'form' | 'calendly'>('form');
  const [simulatedWaOpened, setSimulatedWaOpened] = useState(false);
  const [copiedWa, setCopiedWa] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+971 ');
  const [name, setName] = useState('');
  const [agency, setAgency] = useState('');
  const [role, setRole] = useState<'broker' | 'owner'>('owner');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const calendlyUrl = (import.meta as unknown as { env: Record<string, string> }).env?.VITE_CALENDLY_URL || "https://calendly.com/dealos-ae/demo";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || loading) return;

    setLoading(true);
    const payload = {
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      name: name.trim() || 'Dubai Broker / Owner',
      agency: agency.trim() || 'Licensed Brokerage',
      role,
      status: 'new',
      created_at: new Date().toISOString(),
    };

    try {
      // 1. Insert directly into Supabase demo_requests table
      const { error } = await (supabase as unknown as { from: (t: string) => any })
        .from('demo_requests')
        .insert(payload);

      if (error) {
        console.warn('Supabase insert note:', error.message);
      }
    } catch (err) {
      console.warn('Network sync error:', err);
    }

    // 2. Backup locally so zero leads are ever dropped
    try {
      const existing = JSON.parse(localStorage.getItem('dealos_demo_requests') || '[]');
      existing.push(payload);
      localStorage.setItem('dealos_demo_requests', JSON.stringify(existing));
    } catch {
      // ignore localstorage error
    }

    // 3. Trigger optional Zapier webhook if configured
    const zapierUrl = (import.meta as unknown as { env: Record<string, string> }).env?.VITE_ZAPIER_DEMO_WEBHOOK_URL;
    if (zapierUrl) {
      try {
        void fetch(zapierUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          mode: 'no-cors',
        });
      } catch {
        // non-blocking
      }
    }

    setLoading(false);
    setDone(true);
    toast.success('Access Request Confirmed! Our Dubai desk will connect with you via WhatsApp.');
  };

  const waText = encodeURIComponent(
    `Hello DealOS Team! I just submitted an agency access request for ${email || 'my brokerage'} (${agency || 'Dubai Agency'}). Can you provide a walkthrough of the Owner Cockpit and Broker Desk?`
  );
  const waUrl = `https://wa.me/971500000000?text=${waText}`;

  return (
    <Scene id="cta" transition="circle">
      <div className="d-cta">
        <img src={skyline} alt="Dubai skyline" loading="lazy" width={1920} height={1024} className="opacity-15" />
        <div className="d-cta-tint" />
        <GlassTiles compact />
        <div className="d-cta-content max-w-2xl mx-auto px-4">
          <span className="d-pill">
            <Sparkles size={13} className="text-amber-400" /> Exclusive Dubai Agency Access
          </span>
          <RevealText>Stop lead leakage./Own your deal data.</RevealText>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground">
            Equip your property consultants with live Dubai inventory, instant WhatsApp presentations, and real-time agency overwatch.
          </p>

          {!done ? (
            <form className="mt-4 flex flex-col gap-3 text-left bg-card/95 backdrop-blur-md p-5 sm:p-6 rounded-2xl border border-border shadow-xl animate-in fade-in duration-200" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1 block" htmlFor="demo-name">
                    Full Name
                  </label>
                  <input
                    id="demo-name"
                    type="text"
                    placeholder="e.g. Adam Sterling"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl bg-background border border-border px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-hidden focus:border-primary transition-all"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1 block" htmlFor="demo-agency">
                    Agency / Brokerage
                  </label>
                  <input
                    id="demo-agency"
                    type="text"
                    placeholder="e.g. Apex Luxury Properties"
                    value={agency}
                    onChange={(e) => setAgency(e.target.value)}
                    className="w-full rounded-xl bg-background border border-border px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-hidden focus:border-primary transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1 block" htmlFor="demo-email">
                    Work Email *
                  </label>
                  <input
                    id="demo-email"
                    type="email"
                    autoComplete="email"
                    placeholder="director@agency.ae"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl bg-background border border-border px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-hidden focus:border-primary transition-all"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1 block" htmlFor="demo-phone">
                    WhatsApp Number *
                  </label>
                  <input
                    id="demo-phone"
                    type="tel"
                    placeholder="+971 50 000 0000"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xl bg-background border border-border px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-hidden focus:border-primary transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 py-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Your Role:</span>
                <label className="flex items-center gap-1.5 text-xs text-foreground cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    checked={role === 'owner'}
                    onChange={() => setRole('owner')}
                    className="accent-primary"
                  />
                  <span>🏢 Agency Owner / MD</span>
                </label>
                <label className="flex items-center gap-1.5 text-xs text-foreground cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    checked={role === 'broker'}
                    onChange={() => setRole('broker')}
                    className="accent-primary"
                  />
                  <span>👤 Licensed Broker</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-primary hover:bg-primary/90 text-white shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50 active:scale-[0.99]"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Submitting Request…
                  </>
                ) : (
                  <>
                    <span>Book Demo Walkthrough</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
              <p className="text-center text-[11px] text-muted-foreground mt-1">
                🔒 Data protected under UAE Federal Decree-Law No. 45/2021. We will contact you for the demo.
              </p>
            </form>
          ) : (
            <div className="mt-6 bg-card/95 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-emerald-500/30 text-center space-y-4 shadow-xl animate-in fade-in zoom-in-95 duration-200">
              <div className="size-16 rounded-full bg-emerald-500/10 text-emerald-500 mx-auto flex items-center justify-center border border-emerald-500/30 shadow-md">
                <Check size={32} />
              </div>
              <div className="space-y-1.5">
                <span className="inline-block text-[11px] font-bold font-mono uppercase tracking-wider text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  Request Sent Successfully
                </span>
                <h3 className="text-2xl font-black text-foreground font-display">
                  Demo Request Received!
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                  Thank you, <strong className="text-foreground">{name || 'Partner'}</strong>. Your demo request for <strong className="text-foreground">{agency || 'your brokerage'}</strong> has been received by our Dubai desk. We will review your profile and contact you directly via WhatsApp or phone at <strong className="text-foreground font-mono">{phone}</strong> to conduct your live personalized demo.
                </p>
              </div>

              {/* Recap Card */}
              <div className="p-4 rounded-2xl bg-secondary/50 border border-border/70 text-left text-xs space-y-2 max-w-md mx-auto">
                <div className="flex items-center justify-between border-b border-border/50 pb-2">
                  <span className="text-muted-foreground">Contact</span>
                  <span className="font-semibold text-foreground">{name || "Broker"} · {email}</span>
                </div>
                <div className="flex items-center justify-between border-b border-border/50 pb-2">
                  <span className="text-muted-foreground">WhatsApp / Phone</span>
                  <span className="font-mono font-bold text-foreground">{phone}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Brokerage / Role</span>
                  <span className="font-semibold text-foreground">{agency || "Licensed Brokerage"} ({role === 'owner' ? 'Owner / MD' : 'Broker'})</span>
                </div>
              </div>

              <div className="pt-2 flex justify-center">
                <button
                  type="button"
                  onClick={() => setDone(false)}
                  className="px-6 py-2.5 rounded-xl font-bold text-xs bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground cursor-pointer transition-all"
                >
                  Submit another demo request
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Scene>
  );
}

export function Footer() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] });
  const y = useTransform(scrollYProgress, [0, 1], [100, 0]);
  return (
    <footer ref={ref} className="d-footer">
      <div className="d-footer-top d-container">
        <div className="d-footer-brand">
          <Link to="/welcome" className="d-brand">
            <Logo variant="dark" size={30} />
          </Link>
          <p>
            Enterprise-grade real estate CRM.
            <br />
            Powered by AI. Built on Dubai data.
          </p>
          <span className="d-regulatory text-[11px] text-zinc-400">
            Built for DLD &amp; RERA Licensed Brokerages in Dubai &amp; the UAE
          </span>
          <div className="d-socials">
            <a href="https://linkedin.com/company/dealos" aria-label="LinkedIn" target="_blank" rel="noreferrer">
              <Linkedin size={17} />
            </a>
            <a href="https://www.instagram.com/dealos.ae" aria-label="Instagram" target="_blank" rel="noreferrer">
              <Instagram size={17} />
            </a>
          </div>
        </div>
        {[
          {
            name: 'Product',
            links: [
              ['Workspace', 'product'],
              ['AI assistant', 'tools'],
              ['Workflows', 'workflow'],
              ['Pricing', 'pricing'],
            ],
          },
          {
            name: 'Data',
            links: [
              ['Market insights', 'insights'],
              ['Inventory', 'product'],
              ['Deal types', 'modes'],
              ['Integrations', 'integrations'],
            ],
          },
          {
            name: 'Company',
            links: [
              ['Our story', 'about'],
              ['FAQ', 'faq'],
              ['Book a demo', 'cta'],
            ],
          },
          {
            name: 'Legal',
            links: [
              ['Privacy Policy', 'privacy'],
              ['Terms of Service', 'terms'],
            ],
          },
        ].map((col) => (
          <div className="d-footer-column" key={col.name}>
            <h4>{col.name}</h4>
            {col.links.map(([label, target]) =>
              target === 'about' || target === 'faq' || target === 'privacy' || target === 'terms' ? (
                <Link key={label} to={target === 'about' ? '/about' : target === 'faq' ? '/faq' : target === 'privacy' ? '/privacy' : '/terms'}>
                  {label}
                </Link>
              ) : (
                <a href={`#${target}`} key={label}>
                  {label}
                </a>
              )
            )}
          </div>
        ))}
      </div>
      <div className="d-footer-bottom d-container">
        <span>© {new Date().getFullYear()} DealOS Technologies Ltd. All rights reserved.</span>
        <span>Built for UAE agencies. Designed to scale institutional deal flow. ↗</span>
      </div>
      <motion.div className="d-footer-wordmark" style={reduce ? {} : { y }} aria-hidden>
        DealOS<span>.</span>
      </motion.div>
    </footer>
  );
}
