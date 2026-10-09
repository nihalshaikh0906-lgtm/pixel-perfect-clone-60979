import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Baby,
  BellRing,
  Car,
  DoorClosed,
  Dumbbell,
  PawPrint,
  Pencil,
  Plus,
  ShieldCheck,
  Trash2,
  Trees,
  Umbrella,
  Waves,
  Wifi,
  X,
} from "lucide-react";

import { workspaceHead } from "@/components/app/WorkspacePlaceholder";

export const Route = createFileRoute("/_authenticated/app/amenities")({
  head: () => workspaceHead("Amenities"),
  component: Page,
});

// Icon catalogue — the `icon` field on a row keys into this map.
const ICONS = {
  waves: Waves,
  dumbbell: Dumbbell,
  car: Car,
  shield: ShieldCheck,
  umbrella: Umbrella,
  paw: PawPrint,
  baby: Baby,
  bell: BellRing,
  door: DoorClosed,
  trees: Trees,
  wifi: Wifi,
} as const;

type IconKey = keyof typeof ICONS;

type Amenity = {
  id: string;
  icon: IconKey;
  name: string;
  tagged: number;
  created: string;
};

const ICON_KEYS = Object.keys(ICONS) as IconKey[];
const ICON_LABEL = (k: IconKey) => k.charAt(0).toUpperCase() + k.slice(1);

// Sample amenity catalogue — illustrative demo data, not saved anywhere.
const START: Amenity[] = [
  { id: "AM-201", icon: "waves", name: "Swimming pool", tagged: 14, created: "12 Jan 2026" },
  { id: "AM-202", icon: "dumbbell", name: "Gymnasium", tagged: 11, created: "12 Jan 2026" },
  { id: "AM-203", icon: "car", name: "Covered parking", tagged: 18, created: "3 Feb 2026" },
  { id: "AM-204", icon: "shield", name: "24/7 security", tagged: 16, created: "3 Feb 2026" },
  { id: "AM-205", icon: "umbrella", name: "Beach access", tagged: 5, created: "21 Feb 2026" },
  { id: "AM-206", icon: "paw", name: "Pets allowed", tagged: 7, created: "8 Mar 2026" },
  { id: "AM-207", icon: "baby", name: "Kids play area", tagged: 9, created: "8 Mar 2026" },
  { id: "AM-208", icon: "bell", name: "Concierge", tagged: 4, created: "17 Apr 2026" },
  { id: "AM-209", icon: "door", name: "Maid's room", tagged: 6, created: "2 May 2026" },
  { id: "AM-210", icon: "trees", name: "Landscaped garden", tagged: 10, created: "2 May 2026" },
  { id: "AM-211", icon: "wifi", name: "Smart home ready", tagged: 3, created: "30 May 2026" },
];

const BLANK: Amenity = { id: "", icon: "waves", name: "", tagged: 0, created: "" };

function Page() {
  const [rows, setRows] = useState<Amenity[]>(START);
  const [draft, setDraft] = useState<Amenity | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const openAdd = () => {
    setDraft({ ...BLANK });
    setEditingId(null);
  };
  const openEdit = (a: Amenity) => {
    setDraft({ ...a });
    setEditingId(a.id);
  };
  const close = () => {
    setDraft(null);
    setEditingId(null);
  };
  const save = () => {
    if (!draft) return;
    if (editingId) {
      setRows((r) => r.map((a) => (a.id === editingId ? { ...draft, id: editingId } : a)));
    } else {
      setRows((r) => [{ ...draft, id: `AM-${3000 + r.length + 1}` }, ...r]);
    }
    close();
  };
  const remove = (id: string) => setRows((r) => r.filter((a) => a.id !== id));

  return (
    <>
      <section className="a-band a-fade">
        <div>
          <p className="eyebrow-a">CATALOG</p>
          <h1>Amenities</h1>
          <p className="sub">Building and project amenity catalogue used across your listings.</p>
        </div>
        <div className="a-band-actions">
          <span className="a-chip c-stage">Sample catalogue — demo data</span>
          <button type="button" className="a-btn a-btn-gold" onClick={openAdd}>
            <Plus size={15} /> Add amenity
          </button>
        </div>
      </section>

      <div className="a-card a-fade">
        <div className="a-card-head">
          <h2>All amenities</h2>
          <span className="a-count num">{rows.length} amenities</span>
        </div>

        <div className="a-table-wrap">
          <table className="a-table a-deal-table">
            <thead>
              <tr>
                <th scope="col">Icon</th>
                <th scope="col">Name</th>
                <th scope="col">Tagged listings</th>
                <th scope="col">Created</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((a) => {
                const Icon = ICONS[a.icon];
                return (
                  <tr key={a.id}>
                    <td>
                      <span className="a-chip c-stage" aria-hidden>
                        <Icon size={14} />
                      </span>
                    </td>
                    <td>
                      <b>{a.name}</b>
                      <small>{a.id}</small>
                    </td>
                    <td>
                      <span className="num">{a.tagged}</span>
                    </td>
                    <td>
                      <small>{a.created}</small>
                    </td>
                    <td>
                      <span className="a-deal-acts">
                        <button
                          type="button"
                          className="a-btn a-btn-line a-btn-sm"
                          aria-label={`Edit ${a.name}`}
                          onClick={() => openEdit(a)}
                        >
                          <Pencil size={13} /> Edit
                        </button>
                        <button
                          type="button"
                          className="a-btn a-btn-line a-btn-sm"
                          aria-label={`Remove ${a.name}`}
                          onClick={() => remove(a.id)}
                        >
                          <Trash2 size={13} /> Delete
                        </button>
                      </span>
                    </td>
                  </tr>
                );
              })}
              {!rows.length && (
                <tr>
                  <td colSpan={5} className="a-deal-empty">
                    No amenities in the catalogue right now.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="a-cards">
          {rows.map((a) => {
            const Icon = ICONS[a.icon];
            return (
              <div key={a.id} className="a-lcard">
                <b>{a.name}</b>
                <small>{a.created}</small>
                <span className="a-deal-mrow">
                  <span className="a-deal-mamt num">
                    <Icon size={14} /> {a.tagged} listings
                  </span>
                </span>
                <span className="a-deal-acts">
                  <button type="button" className="a-btn a-btn-line a-btn-sm" onClick={() => openEdit(a)}>
                    <Pencil size={13} /> Edit
                  </button>
                  <button type="button" className="a-btn a-btn-line a-btn-sm" onClick={() => remove(a.id)}>
                    <Trash2 size={13} /> Delete
                  </button>
                </span>
              </div>
            );
          })}
          {!rows.length && <p className="a-mut">No amenities in the catalogue right now.</p>}
        </div>

        <p className="a-mut">
          Every row here is sample data for the layout — nothing on this page is saved to your database.
        </p>
      </div>

      {draft && (
        <div
          className="a-modal a-deal-modal"
          role="dialog"
          aria-modal="true"
          aria-label={editingId ? "Edit amenity" : "Add amenity"}
          onClick={(e) => e.target === e.currentTarget && close()}
        >
          <div>
            <div className="a-deal-head">
              <div>
                <h2 style={{ margin: 0 }}>{editingId ? "Edit amenity" : "Add amenity"}</h2>
                <p className="a-note" style={{ margin: 0 }}>Fill the details and save the record.</p>
              </div>
              <button
                type="button"
                className="a-btn a-btn-line a-btn-sm"
                aria-label="Close amenity form"
                onClick={close}
              >
                <X size={14} />
              </button>
            </div>

            <div className="a-deal-fields">
              <label>
                Name
                <input
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                  placeholder="e.g. Swimming pool"
                  autoFocus
                />
              </label>
              <label>
                Icon
                <select value={draft.icon} onChange={(e) => setDraft({ ...draft, icon: e.target.value as IconKey })}>
                  {ICON_KEYS.map((k) => (
                    <option key={k} value={k}>
                      {ICON_LABEL(k)}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="a-modal-actions">
              <button type="button" className="a-btn a-btn-line" onClick={close}>
                Cancel
              </button>
              <button type="button" className="a-btn a-btn-gold" onClick={save}>
                {editingId ? "Save changes" : "Add amenity"}
              </button>
            </div>
            <p className="a-mut" style={{ margin: 0 }}>
              Demo only — this updates the on-screen table. Nothing is written to your database.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
