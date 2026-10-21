import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Check, ArrowRight, MessageCircle, Landmark, ShieldCheck } from "lucide-react";

import { Eyebrow, meta, PublicLayout } from "@/components/public/PublicLayout";
import { PLANS, aedPrice } from "@/lib/pricing";
import { CorporateInvoiceModal } from "@/components/pricing/CorporateInvoiceModal";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/pricing")({
  head: () =>
    meta(
      "Pricing · DealOS Institutional Broker Licenses",
      "DealOS Dubai real estate operating system licenses from AED 91/mo — official 50% launch discount on monthly, quarterly, semi-annual and annual plans."
    ),
  component: PricingPage,
});

function PricingPage() {
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const waEnterpriseUrl = `https://wa.me/971500000000?text=${encodeURIComponent(
    "Hello DealOS Team! I manage a team of 5+ property consultants in Dubai. I would like a quote for centralized brokerage seats, white-label branding, and dedicated onboarding."
  )}`;

  return (
    <PublicLayout>
      <section className="mx-auto max-w-7xl px-6 py-20 text-center">
        <Eyebrow>Institutional value. Zero hidden fees.</Eyebrow>
        <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-extrabold tracking-tight md:text-6xl text-foreground font-display">
          Select Your DealOS License
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-[16px] text-muted-foreground">
          Built exclusively for Dubai property consultants and agency owners. Close one additional off-plan or secondary transaction and your DealOS subscription pays for itself dozens of times over.
        </p>
        <p className="mt-6 inline-block rounded-full border border-amber-500/50 bg-amber-500/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-400">
          ✨ Official Launch Offer · 50% Savings Applied
        </p>

        <div className="mt-14 grid gap-5 text-left sm:grid-cols-2 lg:grid-cols-4">
          {PLANS.map((p) => (
            <div
              key={p.id}
              className={`relative flex flex-col rounded-2xl border bg-card/80 p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 ${
                p.highlighted ? "border-amber-500 ring-2 ring-amber-500/20 shadow-xl" : "border-border/80"
              }`}
            >
              {p.highlighted ? (
                <span className="absolute -top-3 left-6 rounded-full bg-amber-500 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-black">
                  ★ Best Value
                </span>
              ) : null}
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-amber-400">{p.label} Plan</p>
              <p className="metric mt-5 text-sm text-muted-foreground line-through">{aedPrice(p.originalPrice)}</p>
              <p className="mt-1 flex items-baseline gap-1">
                <span className="metric text-4xl font-extrabold tracking-tight text-foreground">{aedPrice(p.price)}</span>
                <span className="text-sm text-muted-foreground">{p.period}</span>
              </p>
              <p className="metric mt-1 text-xs text-emerald-400 font-semibold">
                {p.months > 1 ? `${aedPrice(p.perMonth)} / month` : "Flexible monthly billing"}
              </p>
              <p className="mt-5 text-[13px] text-muted-foreground">{p.savingLabel}</p>
              <ul className="mt-5 flex-1 space-y-2.5 text-[13px] text-zinc-300">
                <li className="flex gap-2">
                  <Check className="mt-0.5 size-3.5 shrink-0 text-amber-400" />
                  <span>34,850+ verified units &amp; 1,355+ projects</span>
                </li>
                <li className="flex gap-2">
                  <Check className="mt-0.5 size-3.5 shrink-0 text-amber-400" />
                  <span>DLD transaction metrics &amp; yield maps</span>
                </li>
                <li className="flex gap-2">
                  <Check className="mt-0.5 size-3.5 shrink-0 text-amber-400" />
                  <span>Instant 1-tap WhatsApp pitch scripts</span>
                </li>
                <li className="flex gap-2">
                  <Check className="mt-0.5 size-3.5 shrink-0 text-amber-400" />
                  <span>1-click client PDF dossiers with your logo</span>
                </li>
                {p.months >= 6 ? (
                  <li className="flex gap-2 font-semibold text-white">
                    <Check className="mt-0.5 size-3.5 shrink-0 text-amber-400" />
                    <span>Priority concierge support &amp; training</span>
                  </li>
                ) : null}
              </ul>
              <Link
                to="/signup"
                search={{ plan: p.id }}
                className={`mt-6 rounded-xl py-3 px-4 text-center text-[11px] font-bold uppercase tracking-[0.18em] transition-all flex items-center justify-center gap-1.5 ${
                  p.highlighted
                    ? "bg-amber-400 text-black hover:bg-amber-300 shadow-md"
                    : "bg-white/10 text-white hover:bg-white/20 border border-white/10"
                }`}
              >
                <span>{p.buttonLabel}</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          ))}
        </div>

        {/* Corporate UAE Bank Wire Option Banner */}
        <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-border/80 bg-secondary/30 p-5 text-left flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Landmark size={20} />
            </div>
            <div>
              <p className="font-extrabold text-sm text-foreground">
                Paying via Corporate UAE Bank Wire or Manager's Cheque?
              </p>
              <p className="text-xs text-muted-foreground">
                Generate an instant official Proforma Invoice with our UAE IBAN (Emirates NBD / Wio Bank).
              </p>
            </div>
          </div>
          <Button
            type="button"
            onClick={() => setShowInvoiceModal(true)}
            className="h-10 px-4 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-black shrink-0 gap-1.5 shadow-sm"
          >
            <Landmark size={14} />
            <span>Generate Proforma Invoice</span>
          </Button>
        </div>

        {/* Enterprise & Brokerage Teams Callout */}
        <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-card to-amber-500/5 p-8 text-left sm:flex sm:items-center sm:justify-between gap-6 shadow-lg">
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">Brokerages &amp; Agencies (5+ Agents)</span>
            <h3 className="text-lg font-bold text-foreground">Need multi-agent governance &amp; custom data migration?</h3>
            <p className="text-xs text-muted-foreground max-w-md">
              Centralized agency cockpit, broker leaderboard, developer commission aging ledger, and white-label client presentation mode.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 shrink-0 flex flex-col gap-2">
            <a
              href={waEnterpriseUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 px-5 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all"
            >
              <MessageCircle size={16} />
              <span>WhatsApp Concierge ↗</span>
            </a>
            <Link
              to="/welcome"
              hash="cta"
              className="inline-flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 px-5 py-2.5 text-xs font-semibold text-white transition-all text-center"
            >
              Request Agency Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Corporate Wire & Proforma Modal */}
      <CorporateInvoiceModal
        isOpen={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
      />
    </PublicLayout>
  );
}
