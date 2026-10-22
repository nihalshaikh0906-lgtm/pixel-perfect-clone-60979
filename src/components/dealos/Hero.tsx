import { Building2, ChartNoAxesCombined, ChevronRight, KeyRound, MapPin, MessageCircle, Percent, Play, Sparkles, Users } from 'lucide-react';
import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import skyline from '@/assets/dealos-dubai.jpg';
import { Dashboard } from './Dashboard';
import { Magnetic } from './primitives';

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
      staggerChildren: 0.035,
      delayChildren: 0.02,
    },
  },
};

const pillVariants = {
  hidden: { opacity: 0, y: -10, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.26, ease: [0.16, 1, 0.3, 1] },
  },
};

const wordVariants = {
  hidden: { opacity: 0, y: 16, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] },
  },
};

const subVariants = {
  hidden: { opacity: 0, y: 10, filter: 'blur(3px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
  },
};

const actionVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] },
  },
};

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [tour, setTour] = useState(false);
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
    <section className={`d-hero ${reduce ? 'd-reduced' : ''}`} id="hero" data-theme="dark" ref={ref}>
      <div className="d-hero-sticky">
        <img
          className="d-hero-photo"
          src={skyline}
          width={1920}
          height={1024}
          fetchPriority="high"
          alt="Dubai waterfront and Burj Khalifa at blue hour"
        />
        <div className="d-hero-tint" />
        <motion.div className="d-hero-copy" style={{ opacity: copyO, y: copyY }}>
          <GlassTiles />
          <motion.div
            className="d-hero-text"
            variants={textContainerVariants}
            initial={reduce ? 'visible' : 'hidden'}
            animate="visible"
          >
            {/* Top Pill / Badge */}
            <motion.p variants={pillVariants} className="d-glass-pill inline-flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-400 inline-block animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              <strong className="font-bold tracking-tight text-white">DealOS</strong>
              <span className="text-white/40 font-light mx-1">/</span>
              <span className="uppercase text-[11px] font-semibold tracking-[0.14em] text-white/80">
                THE DUBAI BROKER OPERATING SYSTEM
              </span>
            </motion.p>

            {/* Main Headline */}
            <motion.h1
              className="font-display tracking-tight text-white my-3"
              aria-label="The Operating System Built on Dubai Data."
            >
              <span className="block overflow-hidden">
                {['The', 'Operating', 'System'].map((word, i) => (
                  <motion.span
                    key={i}
                    variants={wordVariants}
                    className="inline-block mr-[0.24em] last:mr-0 will-change-transform"
                  >
                    {word}
                  </motion.span>
                ))}
              </span>
              <span className="block overflow-hidden text-[#3B82F6]">
                {['Built', 'on', 'Dubai', 'Data.'].map((word, i) => (
                  <motion.span
                    key={i}
                    variants={wordVariants}
                    className="inline-block mr-[0.24em] last:mr-0 text-[#3B82F6] will-change-transform"
                  >
                    {word}
                  </motion.span>
                ))}
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={subVariants}
              className="d-hero-sub text-base sm:text-lg max-w-2xl mx-auto leading-relaxed text-white/80"
            >
              Client WhatsApp briefs, sourced off-plan allocations and agency commission ledgers — in one high-velocity cockpit.
            </motion.p>

            {/* Action Buttons */}
            <motion.div variants={actionVariants} className="d-hero-buttons flex flex-wrap items-center justify-center gap-2.5">
              <Magnetic className="d-button d-button-white" asChild>
                <Link to="/signup">
                  Start free <ArrowIcon />
                </Link>
              </Magnetic>
              <Button asChild className="d-button d-button-glass border-amber-400/50 text-amber-300 font-bold hover:bg-amber-500/10">
                <Link to="/login">
                  <span>Sign In ↗</span>
                </Link>
              </Button>
              <Button className="d-button d-button-glass" onClick={() => setTour(true)}>
                <Play size={14} fill="currentColor" /> Explore workspace
              </Button>
            </motion.div>

            {/* Trust Proof */}
            <motion.div variants={actionVariants} className="d-trust">
              <div className="d-avatar-stack">
                {['SA', 'AK', 'MR', 'JN'].map((v) => (
                  <span key={v}>{v}</span>
                ))}
              </div>
              <span>Enterprise-Grade Real Estate CRM</span>
            </motion.div>
          </motion.div>
        </motion.div>
        <motion.div
          ref={dashRef}
          className={`d-hero-dashboard ${compact ? 'd-dash-compact' : ''}`}
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
    </section>
  );
}

function ArrowIcon() {
  return <ChevronRight size={15} />;
}
