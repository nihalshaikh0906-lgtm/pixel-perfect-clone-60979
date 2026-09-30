import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";

import { Eyebrow, meta, PublicLayout } from "@/components/public/PublicLayout";

export const Route = createFileRoute("/pricing")({
  head: () => meta("Pricing · PropFlow Advisory Licenses", "PropFlow plans from AED 100 — 50% launch discount on every 1, 3, 6 and 12-month advisory license."),
  component: PricingPage,
});

const PLANS = [
  { name: "1-Month Trial Pass", was: 200, now: 100, per: "/ month", note: "Billed monthly", v: "Ideal for evaluating the platform on active deals.", inc: ["Full access to 40,000+ project database", "Daily 8:00 AM market briefings", "AI client matching & 5-point pitch generator", "White-label PDF exports"], cta: "Get Started" },
  { name: "3-Month Quarter Pass", was: 500, now: 250, per: "/ quarter", note: "~AED 83/mo", popular: true, v: "Built for consultants actively working qualified buyers through a 90-day pipeline.", inc: ["All 1-Month features", "Priority database sync", "Private inventory storage"], cta: "Start 3-Month Plan" },
  { name: "6-Month Professional Tier", was: 1000, now: 500, per: "/ half-year", note: "~AED 83/mo", v: "For seasoned advisors handling steady deal flow and multi-unit investors.", inc: ["All Quarter Pass features", "Multi-asset comparison tables", "Advanced satellite mapping tools"], cta: "Start 6-Month Plan" },
  { name: "1-Year Elite License", was: 1800, now: 900, per: "/ year", note: "AED 75/mo — Maximum Savings", v: "The complete annual operating system for top-producing property consultants.", inc: ["Unlimited white-label dossiers", "Dedicated account onboarding", "Continuous database updates", "Feature priority"], cta: "Claim Annual License" },
];

const aed = (n: number) => `AED ${n.toLocaleString("en-US")}`;

function PricingPage() {
  return (
    <PublicLayout>
      <section className="mx-auto max-w-7xl px-6 py-20 text-center">
        <Eyebrow>Transparent value. No hidden fees.</Eyebrow>
        <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-medium md:text-6xl">Select Your Advisory License</h1>
        <p className="mx-auto mt-5 max-w-2xl text-[16px] text-[#5c554e]">All plans include 50% introductory savings for the first 3 months. Close one additional transaction and your subscription pays for itself many times over.</p>
        <p className="mt-6 inline-block rounded-full border border-[var(--bronze)]/50 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--bronze)]">✨ 50% launch discount applied to all plans</p>

        <div className="mt-14 grid gap-5 text-left sm:grid-cols-2 lg:grid-cols-4">
          {PLANS.map((p) => (
            <div key={p.name} className={`relative flex flex-col rounded-2xl border bg-white/70 p-6 backdrop-blur-md ${p.popular ? "border-[var(--bronze)]" : "border-[var(--obsidian)]/10"}`} style={{ boxShadow: "0 30px 80px -30px rgba(158,123,79,0.25)" }}>
              {p.popular ? <span className="absolute -top-3 left-6 rounded-full bg-[var(--bronze)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--silk)]">Most popular</span> : null}
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--bronze)]">{p.name}</p>
              <p className="metric mt-5 text-sm text-[#5c554e] line-through">{aed(p.was)}</p>
              <p className="mt-1"><span className="metric text-4xl font-medium tracking-tight">{aed(p.now)}</span> <span className="text-sm text-[#5c554e]">{p.per}</span></p>
              <p className="metric mt-1 text-xs text-[#5c554e]">{p.note}</p>
              <p className="mt-5 text-[14px] italic text-[#5c554e]">{p.v}</p>
              <ul className="mt-5 flex-1 space-y-2 text-[14px]">
                {p.inc.map((x) => <li key={x} className="flex gap-2"><Check className="mt-1 size-3.5 shrink-0 text-[var(--bronze)]" />{x}</li>)}
              </ul>
              <Link to="/login" search={{ mode: "signup" }} className="mt-6 rounded-full bg-[var(--obsidian)] px-4 py-2.5 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--silk)] hover:opacity-90">{p.cta}</Link>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-14 max-w-3xl rounded-2xl border border-[var(--obsidian)]/10 bg-white/60 p-8 text-[15px] text-[#5c554e]">
          Managing a team of 5+ consultants? Contact our concierge desk for centralized brokerage seats and custom CRM integrations.
        </div>
      </section>
    </PublicLayout>
  );
}
