import { createFileRoute, Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { Eyebrow, meta, PublicLayout } from "@/components/public/PublicLayout";

export const Route = createFileRoute("/welcome")({
  head: () => meta("PropFlow · The Intelligence Co-Pilot for Dubai Real Estate Consultants", "Every lead matched, every launch analyzed — market digests, inventory matching, satellite checks and white-label dossiers in one workspace."),
  component: Landing,
});

const card = "rounded-2xl border border-[var(--obsidian)]/10 bg-white/80 p-6";
const shadow = { boxShadow: "0 40px 100px -20px rgba(158,123,79,0.2)" };

function Landing() {
  return (
    <PublicLayout>
      <section className="px-6 pb-24 pt-24 text-center" style={{ background: "radial-gradient(60% 50% at 50% 0%, #E8DCCB 0%, transparent 70%)" }}>
        <div className="mb-4"><Eyebrow>The intelligence co-pilot for Dubai real estate consultants</Eyebrow></div>
        <h1 className="mx-auto mb-6 max-w-4xl text-5xl font-medium leading-tight md:text-7xl">Every Lead Matched. Every Launch Analyzed. One Effortless Workspace.</h1>
        <p className="mx-auto max-w-2xl text-[16px] text-[#5c554e]">PropFlow equips property consultants with an integrated daily workflow: from 8:00 AM curated market digests to sub-second inventory matching, live satellite proximity checks, and instant white-labeled client dossiers.</p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link to="/pricing" className="rounded-full bg-[var(--bronze)] px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--silk)]">Explore pricing & tiers</Link>
          <a href="#how" className="rounded-full border border-[var(--obsidian)]/20 px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] hover:bg-[var(--obsidian)]/5">How it works ↓</a>
        </div>
      </section>

      <section id="how" className="mx-auto max-w-6xl scroll-mt-24 space-y-24 px-6 pb-28">
        <Step n="01" t="Morning Market Digest" sub="8:00 AM Edge" body="Start the morning with pre-filtered intelligence and advise clients with authority before competitors even open their feeds." preview={
          <div className={card} style={shadow}>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--bronze)]">Morning briefing · 08:00</p>
            <p className="mt-3 text-lg font-medium">Off-plan launches lead weekly transactions</p>
            <p className="mt-3 rounded-lg bg-[var(--silk)] p-3 text-[13px] text-[#5c554e]">Key catalyst: Blue Metro Line progress lifts interest in connected communities.</p>
            <p className="mt-4 text-[11px] text-[#5c554e]">Source: Dubai Land Department</p>
          </div>} />
        <Step flip n="02" sub="Inventory & Maps" t="Comprehensive Inventory & Hybrid Satellite Verification" body="Toggle between 40,000+ developer units and your private secondary and rental stock. Open satellite maps live during client calls to inspect surroundings and road connectivity." preview={
          <div className={`${card} grid gap-4 sm:grid-cols-2`} style={shadow}>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--bronze)]">Sample unit</p>
              <p className="mt-2 font-medium">Creek-side residence</p>
              <p className="metric mt-2 text-[13px] text-[#5c554e]">3 Beds • 2,150 Sq.Ft</p>
              <p className="metric mt-1 text-xl font-medium">AED 1.85M</p>
            </div>
            <div className="relative aspect-square overflow-hidden rounded-xl" style={{ background: "repeating-linear-gradient(35deg,#5b6b52 0 14px,#6f7d63 14px 22px,#8a8f7a 22px 26px)" }}>
              <div className="absolute inset-[18%] rounded-full border-2 border-dashed border-[var(--silk)]/80" />
              <div className="absolute left-1/2 top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[var(--silk)] bg-[var(--bronze)]" />
              <span className="absolute bottom-2 right-2 rounded bg-[var(--obsidian)]/60 px-1.5 text-[10px] text-[var(--silk)]">10 km</span>
            </div>
          </div>} />
        <Step n="03" sub="Matching & Pitch" t="Rapid Lead Matching & 5-Point Tailored Pitch" body="Eliminate manual spreadsheets. Match budgets and criteria instantly, then generate tailored investor pitches in seconds." preview={
          <div className={card} style={shadow}>
            <div className="flex items-center justify-between border-b border-[var(--obsidian)]/10 pb-3">
              <span className="font-medium">Sample client · 2BR, AED 2.5M</span>
              <span className="metric rounded-full bg-[var(--bronze)]/15 px-2 py-0.5 text-[11px] text-[var(--bronze)]">94% match</span>
            </div>
            <ol className="mt-3 space-y-1.5 text-[13px]">
              {["Client fit", "Schools & family", "Metro & roads", "Infrastructure", "Yield catalyst"].map((x, i) => (
                <li key={x} className="flex gap-2"><span className="metric font-semibold text-[var(--bronze)]">{i + 1}.</span>{x}</li>
              ))}
            </ol>
          </div>} />
        <Step flip n="04" sub="Client Dossier" t="White-Label Client Dossier Generation" body="Export presentation-grade PDFs with your own agency logo, contact details and payment milestone schedules — without mentioning PropFlow." preview={
          <div className="mx-auto aspect-[1/1.414] w-full max-w-xs rounded-md border border-[var(--obsidian)]/10 bg-[var(--silk)] p-6" style={shadow}>
            <div className="flex items-center justify-between border-b border-[var(--obsidian)]/15 pb-3">
              <span className="text-[11px] font-semibold tracking-[0.2em]">YOUR AGENCY</span>
              <span className="text-[9px] text-[#5c554e]">PROPERTY DOSSIER</span>
            </div>
            <div className="mt-4 space-y-2">{[90, 70, 80, 55, 75].map((w) => <div key={w} className="h-1.5 rounded bg-[var(--obsidian)]/10" style={{ width: `${w}%` }} />)}</div>
            <div className="mt-5 space-y-1 text-[9px]">
              {[["On booking", "10%"], ["During construction", "30%"], ["On handover", "60%"]].map(([a, b]) => (
                <div key={a} className="flex justify-between border-b border-[var(--obsidian)]/5 py-1"><span>{a}</span><span className="metric">{b}</span></div>
              ))}
            </div>
            <p className="mt-6 text-[9px] text-[#5c554e]">Prepared by · Your name · +971 ···</p>
          </div>} />
      </section>
    </PublicLayout>
  );
}

function Step({ n, t, sub, body, preview, flip }: { n: string; t: string; sub?: string; body: string; preview: ReactNode; flip?: boolean }) {
  return (
    <div className="grid items-center gap-10 md:grid-cols-2">
      <div className={flip ? "md:order-2" : ""}>{preview}</div>
      <div>
        <p className="metric text-sm font-semibold tracking-[0.18em] text-[var(--bronze)]">{n} / {sub ?? "Step"}</p>
        <h2 className="mt-3 text-2xl font-medium md:text-3xl">{t}</h2>
        <p className="mt-4 text-[16px] text-[#5c554e]">{body}</p>
      </div>
    </div>
  );
}
