import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/welcome")({
  head: () => ({
    meta: [
      { title: "PropFlow · AI Intelligence Platform for Dubai Brokers" },
      { name: "description", content: "One platform, one AI engine: lead matching, market intelligence and white-label client dossiers for Dubai real estate brokers." },
      { property: "og:title", content: "PropFlow · AI Intelligence Platform for Dubai Brokers" },
      { property: "og:description", content: "One platform, one AI engine: lead matching, market intelligence and white-label client dossiers for Dubai real estate brokers." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const ROTATING = ["Top-Tier Brokers", "Elite Agencies", "Private Wealth Advisors"];

const FEATURES = [
  { t: "AI Market Intelligence", d: "Daily 8:00 AM market briefings, live project highlights, and infrastructure catalysts from DLD and top news feeds." },
  { t: "Smart Pipeline & Matching", d: "A unified single-view pipeline. Instantly score incoming leads and auto-match them with the right inventory in milliseconds." },
  { t: "White-Glove Export Engine", d: "Generate bespoke, white-labeled PDF dossiers and WhatsApp pitches carrying your own brokerage logo and contact details." },
];

const FAQ = [
  { q: "Does the AI talk directly to my clients?", a: "No. PropFlow acts as your private advisor. It drafts high-converting pitches and documents for you to review, brand, and send yourself." },
  { q: "Can I use my own company branding?", a: "Yes. The platform features a complete white-label PDF engine. Upload your logo once, and every property dossier generated will carry your agency's identity." },
  { q: "Where does the daily market data come from?", a: "We aggregate and summarize live RSS feeds daily from the Dubai Land Department, Gulf News, and major developer announcements." },
];

const PLANS = [
  { name: "One-Month Pass", was: 200, now: 100, cta: "Start 1-Month Plan", b: "Test the waters. Full access to AI matching, daily intelligence, and white-label PDFs to help you close your first deal faster." },
  { name: "Quarter Pass · 3 Months", was: 500, now: 250, cta: "Start 3-Month Plan", b: "Build momentum. Automate your lead pipeline and establish market dominance with consistent, high-quality client presentations." },
  { name: "Professional Tier · 6 Months", was: 1000, now: 500, cta: "Start 6-Month Plan", b: "Scale your book of business. Perfect for active brokers managing high-volume VIP leads and relying on daily macro market trends." },
  { name: "Elite Broker License · 1 Year", was: 1800, now: 900, cta: "Start 1-Year Plan", b: "The ultimate standard. Lock in year-round AI concierge access, maximum ROI on your software, and uninterrupted pipeline automation." },
];

const aed = (n: number) => `AED ${n.toLocaleString("en-US")}`;
const gold = "text-[var(--champagne)]";

function Landing() {
  const [i, setI] = useState(0);
  const [open, setOpen] = useState<number | null>(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % ROTATING.length), 3000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="bg-[var(--silk)] text-[var(--obsidian)]">
      <section className="relative overflow-hidden" style={{ background: "radial-gradient(60% 50% at 80% 20%, #E8DCCB 0%, transparent 70%), radial-gradient(50% 60% at 10% 70%, #F4EFEA 0%, transparent 70%), var(--silk)" }}>
        <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <span className="text-lg font-semibold tracking-[0.3em]">PROPFLOW</span>
          <nav className="hidden gap-8 text-[13px] font-medium md:flex">
            <a href="#about" className="hover:text-[var(--champagne)]">About Us</a>
            <a href="#faq" className="hover:text-[var(--champagne)]">FAQ</a>
            <a href="#plans" className="hover:text-[var(--champagne)]">Pricing</a>
          </nav>
          <div className="flex items-center gap-4">
            <Link to="/login" search={{ mode: undefined }} className="text-[13px] font-medium hover:text-[var(--champagne)]">Login</Link>
            <a href="#plans" className="rounded-full bg-[var(--champagne)] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--obsidian)] hover:opacity-90">View Plans</a>
          </div>
        </header>

        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-6 pb-24 pt-10 lg:grid-cols-[1fr_1.1fr] lg:pt-16">
          <div>
            <p className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${gold}`}>AI platform for Dubai real estate</p>
            <h1 className="mt-5 text-4xl font-medium leading-tight md:text-5xl">
              One platform. One intelligence engine. Built for{" "}
              <span key={i} className={`inline-block animate-in fade-in slide-in-from-bottom-2 duration-700 ${gold}`}>{ROTATING[i]}.</span>
            </h1>
            <p className="mt-6 max-w-xl text-[16px] text-[#5c554e]">
              PropFlow is the definitive private concierge platform for Dubai real estate. Automate lead qualification, match properties instantly, and generate branded client dossiers with our AI engine — giving you the ultimate competitive edge.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#plans" className="rounded-full bg-[var(--champagne)] px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--obsidian)]">View Plans</a>
              <Link to="/login" search={{ mode: "signup" }} className="rounded-full border border-[var(--obsidian)]/20 px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] hover:bg-[var(--obsidian)]/5">Create account</Link>
            </div>
          </div>
          <DashboardMockup />
        </div>
      </section>

      <section id="about" className="mx-auto max-w-7xl scroll-mt-10 px-6 py-24">
        <p className={`text-center text-[11px] font-semibold uppercase tracking-[0.18em] ${gold}`}>About PropFlow</p>
        <h2 className="mt-4 text-center text-3xl font-medium">Everything a private advisor needs</h2>
        <div className="mt-14 grid border-y border-[var(--obsidian)]/10 md:grid-cols-3 md:divide-x md:divide-[var(--obsidian)]/10">
          {FEATURES.map((f, n) => (
            <div key={f.t} className="px-8 py-10">
              <p className={`metric text-sm ${gold}`}>0{n + 1}</p>
              <h3 className="mt-3 text-lg font-semibold tracking-normal">{f.t}</h3>
              <p className="mt-3 text-[15px] text-[#5c554e]">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-3xl scroll-mt-10 px-6 pb-24">
        <h2 className="text-center text-3xl font-medium">Frequently asked questions</h2>
        <div className="mt-10 border-t border-[var(--obsidian)]/10">
          {FAQ.map((f, n) => (
            <div key={f.q} className="border-b border-[var(--obsidian)]/10">
              <button onClick={() => setOpen(open === n ? null : n)} className="flex w-full items-center justify-between py-5 text-left text-[16px] font-medium">
                {f.q}
                <ChevronDown className={`size-4 shrink-0 transition-transform ${open === n ? "rotate-180" : ""}`} />
              </button>
              {open === n ? <p className="pb-5 text-[15px] text-[#5c554e]">{f.a}</p> : null}
            </div>
          ))}
        </div>
      </section>

      <section id="plans" className="scroll-mt-10 px-6 pb-28" style={{ background: "linear-gradient(to bottom, var(--silk), #F4EFEA)" }}>
        <div className="mx-auto max-w-7xl text-center">
          <p className={`inline-block rounded-full border border-[var(--champagne)]/60 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] ${gold}`}>50% launch discount on every plan</p>
          <h2 className="mt-5 text-3xl font-medium">Private access plans</h2>
          <div className="mt-12 grid gap-5 text-left sm:grid-cols-2 lg:grid-cols-4">
            {PLANS.map((p) => (
              <div key={p.name} className="flex flex-col rounded-2xl border border-[var(--champagne)]/30 bg-white/70 p-6 backdrop-blur-md" style={{ boxShadow: "0 30px 80px -30px rgba(197,168,128,0.25)" }}>
                <span className="self-start rounded-full bg-[var(--champagne)]/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8e7453]">50% off</span>
                <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8e7453]">{p.name}</p>
                <p className="metric mt-5 text-sm text-[#5c554e] line-through">{aed(p.was)}</p>
                <p className="metric mt-1 text-4xl font-medium tracking-tight">{aed(p.now)}</p>
                <p className="mt-5 flex-1 text-[14px] text-[#5c554e]">{p.b}</p>
                <Link to="/login" search={{ mode: "signup" }} className="mt-6 rounded-full bg-[var(--obsidian)] px-4 py-2.5 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--silk)] hover:opacity-90">{p.cta}</Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function DashboardMockup() {
  const rows = [
    ["Sarah Al Mansouri", "Marina Star · 2BR", "94%", "AED 2.4M"],
    ["James Whitfield", "Oasis Residences · 1BR", "91%", "AED 1.0M"],
    ["Priya Nair", "Creek Vista · 3BR", "88%", "AED 3.1M"],
    ["Ahmed Hassan", "Palm Villas · 4BR", "85%", "AED 8.9M"],
  ];
  return (
    <div className="relative rounded-2xl border border-[var(--champagne)]/30 bg-white/80 p-5 backdrop-blur-xl lg:translate-x-6" style={{ boxShadow: "0 40px 100px -20px rgba(197,168,128,0.35)" }} aria-hidden>
      <div className="flex items-center justify-between border-b border-[var(--obsidian)]/10 pb-3">
        <span className="text-xs font-semibold tracking-[0.3em]">PROPFLOW</span>
        <div className="flex gap-1.5">{["Dashboard", "Leads", "Inventory"].map((x, n) => <span key={x} className={`rounded-full px-2.5 py-1 text-[10px] ${n === 0 ? "bg-[var(--champagne)]/20" : "text-[#5c554e]"}`}>{x}</span>)}</div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3">
        {[["Open budgets", "AED 39.2M"], ["Live units", "41,166"], ["Hot leads", "4"]].map(([l, v]) => (
          <div key={l} className="rounded-xl border border-[var(--obsidian)]/10 p-3">
            <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#8e7453]">{l}</p>
            <p className="metric mt-1 text-lg font-medium">{v}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 space-y-2">
        {rows.map(([n, u, s, p]) => (
          <div key={n} className="flex items-center justify-between rounded-lg border border-[var(--obsidian)]/5 bg-[var(--silk)] px-3 py-2 text-[12px]">
            <span className="font-medium">{n}</span>
            <span className="hidden text-[#5c554e] sm:inline">{u}</span>
            <span className="metric rounded-full bg-[var(--champagne)]/20 px-2 py-0.5 text-[10px]">{s}</span>
            <span className="metric font-medium">{p}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
