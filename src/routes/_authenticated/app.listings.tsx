import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { FileText, Link2, Mail, RotateCcw, Share2, Trash2, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ImportModal } from "@/components/app/ImportModal";
import { InventoryTable } from "@/components/app/InventoryTable";

export const Route = createFileRoute("/_authenticated/app/listings")({
  head: () => ({
    meta: [
      { title: "Listings — DealOS" },
      { name: "description", content: "Your agency's own listings: drafts, live, reserved and sold, with CSV import." },
      { property: "og:title", content: "Listings — DealOS" },
      { property: "og:description", content: "Manage your brokerage listings in one place." },
    ],
  }),
  validateSearch: (s: Record<string, unknown>): { action?: string | undefined; listing?: string | undefined } => ({ action: typeof s["action"] === "string" ? s["action"] : undefined, listing: typeof s["listing"] === "string" ? s["listing"] : undefined }),
  component: ListingsPage,
});

const db = supabase as unknown as { from: (t: string) => any };
type L = { id: string; title: string; type: string; community: string | null; bedrooms: string | null; size_sqft: number | null; price: number | null; status: string; deleted_at: string | null };
type Member = { user_id: string; full_name: string | null; role: string };
const aed = (n: number | null) => (n ? `AED ${n.toLocaleString("en-US")}` : "—");

const AREA_UNITS = ["sqft", "sqm", "acres", "plot"];
const OWNER_REGISTRIES = ["DLD Title Deed", "Ejari", "Oqood (off-plan)", "Passport / Emirates ID", "Not registered yet"];
const EMPTY = { title: "", community: "", type: "ready", bedrooms: "1", size_sqft: "", price: "" };
const EMPTY_X = { area_unit: "sqft", society: "", street: "", lat: "", lng: "", registry: "", owner_name: "", owner_phone: "", agent_id: "" };

function ListingsPage() {
  const qc = useQueryClient();
  const { action, listing } = Route.useSearch();
  const navigate = Route.useNavigate();
  const [bin, setBin] = useState(false);
  const [f, setF] = useState(EMPTY);
  const [x, setX] = useState(EMPTY_X);
  const [featured, setFeatured] = useState(false);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [amenity, setAmenity] = useState("");

  const org = useQuery({ queryKey: ["crm-me-org"], queryFn: async () => {
    const { data: u } = await supabase.auth.getUser();
    return ((await db.from("org_members").select("org_id").eq("user_id", u.user?.id ?? "").maybeSingle()).data?.org_id ?? null) as string | null;
  } });
  const q = useQuery({ queryKey: ["listings"], enabled: !!org.data, queryFn: async () => ((await db.from("org_listings").select("*").order("created_at", { ascending: false })).data ?? []) as L[] });
  const team = useQuery({ queryKey: ["crm-team", org.data], enabled: !!org.data, queryFn: async () => {
    const { data: u } = await supabase.auth.getUser();
    const me = u.user?.id ?? "";
    const rows = (((await db.from("org_members").select("user_id, full_name, role").eq("org_id", org.data)).data) ?? []) as Member[];
    return { me, rows, admin: rows.some((r) => r.user_id === me && r.role === "company_admin") };
  } });

  const refresh = () => qc.invalidateQueries({ queryKey: ["listings"] });
  const close = () => void navigate({ search: {} });
  const open360 = (id: string) => void navigate({ search: { listing: id } });
  const close360 = () => void navigate({ search: {} });
  const reset = () => { setF(EMPTY); setX(EMPTY_X); setFeatured(false); setAmenities([]); setAmenity(""); };
  const setXf = (k: keyof typeof EMPTY_X, v: string) => setX((s) => ({ ...s, [k]: v }));

  const societies = Array.from(new Set((q.data ?? []).map((l) => l.community).filter((c): c is string => !!c))).sort();
  const canAssign = team.data?.admin ?? false;

  useEffect(() => {
    if (action !== "add") return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [action]);

  const addAmenity = (raw: string) => {
    const v = raw.trim().replace(/,+$/, "").trim();
    if (!v) return;
    setAmenities((a) => (a.some((t) => t.toLowerCase() === v.toLowerCase()) ? a : [...a, v]));
    setAmenity("");
  };

  const upd = async (id: string, patch: Partial<L>, msg: string) => { const { error } = await db.from("org_listings").update(patch).eq("id", id); if (error) { toast.error(error.message); return; } toast.success(msg); refresh(); };
  const add = async () => {
    if (!f.title.trim() || !org.data) { toast.error("Title is required"); return; }
    const lat = x.lat.trim();
    const lng = x.lng.trim();
    if (lat && (Number.isNaN(Number(lat)) || Number(lat) < -90 || Number(lat) > 90)) { toast.error("Latitude must be between -90 and 90"); return; }
    if (lng && (Number.isNaN(Number(lng)) || Number(lng) < -180 || Number(lng) > 180)) { toast.error("Longitude must be between -180 and 180"); return; }
    if (x.owner_phone.trim() && x.owner_phone.replace(/\D/g, "").length < 7) { toast.error("Owner phone looks incomplete"); return; }
    const notes = [
      x.society && `Society/Phase: ${x.society}`,
      x.street && `Street address: ${x.street}`,
      `Area unit: ${x.area_unit}`,
      lat && `Latitude: ${lat}`,
      lng && `Longitude: ${lng}`,
      x.registry && `Owner registry: ${x.registry}`,
      x.owner_name.trim() && `Owner name: ${x.owner_name.trim()}`,
      x.owner_phone.trim() && `Owner phone: ${x.owner_phone.trim()}`,
      featured && "Featured on portal: yes",
      amenities.length && `Amenities: ${amenities.join(", ")}`,
    ].filter(Boolean).join("\n");
    const { error } = await db.from("org_listings").insert({
      org_id: org.data,
      title: f.title.trim(),
      community: f.community || null,
      type: f.type,
      bedrooms: f.bedrooms,
      size_sqft: Number(f.size_sqft) || null,
      price: Number(f.price) || null,
      agent_id: x.agent_id || null,
      description: notes || null,
    });
    if (error) { toast.error(error.message); return; }
    toast.success("Listing saved as draft"); refresh(); reset(); close();
  };

  if (org.isLoading) return <div className="a-card">Loading…</div>;
  if (!org.data) return <div className="a-card">Set up your company on the Team leads page first.</div>;
  const rows = (q.data ?? []).filter((l) => (bin ? l.deleted_at : !l.deleted_at));
  const active = (q.data ?? []).find((l) => l.id === listing) ?? null;

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
        <div className="a-modal a-lst-modal" role="dialog" aria-modal="true" aria-label="Add listing" onClick={(e) => e.target === e.currentTarget && close()}><div>
          <div className="a-deal-head">
            <div>
              <h2 style={{ margin: 0 }}>Add listing</h2>
              <p className="a-note" style={{ margin: 0 }}>Fill in what you have — the rest can come later.</p>
            </div>
            <button type="button" className="a-btn a-btn-line a-btn-sm" aria-label="Close add listing form" onClick={close}><X size={14} /></button>
          </div>

          <div className="a-deal-fields">
            <p className="eyebrow-a a-deal-span" style={{ margin: 0 }}>Listing</p>
            <label className="a-deal-span">Title<input value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} placeholder="e.g. 2 BR with balcony" autoFocus /></label>
            <label>Type<select value={f.type} onChange={(e) => setF({ ...f, type: e.target.value })}>{["ready", "off-plan", "rent"].map((t) => <option key={t}>{t}</option>)}</select></label>
            <label>Bedrooms<select value={f.bedrooms} onChange={(e) => setF({ ...f, bedrooms: e.target.value })}>{["Studio", "1", "2", "3", "4", "5+"].map((t) => <option key={t}>{t}</option>)}</select></label>
            <label>Community<input value={f.community} onChange={(e) => setF({ ...f, community: e.target.value })} placeholder="Downtown, Marina…" /></label>
            <label>Society/Phase
              <select value={x.society} onChange={(e) => setXf("society", e.target.value)}>
                <option value="">{societies.length ? "Choose a society…" : "No societies yet"}</option>
                {societies.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </label>
            <label>Size<input type="number" min="0" step="1" inputMode="decimal" value={f.size_sqft} onChange={(e) => setF({ ...f, size_sqft: e.target.value })} placeholder="1150" /></label>
            <label>Area Unit<select value={x.area_unit} onChange={(e) => setXf("area_unit", e.target.value)}>{AREA_UNITS.map((u) => <option key={u}>{u}</option>)}</select></label>
            <label>Price<input type="number" min="0" step="1000" inputMode="decimal" value={f.price} onChange={(e) => setF({ ...f, price: e.target.value })} placeholder="1850000" /></label>

            <p className="eyebrow-a a-deal-span" style={{ margin: 0 }}>Location</p>
            <label className="a-deal-span">Street Address<input value={x.street} onChange={(e) => setXf("street", e.target.value)} placeholder="Building, street, unit no." /></label>
            <label>Latitude<input type="number" step="0.000001" value={x.lat} onChange={(e) => setXf("lat", e.target.value)} placeholder="25.2048" /></label>
            <label>Longitude<input type="number" step="0.000001" value={x.lng} onChange={(e) => setXf("lng", e.target.value)} placeholder="55.2708" /></label>

            <p className="eyebrow-a a-deal-span" style={{ margin: 0 }}>Owner</p>
            <label>Owner Registry<select value={x.registry} onChange={(e) => setXf("registry", e.target.value)}><option value="">Choose a registry…</option>{OWNER_REGISTRIES.map((r) => <option key={r}>{r}</option>)}</select></label>
            <label>Owner Name<input value={x.owner_name} onChange={(e) => setXf("owner_name", e.target.value)} placeholder="Full name" /></label>
            <label>Owner Phone<input type="tel" value={x.owner_phone} onChange={(e) => setXf("owner_phone", e.target.value)} placeholder="+971 5x xxx xxxx" /></label>
            <label>Assigned Agent
              <select value={x.agent_id} onChange={(e) => setXf("agent_id", e.target.value)}>
                <option value="">{team.isLoading ? "Loading…" : "Leave with me"}</option>
                {(team.data?.rows ?? []).map((m) => (
                  <option key={m.user_id} value={m.user_id} disabled={!canAssign && m.user_id !== team.data?.me}>
                    {m.full_name || "Team member"}{m.user_id === team.data?.me ? " (you)" : ""}
                  </option>
                ))}
              </select>
            </label>
            {!canAssign ? <p className="a-note a-deal-span" style={{ margin: 0 }}>Listings are handed to other agents by your company admin.</p> : null}

            <p className="eyebrow-a a-deal-span" style={{ margin: 0 }}>Portal</p>
            <div className="a-deal-span a-lst-switch">
              <div><b>Featured on Portal</b><small className="a-note" style={{ display: "block" }}>Pin this listing to the top of your public page.</small></div>
              <button type="button" role="switch" aria-checked={featured} aria-label="Featured on Portal" className="a-switch" onClick={() => setFeatured((v) => !v)}><span /></button>
            </div>
            <label className="a-deal-span">Amenities
              <div className="a-lst-tags">
                {amenities.map((t) => (
                  <span key={t} className="a-chip c-stage a-lst-tag">{t}
                    <button type="button" aria-label={`Remove ${t}`} onClick={() => setAmenities((a) => a.filter((v) => v !== t))}><X size={12} /></button>
                  </span>
                ))}
                <input
                  value={amenity}
                  onChange={(e) => setAmenity(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addAmenity(amenity); }
                    else if (e.key === "Backspace" && !amenity && amenities.length) setAmenities((a) => a.slice(0, -1));
                  }}
                  onBlur={() => addAmenity(amenity)}
                  placeholder={amenities.length ? "Add another…" : "Pool, gym, parking… press Enter"}
                />
              </div>
            </label>
          </div>

          <div className="a-modal-actions"><button className="a-btn a-btn-line" onClick={close}>Cancel</button><button className="a-btn a-btn-gold" onClick={() => void add()}>Save</button></div>
        </div></div>
      ) : null}
      {active ? <Property360 l={active} onClose={close360} /> : null}
      {!bin ? (
        <div style={{ display: "grid", gap: 10 }}>
          <p className="eyebrow-a" style={{ margin: 0 }}>Sample ready stock (demo)</p>
          <InventoryTable category="ready" />
        </div>
      ) : null}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 14 }}>
        {rows.map((l) => (
          <div
            key={l.id}
            className="a-card a-lift a-lst-card"
            role="button"
            tabIndex={0}
            aria-label={`Open Property 360 for ${l.title}`}
            onClick={() => open360(l.id)}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open360(l.id); } }}
            style={{ display: "grid", gap: 6 }}
          >
            <p className="eyebrow-a" style={{ margin: 0 }}>{l.community ?? "Dubai"} · {l.type}</p>
            <b style={{ fontSize: 17 }}>{l.title}</b>
            <span className="muted">{l.bedrooms === "Studio" ? "Studio" : `${l.bedrooms ?? "—"} BR`} · {l.size_sqft ? `${l.size_sqft} sqft` : "—"}</span>
            <strong className="num" style={{ fontSize: 20 }}>{aed(l.price)}</strong>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {bin ? <button className="a-btn a-btn-line" onClick={(e) => { e.stopPropagation(); void upd(l.id, { deleted_at: null }, "Restored"); }}><RotateCcw size={14} /> Restore</button> : (
                <>
                  <select aria-label="Status" value={l.status} onClick={(e) => e.stopPropagation()} onChange={(e) => void upd(l.id, { status: e.target.value }, "Status updated")}>{["draft", "live", "reserved", "sold"].map((x) => <option key={x}>{x}</option>)}</select>
                  <button className="a-btn a-btn-line" style={{ marginLeft: "auto" }} aria-label="Move listing to bin" onClick={(e) => { e.stopPropagation(); void upd(l.id, { deleted_at: new Date().toISOString() }, "Moved to bin"); }}><Trash2 size={14} /></button>
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

const TABS = ["Overview", "Gallery", "Interested", "Viewings", "Deal", "Docs"] as const;
type Tab = (typeof TABS)[number];

const TAB_NOTE: Record<Tab, string> = {
  Overview: "Overview is a placeholder while this listing is completed — the full write-up, neighbourhood notes and market comparison will land here.",
  Gallery: "No photos on file yet. Images added to this listing appear here as a strip.",
  Interested: "Nobody has saved this listing yet. Buyers who shortlist it will show up here.",
  Viewings: "No viewings booked. Booked and completed visits will be listed here with dates.",
  Deal: "No deal is linked to this listing yet. Token, agreement and completion steps will show here.",
  Docs: "No documents attached yet. Brochure, floorplan and title paperwork will collect here.",
};

function Property360({ l, onClose }: { l: L; onClose: () => void }) {
  const [tab, setTab] = useState<Tab>("Overview");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const link = `${window.location.origin}/app/listings?listing=${l.id}`;
  const summary = `${l.title}${l.community ? ` — ${l.community}` : ""}${l.price ? ` · AED ${l.price.toLocaleString("en-US")}` : ""}`;

  const copy = async () => {
    try { await navigator.clipboard.writeText(link); toast.success("Listing link copied"); }
    catch { toast.error("Your browser blocked the copy — grab it from the address bar"); }
  };
  const share = async () => {
    if (navigator.share) { try { await navigator.share({ title: "DealOS listing", text: summary, url: link }); } catch { /* shared or dismissed */ } return; }
    await copy();
  };
  const email = () => { window.location.href = `mailto:?subject=${encodeURIComponent(l.title)}&body=${encodeURIComponent(`${summary}\n${link}`)}`; };

  return (
    <div className="a-modal a-360-modal" role="dialog" aria-modal="true" aria-label={`Property 360 — ${l.title}`} onClick={(e) => e.target === e.currentTarget && onClose()}><div>
      <div className="a-deal-head">
        <div style={{ minWidth: 0 }}>
          <p className="eyebrow-a" style={{ margin: 0 }}>{l.community ?? "Dubai"} · {l.type ?? "—"}</p>
          <h2 style={{ margin: "2px 0 0" }}>{l.title}</h2>
        </div>
        <div className="a-360-acts">
          <button type="button" className="a-btn a-btn-line a-btn-sm" onClick={() => void share()}><Share2 size={14} /> Share</button>
          <button type="button" className="a-btn a-btn-line a-btn-sm" onClick={() => toast.info("No brochure attached to this listing yet")}><FileText size={14} /> Brochure</button>
          <button type="button" className="a-btn a-btn-line a-btn-sm" onClick={email}><Mail size={14} /> Email</button>
          <button type="button" className="a-btn a-btn-line a-btn-sm" onClick={() => void copy()}><Link2 size={14} /> Link</button>
          <button type="button" className="a-btn a-btn-line a-btn-sm" aria-label="Close property 360" onClick={onClose}><X size={14} /></button>
        </div>
      </div>

      <div className="a-tabs" role="tablist" aria-label="Property 360 sections">
        {TABS.map((t) => (
          <button key={t} type="button" role="tab" aria-selected={tab === t} className={`a-tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>

      <div role="tabpanel" aria-label={tab} className="a-360-panel">
        <p className="a-note" style={{ margin: 0 }}>{TAB_NOTE[tab]}</p>
        {tab === "Overview" ? (
          <dl className="a-kv" style={{ margin: "14px 0 0" }}>
            <dt>Status</dt><dd>{l.status}</dd>
            <dt>Type</dt><dd>{l.type ?? "—"}</dd>
            <dt>Bedrooms</dt><dd>{l.bedrooms === "Studio" ? "Studio" : l.bedrooms ?? "—"}</dd>
            <dt>Size</dt><dd>{l.size_sqft ? `${l.size_sqft} sqft` : "—"}</dd>
            <dt>Price</dt><dd className="num">{aed(l.price)}</dd>
          </dl>
        ) : null}
      </div>
    </div></div>
  );
}
