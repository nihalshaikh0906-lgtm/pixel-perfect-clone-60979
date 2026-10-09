import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";

import { workspaceHead } from "@/components/app/WorkspacePlaceholder";

export const Route = createFileRoute("/_authenticated/app/owners")({
  head: () => workspaceHead("Owners"),
  component: Page,
});

type Owner = {
  id: string;
  name: string;
  email: string;
  phone: string;
  properties: number;
};

// Sample owner records — illustrative demo data, not saved anywhere.
const START: Owner[] = [
  { id: "OW-101", name: "Fatima Al Suwaidi", email: "fatima.alsuwaidi@example.com", phone: "+971 50 214 8831", properties: 4 },
  { id: "OW-102", name: "Rashid Al Maktoum", email: "rashid.alm@example.com", phone: "+971 55 730 2214", properties: 2 },
  { id: "OW-103", name: "Priya Raghunathan", email: "priya.r@example.com", phone: "+971 52 906 4417", properties: 1 },
  { id: "OW-104", name: "James O'Connell", email: "j.oconnell@example.com", phone: "+971 54 118 7752", properties: 3 },
  { id: "OW-105", name: "Mei-Ling Chen", email: "meiling.chen@example.com", phone: "+971 56 342 9908", properties: 2 },
  { id: "OW-106", name: "Omar Haddad", email: "omar.haddad@example.com", phone: "+971 50 677 3125", properties: 5 },
  { id: "OW-107", name: "Sofia Petrova", email: "sofia.petrova@example.com", phone: "+971 53 820 6640", properties: 1 },
  { id: "OW-108", name: "Ahmed Al Balushi", email: "ahmed.balushi@example.com", phone: "+971 57 495 0183", properties: 2 },
];

const BLANK: Owner = { id: "", name: "", email: "", phone: "", properties: 0 };

function Page() {
  const [rows, setRows] = useState<Owner[]>(START);
  const [draft, setDraft] = useState<Owner | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const openAdd = () => {
    setDraft({ ...BLANK });
    setEditingId(null);
  };
  const openEdit = (o: Owner) => {
    setDraft({ ...o });
    setEditingId(o.id);
  };
  const close = () => {
    setDraft(null);
    setEditingId(null);
  };
  const save = () => {
    if (!draft) return;
    if (editingId) {
      setRows((r) => r.map((o) => (o.id === editingId ? { ...draft, id: editingId } : o)));
    } else {
      setRows((r) => [{ ...draft, id: `OW-${2000 + r.length + 1}` }, ...r]);
    }
    close();
  };
  const remove = (id: string) => setRows((r) => r.filter((o) => o.id !== id));

  return (
    <>
      <section className="a-band a-fade">
        <div>
          <p className="eyebrow-a">CATALOG</p>
          <h1>Owners</h1>
          <p className="sub">Landlord and owner records behind your listings.</p>
        </div>
        <div className="a-band-actions">
          <span className="a-chip c-stage">Sample records — demo data</span>
          <button type="button" className="a-btn a-btn-gold" onClick={openAdd}>
            <Plus size={15} /> Add owner
          </button>
        </div>
      </section>

      <div className="a-card a-fade">
        <div className="a-card-head">
          <h2>All owners</h2>
          <span className="a-count num">{rows.length} owners</span>
        </div>

        <div className="a-table-wrap">
          <table className="a-table a-deal-table">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Phone</th>
                <th scope="col">Properties</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((o) => (
                <tr key={o.id}>
                  <td>
                    <b>{o.name}</b>
                    <small>{o.id}</small>
                  </td>
                  <td>
                    <small>{o.email}</small>
                  </td>
                  <td>
                    <span className="num">{o.phone}</span>
                  </td>
                  <td>
                    <span className="num">{o.properties}</span>
                  </td>
                  <td>
                    <span className="a-deal-acts">
                      <button
                        type="button"
                        className="a-btn a-btn-line a-btn-sm"
                        aria-label={`Edit ${o.name}`}
                        onClick={() => openEdit(o)}
                      >
                        <Pencil size={13} /> Edit
                      </button>
                      <button
                        type="button"
                        className="a-btn a-btn-line a-btn-sm"
                        aria-label={`Remove ${o.name}`}
                        onClick={() => remove(o.id)}
                      >
                        <Trash2 size={13} /> Delete
                      </button>
                    </span>
                  </td>
                </tr>
              ))}
              {!rows.length && (
                <tr>
                  <td colSpan={5} className="a-deal-empty">
                    No owner records right now.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="a-cards">
          {rows.map((o) => (
            <div key={o.id} className="a-lcard">
              <b>{o.name}</b>
              <small>{o.email}</small>
              <span className="a-deal-mrow">
                <span className="a-deal-mamt num">{o.properties} properties</span>
              </span>
              <span className="a-deal-acts">
                <button type="button" className="a-btn a-btn-line a-btn-sm" onClick={() => openEdit(o)}>
                  <Pencil size={13} /> Edit
                </button>
                <button type="button" className="a-btn a-btn-line a-btn-sm" onClick={() => remove(o.id)}>
                  <Trash2 size={13} /> Delete
                </button>
              </span>
            </div>
          ))}
          {!rows.length && <p className="a-mut">No owner records right now.</p>}
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
          aria-label={editingId ? "Edit owner" : "Add owner"}
          onClick={(e) => e.target === e.currentTarget && close()}
        >
          <div>
            <div className="a-deal-head">
              <div>
                <h2 style={{ margin: 0 }}>{editingId ? "Edit owner" : "Add owner"}</h2>
                <p className="a-note" style={{ margin: 0 }}>Fill the details and save the record.</p>
              </div>
              <button
                type="button"
                className="a-btn a-btn-line a-btn-sm"
                aria-label="Close owner form"
                onClick={close}
              >
                <X size={14} />
              </button>
            </div>

            <div className="a-deal-fields">
              <label className="a-deal-span">
                Name
                <input
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                  placeholder="Full name"
                  autoFocus
                />
              </label>
              <label>
                Email
                <input
                  type="email"
                  value={draft.email}
                  onChange={(e) => setDraft({ ...draft, email: e.target.value })}
                  placeholder="name@example.com"
                />
              </label>
              <label>
                Phone
                <input
                  type="tel"
                  value={draft.phone}
                  onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
                  placeholder="+971 5x xxx xxxx"
                />
              </label>
              <label>
                Properties
                <input
                  type="number"
                  min="0"
                  value={draft.properties || ""}
                  onChange={(e) => setDraft({ ...draft, properties: Number(e.target.value) || 0 })}
                  placeholder="0"
                />
              </label>
            </div>

            <div className="a-modal-actions">
              <button type="button" className="a-btn a-btn-line" onClick={close}>
                Cancel
              </button>
              <button type="button" className="a-btn a-btn-gold" onClick={save}>
                {editingId ? "Save changes" : "Add owner"}
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
