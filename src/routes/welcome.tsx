import { createFileRoute } from "@tanstack/react-router";
import { Check, Sparkles, X } from "lucide-react";

import { Accordion, meta, PublicLayout } from "@/components/public/PublicLayout";
import pipeline from "@/assets/landing/pipeline.jpg.asset.json";
import leads from "@/assets/landing/leads.jpg.asset.json";
import dossier from "@/assets/landing/dossier.jpg.asset.json";
import mapShot from "@/assets/landing/map.jpg.asset.json";
import payment from "@/assets/landing/payment.jpg.asset.json";
import overview from "@/assets/landing/overview.jpg.asset.json";
import news from "@/assets/landing/news.jpg.asset.json";
import inventory from "@/assets/landing/inventory.jpg.asset.json";

export const Route = createFileRoute("/welcome")({
  head: () => meta("PropFlow · The Only AI Software Dubai Brokers Need", "PropFlow talks to your leads, finds the perfect properties from 40,000+ Dubai units, and helps you sell them — all in one place."),
  component: Landing,
});

const DARK = "bg-[var(--obsidian)]";
const muted = "text-[#5c554e]";
const ink = "text-[var(--obsidian)]";
const gold = "text-[#9E845A]";

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

function Shot({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  return <img src={src} alt={alt} loading="lazy" className={`w-full rounded-lg border border-[var(--sand)] object-cover object-top shadow-md ${className}`} />;
}

function Landing() {
  return (
    <PublicLayout>
      {/* 1. Hero */}
      <section className={`${WINE} px-6 pb-24 pt-20 text-[var(--silk)]`}>
        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
          <div>
            <p className={`text-xs font-bold uppercase tracking-[0.18em] ${gold}`}>Your Real Estate AI Co-Pilot</p>
            <h1 className="mb-6 mt-5 text-5xl font-semibold leading-tight md:text-6xl">The only AI software Dubai brokers need to close more deals.</h1>
            <p className="max-w-xl text-[17px] leading-[1.7] text-[var(--silk)]/75">Stop losing clients because you are too busy doing paperwork. PropFlow talks to your leads, finds the perfect properties, and helps you sell them—all in one place.</p>
            <div className="mt-10 flex flex-wrap gap-4">
              <a href="/login?mode=signup" className="rounded-md bg-[#9E845A] px-8 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--silk)] hover:opacity-90">Start your free trial</a>
              <button onClick={() => scrollTo("pricing")} className="rounded-md border border-[var(--silk)]/30 px-8 py-4 text-xs font-semibold uppercase tracking-[0.18em] hover:bg-[var(--silk)]/10">View pricing</button>
            </div>
            <p className="mt-4 text-[13px] text-[var(--silk)]/55">14-day free trial · No card required</p>
          </div>
          <div className="relative">
            <img src={pipeline.url} alt="PropFlow client pipeline dashboard" className="w-full rounded-2xl border border-[var(--silk)]/15 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.6)]" />
            <span className="absolute -top-4 right-6 rounded-full bg-[#9E845A] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--silk)] shadow-lg inline-flex items-center gap-1.5"><Sparkles className="size-3" />99% Match</span>
            <span className="absolute -bottom-4 left-8 rounded-full bg-[#9E845A] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--silk)] shadow-lg inline-flex items-center gap-1.5"><Sparkles className="size-3" />Top 4 Units Found</span>
          </div>
        </div>
      </section>

      {/* 2. How it works */}
      <section className="bg-[var(--silk)] px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <h2 className={`mx-auto max-w-3xl text-center text-3xl font-medium leading-snug md:text-4xl ${ink}`}>From a new lead to a closed deal in 3 simple steps.</h2>
          <div className="mt-20 grid gap-8 md:grid-cols-3">
            {[
              [leads.url, "1. The AI Talks to Your Leads", "We put our smart AI on your WhatsApp, Telegram, Instagram, and website. When a client messages you, the AI replies, finds out their exact budget (Off-Plan, Ready, or Rental), and instantly schedules a call for you."],
              [dossier.url, "2. Instant Dual-Inventory Matching", "No more manual searching. The AI instantly scans over 40,000 live developer units AND your own private property listings to find the 4 absolute best homes for your client in one second."],
              [payment.url, "3. 1-Click Brochures & Pitches", "Click one button to create a stunning PDF brochure with your own company logo. Or, click \"Copy Pitch\" to send a perfect, AI-written sales message straight to their WhatsApp."],
            ].map(([src, t, d]) => (
              <div key={t} className="rounded-xl border border-[var(--sand)] bg-white p-6 pt-0">
                <div className="-mt-12 mb-6"><Shot src={src ?? ""} alt={t ?? ""} className="h-48" /></div>
                <h3 className={`text-[18px] font-semibold ${ink}`}>{t}</h3>
                <p className={`mt-2 text-[15px] ${muted}`}>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Problems vs solutions */}
      <section className={`${WINE} px-6 py-24 text-[var(--silk)]`}>
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center text-3xl font-medium md:text-4xl">Stop working the hard way.</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <ul className="space-y-6 rounded-xl border border-[var(--silk)]/10 p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--silk)]/50">The old way</p>
              {["Wasting hours switching between WhatsApp, Excel, and developer websites.", "Taking too long to calculate payment plans and make PDFs yourself.", "Missing out on new property launches because you didn't check the news."].map((x) => (
                <li key={x} className="flex gap-3 text-[16px] text-[var(--silk)]/55"><X className="mt-1 size-4 shrink-0" />{x}</li>
              ))}
            </ul>
            <ul className="space-y-6 rounded-xl border border-[#9E845A]/40 bg-[var(--silk)]/5 p-8">
              <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${gold}`}>The PropFlow way</p>
              {["Keep all your clients, private properties, and conversations in one clean screen.", "Let the AI instantly calculate payments and make your branded brochures.", "Get live market news the second you open your dashboard."].map((x) => (
                <li key={x} className="flex gap-3 text-[16px]"><Check className={`mt-1 size-4 shrink-0 ${gold}`} />{x}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 4. Feature grid */}
      <section className="bg-[var(--silk)] px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <h2 className={`text-center text-3xl font-medium md:text-4xl ${ink}`}>The complete AI toolkit.</h2>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              [inventory.url, "Upload Your Own Properties & Logo", "Upload your own ready-to-move and rental properties so the AI can use them. Add your company logo so every PDF document looks like it came directly from your brand."],
              [overview.url, "Your AI Co-Pilot on Sales Calls", "While you are on the phone with a client, type a question to your AI assistant. It will instantly calculate ROI or suggest alternative locations so you always have the right answer."],
              [mapShot.url, "Interactive Maps & Dossiers", "Open a property to see a beautiful 3x3 photo gallery. Click \"View Location\" to open live Google Maps, or check floor plans and payment schedules instantly."],
              [news.url, "Live Market Intelligence", "Every time you open PropFlow, it fetches live updates, DLD data, and new property launches directly from the web, ensuring you are always the smartest broker in the room."],
              [leads.url, "Automated Lead Categorization", "Never lose track of a prospect. The AI automatically sorts every incoming lead into clean categories so you know exactly who is buying, renting, or looking for a Golden Visa."],
              [dossier.url, "Instant Multilingual Support", "Dubai is a global market. Your AI assistant can converse with leads in multiple languages, capturing their exact requirements before seamlessly translating the brief for your dashboard."],
            ].map(([src, t, d]) => (
              <div key={t} className="overflow-hidden rounded-xl border border-[var(--sand)] bg-white">
                <img src={src} alt={t} loading="lazy" className="h-44 w-full border-b border-[var(--sand)] object-cover object-top" />
                <div className="p-6">
                  <h3 className={`text-[17px] font-semibold ${ink}`}>{t}</h3>
                  <p className={`mt-2 text-[15px] ${muted}`}>{d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Why PropFlow */}
      <section className={`${WINE} px-6 py-24 text-[var(--silk)]`}>
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-medium md:text-4xl">Why Dubai brokers love PropFlow.</h2>
          <div className="mt-14 grid gap-10 md:grid-cols-3">
            {[
              ["Built for Dubai", "Already loaded with local off-plan data and DLD structures."],
              ["Replaces everything else", "Cancel your other expensive PDF tools, news subscriptions, and messy spreadsheets."],
              ["Super easy to use", "If you can use a smartphone, you can use PropFlow. No tech skills needed."],
            ].map(([t, d]) => (
              <div key={t}>
                <div className="mb-4 h-px w-10 bg-[#9E845A]" />
                <h3 className="text-[18px] font-semibold">{t}</h3>
                <p className="mt-3 text-[15px] text-[var(--silk)]/70">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Testimonials */}
      <section className="bg-[var(--silk)] py-24">
        <h2 className={`px-6 text-center text-3xl font-medium md:text-4xl ${ink}`}>Loved by brokers across Dubai.</h2>
        <div className="mx-auto mt-14 flex max-w-7xl snap-x gap-6 overflow-x-auto px-6 pb-4">
          {[
            ["The dual-inventory matching is unreal. It pulls my own listings and developer units together and gives me the top 4 in a second.", "Sarah K.", "Senior Broker · Dubai Marina"],
            ["I used to spend an hour on every PDF. Now my branded brochure is ready before I hang up the phone.", "Omar A.", "Off-Plan Specialist · Downtown"],
            ["Matching plus 1-click PDFs saves me hours every week. PropFlow is the only tab open during my client calls.", "Priya R.", "Private Client Advisor · Palm Jumeirah"],
            ["My clients get payment schedules and floor plans instantly. It makes me look like a much bigger agency.", "Daniel M.", "Broker · Business Bay"],
          ].map(([q, n, r]) => (
            <figure key={n} className="flex w-[340px] shrink-0 snap-start flex-col rounded-xl border border-[var(--sand)] bg-white p-7">
              <div className={gold}>★★★★★</div>
              <blockquote className={`mt-4 flex-1 text-[15px] leading-[1.7] ${ink}`}>"{q}"</blockquote>
              <figcaption className="mt-6 border-t border-[var(--sand)] pt-4">
                <p className={`text-[14px] font-semibold ${ink}`}>{n}</p>
                <p className={`text-[12px] ${muted}`}>{r}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Pricing + FAQ */}
      <section id="pricing" className="mx-auto max-w-7xl scroll-mt-24 px-6 py-24">
        <h2 className={`text-center text-3xl font-medium md:text-4xl ${ink}`}>Simple pricing. 50% Launch Discount.</h2>
        <p className={`mt-3 text-center text-[15px] ${muted}`}>Every plan starts with a 14-day free trial — no card required.</p>
        <div className="mt-14 grid items-center gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {([
            ["1-Month", "100", "200", false],
            ["3-Month", "250", "500", false],
            ["6-Month", "500", "1,000", true],
            ["1-Year", "900", "1,800", false],
          ] as const).map(([name, now, was, hot]) => (
            <div key={name} className={`relative rounded-xl bg-white p-7 text-center ${hot ? "border-2 border-[#9E845A] shadow-xl lg:scale-110 lg:py-12" : "border border-[var(--sand)]"}`}>
              {hot ? <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#9E845A] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-white">Most popular</span> : null}
              <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${gold}`}>{name}</p>
              <p className={`metric mt-4 text-4xl font-medium ${ink}`}>AED {now}</p>
              <p className={`metric mt-1 text-sm line-through ${muted}`}>Was AED {was}</p>
              <a href="/login?mode=signup" className={`mt-6 block rounded-md px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] ${hot ? "bg-[#9E845A] text-white" : "border border-[var(--sand)]"}`}>Choose plan</a>
            </div>
          ))}
        </div>
        <div className="mx-auto mt-24 max-w-3xl">
          <Accordion items={[
            { q: "Is my private inventory data safe?", a: "Yes. Your leads, private listings and uploaded logos are stored privately in your own account — no other broker can see them." },
            { q: "Can I use my own logo on the PDFs?", a: "Yes. Upload your logo in your profile and every PDF carries your branding and contact details." },
            { q: "Can I cancel anytime?", a: "Yes. Plans are prepaid for their period and you can choose not to renew at any time." },
          ]} />
        </div>
      </section>
    </PublicLayout>
  );
}
