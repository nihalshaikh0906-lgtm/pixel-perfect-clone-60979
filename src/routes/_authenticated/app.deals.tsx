import { createFileRoute } from "@tanstack/react-router";
import { Fragment, useMemo, useState } from "react";
import { ChevronDown, Copy, Download } from "lucide-react";
import { toast } from "sonner";

import { useShell } from "@/components/app/AppShell";
import { workspaceHead } from "@/components/app/WorkspacePlaceholder";
import { formatAed } from "@/lib/demo-leads";

export const Route = createFileRoute("/_authenticated/app/deals")({
  head: () => workspaceHead("Deals"),
  component: Page,
});

type Stage = "Token" | "Agreement" | "Completed" | "Cancelled";
type Pipe = "All" | Stage;

type Deal = {
  id: string;
  property: string;
  unit: string;
  area: string;
  buyer: string;
  source: string;
  type: "Sale" | "Rent" | "Assignment";
  amount: number;
  paid: number;
  commission: number;
  agent: string;
  stage: Stage;
  plan: string;
  next: string;
  note: string;
  updated: string;
};

const PIPE: Pipe[] = ["All", "Token", "Agreement", "Completed", "Cancelled"];
const CHIP: Record<Stage, string> = {
  Token: "c-offplan",
  Agreement: "c-warm",
  Completed: "c-ok",
  Cancelled: "c-hot",
};

// Sample pipeline — every row below is illustrative demo data, not saved anywhere.
const ROWS: Deal[] = [
  { id: "DL-1041", property: "Marina Heights", unit: "2BR", area: "Dubai Marina", buyer: "Rania Haddad", source: "via Bayut", type: "Sale", amount: 2450000, paid: 245000, commission: 49000, agent: "Saad", stage: "Token", plan: "10 / 40 / 50", next: "40% due on SPA signature", note: "Buyer is waiting on mortgage pre-approval.", updated: "Thu 8 Oct" },
  { id: "DL-1042", property: "Verdana III", unit: "1BR", area: "JVC", buyer: "Faisal Al Menhali", source: "WhatsApp referral", type: "Sale", amount: 1180000, paid: 118000, commission: 23600, agent: "Aisha", stage: "Token", plan: "20 / 30 / 50", next: "Second 20% due 1 Dec 2026", note: "Asked for the 10 / 30 / 60 plan; developer confirmation pending.", updated: "Fri 9 Oct" },
  { id: "DL-1043", property: "Creek Horizon", unit: "3BR", area: "Dubai Creek Harbour", buyer: "Priya Nair", source: "via Property Finder", type: "Sale", amount: 3240000, paid: 324000, commission: 64800, agent: "Omar", stage: "Token", plan: "15 / 35 / 50", next: "35% due at slab completion", note: "Two units shortlisted; comparing against Dubai Hills.", updated: "Wed 7 Oct" },
  { id: "DL-1044", property: "Marina Star", unit: "Studio", area: "Dubai Marina", buyer: "Tomás Ferreira", source: "via Dubizzle", type: "Assignment", amount: 1610000, paid: 161000, commission: 32200, agent: "Priya", stage: "Token", plan: "Seller funded", next: "NOC requested from the developer", note: "Assignment fee split agreed with the seller's agent.", updated: "Mon 5 Oct" },
  { id: "DL-1035", property: "Reportage Hills", unit: "3BR", area: "Dubai Hills Estate", buyer: "Elena Petrova", source: "Client referral", type: "Sale", amount: 3860000, paid: 1158000, commission: 77200, agent: "Saad", stage: "Agreement", plan: "30 / 40 / 30", next: "40% due at handover, Q1 2027", note: "SPA drafted by the developer; buyer's lawyer is reviewing.", updated: "Thu 8 Oct" },
  { id: "DL-1036", property: "Downtown Vista", unit: "2BR", area: "Downtown Dubai", buyer: "Amira Salem", source: "via Meta Ads", type: "Sale", amount: 4120000, paid: 824000, commission: 82400, agent: "Aisha", stage: "Agreement", plan: "20 / 50 / 30", next: "Signature appointment Sat 11 Oct", note: "Buyer asked for a 30-day handover delay.", updated: "Fri 9 Oct" },
  { id: "DL-1037", property: "Palm Reserve", unit: "4BR", area: "Palm Jumeirah", buyer: "Khalid Al Suwaidi", source: "Client referral", type: "Sale", amount: 9450000, paid: 2835000, commission: 189000, agent: "Omar", stage: "Agreement", plan: "30 / 30 / 40", next: "Balance due at transfer", note: "Title deed check in progress with the developer.", updated: "Tue 6 Oct" },
  { id: "DL-1038", property: "Business Yard", unit: "1BR", area: "Business Bay", buyer: "Grace Okafor", source: "via Website", type: "Sale", amount: 1480000, paid: 296000, commission: 29600, agent: "Priya", stage: "Agreement", plan: "20 / 40 / 40", next: "40% due at key handover", note: "Mortgage valuation booked for 14 Oct.", updated: "Wed 7 Oct" },
  { id: "DL-1021", property: "Marina Star", unit: "Studio", area: "Dubai Marina", buyer: "Jonah Reyes", source: "WhatsApp", type: "Rent", amount: 96000, paid: 96000, commission: 9600, agent: "Priya", stage: "Completed", plan: "Annual, one cheque", next: "Renewal reminder in 12 months", note: "Tenant moved in; Ejari filed.", updated: "Fri 2 Oct" },
  { id: "DL-1022", property: "Arjan Gate", unit: "2BR", area: "Arjan", buyer: "Sofia Duarte", source: "via Bayut", type: "Rent", amount: 132000, paid: 132000, commission: 13200, agent: "Aisha", stage: "Completed", plan: "Two cheques", next: "Renewal notice 60 days out", note: "Commission split 50/50 with the landlord's agent.", updated: "Thu 1 Oct" },
  { id: "DL-1023", property: "JVC Parkside", unit: "3BR", area: "JVC", buyer: "Daniel Okonkwo", source: "Client referral", type: "Sale", amount: 2260000, paid: 2260000, commission: 45200, agent: "Saad", stage: "Completed", plan: "Cash, full transfer", next: "Transfer completed at the land department", note: "Seller's NOC and clearance letter filed.", updated: "Mon 29 Sep" },
  { id: "DL-1024", property: "Hills Walk", unit: "2BR", area: "Dubai Hills Estate", buyer: "Mei Lin Chen", source: "via Property Finder", type: "Sale", amount: 2890000, paid: 2890000, commission: 57800, agent: "Omar", stage: "Completed", plan: "Cash, full transfer", next: "Title deed issued in the buyer's name", note: "Buyer also asked for a rental valuation.", updated: "Sat 27 Sep" },
  { id: "DL-1011", property: "Marina Heights", unit: "1BR", area: "Dubai Marina", buyer: "Victor Ilyin", source: "via Meta Ads", type: "Sale", amount: 1720000, paid: 0, commission: 0, agent: "Aisha", stage: "Cancelled", plan: "10 / 40 / 50", next: "No next milestone", note: "Token refunded after financing was declined.", updated: "Tue 30 Sep" },
  { id: "DL-1012", property: "Creek Horizon", unit: "2BR", area: "Dubai Creek Harbour", buyer: "Hana Yoshida", source: "via Website", type: "Sale", amount: 2050000, paid: 0, commission: 0, agent: "Saad", stage: "Cancelled", plan: "15 / 35 / 50", next: "No next milestone", note: "Buyer went with a competing launch; keep warm for the next phase.", updated: "Sun 28 Sep" },
];

type SortKey = "property" | "buyer" | "type" | "amount" | "paid" | "balance" | "commission" | "agent" | "stage";
const TEXT_KEYS: SortKey[] = ["property", "buyer", "type", "agent", "stage"];

const sortValue = (d: Deal, k: SortKey): string | number => {
  if (k === "balance") return d.amount - d.paid;
  if (k === "stage") return PIPE.indexOf(d.stage);
  return d[k];
};

const initials = (n: string) =>
  n.split(/\s+/).map((p) => p[0]).join("").slice(0, 2).toUpperCase();

const csvCell = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;

function Page() {
  const { clientMode } = useShell();
  const [pipe, setPipe] = useState<Pipe>("All");
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 }>({ key: "amount", dir: -1 });
  const [open, setOpen] = useState<string | null>(null);

  const rows = useMemo(() => {
    const filtered = pipe === "All" ? ROWS : ROWS.filter((d) => d.stage === pipe);
    return [...filtered].sort((a, b) => {
      const av = sortValue(a, sort.key);
      const bv = sortValue(b, sort.key);
      const cmp = typeof av === "number" && typeof bv === "number" ? av - bv : String(av).localeCompare(String(bv));
      return cmp * sort.dir;
    });
  }, [pipe, sort]);

  const count = (p: Pipe) => (p === "All" ? ROWS.length : ROWS.filter((d) => d.stage === p).length);
  const total = (pick: (d: Deal) => number) => rows.reduce((s, d) => s + pick(d), 0);
  const onSort = (key: SortKey) =>
    setSort((s) =>
      s.key === key
        ? { key, dir: s.dir === 1 ? -1 : 1 }
        : { key, dir: TEXT_KEYS.includes(key) ? 1 : -1 },
    );

  const copyDeal = async (d: Deal) => {
    const line = `${d.property} (${d.unit}, ${d.area}) — ${d.buyer} · ${d.type} · ${formatAed(d.amount)} · paid ${formatAed(d.paid)} · balance ${formatAed(d.amount - d.paid)} · ${d.stage}`;
    try {
      await navigator.clipboard.writeText(line);
      toast.success("Deal summary copied");
    } catch {
      toast.error("Your browser blocked clipboard access");
    }
  };

  const exportCsv = () => {
    const head = ["Deal", "Property", "Unit", "Area", "Buyer", "Type", "Amount", "Paid", "Balance", "Commission", "Agent", "Status"];
    const lines = [head.map(csvCell).join(",")].concat(
      rows.map((d) =>
        [d.id, d.property, d.unit, d.area, d.buyer, d.type, d.amount, d.paid, d.amount - d.paid, d.commission, d.agent, d.stage]
          .map(csvCell)
          .join(","),
      ),
    );
    const url = URL.createObjectURL(new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "dealos-deals-sample.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Sample deals exported");
  };

  const cols = clientMode ? 9 : 10;

  return (
    <>
      <section className="a-band a-fade">
        <div>
          <p className="eyebrow-a">Money</p>
          <h1>Deals</h1>
          <p className="sub">Token, agreement and completion across your pipeline.</p>
        </div>
        <div className="a-band-actions">
          <span className="a-chip c-stage">Sample pipeline — demo records</span>
          <button type="button" className="a-btn a-btn-line" onClick={exportCsv}>
            <Download size={16} /> Export CSV
          </button>
        </div>
      </section>

      <div className="a-card a-fade">
        <div className="a-card-head">
          <h2>Deal pipeline</h2>
          <span className="a-note num">
            {formatAed(total((d) => d.amount))} across {rows.length} deals · {formatAed(total((d) => d.paid))} collected
          </span>
        </div>
        <div className="a-pipe" role="tablist" aria-label="Deal status">
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
          <h2>{pipe === "All" ? "All deals" : `${pipe} deals`}</h2>
          <span className="a-count num">{rows.length} deals</span>
        </div>

        <div className="a-table-wrap">
          <table className="a-table a-deal-table">
            <thead>
              <tr>
                <Th label="Property" k="property" sort={sort} onSort={onSort} />
                <Th label="Buyer" k="buyer" sort={sort} onSort={onSort} />
                <Th label="Type" k="type" sort={sort} onSort={onSort} />
                <Th label="Amount" k="amount" sort={sort} onSort={onSort} num />
                <Th label="Paid" k="paid" sort={sort} onSort={onSort} num />
                <Th label="Balance" k="balance" sort={sort} onSort={onSort} num />
                {!clientMode && <Th label="Commission" k="commission" sort={sort} onSort={onSort} num />}
                <Th label="Agent" k="agent" sort={sort} onSort={onSort} />
                <Th label="Status" k="stage" sort={sort} onSort={onSort} />
                <th scope="col" className="a-deal-num">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((d) => {
                const balance = d.amount - d.paid;
                const isOpen = open === d.id;
                return (
                  <Fragment key={d.id}>
                    <tr onClick={() => setOpen(isOpen ? null : d.id)}>
                      <td>
                        <b>{d.property}</b>
                        <small>{d.unit} · {d.area}</small>
                      </td>
                      <td>
                        <b>{d.buyer}</b>
                        <small>{d.source}</small>
                      </td>
                      <td>{d.type}</td>
                      <td className="a-deal-num num">{formatAed(d.amount)}</td>
                      <td className="a-deal-num num">{formatAed(d.paid)}</td>
                      <td className="a-deal-num num">{formatAed(balance)}</td>
                      {!clientMode && <td className="a-deal-num num">{formatAed(d.commission)}</td>}
                      <td>
                        <span className="a-deal-agent">
                          <span className="a-deal-initials" aria-hidden>{initials(d.agent)}</span>
                          {d.agent}
                        </span>
                      </td>
                      <td><span className={`a-chip ${CHIP[d.stage]}`}>{d.stage}</span></td>
                      <td className="a-deal-num">
                        <span className="a-deal-acts" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            className="a-btn a-btn-line a-btn-sm"
                            aria-label={isOpen ? `Hide details for ${d.property}` : `Show details for ${d.property}`}
                            aria-expanded={isOpen}
                            onClick={() => setOpen(isOpen ? null : d.id)}
                          >
                            {isOpen ? <ChevronDown size={14} style={{ transform: "rotate(180deg)" }} /> : <ChevronDown size={14} />}
                          </button>
                          <button
                            type="button"
                            className="a-btn a-btn-line a-btn-sm"
                            aria-label={`Copy summary for ${d.property}`}
                            onClick={() => void copyDeal(d)}
                          >
                            <Copy size={14} />
                          </button>
                        </span>
                      </td>
                    </tr>
                    {isOpen && (
                      <tr>
                        <td colSpan={cols} className="a-deal-detail">
                          <dl className="a-kv">
                            <dt>Payment plan</dt><dd>{d.plan}</dd>
                            <dt>Next milestone</dt><dd>{d.next}</dd>
                            <dt>Balance</dt><dd className="num">{formatAed(balance)}</dd>
                            {!clientMode && <><dt>Commission</dt><dd className="num">{formatAed(d.commission)}</dd></>}
                            <dt>Updated</dt><dd>{d.updated}</dd>
                          </dl>
                          <p className="a-mut">{d.note}</p>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
              {!rows.length && (
                <tr>
                  <td colSpan={cols} className="a-deal-empty">No {pipe.toLowerCase()} deals right now.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="a-cards">
          {rows.map((d) => {
            const balance = d.amount - d.paid;
            const isOpen = open === d.id;
            return (
              <button type="button" key={d.id} className="a-lcard" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : d.id)}>
                <b>{d.property}</b>
                <small>{d.unit} · {d.area} · {d.buyer}</small>
                <span className="a-deal-mrow">
                  <span className={`a-chip ${CHIP[d.stage]}`}>{d.stage}</span>
                  <span className="num">{formatAed(d.amount)}</span>
                </span>
                {isOpen && (
                  <span className="a-deal-mdetail">
                    Plan {d.plan} · paid {formatAed(d.paid)} · balance {formatAed(balance)} · {d.next}
                  </span>
                )}
              </button>
            );
          })}
          {!rows.length && <p className="a-mut">No {pipe.toLowerCase()} deals right now.</p>}
        </div>

        <p className="a-mut">
          Every row here is sample data for the layout — nothing on this page is saved to your database.{" "}
          {clientMode ? "Commission is hidden while client mode is on." : "Switch on client mode in the top bar to hide commission."}
        </p>
      </div>
    </>
  );
}

function Th({
  label, k, sort, onSort, num,
}: {
  label: string;
  k: SortKey;
  sort: { key: SortKey; dir: 1 | -1 };
  onSort: (k: SortKey) => void;
  num?: boolean;
}) {
  const active = sort.key === k;
  return (
    <th
      scope="col"
      className={num ? "a-deal-num" : undefined}
      aria-sort={active ? (sort.dir === 1 ? "ascending" : "descending") : "none"}
    >
      <button type="button" className="a-deal-sort" onClick={() => onSort(k)}>
        {label}
        {active && <ChevronDown size={12} style={{ transform: sort.dir === 1 ? "rotate(180deg)" : undefined }} />}
      </button>
    </th>
  );
}
