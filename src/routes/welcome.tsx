import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import creek from "@/assets/landing-creek.jpg";
import downtown from "@/assets/landing-downtown.jpg";
import palm from "@/assets/landing-palm.jpg";

export const Route = createFileRoute("/welcome")({
  head: () => ({
    meta: [
      { title: "PropFlow · Private Intelligence for Dubai Advisors" },
      { name: "description", content: "The private intelligence & concierge platform for elite Dubai real estate advisors." },
      { property: "og:title", content: "PropFlow · Private Intelligence for Dubai Advisors" },
      { property: "og:description", content: "The private intelligence & concierge platform for elite Dubai real estate advisors." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const SLIDES = [
  { src: downtown, label: "Downtown Dubai" },
  { src: palm, label: "The Palm" },
  { src: creek, label: "Dubai Creek Harbour" },
];

const PLANS = [
  { name: "1-Month Private Access", was: 200, now: 100 },
  { name: "3-Month Quarter Pass", was: 500, now: 250 },
  { name: "6-Month Professional Tier", was: 1000, now: 500 },
  { name: "1-Year Elite Broker License", was: 1800, now: 900 },
];

const aed = (n: number) => `AED ${n.toLocaleString("en-US")}`;

function Landing() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % SLIDES.length), 6000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="bg-[var(--obsidian)] text-[var(--silk)]">
      <section className="relative min-h-screen overflow-hidden">
        {SLIDES.map((s, idx) => (
          <img
            key={s.label}
            src={s.src}
            alt={s.label}
            width={1920}
            height={1088}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[2000ms] ${idx === i ? "opacity-100 scale-105" : "opacity-0 scale-100"}`}
            style={{ transition: "opacity 2s ease, transform 8s ease" }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--obsidian)]/80 via-[var(--obsidian)]/55 to-[var(--obsidian)]/80" />

        <header className="relative z-10 flex items-center justify-between px-6 py-6 md:px-12">
          <span className="text-lg font-semibold tracking-[0.3em]">PROPFLOW</span>
          <nav className="flex gap-2">
            <a href="#plans" className="rounded-full border border-[var(--silk)]/30 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] hover:bg-[var(--silk)]/10">View plans</a>
            <Link to="/login" search={{ mode: undefined }} className="rounded-full bg-[var(--champagne)] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--obsidian)] hover:opacity-90">Login / Sign up</Link>
          </nav>
        </header>

        <div className="relative z-10 flex min-h-[calc(100vh-96px)] flex-col items-center justify-center px-6 text-center">
          <h1 className="text-5xl font-light tracking-[0.3em] md:text-7xl">PROPFLOW</h1>
          <p className="mt-6 max-w-2xl text-lg font-light text-[var(--sand)]">
            The Private Intelligence &amp; Concierge Platform for Elite Dubai Real Estate Advisors
          </p>
          <div className="mt-10 flex gap-3">
            <a href="#plans" className="rounded-full bg-[var(--champagne)] px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--obsidian)]">See launch pricing</a>
          </div>
          <p className="absolute bottom-8 text-[11px] uppercase tracking-[0.3em] text-[var(--sand)]/80">{SLIDES[i]!.label}</p>
        </div>
      </section>

      <section id="plans" className="relative px-6 py-24 md:px-12">
        <div className="mx-auto max-w-6xl text-center">
          <p className="inline-block rounded-full border border-[var(--champagne)]/50 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--champagne)]">
            50% launch discount on every plan
          </p>
          <h2 className="mt-5 text-3xl font-light tracking-[0.1em] md:text-4xl">Private access plans</h2>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PLANS.map((p) => (
              <div key={p.name} className="flex flex-col rounded-2xl border border-[var(--silk)]/20 bg-[var(--silk)]/5 p-6 backdrop-blur-md">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--sand)]">{p.name}</p>
                <p className="metric mt-6 text-sm text-[var(--sand)]/70 line-through">{aed(p.was)}</p>
                <p className="metric mt-1 text-4xl font-medium tracking-tight">{aed(p.now)}</p>
                <p className="mt-2 text-xs text-[var(--champagne)]">50% launch discount</p>
                <Link to="/login" search={{ mode: "signup" }} className="mt-8 rounded-full bg-[var(--champagne)] px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--obsidian)] hover:opacity-90">
                  Choose plan
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
