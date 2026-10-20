import { createFileRoute, Link } from "@tanstack/react-router";

import { Eyebrow, meta, PublicLayout } from "@/components/public/PublicLayout";

export const Route = createFileRoute("/about")({
  head: () =>
    meta(
      "About DealOS · Dubai Real Estate Operating System",
      "Why DealOS exists: institutional deal desk, live Dubai inventory, and agency overwatch for high-velocity UAE real estate brokerages."
    ),
  component: AboutPage,
});

const PILLARS = [
  {
    t: "Institutional Dubai Inventory",
    d: "34,850+ verified units across 1,355+ off-plan developments with verified DLD transaction benchmarks, escrow accounts, and payment plans.",
  },
  {
    t: "High-Velocity Lead Intelligence",
    d: "Speed to lead prioritized queues, 1-tap WhatsApp pitch scripts, and real-time KYC Form F contract preparation in minutes.",
  },
  {
    t: "Executive Agency Overwatch",
    d: "Real-time broker leaderboard, deal stages radar, developer commission aging ledger, and complete multi-tenant role isolation.",
  },
];

function AboutPage() {
  return (
    <PublicLayout>
      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <Eyebrow>About DealOS</Eyebrow>
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight md:text-5xl text-foreground font-display">
          The Operating System Built on Dubai Data
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-[16px] text-muted-foreground">
          DealOS is the specialized real estate CRM and Deal OS built specifically for the realities of the UAE market. It replaces disconnected spreadsheets, chaotic WhatsApp groups, and generic foreign software with an institutional operating system that powers every step from portal lead to signed SPA.
        </p>
      </section>
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="grid border-y border-border/60 md:grid-cols-3 md:divide-x md:divide-border/60">
          {PILLARS.map((f, n) => (
            <div key={f.t} className="px-8 py-10 space-y-2">
              <p className="metric text-sm text-amber-400 font-bold">0{n + 1}</p>
              <h3 className="text-lg font-bold tracking-normal text-foreground">{f.t}</h3>
              <p className="text-[14px] text-muted-foreground">{f.d}</p>
            </div>
          ))}
        </div>
        <div className="mt-14 text-center flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/pricing"
            className="rounded-xl bg-amber-400 hover:bg-amber-300 text-black px-6 py-3 text-xs font-bold uppercase tracking-[0.18em] shadow-md transition-all"
          >
            Explore Pricing &amp; Plans
          </Link>
          <Link
            to="/welcome"
            hash="cta"
            className="rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] transition-all"
          >
            Request Agency Walkthrough
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}
