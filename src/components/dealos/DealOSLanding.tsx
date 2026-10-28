import { motion, useReducedMotion, useScroll } from 'framer-motion';
import { Logo } from '@/components/Logo';
import { Link } from '@tanstack/react-router';
import { Menu, X } from 'lucide-react';
import { memo, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Hero } from './Hero';
import { LiveDubaiMarketTicker } from './LiveDubaiMarketTicker';
import { LiveDubaiPulse } from './LiveDubaiPulse';
import { InteractiveDeviceShowcase } from './InteractiveDeviceShowcase';
import { Product, Insights } from './ProductScenes';
import { Integrations, Tools, Workflow, Modes } from './ToolsScenes';
import { Proof, Pricing, CTA, Footer, AgencyComparison } from './FinalScenes';
import { DemoBookingModal } from './DemoBookingModal';
import { WhatsAppInteractivePitchModal } from './WhatsAppInteractivePitchModal';
import { Magnetic } from './primitives';
import { Sparkles, Video } from 'lucide-react';

import { CockpitDemoSection, SeeTheBrokerHeader } from './CockpitDemoSection';

const scenes=['Hero','Product','Insights','Integrations','Tools','Workflow','Modes','Proof','Pricing','CTA'];

interface NavItemConfig {
  label: string;
  id: string;
  targetId: string;
  sections: string[];
}

const NAV_ITEMS: NavItemConfig[] = [
  {
    label: 'Cockpit',
    id: 'cockpit',
    targetId: 'cockpit',
    sections: ['hero', 'cockpit', 'product'],
  },
  {
    label: 'How it works',
    id: 'how-it-works',
    targetId: 'workflow',
    sections: ['workflow', 'insights'],
  },
  {
    label: 'Modules',
    id: 'modules',
    targetId: 'tools',
    sections: ['tools', 'integrations', 'modes'],
  },
  {
    label: 'Try a quote',
    id: 'try-a-quote',
    targetId: 'pricing',
    sections: ['pricing'],
  },
  {
    label: 'Our rules',
    id: 'our-rules',
    targetId: 'proof',
    sections: ['proof', 'comparison', 'cta'],
  },
];

const LandingScenes = memo(function LandingScenes({ onOpenDemo }: { onOpenDemo: () => void }) {
  return (
    <>
      <Hero />
      <LiveDubaiMarketTicker />
      <LiveDubaiPulse />
      <InteractiveDeviceShowcase />
      <Product />
      <Insights />
      <Integrations />
      <Tools />
      <Workflow />
      <Modes />
      <AgencyComparison />
      <Proof />
      <Pricing />
      <CTA />
      <Footer />
    </>
  );
});
export function DealOSLanding() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('Hero');
  const [activeNav, setActiveNav] = useState('cockpit');
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const [menu, setMenu] = useState(false);
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [intro, setIntro] = useState<'full' | 'quick' | 'done'>('full');

  useEffect(() => {
    setIntro('full');
    const t = setTimeout(() => setIntro('done'), 800);
    const onScroll = () => {
      if (window.scrollY > 20) setIntro('done');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      clearTimeout(t);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const isPast = window.scrollY > 40;
          setScrolled((prev) => (prev !== isPast ? isPast : prev));
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    const sectionToNavTab: Record<string, string> = {
      hero: 'cockpit',
      cockpit: 'cockpit',
      product: 'cockpit',
      insights: 'how-it-works',
      workflow: 'how-it-works',
      integrations: 'modules',
      tools: 'modules',
      modes: 'modules',
      comparison: 'our-rules',
      proof: 'our-rules',
      pricing: 'try-a-quote',
      cta: 'our-rules',
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.id.toLowerCase();
            const navId = sectionToNavTab[id];
            if (navId) setActiveNav(navId);
            const matched = scenes.find((s) => s.toLowerCase() === id);
            if (matched) setActive(matched);
          }
        }
      },
      { rootMargin: '-10% 0px -40% 0px', threshold: 0.15 }
    );

    const observedIds = [
      'hero',
      'cockpit',
      'product',
      'insights',
      'integrations',
      'tools',
      'workflow',
      'modes',
      'comparison',
      'proof',
      'pricing',
      'cta',
    ];

    observedIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener('scroll', onScroll);
      observer.disconnect();
    };
  }, []);

  const go = (id: string) => {
    setMenu(false);
    setActiveNav(id);
    const target =
      id === 'cockpit'
        ? (document.getElementById('cockpit') || document.getElementById('product'))
        : id === 'how-it-works' || id === 'workflow'
        ? document.getElementById('workflow')
        : id === 'modules' || id === 'tools'
        ? document.getElementById('tools')
        : id === 'try-a-quote' || id === 'quote' || id === 'pricing'
        ? document.getElementById('pricing')
        : id === 'our-rules' || id === 'rules' || id === 'proof'
        ? (document.getElementById('proof') || document.getElementById('comparison'))
        : document.getElementById(id);
    target?.scrollIntoView({ behavior: reduce ? 'instant' : 'smooth' });
  };

  return (
    <main className={`dealos ${scrolled ? 'is-scrolled' : ''}`} data-intro={intro}>
      <motion.div className="d-scroll-progress" style={{ scaleX: scrollYProgress }} />
      <header className={`d-navbar ${scrolled ? 'scrolled' : ''}`}>
        <Link to="/welcome" className="d-brand" aria-label="DealOS home">
          <Logo variant="dark" size={30} />
        </Link>
        <nav
          aria-label="Main navigation"
          className="relative hidden md:flex items-center p-1 rounded-full bg-slate-900/[0.04] dark:bg-white/[0.06] border border-border/50 backdrop-blur-md shadow-2xs"
          onMouseLeave={() => setHoveredNav(null)}
        >
          {NAV_ITEMS.map((item) => {
            const isCurrent = activeNav === item.id;
            const isHovered = hoveredNav === item.id;

            return (
              <motion.button
                key={item.id}
                type="button"
                onClick={() => go(item.id)}
                onMouseEnter={() => setHoveredNav(item.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                className={`relative z-10 inline-flex items-center justify-center px-4 py-2 rounded-full text-xs transition-colors duration-200 cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  isCurrent
                    ? 'text-foreground font-black'
                    : 'text-muted-foreground hover:text-foreground font-bold'
                }`}
              >
                {/* Active Sliding Pill with Smooth Spring Physics */}
                {isCurrent && (
                  <motion.div
                    layoutId="live-nav-active-pill"
                    className="absolute inset-0 rounded-full bg-white dark:bg-slate-900 shadow-md border border-black/[0.08] dark:border-white/[0.12] -z-10"
                    transition={{ type: 'spring', stiffness: 420, damping: 30 }}
                  />
                )}

                {/* Hover Gliding Ghost Pill */}
                {isHovered && !isCurrent && (
                  <motion.div
                    layoutId="live-nav-hover-pill"
                    className="absolute inset-0 rounded-full bg-foreground/[0.05] dark:bg-white/[0.08] -z-10 pointer-events-none"
                    transition={{ type: 'spring', stiffness: 480, damping: 32 }}
                  />
                )}

                {/* Underline Live Glow Accent Bar */}
                {isCurrent && (
                  <motion.div
                    layoutId="live-nav-glow"
                    className="absolute -bottom-0.5 left-3 right-3 h-[2px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent rounded-full shadow-[0_0_8px_rgba(16,185,129,0.9)]"
                    transition={{ type: 'spring', stiffness: 420, damping: 30 }}
                  />
                )}

                {/* Content with pulsating live radar dot */}
                <span className="relative z-10 flex items-center gap-1.5">
                  {isCurrent && (
                    <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.9)]" />
                    </span>
                  )}
                  <span className="tracking-tight">{item.label}</span>
                </span>
              </motion.button>
            );
          })}
        </nav>
        <div className="d-nav-actions flex items-center gap-2">
          <Button asChild variant="ghost" size="sm" className="h-9 px-3.5 rounded-xl text-foreground hover:text-primary text-xs font-bold">
            <Link to="/login" search={{ mode: undefined }}>
              <span>Sign In ↗</span>
            </Link>
          </Button>
          <div className="hidden md:inline-flex">
            <Magnetic className="d-button d-button-primary cursor-pointer text-xs h-9 px-4 rounded-xl" onClick={() => setDemoModalOpen(true)}>
              Book a demo <span>↗</span>
            </Magnetic>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="d-mobile-menu-button text-foreground size-9 rounded-xl"
            aria-label={menu ? 'Close menu' : 'Open menu'}
            onClick={() => setMenu((v) => !v)}
          >
            {menu ? <X size={19} /> : <Menu size={19} />}
          </Button>
        </div>
      </header>

      {/* Mobile Live-Animated Sticky Pill Ribbon */}
      {!menu && (
        <div className="md:hidden sticky top-[60px] z-30 w-full px-3 py-1 pointer-events-none">
          <div className="pointer-events-auto max-w-full mx-auto p-1 rounded-full bg-card/92 backdrop-blur-xl border border-border/80 shadow-md shadow-black/5 flex items-center gap-1 overflow-x-auto scrollbar-none">
            {NAV_ITEMS.map((item) => {
              const isCurrent = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => go(item.id)}
                  className={`relative px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer active:scale-95 shrink-0 ${
                    isCurrent
                      ? 'text-foreground font-black bg-white dark:bg-slate-900 shadow-sm border border-border/80'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {isCurrent && (
                      <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.9)]" />
                      </span>
                    )}
                    <span>{item.label}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
      {menu ? (
        <div className="d-mobile-menu animate-in fade-in-50 zoom-in-95 duration-150">
          <div className="w-full flex items-center justify-between pb-2 mb-2 border-b border-border/60">
            <span className="text-xs font-bold text-foreground">Cockpit Navigation</span>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-emerald-500 font-semibold">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Active
            </span>
          </div>
          <div className="flex flex-col gap-1 w-full mb-3">
            {NAV_ITEMS.map((item) => {
              const isCurrent = activeNav === item.id;
              return (
                <Button
                  key={item.id}
                  variant={isCurrent ? 'secondary' : 'ghost'}
                  className={`justify-between text-xs h-9 rounded-xl ${
                    isCurrent ? 'font-black text-foreground bg-primary/10 border border-primary/20' : 'font-semibold text-muted-foreground'
                  }`}
                  onClick={() => go(item.id)}
                >
                  <span className="flex items-center gap-2">
                    {isCurrent && (
                      <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                    )}
                    <span>{item.label}</span>
                  </span>
                  <span className="text-[10px] font-mono text-muted-foreground">Explore →</span>
                </Button>
              );
            })}
          </div>
          <div className="grid grid-cols-2 gap-2 w-full pt-2 border-t border-border/50">
            <Button
              asChild
              className="h-10 rounded-xl text-xs font-extrabold bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm gap-1"
            >
              <Link to="/demo">
                <Sparkles size={13} className="text-amber-300" />
                <span>Live Demo ⚡</span>
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-10 rounded-xl text-xs font-bold border-border text-foreground hover:bg-secondary"
            >
              <Link to="/login" search={{ mode: undefined }}>
                <span>Sign In ↗</span>
              </Link>
            </Button>
          </div>
        </div>
      ) : null}
      <aside className="d-dot-nav" aria-label="Scene navigation">
        {scenes.map((name) => (
          <Button
            key={name}
            variant="ghost"
            className={active === name ? 'active' : ''}
            aria-label={`Go to ${name}`}
            aria-current={active === name ? 'step' : undefined}
            onClick={() => go(name.toLowerCase())}
          >
            <span />
            {active === name ? <small>{name}</small> : null}
          </Button>
        ))}
      </aside>

      <LandingScenes onOpenDemo={() => setDemoModalOpen(true)} />

      {/* 1-Click Universal Demo Booking Modal */}
      <DemoBookingModal
        isOpen={demoModalOpen}
        onClose={() => setDemoModalOpen(false)}
      />

      {/* Floating Sample iPhone WhatsApp Pitch Simulator */}
      <WhatsAppInteractivePitchModal />
    </main>
  );
}
