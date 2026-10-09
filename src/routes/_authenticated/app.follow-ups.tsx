import { createFileRoute } from "@tanstack/react-router";
import { Fragment, useEffect, useMemo, useState } from "react";
import { ChevronDown, Plus, X } from "lucide-react";
import { toast } from "sonner";

import { workspaceHead } from "@/components/app/WorkspacePlaceholder";
import {
  LEADS,
  LEAD_BY_ID,
  isOpen,
  wants,
  type Lead,
} from "@/lib/demo-leads";

export const Route = createFileRoute("/_authenticated/app/follow-ups")({
  head: () => workspaceHead("Follow-Ups"),
  component: Page,
});

type Status = "Due Now" | "Upcoming" | "Completed" | "Cancelled";
type Pipe = "All" | Status;
type Kind = "Call" | "Email" | "Meeting";

type Task = {
  id: string;
  at: string; // ISO, used only for sorting
  leadId: string;
  lead: string; // fallback name if the demo lead is missing
  phone: string; // fallback phone
  kind: Kind;
  agent: string;
  status: Status;
  note: string;
};

const PIPE: Pipe[] = ["All", "Due Now", "Upcoming", "Completed", "Cancelled"];

const CHIP: Record<Status, string> = {
  "Due Now": "c-hot",
  Upcoming: "c-offplan",
  Completed: "c-ok",
  Cancelled: "c-cold",
};

const KINDS: Kind[] = ["Call", "Email", "Meeting"];
const AGENTS = ["You", "Saad", "Aisha", "Omar", "Priya"];

// Sample queue — every row below is illustrative demo data, not saved anywhere.
const ROWS: Task[] = [
  { id: "FU-2101", at: "2026-10-08T11:00", leadId: "L-1189", lead: "Marco R.", phone: "+971 52 709 1188", kind: "Call", agent: "Saad", status: "Due Now", note: "Called twice yesterday; promised to ring back after the school run." },
  { id: "FU-2102", at: "2026-10-09T09:30", leadId: "L-1403", lead: "Ivan F.", phone: "+971 50 597 1402", kind: "Email", agent: "Aisha", status: "Due Now", note: "Shortlist of four Town Square units drafted but never sent." },
  { id: "FU-2103", at: "2026-10-09T12:00", leadId: "L-1843", lead: "James B.", phone: "+971 51 637 1842", kind: "Meeting", agent: "Omar", status: "Due Now", note: "Wants to bring his brother; meeting at the sales centre before the site visit." },
  { id: "FU-2104", at: "2026-10-09T14:00", leadId: "L-1224", lead: "Khalid N.", phone: "+971 51 323 1223", kind: "Call", agent: "Priya", status: "Due Now", note: "Offer was verbal — needs the landlord's written answer today." },
  { id: "FU-2105", at: "2026-10-07T16:00", leadId: "L-1913", lead: "Elena V.", phone: "+971 56 440 1912", kind: "Email", agent: "Saad", status: "Due Now", note: "Asked for the service charge sheet and handover photos; still outstanding." },
  { id: "FU-2111", at: "2026-10-09T17:00", leadId: "L-1235", lead: "James D.", phone: "+971 55 703 1234", kind: "Call", agent: "Aisha", status: "Upcoming", note: "Qualify on budget and mortgage pre-approval before the weekend launch." },
  { id: "FU-2112", at: "2026-10-10T10:30", leadId: "L-1197", lead: "Zara G.", phone: "+971 56 146 1196", kind: "Meeting", agent: "Omar", status: "Upcoming", note: "Site walk at Town Square with the developer's representative." },
  { id: "FU-2113", at: "2026-10-10T15:45", leadId: "L-1281", lead: "Ahmed R.", phone: "+971 55 824 1280", kind: "Email", agent: "Priya", status: "Upcoming", note: "Send the two floor plans and the payment schedule he asked for." },
  { id: "FU-2114", at: "2026-10-11T11:00", leadId: "L-1581", lead: "Sara M.", phone: "+971 53 158 1580", kind: "Call", agent: "Saad", status: "Upcoming", note: "Check whether the one-bedroom budget stretches to the corner unit." },
  { id: "FU-2115", at: "2026-10-12T13:30", leadId: "L-1669", lead: "Elena A.", phone: "+971 58 117 1668", kind: "Meeting", agent: "Aisha", status: "Upcoming", note: "Offer meeting at the Palm Jumeirah sales centre; seller's agent invited." },
  { id: "FU-2116", at: "2026-10-13T09:00", leadId: "L-1807", lead: "Rahul A.", phone: "+971 51 806 1806", kind: "Email", agent: "Omar", status: "Upcoming", note: "Brochure plus the rental note he asked for last week." },
  { id: "FU-2091", at: "2026-10-08T15:00", leadId: "L-1087", lead: "Zara D.", phone: "+971 54 168 1086", kind: "Call", agent: "Saad", status: "Completed", note: "Confirmed the Palm Reserve viewing for Tuesday; location pin sent." },
  { id: "FU-2092", at: "2026-10-07T10:00", leadId: "L-1507", lead: "Kenji V.", phone: "+971 55 649 1506", kind: "Email", agent: "Aisha", status: "Completed", note: "Shortlist sent; he replied asking for the slab progress photos." },
  { id: "FU-2093", at: "2026-10-06T13:00", leadId: "L-1131", lead: "Priya T.", phone: "+971 57 409 1130", kind: "Meeting", agent: "Priya", status: "Completed", note: "Met at the JVC site office; budget confirmed, wants two more units." },
  { id: "FU-2081", at: "2026-10-08T12:00", leadId: "L-1107", lead: "Daniel P.", phone: "+971 54 797 1106", kind: "Call", agent: "Omar", status: "Cancelled", note: "Client took a studio in Al Garhoud through another agent." },
  { id: "FU-2082", at: "2026-10-09T11:00", leadId: "L-1519", lead: "Kenji N.", phone: "+971 54 449 1518", kind: "Email", agent: "Priya", status: "Cancelled", note: "Asked to pause the follow-ups for now; keep warm for the next phase." },
];

// Leads the form can be pointed at: open, already in conversation, strongest first.
const PICKS = LEADS.filter((l) => isOpen(l) && l.stage !== "New" && l.score >= 60)
  .sort((a, b) => b.score - a.score)
  .slice(0, 60);

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const WDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Built from the ISO string with UTC maths, so the server and the browser always agree.
function dayLabel(at: string): string {
  const [y = 2026, m = 1, d = 1] = (at.split("T")[0] ?? "").split("-").map(Number);
  const wd = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  return `${WDAYS[wd] ?? ""} ${d} ${MONTHS[m - 1] ?? ""}`.trim();
}

const timeLabel = (at: string) => at.slice(11, 16);

const initials = (n: string) =>
  n.split(/\s+/).map((p) => p[0]).join("").slice(0, 2).toUpperCase();

type SortKey = "lead" | "kind" | "at" | "agent" | "status" | "note";
const TEXT_KEYS: SortKey[] = ["lead", "kind", "agent", "status", "note"];

function Page() {
  const [pipe, setPipe] = useState<Pipe>("All");
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 }>({ key: "at", dir: 1 });
  const [open, setOpen] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [extra, setExtra] = useState<Task[]>([]);

  // Demo lead records back the queue rows: name, phone and what the client asked for.
  const ALL = useMemo(
    () =>
      [...extra, ...ROWS].map((t) => {
        const l: Lead | undefined = LEAD_BY_ID.get(t.leadId);
        return { ...t, name: l?.name ?? t.lead, phone: l?.phone ?? t.phone, lead: l };
      }),
    [extra],
  );

  const sortValue = (t: (typeof ALL)[number], k: SortKey): string | number => {
    if (k === "at") return t.at;
    if (k === "status") return PIPE.indexOf(t.status);
    if (k === "lead") return t.name;
    return t[k];
  };

  const rows = useMemo(() => {
    const filtered = pipe === "All" ? ALL : ALL.filter((t) => t.status === pipe);
    return [...filtered].sort((x, y) => {
      const av = sortValue(x, sort.key);
      const bv = sortValue(y, sort.key);
      const cmp = typeof av === "number" && typeof bv === "number" ? av - bv : String(av).localeCompare(String(bv));
      return cmp * sort.dir;
    });
  }, [pipe, sort, ALL]);

  const count = (p: Pipe) => (p === "All" ? ALL.length : ALL.filter((t) => t.status === p).length);

  // The form adds a row to the on-screen queue only — it never touches the database.
  const addTask = (t: Task) => {
    setExtra((x) => [t, ...x]);
    setPipe("All");
    setOpen(t.id);
    toast.success("Follow-up added to the on-screen queue — demo only");
  };

  const onSort = (key: SortKey) =>
    setSort((s) =>
      s.key === key ? { key, dir: s.dir === 1 ? -1 : 1 } : { key, dir: TEXT_KEYS.includes(key) ? 1 : -1 },
    );

  return (
    <>
      <section className="a-band a-fade">
        <div>
          <p className="eyebrow-a">CRM</p>
          <h1>Follow-Ups</h1>
          <p className="sub">Every call, email and meeting your leads are waiting on.</p>
        </div>
        <div className="a-band-actions">
          <span className="a-chip c-stage">Sample queue — demo records</span>
          <span className="a-chip c-hot">{count("Due Now")} due now</span>
          <button type="button" className="a-btn a-btn-gold" onClick={() => setShowNew(true)}>
            <Plus size={16} /> Add Follow-Up
          </button>
        </div>
      </section>

      <div className="a-card a-fade">
        <div className="a-card-head">
          <h2>Follow-up status</h2>
          <span className="a-note num">
            {ALL.length} follow-ups · {count("Due Now")} due now · {count("Upcoming")} upcoming · {count("Completed")} completed
          </span>
        </div>
        <div className="a-pipe" role="tablist" aria-label="Follow-up status">
          {PIPE.map((p) => (
            <button
              key={p}
              type="button"
              role="tab"
              aria-selected={pipe === p}
              className="a-pipe-step"
              onClick={() => {
                setPipe(p);
                setOpen(null);
              }}
            >
              {p}
              <span className="num">{count(p)}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="a-card">
        <div className="a-card-head">
          <h2>{pipe === "All" ? "All follow-ups" : `${pipe} follow-ups`}</h2>
          <span className="a-count num">{rows.length} follow-ups</span>
        </div>

        <div className="a-table-wrap">
          <table className="a-table a-deal-table">
            <thead>
              <tr>
                <Th label="Lead" k="lead" sort={sort} onSort={onSort} />
                <Th label="Type" k="kind" sort={sort} onSort={onSort} />
                <Th label="Due" k="at" sort={sort} onSort={onSort} />
                <Th label="Assigned To" k="agent" sort={sort} onSort={onSort} />
                <Th label="Status" k="status" sort={sort} onSort={onSort} />
                <Th label="Notes" k="note" sort={sort} onSort={onSort} />
              </tr>
            </thead>
            <tbody>
              {rows.map((t) => {
                const isOpen = open === t.id;
                return (
                  <Fragment key={t.id}>
                    <tr onClick={() => setOpen(isOpen ? null : t.id)}>
                      <td>
                        <b>{t.name}</b>
                        <small>{t.lead ? wants(t.lead) : t.phone}</small>
                      </td>
                      <td>{t.kind}</td>
                      <td>
                        <b>{dayLabel(t.at)}</b>
                        <small className="a-time num">{timeLabel(t.at)}</small>
                      </td>
                      <td>
                        <span className="a-deal-agent">
                          <span className="a-deal-initials" aria-hidden>
                            {initials(t.agent)}
                          </span>
                          {t.agent}
                        </span>
                      </td>
                      <td>
                        <span className={`a-chip ${CHIP[t.status]}`}>{t.status}</span>
                      </td>
                      <td>
                        <small>{t.note}</small>
                      </td>
                    </tr>
                    {isOpen && (
                      <tr>
                        <td colSpan={6} className="a-deal-detail">
                          <dl className="a-kv">
                            <dt>Due</dt>
                            <dd>
                              {dayLabel(t.at)} at <span className="num">{timeLabel(t.at)}</span>
                            </dd>
                            <dt>Type</dt>
                            <dd>{t.kind}</dd>
                            <dt>Lead</dt>
                            <dd>
                              {t.name} · <span className="num">{t.phone}</span>
                            </dd>
                            {t.lead && (
                              <>
                                <dt>Wants</dt>
                                <dd>{wants(t.lead)}</dd>
                                <dt>Source</dt>
                                <dd>{t.lead.source}</dd>
                              </>
                            )}
                            <dt>Assigned To</dt>
                            <dd>{t.agent}</dd>
                            <dt>Status</dt>
                            <dd>{t.status}</dd>
                          </dl>
                          <p className="a-mut">{t.note}</p>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
              {!rows.length && (
                <tr>
                  <td colSpan={6} className="a-deal-empty">
                    No {pipe === "Due Now" ? "overdue" : pipe.toLowerCase()} follow-ups right now.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="a-cards">
          {rows.map((t) => {
            const isOpen = open === t.id;
            return (
              <button
                key={t.id}
                type="button"
                className="a-lcard a-deal-lcard"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : t.id)}
              >
                <b>
                  {dayLabel(t.at)} · <span className="num">{timeLabel(t.at)}</span>
                </b>
                <small>
                  {t.name} · {t.kind} · {t.agent}
                </small>
                <span className="a-deal-mrow">
                  <span className={`a-chip ${CHIP[t.status]}`}>{t.status}</span>
                  <span className="a-deal-mamt num">
                    {t.lead ? wants(t.lead) : t.phone}
                    <ChevronDown size={15} style={{ transform: isOpen ? "rotate(180deg)" : undefined }} />
                  </span>
                </span>
                {isOpen && <span className="a-deal-mdetail">{t.note}</span>}
              </button>
            );
          })}
          {!rows.length && <p className="a-mut">No follow-ups here right now.</p>}
        </div>

        <p className="a-mut">
          Every row here is sample data for the layout — nothing on this page is saved to your database.
        </p>
      </div>

      {showNew && <NewFollowUpModal onClose={() => setShowNew(false)} onCreate={addTask} />}
    </>
  );
}

function Th({
  label, k, sort, onSort,
}: {
  label: string;
  k: SortKey;
  sort: { key: SortKey; dir: 1 | -1 };
  onSort: (k: SortKey) => void;
}) {
  const active = sort.key === k;
  return (
    <th scope="col" aria-sort={active ? (sort.dir === 1 ? "ascending" : "descending") : "none"}>
      <button type="button" className="a-deal-sort" onClick={() => onSort(k)}>
        {label}
        {active && <ChevronDown size={12} style={{ transform: sort.dir === 1 ? "rotate(180deg)" : undefined }} />}
      </button>
    </th>
  );
}

function NewFollowUpModal({ onClose, onCreate }: { onClose: () => void; onCreate: (t: Task) => void }) {
  const [leadId, setLeadId] = useState("");
  const [kind, setKind] = useState<string>(KINDS[0] ?? "Call");
  const [due, setDue] = useState("");
  const [agent, setAgent] = useState<string>(AGENTS[0] ?? "You");
  const [note, setNote] = useState("");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const lead = leadId ? LEAD_BY_ID.get(leadId) : undefined;
  const dueSet = due.length >= 16;
  const dueNow = dueSet && new Date(due).getTime() <= Date.now();

  const submit = () => {
    if (!lead) {
      toast.error("Choose a lead first");
      return;
    }
    if (!dueSet) {
      toast.error("Set the due date and time first");
      return;
    }
    onCreate({
      id: `FU-${Date.now().toString().slice(-5)}`,
      at: due.slice(0, 16),
      leadId,
      lead: lead.name,
      phone: lead.phone,
      kind: (KINDS.includes(kind as Kind) ? kind : "Call") as Kind,
      agent,
      status: dueNow ? "Due Now" : "Upcoming",
      note: note.trim() || "No note added yet.",
    });
    onClose();
  };

  return (
    <div
      className="a-modal a-deal-modal a-fu-modal"
      role="dialog"
      aria-modal="true"
      aria-label="Add follow-up"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div>
        <div className="a-deal-head">
          <div>
            <h2 style={{ margin: 0 }}>Add follow-up</h2>
            <p className="a-note" style={{ margin: 0 }}>Pick a lead, set the next step and it lands in the queue.</p>
          </div>
          <button type="button" className="a-btn a-btn-line a-btn-sm" aria-label="Close follow-up form" onClick={onClose}>
            <X size={14} />
          </button>
        </div>

        <div className="a-deal-grid">
          <div className="a-deal-fields">
            <label className="a-deal-span">
              Lead
              <select value={leadId} onChange={(e) => setLeadId(e.target.value)} autoFocus>
                <option value="">Choose a lead…</option>
                {PICKS.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name} · {wants(l)} · {l.source}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Type
              <select value={kind} onChange={(e) => setKind(e.target.value)}>
                {KINDS.map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Assigned To
              <select value={agent} onChange={(e) => setAgent(e.target.value)}>
                {AGENTS.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </label>
            <label className="a-deal-span">
              Due date / time
              <input type="datetime-local" value={due} onChange={(e) => setDue(e.target.value)} />
            </label>
            <label className="a-deal-span">
              Notes
              <textarea
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="What needs to happen on this call, email or meeting"
              />
            </label>
          </div>

          <div className="a-deal-sum">
            <h3>Summary</h3>
            <div className="a-deal-srow">
              <span>
                Lead<em>{lead ? `${wants(lead)} · ${lead.source}` : "Pick a lead from the list"}</em>
              </span>
              <b>{lead?.name ?? "—"}</b>
            </div>
            <div className="a-deal-srow">
              <span>
                Next step<em>{agent}</em>
              </span>
              <b>{kind}</b>
            </div>
            <div className="a-deal-srow">
              <span>Due<em>{dueSet ? dayLabel(due) : "not set yet"}</em></span>
              <b className="num">{dueSet ? timeLabel(due) : "—"}</b>
            </div>
            <div className="a-deal-srow total">
              <span>
                Status<em>{dueSet ? "set from the due time" : "set a due time first"}</em>
              </span>
              <b>{dueSet ? (dueNow ? "Due Now" : "Upcoming") : "—"}</b>
            </div>
          </div>
        </div>

        <div className="a-modal-actions">
          <button type="button" className="a-btn a-btn-line" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="a-btn a-btn-gold" onClick={submit}>
            Add to queue
          </button>
        </div>
        <p className="a-mut" style={{ margin: 0 }}>
          Demo only — this puts the follow-up in the on-screen queue. Nothing is written to your database.
        </p>
      </div>
    </div>
  );
}
