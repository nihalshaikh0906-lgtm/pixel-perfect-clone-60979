import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo, useCallback } from "react";
import {
  ShieldCheck,
  Building2,
  Sparkles,
  TrendingUp,
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  Download,
  Share2,
  CheckCircle2,
  Lock,
  Layers,
  ArrowRight,
  Wallet,
  Check,
  Copy,
  FileText,
  Star,
  ArrowLeft,
  Calendar,
  X,
  CheckCheck,
  Printer,
} from "lucide-react";
import { toast } from "sonner";
import { LEAD_BY_ID, type Lead } from "@/lib/demo-leads";

export const Route = createFileRoute("/deal-room/$id")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Live Deal Room · Private Dubai Investor Allocation | DealOS" },
      {
        name: "description",
        content: "Bespoke off-plan real estate allocation with live interactive ROI simulation, verified DLD escrow, and instant unit reservation.",
      },
      { property: "og:title", content: "DealOS Live Deal Room · Dubai Investor Allocation" },
      {
        property: "og:description",
        content: "Private client presentation with live ROI engineering, milestone payment plan, and RERA verified credentials.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: DealRoomPage,
});

type Currency = "AED" | "USD" | "EUR" | "GBP";

const CURRENCY_RATES: Record<Currency, { rate: number; symbol: string }> = {
  AED: { rate: 1, symbol: "AED" },
  USD: { rate: 0.272, symbol: "$" },
  EUR: { rate: 0.252, symbol: "€" },
  GBP: { rate: 0.218, symbol: "£" },
};

export interface OffPlanDeal {
  id: string;
  name: string;
  developer: string;
  developerReputation: string;
  location: string;
  district: string;
  unitType: string;
  beds: number;
  areaSqft: number;
  basePriceAed: number;
  handover: string;
  readinessProgress: number;
  escrowBank: string;
  escrowAccount: string;
  trakheesiPermit: string;
  heroImage: string;
  gallery: string[];
  features: string[];
  defaultRentalYield: number;
  defaultCapitalAppreciation: number;
  paymentPlan: { milestone: string; percent: number; note: string }[];
}

export const SAMPLE_DEALS: OffPlanDeal[] = [
  {
    id: "creek-waters",
    name: "Creek Waters Residences",
    developer: "Emaar Properties",
    developerReputation: "Master Developer · 99.8% On-Time Delivery Record",
    location: "Dubai Creek Harbour",
    district: "Island District",
    unitType: "2BR Waterfront Panoramic Suite",
    beds: 2,
    areaSqft: 1145,
    basePriceAed: 2850000,
    handover: "Q4 2027",
    readinessProgress: 38,
    escrowBank: "Emirates NBD",
    escrowAccount: "DLD-ESC-884210",
    trakheesiPermit: "TRK-98421-EMAAR",
    heroImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
    ],
    features: [
      "Direct Creek Marina & Burj Khalifa Skyline Panorama",
      "Infinity edge lap pool & health club",
      "Licensed private yacht berths available",
      "Direct connection to Central Park & future metro line",
    ],
    defaultRentalYield: 7.9,
    defaultCapitalAppreciation: 6.8,
    paymentPlan: [
      { milestone: "On Booking / Reservation", percent: 10, note: "+ 4% DLD Registration Fee" },
      { milestone: "During Construction (6 Milestones)", percent: 80, note: "Linked to verified RERA civil inspections" },
      { milestone: "On Handover & Key Collection", percent: 10, note: "Scheduled Q4 2027" },
    ],
  },
  {
    id: "crest-grande",
    name: "The Crest Grande",
    developer: "Sobha Realty",
    developerReputation: "Backward-Integrated Precision Builder",
    location: "Sobha Hartland, MBR City",
    district: "Downtown Perimeter",
    unitType: "2BR Caribbean Lagoon Vista",
    beds: 2,
    areaSqft: 1028,
    basePriceAed: 2420000,
    handover: "Q2 2026",
    readinessProgress: 68,
    escrowBank: "Abu Dhabi Commercial Bank (ADCB)",
    escrowAccount: "DLD-ESC-671923",
    trakheesiPermit: "TRK-55210-SOBHA",
    heroImage: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80",
    ],
    features: [
      "Crystal Lagoon beach access with water sports",
      "5 minutes from Downtown Dubai and Meydan Racecourse",
      "Twin international schools within the community",
      "Fully fitted luxury kitchen with German appliances",
    ],
    defaultRentalYield: 8.4,
    defaultCapitalAppreciation: 7.2,
    paymentPlan: [
      { milestone: "Down Payment", percent: 10, note: "Immediate holding token" },
      { milestone: "Construction Tranches", percent: 50, note: "Spread across 24 months" },
      { milestone: "On Handover (Keys Handed)", percent: 40, note: "Q2 2026 completion" },
    ],
  },
  {
    id: "ellington-beach-house",
    name: "Ellington Beach House",
    developer: "Ellington Properties",
    developerReputation: "Boutique Architectural Design Award Winner",
    location: "Palm Jumeirah East Crescent",
    district: "Palm Waterfront",
    unitType: "2BR Ultra-Luxury Signature Suite",
    beds: 2,
    areaSqft: 1540,
    basePriceAed: 4950000,
    handover: "Q1 2027",
    readinessProgress: 45,
    escrowBank: "Mashreq Bank",
    escrowAccount: "DLD-ESC-339182",
    trakheesiPermit: "TRK-22910-ELLINGTON",
    heroImage: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=800&q=80",
    ],
    features: [
      "Direct private beach access on Palm Jumeirah East Crescent",
      "Private clubhouse, cigar lounge, and wellness spa",
      "Hotel-style concierge and valet service 24/7",
      "Exceptional capital appreciation track record on Palm Jumeirah",
    ],
    defaultRentalYield: 7.2,
    defaultCapitalAppreciation: 8.5,
    paymentPlan: [
      { milestone: "Reservation Deposit", percent: 20, note: "On signing of reservation" },
      { milestone: "During Construction", percent: 30, note: "Milestone-verified progress" },
      { milestone: "On Completion", percent: 50, note: "On handover Q1 2027" },
    ],
  },
];

export function DealRoomView({ leadId }: { leadId?: string }) {
  // Extract or fallback lead info
  const matchedLead: Lead | undefined = leadId ? LEAD_BY_ID.get(leadId) : undefined;
  const investorName = matchedLead ? matchedLead.name : "Dr. Tariq Al-Nuaimi";
  const investorCountry = matchedLead ? matchedLead.country : "United Arab Emirates";
  const brokerName = "Nihal Shaikh";
  const brokerTitle = "Principal Real Estate Advisory Partner";
  const brokerPhone = "+971501234567";
  const brokerRera = "BRN #54921 · RERA Certified";
  const agencyName = "DealOS Private Wealth Syndicate";

  // State
  const [selectedDealId, setSelectedDealId] = useState<string>(SAMPLE_DEALS[0].id);
  const [currency, setCurrency] = useState<Currency>("AED");
  const [holdingYears, setHoldingYears] = useState<number>(5);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const activeDeal = useMemo(
    () => SAMPLE_DEALS.find((d) => d.id === selectedDealId) || SAMPLE_DEALS[0],
    [selectedDealId]
  );

  const [customYield, setCustomYield] = useState<number>(activeDeal.defaultRentalYield);
  const [customAppreciation, setCustomAppreciation] = useState<number>(activeDeal.defaultCapitalAppreciation);

  const handleSelectDeal = (deal: OffPlanDeal) => {
    setSelectedDealId(deal.id);
    setCustomYield(deal.defaultRentalYield);
    setCustomAppreciation(deal.defaultCapitalAppreciation);
  };

  const formatMoney = useCallback(
    (amountAed: number): string => {
      const { rate, symbol } = CURRENCY_RATES[currency];
      const converted = amountAed * rate;
      if (converted >= 1_000_000) {
        return `${symbol} ${(converted / 1_000_000).toFixed(2)}M`;
      }
      if (converted >= 1_000) {
        return `${symbol} ${Math.round(converted / 1_000).toLocaleString()}K`;
      }
      return `${symbol} ${Math.round(converted).toLocaleString()}`;
    },
    [currency]
  );

  const annualRentalIncome = useMemo(
    () => activeDeal.basePriceAed * (customYield / 100),
    [activeDeal.basePriceAed, customYield]
  );
  const monthlyRentalCashflow = useMemo(
    () => annualRentalIncome / 12,
    [annualRentalIncome]
  );
  const fiveYearCapitalGain = useMemo(
    () =>
      activeDeal.basePriceAed * Math.pow(1 + customAppreciation / 100, holdingYears) -
      activeDeal.basePriceAed,
    [activeDeal.basePriceAed, customAppreciation, holdingYears]
  );
  const total5YearReturn = useMemo(
    () => annualRentalIncome * holdingYears + fiveYearCapitalGain,
    [annualRentalIncome, holdingYears, fiveYearCapitalGain]
  );
  const totalRoiPercent = useMemo(
    () => ((total5YearReturn / activeDeal.basePriceAed) * 100).toFixed(1),
    [total5YearReturn, activeDeal.basePriceAed]
  );

  const isGoldenVisaEligible = useMemo(
    () => activeDeal.basePriceAed >= 2_000_000,
    [activeDeal.basePriceAed]
  );

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      toast.success("Private Deal Room link copied to clipboard!");
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const [reservationModalOpen, setReservationModalOpen] = useState(false);
  const [copiedReservation, setCopiedReservation] = useState(false);

  const reservationMessageRaw = `Hello ${brokerName}, I am reviewing the DealOS Live Deal Room prepared for ${investorName}. I would like to lock in the reservation for ${activeDeal.name} (${activeDeal.unitType} at ${formatMoney(activeDeal.basePriceAed)}). Please confirm the allocation and next escrow steps.`;

  const waReservationLink = `https://wa.me/${brokerPhone.replace(/\D/g, "")}?text=${encodeURIComponent(
    reservationMessageRaw
  )}`;

  return (
    <div className="min-h-screen bg-[#F7F8FC] text-[#141A33] font-sans selection:bg-[#2F6BFF]/15 selection:text-[#2A45C8] antialiased pb-28">
      {/* ═══ CLEAN BRAND TOP BAR ═══ */}
      <header className="border-b border-[#E6E9F5] bg-white sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              to="/app/leads"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4B5272] hover:text-[#141A33] px-2.5 py-1.5 rounded-xl border border-[#E6E9F5] hover:bg-[#F4F6FF] transition-all"
            >
              <ArrowLeft size={13} />
              <span>Back</span>
            </Link>

            <div className="h-5 w-px bg-[#E6E9F5]" />

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#2F6BFF] to-[#7B4DFF] flex items-center justify-center font-extrabold text-white text-sm shadow-sm">
                D
              </div>
              <div>
                <span className="font-extrabold text-sm tracking-tight text-[#141A33] flex items-center gap-1.5">
                  <span>{agencyName}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#EEF1FF] text-[#2A45C8] font-mono font-bold border border-[#2F6BFF]/20">
                    LIVE DEAL ROOM
                  </span>
                </span>
                <p className="text-[10px] text-[#4B5272] font-mono">
                  DLD Verified Allocation · Client Dossier #{leadId || "demo"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Currency selector */}
            <div className="inline-flex rounded-xl bg-[#F4F6FF] p-1 border border-[#E6E9F5] text-xs">
              {(["AED", "USD", "EUR", "GBP"] as Currency[]).map((c) => (
                <button
                  key={c}
                  onClick={() => setCurrency(c)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    currency === c
                      ? "bg-white text-[#2F6BFF] shadow-xs"
                      : "text-[#4B5272] hover:text-[#141A33]"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 h-8 px-3 rounded-xl border border-[#E6E9F5] bg-white hover:bg-[#F4F6FF] text-xs font-semibold text-[#141A33] transition-all shadow-xs cursor-pointer"
              title="Print or Save PDF Investment Dossier"
            >
              <Printer size={13} className="text-[#2F6BFF]" />
              <span className="hidden sm:inline">PDF Dossier</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 h-8 px-3 rounded-xl border border-[#E6E9F5] bg-white hover:bg-[#F4F6FF] text-xs font-semibold text-[#141A33] transition-all shadow-xs cursor-pointer"
              title="Copy private presentation link"
            >
              {isCopied ? <Check size={13} className="text-[#16A34A]" /> : <Copy size={13} />}
              <span>{isCopied ? "Copied" : "Share"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* ═══ HERO BANNER (DEALOS SIGNATURE CLEAN LUXURY) ═══ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-4">
        <div className="rounded-3xl border border-[#E6E9F5] bg-white p-6 sm:p-8 shadow-sm relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EEF1FF] border border-[#2F6BFF]/20 text-[11px] font-bold uppercase tracking-wider text-[#2A45C8]">
                <Lock size={12} />
                <span>Private Off-Plan Allocation · Prepared Exclusively For</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#141A33] font-display">
                {investorName}
              </h1>
              <p className="text-xs sm:text-sm text-[#4B5272] flex items-center gap-2">
                <span>Investor Nationality: <strong className="text-[#141A33]">{investorCountry}</strong></span>
                <span>•</span>
                <span className="text-[#16A34A] font-semibold flex items-center gap-1">
                  <ShieldCheck size={14} /> 48-Hour Reservation Hold Active
                </span>
              </p>
            </div>

            {/* Certified Broker Snapshot Card */}
            <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#F7F8FC] border border-[#E6E9F5] shadow-xs shrink-0">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2F6BFF] to-[#7B4DFF] flex items-center justify-center font-bold text-white font-display text-lg shadow-sm">
                NS
              </div>
              <div className="space-y-0.5 text-xs">
                <p className="font-bold text-[#141A33] flex items-center gap-1">
                  <span>{brokerName}</span>
                  <CheckCircle2 size={13} className="text-[#16A34A]" />
                </p>
                <p className="text-[11px] text-[#4B5272]">{brokerTitle}</p>
                <p className="text-[10px] font-mono text-[#2F6BFF] font-semibold">{brokerRera}</p>
              </div>
              <a
                href={`https://wa.me/${brokerPhone.replace(/\D/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-[#E8F7EE] hover:bg-[#d6f0df] text-[#16A34A] flex items-center justify-center transition-all ml-1"
                title="Direct WhatsApp with Advisor"
              >
                <MessageCircle size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ PROPERTY SWITCHER CARDS (3 CURATED ALLOCATIONS) ═══ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold text-[#4B5272] uppercase tracking-wider flex items-center gap-2">
            <Layers size={14} className="text-[#2F6BFF]" />
            <span>Select Matching Off-Plan Opportunity:</span>
          </h2>
          <span className="text-xs text-[#8A90A8] hidden sm:inline">
            3 verified projects matching your investment criteria
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {SAMPLE_DEALS.map((deal) => {
            const isSelected = deal.id === activeDeal.id;
            return (
              <div
                key={deal.id}
                onClick={() => handleSelectDeal(deal)}
                className={`cursor-pointer rounded-2xl p-4 border transition-all duration-200 relative overflow-hidden ${
                  isSelected
                    ? "bg-white border-[#2F6BFF] ring-2 ring-[#2F6BFF]/20 shadow-md scale-[1.01]"
                    : "bg-white border-[#E6E9F5] hover:border-[#2F6BFF]/40 hover:bg-[#F4F6FF]/40 shadow-xs"
                }`}
              >
                {isSelected && (
                  <div className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#2F6BFF] to-[#7B4DFF] text-white font-extrabold text-[10px] uppercase tracking-wide shadow-xs">
                    Active Focus
                  </div>
                )}
                <div className="flex items-center gap-3 mb-2.5">
                  <div className="w-11 h-11 rounded-xl overflow-hidden shrink-0 border border-[#E6E9F5]">
                    <img src={deal.heroImage} alt={deal.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0 pr-16">
                    <h3 className="font-extrabold text-[#141A33] text-sm truncate">{deal.name}</h3>
                    <p className="text-[11px] text-[#4B5272] truncate">{deal.developer} · {deal.location}</p>
                  </div>
                </div>

                <div className="pt-2.5 border-t border-[#E6E9F5] flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-[#8A90A8] uppercase font-semibold block">Price</span>
                    <span className="font-extrabold font-mono text-[#2F6BFF] text-sm">
                      {formatMoney(deal.basePriceAed)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-[#8A90A8] uppercase font-semibold block">Yield / ROI</span>
                    <span className="font-bold text-[#16A34A] text-xs">
                      {deal.defaultRentalYield}% Net
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ═══ ACTIVE DEAL SHOWCASE & REAL-TIME ROI ENGINE ═══ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-4 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ─── LEFT: PROPERTY VISUALS, DLD ESCROW & AMENITIES (7 COLS) ─── */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Visual Card */}
          <div className="rounded-3xl border border-[#E6E9F5] bg-white overflow-hidden shadow-sm">
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
              <img
                src={activeDeal.heroImage}
                alt={activeDeal.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Overlaid Badges */}
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-xs font-bold text-[#141A33] flex items-center gap-1.5 shadow-xs">
                  <MapPin size={13} className="text-[#2F6BFF]" />
                  <span>{activeDeal.location}</span>
                </span>
                {isGoldenVisaEligible && (
                  <span className="px-3 py-1 rounded-full bg-[#EEF1FF] text-[#2A45C8] border border-[#2F6BFF]/30 text-xs font-bold flex items-center gap-1 shadow-xs">
                    <Star size={13} />
                    <span>UAE 10-Yr Golden Visa Eligible</span>
                  </span>
                )}
              </div>

              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-white">
                <div>
                  <p className="text-xs font-mono font-semibold text-white/90 uppercase tracking-wider">
                    {activeDeal.developer} · {activeDeal.developerReputation}
                  </p>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {activeDeal.name}
                  </h2>
                  <p className="text-xs text-white/80 mt-1">
                    {activeDeal.unitType} · {activeDeal.areaSqft.toLocaleString()} Sq. Ft.
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs text-white/70 uppercase block font-semibold">Handover</span>
                  <span className="text-sm font-bold text-white bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-xl">
                    {activeDeal.handover}
                  </span>
                </div>
              </div>
            </div>

            {/* DLD Escrow & Regulatory Security Strip */}
            <div className="p-4 sm:p-5 border-t border-[#E6E9F5] bg-[#F7F8FC] grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div className="space-y-0.5">
                <span className="text-[10px] text-[#8A90A8] uppercase font-bold tracking-wider">DLD Escrow Account</span>
                <p className="font-mono font-bold text-[#141A33]">{activeDeal.escrowAccount}</p>
                <p className="text-[10px] text-[#4B5272]">{activeDeal.escrowBank}</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-[#8A90A8] uppercase font-bold tracking-wider">Trakheesi Permit</span>
                <p className="font-mono font-bold text-[#2F6BFF]">{activeDeal.trakheesiPermit}</p>
                <p className="text-[10px] text-[#16A34A] font-semibold flex items-center gap-1">
                  <CheckCircle2 size={11} /> Verified Live with RERA
                </p>
              </div>
              <div className="col-span-2 sm:col-span-1 space-y-1">
                <div className="flex items-center justify-between text-[10px] font-bold">
                  <span className="text-[#8A90A8] uppercase">Civil Construction Progress</span>
                  <span className="text-[#2F6BFF]">{activeDeal.readinessProgress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#E6E9F5] overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#2F6BFF] to-[#7B4DFF] rounded-full"
                    style={{ width: `${activeDeal.readinessProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Key Investment Highlights */}
          <div className="rounded-3xl border border-[#E6E9F5] bg-white p-6 space-y-4 shadow-sm">
            <h3 className="text-base font-extrabold text-[#141A33] flex items-center gap-2">
              <Sparkles size={16} className="text-[#2F6BFF]" />
              <span>Signature Architectural & Lifestyle Features</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {activeDeal.features.map((feat, i) => (
                <div
                  key={i}
                  className="p-3 rounded-2xl bg-[#F7F8FC] border border-[#E6E9F5] flex items-start gap-2.5 text-[#141A33]"
                >
                  <CheckCircle2 size={15} className="text-[#2F6BFF] shrink-0 mt-0.5" />
                  <span className="leading-snug">{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* DLD Verified Payment Schedule */}
          <div className="rounded-3xl border border-[#E6E9F5] bg-white p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-[#141A33] flex items-center gap-2">
                <Clock size={16} className="text-[#2F6BFF]" />
                <span>Structured Milestone Payment Schedule</span>
              </h3>
              <span className="text-[11px] font-mono text-[#4B5272] bg-[#F4F6FF] px-2.5 py-1 rounded-lg border border-[#E6E9F5]">
                DLD Escrow Protected
              </span>
            </div>

            <div className="space-y-3">
              {activeDeal.paymentPlan.map((stage, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-2xl bg-[#F7F8FC] border border-[#E6E9F5] flex items-center justify-between gap-4 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-white border border-[#E6E9F5] flex items-center justify-center font-bold text-[#2F6BFF] font-mono text-xs shadow-xs">
                      {stage.percent}%
                    </div>
                    <div>
                      <p className="font-bold text-[#141A33]">{stage.milestone}</p>
                      <p className="text-[11px] text-[#4B5272]">{stage.note}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-mono font-bold text-[#2F6BFF] text-sm">
                      {formatMoney((activeDeal.basePriceAed * stage.percent) / 100)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ─── RIGHT: INTERACTIVE FINANCIAL ENGINEERING & ROI ENGINE (5 COLS) ─── */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
          <div className="rounded-3xl border border-[#E6E9F5] bg-white p-6 sm:p-7 shadow-sm space-y-6 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#E6E9F5] pb-4">
              <div>
                <h3 className="text-lg font-extrabold text-[#141A33] flex items-center gap-2 font-display">
                  <TrendingUp size={18} className="text-[#2F6BFF]" />
                  <span>Real-Time ROI Simulator</span>
                </h3>
                <p className="text-xs text-[#4B5272]">Live projections for Dubai off-plan yields</p>
              </div>
              <div className="px-2.5 py-1 rounded-full bg-[#E8F7EE] text-[#16A34A] text-[11px] font-bold font-mono">
                {totalRoiPercent}% ROI
              </div>
            </div>

            {/* Interactive Sliders */}
            <div className="space-y-5 text-xs">
              {/* Projected Rental Yield Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#141A33]">Projected Net Rental Yield</span>
                  <span className="font-mono font-bold text-[#2F6BFF] text-sm bg-[#EEF1FF] px-2 py-0.5 rounded border border-[#2F6BFF]/20">
                    {customYield.toFixed(1)}% p.a.
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="12"
                  step="0.1"
                  value={customYield}
                  onChange={(e) => setCustomYield(parseFloat(e.target.value))}
                  className="w-full accent-[#2F6BFF] cursor-pointer h-2 bg-[#E6E9F5] rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-[#8A90A8] font-mono">
                  <span>Conservative (5.0%)</span>
                  <span>Prime Dubai (8.0%)</span>
                  <span>High Yield (12.0%)</span>
                </div>
              </div>

              {/* Capital Appreciation Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#141A33]">Estimated Annual Capital Growth</span>
                  <span className="font-mono font-bold text-[#16A34A] text-sm bg-[#E8F7EE] px-2 py-0.5 rounded border border-[#16A34A]/20">
                    {customAppreciation.toFixed(1)}% p.a.
                  </span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="15"
                  step="0.5"
                  value={customAppreciation}
                  onChange={(e) => setCustomAppreciation(parseFloat(e.target.value))}
                  className="w-full accent-[#16A34A] cursor-pointer h-2 bg-[#E6E9F5] rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-[#8A90A8] font-mono">
                  <span>Modest (3%)</span>
                  <span>Waterfront (7%)</span>
                  <span>Hyper-Growth (15%)</span>
                </div>
              </div>

              {/* Holding Horizon */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#141A33]">Investment Holding Horizon</span>
                  <span className="font-mono font-bold text-[#141A33] text-sm bg-[#F4F6FF] px-2 py-0.5 rounded border border-[#E6E9F5]">
                    {holdingYears} Years
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[3, 5, 7, 10].map((yr) => (
                    <button
                      key={yr}
                      onClick={() => setHoldingYears(yr)}
                      className={`py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        holdingYears === yr
                          ? "bg-gradient-to-r from-[#2F6BFF] to-[#7B4DFF] text-white border-transparent shadow-xs"
                          : "bg-white text-[#4B5272] border-[#E6E9F5] hover:text-[#141A33]"
                      }`}
                    >
                      {yr} Yrs
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Calculated Yield Dashboard */}
            <div className="pt-4 border-t border-[#E6E9F5] space-y-3">
              <div className="p-4 rounded-2xl bg-[#F7F8FC] border border-[#E6E9F5] space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#4B5272]">Monthly Passive Rental Income</span>
                  <span className="font-mono font-bold text-[#141A33] text-sm">
                    {formatMoney(monthlyRentalCashflow)} / mo
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#4B5272]">Net Annual Rental Return</span>
                  <span className="font-mono font-bold text-[#2F6BFF] text-sm">
                    {formatMoney(annualRentalIncome)} / yr
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#4B5272]">{holdingYears}-Year Capital Equity Gain</span>
                  <span className="font-mono font-bold text-[#16A34A] text-sm">
                    + {formatMoney(fiveYearCapitalGain)}
                  </span>
                </div>
                <div className="pt-2 border-t border-[#E6E9F5] flex items-center justify-between">
                  <span className="text-xs font-extrabold text-[#141A33] uppercase tracking-wider">
                    Total Estimated Return
                  </span>
                  <span className="font-mono font-extrabold text-[#2F6BFF] text-base">
                    {formatMoney(total5YearReturn)}
                  </span>
                </div>

                {/* Visual Stacked ROI Payback Bar */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-[10px] font-mono font-bold text-[#4B5272]">
                    <span>Asset Base ({formatMoney(activeDeal.basePriceAed)})</span>
                    <span className="text-[#16A34A]">+{totalRoiPercent}% Net Growth</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-[#E6E9F5] overflow-hidden flex">
                    <div
                      className="h-full bg-[#2F6BFF]"
                      style={{ width: `${Math.min(100, Math.round((annualRentalIncome * holdingYears / (total5YearReturn || 1)) * 100))}%` }}
                      title="Rental Income Portion"
                    />
                    <div
                      className="h-full bg-[#16A34A]"
                      style={{ width: `${Math.max(0, 100 - Math.min(100, Math.round((annualRentalIncome * holdingYears / (total5YearReturn || 1)) * 100)))}%` }}
                      title="Capital Appreciation Portion"
                    />
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-[#4B5272] pt-0.5">
                    <span className="flex items-center gap-1">
                      <span className="size-2 rounded-full bg-[#2F6BFF]" /> Rental Cashflow
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="size-2 rounded-full bg-[#16A34A]" /> Capital Growth
                    </span>
                  </div>
                </div>
              </div>

              {/* Zero Tax Notice */}
              <div className="p-3 rounded-xl bg-[#EEF1FF] border border-[#2F6BFF]/20 text-[11px] text-[#2A45C8] leading-relaxed flex items-center gap-2">
                <ShieldCheck size={16} className="text-[#2F6BFF] shrink-0" />
                <span>
                  <strong>0% Personal Income Tax & 0% Capital Gains Tax</strong> in Dubai. Rental profits and sales proceeds remain 100% repatriable.
                </span>
              </div>
            </div>

            {/* Instant Action CTA */}
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={() => setReservationModalOpen(true)}
                className="w-full h-12 rounded-2xl bg-gradient-to-r from-[#2F6BFF] to-[#7B4DFF] hover:brightness-105 active:scale-[0.99] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md shadow-[#2F6BFF]/25 transition-all cursor-pointer"
              >
                <MessageCircle size={18} />
                <span>Reserve Unit with 10% Token on WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  toast.success("DLD Floor Plan & Brochure downloaded.");
                }}
                className="w-full h-10 rounded-xl bg-white hover:bg-[#F4F6FF] border border-[#E6E9F5] text-[#141A33] font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
              >
                <Download size={14} />
                <span>Download Official DLD Floor Plan (PDF)</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* ═══ STICKY BOTTOM ACTION STRIP (MOBILE + DESKTOP) ═══ */}
      <div className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-xl border-t border-[#E6E9F5] p-3.5 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="hidden sm:block">
            <p className="text-xs font-bold text-[#141A33]">{activeDeal.name} · {activeDeal.unitType}</p>
            <p className="text-[11px] font-mono text-[#2F6BFF] font-semibold">
              Allocation Price: {formatMoney(activeDeal.basePriceAed)} ({activeDeal.defaultRentalYield}% Net Yield)
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <a
              href={`tel:${brokerPhone}`}
              className="h-10 px-4 rounded-xl border border-[#E6E9F5] bg-white text-[#141A33] font-bold text-xs flex items-center gap-1.5 hover:bg-[#F4F6FF] transition-all shrink-0 shadow-xs"
            >
              <Phone size={14} className="text-[#4B5272]" />
              <span className="hidden sm:inline">Call Advisor</span>
            </a>

            <button
              type="button"
              onClick={() => setReservationModalOpen(true)}
              className="h-10 px-5 rounded-xl bg-gradient-to-r from-[#2F6BFF] to-[#7B4DFF] hover:brightness-105 active:scale-[0.99] text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-[#2F6BFF]/25 w-full sm:w-auto cursor-pointer"
            >
              <MessageCircle size={15} />
              <span>Lock Reservation · WhatsApp</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* ═══ IN-PAGE SIMULATED WHATSAPP RESERVATION MODAL ═══ */}
      {reservationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl bg-[#0B141A] border border-emerald-500/40 p-6 sm:p-7 shadow-2xl text-white space-y-4 relative my-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-mono font-bold text-emerald-400">
                  Simulated WhatsApp Dispatch · {brokerName} ({brokerPhone})
                </span>
              </div>
              <button
                type="button"
                onClick={() => setReservationModalOpen(false)}
                className="text-zinc-400 hover:text-white p-1"
              >
                <X size={18} />
              </button>
            </div>

            <div className="text-center py-2 space-y-1">
              <div className="size-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40 mb-2">
                <CheckCheck size={24} />
              </div>
              <h3 className="text-lg font-extrabold text-white">
                10% Token Reservation Request Ready
              </h3>
              <p className="text-xs text-zinc-300 max-w-sm mx-auto">
                Prepared specifically for <span className="text-white font-bold">{investorName}</span> under DLD Escrow registration.
              </p>
            </div>

            {/* Chat Bubble Simulation */}
            <div className="bg-[#005c4b]/35 p-3.5 rounded-2xl border border-emerald-500/25 space-y-2 text-xs">
              <p className="text-zinc-100 leading-relaxed text-[11px]">
                "{reservationMessageRaw}"
              </p>
              <div className="p-2 rounded-lg bg-black/40 border border-white/10 flex items-center justify-between text-[11px]">
                <span className="text-violet-300 font-mono font-bold">
                  {activeDeal.name} · {formatMoney(activeDeal.basePriceAed)}
                </span>
                <span className="text-emerald-400 font-bold flex items-center gap-1 text-[10px]">
                  Delivered <CheckCheck size={13} />
                </span>
              </div>
            </div>

            <p className="text-[11px] text-zinc-400 text-center">
              🔒 In-page demonstration effect · External WhatsApp app not opened on device.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
              <div className="w-full sm:flex-1 h-11 rounded-xl bg-white/5 border border-white/10 text-zinc-300 font-mono text-[11px] flex items-center justify-center gap-1.5 px-3 text-center">
                <Eye size={13} className="text-emerald-400" />
                <span>Viewable Client Draft · Read-Only</span>
              </div>

              <button
                type="button"
                onClick={() => setReservationModalOpen(false)}
                className="w-full sm:w-auto h-11 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs transition-all cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DealRoomPage() {
  const { id } = Route.useParams();
  return <DealRoomView leadId={id} />;
}
