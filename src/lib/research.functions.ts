import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type NewsItem = { id: string; headline: string; summary: string; source: string; url: string; image_url: string | null; date: string | null };

let newsCache: { day: string; items: NewsItem[] } | null = null;

const dubaiDay = () => new Date(Date.now() + 4 * 3600_000).toISOString().slice(0, 10);

/** Real stories via Firecrawl web search, summarized by DeepSeek. Cached per Dubai day. */
export const getNews = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ refresh: z.boolean().default(false) }).parse(d ?? {}))
  .handler(async ({ data }) => {
    const day = dubaiDay();
    if (!data.refresh && newsCache?.day === day && newsCache.items.length) return newsCache;

    const lovable = process.env["LOVABLE_API_KEY"];
    const fc = process.env["FIRECRAWL_API_KEY"];
    if (!lovable || !fc) throw new Error("News search is not configured.");
    const res = await fetch("https://connector-gateway.lovable.dev/firecrawl/v2/search", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${lovable}`, "X-Connection-Api-Key": fc },
      body: JSON.stringify({ query: "Dubai real estate property market news", limit: 10, tbs: "qdr:w", sources: ["news", "web"] }),
    });
    const body = await res.text();
    if (!res.ok) throw new Error(`News search failed [${res.status}]: ${body.slice(0, 300)}`);
    const j = JSON.parse(body);
    type Found = { title?: string; url?: string; snippet?: string; description?: string; date?: string; imageUrl?: string };
    const buckets = [j?.data?.news, j?.data?.web, Array.isArray(j?.data) ? j.data : []].filter((b): b is Found[] => Array.isArray(b));
    const seen = new Set<string>();
    const raw: Found[] = [];
    for (const b of buckets) for (const r of b) if (r?.url && !seen.has(r.url)) { seen.add(r.url); raw.push(r); }
    const clean = (t = "") =>
      t.replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/[#*_>`]+/g, " ").replace(/\s+/g, " ").trim().slice(0, 700);
    const found = raw.filter((r) => r.url && r.title).slice(0, 9);
    if (!found.length) return { day, items: [] as NewsItem[] };

    const { aiWrite } = await import("./deal-os.server");
    const list = found.map((r, i) => `${i + 1}. ${r.title}\n${clean(r.snippet ?? r.description)}`).join("\n\n");
    const out = await aiWrite(
      "You write a morning briefing for Dubai real estate brokers. For each numbered story, write one clear headline and a 2-sentence summary with why it matters to a broker. Use ONLY facts in the story text; never add numbers that are not there. Reply with JSON only: {\"items\":[{\"n\":1,\"headline\":\"...\",\"summary\":\"...\"}]}",
      list,
      1500,
    );
    let parsed: { n: number; headline: string; summary: string }[] = [];
    try {
      parsed = JSON.parse(out.replace(/^```(json)?|```$/gm, "").trim()).items ?? [];
    } catch {
      parsed = [];
    }
    const items: NewsItem[] = found.map((r, i) => {
      const p = parsed.find((x) => x.n === i + 1);
      return {
        id: r.url!,
        headline: p?.headline || r.title!,
        summary: p?.summary || clean(r.snippet ?? r.description).slice(0, 240),
        source: new URL(r.url!).hostname.replace(/^www\./, ""),
        url: r.url!,
        image_url: r.imageUrl ?? null,
        date: r.date ?? null,
      };
    });
    newsCache = { day, items };
    return newsCache;
  });

/** DeepSeek market report written only from the broker's inventory figures. */
export const marketReport = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z.object({ rows: z.array(z.object({ district: z.string(), units: z.number(), avgPrice: z.number(), avgPsf: z.number() })).max(40) }).parse(d),
  )
  .handler(async ({ data }) => {
    const { aiWrite } = await import("./deal-os.server");
    const table = data.rows
      .map((r) => `${r.district}: ${r.units} units, avg AED ${Math.round(r.avgPrice).toLocaleString("en-US")}, AED ${Math.round(r.avgPsf)}/sqft`)
      .join("\n");
    const text = await aiWrite(
      "You are DealOS's Dubai market analyst. Write a polished market report for a broker from the area figures given. Sections: Summary, Best value areas, Premium areas, Supply watch, Broker talking points. Use short paragraphs and dash bullets. Use ONLY the figures provided; never invent yields, growth rates or transaction volumes. Note the figures come from a sample of available inventory.",
      table,
      1500,
    );
    return { text };
  });
