import { Link } from "@tanstack/react-router";
import { Logo as DealLogo, LogoMark } from "@/components/Logo";
import { ArrowLeft, ChevronDown, KeyRound, Lock, ShieldCheck } from "lucide-react";
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
  "▣ 34,850+ UAE units searchable",
];

export function Logo({ size = 40 }: { size?: number }) {
  return (
    <Link to="/welcome" className="au-logo d-brand hover:opacity-90 transition-opacity" style={{ fontSize: size * 0.6 }} aria-label="DealOS home">
      <DealLogo size={size} />
    </Link>
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

export function AuthShell({ children, leaving = false, sections = false }: { children: ReactNode; leaving?: boolean; sections?: boolean }) {
  const [head, setHead] = useState("form");
  const [faq, setFaq] = useState<number | null>(null);

  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-head]"));
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) setHead(e.target.getAttribute("data-head") ?? "form");
    }, { rootMargin: "-45% 0px -45% 0px" });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const faqs = [
    ["How do I get access?", "Create an account with your work email. Your workspace is ready as soon as you confirm your email address."],
    ["I forgot my password", "Use “Forgot password?” on the login form. We will email you a secure link to set a new one."],
    ["Can my team join?", "Yes. Each broker signs up with their own email, so every person has their own private login."],
  ] as const;

  return (
    <div className={`dauth ${leaving ? "is-leaving" : ""}`}>
      <div className="au-grid">
        <aside className="au-panel au-panel-executive" aria-label="DealOS Platform">
          <div className="au-panel-top">
            <Link to="/welcome" className="au-panel-brand" aria-label="DealOS home">
              <LogoMark size={52} variant="light" />
              <div>
                <span className="au-brand-title">DealOS</span>
                <span className="au-brand-tag">Institutional Real Estate Platform</span>
              </div>
            </Link>
          </div>

          <div className="au-panel-body">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 text-xs font-mono font-bold mb-4">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>SECURE ACCESS PORTAL</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
              Institutional Gateway for <span className="text-primary font-black">Dubai Real Estate</span>.
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              Direct access to live agency pipeline, DLD escrow verification, investor lead triage, and executive commission governance.
            </p>

            <div className="mt-8 space-y-3 border-t border-slate-200 pt-6">
              <div className="flex items-center justify-between text-xs p-3 rounded-xl bg-white border border-slate-200/90 shadow-xs">
                <span className="font-semibold text-slate-700">Live DLD Inventory</span>
                <span className="font-mono font-bold text-emerald-600">34,850+ Units</span>
              </div>
              <div className="flex items-center justify-between text-xs p-3 rounded-xl bg-white border border-slate-200/90 shadow-xs">
                <span className="font-semibold text-slate-700">Escrow Security</span>
                <span className="font-mono font-bold text-emerald-600">RERA Verified</span>
              </div>
              <div className="flex items-center justify-between text-xs p-3 rounded-xl bg-white border border-slate-200/90 shadow-xs">
                <span className="font-semibold text-slate-700">Active Testrun Mode</span>
                <span className="font-mono font-bold text-blue-600">Open Access Active</span>
              </div>
            </div>
          </div>

          <div className="au-panel-foot">
            <div className="au-compliance-pill text-slate-600">
              <ShieldCheck size={15} className="text-emerald-600" />
              <span>DLD Registered · RERA Trakheesi Verified Gateway</span>
            </div>
          </div>
        </aside>

        <div className="au-col">
          <section className="au-form-wrap" data-head="form">
            <div className="au-form">
              <div className="mb-4">
                <Link
                  to="/welcome"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors group"
                >
                  <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform text-slate-400 group-hover:text-slate-800" />
                  <span>Back to Landing Page</span>
                </Link>
              </div>
              {children}
            </div>
          </section>

          {sections ? (
            <>
              <section className="au-sec" data-head="inside">
                <p className="au-eyebrow">Inside DealOS</p>
                <h3>What’s waiting inside</h3>
                <div className="au-cards">
                  {[
                    ["Leads inbox", "Every portal, ad and WhatsApp lead sorted by priority."],
                    ["Unit & project data", "34,850+ units with payment plans and floor plans."],
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
