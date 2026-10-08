import { createFileRoute, Link } from "@tanstack/react-router";

import { Accordion, meta, PublicLayout } from "@/components/public/PublicLayout";

export const Route = createFileRoute("/faq")({
  head: () => meta("FAQ · PropFlow", "Answers about PropFlow's workflow, white-label dossiers, data sources, security and subscriptions."),
  component: FaqPage,
});

const CATS = [
  { t: "Workflow & Functionality", items: [
    { q: "Does the platform communicate directly with my buyers?", a: "No. PropFlow is strictly your private back-office co-pilot. It qualifies requirements, ranks matching units, and prepares formatted pitches and dossiers for you to review and send from your own WhatsApp, email, or phone." },
    { q: "How does the AI summarize market news every morning?", a: "Every day at 8:00 AM UAE time, our pipeline synthesizes official DLD transactions, municipal announcements, and vetted property news into an executive digest. It highlights market movers, price trends, and infrastructure catalysts directly in your dashboard." },
    { q: "Can I add my own private resale and rental listings?", a: "Yes. In addition to the global off-plan inventory, you can add your exclusive listings with custom photos, floor plans, and pricing. These remain strictly private to your personal account." },
  ] },
  { t: "White-Labeling & Client Deliverables", items: [
    { q: "Will my clients see the PropFlow name on exported brochures?", a: "Never. The document engine is 100% white-labeled. You upload your agency logo and contact details once in Account Settings; all generated PDFs and payment milestone schedules display your brand." },
    { q: "Can I export payment schedules and booking forms as PDFs?", a: "Yes. Every property includes an interactive payment milestone breakdown that converts into a downloadable, client-ready PDF with a single click." },
  ] },
  { t: "Security, Accounts & Subscriptions", items: [
    { q: "How does phone OTP verification work?", a: "During onboarding or login, a 6-digit verification code confirms your registered phone number, ensuring your client pipeline and custom inventory remain secure." },
    { q: "Can I switch or cancel my plan at any time?", a: "Yes. Subscriptions run for the selected duration (1, 3, 6, or 12 months) with no lock-in contracts or hidden cancellation penalties." },
  ] },
];

function FaqPage() {
  return (
    <PublicLayout>
      <section className="mx-auto max-w-3xl px-6 py-20">
        <h1 className="text-4xl font-medium md:text-5xl">Frequently Asked Questions</h1>
        <p className="mt-4 text-[16px] text-[#4B5272]">Everything you need to know about the platform, intelligence sources, data confidentiality, and onboarding.</p>
        {CATS.map((c) => (
          <div key={c.t} className="mt-14">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--bronze)]">{c.t}</p>
            <Accordion items={c.items} />
          </div>
        ))}
        <div className="mt-20 flex flex-col items-center gap-5 rounded-2xl border border-[var(--bronze)]/30 bg-white/60 p-10 text-center">
          <h2 className="text-2xl font-medium">Ready to streamline your brokerage?</h2>
          <Link to="/pricing" className="rounded-full bg-[var(--bronze)] px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--silk)]">See pricing</Link>
        </div>
      </section>
    </PublicLayout>
  );
}
