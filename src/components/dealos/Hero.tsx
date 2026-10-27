import { Building2, ChartNoAxesCombined, ChevronRight, KeyRound, MapPin, MessageCircle, Percent, Play, Sparkles, Users, Video } from 'lucide-react';
import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import skyline from '@/assets/dealos-dubai.jpg';
import { Dashboard } from './Dashboard';
import { Magnetic } from './primitives';
import { DemoBookingModal } from './DemoBookingModal';
import { HeroTestDriveWidget } from './HeroTestDriveWidget';

export const tileIcons = [Users, Building2, MapPin, Sparkles, Percent, KeyRound, ChartNoAxesCombined, MessageCircle];

export function GlassTiles({ compact = false }: { compact?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref);
  return (
    <div ref={ref} data-in-view={visible} className={`d-tiles ${compact ? 'compact' : ''}`} aria-hidden>
      {tileIcons.map((Icon, i) => (
        <div key={i} className={`d-glass-tile tile-${i}`}>
          <Icon />
        </div>
      ))}
    </div>
  );
}

const textContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.04,
    },
  },
};

const pillVariants = {
  hidden: { opacity: 0, y: -12, scale: 0.94 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
  },
};

const wordVariants = {
  hidden: { opacity: 0, y: 22, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

const subVariants = {
  hidden: { opacity: 0, y: 14, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.2 },
  },
};

const actionVariants = {
  hidden: { opacity: 0, y: 14, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.32 },
  },
};

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [tour, setTour] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const dashRef = useRef<HTMLDivElement>(null);
  const fitRef = useRef({ y: 0, s: 1 });
  const [compact, setCompact] = useState(false);
  const setFit = (v: { y: number; s: number }) => {
    fitRef.current = v;
    scrollYProgress.set(scrollYProgress.get());
  };

  useEffect(() => {
    const el = dashRef.current;
    if (!el) return;
    const measure = () => {
      if (innerWidth < 768) {
        setFit({ y: 0, s: 1 });
        return;
      }
      const top = el.offsetTop;
      const h = el.offsetHeight;
      const nav = innerWidth < 768 ? 88 : 112;
      const avail = innerHeight - nav - 24;
      setCompact((prev) => innerHeight < 820 || prev || h > avail);
      setFit({ y: nav - top, s: 1 });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    const onResize = () => {
      setCompact(false);
      requestAnimationFrame(measure);
    };
    addEventListener('resize', onResize);
    return () => {
      ro.disconnect();
      removeEventListener('resize', onResize);
    };
  }, []);

  const rotateX = useTransform(scrollYProgress, [0, 0.6], [reduce ? 0 : 28, 0]);
  const scale = useTransform(scrollYProgress, (v: number) => {
    const t = Math.min(1, v / 0.6);
    return reduce ? 1 : 0.95 + 0.05 * t;
  });
  const dy = useTransform(scrollYProgress, (v: number) => {
    const t = Math.min(1, v / 0.6);
    return reduce ? 0 : 40 + (fitRef.current.y - 40) * t;
  });
  const copyO = useTransform(scrollYProgress, [0, 0.4], [1, reduce ? 1 : 0]);
  const copyY = useTransform(scrollYProgress, [0, 0.4], [0, reduce ? 0 : -80]);

  return (
    <section className={`d-hero ${reduce ? 'd-reduced' : ''}`} id="hero" data-theme="light" ref={ref}>
      <div className="d-hero-sticky">
        <img
          className="d-hero-photo"
          src={skyline}
          width={1920}
          height={1024}
          fetchPriority="high"
          alt="Dubai waterfront and Burj Khalifa"
        />
        <div className="d-hero-tint" />
        <div className="d-hero-copy">
          <GlassTiles />
          <motion.div
            className="d-hero-text"
            variants={textContainerVariants}
            initial={reduce ? 'visible' : 'hidden'}
            animate="visible"
          >
            {/* Top Pill / Badge */}
            <motion.p variants={pillVariants} className="d-pill inline-flex max-w-[92vw] flex-wrap justify-center items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold bg-white/90 border border-sand shadow-xs text-foreground text-center">
              <span className="size-2 rounded-full bg-emerald-500 inline-block animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)] shrink-0" />
              <strong className="font-bold tracking-tight text-foreground">DealOS</strong>
              <span className="text-muted-foreground/40 font-light mx-0.5 sm:mx-1">/</span>
              <span className="uppercase text-[10px] sm:text-[11px] font-bold tracking-wider sm:tracking-[0.14em] text-primary">
                THE DUBAI BROKER OPERATING SYSTEM
              </span>
            </motion.p>

            {/* Main Headline */}
            <motion.h1
              className="font-display tracking-tight text-foreground my-3"
              aria-label="The Operating System Built on Dubai Data."
            >
              <span className="block overflow-hidden">
                {['The', 'Operating', 'System'].map((word, i) => (
                  <motion.span
                    key={i}
                    variants={wordVariants}
                    className="inline-block mr-[0.24em] last:mr-0 text-foreground will-change-transform"
                  >
                    {word}
                  </motion.span>
                ))}
              </span>
              <span className="block overflow-hidden text-primary">
                {['Built', 'on', 'Dubai', 'Data.'].map((word, i) => (
                  <motion.span
                    key={i}
                    variants={wordVariants}
                    className="inline-block mr-[0.24em] last:mr-0 text-primary will-change-transform"
                  >
                    {word}
                  </motion.span>
                ))}
              </span>
            </motion.h1>

            {/* Subtitle with Rich Color-Separated Highlights */}
            <motion.p
              variants={subVariants}
              className="d-hero-sub text-base sm:text-lg max-w-2xl mx-auto leading-relaxed text-muted-foreground"
            >
              <strong className="text-emerald-500 dark:text-emerald-400 font-extrabold">Client WhatsApp briefs</strong>,{' '}
              <strong className="text-blue-500 dark:text-blue-400 font-extrabold">1,355+ verified off-plan allocations</strong> and{' '}
              <strong className="text-amber-500 dark:text-amber-400 font-extrabold">developer commission ledgers</strong> — in one high-velocity Dubai cockpit.
            </motion.p>

            {/* Exactly 2 Distinct Action Choices (Zero Duplicate Buttons) */}
            <motion.div variants={actionVariants} className="d-hero-buttons flex flex-col sm:flex-row items-center justify-center gap-3 mt-6 sm:mt-8">
              <Button asChild className="h-12 px-8 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-extrabold text-sm shadow-lg shadow-primary/25 gap-2 cursor-pointer w-full sm:w-auto">
                <Link to="/demo">
                  <Sparkles size={16} className="text-amber-300" />
                  <span>Try Live Demo ⚡</span>
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-12 px-7 rounded-2xl border-border hover:bg-secondary text-foreground font-bold text-sm gap-2 w-full sm:w-auto cursor-pointer"
              >
                <Link to="/signup">
                  <span>Start 14-Day Free Trial ↗</span>
                </Link>
              </Button>
            </motion.div>

            {/* 3 Colorful Micro-Stat Badges */}
            <motion.div variants={actionVariants} className="flex flex-wrap items-center justify-center gap-2 mt-4 px-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/25 shadow-xs">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                ⚡ 45s Speed to Lead
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold bg-blue-500/10 text-blue-500 dark:text-blue-400 border border-blue-500/25 shadow-xs">
                🏢 34,850+ Live Units
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold bg-amber-500/10 text-amber-500 dark:text-amber-400 border border-amber-500/25 shadow-xs">
                🛡️ 100% DLD Escrow Radar
              </span>
            </motion.div>

            {/* Trust Proof */}
            <motion.div variants={actionVariants} className="d-trust text-muted-foreground mt-3">
              <div className="d-avatar-stack">
                {['SA', 'AK', 'MR', 'JN'].map((v) => (
                  <span key={v} className="bg-white text-primary border-sand">{v}</span>
                ))}
              </div>
              <span className="text-muted-foreground font-semibold">Enterprise-Grade Real Estate CRM</span>
            </motion.div>

            {/* Step 2: 3-Second Interactive Test-Drive Cockpit */}
            <motion.div variants={actionVariants}>
              <HeroTestDriveWidget />
            </motion.div>
          </motion.div>
        </div>
        <motion.div
          ref={dashRef}
          className={`d-hero-dashboard hidden md:block ${compact ? 'd-dash-compact' : ''}`}
          style={{ rotateX, scale, y: dy }}
        >
          <Dashboard />
        </motion.div>
        <span className="d-scroll-hint">
          SCROLL TO DISCOVER <span>↓</span>
        </span>
      </div>
      <Dialog open={tour} onOpenChange={setTour}>
        <DialogContent className="d-tour-dialog sm:max-w-6xl">
          <DialogTitle>
            Inside DealOS <span className="d-demo-tag">Product preview</span>
          </DialogTitle>
          {tour ? <Dashboard /> : null}
          <p>Explore the connected broker workspace.</p>
        </DialogContent>
      </Dialog>
      <DemoBookingModal isOpen={demoOpen} onClose={() => setDemoOpen(false)} />
    </section>
  );
}

function ArrowIcon() {
  return <ChevronRight size={15} />;
}
