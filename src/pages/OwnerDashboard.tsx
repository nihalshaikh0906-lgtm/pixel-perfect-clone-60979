import { Calendar, ChevronDown, TrendingDown, TrendingUp } from "lucide-react";
import { useState } from "react";

import { useCountUp } from "@/components/app/AppShell";

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
    </div>
  );
}
