import { createFileRoute } from "@tanstack/react-router";
import { Check, FileText, Building2, Settings, X, Zap } from "lucide-react";
import type { ReactNode } from "react";

import { Accordion, meta, PublicLayout } from "@/components/public/PublicLayout";

export const Route = createFileRoute("/welcome")({
  head: () => meta("PropFlow · The Only AI Software Dubai Brokers Need", "Organize leads, match properties from 40,000+ Dubai units, and close deals with branded dossiers — all in one place."),
  component: Landing,
});

const muted = "text-[#5c554e]";
const ink = "text-[var(--burgundy)]";
const gold = "text-[var(--gold)]";
const card = "rounded-xl border border-[var(--sand)] bg-white p-6";

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

function Landing() {
  return (
    <PublicLayout>
      {/* 1. Hero */}
      <section className="bg-[var(--silk)] px-6 pb-24 pt-20">
        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
          <div>
            <p className={`text-xs font-bold uppercase tracking-[0.15em] ${gold}`}>All-in-one real estate AI</p>
            <h1 className={`mb-6 mt-5 text-5xl font-semibold leading-tight md:text-7xl ${ink}`}>The only AI software Dubai real estate brokers need.</h1>
            <p className={`max-w-xl text-[17px] leading-[1.7] ${muted}`}>Stop losing deals because you are too busy doing paperwork. PropFlow gives you everything you need to organize your leads, find the perfect property, and close the deal — all in one place.</p>
            <button onClick={() => scrollTo("pricing")} className="mt-10 rounded-md bg-[var(--gold)] px-8 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-white hover:opacity-90">View pricing plans</button>
          </div>
          <PipelineMockup />
        </div>
      </section>

      {/* 2. Growth engine */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <h2 className={`mx-auto max-w-3xl text-center text-3xl font-medium leading-snug md:text-4xl ${ink}`}>From your first lead to closing day, PropFlow makes your job simple.</h2>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          <Step icon={<Zap />} t="1. Organize & Match Instantly" body="Stop searching through spreadsheets. Just type in what your buyer wants, and our AI instantly finds the perfect match from over 40,000 off-plan and private listings.">
            <p className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${gold}`}>Client wants</p>
            <p className="mt-1 text-[13px] font-medium">2–3BR · Dubai Marina · <span className="metric">AED 2.5M</span></p>
            <div className="mt-3 flex items-center justify-between rounded-lg border border-[var(--sand)] bg-white px-3 py-2 text-[13px]">
              <span className="font-medium">Marina Star</span>
              <span className="metric rounded-full bg-[var(--gold)]/15 px-2 py-0.5 text-[11px] text-[var(--gold)]">90% match</span>
            </div>
          </Step>
          <Step icon={<Building2 />} t="2. View Complete Dossiers" body="Access everything you need in one click. Instantly view high-resolution photos, unit sizes, and handover dates without opening multiple developer websites.">
            <div className="grid grid-cols-3 gap-1.5">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="aspect-square rounded-md" style={{ background: `linear-gradient(${40 * i}deg, #eae4dc, #c5a880)`, opacity: 0.55 + (i % 3) * 0.15 }} />
              ))}
            </div>
            <p className="mt-2 flex justify-between text-[11px]"><span>1,120 sqft</span><span className="metric">Handover Q2 2027</span></p>
          </Step>
          <Step icon={<FileText />} t="3. Pitch & Present" body="Look like a top-tier professional. Generate beautiful PDF brochures, calculate payment plans, or send an AI-crafted pitch directly to WhatsApp with your own contact details.">
            <div className="grid grid-cols-2 gap-2">
              {["View Floorplan", "View Payment Plan", "View Location", "Copy Pitch & WhatsApp"].map((a, i) => (
                <div key={a} className={`rounded-md border px-2 py-2 text-center text-[10px] font-semibold uppercase tracking-wider ${i === 3 ? "border-[var(--gold)] bg-[var(--gold)] text-white" : "border-[var(--sand)] bg-white"}`}>{a}</div>
              ))}
            </div>
          </Step>
        </div>
      </section>

      {/* 3. Problems vs solutions */}
      <section className="bg-[var(--burgundy)] px-6 py-24 text-[var(--silk)]">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center text-3xl font-medium md:text-4xl">Stop losing opportunities every day.</h2>
          <div className="grid gap-10 md:grid-cols-2">
            <ul className="space-y-6">
              {["You are wasting hours jumping between WhatsApp, Excel, and developer websites.", "It takes too long to calculate payment plans and make PDFs for clients.", "You miss out on selling new launches because you didn't see the news in time."].map((x) => (
                <li key={x} className="flex gap-3 text-[16px] text-[var(--silk)]/55"><X className="mt-1 size-4 shrink-0" />{x}</li>
              ))}
            </ul>
            <ul className="space-y-6">
              {["Keep all your leads, properties, and daily news organized in one single dashboard.", "Let the AI instantly calculate payment milestones and generate your brochures.", "Read a quick summary of the market's most important updates each day."].map((x) => (
                <li key={x} className="flex gap-3 text-[16px]"><Check className="mt-1 size-4 shrink-0 text-[var(--champagne)]" />{x}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 4. Feature grid */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ["AI Property Matching", "Type in a budget, and the AI finds the property for you."],
            ["Daily Market News", "A simple, automated daily summary of Dubai real estate news."],
            ["1-Click Branded PDFs", "Create beautiful client presentations with your own logo."],
            ["Private Inventory", "Upload your own rental and secondary market listings safely under \"My Listings\"."],
            ["Interactive Satellite Maps", "Click \"View Location\" to show clients exactly where the property is with live maps."],
            ["Instant WhatsApp Pitches", "Generate and copy high-converting property pitches straight to WhatsApp."],
          ].map(([t, d]) => (
            <div key={t} className="border border-[var(--sand)] bg-[var(--silk)] p-8">
              <h3 className={`text-[17px] font-semibold ${ink}`}>{t}</h3>
              <p className={`mt-2 text-[15px] ${muted}`}>{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Why PropFlow */}
      <section className="bg-[var(--burgundy)] px-6 py-24 text-[var(--silk)]">
        <div className="mx-auto max-w-6xl">
          <h2 className="mx-auto max-w-3xl text-center text-3xl font-medium leading-snug md:text-4xl">Why Dubai brokers choose PropFlow over generic software.</h2>
          <div className="mt-14 grid gap-10 md:grid-cols-3">
            {[
              ["Built just for Dubai.", "It comes pre-loaded with 40,000+ local off-plan units and local news."],
              ["Replaces your other tools.", "You can cancel your PDF builders, news subscriptions, and messy spreadsheets."],
              ["Extremely easy to use.", "You don't need an IT department. If you can use a smartphone, you can use PropFlow."],
            ].map(([t, d]) => (
              <div key={t}>
                <div className="mb-4 h-px w-10 bg-[var(--gold)]" />
                <h3 className="text-[18px] font-semibold">{t}</h3>
                <p className="mt-3 text-[15px] text-[var(--silk)]/70">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Pricing + FAQ */}
      <section id="pricing" className="mx-auto max-w-7xl scroll-mt-24 px-6 py-24">
        <h2 className={`text-center text-3xl font-medium md:text-4xl ${ink}`}>Simple pricing. 50% Launch Discount Applied.</h2>
        <div className="mt-14 grid items-center gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["1-Month", "100", "200"],
            ["3-Month", "250", "500"],
            ["6-Month", "500", "1,000", true],
            ["1-Year", "900", "1,800"],
          ].map(([name, now, was, hot]) => (
            <div key={name as string} className={`relative rounded-xl bg-white p-7 text-center ${hot ? "border-2 border-[var(--gold)] shadow-xl lg:scale-105 lg:py-10" : "border border-[var(--sand)]"}`}>
              {hot ? <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[var(--gold)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-white">Most popular</span> : null}
              <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${gold}`}>{name}</p>
              <p className={`metric mt-4 text-4xl font-medium ${ink}`}>AED {now}</p>
              <p className={`metric mt-1 text-sm line-through ${muted}`}>Was AED {was}</p>
              <a href="/login?mode=signup" className={`mt-6 block rounded-md px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] ${hot ? "bg-[var(--gold)] text-white" : "border border-[var(--sand)]"}`}>Choose plan</a>
            </div>
          ))}
        </div>
        <div className="mx-auto mt-20 max-w-3xl">
          <Accordion items={[
            { q: "Is my data safe?", a: "Yes. Your leads, private listings and uploaded logos are stored privately in your own account — no other broker can see them." },
            { q: "Can I use my own logo?", a: "Yes. Upload your logo in your profile and every PDF dossier carries your branding and contact details." },
            { q: "Can I cancel anytime?", a: "Yes. Plans are prepaid for their period and you can choose not to renew at any time." },
          ]} />
        </div>
      </section>
    </PublicLayout>
  );
}

function Step({ icon, t, body, children }: { icon: ReactNode; t: string; body: string; children: ReactNode }) {
  return (
    <div className={`${card} flex flex-col gap-5`}>
      <div className="rounded-lg bg-[var(--silk)] p-4">{children}</div>
      <div>
        <div className={`flex items-center gap-2 ${gold} [&_svg]:size-4`}>{icon}<h3 className={`text-[17px] font-semibold ${ink}`}>{t}</h3></div>
        <p className={`mt-2 text-[15px] ${muted}`}>{body}</p>
      </div>
    </div>
  );
}

function PipelineMockup() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[var(--sand)] bg-[var(--silk)] shadow-[0_40px_100px_-20px_rgba(42,16,21,0.25)]">
      <div className="flex items-center gap-3 border-b border-[var(--sand)] bg-white px-4 py-3">
        <span className={`text-[11px] font-semibold tracking-[0.25em] ${ink}`}>PROPFLOW</span>
        <div className="flex flex-wrap gap-1">
          {["Dashboard", "Leads", "Inventory", "My Listings", "Market Intel", "News"].map((n, i) => (
            <span key={n} className={`rounded-full px-2 py-1 text-[8px] font-semibold uppercase tracking-[0.12em] ${i === 1 ? "bg-[var(--sand)]" : ""}`}>{n}</span>
          ))}
        </div>
      </div>
      <div className="p-5 pb-20">
        <p className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${ink}`}>Client pipeline</p>
        <div className="mt-3 flex gap-1.5">
          {["All Leads", "Off-Plan", "Ready", "Rental"].map((f, i) => (
            <span key={f} className={`rounded-full border px-2.5 py-1 text-[10px] ${i === 0 ? "border-[var(--gold)] bg-[var(--gold)] text-white" : "border-[var(--sand)] bg-white"}`}>{f}</span>
          ))}
        </div>
        {[["Emin Yilmaz", "AED 3.00M", "Oasis Residences • 406", "99%"], ["Sample lead", "AED 1.80M", "Marina Star • 1204", "90%"]].map(([n, b, u, m], i) => (
          <div key={n} className={`mt-3 flex items-center justify-between gap-3 rounded-xl border border-[var(--sand)] bg-white p-3 ${i ? "opacity-60" : ""}`}>
            <div>
              <p className={`text-[13px] font-semibold ${ink}`}>{n}</p>
              <p className={`metric text-[11px] ${muted}`}>{b}</p>
            </div>
            <div className="text-right">
              <p className="text-[11px] font-medium">{u}</p>
              <div className="mt-1 flex items-center justify-end gap-2">
                <span className="metric rounded-full bg-[var(--gold)]/15 px-2 py-0.5 text-[10px] text-[var(--gold)]">{m} Match</span>
                <span className={`text-[10px] font-semibold ${gold}`}>View Dossier ➔</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full border border-[var(--sand)] bg-white py-1.5 pl-1.5 pr-3 shadow-md">
        <span className="grid size-6 place-items-center rounded-full bg-[var(--gold)] text-[9px] font-bold text-white">NS</span>
        <span className="text-[10px] font-semibold tracking-wider">NIHAL</span>
        <Settings className={`size-3 ${gold}`} />
        <span className={`ml-1 text-[9px] font-semibold ${muted}`}>LOG OUT</span>
      </div>
    </div>
  );
}
