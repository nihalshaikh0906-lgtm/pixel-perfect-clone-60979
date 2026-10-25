import { createFileRoute, Link } from "@tanstack/react-router";

import { Accordion, meta, PublicLayout } from "@/components/public/PublicLayout";

export const Route = createFileRoute("/faq")({
  head: () =>
    meta(
      "FAQ · DealOS Dubai Real Estate CRM",
      "Answers about DealOS workflows, 34,850+ unit inventory, white-label client presentations, DLD data security, and subscriptions."
    ),
  component: FaqPage,
});

const CATS = [
  {
    t: "Workflow & Platform Capabilities",
    items: [
      {
        q: "Does DealOS communicate directly with my property buyers?",
        a: "No. DealOS operates strictly as your private back-office deal desk and co-pilot. It scores buyer requirements, matches live inventory, and prepares tailored WhatsApp pitches and PDF presentations for you to review and send directly from your personal communication channels.",
      },
      {
        q: "How does the AI synthesize Dubai market data every morning?",
        a: "Every day, our data engine aggregates official Dubai Land Department (DLD) transactions, master developer releases, and vetted market data. It highlights high-velocity market movers, price trends, and infrastructure catalysts directly in your dashboard.",
      },
      {
        q: "Can our agency add private resale and rental listings?",
        a: "Yes. In addition to the shared verified off-plan inventory, consultants and agency admins can add exclusive secondary and rental listings with custom photos, floor plans, and pricing that remain strictly private to your organization.",
      },
    ],
  },
  {
    t: "White-Labeling & Client Deliverables",
    items: [
      {
        q: "Will clients see the DealOS brand on exported brochures?",
        a: "Never. The document export engine is 100% white-labeled for your agency. You upload your agency logo, ORN, and RERA BRN in Account Settings; all generated payment milestones and property presentations carry your identity.",
      },
      {
        q: "Can we export developer payment schedules and Form F contracts?",
        a: "Yes. Every project includes an interactive payment milestone breakdown and DLD contract templates that convert into downloadable, client-ready PDFs with a single tap.",
      },
    ],
  },
  {
    t: "Security, Accounts & Compliance",
    items: [
      {
        q: "How is our brokerage and client lead data protected?",
        a: "Data is protected under UAE Federal Decree-Law No. 45/2021 on Personal Data Protection. Our multi-tenant architecture uses PostgreSQL Row Level Security (RLS) ensuring strict isolation between organizations. DealOS never shares, aggregates, or sells broker lead data.",
      },
      {
        q: "Can we cancel or upgrade our license at any time?",
        a: "Yes. All subscriptions offer flexible terms with zero hidden lock-in cancellation fees. Upgrades to higher tiers credit any remaining balance automatically.",
      },
    ],
  },
];

function FaqPage() {
  return (
    <PublicLayout>
      <section className="mx-auto max-w-3xl px-6 py-20">
        <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl text-foreground font-display">
          Frequently Asked Questions
        </h1>
        <p className="mt-4 text-[16px] text-muted-foreground">
          Everything you need to know about the DealOS operating system, live Dubai data, lead privacy, and onboarding.
        </p>
        {CATS.map((c) => (
          <div key={c.t} className="mt-14">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-amber-400">{c.t}</p>
            <Accordion items={c.items} />
          </div>
        ))}
        <div className="mt-20 flex flex-col items-center gap-5 rounded-2xl border border-amber-500/30 bg-card/60 p-10 text-center shadow-lg">
          <h2 className="text-2xl font-bold text-foreground">Ready to streamline your Dubai deal flow?</h2>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/pricing"
              className="rounded-xl bg-amber-400 hover:bg-amber-300 text-black px-6 py-3 text-xs font-bold uppercase tracking-[0.18em] shadow-md transition-all"
            >
              See Pricing Plans
            </Link>
            <Link
              to="/welcome"
              hash="cta"
              className="rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] transition-all"
            >
              Request Walkthrough
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
