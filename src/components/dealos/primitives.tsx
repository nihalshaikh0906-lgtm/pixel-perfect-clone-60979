import { animate, motion, useInView, useReducedMotion, useSpring } from 'framer-motion';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
export const ease = [0.22, 1, 0.36, 1] as const;
export const spring = { stiffness: 120, damping: 24, mass: 0.6 };
export function RevealText({ children, className = '' }: { children: string; className?: string }) {
  const reduce = useReducedMotion();
  return <motion.h2 className={className} aria-label={children.replaceAll('/', ' ')} initial="hidden" whileInView="shown" viewport={{ once: true, amount: .15 }}>{children.split('/').map((line, i) => <span className="d-line-mask" key={i}><motion.span aria-hidden variants={{ hidden: { y: reduce ? 0 : '60%', opacity: 0 }, shown: { y: 0, opacity: 1, transition: { duration: reduce ? .15 : .3, delay: reduce ? 0 : i * .035, ease } } }}>{line.trim()}</motion.span></span>)}</motion.h2>;
}
export function Rise({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  return <motion.div className={className} initial={{ opacity: 0, y: reduce ? 0 : 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .1 }} transition={{ duration: reduce ? .15 : .25, delay: reduce ? 0 : Math.min(delay, .12), ease }}>{children}</motion.div>;
}
export function Scene({ id, children, transition = 'stack', pinned = false, height = '180vh', dark = false, className = '' }: { id: string; children: ReactNode; transition?: 'stack' | 'circle' | 'fade'; pinned?: boolean; height?: string; dark?: boolean; className?: string }) {
  const ref = useRef<HTMLElement>(null);
  const visible = useInView(ref, { margin: '200px' });
  return <section ref={ref} id={id} data-in-view={visible} data-theme={dark ? 'dark' : 'light'} className={`d-scene ${dark ? 'd-dark' : ''} ${className}`}><div className="d-scene-inner">{children}</div></section>;
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
