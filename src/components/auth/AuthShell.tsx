import { Link } from "@tanstack/react-router";
import { ChevronDown, KeyRound, Lock, ShieldCheck } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { DotSkyline } from "./DotSkyline";
import "@/components/dealos/dealos.css";
import "./auth.css";

const HEADLINES: Record<string, [string, string, string]> = {
  form: ["The broker OS built", "on Dubai", "data."],
  inside: ["Everything you need,", "waiting", "inside."],
  secure: ["Private by default,", "secure by", "design."],
  faq: ["Questions? We have", "the", "answers."],
};
const TICKER = [
  "✦ 12 new off-plan launches this week",
  "↗ Reportage Hills +8.4% YoY",
  "◎ 74 leads waiting for a first reply",
  "▣ 70,000+ units searchable",
];

export function Logo({ size = 40 }: { size?: number }) {
  return (
    <span className="au-logo d-brand" style={{ fontSize: size * 0.6 }}>
      <span className="d-logo-mark">D<span /></span>DealOS<span className="d-brand-dot">.</span>
    </span>
  );
}

/** Reveals children when scrolled into view. */
export function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e?.isIntersecting) { setShown(true); io.disconnect(); } }, { threshold: 0.15 });
    io.observe(el); return () => io.disconnect();
  }, []);
  return <div ref={ref} className={`au-reveal ${shown ? "in" : ""} ${className}`} style={{ transitionDelay: `${delay}s` }}>{children}</div>;
}

export function AuthShell({ children, leaving = false, sections = true }: { children: ReactNode; leaving?: boolean; sections?: boolean }) {
  const boost = useRef(0);
  const [head, setHead] = useState("form");
  const [tick, setTick] = useState(0);
  const [faq, setFaq] = useState<number | null>(null);

  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-head]"));
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) setHead(e.target.getAttribute("data-head") ?? "form");
    }, { rootMargin: "-45% 0px -45% 0px" });
    els.forEach((el) => io.observe(el));
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      boost.current = max > 0 ? Math.min(1, window.scrollY / max) : 0;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { io.disconnect(); window.removeEventListener("scroll", onScroll); };
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => { if (!document.hidden) setTick((v) => (v + 1) % TICKER.length); }, 4000);
    return () => clearInterval(t);
  }, [tick]);

  const [l1, l2, gold] = HEADLINES[head] ?? HEADLINES["form"]!;
  const faqs = [
    ["How do I get access?", "Create an account with your work email. Your workspace is ready as soon as you confirm your email address."],
    ["I forgot my password", "Use “Forgot password?” on the login form. We will email you a secure link to set a new one."],
    ["Can my team join?", "Yes. Each broker signs up with their own email, so every person has their own private login."],
  ] as const;

  return (
    <div className={`dauth ${leaving ? "is-leaving" : ""}`}>
      <div className="au-grid">
        <aside className="au-panel" aria-label="DealOS">
          <DotSkyline boost={boost} />
          <div className="au-glow" aria-hidden />
          <Link to="/welcome" className="au-panel-logo" aria-label="DealOS home"><span className="d-logo-mark">D<span /></span></Link>
          <div className="au-float au-f1" aria-hidden><small>Pipeline</small><b className="num">AED 48.2M</b></div>
          <div className="au-float au-f2" aria-hidden><span className="au-dot" />Hot · 87</div>
          <div className="au-float au-f3" aria-hidden>3BR · DIP · AED 1.33M</div>
          <div className="au-panel-copy">
            <h2 key={head} className="au-headline">{l1}<br />{l2} <em>{gold}</em></h2>
            <div className="au-ticker" aria-live="polite">
              <p key={tick}>{TICKER[tick]}</p>
              <div className="au-ticker-dots">
                {TICKER.map((t, i) => (
                  <button key={t} type="button" aria-label={`Show update ${i + 1}`} aria-pressed={i === tick} onClick={() => setTick(i)} />
                ))}
              </div>
            </div>
          </div>
        </aside>

        <div className="au-col">
          <section className="au-form-wrap" data-head="form">
            <div className="au-form">{children}</div>
          </section>

          {sections ? (
            <>
              <section className="au-sec" data-head="inside">
                <p className="au-eyebrow">Inside DealOS</p>
                <h3>What’s waiting inside</h3>
                <div className="au-cards">
                  {[
                    ["Leads inbox", "Every portal, ad and WhatsApp lead sorted by priority."],
                    ["Unit & project data", "70,000+ units with payment plans and floor plans."],
                    ["Market intelligence", "DLD sales, rents and yields by area."],
                  ].map(([t, d], i) => (
                    <Reveal key={t} delay={i * 0.1} className="au-card"><b>{t}</b><p>{d}</p></Reveal>
                  ))}
                </div>
              </section>
              <section className="au-sec" data-head="secure">
                <p className="au-eyebrow">Security</p>
                <h3>Secure by design</h3>
                <Reveal className="au-secure">
                  <span><Lock size={18} /> Encrypted login</span>
                  <span><ShieldCheck size={18} /> UAE data privacy (PDPL-ready)</span>
                  <span><KeyRound size={18} /> Role-based access</span>
                </Reveal>
              </section>
              <section className="au-sec" data-head="faq">
                <p className="au-eyebrow">FAQ</p>
                <h3>Good to know</h3>
                <div className="au-faq">
                  {faqs.map(([q, a], i) => (
                    <div key={q} className={`au-faq-item ${faq === i ? "open" : ""}`}>
                      <button type="button" aria-expanded={faq === i} onClick={() => setFaq(faq === i ? null : i)}>
                        {q}<ChevronDown size={18} />
                      </button>
                      <div className="au-faq-body"><div><p>{a}</p></div></div>
                    </div>
                  ))}
                </div>
              </section>
            </>
          ) : null}

          <footer className="au-foot">
            <span>© 2026 DealOS</span><Link to="/privacy">Privacy Policy</Link><Link to="/terms">Terms</Link>
          </footer>
        </div>
      </div>
    </div>
  );
}
