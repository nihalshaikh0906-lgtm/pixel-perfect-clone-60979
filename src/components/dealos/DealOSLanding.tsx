import { motion, useReducedMotion, useScroll } from 'framer-motion';
import { Logo } from '@/components/Logo';
import { Link } from '@tanstack/react-router';
import { Menu, X } from 'lucide-react';
import { memo, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Hero } from './Hero';
import { LiveDubaiPulse } from './LiveDubaiPulse';
import { InteractiveDeviceShowcase } from './InteractiveDeviceShowcase';
import { BrokerRoiCalculator } from './BrokerRoiCalculator';
import { Product, Insights } from './ProductScenes';
import { Integrations, Tools, Workflow, Modes } from './ToolsScenes';
import { Proof, Pricing, CTA, Footer } from './FinalScenes';
import { DemoBookingModal } from './DemoBookingModal';
import { Magnetic } from './primitives';
import { Sparkles, Video } from 'lucide-react';

import { CockpitDemoSection, SeeTheBrokerHeader } from './CockpitDemoSection';

const scenes=['Hero','Product','Insights','Integrations','Tools','Workflow','Modes','Proof','Pricing','CTA'];

const LandingScenes = memo(function LandingScenes({ onOpenDemo }: { onOpenDemo: () => void }) {
  return (
    <>
      <Hero />
      <LiveDubaiPulse />
      <InteractiveDeviceShowcase />
      <Product />
      <Insights />
      <BrokerRoiCalculator onOpenDemo={onOpenDemo} />
      <Integrations />
      <Tools />
      <Workflow />
      <Modes />
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
    let frame = 0;
    const elements = scenes.map((name) => ({ name, el: document.getElementById(name.toLowerCase()) }));
    const update = () => {
      frame = 0;
      setScrolled(window.scrollY > 40);
      let selected = 'Hero';
      for (const { name, el } of elements) {
        if (el && el.getBoundingClientRect().top < window.innerHeight * 0.4) {
          selected = name;
        }
      }
      setActive(selected);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  const go = (id: string) => {
    setMenu(false);
    document.getElementById(id)?.scrollIntoView({ behavior: reduce ? 'instant' : 'smooth' });
  };

  return (
    <main className={`dealos ${scrolled ? 'is-scrolled' : ''}`} data-intro={intro}>
      <motion.div className="d-scroll-progress" style={{ scaleX: scrollYProgress }} />
      <header className={`d-navbar ${scrolled ? 'scrolled' : ''}`}>
        <Link to="/welcome" className="d-brand" aria-label="DealOS home">
          <Logo variant="dark" size={30} />
        </Link>
        <nav aria-label="Main navigation">
          {[
            ['Product', 'product'],
            ['Data', 'insights'],
            ['AI', 'tools'],
            ['Integrations', 'integrations'],
            ['Pricing', 'pricing'],
          ].map(([label, id]) => (
            <Button key={id} variant="ghost" className="d-nav-link text-foreground hover:text-primary" onClick={() => go(id ?? 'product')}>
              {label}
            </Button>
          ))}
        </nav>
        <div className="d-nav-actions flex items-center gap-2">
          <Button asChild size="sm" variant="ghost" className="hidden sm:inline-flex h-9 px-3.5 rounded-full bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 text-xs font-bold gap-1.5 shadow-xs cursor-pointer">
            <Link to="/demo">
              <Sparkles size={13} className="text-emerald-400" />
              <span>Live Demo ⚡</span>
            </Link>
          </Button>
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
      {menu ? (
        <div className="d-mobile-menu animate-in fade-in-50 zoom-in-95 duration-150">
          <div className="w-full flex items-center justify-between pb-2.5 mb-2 border-b border-border/60">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Quick Menu</span>
            <div className="flex items-center gap-2">
              <Link
                to="/demo"
                className="px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-500 text-black hover:bg-emerald-400 inline-flex items-center gap-1 shadow-sm"
              >
                <Sparkles size={12} />
                <span>Try Demo ⚡</span>
              </Link>
              <Link
                to="/login"
                search={{ mode: undefined }}
                className="px-3 py-1.5 rounded-full text-xs font-bold bg-white/10 text-white hover:bg-white/20 inline-flex items-center gap-1 border border-white/10"
              >
                <span>Sign In ↗</span>
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-1 w-full mb-2.5">
            {scenes.slice(1).map((name) => (
              <Button
                key={name}
                variant="ghost"
                className="justify-start text-xs font-semibold h-8"
                onClick={() => go(name.toLowerCase())}
              >
                {name}
              </Button>
            ))}
          </div>
          <div className="space-y-2 w-full">
            <Button
              type="button"
              onClick={() => {
                setMenu(false);
                setDemoModalOpen(true);
              }}
              className="w-full h-11 rounded-xl text-xs font-bold bg-primary text-primary-foreground shadow-sm gap-1.5 cursor-pointer"
            >
              <Video size={15} />
              <span>Book Live Demo Walkthrough ↗</span>
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full h-10 rounded-xl text-xs font-bold border-border/80 text-foreground"
            >
              <Link to="/login" search={{ mode: undefined }}>
                <span>Sign In to DealOS Workspace ↗</span>
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
      {scrolled && (
        <div className="sm:hidden fixed bottom-5 right-4 z-50 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setDemoModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs shadow-xl border border-primary/40 active:scale-95 transition-all cursor-pointer"
            aria-label="Book Demo"
          >
            <Video size={13} />
            <span>Book Demo ↗</span>
          </button>
          <Link
            to="/login"
            search={{ mode: undefined }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-full bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs shadow-xl shadow-amber-500/30 border border-amber-300 active:scale-95 transition-all"
            aria-label="Sign In to DealOS"
          >
            <span>Sign In ↗</span>
          </Link>
        </div>
      )}
      <LandingScenes onOpenDemo={() => setDemoModalOpen(true)} />

      {/* 1-Click Universal Demo Booking Modal */}
      <DemoBookingModal
        isOpen={demoModalOpen}
        onClose={() => setDemoModalOpen(false)}
      />
    </main>
  );
}
