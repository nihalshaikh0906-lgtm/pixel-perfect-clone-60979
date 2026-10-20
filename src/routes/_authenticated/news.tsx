import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ExternalLink, Loader2, Newspaper, RefreshCw } from "lucide-react";
import { useState } from "react";

import { TopBar } from "@/components/TopBar";
import { getNews } from "@/lib/research.functions";

export const Route = createFileRoute("/_authenticated/news")({
  head: () => ({
    meta: [
      { title: "Morning Briefing · DealOS" },
      { name: "description", content: "Daily Dubai real estate news for brokers, from real sources." },
      { property: "og:title", content: "Morning Briefing · DealOS" },
      { property: "og:description", content: "Daily real estate news for brokers." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NewsPage,
});

function NewsPage() {
  const fetchNews = useServerFn(getNews);
  const qc = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);
  const { data, isLoading, error } = useQuery({
    queryKey: ["news"],
    staleTime: 30 * 60_000,
    queryFn: () => fetchNews({ data: { refresh: false } }),
  });
  const refresh = async () => {
    setRefreshing(true);
    try {
      qc.setQueryData(["news"], await fetchNews({ data: { refresh: true } }));
    } finally {
      setRefreshing(false);
    }
  };
  const items = data?.items ?? [];

  return (
    <div className="min-h-screen">
      <TopBar />
      <main className="mx-auto max-w-[1400px] px-6 py-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl uppercase text-foreground">Morning Briefing</h1>
            <p className="mt-1 text-sm uppercase tracking-wider text-muted-foreground">Daily Real Estate News</p>
          </div>
          <button onClick={refresh} disabled={refreshing || isLoading} className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs uppercase tracking-wider hover:bg-secondary disabled:opacity-50">
            <RefreshCw className={`size-3.5 ${refreshing ? "animate-spin" : ""}`} /> Refresh
          </button>
        </div>

        {error ? <p className="mt-6 rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">{(error as Error).message}</p> : null}
        {isLoading ? <p className="mt-8 flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="size-4 animate-spin" /> Gathering today's stories…</p> : null}

        {!isLoading && !error && items.length === 0 ? (
          <div className="mt-8 flex flex-col items-center gap-3 rounded-xl border border-dashed border-border bg-card px-6 py-16 text-center">
            <Newspaper className="text-primary" />
            <p className="font-medium text-foreground">No new stories found right now.</p>
          </div>
        ) : null}

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((n) => (
            <a key={n.id} href={n.url} target="_blank" rel="noreferrer" className="group overflow-hidden rounded-xl border border-border bg-card transition-shadow duration-300 hover:shadow-lg">
              {n.image_url ? <img src={n.image_url} alt="" className="aspect-video w-full object-cover" loading="lazy" /> : null}
              <div className="flex flex-col gap-3 p-5">
                <p className="eyebrow">{n.source}{n.date ? ` · ${n.date}` : ""}</p>
                <h2 className="text-xl font-medium leading-snug text-foreground">{n.headline}</h2>
                <p className="text-[14px] leading-relaxed text-muted-foreground">{n.summary}</p>
                <span className="flex items-center gap-1 text-xs uppercase tracking-wider text-primary">Read source <ExternalLink className="size-3" /></span>
              </div>
            </a>
          ))}
        </div>
      </main>
    </div>
  );
}
