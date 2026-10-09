import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Copy, Download, Eye, FileSignature, FileText, Printer, X } from "lucide-react";
import { toast } from "sonner";


import { workspaceHead } from "@/components/app/WorkspacePlaceholder";

export const Route = createFileRoute("/_authenticated/app/agreements")({
  head: () => workspaceHead("Agreements"),
  component: Page,
});

type DocType = "Rental Agreement" | "Sale Agreement" | "Payment Receipt";
type Status = "Draft" | "Issued" | "Signed";

const TYPES: DocType[] = ["Rental Agreement", "Sale Agreement", "Payment Receipt"];

const CHIP: Record<Status, string> = {
  Draft: "c-cold",
  Issued: "c-offplan",
  Signed: "c-ok",
};

type Doc = {
  id: string;
  ref: string;
  type: DocType;
  title: string;
  party: string;
  headline: string;
  agent: string;
  status: Status;
  date: string;
  terms: [string, string][];
  clauses: string[];
};

// Boilerplate clause sets — placeholder wording, not legal text.
const CLAUSES: Record<DocType, string[]> = {
  "Rental Agreement": [
    "The tenancy runs for the term shown above from the date the keys are handed over.",
    "Rent is payable in the cheques recorded; a bounced cheque is a breach of this agreement.",
    "The landlord registers the contract with Ejari and covers service charges and structural maintenance.",
    "The tenant keeps the property in the condition received and returns it at the end of the term.",
  ],
  "Sale Agreement": [
    "The seller confirms clear title and provides a NOC where the developer requires one.",
    "The buyer pays each tranche on the milestone dates in the payment plan recorded above.",
    "DLD transfer fees, agency commission and any mortgage costs are settled at the transfer appointment.",
    "Either party may withdraw in writing if the other misses a milestone by more than 30 days.",
  ],
  "Payment Receipt": [
    "This receipt confirms funds received against the deal recorded above; it is not a transfer of ownership.",
    "Funds are held pending the transfer appointment at the Dubai Land Department.",
    "The balance shown stays payable on the milestone dates in the payment plan.",
    "The payer should keep this receipt with the title deed documents.",
  ],
};

// Sample documents — every row below is illustrative demo data, not saved anywhere.
const ROWS: Doc[] = [
  {
    id: "AG-1021",
    ref: "RA-1021",
    type: "Rental Agreement",
    title: "Rental Agreement — Marina Star Studio",
    party: "Jonah Reyes",
    headline: "AED 96,000 / year",
    agent: "Priya",
    status: "Signed",
    date: "Fri 2 Oct",
    terms: [
      ["Landlord", "Owner of record (title deed on file)"],
      ["Tenant", "Jonah Reyes"],
      ["Property", "Marina Star · Studio"],
      ["Area", "Dubai Marina"],
      ["Annual rent", "AED 96,000"],
      ["Payment", "Annual, one cheque"],
      ["Term", "12 months"],
      ["Security deposit", "As agreed with the landlord"],
      ["Ejari", "Filed"],
      ["Handling agent", "Priya"],
    ],
    clauses: CLAUSES["Rental Agreement"],
  },
  {
    id: "AG-1036",
    ref: "SA-1036",
    type: "Sale Agreement",
    title: "Sale Agreement — Downtown Vista",
    party: "Amira Salem",
    headline: "AED 4,120,000",
    agent: "Aisha",
    status: "Draft",
    date: "Fri 9 Oct",
    terms: [
      ["Seller", "Owner of record (title deed on file)"],
      ["Buyer", "Amira Salem"],
      ["Property", "Downtown Vista · 2BR"],
      ["Area", "Downtown Dubai"],
      ["Price", "AED 4,120,000"],
      ["Deposit paid", "AED 824,000 (20%)"],
      ["Balance", "AED 3,296,000"],
      ["Payment plan", "20 / 50 / 30"],
      ["Commission", "AED 82,400"],
      ["Next step", "Signature appointment Sat 11 Oct"],
      ["Handling agent", "Aisha"],
    ],
    clauses: CLAUSES["Sale Agreement"],
  },
  {
    id: "AG-1037",
    ref: "PR-1037",
    type: "Payment Receipt",
    title: "Payment Receipt — Palm Reserve",
    party: "Khalid Al Suwaidi",
    headline: "AED 2,835,000 received",
    agent: "Omar",
    status: "Issued",
    date: "Tue 6 Oct",
    terms: [
      ["Received from", "Khalid Al Suwaidi"],
      ["For", "Palm Reserve · 4BR"],
      ["Area", "Palm Jumeirah"],
      ["Amount received", "AED 2,835,000"],
      ["Against price", "AED 9,450,000"],
      ["Stage", "30% token"],
      ["Balance", "AED 6,615,000"],
      ["Method", "Bank transfer"],
      ["Received by", "Omar"],
    ],
    clauses: CLAUSES["Payment Receipt"],
  },
];

// Records the Generate button drafts from — same figures as the Deals pipeline.
const POOL: Omit<Doc, "id" | "status" | "date">[] = [
  {
    ref: "SA-1035",
    type: "Sale Agreement",
    title: "Sale Agreement — Reportage Hills",
    party: "Elena Petrova",
    headline: "AED 3,860,000",
    agent: "Saad",
    terms: [
      ["Seller", "Owner of record (title deed on file)"],
      ["Buyer", "Elena Petrova"],
      ["Property", "Reportage Hills · 3BR"],
      ["Area", "Dubai Hills Estate"],
      ["Price", "AED 3,860,000"],
      ["Deposit paid", "AED 1,158,000 (30%)"],
      ["Balance", "AED 2,702,000"],
      ["Payment plan", "30 / 40 / 30"],
      ["Commission", "AED 77,200"],
      ["Next step", "40% due at handover, Q1 2027"],
      ["Handling agent", "Saad"],
    ],
    clauses: CLAUSES["Sale Agreement"],
  },
  {
    ref: "SA-1038",
    type: "Sale Agreement",
    title: "Sale Agreement — Business Yard",
    party: "Grace Okafor",
    headline: "AED 1,480,000",
    agent: "Priya",
    terms: [
      ["Seller", "Owner of record (title deed on file)"],
      ["Buyer", "Grace Okafor"],
      ["Property", "Business Yard · 1BR"],
      ["Area", "Business Bay"],
      ["Price", "AED 1,480,000"],
      ["Deposit paid", "AED 296,000 (20%)"],
      ["Balance", "AED 1,184,000"],
      ["Payment plan", "20 / 40 / 40"],
      ["Commission", "AED 29,600"],
      ["Next step", "40% due at key handover"],
      ["Handling agent", "Priya"],
    ],
    clauses: CLAUSES["Sale Agreement"],
  },
  {
    ref: "RA-1022",
    type: "Rental Agreement",
    title: "Rental Agreement — Arjan Gate",
    party: "Sofia Duarte",
    headline: "AED 132,000 / year",
    agent: "Aisha",
    terms: [
      ["Landlord", "Owner of record (title deed on file)"],
      ["Tenant", "Sofia Duarte"],
      ["Property", "Arjan Gate · 2BR"],
      ["Area", "Arjan"],
      ["Annual rent", "AED 132,000"],
      ["Payment", "Two cheques"],
      ["Term", "12 months"],
      ["Security deposit", "As agreed with the landlord"],
      ["Ejari", "To be filed by the landlord"],
      ["Handling agent", "Aisha"],
    ],
    clauses: CLAUSES["Rental Agreement"],
  },
  {
    ref: "PR-1041",
    type: "Payment Receipt",
    title: "Payment Receipt — Marina Heights",
    party: "Rania Haddad",
    headline: "AED 245,000 received",
    agent: "Saad",
    terms: [
      ["Received from", "Rania Haddad"],
      ["For", "Marina Heights · 2BR"],
      ["Area", "Dubai Marina"],
      ["Amount received", "AED 245,000"],
      ["Against price", "AED 2,450,000"],
      ["Stage", "10% token"],
      ["Balance", "AED 2,205,000"],
      ["Method", "Bank transfer"],
      ["Received by", "Saad"],
    ],
    clauses: CLAUSES["Payment Receipt"],
  },
  {
    ref: "PR-1042",
    type: "Payment Receipt",
    title: "Payment Receipt — Verdana III",
    party: "Faisal Al Menhali",
    headline: "AED 118,000 received",
    agent: "Aisha",
    terms: [
      ["Received from", "Faisal Al Menhali"],
      ["For", "Verdana III · 1BR"],
      ["Area", "JVC"],
      ["Amount received", "AED 118,000"],
      ["Against price", "AED 1,180,000"],
      ["Stage", "10% token"],
      ["Balance", "AED 1,062,000"],
      ["Method", "Bank transfer"],
      ["Received by", "Aisha"],
    ],
    clauses: CLAUSES["Payment Receipt"],
  },
];

const WDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// UTC maths so the label never disagrees between the server and the browser.
function todayLabel(): string {
  const d = new Date();
  return `${WDAYS[d.getUTCDay()] ?? ""} ${d.getUTCDate()} ${MONTHS[d.getUTCMonth()] ?? ""}`.trim();
}

const isMoney = (v: string) => /^AED [\d,]+$/.test(v);

function asText(doc: Doc): string {
  return [
    `DealOS CRM — ${doc.type}`,
    `${doc.title} · ${doc.ref} · ${doc.date}`,
    "",
    ...doc.terms.map(([k, v]) => `${k}: ${v}`),
    "",
    "Terms",
    ...doc.clauses.map((c, i) => `${i + 1}. ${c}`),
    "",
    "Draft generated from the deal record. Placeholder wording — check it before signing.",
  ].join("\n");
}

function Page() {
  const [type, setType] = useState<DocType>(TYPES[0] ?? "Rental Agreement");
  const [docs, setDocs] = useState<Doc[]>(ROWS);
  const [view, setView] = useState<string | null>(null);

  const open = docs.find((d) => d.id === view) ?? null;

  // Drafts a document on screen from the matching sample record — never touches the database.
  const generate = () => {
    const pool = POOL.filter((p) => p.type === type);
    const base = pool.find((p) => !docs.some((d) => d.ref === p.ref)) ?? pool[0];
    if (!base) return;
    const doc: Doc = { ...base, id: `AG-${Date.now().toString().slice(-5)}`, status: "Draft", date: todayLabel() };
    setDocs((d) => [doc, ...d]);
    setView(doc.id);
    toast.success("Draft created on screen — demo only");
  };

  return (
    <>
      <section className="a-band a-fade">
        <div>
          <p className="eyebrow-a">Money</p>
          <h1>Agreements</h1>
          <p className="sub">Draft rental agreements, sale agreements and receipts, and keep every copy in one place.</p>
        </div>
        <div className="a-band-actions">
          <span className="a-chip c-stage">Sample documents — demo records</span>
          <span className="a-chip c-ok num">{docs.filter((d) => d.status === "Signed").length} signed</span>
        </div>
      </section>

      <div className="a-card a-fade">
        <div className="a-card-head">
          <h2>Generate Document</h2>
          <span className="a-note">{TYPES.length} document types · a new draft lands at the top of the list</span>
        </div>
        <div className="a-agr-form">
          <label>
            Document Type
            <select value={type} onChange={(e) => setType(e.target.value as DocType)}>
              {TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
          <button type="button" className="a-btn a-btn-gold" onClick={generate}>
            <FileSignature size={16} /> Generate
          </button>
        </div>
        <p className="a-mut" style={{ margin: 0 }}>
          Picks the most recent matching record and drafts it on screen — nothing is saved to your database.
        </p>
      </div>

      <div className="a-card">
        <div className="a-card-head">
          <h2>Available Documents</h2>
          <span className="a-count num">{docs.length} documents</span>
        </div>

        <div className="a-list">
          {docs.map((d) => (
            <div className="a-frow a-doc-row" key={d.id}>
              <FileText size={18} aria-hidden />
              <div className="who">
                <b>{d.title}</b>
                <small>
                  {d.party} · {d.headline} · {d.date}
                </small>
              </div>
              <span className={`a-chip ${CHIP[d.status]}`}>{d.status}</span>
              <button type="button" className="a-btn a-btn-line a-btn-sm" onClick={() => setView(d.id)}>
                <Eye size={14} /> View
              </button>
            </div>
          ))}
        </div>

        <p className="a-mut">
          Every document here is sample data for the layout — nothing on this page is saved to your database.
        </p>
      </div>

      {open && <DocModal doc={open} onClose={() => setView(null)} />}
    </>
  );
}

function DocModal({ doc, onClose }: { doc: Doc; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(asText(doc));
      toast.success("Document text copied");
    } catch {
      toast.error("Your browser blocked the copy");
    }
  };

  const download = () => {
    const url = URL.createObjectURL(new Blob([asText(doc)], { type: "text/plain;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `${doc.ref}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Draft downloaded — demo only");
  };

  return (
    <div
      className="a-modal a-doc-modal"
      role="dialog"
      aria-modal="true"
      aria-label={`${doc.type} preview`}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div>
        <div className="a-deal-head">
          <div>
            <h2 style={{ margin: 0 }}>{doc.type}</h2>
            <p className="a-note" style={{ margin: 0 }}>
              {doc.title} · <span className="num">{doc.ref}</span> · {doc.status}
            </p>
          </div>
          <button type="button" className="a-btn a-btn-line a-btn-sm" aria-label="Close document" onClick={onClose}>
            <X size={14} />
          </button>
        </div>

        <div className="a-doc-sheet">
          <div className="a-doc-top">
            <b>DealOS CRM</b>
            <span className="a-note num">
              {doc.ref} · {doc.date}
            </span>
          </div>
          <dl className="a-kv">
            {doc.terms.map(([k, v]) => (
              <div key={k} style={{ display: "contents" }}>
                <dt>{k}</dt>
                <dd className={isMoney(v) ? "num" : undefined}>{v}</dd>
              </div>
            ))}
          </dl>
          <ol className="a-doc-clauses">
            {doc.clauses.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ol>
          <p className="a-note" style={{ margin: 0 }}>
            Draft generated from the deal record. Clause wording is placeholder text — replace it with your own
            template before anything is signed.
          </p>
        </div>

        <div className="a-modal-actions">
          <button type="button" className="a-btn a-btn-line" onClick={copy}>
            <Copy size={15} /> Copy text
          </button>
          <button type="button" className="a-btn a-btn-line" onClick={download}>
            <Download size={15} /> Download draft
          </button>
          <button type="button" className="a-btn a-btn-gold" onClick={onClose}>
            Close
          </button>
        </div>
        <p className="a-mut" style={{ margin: 0 }}>
          Demo only — this document is not saved to your database and nothing is sent to the client.
        </p>
      </div>
    </div>
  );
}
