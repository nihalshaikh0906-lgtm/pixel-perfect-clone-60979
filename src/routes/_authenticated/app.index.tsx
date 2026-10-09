import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, MessageCircle, Phone, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";

import { useCountUp, useShell } from "@/components/app/AppShell";
import { PriorityChip, TypeChip } from "@/components/app/chips";
import { formatAed, nextBestActions, QUEUES, queueLeads, stats, ago } from "@/lib/demo-leads";

export const Route = createFileRoute("/_authenticated/app/")({
  head: () => ({
    meta: [
      { title: "Home — DealOS Workspace" },
      { name: "description", content: "Next best action, work queues, lead pipeline and follow-ups for today." },
      { property: "og:title", content: "Home — DealOS Workspace" },
      { property: "og:description", content: "Your day as a Dubai broker, prioritised." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

const STAGE_COLORS = ["var(--a-ink)", "var(--a-gold)", "var(--a-hot)", "var(--a-sage)", "var(--a-cold)", "var(--a-sand)", "var(--a-warm)", "var(--a-gold-text)"];

function dubaiNow() {
  const d = new Date();
  const date = d.toLocaleDateString("en-GB", { timeZone: "Asia/Dubai", weekday: "long", day: "numeric", month: "long" }).replace(",", "").toUpperCase();
  const h = Number(d.toLocaleString("en-GB", { timeZone: "Asia/Dubai", hour: "2-digit", hour12: false }));
  return { date, greet: h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening" };
}

function Kpi({ label, value, format, note, tone, delay }: { label: string; value: number; format: (n: number) => string; note: string; tone?: string; delay: number }) {
  const v = useCountUp(value);
  return (
    <div className="a-card a-kpi a-fade a-lift" style={{ animationDelay: `${delay}ms` }}>
      <p className="eyebrow-a" style={{ marginTop: 0 }}>{label}</p>
      <strong className={`num ${tone ?? ""}`}>{format(v)}</strong>
      <p>{note}</p>
    </div>
  );
}

function HomePage() {
  const { user } = Route.useRouteContext();
  const { clientMode, openAi } = useShell();
  const s = useMemo(stats, []);
  const actions = useMemo(nextBestActions, []);
  const [i, setI] = useState(0);
  const [hover, setHover] = useState<number | null>(null);
  const lead = actions[i % Math.max(actions.length, 1)];
  const { date, greet } = dubaiNow();
  const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
  const rawName = String(meta["full_name"] ?? user.email?.split("@")[0] ?? "");
  const first = (rawName.split(/[\s._-]+/)[0] ?? "").replace(/\d+/g, "");
  const name = first ? first.charAt(0).toUpperCase() + first.slice(1).toLowerCase() : "";
  const n = (x: number) => Math.round(x).toLocaleString("en-US");
  const follow = useMemo(() => queueLeads("followup").slice(0, 6), []);

  const openTotal = s.byStage.reduce((a, b) => a + b.count, 0);
  let acc = 0;
  const R = 70, C = 2 * Math.PI * R;

  return (
    <>
      <section className="a-band a-fade">
        <div>
          <p className="eyebrow-a">{date}</p>
          <h1>{greet}{name ? `, ${name}` : ""}.</h1>
          <p className="sub num" style={{ whiteSpace: "normal" }}>{n(s.open)} open leads · {n(s.respond)} waiting for a first reply · {n(s.followup)} follow-ups due</p>
        </div>
        <div className="a-band-actions">
          <Link to="/app/leads" search={{ queue: "respond" }} className="a-btn a-btn-line">Open inbox</Link>
          <button type="button" className="a-btn a-btn-gold" onClick={openAi}><Sparkles size={16} /> Plan my day</button>
        </div>
      </section>

      {lead ? (
        <section className="a-card a-nba a-fade" style={{ animationDelay: "40ms" }} aria-label="Next best action">
          <div key={lead.id} className="a-slide">
            <span className="a-nba-chip"><span className="a-dot d-hot" /> NEXT BEST ACTION</span>
            <h2>Call now: {lead.name} — {lead.type.toLowerCase()} lead from {lead.source}</h2>
            <p>New lead, never contacted. Speed to lead decides the deal. Received {ago(lead.receivedHoursAgo)}.</p>
            <div className="a-nba-actions">
              <a className="a-btn a-btn-ink" href={`tel:${lead.phone.replace(/\s/g, "")}`}><Phone size={16} /> Call now</a>
              <a className="a-btn a-btn-line" target="_blank" rel="noreferrer" href={`https://wa.me/${lead.phone.replace(/\D/g, "")}?text=${encodeURIComponent(`Hi ${lead.name.split(" ")[0]}, thanks for your enquiry about a ${lead.beds}BR in ${lead.area}. When is a good time for a quick call?`)}`}><MessageCircle size={16} /> WhatsApp template</a>
              <Link className="a-link-gold" to="/app/leads/$id" params={{ id: lead.id }}>View lead</Link>
              <button type="button" className="a-link-gold a-skip" onClick={() => setI((v) => v + 1)}>Skip <ArrowRight size={15} /></button>
            </div>
          </div>
          <div key={`${lead.id}-card`} className="a-mini-lead a-slide">
            <div className="who"><span className="a-avatar">{lead.initials}</span><div><b>{lead.name}</b><p className="muted num" style={{ fontSize: 14 }}>{lead.phone} · {lead.country}</p></div></div>
            <blockquote>“{lead.message}”</blockquote>
            <div className="a-chips"><TypeChip type={lead.type} /><PriorityChip lead={lead} /><span className="a-chip c-stage num">{formatAed(lead.budget)}</span></div>
          </div>
        </section>
      ) : null}

      <section className="a-kpis">
        <Kpi delay={80} label="Respond Now" value={s.respond} format={n} note="target: reply within 5 min" tone="t-hot" />
        <Kpi delay={120} label="New Leads Today" value={s.newToday} format={n} note={`${n(s.total)} leads in total`} />
        <Kpi delay={160} label="Sales Pipeline" value={s.pipeline} format={(x) => formatAed(x)} note={clientMode ? "qualified buyers' budgets" : `qualified buyers' budgets · ≈${formatAed(s.commission)} commission at 2%`} />
        <Kpi delay={200} label="Deals Won" value={s.won} format={n} note="across off-plan, ready and rent" tone="t-ok" />
      </section>

      <section className="a-row3">
        <div className="a-card a-fade" style={{ animationDelay: "240ms" }}>
          <div className="a-card-head"><h2>Work queues</h2><Link to="/app/leads" search={{ queue: "respond" }} className="a-link-gold">Inbox <ArrowRight size={15} /></Link></div>
          <div className="a-list">
            {QUEUES.filter((q) => q.id !== "all").map((q) => (
              <Link key={q.id} to="/app/leads" search={{ queue: q.id }} className="a-qrow">
                <span className={`a-dot d-${q.dot}`} />
                <span><b>{q.label}</b><small>{q.desc}</small></span>
                <span className="num">{n(s[q.id as "respond" | "hot" | "followup" | "nurture"])}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="a-card a-fade" style={{ animationDelay: "280ms" }}>
          <div className="a-card-head"><h2>Lead pipeline</h2><Link to="/app/$section" params={{ section: "pipelines" }} className="a-link-gold">Board <ArrowRight size={15} /></Link></div>
          <div className="a-donut">
            <svg viewBox="0 0 180 180" role="img" aria-label={`${openTotal} open leads by stage`}>
              <g transform="rotate(-90 90 90)">
                {s.byStage.map((st, k) => {
                  const len = (openTotal > 0 ? st.count / openTotal : 0) * C; const off = acc; acc += len;
                  return <circle key={st.stage} cx="90" cy="90" r={R} fill="none" stroke={STAGE_COLORS[k % STAGE_COLORS.length]} strokeWidth={hover === k ? 24 : 18}
                    strokeDasharray={`${Math.max(len - 1.5, 0)} ${C}`} strokeDashoffset={-off} opacity={hover === null || hover === k ? 1 : 0.35}
                    onMouseEnter={() => setHover(k)} onMouseLeave={() => setHover(null)} style={{ animation: `a-fade .6s ${k * 40}ms both` }} />;
                })}
              </g>
              <text x="90" y="88" textAnchor="middle" fontSize="28" fontWeight="750" fill="var(--a-ink)">{n(openTotal)}</text>
              <text x="90" y="110" textAnchor="middle" fontSize="14" fill="var(--a-ink-2)">open</text>
            </svg>
          </div>
          <ul className="a-legend">
            {s.byStage.map((st, k) => (
              <li key={st.stage} className={hover === k ? "on" : ""} onMouseEnter={() => setHover(k)} onMouseLeave={() => setHover(null)}>
                <span className="a-dot" style={{ background: STAGE_COLORS[k % STAGE_COLORS.length] }} />{st.stage}<span className="num">{n(st.count)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="a-card a-fade" style={{ animationDelay: "320ms" }}>
          <div className="a-card-head"><h2>Follow-ups today</h2><Link to="/app/leads" search={{ queue: "followup" }} className="a-link-gold">All <ArrowRight size={15} /></Link></div>
          <div className="a-list">
            {follow.map((l) => (
              <Link key={l.id} to="/app/leads/$id" params={{ id: l.id }} className="a-frow">
                <span className="who"><b>{l.name}</b><TypeChip type={l.type} /><small>{l.task} · {l.stage}</small></span>
                <span className="a-overdue">overdue</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="a-row2 a-home2">
        <div className="a-card a-fade a-mkt" style={{ animationDelay: "360ms" }}>
          <div className="a-card-head"><h2>Dubai market · September 2026</h2><span className="a-note">Illustrative · DLD format</span></div>
          <div className="a-market">
            <div><p className="eyebrow-a">Sales</p><strong className="num">10,537</strong><p>−13.2% vs prev.</p></div>
            <div><p className="eyebrow-a">Value</p><strong className="num">AED 27.5B</strong><p>all transactions</p></div>
            <div><p className="eyebrow-a">Off-plan</p><strong className="num">65.7%</strong><p>of sales</p></div>
            <div><p className="eyebrow-a">New leases</p><strong className="num">82,691</strong><p>Ejari</p></div>
          </div>
        </div>
        <div className="a-card a-fade a-flow" style={{ animationDelay: "400ms" }}>
          <div className="a-card-head"><h2>How to work 1,000 leads</h2><span className="a-note">daily flow</span></div>
          <ol className="a-stepper">
            {[["Respond now", "Auto-reply sent; you call within 5 min"], ["Hot", "Qualify and send a shortlist"], ["Follow-ups", "Due calls and viewings"], ["Pipeline", "Move deals one stage forward"], ["Nurture", "Automations keep cold leads warm"]].map(([t, d], k) => (
              <li className="a-step" key={t}><i>{k + 1}</i><b>{t}</b><small>{d}</small></li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
