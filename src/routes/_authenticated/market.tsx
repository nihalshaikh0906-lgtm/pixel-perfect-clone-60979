import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";

import { TopBar } from "@/components/TopBar";
import { supabase } from "@/integrations/supabase/client";
import { aed } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/market")({
  head: () => ({
    meta: [
      { title: "Market Intel · PropFlow" },
      { name: "description", content: "Area-by-area pricing and supply drawn from your live Dubai inventory." },
      { property: "og:title", content: "Market Intel · PropFlow" },
      { property: "og:description", content: "Area-by-area pricing and supply drawn from your live Dubai inventory." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MarketPage,
});

type Row = { district: string; units: number; avgPrice: number; avgPsf: number };

function MarketPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["market-intel"],
    staleTime: 10 * 60_000,
    queryFn: async (): Promise<Row[]> => {
      const { data: rows, error: e } = await supabase.rpc("search_units", { p_limit: 1000 });
      if (e) throw new Error(e.message);
      const map = new Map<string, { n: number; p: number; pn: number; psf: number; psfn: number }>();
      for (const u of rows ?? []) {
        const k = u.district ?? "Other";
        const m = map.get(k) ?? { n: 0, p: 0, pn: 0, psf: 0, psfn: 0 };
        m.n++;
        if (u.price_aed) { m.p += Number(u.price_aed); m.pn++; }
        if (u.price_per_sqft) { m.psf += Number(u.price_per_sqft); m.psfn++; }
        map.set(k, m);
      }
      return [...map.entries()]
        .map(([district, m]) => ({ district, units: m.n, avgPrice: m.pn ? m.p / m.pn : 0, avgPsf: m.psfn ? m.psf / m.psfn : 0 }))
        .sort((a, b) => b.units - a.units)
        .slice(0, 25);
    },
  });

  return (
    <div className="min-h-screen">
      <TopBar />
      <main className="mx-auto max-w-[1200px] px-6 py-8">
        <h1 className="text-2xl font-semibold uppercase tracking-wider">Market Intel</h1>
        <p className="mt-1 text-sm text-muted-foreground">Top areas by available supply in a sample of up to 1,000 units from your inventory.</p>
        {error ? <p className="mt-6 rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">{(error as Error).message}</p> : null}
        {isLoading ? <p className="mt-6 flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="size-4 animate-spin" /> Analysing inventory…</p> : null}
        {data ? (
          <div className="panel mt-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  {["Area", "Units", "Avg price", "Avg AED / sqft"].map((h) => <th key={h} className="eyebrow px-4 py-3">{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {data.map((r) => (
                  <tr key={r.district} className="border-b border-border/50 last:border-0">
                    <td className="px-4 py-2.5 font-medium">{r.district}</td>
                    <td className="metric px-4 py-2.5">{r.units}</td>
                    <td className="metric px-4 py-2.5">{aed(r.avgPrice)}</td>
                    <td className="metric px-4 py-2.5">{r.avgPsf ? Math.round(r.avgPsf).toLocaleString("en-US") : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </main>
    </div>
  );
}
