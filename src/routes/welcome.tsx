import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, FileText, Newspaper, Sparkles, X, Zap } from "lucide-react";
import type { ReactNode } from "react";

import { Eyebrow, meta, PublicLayout } from "@/components/public/PublicLayout";

export const Route = createFileRoute("/welcome")({
  head: () => meta("PropFlow · The AI Platform for Dubai Real Estate Professionals", "Capture prospects, match properties from 40,000+ Dubai units, and close deals with white-label dossiers — one premium workspace."),
  component: Landing,
});

const muted = "text-[#5c554e]";
const card = "rounded-2xl border border-[var(--sand)] bg-white p-6";
const shadow = { boxShadow: "0 40px 100px -20px rgba(158,123,79,0.22)" };
const cta = "inline-block rounded-full bg-[var(--bronze)] px-8 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--silk)] transition-opacity hover:opacity-90";

function Landing() {
  return (
    <PublicLayout>
      {/* 1. Hero */}
      <section className="px-6 pb-24 pt-20" style={{ background: "radial-gradient(55% 60% at 80% 10%, #EDE3D4 0%, transparent 70%)" }}>
        <div className="mx-auto grid max-w-7xl items-center gap-14 md:grid-cols-12">
          <div className="md:col-span-6">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--bronze)]">All-in-one real estate intelligence</p>
            <h1 className="mb-6 mt-5 text-5xl font-medium leading-tight md:text-7xl">The only AI platform Dubai real estate professionals need.</h1>
            <p className={`max-w-xl text-[17px] leading-[1.7] ${muted}`}>Stop losing leads to slow follow-ups and manual research. PropFlow gives you everything to capture prospects, match properties, and close deals in one premium workspace.</p>
            <Link to="/pricing" className={`${cta} mt-10`}>View access plans</Link>
          </div>
          <div className="relative md:col-span-6">
            <div className="rounded-3xl border border-white/70 bg-white/60 p-6 backdrop-blur-xl" style={shadow}>
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--bronze)]">Active pipeline</p>
                <span className={`flex items-center gap-1.5 text-[11px] ${muted}`}><span className="size-1.5 animate-pulse rounded-full bg-[var(--bronze)]" /> AI market scanner</span>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3">
                {[["Open budgets", "AED 39M"], ["Hot leads", "4"], ["Units", "41,166"]].map(([l, v]) => (
                  <div key={l} className="rounded-xl bg-[var(--silk)] p-3">
                    <p className={`text-[10px] uppercase tracking-wider ${muted}`}>{l}</p>
                    <p className="metric mt-1 text-lg font-medium">{v}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 space-y-2">
                {[["Sample client · 2BR", "Dubai Hills", "94%"], ["Sample client · Villa", "Palm Jumeirah", "91%"], ["Sample client · 1BR", "JVC", "88%"]].map(([c, a, m]) => (
                  <div key={c} className="flex items-center justify-between rounded-xl border border-[var(--sand)] bg-white px-4 py-3 text-[13px]">
                    <span className="font-medium">{c}</span>
                    <span className={muted}>{a}</span>
                    <span className="metric rounded-full bg-[var(--bronze)]/15 px-2 py-0.5 text-[11px] text-[var(--bronze)]">{m}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute -left-4 -top-5 flex items-center gap-1.5 rounded-full border border-[var(--sand)] bg-white px-4 py-2 text-[12px] font-medium shadow-lg">
              <Sparkles className="size-3.5 text-[var(--bronze)]" /> AI matched • <span className="metric">98%</span>
            </div>
            <div className="absolute -bottom-5 -right-3 flex items-center gap-1.5 rounded-full bg-emerald-700 px-4 py-2 text-[12px] font-medium text-white shadow-lg">
              <Check className="size-3.5" /> Deal closed • <span className="metric">AED 4.2M</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Growth engine */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <h2 className="mx-auto max-w-3xl text-center text-3xl font-medium leading-snug md:text-4xl">From first inquiry to closing day, PropFlow creates a scalable process.</h2>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          <Engine icon={<Newspaper />} t="Curate intelligence" body="Receive a daily digest of Dubai property news from major outlets. Act on infrastructure shifts and new launches before the market wakes up.">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--bronze)]">Morning briefing</p>
            <p className="mt-2 text-[14px] font-medium">Off-plan launches lead weekly activity</p>
            <p className={`mt-1 text-[12px] ${muted}`}>Sample story · Read source →</p>
          </Engine>
          <Engine icon={<Zap />} t="Automate matching" body="Keep buyers engaged. PropFlow scores your leads and matches them instantly to the best units across 40,000+ listings.">
            <div className="flex items-center justify-between text-[13px]"><span className="font-medium">Sample lead · AED 2.5M</span><span className="metric text-[var(--bronze)]">94%</span></div>
            <p className={`mt-2 text-[12px] ${muted}`}>→ 2BR · Dubai Hills · Q2 2027</p>
          </Engine>
          <Engine icon={<FileText />} t="Close with authority" body="Generate bespoke, white-labeled client presentations and payment milestones in one click.">
            <div className="flex justify-between border-b border-[var(--sand)] pb-2 text-[11px] font-semibold tracking-[0.2em]"><span>YOUR AGENCY</span><span className={muted}>DOSSIER</span></div>
            {[["On booking", "10%"], ["Construction", "30%"], ["Handover", "60%"]].map(([a, b]) => <div key={a} className="flex justify-between py-1 text-[11px]"><span>{a}</span><span className="metric">{b}</span></div>)}
          </Engine>
        </div>
      </section>

      {/* 3. Problem vs solution */}
      <section className="bg-[var(--obsidian)] px-6 py-24 text-[var(--silk)]">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-medium md:text-4xl">Stop losing opportunities every day.</h2>
          <div className="mt-14 grid gap-10 md:grid-cols-2">
            <ul className="space-y-6">
              {["Information lives across multiple tabs, WhatsApp chats, and spreadsheets.", "Manual property research and PDF creation eat into closing time.", "Missing out on market shifts because of delayed news."].map((x) => (
                <li key={x} className="flex gap-3 text-[16px] text-[var(--silk)]/55"><X className="mt-1 size-4 shrink-0" />{x}</li>
              ))}
            </ul>
            <ul className="space-y-6">
              {["Keep contacts, AI conversations, and matched properties organized in one platform.", "Automate repetitive tasks like dossier generation and payment plan calculations.", "Catch market movements early with a daily news briefing."].map((x) => (
                <li key={x} className="flex gap-3 text-[16px]"><Check className="mt-1 size-4 shrink-0 text-[var(--champagne)]" />{x}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 4. Feature grid */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="text-center"><Eyebrow>Everything in one workspace</Eyebrow></div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ["Daily Market Intelligence", "Real Dubai property news, summarized into an actionable daily briefing."],
            ["AI-Powered Client Matching", "Track buyer criteria and let the AI surface the best-fit units in seconds."],
            ["Custom Private Inventory", "Keep your own secondary and rental listings, visible only to you."],
            ["Interactive Satellite Maps", "View the plot, surroundings and road access instantly during client calls."],
            ["White-Label PDF Builder", "Branded property dossiers carrying your agency logo and contact details."],
            ["Payment Plan Modeler", "Adjust the down payment and see every milestone in AED, ready for WhatsApp."],
          ].map(([t, d]) => (
            <div key={t} className="rounded-2xl border border-[var(--sand)] bg-[var(--silk)] p-7 transition-all hover:shadow-md">
              <h3 className="text-[17px] font-semibold">{t}</h3>
              <p className={`mt-2 text-[15px] ${muted}`}>{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Why PropFlow */}
      <section className="border-y border-[var(--sand)] bg-white px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="mx-auto max-w-3xl text-center text-3xl font-medium leading-snug md:text-4xl">Why Dubai's top brokers choose PropFlow over generic CRMs</h2>
          <div className="mt-14 grid gap-10 md:grid-cols-3">
            {[
              ["Built for Dubai real estate, not just contact storage.", "Pre-loaded with 40,000+ local off-plan units and a daily Dubai news briefing."],
              ["One platform replaces your fragmented tech stack.", "Drop the separate news subscriptions, PDF builders and map tools."],
              ["Designed for closers, not IT departments.", "No setup required. The AI co-pilot works out of the box."],
            ].map(([t, d]) => (
              <div key={t}>
                <div className="mb-4 h-px w-10 bg-[var(--bronze)]" />
                <h3 className="text-[18px] font-semibold leading-snug">{t}</h3>
                <p className={`mt-3 text-[15px] ${muted}`}>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Final CTA */}
      <section className="px-6 py-28 text-center">
        <h2 className="mx-auto max-w-3xl text-3xl font-medium md:text-5xl">Ready to transform your real estate workflow?</h2>
        <Link to="/pricing" className={`${cta} mt-10`}>Start your journey today</Link>
      </section>
    </PublicLayout>
  );
}

function Engine({ icon, t, body, children }: { icon: ReactNode; t: string; body: string; children: ReactNode }) {
  return (
    <div className={`${card} flex flex-col gap-5`}>
      <div className="rounded-xl bg-[var(--silk)] p-4">{children}</div>
      <div>
        <div className="flex items-center gap-2 text-[var(--bronze)] [&_svg]:size-4">{icon}<h3 className="text-[17px] font-semibold text-[var(--obsidian)]">{t}</h3></div>
        <p className={`mt-2 text-[15px] ${muted}`}>{body}</p>
      </div>
    </div>
  );
}
