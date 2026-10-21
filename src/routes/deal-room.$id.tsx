import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
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
  Percent,
  Check,
  Copy,
  FileText,
  Star,
} from "lucide-react";
import { toast } from "sonner";
import { LEAD_BY_ID, type Lead } from "@/lib/demo-leads";

export const Route = createFileRoute("/deal-room/$id")({
  head: () => ({
    meta: [
      { title: "Live Deal Room · Private Dubai Investor Presentation | DealOS" },
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

interface OffPlanDeal {
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

const SAMPLE_DEALS: OffPlanDeal[] = [
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
      "Licensed licensed private yacht berths",
      "Direct connection to Central Park & metro line",
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
      "Crystal Lagoon beach access with water activities",
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
      "Private clubhouse, cigar lounge, and spa facilities",
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

function DealRoomPage() {
  const { id } = Route.useParams();
  
  // Extract or fallback lead info
  const matchedLead: Lead | undefined = LEAD_BY_ID.get(id);
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
  const [showReserveModal, setShowReserveModal] = useState<boolean>(false);

  const activeDeal = useMemo(
    () => SAMPLE_DEALS.find((d) => d.id === selectedDealId) || SAMPLE_DEALS[0],
    [selectedDealId]
  );

  // Dynamic ROI inputs initialized from the active deal
  const [customYield, setCustomYield] = useState<number>(activeDeal.defaultRentalYield);
  const [customAppreciation, setCustomAppreciation] = useState<number>(activeDeal.defaultCapitalAppreciation);

  // Switch deal handler
  const handleSelectDeal = (deal: OffPlanDeal) => {
    setSelectedDealId(deal.id);
    setCustomYield(deal.defaultRentalYield);
    setCustomAppreciation(deal.defaultCapitalAppreciation);
  };

  // Financial Calculations
  const formatMoney = (amountAed: number): string => {
    const { rate, symbol } = CURRENCY_RATES[currency];
    const converted = amountAed * rate;
    if (converted >= 1_000_000) {
      return `${symbol} ${(converted / 1_000_000).toFixed(2)}M`;
    }
    if (converted >= 1_000) {
      return `${symbol} ${Math.round(converted / 1_000).toLocaleString()}K`;
    }
    return `${symbol} ${Math.round(converted).toLocaleString()}`;
  };

  const annualRentalIncome = (activeDeal.basePriceAed * (customYield / 100));
  const monthlyRentalCashflow = annualRentalIncome / 12;
  const fiveYearCapitalGain =
    activeDeal.basePriceAed * Math.pow(1 + customAppreciation / 100, holdingYears) -
    activeDeal.basePriceAed;
  const total5YearReturn = annualRentalIncome * holdingYears + fiveYearCapitalGain;
  const totalRoiPercent = ((total5YearReturn / activeDeal.basePriceAed) * 100).toFixed(1);

  const isGoldenVisaEligible = activeDeal.basePriceAed >= 2_000_000;

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      toast.success("Private Deal Room link copied to clipboard!");
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  const waReservationLink = `https://wa.me/${brokerPhone.replace(/\D/g, "")}?text=${encodeURIComponent(
    `Hello ${brokerName}, I am in the private Deal Room for ${investorName}. I would like to lock in the reservation for ${activeDeal.name} (${activeDeal.unitType} at ${formatMoney(activeDeal.basePriceAed)}). Please confirm the next steps and escrow allocation.`
  )}`;

  return (
    <div className="min-h-screen bg-[#07090e] text-zinc-100 font-sans selection:bg-amber-500/20 selection:text-amber-200 antialiased pb-28">
      {/* ═══ AMBIENT LUXURY GLOW ═══ */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10" aria-hidden="true">
        <div className="absolute top-0 left-1/4 w-[700px] h-[450px] bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-transparent rounded-full blur-3xl opacity-60" />
        <div className="absolute top-1/3 right-10 w-[550px] h-[550px] bg-gradient-to-bl from-blue-600/8 via-cyan-500/5 to-transparent rounded-full blur-3xl" />
      </div>

      {/* ═══ TOP UTILITY BAR (CONFIDENTIALITY & CURRENCY SWITCHER) ═══ */}
      <header className="border-b border-white/10 bg-black/60 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-black text-black text-sm shadow-md shadow-amber-500/20">
              D
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-tight text-white flex items-center gap-1.5">
                <span>{agencyName}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold border border-amber-500/30">
                  LIVE DEAL ROOM
                </span>
              </span>
              <p className="text-[10px] text-zinc-400 font-mono">
                RERA DLD Verified · Confidential Dossier #{id}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Currency selector */}
            <div className="inline-flex rounded-xl bg-zinc-900/90 p-1 border border-zinc-800 text-xs">
              {(["AED", "USD", "EUR", "GBP"] as Currency[]).map((c) => (
                <button
                  key={c}
                  onClick={() => setCurrency(c)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                    currency === c
                      ? "bg-amber-400 text-black shadow-sm"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            <button
              onClick={handleCopyLink}
              className="hidden sm:inline-flex items-center gap-1.5 h-8 px-3 rounded-xl border border-zinc-700 bg-zinc-900/80 hover:bg-zinc-800 text-xs font-semibold text-zinc-300 transition-all"
              title="Copy private presentation link"
            >
              {isCopied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
              <span>{isCopied ? "Link Copied" : "Share"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* ═══ HERO PRESENTATION BANNER ═══ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-6">
        <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-r from-zinc-950 via-zinc-900/90 to-zinc-950 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl -z-10" />

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-[11px] font-bold uppercase tracking-wider text-amber-300">
                <Lock size={12} />
                <span>Private Allocation Dossier · Exclusively for</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-display">
                {investorName}
              </h1>
              <p className="text-sm text-zinc-400 flex items-center gap-2">
                <span>Investor Nationality: <strong>{investorCountry}</strong></span>
                <span>•</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <ShieldCheck size={14} /> 48-Hour Reservation Hold Active
                </span>
              </p>
            </div>

            {/* Certified Broker Snapshot Card */}
            <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-zinc-900/90 border border-zinc-800/80 shadow-md shrink-0">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-950 border border-amber-400/30 flex items-center justify-center font-bold text-amber-300 font-display text-lg">
                NS
              </div>
              <div className="space-y-0.5 text-xs">
                <p className="font-bold text-white flex items-center gap-1">
                  <span>{brokerName}</span>
                  <CheckCircle2 size={13} className="text-emerald-400" />
                </p>
                <p className="text-[11px] text-zinc-400">{brokerTitle}</p>
                <p className="text-[10px] font-mono text-amber-400 font-semibold">{brokerRera}</p>
              </div>
              <a
                href={`https://wa.me/${brokerPhone.replace(/\D/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 flex items-center justify-center transition-all ml-1"
                title="Direct WhatsApp with Advisor"
              >
                <MessageCircle size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ UNIT COMPARISON TABS (3 CURATED ALLOCATIONS) ═══ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
            <Layers size={15} className="text-amber-400" />
            <span>Select Matching Off-Plan Opportunity:</span>
          </h2>
          <span className="text-xs text-zinc-500 hidden sm:inline">
            3 verified projects shortlisted by advisor
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
                    ? "bg-zinc-900 border-amber-400 ring-2 ring-amber-400/20 shadow-lg scale-[1.01]"
                    : "bg-zinc-950/70 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/60"
                }`}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-amber-400 text-black font-extrabold text-[10px] uppercase tracking-wide">
                    Active Focus
                  </div>
                )}
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-white/10">
                    <img src={deal.heroImage} alt={deal.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-white text-sm truncate">{deal.name}</h3>
                    <p className="text-[11px] text-zinc-400 truncate">{deal.developer} · {deal.location}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase font-semibold block">Price</span>
                    <span className="font-extrabold font-mono text-amber-300 text-sm">
                      {formatMoney(deal.basePriceAed)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-zinc-500 uppercase font-semibold block">Yield / ROI</span>
                    <span className="font-bold text-emerald-400 text-xs">
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ─── LEFT: PROPERTY VISUALS, DLD ESCROW & AMENITIES (7 COLS) ─── */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Visual Carousel Card */}
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 overflow-hidden shadow-xl">
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-zinc-950">
              <img
                src={activeDeal.heroImage}
                alt={activeDeal.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

              {/* Overlaid Badges */}
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-xs font-bold text-white flex items-center gap-1.5">
                  <MapPin size={13} className="text-amber-400" />
                  <span>{activeDeal.location}</span>
                </span>
                {isGoldenVisaEligible && (
                  <span className="px-3 py-1 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-500/40 text-xs font-bold text-amber-300 flex items-center gap-1">
                    <Star size={13} />
                    <span>UAE 10-Yr Golden Visa Eligible</span>
                  </span>
                )}
              </div>

              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                <div>
                  <p className="text-xs font-mono font-semibold text-amber-400 uppercase tracking-wider">
                    {activeDeal.developer} · {activeDeal.developerReputation}
                  </p>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {activeDeal.name}
                  </h2>
                  <p className="text-xs text-zinc-300 mt-1">
                    {activeDeal.unitType} · {activeDeal.areaSqft.toLocaleString()} Sq. Ft.
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs text-zinc-400 uppercase block font-semibold">Handover</span>
                  <span className="text-sm font-bold text-white bg-zinc-900/90 px-2.5 py-1 rounded-xl border border-white/10">
                    {activeDeal.handover}
                  </span>
                </div>
              </div>
            </div>

            {/* DLD Escrow & Regulatory Security Strip */}
            <div className="p-4 sm:p-5 border-t border-zinc-800 bg-zinc-950/80 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div className="space-y-0.5">
                <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">DLD Escrow Account</span>
                <p className="font-mono font-bold text-zinc-200">{activeDeal.escrowAccount}</p>
                <p className="text-[10px] text-zinc-400">{activeDeal.escrowBank}</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Trakheesi Permit</span>
                <p className="font-mono font-bold text-emerald-400">{activeDeal.trakheesiPermit}</p>
                <p className="text-[10px] text-emerald-500 font-semibold flex items-center gap-1">
                  <CheckCircle2 size={11} /> Verified Live with RERA
                </p>
              </div>
              <div className="col-span-2 sm:col-span-1 space-y-1">
                <div className="flex items-center justify-between text-[10px] font-bold">
                  <span className="text-zinc-500 uppercase">Construction Progress</span>
                  <span className="text-amber-400">{activeDeal.readinessProgress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full"
                    style={{ width: `${activeDeal.readinessProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Key Investment Highlights */}
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles size={16} className="text-amber-400" />
              <span>Signature Architectural & Lifestyle Features</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {activeDeal.features.map((feat, i) => (
                <div
                  key={i}
                  className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800/80 flex items-start gap-2.5 text-zinc-300"
                >
                  <CheckCircle2 size={15} className="text-amber-400 shrink-0 mt-0.5" />
                  <span className="leading-snug">{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* DLD Verified Payment Schedule */}
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Clock size={16} className="text-amber-400" />
                <span>Structured Milestone Payment Schedule</span>
              </h3>
              <span className="text-[11px] font-mono text-zinc-400">Escrow Protected</span>
            </div>

            <div className="space-y-3">
              {activeDeal.paymentPlan.map((stage, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-between gap-4 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-center font-bold text-amber-300 font-mono text-xs">
                      {stage.percent}%
                    </div>
                    <div>
                      <p className="font-bold text-white">{stage.milestone}</p>
                      <p className="text-[11px] text-zinc-400">{stage.note}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-mono font-bold text-amber-300 text-sm">
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
          <div className="rounded-3xl border-2 border-amber-400/40 bg-zinc-950 p-6 sm:p-7 shadow-2xl space-y-6 relative overflow-hidden">
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div>
                <h3 className="text-lg font-extrabold text-white flex items-center gap-2 font-display">
                  <TrendingUp size={18} className="text-amber-400" />
                  <span>Real-Time ROI Simulator</span>
                </h3>
                <p className="text-xs text-zinc-400">Engineered specifically for Dubai off-plan yields</p>
              </div>
              <div className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold font-mono">
                {totalRoiPercent}% ROI
              </div>
            </div>

            {/* Interactive Sliders */}
            <div className="space-y-5 text-xs">
              {/* Projected Rental Yield Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-zinc-300">Projected Net Rental Yield</span>
                  <span className="font-mono font-bold text-amber-300 text-sm bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
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
                  className="w-full accent-amber-400 cursor-pointer h-2 bg-zinc-800 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                  <span>Conservative (5.0%)</span>
                  <span>Prime Dubai Average (8.0%)</span>
                  <span>High Yield (12.0%)</span>
                </div>
              </div>

              {/* Capital Appreciation Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-zinc-300">Estimated Annual Capital Appreciation</span>
                  <span className="font-mono font-bold text-emerald-400 text-sm bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
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
                  className="w-full accent-emerald-400 cursor-pointer h-2 bg-zinc-800 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                  <span>Modest (3%)</span>
                  <span>Waterfront Growth (7%)</span>
                  <span>Hyper-Growth (15%)</span>
                </div>
              </div>

              {/* Holding Horizon */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-zinc-300">Investment Holding Horizon</span>
                  <span className="font-mono font-bold text-white text-sm bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                    {holdingYears} Years
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[3, 5, 7, 10].map((yr) => (
                    <button
                      key={yr}
                      onClick={() => setHoldingYears(yr)}
                      className={`py-1.5 rounded-xl text-xs font-bold border transition-all ${
                        holdingYears === yr
                          ? "bg-amber-400 text-black border-amber-400"
                          : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white"
                      }`}
                    >
                      {yr} Yrs
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Calculated Yield Dashboard */}
            <div className="pt-4 border-t border-zinc-800 space-y-3">
              <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400">Monthly Passive Rental Income</span>
                  <span className="font-mono font-bold text-white text-sm">
                    {formatMoney(monthlyRentalCashflow)} / mo
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400">Net Annual Rental Return</span>
                  <span className="font-mono font-bold text-amber-300 text-sm">
                    {formatMoney(annualRentalIncome)} / yr
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400">{holdingYears}-Year Capital Equity Gain</span>
                  <span className="font-mono font-bold text-emerald-400 text-sm">
                    + {formatMoney(fiveYearCapitalGain)}
                  </span>
                </div>
                <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between">
                  <span className="text-xs font-extrabold text-white uppercase tracking-wider">
                    Total Estimated Return
                  </span>
                  <span className="font-mono font-extrabold text-amber-300 text-base">
                    {formatMoney(total5YearReturn)}
                  </span>
                </div>
              </div>

              {/* Zero Tax Notice */}
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-200/90 leading-relaxed flex items-center gap-2">
                <ShieldCheck size={16} className="text-amber-400 shrink-0" />
                <span>
                  <strong>0% Personal Income Tax & 0% Capital Gains Tax</strong> in the UAE. Rental revenue and sales profits remain 100% repatriable.
                </span>
              </div>
            </div>

            {/* Instant Action CTA */}
            <div className="space-y-3 pt-2">
              <a
                href={waReservationLink}
                target="_blank"
                rel="noreferrer"
                className="w-full h-12 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-110 text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 transition-all cursor-pointer"
              >
                <MessageCircle size={18} />
                <span>Reserve Unit with 10% Token on WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  toast.success("DLD Floor Plan & Brochure downloaded.");
                }}
                className="w-full h-10 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 font-bold text-xs flex items-center justify-center gap-2 transition-all"
              >
                <Download size={14} />
                <span>Download Official DLD Floor Plan (PDF)</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* ═══ STICKY BOTTOM ACTION STRIP (MOBILE + DESKTOP) ═══ */}
      <div className="fixed bottom-0 inset-x-0 bg-black/90 backdrop-blur-xl border-t border-white/10 p-3.5 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="hidden sm:block">
            <p className="text-xs font-bold text-white">{activeDeal.name} · {activeDeal.unitType}</p>
            <p className="text-[11px] font-mono text-amber-400 font-semibold">
              Allocation Price: {formatMoney(activeDeal.basePriceAed)} ({activeDeal.defaultRentalYield}% Yield)
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <a
              href={`tel:${brokerPhone}`}
              className="h-10 px-4 rounded-xl border border-zinc-700 bg-zinc-900 text-white font-bold text-xs flex items-center gap-1.5 hover:bg-zinc-800 transition-all shrink-0"
            >
              <Phone size={14} />
              <span className="hidden sm:inline">Call Advisor</span>
            </a>

            <a
              href={waReservationLink}
              target="_blank"
              rel="noreferrer"
              className="h-10 px-5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20 w-full sm:w-auto"
            >
              <MessageCircle size={15} />
              <span>Lock Reservation · WhatsApp</span>
              <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
