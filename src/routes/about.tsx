import { createFileRoute, Link } from "@tanstack/react-router";

import { Eyebrow, meta, PublicLayout } from "@/components/public/PublicLayout";

export const Route = createFileRoute("/about")({
  head: () => meta("About PropFlow · Intelligence Co-Pilot for Dubai Consultants", "Why PropFlow exists: a private back-office co-pilot for Dubai real estate consultants."),
  component: AboutPage,
});

const PILLARS = [
  { t: "AI Market Intelligence", d: "Daily 8:00 AM market briefings, live project highlights, and infrastructure catalysts." },
  { t: "Smart Pipeline & Matching", d: "A unified single-view pipeline that scores leads and matches them with the right inventory instantly." },
  { t: "White-Glove Export Engine", d: "Bespoke, white-labeled PDF dossiers and WhatsApp pitches carrying your own brokerage identity." },
];

function AboutPage() {
  return (
    <PublicLayout>
      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <Eyebrow>About PropFlow</Eyebrow>
        <h1 className="mt-4 text-4xl font-medium md:text-5xl">A private co-pilot for property consultants</h1>
        <p className="mx-auto mt-6 max-w-2xl text-[16px] text-[#5c554e]">PropFlow is the private concierge platform for Dubai real estate. It automates lead qualification, matches properties instantly, and generates branded client dossiers — so you spend your time advising, not searching spreadsheets.</p>
      </section>
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="grid border-y border-[var(--obsidian)]/10 md:grid-cols-3 md:divide-x md:divide-[var(--obsidian)]/10">
          {PILLARS.map((f, n) => (
            <div key={f.t} className="px-8 py-10">
              <p className="metric text-sm text-[var(--bronze)]">0{n + 1}</p>
              <h3 className="mt-3 text-lg font-semibold tracking-normal">{f.t}</h3>
              <p className="mt-3 text-[15px] text-[#5c554e]">{f.d}</p>
            </div>
          ))}
        </div>
        <div className="mt-14 text-center">
          <Link to="/pricing" className="rounded-full bg-[var(--bronze)] px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--silk)]">Explore pricing & tiers</Link>
        </div>
      </section>
    </PublicLayout>
  );
}
