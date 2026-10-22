import { motion, useReducedMotion, useScroll } from 'framer-motion';
import { Logo } from '@/components/Logo';
import { Link } from '@tanstack/react-router';
import { Menu, X } from 'lucide-react';
import { memo, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Hero } from './Hero';
import { InteractiveDeviceShowcase } from './InteractiveDeviceShowcase';
import { Product, Insights } from './ProductScenes';
import { Integrations, Tools, Workflow, Modes } from './ToolsScenes';
import { Proof, Pricing, CTA, Footer } from './FinalScenes';
import { Magnetic } from './primitives';
const scenes=['Hero','Product','Insights','Integrations','Tools','Workflow','Modes','Proof','Pricing','CTA'];
const LandingScenes = memo(function LandingScenes() { return <><Hero/><InteractiveDeviceShowcase/><Product/><Insights/><Integrations/><Tools/><Workflow/><Modes/><Proof/><Pricing/><CTA/><Footer/></>; });
export function DealOSLanding() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('Hero');
  const [menu, setMenu] = useState(false);
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
        <div className="d-nav-actions">
          <Button asChild variant="ghost" className="d-login text-foreground hover:text-primary">
            <Link to="/login" search={{ mode: undefined }}>
              Login <span>↗</span>
            </Link>
          </Button>
          <Magnetic className="d-button d-button-primary" onClick={() => go('cta')}>
            Book a demo <span>↗</span>
          </Magnetic>
          <Button
            variant="ghost"
            size="icon"
            className="d-mobile-menu-button text-foreground"
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
            <Link
              to="/login"
              search={{ mode: undefined }}
              className="px-3 py-1.5 rounded-full text-xs font-bold bg-amber-500 text-black hover:bg-amber-400 inline-flex items-center gap-1 shadow-sm"
            >
              <span>Sign In ↗</span>
            </Link>
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
          <Button
            asChild
            className="w-full h-10 rounded-xl text-xs font-bold bg-primary text-primary-foreground shadow-sm"
          >
            <Link to="/login" search={{ mode: undefined }}>
              <span>Sign In to DealOS Workspace ↗</span>
            </Link>
          </Button>
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
        <Link
          to="/login"
          search={{ mode: undefined }}
          className="sm:hidden fixed bottom-5 right-4 z-50 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs shadow-xl shadow-amber-500/30 border border-amber-300 active:scale-95 transition-all"
          aria-label="Sign In to DealOS"
        >
          <span>Sign In ↗</span>
        </Link>
      )}
      <LandingScenes />
    </main>
  );
}
