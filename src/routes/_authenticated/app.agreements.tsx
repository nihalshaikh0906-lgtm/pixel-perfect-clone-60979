import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  FileSignature, FileText, Download, Printer, Copy, Eye,
  ShieldCheck, Check, Plus, MessageCircle, ArrowUpRight,
  ExternalLink, Building2, User
} from "lucide-react";
import { toast } from "sonner";
import { workspaceHead } from "@/components/app/WorkspacePlaceholder";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export const Route = createFileRoute("/_authenticated/app/agreements")({
  head: () => workspaceHead("Agreements & Legal"),
  component: Page,
});

type DocType = "Rental Agreement" | "Form F (Sale Agreement)" | "Payment Receipt";
type DocStatus = "Signed & Sealed" | "Issued (Awaiting Signature)" | "Draft";

type Agreement = {
  id: string;
  ref: string;
  type: DocType;
  title: string;
  parties: string;
  property: string;
  value: string;
  agent: string;
  status: DocStatus;
  date: string;
  terms: [string, string][];
  clauses: string[];
};

const INITIAL_AGREEMENTS: Agreement[] = [
  {
    id: "AGR-101",
    ref: "DLD-EJARI-2026-091",
    type: "Rental Agreement",
    title: "Official Tenancy Contract · Marina Quay #1402",
    parties: "Skyline Realty LLC (Agent) ➔ Daniel Brooks (Tenant)",
    property: "Marina Quay Luxury Residence, Dubai Marina",
    value: "AED 145,000 / year",
    agent: "Saad Khan",
    status: "Signed & Sealed",
    date: "01 Oct 2026",
    terms: [
      ["Annual Rent", "AED 145,000"],
      ["Payment Terms", "4 Cheques"],
      ["Security Deposit", "AED 7,250 (5% Refundable)"],
      ["Lease Term", "01 Oct 2026 – 30 Sep 2027"],
      ["Ejari Registration", "Verified by Land Department"],
    ],
    clauses: [
      "The tenancy runs for the agreed 12-month period commencing upon key handover.",
      "Rent is payable strictly via UAE banking cheques; bounced cheques constitute immediate breach.",
      "Landlord maintains structural repairs; tenant is responsible for minor maintenance under AED 500.",
      "Premises shall be used exclusively for residential occupancy in compliance with Dubai Law.",
    ],
  },
  {
    id: "AGR-102",
    ref: "DLD-FORM-F-8820",
    type: "Form F (Sale Agreement)",
    title: "Contract F · Celestara Residences Studio #1006",
    parties: "Celestara Developments (Seller) ➔ Tariq Mansoor (Buyer)",
    property: "Celestara Residences, Jumeirah Village Circle",
    value: "AED 498,000",
    agent: "Saad Khan",
    status: "Signed & Sealed",
    date: "08 Oct 2026",
    terms: [
      ["Agreed Purchase Price", "AED 498,000"],
      ["Down Payment Paid", "AED 49,800 (10%)"],
      ["Escrow Construction Tranche", "50% during construction"],
      ["Handover Final Tranche", "40% upon completion"],
      ["DLD Registration Fee", "4% paid to Land Department"],
    ],
    clauses: [
      "Seller confirms free & clear title with developer NOC issued.",
      "Buyer shall fulfill remaining payment milestones as per certified DLD engineering progress.",
      "Agency commission of 2% + VAT settled through authorized escrow manager.",
    ],
  },
  {
    id: "AGR-103",
    ref: "DLD-REC-4419",
    type: "Payment Receipt",
    title: "Official Escrow Deposit Receipt #4419",
    parties: "Sophie Laurent (Payer) ➔ Reef Luxury Escrow Account",
    property: "Reef Luxury 995, DLRC",
    value: "AED 154,500",
    agent: "Aisha Salem",
    status: "Issued (Awaiting Signature)",
    date: "11 Oct 2026",
    terms: [
      ["Amount Received", "AED 154,500 (10% Booking Deposit)"],
      ["Payment Mode", "Manager's Cheque (Emirates NBD)"],
      ["Escrow Trust Account", "DLD Escrow #9952"],
      ["Allocation Reserved", "Unit #101 · 1 Bedroom Luxury Suite"],
    ],
    clauses: [
      "This receipt confirms initial token holding reservation against certified developer allotment.",
      "Funds held under statutory DLD Escrow Trust protection pending SPA registration.",
    ],
  },
  {
    id: "AGR-104",
    ref: "DLD-FORM-F-9021",
    type: "Form F (Sale Agreement)",
    title: "Contract F · Amali Island Beach Mansion #1204",
    parties: "Amali Properties ➔ Khalid Al Suwaidi (Buyer)",
    property: "Amali Island Waterfront, Business Bay Canal",
    value: "AED 4,250,000",
    agent: "Omar Farooq",
    status: "Draft",
    date: "Today",
    terms: [
      ["Agreed Purchase Price", "AED 4,250,000"],
      ["Initial Deposit", "AED 850,000 (20%)"],
      ["Escrow Tranches", "60% Construction Linked"],
      ["Handover Balance", "20% On Completion"],
    ],
    clauses: [
      "Official Form F draft generated under RERA Dubai brokerage guidelines.",
      "Pending final digital signatures from buyer and developer legal representative.",
    ],
  },
];

function Page() {
  const [agreements, setAgreements] = useState<Agreement[]>(INITIAL_AGREEMENTS);
  const [filter, setFilter] = useState<string>("All");
  const [selectedDoc, setSelectedDoc] = useState<Agreement | null>(null);

  const filtered = agreements.filter((a) => {
    if (filter === "All") return true;
    if (filter === "Rental") return a.type === "Rental Agreement";
    if (filter === "Form F") return a.type === "Form F (Sale Agreement)";
    if (filter === "Receipts") return a.type === "Payment Receipt";
    return true;
  });

  const handleShareDoc = (e: React.MouseEvent, doc: Agreement) => {
    e.stopPropagation();
    const text = `Official Document: *${doc.title}* (${doc.ref})\nParties: ${doc.parties}\nValue: ${doc.value}\nStatus: ${doc.status}\nDate: ${doc.date}. Official DLD-compliant document issued by Skyline Realty LLC.`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
    toast.success(`WhatsApp link prepared for ${doc.ref}`);
  };

  return (
    <div className="w-full space-y-6 pb-24 animate-in fade-in-50 duration-300">
      {/* ═══ 1. CLEAN EXECUTIVE HEADER ═══ */}
      <section className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-r from-card via-card to-secondary/30 p-6 sm:p-7 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-primary">
                DLD Form A, B, F & Ejari
              </span>
              <span className="text-muted-foreground">•</span>
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                <ShieldCheck size={14} /> 100% RERA Legal Templates
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-display">
              Agreements & Contracts
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Official real estate sale contracts, Ejari tenancies, and DLD escrow deposit receipts.
            </p>
          </div>

          <Button
            onClick={() => toast("New contract template generator opened.")}
            className="h-10 rounded-2xl text-xs font-bold bg-primary text-primary-foreground gap-1.5 shadow-sm"
          >
            <Plus size={15} />
            <span>Draft New Contract</span>
          </Button>
        </div>
      </section>

      {/* ═══ 2. CATEGORY SELECTOR PILLS ═══ */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border/60 pb-3">
        {[
          { id: "All", label: `All Agreements (${agreements.length})` },
          { id: "Form F", label: "📄 Form F (Sale & Purchase)" },
          { id: "Rental", label: "🏢 Ejari Rental Leases" },
          { id: "Receipts", label: "💳 Escrow Payment Receipts" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setFilter(t.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filter === t.id
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-secondary/60 text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ═══ 3. BESPOKE HORIZONTAL AGREEMENT CARDS (NO TABLE) ═══ */}
      <div className="space-y-3.5">
        {filtered.map((doc) => (
          <div
            key={doc.id}
            onClick={() => setSelectedDoc(doc)}
            className="group cursor-pointer rounded-2xl border border-border/80 bg-card hover:border-primary/60 hover:shadow-md p-4 sm:p-5 transition-all duration-200 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
          >
            {/* Document Identity (Left) */}
            <div className="flex items-center gap-4 min-w-[280px]">
              <div className="size-13 rounded-2xl bg-secondary border border-border/80 flex items-center justify-center text-primary font-bold shrink-0 shadow-sm">
                <FileSignature size={22} />
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-base text-foreground font-display group-hover:text-primary transition-colors">
                    {doc.title}
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground">{doc.property}</p>
                <p className="text-[11px] text-muted-foreground font-mono">
                  {doc.ref} · {doc.date}
                </p>
              </div>
            </div>

            {/* Parties & Financial Terms (Middle) */}
            <div className="flex-1 space-y-1.5 lg:px-4 lg:border-l lg:border-r lg:border-border/60">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-muted-foreground">Contract Value:</span>
                <strong className="text-sm font-mono font-black text-emerald-400">{doc.value}</strong>
                <span className="text-muted-foreground text-xs">•</span>
                <span className="text-xs text-muted-foreground">Broker:</span>
                <span className="text-xs font-bold text-foreground">{doc.agent}</span>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border font-mono ${
                  doc.status === "Signed & Sealed"
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                    : doc.status === "Draft"
                    ? "bg-secondary text-muted-foreground border-border"
                    : "bg-blue-500/10 text-blue-400 border-blue-500/30"
                }`}>
                  {doc.status}
                </span>
                <span className="text-muted-foreground truncate italic">
                  {doc.parties}
                </span>
              </div>
            </div>

            {/* Action Hub (Right) */}
            <div
              className="flex items-center gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-border/50"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={(e) => handleShareDoc(e, doc)}
                className="inline-flex items-center gap-1.5 h-9 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all"
                title="Share via WhatsApp"
              >
                <MessageCircle size={14} />
                <span>WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedDoc(doc)}
                className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-xl border border-border bg-secondary/50 hover:bg-secondary text-foreground font-bold text-xs transition-all"
              >
                <Eye size={14} />
                <span>View PDF</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ═══ 4. FULL-SCREEN OFFICIAL CONTRACT MODAL (OFFICIAL LETTERHEAD) ═══ */}
      {selectedDoc && (
        <Dialog open={!!selectedDoc} onOpenChange={(open) => { if (!open) setSelectedDoc(null); }}>
          <DialogContent className="max-w-3xl max-h-[92vh] overflow-y-auto rounded-3xl bg-card border-border p-6 sm:p-8 space-y-6">
            <DialogHeader className="border-b border-border/60 pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <DialogTitle className="text-2xl font-extrabold text-foreground font-display">
                    {selectedDoc.title}
                  </DialogTitle>
                  <p className="text-xs text-muted-foreground mt-0.5 font-mono">
                    Official Ref: {selectedDoc.ref} · Issued {selectedDoc.date}
                  </p>
                </div>
                <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1 text-xs font-mono font-bold text-emerald-400">
                  {selectedDoc.status}
                </span>
              </div>
            </DialogHeader>

            {/* Official Letterhead Simulation */}
            <div className="rounded-2xl border border-border/80 bg-secondary/20 p-6 space-y-5 text-xs">
              <div className="flex items-center justify-between border-b border-border/60 pb-4">
                <div>
                  <h4 className="font-extrabold text-sm text-foreground">SKYLINE REALTY LLC</h4>
                  <p className="text-muted-foreground text-[11px]">RERA Licensed Brokerage · Office 1204, Boulevard Plaza, Downtown Dubai</p>
                </div>
                <span className="text-[11px] font-mono text-muted-foreground font-bold">DLD Certified</span>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-foreground uppercase tracking-wider text-[10px]">Contracting Parties:</span>
                <p className="font-mono text-foreground text-sm font-bold">{selectedDoc.parties}</p>
                <p className="text-muted-foreground">Property: {selectedDoc.property}</p>
              </div>

              {/* Financial Terms */}
              <div className="space-y-2 pt-2">
                <span className="font-bold text-foreground uppercase tracking-wider text-[10px]">Certified Terms:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedDoc.terms.map(([k, v]) => (
                    <div key={k} className="p-2.5 rounded-xl bg-card border border-border/60 flex justify-between">
                      <span className="text-muted-foreground">{k}:</span>
                      <strong className="text-foreground font-mono">{v}</strong>
                    </div>
                  ))}
                </div>
              </div>

              {/* Statutory Clauses */}
              <div className="space-y-2 pt-2">
                <span className="font-bold text-foreground uppercase tracking-wider text-[10px]">Standard RERA Clauses:</span>
                <ul className="space-y-1.5 text-muted-foreground list-disc pl-4 leading-relaxed">
                  {selectedDoc.clauses.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/60">
              <Button variant="outline" onClick={() => setSelectedDoc(null)} className="rounded-xl text-xs">
                Close
              </Button>
              <Button
                onClick={() => {
                  window.print();
                  toast.success("Sending document to print driver.");
                }}
                variant="outline"
                className="rounded-xl text-xs gap-1.5"
              >
                <Printer size={14} />
                <span>Print Contract</span>
              </Button>
              <Button
                onClick={(e) => {
                  handleShareDoc(e, selectedDoc);
                  setSelectedDoc(null);
                }}
                className="rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
              >
                <MessageCircle size={14} />
                <span>Share PDF via WhatsApp</span>
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
