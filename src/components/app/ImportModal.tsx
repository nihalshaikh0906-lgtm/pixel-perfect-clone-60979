import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const db = supabase as unknown as { from: (t: string) => any };

export function parseCsv(text: string): string[][] {
  const rows: string[][] = []; let row: string[] = []; let cur = ""; let q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { if (c === '"' && text[i + 1] === '"') { cur += '"'; i++; } else if (c === '"') q = false; else cur += c; }
    else if (c === '"') q = true;
    else if (c === ",") { row.push(cur); cur = ""; }
    else if (c === "\n" || c === "\r") { if (c === "\r" && text[i + 1] === "\n") i++; row.push(cur); cur = ""; if (row.some((x) => x.trim())) rows.push(row); row = []; }
    else cur += c;
  }
  row.push(cur); if (row.some((x) => x.trim())) rows.push(row);
  return rows;
}

const FIELDS = { leads: ["name", "phone", "email", "source", "type", "priority", "budget_max"], listings: ["title", "community", "type", "bedrooms", "size_sqft", "price", "status"] } as const;

export function ImportModal({ kind, orgId, onClose, onDone }: { kind: "leads" | "listings"; orgId: string; onClose: () => void; onDone: () => void }) {
  const [rows, setRows] = useState<string[][]>([]);
  const [map, setMap] = useState<Record<string, number>>({});
  const [over, setOver] = useState(false);
  const [busy, setBusy] = useState(false);
  const fields = FIELDS[kind];
  const load = async (file?: File) => {
    if (!file) return;
    const r = parseCsv(await file.text());
    if (r.length < 2) { toast.error("The file needs a header row and at least one row"); return; }
    setRows(r);
    const head = (r[0] ?? []).map((h) => h.toLowerCase().replace(/[^a-z]/g, ""));
    const m: Record<string, number> = {};
    fields.forEach((f) => { const i = head.findIndex((h) => h.includes(f.replace(/_/g, "").replace("max", "")) || (f === "name" && h.includes("client")) || (f === "title" && h.includes("name"))); if (i >= 0) m[f] = i; });
    setMap(m);
  };
  const run = async () => {
    const req = kind === "leads" ? "name" : "title";
    if (map[req] === undefined) { toast.error(`Map a column to "${req}" first`); return; }
    setBusy(true);
    const num = new Set(["budget_max", "size_sqft", "price"]);
    const items = rows.slice(1).map((r) => { const o: Record<string, unknown> = { org_id: orgId }; fields.forEach((f) => { const i = map[f]; if (i !== undefined && r[i]?.trim()) o[f] = num.has(f) ? Number(r[i].replace(/[^0-9.]/g, "")) || null : r[i].trim(); }); return o; }).filter((o) => o[req]);
    let ok = 0;
    for (let i = 0; i < items.length; i += 200) { const { error } = await db.from(kind === "leads" ? "leads" : "org_listings").insert(items.slice(i, i + 200)); if (!error) ok += Math.min(200, items.length - i); }
    setBusy(false);
    await db.from("notifications").insert({ org_id: orgId, type: "import_done", title: `Import finished: ${ok} ${kind}`, body: `${items.length - ok} failed`, link: kind === "leads" ? "/app/crm" : "/app/listings" });
    toast.success(`Imported ${ok} of ${items.length} ${kind}`); onDone(); onClose();
  };
  return (
    <div className="a-modal" role="dialog" aria-label={`Import ${kind}`} onClick={(e) => e.target === e.currentTarget && onClose()}><div>
      <h2 style={{ margin: 0 }}>Import {kind} from CSV</h2>
      {!rows.length ? (
        <label className={`a-drop ${over ? "on" : ""}`} onDragOver={(e) => { e.preventDefault(); setOver(true); }} onDragLeave={() => setOver(false)} onDrop={(e) => { e.preventDefault(); setOver(false); void load(e.dataTransfer.files[0]); }}>
          <b>Drop a CSV file here</b><span className="muted">or click to choose one</span>
          <input type="file" accept=".csv,text/csv" hidden onChange={(e) => void load(e.target.files?.[0])} />
        </label>
      ) : (
        <>
          <p className="muted" style={{ margin: 0 }}>{rows.length - 1} rows found. Match your columns:</p>
          {fields.map((f) => (
            <label key={f}>{f.replace(/_/g, " ")}<select value={map[f] ?? ""} onChange={(e) => setMap({ ...map, [f]: e.target.value === "" ? (undefined as unknown as number) : Number(e.target.value) })}>
              <option value="">— skip —</option>{(rows[0] ?? []).map((h, i) => <option key={i} value={i}>{h}</option>)}
            </select></label>
          ))}
        </>
      )}
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}><button className="a-btn a-btn-line" onClick={onClose}>Cancel</button>{rows.length ? <button className="a-btn a-btn-gold" disabled={busy} onClick={() => void run()}>{busy ? "Importing…" : `Import ${rows.length - 1} rows`}</button> : null}</div>
    </div></div>
  );
}
