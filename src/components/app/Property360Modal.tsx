import { useEffect, useState } from "react";
import { toast } from "sonner";
import { FileText, ImageIcon, Link2, Mail, Share2, X } from "lucide-react";

export type Property360Item = {
  id: string;
  title: string;
  community?: string | null;
  type?: string | null;
  bedrooms?: string | null;
  size_sqft?: number | null;
  price?: number | null;
  status: string;
  rent?: boolean;
};

const TABS = ["Overview", "Gallery", "Interested", "Viewings", "Deal", "Docs"] as const;
type Tab = (typeof TABS)[number];

const TAB_NOTE: Record<Tab, string> = {
  Overview: "Key specs for this property. The full write-up and neighbourhood notes will land here.",
  Gallery: "Placeholder frames — photos added to this property replace them.",
  Interested: "Nobody has saved this property yet. Buyers who shortlist it will show up here.",
  Viewings: "No viewings booked. Booked and completed visits will be listed here with dates.",
  Deal: "No deal is linked to this property yet. Token, agreement and completion steps will show here.",
  Docs: "No documents attached yet. Brochure, floorplan and title paperwork will collect here.",
};

const aed = (n?: number | null) => (n ? `AED ${n.toLocaleString("en-US")}` : "—");

export function Property360Modal({ property: p, onClose, link }: { property: Property360Item; onClose: () => void; link?: string }) {
  const [tab, setTab] = useState<Tab>("Overview");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const url = link ?? `${window.location.href.split("#")[0]}`;
  const summary = `${p.title}${p.community ? ` — ${p.community}` : ""}${p.price ? ` · ${aed(p.price)}${p.rent ? " / yr" : ""}` : ""}`;

  const copy = async () => {
    try { await navigator.clipboard.writeText(url); toast.success("Property link copied"); }
    catch { toast.error("Your browser blocked the copy — grab it from the address bar"); }
  };
  const share = async () => {
    if (navigator.share) { try { await navigator.share({ title: "DealOS property", text: summary, url }); } catch { /* dismissed */ } return; }
    await copy();
  };
  const email = () => { window.location.href = `mailto:?subject=${encodeURIComponent(p.title)}&body=${encodeURIComponent(`${summary}\n${url}`)}`; };

  return (
    <div className="a-modal a-360-modal" role="dialog" aria-modal="true" aria-label={`Property 360 — ${p.title}`} onClick={(e) => e.target === e.currentTarget && onClose()}><div>
      <div className="a-deal-head">
        <div style={{ minWidth: 0 }}>
          <p className="eyebrow-a" style={{ margin: 0 }}>{p.community ?? "Dubai"} · {p.type ?? "—"}</p>
          <h2 style={{ margin: "2px 0 0", display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            {p.title} <span className="a-chip c-stage">{p.status}</span>
          </h2>
        </div>
        <div className="a-360-acts">
          <button type="button" className="a-btn a-btn-line a-btn-sm" onClick={() => void share()}><Share2 size={14} /> Share</button>
          <button type="button" className="a-btn a-btn-line a-btn-sm" onClick={() => toast.info("No brochure attached to this property yet")}><FileText size={14} /> Brochure</button>
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
            <dt>Status</dt><dd>{p.status}</dd>
            <dt>Beds</dt><dd>{p.bedrooms === "Studio" ? "Studio" : p.bedrooms ? `${p.bedrooms} BR` : "—"}</dd>
            <dt>Size</dt><dd className="num">{p.size_sqft ? `${p.size_sqft.toLocaleString("en-US")} sqft` : "—"}</dd>
            <dt>{p.rent ? "Rent / yr" : "Price"}</dt><dd className="num">{aed(p.price)}</dd>
          </dl>
        ) : null}
        {tab === "Gallery" ? (
          <div className="a-360-gallery">
            {[1, 2, 3].map((n) => (
              <div key={n} className="a-360-shot" aria-label={`Photo placeholder ${n}`}>
                <ImageIcon size={22} />
                <small>Photo {n}</small>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div></div>
  );
}
