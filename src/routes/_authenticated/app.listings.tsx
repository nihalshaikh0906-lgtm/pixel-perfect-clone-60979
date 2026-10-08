import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { RotateCcw, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ImportModal } from "@/components/app/ImportModal";

export const Route = createFileRoute("/_authenticated/app/listings")({
  head: () => ({
    meta: [
      { title: "Listings — DealOS" },
      { name: "description", content: "Your agency's own listings: drafts, live, reserved and sold, with CSV import." },
      { property: "og:title", content: "Listings — DealOS" },
      { property: "og:description", content: "Manage your brokerage listings in one place." },
    ],
  }),
  validateSearch: (s: Record<string, unknown>) => ({ action: typeof s.action === "string" ? s.action : undefined }),
  component: ListingsPage,
});

const db = supabase as unknown as { from: (t: string) => any };
type L = { id: string; title: string; type: string; community: string | null; bedrooms: string | null; size_sqft: number | null; price: number | null; status: string; deleted_at: string | null };
const aed = (n: number | null) => (n ? `AED ${n.toLocaleString("en-US")}` : "—");

function ListingsPage() {
  const qc = useQueryClient();
  const { action } = Route.useSearch();
  const navigate = Route.useNavigate();
  const [bin, setBin] = useState(false);
  const [f, setF] = useState({ title: "", community: "", type: "ready", bedrooms: "1", size_sqft: "", price: "" });

  const org = useQuery({ queryKey: ["crm-me-org"], queryFn: async () => {
    const { data: u } = await supabase.auth.getUser();
    return ((await db.from("org_members").select("org_id").eq("user_id", u.user?.id ?? "").maybeSingle()).data?.org_id ?? null) as string | null;
  } });
  const q = useQuery({ queryKey: ["listings"], enabled: !!org.data, queryFn: async () => ((await db.from("org_listings").select("*").order("created_at", { ascending: false })).data ?? []) as L[] });
  const refresh = () => qc.invalidateQueries({ queryKey: ["listings"] });
  const close = () => void navigate({ search: { action: undefined } });
  const upd = async (id: string, patch: Partial<L>, msg: string) => { const { error } = await db.from("org_listings").update(patch).eq("id", id); if (error) { toast.error(error.message); return; } toast.success(msg); refresh(); };
  const add = async () => {
    if (!f.title.trim() || !org.data) { toast.error("Title is required"); return; }
    const { error } = await db.from("org_listings").insert({ org_id: org.data, title: f.title.trim(), community: f.community || null, type: f.type, bedrooms: f.bedrooms, size_sqft: Number(f.size_sqft) || null, price: Number(f.price) || null });
    if (error) { toast.error(error.message); return; }
    toast.success("Listing saved as draft"); refresh(); close();
  };

  if (org.isLoading) return <div className="a-card">Loading…</div>;
  if (!org.data) return <div className="a-card">Set up your company on the Team leads page first.</div>;
  const rows = (q.data ?? []).filter((l) => (bin ? l.deleted_at : !l.deleted_at));

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <div style={{ display: "flex", alignItems: "end", gap: 8, flexWrap: "wrap" }}>
        <div style={{ marginRight: "auto" }}><p className="eyebrow-a">Your inventory</p><h1 style={{ margin: 0, fontSize: 32 }}>Listings</h1></div>
        <button className={`a-btn ${!bin ? "a-btn-gold" : "a-btn-line"}`} onClick={() => setBin(false)}>Active</button>
        <button className={`a-btn ${bin ? "a-btn-gold" : "a-btn-line"}`} onClick={() => setBin(true)}><Trash2 size={14} /> Bin</button>
        <button className="a-btn a-btn-line" onClick={() => void navigate({ search: { action: "import" } })}>Import CSV</button>
        <button className="a-btn a-btn-gold" onClick={() => void navigate({ search: { action: "add" } })}>+ Add listing</button>
      </div>
      {action === "import" ? <ImportModal kind="listings" orgId={org.data} onClose={close} onDone={refresh} /> : null}
      {action === "add" ? (
        <div className="a-modal" role="dialog" aria-label="Add listing" onClick={(e) => e.target === e.currentTarget && close()}><div>
          <h2 style={{ margin: 0 }}>Add listing</h2>
          {(["title", "community", "size_sqft", "price"] as const).map((k) => <label key={k}>{k.replace("_", " ")}<input value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} /></label>)}
          <label>Type<select value={f.type} onChange={(e) => setF({ ...f, type: e.target.value })}>{["ready", "off-plan", "rent"].map((x) => <option key={x}>{x}</option>)}</select></label>
          <label>Bedrooms<select value={f.bedrooms} onChange={(e) => setF({ ...f, bedrooms: e.target.value })}>{["Studio", "1", "2", "3", "4", "5+"].map((x) => <option key={x}>{x}</option>)}</select></label>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}><button className="a-btn a-btn-line" onClick={close}>Cancel</button><button className="a-btn a-btn-gold" onClick={() => void add()}>Save</button></div>
        </div></div>
      ) : null}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 14 }}>
        {rows.map((l) => (
          <div key={l.id} className="a-card a-lift" style={{ display: "grid", gap: 6 }}>
            <p className="eyebrow-a" style={{ margin: 0 }}>{l.community ?? "Dubai"} · {l.type}</p>
            <b style={{ fontSize: 17 }}>{l.title}</b>
            <span className="muted">{l.bedrooms === "Studio" ? "Studio" : `${l.bedrooms ?? "—"} BR`} · {l.size_sqft ? `${l.size_sqft} sqft` : "—"}</span>
            <strong className="num" style={{ fontSize: 20 }}>{aed(l.price)}</strong>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {bin ? <button className="a-btn a-btn-line" onClick={() => void upd(l.id, { deleted_at: null }, "Restored")}><RotateCcw size={14} /> Restore</button> : (
                <>
                  <select aria-label="Status" value={l.status} onChange={(e) => void upd(l.id, { status: e.target.value }, "Status updated")}>{["draft", "live", "reserved", "sold"].map((x) => <option key={x}>{x}</option>)}</select>
                  <button className="a-btn a-btn-line" style={{ marginLeft: "auto" }} aria-label="Move listing to bin" onClick={() => void upd(l.id, { deleted_at: new Date().toISOString() }, "Moved to bin")}><Trash2 size={14} /></button>
                </>
              )}
            </div>
          </div>
        ))}
        {!rows.length ? <div className="a-card">{bin ? "Bin is empty." : "No listings yet — add your first one."}</div> : null}
      </div>
    </div>
  );
}
