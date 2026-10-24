import { useState } from "react";
import {
  X,
  CreditCard,
  Smartphone,
  Landmark,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  FileText,
  Building2,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaymentMethodsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBankWireInvoice?: () => void;
}

export function PaymentMethodsModal({
  isOpen,
  onClose,
  onOpenBankWireInvoice,
}: PaymentMethodsModalProps) {
  const [activeTab, setActiveTab] = useState<"all" | "cards" | "wallets" | "bank">("all");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in-50 duration-200">
      <div
        className="relative w-full max-w-2xl bg-card border border-border/80 rounded-2xl sm:rounded-3xl shadow-2xl p-5 sm:p-8 space-y-6 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-start justify-between gap-4 border-b border-border/70 pb-4 sm:pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <ShieldCheck size={13} />
                Central Bank of UAE 3D Secure
              </span>
              <span className="text-xs text-muted-foreground font-mono">· 256-Bit SSL</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-foreground font-display tracking-tight">
              Accepted Payment Methods
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              DealOS supports instant digital checkout and institutional UAE corporate bank wire.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="size-9 rounded-xl bg-secondary/80 hover:bg-secondary text-muted-foreground hover:text-foreground flex items-center justify-center border border-border/60 transition-all shrink-0 cursor-pointer"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          {[
            { id: "all", label: "All Payment Modes" },
            { id: "cards", label: "Credit & Debit Cards" },
            { id: "wallets", label: "Apple / Google Pay" },
            { id: "bank", label: "UAE Corporate Wire" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-[13px] font-bold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground shadow-sm ring-2 ring-primary/20"
                  : "bg-secondary/60 text-muted-foreground hover:text-foreground hover:bg-secondary border border-border/60"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Payment Methods Grid */}
        <div className="space-y-4">
          {/* Section 1: Digital Wallets */}
          {(activeTab === "all" || activeTab === "wallets") && (
            <div className="rounded-2xl border border-border/80 bg-secondary/20 p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="size-9 rounded-xl bg-background border border-border flex items-center justify-center text-primary shadow-xs">
                    <Smartphone size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-foreground">
                      Mobile &amp; Digital Wallets
                    </h3>
                    <p className="text-xs text-muted-foreground">1-Tap biometric authentication on iPhone, iPad, Mac &amp; Android</p>
                  </div>
                </div>
                <span className="hidden sm:inline-flex text-[11px] font-bold font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Instant Access
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border/60">
                  <div className="size-8 rounded-lg bg-black text-white flex items-center justify-center font-bold text-xs shrink-0">
                    Pay
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-foreground">Apple Pay</p>
                    <p className="text-[11px] sm:text-xs text-muted-foreground">Supported on all Safari &amp; Apple devices</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border/60">
                  <div className="size-8 rounded-lg bg-white border border-zinc-200 text-zinc-900 flex items-center justify-center font-bold text-xs shrink-0">
                    GPay
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-foreground">Google Pay</p>
                    <p className="text-[11px] sm:text-xs text-muted-foreground">Supported on Chrome &amp; Android devices</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section 2: Credit & Debit Cards */}
          {(activeTab === "all" || activeTab === "cards") && (
            <div className="rounded-2xl border border-border/80 bg-secondary/20 p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="size-9 rounded-xl bg-background border border-border flex items-center justify-center text-amber-500 shadow-xs">
                    <CreditCard size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-foreground">
                      Major Credit &amp; Debit Cards
                    </h3>
                    <p className="text-xs text-muted-foreground">Processed in AED via Stripe UAE with Central Bank 3D Secure</p>
                  </div>
                </div>
                <span className="hidden sm:inline-flex text-[11px] font-bold font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  Zero Surcharge
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2.5 pt-1">
                <div className="p-3 rounded-xl bg-card border border-border/60 text-center space-y-1">
                  <span className="font-extrabold text-blue-500 tracking-wider text-sm sm:text-base font-display">VISA</span>
                  <p className="text-[11px] text-muted-foreground">Credit &amp; Debit</p>
                </div>
                <div className="p-3 rounded-xl bg-card border border-border/60 text-center space-y-1">
                  <span className="font-extrabold text-rose-500 tracking-wider text-sm sm:text-base font-display">Mastercard</span>
                  <p className="text-[11px] text-muted-foreground">Worldwide</p>
                </div>
                <div className="p-3 rounded-xl bg-card border border-border/60 text-center space-y-1">
                  <span className="font-extrabold text-cyan-500 tracking-wider text-sm sm:text-base font-display">AMEX</span>
                  <p className="text-[11px] text-muted-foreground">Corporate &amp; Personal</p>
                </div>
              </div>
            </div>
          )}

          {/* Section 3: UAE Corporate Bank Wire */}
          {(activeTab === "all" || activeTab === "bank") && (
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="size-9 rounded-xl bg-background border border-amber-500/30 flex items-center justify-center text-amber-500 shadow-xs">
                    <Landmark size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-foreground">
                      UAE Corporate Bank Wire (IBAN)
                    </h3>
                    <p className="text-xs text-muted-foreground">Ideal for Dubai real estate agencies &amp; corporate brokerages</p>
                  </div>
                </div>
                <span className="inline-flex text-[11px] font-bold font-mono px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30">
                  FTA VAT Invoiced
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-card border border-border/70 space-y-2 text-xs sm:text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Beneficiary Bank:</span>
                    <strong className="text-foreground">Emirates NBD / Wio Bank PJSC</strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Jurisdiction:</span>
                    <strong className="text-foreground">Dubai, United Arab Emirates</strong>
                  </div>
                </div>
                <p className="text-[11px] sm:text-xs text-muted-foreground pt-1">
                  Includes official Tax Registration Number (TRN) for full UAE Corporate Tax &amp; VAT deductibility.
                </p>
              </div>

              {onOpenBankWireInvoice && (
                <Button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenBankWireInvoice();
                  }}
                  className="w-full h-11 rounded-xl text-xs sm:text-sm font-bold bg-amber-500 hover:bg-amber-400 text-black gap-2 transition-all shadow-md cursor-pointer"
                >
                  <FileText size={16} />
                  <span>Generate Official UAE Proforma Invoice ↗</span>
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Security & Regulatory Footer */}
        <div className="rounded-xl bg-secondary/40 border border-border/60 p-3.5 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-foreground">
            <Lock size={13} className="text-emerald-400" />
            <span>Bank-Grade Payment Security &amp; UAE Compliance</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] sm:text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
              <span>PCI-DSS Level 1 Certified infrastructure</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
              <span>Full 5% UAE VAT invoice delivered instantly</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
              <span>Cancel or pause your subscription anytime</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
              <span>Zero hidden setup fees or processing charges</span>
            </div>
          </div>
        </div>

        {/* Bottom Close Button */}
        <div className="pt-1">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="w-full h-11 rounded-xl text-xs sm:text-sm font-bold border-border/80 text-foreground hover:bg-secondary cursor-pointer"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
