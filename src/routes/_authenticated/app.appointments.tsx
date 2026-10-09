import { createFileRoute } from "@tanstack/react-router";
import { Fragment, useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";

import { workspaceHead } from "@/components/app/WorkspacePlaceholder";
import { LEAD_BY_ID, formatAed, wants, type Lead } from "@/lib/demo-leads";

export const Route = createFileRoute("/_authenticated/app/appointments")({
  head: () => workspaceHead("Appointments"),
  component: Page,
});

type Status = "Scheduled" | "Confirmed" | "Completed" | "Cancelled" | "No Show";
type Pipe = "All" | Status;
type Kind = "Viewing" | "Site visit" | "Call" | "Offer meeting" | "Handover";

type Appt = {
  id: string;
  at: string; // ISO, used only for sorting
  leadId: string;
  lead: string; // fallback name if the demo lead is missing
  phone: string; // fallback phone
  property: string;
  unit: string;
  area: string;
  kind: Kind;
  agent: string;
  status: Status;
  note: string;
};

const PIPE: Pipe[] = ["All", "Scheduled", "Confirmed", "Completed", "Cancelled", "No Show"];

const CHIP: Record<Status, string> = {
  Scheduled: "c-offplan",
  Confirmed: "c-warm",
  Completed: "c-ok",
  Cancelled: "c-hot",
  "No Show": "c-cold",
};

// Sample diary — every row below is illustrative demo data, not saved anywhere.
const ROWS: Appt[] = [
  { id: "AP-3011", at: "2026-10-06T11:00", leadId: "L-1087", lead: "Zara D.", phone: "+971 54 168 1086", property: "Palm Reserve", unit: "4BR", area: "Palm Jumeirah", kind: "Viewing", agent: "Saad", status: "Completed", note: "Viewed two units; asked for the service charge sheet before deciding." },
  { id: "AP-3012", at: "2026-10-07T13:00", leadId: "L-1131", lead: "Priya T.", phone: "+971 57 409 1130", property: "JVC Parkside", unit: "3BR", area: "JVC", kind: "Call", agent: "Priya", status: "Cancelled", note: "Called to say the unit was taken by a colleague; keep on the next launch list." },
  { id: "AP-3013", at: "2026-10-07T16:30", leadId: "L-1449", lead: "Elena D.", phone: "+971 55 496 1448", property: "Business Yard", unit: "1BR", area: "Business Bay", kind: "Site visit", agent: "Aisha", status: "No Show", note: "Site office was reached but the client turned back in traffic; needs a new slot." },
  { id: "AP-3014", at: "2026-10-08T10:30", leadId: "L-1460", lead: "Giulia H.", phone: "+971 54 449 1459", property: "Arjan Gate", unit: "2BR", area: "Arjan", kind: "Offer meeting", agent: "Omar", status: "Completed", note: "Offer discussed with the seller's agent; written answer expected today." },
  { id: "AP-3021", at: "2026-10-09T10:00", leadId: "L-1052", lead: "Omar F.", phone: "+971 54 267 1051", property: "Marina Heights", unit: "2BR", area: "Dubai Marina", kind: "Viewing", agent: "Saad", status: "Confirmed", note: "Show apartment first, then the stack view; parking arranged for two cars." },
  { id: "AP-3022", at: "2026-10-09T12:30", leadId: "L-1507", lead: "Kenji V.", phone: "+971 55 649 1506", property: "Creek Horizon", unit: "3BR", area: "Dubai Creek Harbour", kind: "Site visit", agent: "Aisha", status: "Confirmed", note: "Wants to see the slab progress and the handover schedule with the site engineer." },
  { id: "AP-3023", at: "2026-10-09T15:00", leadId: "L-1572", lead: "Sara F.", phone: "+971 56 920 1571", property: "Verdana III", unit: "1BR", area: "JVC", kind: "Call", agent: "Priya", status: "Scheduled", note: "Walk through the payment plan on the call; brochure already sent." },
  { id: "AP-3024", at: "2026-10-09T17:30", leadId: "L-1480", lead: "Daniel H.", phone: "+971 51 306 1479", property: "Palm Reserve", unit: "4BR", area: "Palm Jumeirah", kind: "Viewing", agent: "Omar", status: "Scheduled", note: "Evening viewing so the partner can join; both units shortlisted." },
  { id: "AP-3031", at: "2026-10-10T11:30", leadId: "L-1371", lead: "Rahul M.", phone: "+971 54 721 1370", property: "Hills Walk", unit: "2BR", area: "Dubai Hills Estate", kind: "Viewing", agent: "Saad", status: "Scheduled", note: "Comparing against one rival project; wants the community map on the visit." },
  { id: "AP-3032", at: "2026-10-10T14:00", leadId: "L-1064", lead: "Lukas A.", phone: "+971 55 112 1063", property: "Business Yard", unit: "1BR", area: "Business Bay", kind: "Site visit", agent: "Aisha", status: "Confirmed", note: "Site visit then a coffee at the sales centre to agree the next step." },
  { id: "AP-3033", at: "2026-10-11T09:30", leadId: "L-1065", lead: "Hana B.", phone: "+971 55 276 1064", property: "Verdana III", unit: "1BR", area: "JVC", kind: "Viewing", agent: "Priya", status: "Scheduled", note: "Weekend slot chosen by the client; father is joining to decide." },
  { id: "AP-3034", at: "2026-10-12T13:15", leadId: "L-1522", lead: "Noor L.", phone: "+971 50 326 1521", property: "JVC Parkside", unit: "3BR", area: "JVC", kind: "Viewing", agent: "Omar", status: "Scheduled", note: "Tenant-occupied unit — current occupier has been told to keep the slot." },
  { id: "AP-3035", at: "2026-10-13T10:00", leadId: "L-1897", lead: "Mei B.", phone: "+971 50 544 1896", property: "Palm Reserve", unit: "4BR", area: "Palm Jumeirah", kind: "Offer meeting", agent: "Aisha", status: "Scheduled", note: "Bring the seller's latest position and the transfer timeline." },
  { id: "AP-3036", at: "2026-10-13T16:00", leadId: "L-1219", lead: "Fatima A.", phone: "+971 50 459 1218", property: "Arjan Gate", unit: "2BR", area: "Arjan", kind: "Handover", agent: "Saad", status: "Scheduled", note: "Key handover and snag list; developer's handover engineer attending." },
];

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

type SortKey = "at" | "lead" | "property" | "agent" | "status" | "note";
const TEXT_KEYS: SortKey[] = ["lead", "property", "agent", "status", "note"];

function Page() {
  const [pipe, setPipe] = useState<Pipe>("All");
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 }>({ key: "at", dir: 1 });
  const [open, setOpen] = useState<string | null>(null);
  const [date, setDate] = useState<Date>();
  const selectedDay = date ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}` : undefined;

  // Demo lead records back the diary rows: name, phone and what the client asked for.
  const ALL = useMemo(
    () =>
      ROWS.map((a) => {
        const l: Lead | undefined = LEAD_BY_ID.get(a.leadId);
        return { ...a, name: l?.name ?? a.lead, phone: l?.phone ?? a.phone, lead: l };
      }),
    [],
  );

  const sortValue = (a: (typeof ALL)[number], k: SortKey): string | number => {
    if (k === "at") return a.at;
    if (k === "status") return PIPE.indexOf(a.status);
    if (k === "lead") return a.name;
    return a[k];
  };

  const rows = useMemo(() => {
    const filtered = ALL.filter((a) => (pipe === "All" || a.status === pipe) && (!selectedDay || a.at.slice(0, 10) === selectedDay));
    return [...filtered].sort((x, y) => {
      const av = sortValue(x, sort.key);
      const bv = sortValue(y, sort.key);
      const cmp = typeof av === "number" && typeof bv === "number" ? av - bv : String(av).localeCompare(String(bv));
      return cmp * sort.dir;
    });
  }, [pipe, sort, ALL, selectedDay]);

  const count = (p: Pipe) => (p === "All" ? ALL.length : ALL.filter((a) => a.status === p).length);
  const ahead = ALL.filter((a) => a.status === "Scheduled" || a.status === "Confirmed").length;
  const today = ALL.filter((a) => a.at.slice(0, 10) === "2026-10-09").length;
  const onSort = (key: SortKey) =>
    setSort((s) =>
      s.key === key ? { key, dir: s.dir === 1 ? -1 : 1 } : { key, dir: TEXT_KEYS.includes(key) ? 1 : -1 },
    );

  const emptyLabel = pipe === "No Show" ? "no-show" : pipe.toLowerCase();

  return (
    <>
      <section className="a-band a-fade">
        <div>
          <p className="eyebrow-a">CRM</p>
          <h1>Appointments</h1>
          <p className="sub">Viewings, site visits, calls and handovers in one diary.</p>
        </div>
        <div className="a-band-actions">
          <span className="a-chip c-stage">Sample diary — demo records</span>
          <span className="a-chip c-offplan">
            {today} today · {ahead} still ahead
          </span>
        </div>
      </section>

      <div className="a-card a-fade">
        <div className="a-card-head">
          <h2>Appointment status</h2>
          <span className="a-note num">
            {ALL.length} appointments · {count("Scheduled")} scheduled · {count("Confirmed")} confirmed · {count("No Show")} no-show
          </span>
        </div>
        <div className="a-pipe" role="tablist" aria-label="Appointment status">
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

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
        <aside className="a-card min-w-0">
          <div className="a-card-head"><h2>Calendar</h2></div>
          <Calendar
            mode="single"
            selected={date}
            onSelect={(value) => { setDate(value); setOpen(null); }}
            defaultMonth={new Date(2026, 9, 1)}
            className="pointer-events-auto mx-auto max-w-full bg-transparent text-[var(--a-ink)]"
          />
          {selectedDay ? <div className="mt-4 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2"><span className="a-note min-w-0">{dayLabel(selectedDay)}</span><Button variant="outline" className="a-btn a-btn-line shrink-0" onClick={() => { setDate(undefined); setOpen(null); }}>All dates</Button></div> : null}
        </aside>
      <div className="a-card min-w-0 lg:col-span-2">
        <div className="a-card-head">
          <h2>{pipe === "All" ? "All appointments" : `${pipe} appointments`}</h2>
          <span className="a-count num">{rows.length} appointments</span>
        </div>

        <div className="a-table-wrap">
          <table className="a-table a-deal-table">
            <thead>
              <tr>
                <Th label="Date/Time" k="at" sort={sort} onSort={onSort} />
                <Th label="Lead" k="lead" sort={sort} onSort={onSort} />
                <Th label="Property" k="property" sort={sort} onSort={onSort} />
                <Th label="Agent" k="agent" sort={sort} onSort={onSort} />
                <Th label="Status" k="status" sort={sort} onSort={onSort} />
                <Th label="Notes" k="note" sort={sort} onSort={onSort} />
              </tr>
            </thead>
            <tbody>
              {rows.map((a) => {
                const isOpen = open === a.id;
                return (
                  <Fragment key={a.id}>
                    <tr onClick={() => setOpen(isOpen ? null : a.id)}>
                      <td>
                        <b>{dayLabel(a.at)}</b>
                        <small className="a-time num">{timeLabel(a.at)}</small>
                      </td>
                      <td>
                        <b>{a.name}</b>
                        <small>{a.kind}</small>
                      </td>
                      <td>
                        <b>{a.property}</b>
                        <small>
                          {a.unit} · {a.area}
                        </small>
                      </td>
                      <td>
                        <span className="a-deal-agent">
                          <span className="a-deal-initials" aria-hidden>
                            {initials(a.agent)}
                          </span>
                          {a.agent}
                        </span>
                      </td>
                      <td>
                        <span className={`a-chip ${CHIP[a.status]}`}>{a.status}</span>
                      </td>
                      <td>
                        <small>{a.note}</small>
                      </td>
                    </tr>
                    {isOpen && (
                      <tr>
                        <td colSpan={6} className="a-deal-detail">
                          <dl className="a-kv">
                            <dt>Scheduled</dt>
                            <dd>
                              {dayLabel(a.at)} at <span className="num">{timeLabel(a.at)}</span>
                            </dd>
                            <dt>Appointment</dt>
                            <dd>{a.kind}</dd>
                            <dt>Lead</dt>
                            <dd>
                              {a.name} · <span className="num">{a.phone}</span>
                            </dd>
                            {a.lead && (
                              <>
                                <dt>Wants</dt>
                                <dd>
                                  {wants(a.lead)} · budget <span className="num">{formatAed(a.lead.budget)}</span>
                                </dd>
                                <dt>Source</dt>
                                <dd>{a.lead.source}</dd>
                              </>
                            )}
                            <dt>Property</dt>
                            <dd>
                              {a.property} · {a.unit} · {a.area}
                            </dd>
                            <dt>Agent</dt>
                            <dd>{a.agent}</dd>
                            <dt>Status</dt>
                            <dd>{a.status}</dd>
                          </dl>
                          <p className="a-mut">{a.note}</p>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
              {!rows.length && (
                <tr>
                  <td colSpan={6} className="a-deal-empty">
                    No {emptyLabel} appointments{selectedDay ? " on this date" : " right now"}.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="a-cards">
          {rows.map((a) => {
            const isOpen = open === a.id;
            return (
              <button
                key={a.id}
                type="button"
                className="a-lcard a-deal-lcard"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : a.id)}
              >
                <b>
                  {dayLabel(a.at)} · <span className="num">{timeLabel(a.at)}</span>
                </b>
                <small>
                  {a.name} · {a.property} {a.unit} · {a.agent}
                </small>
                <span className="a-deal-mrow">
                  <span className={`a-chip ${CHIP[a.status]}`}>{a.status}</span>
                  <span className="a-deal-mamt num">
                    {a.kind}
                    <ChevronDown size={15} style={{ transform: isOpen ? "rotate(180deg)" : undefined }} />
                  </span>
                </span>
                {isOpen && <span className="a-deal-mdetail">{a.note}</span>}
              </button>
            );
          })}
          {!rows.length && <p className="a-mut">No {emptyLabel} appointments{selectedDay ? " on this date" : " right now"}.</p>}
        </div>

        <p className="a-mut">
          Every row here is sample data for the layout — nothing on this page is saved to your database.
        </p>
      </div>
      </div>
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
    <th
      scope="col"
      aria-sort={active ? (sort.dir === 1 ? "ascending" : "descending") : "none"}
    >
      <button type="button" className="a-deal-sort" onClick={() => onSort(k)}>
        {label}
        {active && <ChevronDown size={12} style={{ transform: sort.dir === 1 ? "rotate(180deg)" : undefined }} />}
      </button>
    </th>
  );
}
