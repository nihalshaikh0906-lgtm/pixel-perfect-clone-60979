import { animate, motion, useInView, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
export const ease = [0.22, 1, 0.36, 1] as const;
export const spring = { stiffness: 120, damping: 24, mass: 0.6 };
export function RevealText({ children, className = '' }: { children: string; className?: string }) {
  const reduce = useReducedMotion();
  return <motion.h2 className={className} aria-label={children.replaceAll('/', ' ')} initial="hidden" whileInView="shown" viewport={{ once: true, amount: .3 }}>{children.split('/').map((line, i) => <span className="d-line-mask" key={i}><motion.span aria-hidden variants={{ hidden: { y: reduce ? 0 : '110%', opacity: 0 }, shown: { y: 0, opacity: 1, transition: { duration: reduce ? .3 : .9, delay: reduce ? 0 : i * .08, ease } } }}>{line.trim()}</motion.span></span>)}</motion.h2>;
}
export function Rise({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  return <motion.div className={className} initial={{ opacity: 0, y: reduce ? 0 : 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .15 }} transition={{ duration: reduce ? .3 : .6, delay: reduce ? 0 : delay, ease }}>{children}</motion.div>;
}
export function Scene({ id, children, transition = 'stack', pinned = false, height = '180vh', dark = false, className = '' }: { id: string; children: ReactNode; transition?: 'stack' | 'circle' | 'fade'; pinned?: boolean; height?: string; dark?: boolean; className?: string }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const mobile = useIsMobile();
  const { scrollYProgress: entry } = useScroll({ target: ref, offset: ['start end', 'start start'] });
  const { scrollYProgress: exit } = useScroll({ target: ref, offset: ['end end', 'end start'] });
  const y = useTransform(entry, [0, 1], ['12vh', '0vh']);
  const radius = useTransform(entry, [0, 1], ['40px', '0px']);
  const clipPath = useTransform(entry, [0, .85], ['circle(15% at 50% 50%)', 'circle(150% at 50% 50%)']);
  const opacity = useTransform(entry, [0, .75], [.35, 1]);
  const scale = useTransform(exit, [0, 1], [1, .94]);
  const filter = useTransform(exit, [0, 1], ['brightness(1) blur(0px)', 'brightness(.82) blur(3px)']);
  return <section ref={ref} id={id} data-theme={dark ? 'dark' : 'light'} className={`d-scene ${pinned ? 'd-pinned' : ''} ${dark ? 'd-dark' : ''} ${className}`} style={pinned && !reduce ? { minHeight: height } : undefined}><motion.div className="d-scene-inner" style={reduce || mobile ? {} : { y: transition === 'stack' ? y : 0, borderRadius: transition === 'stack' ? radius : 0, ...(transition === 'circle' ? {clipPath} : {}), opacity: transition === 'fade' ? opacity : 1, scale: pinned ? scale : 1, filter: pinned ? filter : 'none' }}>{children}</motion.div></section>;
}
export function CountUp({ value, prefix = '', suffix = '', decimals = 0 }: { value: number; prefix?: string; suffix?: string; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null); const inView = useInView(ref, { once: true }); const reduce = useReducedMotion(); const [n, setN] = useState(0);
  useEffect(() => { if (!inView) return; const c = animate(0, value, { duration: reduce ? 0 : 1.6, ease, onUpdate: setN }); return c.stop; }, [inView, value, reduce]);
  return <span ref={ref} className="d-count">{prefix}{n.toFixed(decimals)}{suffix}</span>;
}
export function Magnetic({ children, className = '', ...props }: React.ComponentProps<typeof Button>) {
  const x = useSpring(0, spring); const y = useSpring(0, spring); const reduce = useReducedMotion();
  return <motion.div className="d-magnetic" style={{ x, y }} onPointerMove={e => { if (reduce || e.pointerType !== 'mouse') return; const r = e.currentTarget.getBoundingClientRect(); x.set((e.clientX - r.left - r.width / 2) * .1); y.set((e.clientY - r.top - r.height / 2) * .15); }} onPointerLeave={() => { x.set(0); y.set(0); }}><Button className={className} {...props}>{children}</Button></motion.div>;
}
export function TiltCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  const rx = useSpring(0, spring); const ry = useSpring(0, spring); const reduce = useReducedMotion();
  return <motion.div className={`d-card ${className}`} style={{ rotateX: rx, rotateY: ry, transformPerspective: 1000 }} onPointerMove={e => { if (reduce || e.pointerType !== 'mouse') return; const r = e.currentTarget.getBoundingClientRect(); rx.set((.5 - (e.clientY - r.top) / r.height) * 8); ry.set(((e.clientX - r.left) / r.width - .5) * 8); }} onPointerLeave={() => { rx.set(0); ry.set(0); }}>{children}</motion.div>;
}
export function NearViewport({ children, placeholder, className = '' }: { children: ReactNode; placeholder?: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null); const near = useInView(ref, { margin: '300px', once: true });
  return <div ref={ref} className={className}>{near ? children : placeholder}</div>;
}
