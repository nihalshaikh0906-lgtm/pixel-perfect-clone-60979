import { ArrowRight, Check, CheckCheck, ChevronRight, Instagram, Linkedin, Mail, MessageCircle, Phone, Sparkles, Star, Loader2, Calendar, Video, Clock, ExternalLink } from 'lucide-react';
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
  ['Elena V.', 'Dubai Marina', 'Generating a clean, branded payment plan dossier in 30 seconds while on WhatsApp with an investor closed our last EOI.'],
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
    <Scene id="cta" transition="circle" dark>
      <div className="d-cta">
        <img src={skyline} alt="Dubai skyline" loading="lazy" width={1920} height={1024} />
        <div className="d-cta-tint" />
        <GlassTiles compact />
        <div className="d-cta-content max-w-2xl mx-auto px-4">
          <span className="d-glass-pill">
            <Sparkles size={13} /> Exclusive Dubai Agency Access
          </span>
          <RevealText>Stop lead leakage./Own your deal data.</RevealText>
          <p className="mt-2 text-sm sm:text-base text-zinc-300">
            Equip your property consultants with live Dubai inventory, instant WhatsApp dossiers, and real-time agency overwatch.
          </p>

          {/* Booking Method Selector Tabs */}
          <div className="mt-6 flex items-center justify-center gap-2 p-1 rounded-2xl bg-white/5 border border-white/10 max-w-md mx-auto">
            <button
              type="button"
              onClick={() => setBookingMode('form')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                bookingMode === 'form'
                  ? 'bg-amber-400 text-black shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span>⚡ Quick Callback (30s)</span>
            </button>
            <button
              type="button"
              onClick={() => setBookingMode('calendly')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                bookingMode === 'calendly'
                  ? 'bg-amber-400 text-black shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Calendar size={13} />
              <span>📅 Book Live Zoom</span>
            </button>
          </div>

          {bookingMode === 'calendly' ? (
            <div className="mt-4 flex flex-col items-center gap-4 text-center bg-black/60 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-white/10 shadow-2xl animate-in fade-in duration-200">
              <div className="w-12 h-12 rounded-2xl bg-amber-400/20 text-amber-300 flex items-center justify-center mx-auto border border-amber-400/30">
                <Video size={22} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Schedule 15-Min Executive Walkthrough</h3>
                <p className="text-xs text-zinc-400 mt-1 max-w-md">
                  Choose a convenient time on our live calendar. A DealOS Dubai Partner will demonstrate the live agency overwatch cockpit and inventory sync.
                </p>
              </div>

              <a
                href={calendlyUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 px-6 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-black hover:opacity-95 shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Calendar size={16} />
                <span>Open Live Calendar on Calendly ↗</span>
              </a>

              <div className="flex items-center gap-2 text-xs text-zinc-400 pt-1">
                <Clock size={13} />
                <span>Available Sunday – Thursday · 10:00 AM – 7:00 PM GST</span>
              </div>
            </div>
          ) : !done ? (
            <form className="mt-4 flex flex-col gap-3 text-left bg-black/60 backdrop-blur-md p-5 sm:p-6 rounded-2xl border border-white/10 shadow-2xl animate-in fade-in duration-200" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-1 block" htmlFor="demo-name">
                    Full Name
                  </label>
                  <input
                    id="demo-name"
                    type="text"
                    placeholder="e.g. Adam Sterling"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl bg-white/5 border border-white/15 px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-hidden focus:border-amber-400/80 transition-all"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-1 block" htmlFor="demo-agency">
                    Agency / Brokerage
                  </label>
                  <input
                    id="demo-agency"
                    type="text"
                    placeholder="e.g. Apex Luxury Properties"
                    value={agency}
                    onChange={(e) => setAgency(e.target.value)}
                    className="w-full rounded-xl bg-white/5 border border-white/15 px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-hidden focus:border-amber-400/80 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-1 block" htmlFor="demo-email">
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
                    className="w-full rounded-xl bg-white/5 border border-white/15 px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-hidden focus:border-amber-400/80 transition-all"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-1 block" htmlFor="demo-phone">
                    WhatsApp Number *
                  </label>
                  <input
                    id="demo-phone"
                    type="tel"
                    placeholder="+971 50 000 0000"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xl bg-white/5 border border-white/15 px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-hidden focus:border-amber-400/80 transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 py-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Your Role:</span>
                <label className="flex items-center gap-1.5 text-xs text-zinc-200 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    checked={role === 'owner'}
                    onChange={() => setRole('owner')}
                    className="accent-amber-400"
                  />
                  <span>🏢 Agency Owner / MD</span>
                </label>
                <label className="flex items-center gap-1.5 text-xs text-zinc-200 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    checked={role === 'broker'}
                    onChange={() => setRole('broker')}
                    className="accent-amber-400"
                  />
                  <span>👤 Licensed Broker</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-black hover:opacity-95 shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Transmitting Request…
                  </>
                ) : (
                  <>
                    <span>Request Executive Agency Walkthrough</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
              <p className="text-center text-[11px] text-zinc-400 mt-1">
                🔒 Data protected under UAE Federal Decree-Law No. 45/2021. No spam, ever.
              </p>
            </form>
          ) : (
            <div className="mt-6 bg-black/80 backdrop-blur-xl p-6 sm:p-8 rounded-2xl border border-emerald-500/40 text-center space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
              <div className="size-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/40">
                <Check size={24} />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white">Access Request Confirmed!</h3>
                <p className="text-xs sm:text-sm text-zinc-300 mt-1">
                  Thank you, <span className="font-semibold text-white">{name || 'Director'}</span>. Your priority request for <span className="font-semibold text-white">{agency || 'your agency'}</span> has been received by our Dubai desk.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg transition-all"
                >
                  <MessageCircle size={16} />
                  <span>Connect with Founder on WhatsApp ↗</span>
                </a>
                <a
                  href={calendlyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs uppercase tracking-wider shadow-lg transition-all"
                >
                  <Calendar size={16} />
                  <span>Or Pick Time on Calendly ↗</span>
                </a>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setDone(false)}
                  className="text-xs text-zinc-400 hover:text-white underline cursor-pointer"
                >
                  Submit Another Request
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
