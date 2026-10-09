import { AlertTriangle } from "lucide-react";
import { useState } from "react";

// Illustrative mock data only — not real agency figures.
const RANGES = ["Last 30 days", "Quarter to date", "Year to date", "Last 12 months"];
const KPIS = [
  { label: "Total Revenue YTD", value: "AED 18.4M", note: "+12% vs last year" },
  { label: "Active Pipeline Value", value: "AED 142M", note: "86 open deals" },
  { label: "Total Listings Value", value: "AED 1.2B", note: "412 active listings" },
  { label: "Conversion Rate", value: "4.8%", note: "Lead to closed deal" },
];
const AGENTS = [
  { name: "Aisha Khan", deals: 14, revenue: "AED 4.2M", conv: "6.1%" },
  { name: "Omar Haddad", deals: 11, revenue: "AED 3.6M", conv: "5.4%" },
  { name: "Priya Nair", deals: 9, revenue: "AED 2.9M", conv: "4.9%" },
  { name: "Daniel Ross", deals: 8, revenue: "AED 2.4M", conv: "4.2%" },
  { name: "Saad Malik", deals: 5, revenue: "AED 1.5M", conv: "3.1%" },
];
const SHARE = [["Off-plan", 46], ["Secondary sales", 28], ["Rentals", 16], ["Commercial", 10]] as const;
const ROI = [["Property Finder", 3.8], ["Bayut", 3.1], ["Referrals", 5.2], ["Meta Ads", 1.9], ["Google Ads", 2.4]] as const;
const ALERTS = [
  "Agent Saad is 20% below Q3 target",
  "High-value deal #1045 stalled for 14 days",
  "Commission payout AED 120k pending approval",
  "3 unassigned leads waiting over 24 hours",
];

export function OwnerOverview() {
  const [range, setRange] = useState(RANGES[2]);
  const maxRoi = Math.max(...ROI.map((r) => r[1]));
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <p className="eyebrow-a" style={{ marginTop: 0 }}>COMPANY OWNER</p>
          <h1 className="text-2xl font-semibold sm:text-3xl" style={{ color: "var(--a-ink)" }}>Executive Overview</h1>
        </div>
        <label className="flex items-center gap-2 text-sm" style={{ color: "var(--a-ink)" }}>
          Date range
          <select className="a-card px-3 py-2 text-sm" value={range} onChange={(e) => setRange(e.target.value)} aria-label="Date range">
            {RANGES.map((r) => <option key={r}>{r}</option>)}
          </select>
        </label>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {KPIS.map((k) => (
          <div key={k.label} className="a-card min-w-0 overflow-hidden p-5">
            <p className="eyebrow-a" style={{ marginTop: 0 }}>{k.label}</p>
            <strong className="num block truncate text-3xl font-semibold" style={{ color: "var(--a-ink)" }}>{k.value}</strong>
            <p className="mt-1 text-sm opacity-70">{k.note}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="a-card min-w-0 overflow-x-auto p-5 lg:col-span-2">
          <h2 className="mb-3 text-lg font-semibold" style={{ color: "var(--a-ink)" }}>Team Leaderboard</h2>
          <table className="w-full text-sm">
            <thead><tr className="text-left opacity-70"><th className="py-2">#</th><th>Agent</th><th>Deals</th><th>Revenue</th><th>Conversion</th></tr></thead>
            <tbody>
              {AGENTS.map((a, i) => (
                <tr key={a.name} className="num" style={{ borderTop: "1px solid var(--a-line, currentColor)" }}>
                  <td className="py-2" style={{ color: "var(--brand-blue)" }}>{i + 1}</td><td>{a.name}</td><td>{a.deals}</td><td>{a.revenue}</td><td>{a.conv}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="a-card min-w-0 p-5">
          <h2 className="mb-3 text-lg font-semibold" style={{ color: "var(--a-ink)" }}>Revenue Share</h2>
          <ul className="space-y-3">
            {SHARE.map(([l, p]) => (
              <li key={l}>
                <div className="flex justify-between text-sm"><span>{l}</span><span className="num">{p}%</span></div>
                <div className="mt-1 h-2 rounded-full" style={{ background: "color-mix(in oklab, var(--brand-blue) 15%, transparent)" }}>
                  <div className="h-2 rounded-full" style={{ width: `${p}%`, background: "var(--brand-blue)" }} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="a-card min-w-0 p-5">
          <h2 className="mb-3 text-lg font-semibold" style={{ color: "var(--a-ink)" }}>Lead Source ROI</h2>
          <ul className="space-y-3">
            {ROI.map(([l, v]) => (
              <li key={l} className="grid grid-cols-[7rem_minmax(0,1fr)_3rem] items-center gap-3 text-sm">
                <span className="truncate">{l}</span>
                <div className="h-3 rounded-full" style={{ width: `${(v / maxRoi) * 100}%`, background: "var(--brand-blue)" }} />
                <span className="num text-right">{v}x</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="a-card min-w-0 p-5">
          <h2 className="mb-3 text-lg font-semibold" style={{ color: "var(--a-ink)" }}>Needs Attention</h2>
          <ul className="space-y-3">
            {ALERTS.map((a) => (
              <li key={a} className="flex items-start gap-3 text-sm">
                <AlertTriangle size={16} className="mt-0.5 shrink-0" style={{ color: "var(--brand-blue)" }} />
                <span className="min-w-0">{a}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
