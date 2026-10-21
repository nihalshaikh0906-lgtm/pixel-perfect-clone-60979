import { useState } from "react";
import {
  Building2,
  FileText,
  CheckCircle2,
  Download,
  Copy,
  MessageCircle,
  X,
  CreditCard,
  ShieldCheck,
  Landmark,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface CorporateInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPlan?: string;
}

export function CorporateInvoiceModal({
  isOpen,
  onClose,
  defaultPlan = "Growth Agency (AED 3,500/mo)",
}: CorporateInvoiceModalProps) {
  const [step, setStep] = useState<"form" | "invoice">("form");
  const [agencyName, setAgencyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("+971 ");
  const [selectedPlan, setSelectedPlan] = useState(defaultPlan);
  const [billingCycle, setBillingCycle] = useState<"quarterly" | "annual">("quarterly");
  const [invoiceNumber, setInvoiceNumber] = useState("INV-2026-AE-1092");

  if (!isOpen) return null;

  const calculateTotal = () => {
    let monthlyRate = 3500;
    if (selectedPlan.includes("Solo")) monthlyRate = 129;
    if (selectedPlan.includes("Sovereign")) monthlyRate = 15000;

    const months = billingCycle === "annual" ? 12 : 3;
    const subtotal = monthlyRate * months;
    const discount = billingCycle === "annual" ? subtotal * 0.15 : 0;
    const total = subtotal - discount;
    const vat = total * 0.05;
    return { subtotal, discount, vat, grandTotal: total + vat };
  };

  const { subtotal, discount, vat, grandTotal } = calculateTotal();

  const handleGenerateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agencyName || !contactName || !email) {
      toast.error("Please fill in your agency details");
      return;
    }
    const invId = `INV-2026-AE-${Math.floor(1000 + Math.random() * 9000)}`;
    setInvoiceNumber(invId);
    setStep("invoice");
    toast.success("Corporate Proforma Invoice generated!");
  };

  const copyIban = () => {
    navigator.clipboard.writeText("AE450260000123456789012");
    toast.success("IBAN copied to clipboard!");
  };

  const shareToFinanceWhatsApp = () => {
    const text = `Hi Team, here is the official DealOS Proforma Invoice (${invoiceNumber}) for ${agencyName}. Total: AED ${grandTotal.toLocaleString()} (Bank Wire Transfer). Beneficiary: DealOS Technologies, IBAN: AE450260000123456789012.`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-2xl rounded-3xl bg-card border border-border p-6 sm:p-8 shadow-2xl space-y-6 relative animate-in fade-in zoom-in-95 duration-200 my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/60 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Landmark size={18} />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-foreground font-display">
                Corporate UAE Bank Wire &amp; Proforma Invoice
              </h3>
              <p className="text-[11px] text-muted-foreground">
                Pay via Emirates NBD, FAB, Wio Bank, or Corporate Manager's Cheque
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-mono text-muted-foreground hover:text-foreground p-1"
          >
            ✕ Close
          </button>
        </div>

        {step === "form" ? (
          <form onSubmit={handleGenerateInvoice} className="space-y-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 space-y-1">
              <p className="font-bold flex items-center gap-1.5 text-amber-400">
                <ShieldCheck size={14} />
                <span>Zero Credit Card Required</span>
              </p>
              <p className="text-[11px] text-amber-200/80">
                Most Dubai brokerages settle software licenses through corporate finance. Generate an official Proforma Invoice with our UAE IBAN to initiate bank transfer.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="font-bold text-muted-foreground uppercase tracking-wider text-[10px]">
                  Agency Legal Trade Name *
                </label>
                <input
                  required
                  placeholder="e.g. Silverline Properties LLC"
                  value={agencyName}
                  onChange={(e) => setAgencyName(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-border bg-secondary/30 text-xs text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-muted-foreground uppercase tracking-wider text-[10px]">
                  Authorized Contact Name *
                </label>
                <input
                  required
                  placeholder="e.g. Tariq Mansoor (MD / Partner)"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-border bg-secondary/30 text-xs text-foreground focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="font-bold text-muted-foreground uppercase tracking-wider text-[10px]">
                  Accounts Email *
                </label>
                <input
                  required
                  type="email"
                  placeholder="accounts@agency.ae"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-border bg-secondary/30 text-xs text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-muted-foreground uppercase tracking-wider text-[10px]">
                  WhatsApp Contact Mobile *
                </label>
                <input
                  required
                  placeholder="+971 50 123 4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-border bg-secondary/30 text-xs text-foreground focus:outline-none focus:border-primary font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="font-bold text-muted-foreground uppercase tracking-wider text-[10px]">
                  Select Package
                </label>
                <select
                  value={selectedPlan}
                  onChange={(e) => setSelectedPlan(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-border bg-secondary/30 text-xs text-foreground focus:outline-none focus:border-primary"
                >
                  <option value="Growth Agency (AED 3,500/mo)">Growth Agency (AED 3,500/mo · 20 Seats)</option>
                  <option value="White-Label Sovereign (AED 15,000/mo)">White-Label Sovereign (AED 15,000/mo · Unlimited)</option>
                  <option value="Solo Broker (AED 129/mo)">Solo Broker (AED 129/mo · 1 Seat)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-muted-foreground uppercase tracking-wider text-[10px]">
                  Billing Term
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setBillingCycle("quarterly")}
                    className={`h-10 rounded-xl border text-xs font-bold transition-all ${
                      billingCycle === "quarterly"
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-secondary/30 border-border text-muted-foreground"
                    }`}
                  >
                    Quarterly (3 Mos)
                  </button>
                  <button
                    type="button"
                    onClick={() => setBillingCycle("annual")}
                    className={`h-10 rounded-xl border text-xs font-bold transition-all ${
                      billingCycle === "annual"
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-secondary/30 border-border text-muted-foreground"
                    }`}
                  >
                    Annual (-15% Off)
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <Button type="button" variant="ghost" onClick={onClose} className="rounded-xl text-xs">
                Cancel
              </Button>
              <Button
                type="submit"
                className="h-10 px-6 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-black shadow-md gap-2"
              >
                <FileText size={14} />
                <span>Generate Official Proforma Invoice</span>
              </Button>
            </div>
          </form>
        ) : (
          /* Rendered Proforma Invoice */
          <div className="space-y-5 text-xs">
            {/* Invoice Document Canvas */}
            <div className="p-6 rounded-2xl bg-white text-zinc-900 border border-zinc-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
                <div>
                  <h4 className="text-xl font-extrabold tracking-tight text-zinc-950 font-display">
                    PROFORMA INVOICE
                  </h4>
                  <p className="text-[11px] text-zinc-500 font-mono">Invoice #{invoiceNumber}</p>
                </div>
                <div className="text-right text-[11px] text-zinc-500">
                  <p className="font-bold text-zinc-900">DealOS Technologies</p>
                  <p>Dubai Internet City, Dubai, UAE</p>
                  <p className="font-mono">Date: {new Date().toLocaleDateString()}</p>
                </div>
              </div>

              {/* Billed To */}
              <div className="text-[11px] text-zinc-600 bg-zinc-50 p-3 rounded-xl border border-zinc-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-zinc-400 block font-mono">BILLED TO</span>
                  <p className="font-extrabold text-zinc-900 text-xs">{agencyName}</p>
                  <p>Attn: {contactName} ({email})</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-zinc-400 block font-mono">STATUS</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                    AWAITING BANK WIRE
                  </span>
                </div>
              </div>

              {/* Items Table */}
              <div className="border border-zinc-200 rounded-xl overflow-hidden text-xs">
                <div className="grid grid-cols-12 bg-zinc-100 p-2 font-bold text-zinc-700 text-[11px]">
                  <span className="col-span-8">Description</span>
                  <span className="col-span-2 text-center">Period</span>
                  <span className="col-span-2 text-right">Amount (AED)</span>
                </div>
                <div className="grid grid-cols-12 p-2.5 border-t border-zinc-100">
                  <span className="col-span-8 font-semibold">DealOS Operating System — {selectedPlan}</span>
                  <span className="col-span-2 text-center capitalize">{billingCycle}</span>
                  <span className="col-span-2 text-right font-mono">AED {subtotal.toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div className="grid grid-cols-12 p-2 border-t border-zinc-100 text-emerald-700">
                    <span className="col-span-10 font-medium">Annual Discount (15%)</span>
                    <span className="col-span-2 text-right font-mono">-AED {discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="grid grid-cols-12 p-2 border-t border-zinc-100 text-zinc-500 text-[11px]">
                  <span className="col-span-10">UAE VAT (5%)</span>
                  <span className="col-span-2 text-right font-mono">AED {vat.toLocaleString()}</span>
                </div>
                <div className="grid grid-cols-12 p-3 bg-zinc-50 border-t border-zinc-200 font-extrabold text-zinc-950 text-sm">
                  <span className="col-span-10">Total Payable Amount</span>
                  <span className="col-span-2 text-right font-mono text-emerald-700">
                    AED {grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Wire Transfer Coordinates */}
              <div className="p-4 rounded-xl bg-zinc-900 text-zinc-100 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-400 uppercase tracking-wider text-[10px] font-mono">
                    Official UAE Wire Transfer Coordinates
                  </span>
                  <button
                    type="button"
                    onClick={copyIban}
                    className="text-[10px] font-bold text-zinc-300 hover:text-white flex items-center gap-1 bg-zinc-800 px-2 py-0.5 rounded border border-zinc-700"
                  >
                    <Copy size={11} />
                    <span>Copy IBAN</span>
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-zinc-400 block text-[10px]">Beneficiary Bank:</span>
                    <span className="font-bold">Emirates NBD / Wio Bank PJSC</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[10px]">Account Name:</span>
                    <span className="font-bold">DealOS Technologies (Client Escrow)</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[10px]">IBAN Number:</span>
                    <span className="font-bold font-mono text-amber-300">AE450260000123456789012</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[10px]">Swift / BIC Code:</span>
                    <span className="font-bold font-mono">EBIBAEAD</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setStep("form")}
                className="text-xs h-9 rounded-xl"
              >
                ← Back to Edit
              </Button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button
                  onClick={shareToFinanceWhatsApp}
                  className="flex-1 sm:flex-none h-9 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white gap-1.5"
                >
                  <MessageCircle size={14} />
                  <span>Send to Finance Team on WhatsApp</span>
                </Button>

                <Button
                  onClick={() => {
                    window.print();
                  }}
                  className="flex-1 sm:flex-none h-9 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-black gap-1.5 shadow-md"
                >
                  <Download size={14} />
                  <span>Print / Save PDF</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
