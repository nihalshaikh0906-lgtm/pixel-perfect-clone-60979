import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2, Search } from "lucide-react";
import { useState } from "react";

import { TopBar } from "@/components/TopBar";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { aed, beds, quarterOf, sqft } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/inventory")({
  head: () => ({
    meta: [
      { title: "Property Inventory · PropFlow" },
      { name: "description", content: "Search live Dubai units by budget, bedrooms and area." },
      { property: "og:title", content: "Property Inventory · PropFlow" },
      { property: "og:description", content: "Search live Dubai units by budget, bedrooms and area." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: InventoryPage,
});

function InventoryPage() {
  const [area, setArea] = useState("");
  const [maxBudget, setMaxBudget] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [applied, setApplied] = useState({ area: "", maxBudget: "", bedrooms: "" });

  const { data, isLoading, error } = useQuery({
    queryKey: ["inventory", applied],
    queryFn: async () => {
      const { data: rows, error: e } = await supabase.rpc("search_units", {
        p_budget_max: applied.maxBudget ? Number(applied.maxBudget) : undefined,
        p_bedrooms: applied.bedrooms ? [Number(applied.bedrooms)] : undefined,
        p_areas: applied.area ? [applied.area] : undefined,
        p_limit: 50,
      });
      if (e) throw new Error(e.message);
      return rows ?? [];
    },
  });

  return (
    <div className="min-h-screen">
      <TopBar />
      <main className="mx-auto max-w-[1500px] px-6 py-8">
        <h1 className="text-2xl font-semibold uppercase tracking-wider">Property Inventory</h1>
        <form
          onSubmit={(e) => { e.preventDefault(); setApplied({ area, maxBudget, bedrooms }); }}
          className="panel mt-6 flex flex-wrap items-end gap-3 p-4"
        >
          <label className="space-y-1"><span className="eyebrow">Area</span>
            <Input value={area} onChange={(e) => setArea(e.target.value)} placeholder="Dubai Marina" /></label>
          <label className="space-y-1"><span className="eyebrow">Max budget (AED)</span>
            <Input type="number" value={maxBudget} onChange={(e) => setMaxBudget(e.target.value)} placeholder="3000000" /></label>
          <label className="space-y-1"><span className="eyebrow">Bedrooms</span>
            <Input type="number" min={0} value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} placeholder="2" /></label>
          <button type="submit" className="flex h-9 items-center gap-2 rounded-full bg-primary px-5 text-xs font-semibold uppercase tracking-wider text-primary-foreground">
            <Search className="size-4" /> Search
          </button>
        </form>

        {error ? <p className="mt-6 rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">{(error as Error).message}</p> : null}
        {isLoading ? <p className="mt-6 flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="size-4 animate-spin" /> Scanning inventory…</p> : null}

        {data ? (
          <div className="panel mt-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  {["Project", "Developer", "Area", "Unit", "Beds", "Size", "Price", "Handover"].map((h) => (
                    <th key={h} className="eyebrow px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((u) => (
                  <tr key={u.unit_id} className="border-b border-border/50 last:border-0">
                    <td className="px-4 py-2.5 font-medium">{u.project_name}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">{u.developer}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">{u.district}</td>
                    <td className="metric px-4 py-2.5">{u.unit_number}</td>
                    <td className="px-4 py-2.5">{beds(u.bedrooms)}</td>
                    <td className="metric px-4 py-2.5">{sqft(u.size_sqft)}</td>
                    <td className="metric px-4 py-2.5 font-medium">{aed(u.price_aed)}</td>
                    <td className="px-4 py-2.5">{quarterOf(u.handover_date)}</td>
                  </tr>
                ))}
                {!data.length ? <tr><td colSpan={8} className="px-4 py-6 text-center text-muted-foreground">No units match these filters.</td></tr> : null}
              </tbody>
            </table>
          </div>
        ) : null}
      </main>
    </div>
  );
}
