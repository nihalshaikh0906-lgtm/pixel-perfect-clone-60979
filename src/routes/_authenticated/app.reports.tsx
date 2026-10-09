import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { workspaceHead } from "@/components/app/WorkspacePlaceholder";

export const Route = createFileRoute("/_authenticated/app/reports")({
  head: () => workspaceHead("Reports"),
  component: Page,
});

const TABS = ["Sales & Rentals", "Lead Conversion", "Agent Performance", "Inventory Ageing"] as const;
type Tab = (typeof TABS)[number];

// Mock 6-month revenue trend (AED) — illustrative only.
const TREND = [
  { m: "May", v: 1.8 }, { m: "Jun", v: 2.4 }, { m: "Jul", v: 2.1 },
  { m: "Aug", v: 3.0 }, { m: "Sep", v: 3.6 }, { m: "Oct", v: 4.2 },
];

function Page() {
  const [from, setFrom] = useState("2026-05-01");
  const [to, setTo] = useState("2026-10-31");
  const [tab, setTab] = useState<Tab>("Sales & Rentals");

  return (
    <>
      <section className="a-band a-fade">
        <div><p className="eyebrow-a">MONEY</p><h1>Reports</h1><p className="sub">Sales, conversion and team performance for the period you pick.</p></div>
        <div className="a-band-actions"><span className="a-chip c-stage">Sample figures — demo data</span></div>
      </section>

      <div className="a-card a-fade">
        <p className="eyebrow-a" style={{ marginTop: 0 }}>Report Period</p>
        <div className="a-rep-bar">
          <label>From<input type="date" value={from} max={to} onChange={(e) => setFrom(e.target.value)} /></label>
          <label>To<input type="date" value={to} min={from} onChange={(e) => setTo(e.target.value)} /></label>
        </div>
      </div>

      <div className="a-tabs a-fade" role="tablist" aria-label="Report sections" style={{ marginTop: 20 }}>
        {TABS.map((t) => <button key={t} type="button" role="tab" aria-selected={tab === t} className={`a-tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>{t}</button>)}
      </div>

      {tab === "Sales & Rentals" ? (
        <>
          <section className="a-kpis a-kpis-3 a-fade" style={{ marginTop: 20 }}>
            <div className="a-card a-kpi a-lift"><p className="eyebrow-a" style={{ marginTop: 0 }}>Deals Closed</p><strong className="num">27</strong><p>Sales and leases signed</p></div>
            <div className="a-card a-kpi a-lift"><p className="eyebrow-a" style={{ marginTop: 0 }}>Total Value</p><strong className="num">AED 17.1M</strong><p>Combined deal value</p></div>
            <div className="a-card a-kpi a-lift"><p className="eyebrow-a" style={{ marginTop: 0 }}>Commission</p><strong className="num t-ok">AED 342K</strong><p>Earned across the period</p></div>
          </section>
          <div className="a-card a-fade" style={{ marginTop: 20 }}>
            <div className="a-card-head"><h2>Revenue trend</h2><span className="a-count">Last 6 months · AED M</span></div>
            <div className="a-rep-chart">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={TREND} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke="var(--a-line)" strokeDasharray="3 5" vertical={false} />
                  <XAxis dataKey="m" tick={{ fill: "var(--a-ink-2)", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "var(--a-ink-2)", fontSize: 12 }} axisLine={false} tickLine={false} width={36} />
                  <Tooltip formatter={(v) => [`AED ${v}M`, "Revenue"]} contentStyle={{ background: "var(--a-card)", border: "1px solid var(--a-line)", borderRadius: 12, color: "var(--a-ink)" }} />
                  <Line type="monotone" dataKey="v" stroke="var(--a-gold)" strokeWidth={2.5} dot={{ r: 4, fill: "var(--a-gold)" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="a-mut">Illustrative numbers for the layout — not drawn from your deals.</p>
          </div>
        </>
      ) : (
        <div className="a-card a-fade" style={{ marginTop: 20 }}>
          <div className="a-card-head"><h2>{tab}</h2></div>
          <p className="a-note" style={{ margin: 0 }}>This report is on the way — its charts will appear here for the selected period.</p>
        </div>
      )}
    </>
  );
}
