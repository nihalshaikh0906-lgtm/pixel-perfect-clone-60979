import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { workspaceHead } from "@/components/app/WorkspacePlaceholder";

export const Route = createFileRoute("/_authenticated/app/locations")({
  head: () => workspaceHead("Locations"),
  component: Page,
});

const LEVELS = ["Society", "Phase", "Sector", "Block"] as const;
type Loc = { id: string; name: string; level: string; path: string; listings: number };

// Sample location tree — demo data only.
const START: Loc[] = [
  { id: "LC-1", name: "Dubai Hills Estate", level: "Society", path: "Dubai › Dubai Hills Estate", listings: 14 },
  { id: "LC-2", name: "Phase 7", level: "Phase", path: "Dubai › Dubai Hills Estate › Phase 7", listings: 5 },
  { id: "LC-3", name: "Sector B", level: "Sector", path: "Dubai › Dubai Hills Estate › Phase 7 › Sector B", listings: 3 },
  { id: "LC-4", name: "Arabian Ranches", level: "Society", path: "Dubai › Arabian Ranches", listings: 9 },
  { id: "LC-5", name: "Phase 3", level: "Phase", path: "Dubai › Arabian Ranches › Phase 3", listings: 4 },
  { id: "LC-6", name: "Block C", level: "Block", path: "Dubai › Arabian Ranches › Phase 3 › Block C", listings: 2 },
  { id: "LC-7", name: "Jumeirah Village Circle", level: "Society", path: "Dubai › Jumeirah Village Circle", listings: 11 },
];
const BLANK: Loc = { id: "", name: "", level: "Society", path: "", listings: 0 };

function Page() {
  const [rows, setRows] = useState(START);
  const [draft, setDraft] = useState<Loc | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const close = () => { setDraft(null); setEditId(null); };
  const save = () => {
    if (!draft) return;
    if (!draft.name.trim()) return toast.error("Give the location a name");
    const row = { ...draft, path: draft.path.trim() || `Dubai › ${draft.name.trim()}` };
    if (editId) setRows((r) => r.map((x) => (x.id === editId ? { ...row, id: editId } : x)));
    else setRows((r) => [{ ...row, id: `LC-${100 + r.length}` }, ...r]);
    toast.success(editId ? "Location updated" : "Location added");
    close();
  };
  const remove = (l: Loc) => { setRows((r) => r.filter((x) => x.id !== l.id)); toast.success(`${l.name} removed`); };

  const Acts = ({ l }: { l: Loc }) => (
    <span className="a-deal-acts">
      <button type="button" className="a-btn a-btn-line a-btn-sm" aria-label={`Edit ${l.name}`} onClick={() => { setDraft({ ...l }); setEditId(l.id); }}><Pencil size={13} /></button>
      <button type="button" className="a-btn a-btn-line a-btn-sm" aria-label={`Delete ${l.name}`} onClick={() => remove(l)}><Trash2 size={13} /></button>
    </span>
  );

  return (
    <>
      <section className="a-band a-fade">
        <div><p className="eyebrow-a">CATALOG</p><h1>Locations</h1><p className="sub">Societies, phases, sectors and blocks your listings sit in.</p></div>
        <div className="a-band-actions">
          <span className="a-chip c-stage">Sample records — demo data</span>
          <button type="button" className="a-btn a-btn-gold" onClick={() => setDraft({ ...BLANK })}><Plus size={15} /> Add Location</button>
        </div>
      </section>

      <div className="a-card a-fade">
        <div className="a-card-head"><h2>All locations</h2><span className="a-count num">{rows.length} locations</span></div>
        <div className="a-table-wrap">
          <table className="a-table a-deal-table">
            <thead><tr><th>Name</th><th>Level</th><th>Full Path</th><th>Listings Count</th><th>Actions</th></tr></thead>
            <tbody>
              {rows.map((l) => (
                <tr key={l.id}>
                  <td><b>{l.name}</b><small>{l.id}</small></td>
                  <td><span className="a-chip c-stage">{l.level}</span></td>
                  <td><small>{l.path}</small></td>
                  <td className="num">{l.listings}</td>
                  <td><Acts l={l} /></td>
                </tr>
              ))}
              {!rows.length && <tr><td colSpan={5} className="a-deal-empty">No locations yet.</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="a-cards">
          {rows.map((l) => (
            <div key={l.id} className="a-lcard">
              <b>{l.name}</b><small>{l.path}</small>
              <span className="a-deal-mrow"><span className="a-chip c-stage">{l.level}</span><span className="a-deal-mamt num">{l.listings} listings</span></span>
              <Acts l={l} />
            </div>
          ))}
        </div>
        <p className="a-mut">Every row here is sample data — nothing on this page is saved to your database.</p>
      </div>

      {draft && (
        <div className="a-modal a-deal-modal" role="dialog" aria-modal="true" aria-label={editId ? "Edit location" : "Add location"} onClick={(e) => e.target === e.currentTarget && close()}>
          <div>
            <div className="a-deal-head">
              <div><h2 style={{ margin: 0 }}>{editId ? "Edit location" : "Add location"}</h2><p className="a-note" style={{ margin: 0 }}>Name it and place it in the tree.</p></div>
              <button type="button" className="a-btn a-btn-line a-btn-sm" aria-label="Close location form" onClick={close}><X size={14} /></button>
            </div>
            <div className="a-deal-fields">
              <label>Name<input value={draft.name} autoFocus placeholder="e.g. Sector B" onChange={(e) => setDraft({ ...draft, name: e.target.value })} /></label>
              <label>Level<select value={draft.level} onChange={(e) => setDraft({ ...draft, level: e.target.value })}>{LEVELS.map((l) => <option key={l}>{l}</option>)}</select></label>
              <label className="a-deal-span">Full Path<input value={draft.path} placeholder="Dubai › Society › Phase › Sector" onChange={(e) => setDraft({ ...draft, path: e.target.value })} /></label>
            </div>
            <div className="a-modal-actions"><button className="a-btn a-btn-line" onClick={close}>Cancel</button><button className="a-btn a-btn-gold" onClick={save}>{editId ? "Save" : "Add"}</button></div>
          </div>
        </div>
      )}
    </>
  );
}
