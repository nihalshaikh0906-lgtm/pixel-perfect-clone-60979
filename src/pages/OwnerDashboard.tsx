import { AlertTriangle, Calendar, ChevronDown, TrendingDown, TrendingUp } from "lucide-react";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

import { useCountUp } from "@/components/app/AppShell";

const LeadSourceDonut = lazy(() => import("@/components/app/LeadSourceDonut"));


const RANGES = [
  "Jan 1 – Dec 31, 2026",
  "Oct 1 – Dec 31, 2026",
  "Jul 1 – Sep 30, 2026",
  "Jan 1 – Dec 31, 2025",
];

function money(n: number) {
  return n >= 1_000_000 ? `AED ${(n / 1_000_000).toFixed(1)}M` : `AED ${Math.round(n).toLocaleString("en-US")}`;
}

type KpiDef = { label: string; value: number; format: (n: number) => string; trend: string; up: boolean };

// Illustrative demo figures — nothing here reads from or writes to the database.
const KPIS: KpiDef[] = [
  { label: "Total Revenue YTD", value: 14_200_000, format: money, trend: "+12.4%", up: true },
  { label: "Active Pipeline Value", value: 8_500_000, format: money, trend: "+5.1%", up: true },
  { label: "Total Listings Value", value: 120_000_000, format: money, trend: "+2.3%", up: true },
  { label: "Conversion Rate", value: 4.2, format: (n) => `${n.toFixed(1)}%`, trend: "−0.3%", up: false },
];

type Agent = { name: string; role: string; deals: number; revenue: number };

// Illustrative demo roster — sample agents, not real users or real sales.
const AGENTS: Agent[] = [
  { name: "Layla Haddad", role: "Senior Sales Agent", deals: 14, revenue: 4_120_000 },
  { name: "Omar Farouk", role: "Sales Agent", deals: 11, revenue: 3_260_000 },
  { name: "Sofia Reyes", role: "Sales Agent", deals: 9, revenue: 2_480_000 },
  { name: "Daniel Kim", role: "Rentals Agent", deals: 7, revenue: 1_940_000 },
  { name: "Aisha Khan", role: "Rentals Agent", deals: 5, revenue: 1_180_000 },
];

const TEAM_REVENUE = AGENTS.reduce((sum, a) => sum + a.revenue, 0);
const TEAM_DEALS = AGENTS.reduce((sum, a) => sum + a.deals, 0);

type Source = { name: string; value: number; token: string };

// Illustrative demo split — sample leads by the channel they arrived through.
const SOURCES: Source[] = [
  { name: "Property Finder", value: 412, token: "--brand-blue" },
  { name: "Bayut", value: 293, token: "--brand-violet" },
  { name: "Referrals", value: 228, token: "--brand-deep" },
  { name: "Website", value: 152, token: "--a-ink-2" },
];

const TOTAL_LEADS = SOURCES.reduce((sum, s) => sum => sum, 0);

type Alert = { text: string; note: string; tag: string };

// Illustrative demo alerts — sample items, not real records.
const ALERTS: Alert[] = [
  { text: "Agent Saad is 20% below Q3 target", note: "Sales performance · flagged 2 days ago", tag: "Target" },
  { text: "High-value deal #1045 stalled for 14 days", note: "No activity since last follow-up", tag: "Stalled" },
  { text: "Commission payout AED 120k pending approval", note: "Awaiting owner sign-off", tag: "Approval" },
  { text: "3 unassigned leads waiting over 24 hours", note: "Portal enquiries · no owner yet", tag: "Leads" },
];


function initialsOf(name: string) {
  return name
    .split(/\s+/)
    .map((p) => p[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function KpiCard({ def, delay }: { def: KpiDef; delay: number }) {
  const v = useCountUp(def.value);
  return (
    <div className="a-card a-kpi a-fade a-lift" style={{ animationDelay: `${delay}ms` }}>
      <div className="od-kpi-head">
        <p className="eyebrow-a" style={{ margin: 0 }}>{def.label}</p>
        <span className={`od-trend ${def.up ? "up" : "down"} num`}>
          {def.up ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
          {def.trend}
        </span>
      </div>
      <strong className="num od-value">{def.format(v)}</strong>
      <p>vs. same period last year</p>
    </div>
  );
}

export function OwnerDashboard() {
  const [range, setRange] = useState(RANGES[0]);
  const [open, setOpen] = useState(false);
  const chartsRef = useRef<HTMLDivElement>(null);
  const chartsInView = useInView(chartsRef, { once: true, margin: "200px" });
  const reduce = useReducedMotion();
  const [charts, setCharts] = useState(false);
  useEffect(() => { if (chartsInView) setCharts(true); }, [chartsInView]);


  return (
    <div className="owner-dash">
      <section className="a-band a-fade">
        <div>
          <p className="eyebrow-a">Company Owner</p>
          <h1>Executive Overview</h1>
          <p className="sub num" style={{ whiteSpace: "normal" }}>Portfolio performance across sales, rentals and off-plan</p>
        </div>
        <div className="a-band-actions">
          <div className="a-pop-wrap">
            <button type="button" className="a-btn a-btn-line od-range" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
              <Calendar size={16} />
              <span className="num">{range}</span>
              <ChevronDown size={14} />
            </button>
            {open ? (
              <div className="a-pop" role="menu">
                {RANGES.map((r) => (
                  <button key={r} type="button" role="menuitem" className={r === range ? "od-on" : undefined} onClick={() => { setRange(r); setOpen(false); }}>{r}</button>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="a-kpis">
        {KPIS.map((k, i) => (
          <KpiCard key={k.label} def={k} delay={80 + i * 40} />
        ))}
      </section>

      <section className="a-row3 od-split">
        <div className="a-card a-fade od-span2 od-board">
          <div className="a-card-head">
            <h2>Team Leaderboard</h2>
            <span className="a-count num">{AGENTS.length} agents</span>
          </div>
          <div className="a-table-wrap">
            <table className="a-table">
              <thead>
                <tr>
                  <th scope="col">Rank</th>
                  <th scope="col">Agent Name</th>
                  <th scope="col">Deals Closed</th>
                  <th scope="col">Revenue Generated</th>
                </tr>
              </thead>
              <tbody>
                {AGENTS.map((a, i) => (
                  <tr key={a.name}>
                    <td>
                      <span className={`od-rank num${i === 0 ? " first" : ""}`}>{i + 1}</span>
                    </td>
                    <td>
                      <span className="a-usr-who">
                        <span className="a-avatar od-avatar" aria-hidden="true">{initialsOf(a.name)}</span>
                        <span>
                          <b>{a.name}</b>
                          <small>{a.role}</small>
                        </span>
                      </span>
                    </td>
                    <td>
                      <span className="num">{a.deals}</span>
                    </td>
                    <td>
                      <b className="num">{money(a.revenue)}</b>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="a-cards">
            {AGENTS.map((a, i) => (
              <div key={a.name} className="a-lcard">
                <span className="a-usr-who">
                  <span className={`od-rank num${i === 0 ? " first" : ""}`}>{i + 1}</span>
                  <span className="a-avatar od-avatar" aria-hidden="true">{initialsOf(a.name)}</span>
                  <span>
                    <b>{a.name}</b>
                    <small>{a.role}</small>
                  </span>
                </span>
                <span className="a-usr-meta">
                  <span className="a-mut" style={{ margin: 0 }}>{a.deals} deals closed</span>
                  <b className="num">{money(a.revenue)}</b>
                </span>
              </div>
            ))}
          </div>
          <div className="od-board-foot">
            <span>Team total</span>
            <b className="num">{TEAM_DEALS} deals · {money(TEAM_REVENUE)}</b>
          </div>
        </div>


        <div className="od-col" ref={chartsRef}>
          <div className="a-card a-fade od-share">
            <div className="a-card-head">
              <h2>Revenue Share</h2>
              <span className="a-count num">{money(TEAM_REVENUE)}</span>
            </div>
            <div className="a-list">
              {AGENTS.map((a) => (
                <div key={a.name}>
                  <span className="od-share-name">{a.name}</span>
                  <span className="a-chip c-offplan num">{((a.revenue / TEAM_REVENUE) * 100).toFixed(0)}%</span>
                </div>
              ))}
            </div>
            <p className="od-share-note">Top 5 agents of the roster shown above.</p>
          </div>

          <div className="a-card a-fade od-roi">
            <div className="a-card-head">
              <h2>Lead Source ROI</h2>
              <span className="a-count num">{TOTAL_LEADS.toLocaleString("en-US")} leads</span>
            </div>
            <div className="od-donut-row">
              {charts ? (
                <Suspense fallback={<span className="od-donut-wrap od-donut-loading" aria-hidden />}>
                  <LeadSourceDonut data={SOURCES} total={TOTAL_LEADS} animate={!reduce} />
                </Suspense>
              ) : (
                <span className="od-donut-wrap od-donut-loading" aria-hidden />
              )}
              <ul className="a-legend od-legend">
                {SOURCES.map((s) => (
                  <li key={s.name}>
                    <i style={{ background: `var(${s.token})` }} aria-hidden="true" />
                    <span>{s.name}</span>
                    <b className="num">{((s.value / TOTAL_LEADS) * 100).toFixed(0)}%</b>
                  </li>
                ))}
              </ul>
            </div>
            <p className="od-share-note">Illustrative demo split of sample leads by channel.</p>
          </div>
        </div>
      </section>

    </div>
  );
}
