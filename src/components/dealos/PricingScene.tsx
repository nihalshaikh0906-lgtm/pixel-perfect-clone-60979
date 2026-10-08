import { animate, motion, useInView, useReducedMotion, useSpring } from 'framer-motion';
import { Link } from '@tanstack/react-router';
import { ArrowRight, Check, ChevronDown, Sparkles, Users } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { DEFAULT_PLAN, PLANS, PLAN_FEATURES, aedPrice, type PlanId } from '@/lib/pricing';
import { RevealText, Rise, Scene } from './primitives';

function RollingPrice({ value }: { value: number }) {
  const [n, setN] = useState(value);
  const prev = useRef(value);
  const reduce = useReducedMotion();
  useEffect(() => {
    const c = animate(prev.current, value, { duration: reduce ? 0 : 0.4, ease: [0.22, 1, 0.36, 1], onUpdate: setN });
    prev.current = value;
    return c.stop;
  }, [value, reduce]);
  return <>{aedPrice(n)}</>;
}

const FAQ = [
  ['Can I cancel anytime?', 'Yes, your plan stays active until the end of the paid period.'],
  ['What happens after the launch offer?', 'Your price stays locked for as long as your subscription stays active.'],
  ['Can I switch plans?', 'Yes, upgrade anytime; the remaining value is credited.'],
  ['Do you offer a free trial?', 'Free trial details will be announced soon.'],
] as const;

export function Pricing() {
  const [id, setId] = useState<PlanId>(DEFAULT_PLAN);
  const [faq, setFaq] = useState<number | null>(null);
  const plan = PLANS.find((p) => p.id === id) ?? PLANS[3]!;
  const idx = PLANS.findIndex((p) => p.id === id);
  const cardRef = useRef<HTMLDivElement>(null);
  const inView = useInView(cardRef, { once: true, amount: 0.3 });
  const reduce = useReducedMotion();
  const rx = useSpring(0, { stiffness: 160, damping: 20 });
  const ry = useSpring(0, { stiffness: 160, damping: 20 });

  return (
    <Scene id="pricing">
      <div className="d-container d-pr">
        <div className="d-section-heading">
          <span className="d-pill"><Sparkles size={13} /> Launch offer · 50% off</span>
          <RevealText>Simple pricing/for every broker</RevealText>
          <p>One plan with every feature. Choose how you want to pay. Cancel anytime.</p>
          <div className="d-pr-toggle" role="radiogroup" aria-label="Billing period" style={{ ['--i' as string]: idx }}>
            <span className="d-pr-indicator" aria-hidden />
            {PLANS.map((p) => (
              <button key={p.id} type="button" role="radio" aria-checked={p.id === id} className={p.id === id ? 'active' : ''} onClick={() => setId(p.id)}>
                <span>{p.label}</span>{p.toggleBadge ? <small>{p.toggleBadge}</small> : null}
              </button>
            ))}
          </div>
        </div>

        <div className="d-pr-main">
          <Rise className="d-pr-card-wrap">
            <motion.div
              ref={cardRef}
              className={`d-pr-card ${plan.highlighted ? 'hl' : ''}`}
              style={{ rotateX: rx, rotateY: ry, transformPerspective: 1000 }}
              onPointerMove={(e) => { if (reduce || e.pointerType !== 'mouse') return; const r = e.currentTarget.getBoundingClientRect(); rx.set((0.5 - (e.clientY - r.top) / r.height) * 4); ry.set(((e.clientX - r.left) / r.width - 0.5) * 4); }}
              onPointerLeave={() => { rx.set(0); ry.set(0); }}
            >
              {plan.highlighted ? <span className="d-pr-badge"><Sparkles size={12} /> Most popular</span> : null}
              <p className="d-pr-name">DealOS Pro</p>
              <div className="d-pr-price">
                <s>{aedPrice(plan.originalPrice)}</s>
                <div><strong><RollingPrice value={plan.price} /></strong><span>{plan.period}</span></div>
              </div>
              <motion.div key={plan.id} className="d-pr-sub" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                {plan.months > 1 ? <p>{aedPrice(plan.perMonth)} / month{plan.perMonthNote ? ` — ${plan.perMonthNote}` : ''}</p> : null}
                <span className="d-pr-chip">{plan.savingLabel}</span>
              </motion.div>
              <Link to="/signup" search={{ plan: plan.id }} className="d-pr-cta">Start with {plan.buttonLabel} <ArrowRight size={16} /></Link>
              <p className="d-pr-fine">Prices in AED · Cancel anytime · Secure payment</p>
              <ul className="d-pr-features">
                {PLAN_FEATURES.map((f, j) => (
                  <li key={f} className={inView ? 'in' : ''} style={{ transitionDelay: `${0.15 + j * 0.08}s` }}>
                    <span><Check size={13} /></span>{f}
                  </li>
                ))}
              </ul>
            </motion.div>
          </Rise>

          <div className="d-pr-side">
            <Rise delay={0.08}>
              <div className="d-pr-compare" role="list" aria-label="Compare billing periods">
                {PLANS.map((p) => (
                  <button key={p.id} type="button" role="listitem" className={`${p.highlighted ? 'best' : ''} ${p.id === id ? 'sel' : ''}`} onClick={() => setId(p.id)}>
                    {p.highlighted ? <em>Best value</em> : null}
                    <b>{p.label}</b>
                    <strong>{aedPrice(p.price)}</strong>
                    <span>{aedPrice(p.perMonth)} / month</span>
                    <small>{p.savingLabel}</small>
                  </button>
                ))}
              </div>
            </Rise>
            <Rise delay={0.12}>
              <div className="d-pr-team">
                <Users size={22} />
                <div>
                  <b>Teams & brokerages (5+ agents)</b>
                  <p>Volume pricing, team dashboard, admin controls and onboarding.</p>
                </div>
                <button type="button" className="d-pr-team-btn" onClick={() => document.getElementById('cta')?.scrollIntoView({ behavior: reduce ? 'instant' : 'smooth' })}>Talk to us</button>
              </div>
            </Rise>
            <Rise delay={0.16}>
              <div className="d-pr-faq">
                {FAQ.map(([q, a], i) => (
                  <div key={q} className={faq === i ? 'open' : ''}>
                    <button type="button" aria-expanded={faq === i} onClick={() => setFaq(faq === i ? null : i)}>{q}<ChevronDown size={17} /></button>
                    <div className="d-pr-faq-body"><div><p>{a}</p></div></div>
                  </div>
                ))}
              </div>
            </Rise>
          </div>
        </div>
      </div>
    </Scene>
  );
}
