import { AlertTriangle, Clock, Building, ShieldCheck, Send, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const RANGES = ["Last 30 days", "Quarter to date", "Year to date", "Last 12 months"];
const KPIS = [
  { label: "Gross Commission YTD", value: "AED 18.4M", note: "+18.2% vs target" },
  { label: "Active Pipeline Value", value: "AED 142M", note: "86 deals in negotiation" },
  { label: "Developer Debt Due", value: "AED 1.04M", note: "5 pending payouts" },
  { label: "Avg. Speed-to-Lead", value: "4.1 min", note: "92% contact rate (<5m)" },
];

const DEVELOPER_DEBTS = [
  { developer: "Emaar Properties", amount: "AED 340,000", days: 45, status: "Verified", deals: 3, project: "Address Creek / Emaar South" },
  { developer: "Sobha Realty", amount: "AED 280,000", days: 18, status: "Processing", deals: 2, project: "Sobha Hartland II" },
  { developer: "Danube Properties", amount: "AED 190,000", days: 62, status: "Overdue Alert", deals: 2, project: "Aspirz / Bayz 102" },
  { developer: "Reef Luxury Development", amount: "AED 145,000", days: 12, status: "Escrow Confirmed", deals: 1, project: "Reef 995 DLRC" },
  { developer: "Binghatti Developers", amount: "AED 85,000", days: 24, status: "Invoiced", deals: 1, project: "Binghatti Hills" },
];

const AGENTS = [
  { name: "Aisha Khan", deals: 14, revenue: "AED 4.2M", speed: "3.2 min", conv: "6.8%", status: "Top Producer" },
  { name: "Omar Haddad", deals: 11, revenue: "AED 3.6M", speed: "3.8 min", conv: "5.4%", status: "Active" },
  { name: "Priya Nair", deals: 9, revenue: "AED 2.9M", speed: "4.5 min", conv: "4.9%", status: "Active" },
  { name: "Daniel Ross", deals: 8, revenue: "AED 2.4M", speed: "6.8 min", conv: "4.2%", status: "Active" },
  { name: "Saad Malik", deals: 5, revenue: "AED 1.5M", speed: "38.2 min", conv: "3.1%", status: "Slow Response" },
];

const SHARE = [["Off-plan", 52], ["Secondary sales", 26], ["Rentals", 14], ["Commercial", 8]] as const;
const ROI = [["WhatsApp Cloud", 6.4], ["Meta Ads", 5.2], ["Property Finder", 3.8], ["Bayut", 3.1], ["Google Ads", 2.4]] as const;

export function OwnerOverview() {
  const [range, setRange] = useState(RANGES[2]);
  const [reminded, setReminded] = useState<Record<string, boolean>>({});
  const maxRoi = Math.max(...ROI.map((r) => r[1]));

  const sendReminder = (dev: string) => {
    setReminded((prev) => ({ ...prev, [dev]: true }));
    toast.success(`Formal DLD-backed payment reminder sent to ${dev} finance department.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <p className="eyebrow-a" style={{ marginTop: 0 }}>DEALOS EXECUTIVE WAR ROOM</p>
          <h1 className="text-2xl font-semibold sm:text-3xl" style={{ color: "var(--a-ink)" }}>Agency Owner Cockpit</h1>
          <p className="text-sm opacity-70">Real-time revenue forecast, developer debt recovery, and speed-to-lead audit.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
            <ShieldCheck size={14} /> DLD & RERA Audit Compliant (0 Fines)
          </span>
          <select className="a-card px-3 py-2 text-sm" value={range} onChange={(e) => setRange(e.target.value)} aria-label="Date range">
            {RANGES.map((r) => <option key={r}>{r}</option>)}
          </select>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {KPIS.map((k) => (
          <div key={k.label} className="a-card min-w-0 overflow-hidden p-5">
            <p className="eyebrow-a" style={{ marginTop: 0 }}>{k.label}</p>
            <strong className="num block truncate text-3xl font-semibold" style={{ color: "var(--a-ink)" }}>{k.value}</strong>
            <p className="mt-1 text-sm opacity-70">{k.note}</p>
          </div>
        ))}
      </div>

      {/* DEVELOPER DEBT RECOVERY LEDGER (BILLION-DOLLAR FEATURE) */}
      <div className="a-card min-w-0 overflow-x-auto p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold" style={{ color: "var(--a-ink)" }}>Developer Commission Debt Recovery Ledger</h2>
            <p className="text-xs opacity-70">Track outstanding agency commissions owed by master developers (Total due: AED 1,040,000).</p>
          </div>
          <span className="rounded-md border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-400">
            AED 190k Flagged &gt; 60 Days
          </span>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left opacity-70 border-b border-border/50">
              <th className="py-2.5">Developer</th>
              <th>Project Involved</th>
              <th>Deals</th>
              <th>Pending Amount</th>
              <th>Age (Days)</th>
              <th>Status</th>
              <th className="text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {DEVELOPER_DEBTS.map((d) => (
              <tr key={d.developer} className="border-t border-border/40 hover:bg-secondary/20 transition-colors">
                <td className="py-3 font-semibold text-primary flex items-center gap-2">
                  <Building size={15} className="opacity-70" /> {d.developer}
                </td>
                <td className="text-muted-foreground">{d.project}</td>
                <td className="num">{d.deals}</td>
                <td className="num font-bold text-emerald-400">{d.amount}</td>
                <td className="num">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${d.days > 60 ? "bg-red-500/20 text-red-400" : d.days > 30 ? "bg-amber-500/20 text-amber-400" : "bg-blue-500/20 text-blue-400"}`}>
                    {d.days} days
                  </span>
                </td>
                <td>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${d.status.includes("Alert") ? "bg-red-500/20 text-red-300 font-bold" : "bg-secondary text-muted-foreground"}`}>
                    {d.status}
                  </span>
                </td>
                <td className="text-right">
                  {reminded[d.developer] ? (
                    <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-medium">
                      <CheckCircle2 size={13} /> Reminder Sent
                    </span>
                  ) : (
                    <button
                      onClick={() => sendReminder(d.developer)}
                      className="a-btn a-btn-line text-xs py-1 px-2.5 hover:border-amber-400 hover:text-amber-300 inline-flex items-center gap-1"
                    >
                      <Send size={11} /> Send Escalation
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* TEAM LEADERBOARD & SPEED-TO-LEAD SENTINEL */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="a-card min-w-0 overflow-x-auto p-5 lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold" style={{ color: "var(--a-ink)" }}>Broker Performance & Speed-to-Lead Audit</h2>
            <span className="text-xs text-muted-foreground">Target: &lt; 5 min response</span>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left opacity-70">
                <th className="py-2">#</th>
                <th>Broker</th>
                <th>Deals</th>
                <th>Revenue</th>
                <th>Avg. Response</th>
                <th>Conversion</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {AGENTS.map((a, i) => (
                <tr key={a.name} className="num" style={{ borderTop: "1px solid var(--a-line, currentColor)" }}>
                  <td className="py-2.5" style={{ color: "var(--brand-blue)" }}>{i + 1}</td>
                  <td className="font-semibold">{a.name}</td>
                  <td>{a.deals}</td>
                  <td>{a.revenue}</td>
                  <td className={`font-mono text-xs ${parseFloat(a.speed) > 10 ? "text-red-400 font-bold" : "text-emerald-400"}`}>
                    <Clock size={12} className="inline mr-1" />{a.speed}
                  </td>
                  <td>{a.conv}</td>
                  <td>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${a.status === "Top Producer" ? "bg-amber-500/20 text-amber-300 font-bold" : a.status === "Slow Response" ? "bg-red-500/20 text-red-300 font-bold" : "bg-secondary text-muted-foreground"}`}>
                      {a.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="a-card min-w-0 p-5">
          <h2 className="mb-3 text-lg font-semibold" style={{ color: "var(--a-ink)" }}>Revenue by Sector</h2>
          <ul className="space-y-3">
            {SHARE.map(([l, p]) => (
              <li key={l}>
                <div className="flex justify-between text-sm">
                  <span>{l}</span>
                  <span className="num">{p}%</span>
                </div>
                <div className="mt-1 h-2 rounded-full" style={{ background: "color-mix(in oklab, var(--brand-blue) 15%, transparent)" }}>
                  <div className="h-2 rounded-full" style={{ width: `${p}%`, background: "var(--brand-blue)" }} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* LEAD SOURCE ROI & ATTRIBUTION */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="a-card min-w-0 p-5">
          <h2 className="mb-3 text-lg font-semibold" style={{ color: "var(--a-ink)" }}>Marketing Channel ROI Attribution</h2>
          <p className="text-xs text-muted-foreground mb-3">Gross commission earned per AED 1.00 ad spend.</p>
          <ul className="space-y-3">
            {ROI.map(([l, v]) => (
              <li key={l} className="grid grid-cols-[8rem_minmax(0,1fr)_3rem] items-center gap-3 text-sm">
                <span className="truncate">{l}</span>
                <div className="h-3 rounded-full" style={{ width: `${(v / maxRoi) * 100}%`, background: "var(--brand-blue)" }} />
                <span className="num text-right font-bold text-emerald-400">{v}x</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="a-card min-w-0 p-5">
          <h2 className="mb-3 text-lg font-semibold" style={{ color: "var(--a-ink)" }}>Live Executive Alerts</h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-3 text-sm">
              <AlertTriangle size={16} className="mt-0.5 shrink-0 text-red-400" />
              <span><strong>Danube Properties:</strong> AED 190,000 commission overdue for 62 days on Aspirz deal #1042.</span>
            </li>
            <li className="flex items-start gap-3 text-sm">
              <AlertTriangle size={16} className="mt-0.5 shrink-0 text-amber-400" />
              <span><strong>Speed-to-Lead Alert:</strong> Agent Saad Malik has 3 inbound Meta leads uncontacted for over 35 minutes.</span>
            </li>
            <li className="flex items-start gap-3 text-sm">
              <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-400" />
              <span><strong>RERA Compliance:</strong> All 24 active portal listings have verified Trakheesi permits. 0 fine exposure.</span>
            </li>
            <li className="flex items-start gap-3 text-sm">
              <Building size={16} className="mt-0.5 shrink-0 text-blue-400" />
              <span><strong>Reef 995 DLRC:</strong> Client EOI token confirmed (AED 50k); commission voucher pending issuance.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
