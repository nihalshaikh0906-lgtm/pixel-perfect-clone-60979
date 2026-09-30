import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { TopBar } from "@/components/TopBar";
import { supabase } from "@/integrations/supabase/client";
import { aed } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/listings")({
  head: () => ({
    meta: [
      { title: "Private Listings · PropFlow" },
      { name: "description", content: "Your own off-market listings, visible only to you." },
      { property: "og:title", content: "Private Listings · PropFlow" },
      { property: "og:description", content: "Your own off-market listings, visible only to you." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ListingsPage,
});

const BUCKET = "broker-logos";
type Listing = { id: string; title: string; area: string; beds: string; size_sqft: number | null; price_aed: number | null; handover: string; notes: string; created_at: string };
const empty = { title: "", area: "", beds: "", size_sqft: "", price_aed: "", handover: "", notes: "" };

async function uid() {
  const { data } = await supabase.auth.getUser();
  if (!data.user) throw new Error("Not signed in");
  return data.user.id;
}

async function loadListings(): Promise<Listing[]> {
  const id = await uid();
  const { data: files, error } = await supabase.storage.from(BUCKET).list(`${id}/listings`, { limit: 500 });
  if (error) throw new Error(error.message);
  const out = await Promise.all(
    (files ?? []).filter((f) => f.name.endsWith(".json")).map(async (f) => {
      const { data } = await supabase.storage.from(BUCKET).download(`${id}/listings/${f.name}`);
      return data ? (JSON.parse(await data.text()) as Listing) : null;
    }),
  );
  return out.filter((l): l is Listing => !!l).sort((a, b) => b.created_at.localeCompare(a.created_at));
}

function ListingsPage() {
  const qc = useQueryClient();
  const { data, isLoading, error } = useQuery({ queryKey: ["private-listings"], queryFn: loadListings });
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const set = (k: keyof typeof empty) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm({ ...form, [k]: e.target.value });

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) { toast.error("Add a title"); return; }
    setSaving(true);
    try {
      const id = await uid();
      const l: Listing = {
        id: crypto.randomUUID(),
        title: form.title.trim(), area: form.area.trim(), beds: form.beds.trim(), handover: form.handover.trim(), notes: form.notes.trim(),
        size_sqft: form.size_sqft ? Number(form.size_sqft) : null,
        price_aed: form.price_aed ? Number(form.price_aed) : null,
        created_at: new Date().toISOString(),
      };
      const { error: e2 } = await supabase.storage.from(BUCKET).upload(`${id}/listings/${l.id}.json`, new Blob([JSON.stringify(l)], { type: "application/json" }));
      if (e2) throw new Error(e2.message);
      setForm(empty);
      toast.success("Listing saved");
      qc.invalidateQueries({ queryKey: ["private-listings"] });
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (l: Listing) => {
    const id = await uid();
    const { error: e2 } = await supabase.storage.from(BUCKET).remove([`${id}/listings/${l.id}.json`]);
    if (e2) { toast.error(e2.message); return; }
    qc.invalidateQueries({ queryKey: ["private-listings"] });
  };

  const input = "w-full rounded-md border border-border bg-card px-3 py-2 text-sm";
  return (
    <div className="min-h-screen">
      <TopBar />
      <main className="mx-auto max-w-[1200px] px-6 py-8">
        <h1 className="text-2xl font-semibold uppercase tracking-wider">Private Listings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Your own off-market units. Only you can see them.</p>

        <form onSubmit={save} className="panel mt-6 grid grid-cols-1 gap-3 p-5 md:grid-cols-3">
          <input className={`${input} md:col-span-2`} placeholder="Title, e.g. Palm Jumeirah 3BR villa" value={form.title} onChange={set("title")} />
          <input className={input} placeholder="Area" value={form.area} onChange={set("area")} />
          <input className={input} placeholder="Bedrooms" value={form.beds} onChange={set("beds")} />
          <input className={input} type="number" placeholder="Size (sqft)" value={form.size_sqft} onChange={set("size_sqft")} />
          <input className={input} type="number" placeholder="Price (AED)" value={form.price_aed} onChange={set("price_aed")} />
          <input className={input} placeholder="Handover / Ready" value={form.handover} onChange={set("handover")} />
          <textarea className={`${input} md:col-span-2`} rows={2} placeholder="Notes" value={form.notes} onChange={set("notes")} />
          <button disabled={saving} className="rounded-full bg-primary px-5 py-2 text-xs font-medium uppercase tracking-wider text-primary-foreground disabled:opacity-50 md:col-span-3 md:justify-self-end">
            {saving ? "Saving…" : "Add listing"}
          </button>
        </form>

        {error ? <p className="mt-6 text-sm text-destructive">{(error as Error).message}</p> : null}
        {isLoading ? <p className="mt-6 flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="size-4 animate-spin" /> Loading…</p> : null}
        {data && data.length === 0 ? <p className="mt-6 text-sm text-muted-foreground">No private listings yet.</p> : null}
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data?.map((l) => (
            <div key={l.id} className="panel flex flex-col gap-2 p-5">
              <div className="flex items-start justify-between gap-2">
                <h2 className="text-lg font-medium">{l.title}</h2>
                <button onClick={() => remove(l)} aria-label="Delete listing" className="text-muted-foreground hover:text-destructive"><Trash2 className="size-4" /></button>
              </div>
              <p className="eyebrow">{[l.area, l.beds && `${l.beds} BR`, l.handover].filter(Boolean).join(" · ")}</p>
              <p className="metric text-sm">{l.price_aed ? aed(l.price_aed) : "Price on request"}{l.size_sqft ? ` · ${l.size_sqft.toLocaleString("en-US")} sqft` : ""}</p>
              {l.notes ? <p className="text-sm text-muted-foreground">{l.notes}</p> : null}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
