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

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            const matched = scenes.find((s) => s.toLowerCase() === id);
            if (matched) setActive(matched);
          }
        }
      },
      { rootMargin: '-15% 0px -50% 0px' }
    );

    scenes.forEach((name) => {
      const el = document.getElementById(name.toLowerCase());
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener('scroll', onScroll);
      observer.disconnect();
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
          <div className="w-full flex items-center justify-between pb-2 mb-2 border-b border-border/60">
            <span className="text-xs font-bold text-foreground">Navigation</span>
            <span className="text-[11px] font-mono text-emerald-500 font-semibold">DealOS Live</span>
          </div>
          <div className="grid grid-cols-2 gap-1 w-full mb-3">
            {scenes.slice(1).map((name) => (
              <Button
                key={name}
                variant="ghost"
                className="justify-start text-xs font-semibold h-8.5 rounded-lg"
                onClick={() => go(name.toLowerCase())}
              >
                {name}
              </Button>
            ))}
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
    </main>
  );
}
