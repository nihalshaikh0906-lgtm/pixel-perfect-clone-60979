import { createFileRoute } from "@tanstack/react-router";
import { Newspaper } from "lucide-react";

import { TopBar } from "@/components/TopBar";

export const Route = createFileRoute("/_authenticated/news")({
  head: () => ({
    meta: [
      { title: "Morning Briefing · PropFlow" },
      { name: "description", content: "AI-curated daily Dubai real estate updates for brokers, refreshed every morning at 8:00 AM." },
      { property: "og:title", content: "Morning Briefing · PropFlow" },
      { property: "og:description", content: "AI-curated daily Dubai real estate updates for brokers." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NewsPage,
});

export type NewsItem = { id: string; headline: string; summary: string; image_url: string | null };

function NewsPage() {
  // Filled by the daily 8:00 AM backend job once connected. No made-up stories are shown.
  const items: NewsItem[] = [];
  return (
    <div className="min-h-screen">
      <TopBar />
      <main className="mx-auto max-w-[1400px] px-6 py-10">
        <h1 className="text-3xl uppercase text-foreground">Morning Briefing</h1>
        <p className="mt-1 text-sm uppercase tracking-wider text-muted-foreground">AI-Curated Dubai Real Estate Updates</p>

        {items.length === 0 ? (
          <div className="mt-8 flex flex-col items-center gap-3 rounded-xl border border-dashed border-border bg-card px-6 py-16 text-center">
            <Newspaper className="text-primary" />
            <p className="font-medium text-foreground">Today's briefing isn't in yet.</p>
            <p className="max-w-md text-sm text-muted-foreground">New stories appear here every morning at 8:00 AM Dubai time.</p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((n) => (
              <article key={n.id} className="overflow-hidden rounded-xl border border-border bg-card transition-shadow duration-300 hover:shadow-lg">
                {n.image_url ? <img src={n.image_url} alt="" className="aspect-video w-full object-cover" /> : <div className="aspect-video w-full bg-secondary" />}
                <div className="flex flex-col gap-3 p-5">
                  <h2 className="text-xl font-medium leading-snug text-foreground">{n.headline}</h2>
                  <p className="text-[14px] leading-relaxed text-muted-foreground">{n.summary}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
