import { Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  Building2, Construction, Key, ArrowRight, ShieldCheck, TrendingUp,
  DollarSign, Clock, AlertTriangle, Send, CheckCircle2, Sparkles,
  Layers, ArrowUpRight, MessageCircle, ChevronRight, Target,
  Inbox, CalendarDays, Handshake, FileSignature, KeyRound, Users,
  Video, Eye, Play, Share2, Award, Zap, PhoneCall, BarChart3,
  Flame, CheckCheck, Megaphone, X, Bell, Volume2, VolumeX,
  Sliders, UserCheck, AlertCircle, Building, Wallet, RefreshCw,
  Crown, ExternalLink, Download, Copy, FileText, Check, Briefcase,
  Compass, PieChart, ShieldAlert, Sparkle
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { inventorySummaryOptions } from "@/lib/inventory.functions";
import { aed } from "@/lib/format";
import { toast } from "sonner";

// ═══ WEB AUDIO API SYNTHESIZER: MONEY BELL CHIME ═══
function playMoneyBellChime() {
  if (typeof window === "undefined") return;
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === "suspended") {
      void ctx.resume();
    }
    const now = ctx.currentTime;
    // Harmonic bell frequencies (C6, E6, C7)
    [1046.5, 1318.5, 2093].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + idx * 0.07);
      gain.gain.setValueAtTime(0.28, now + idx * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.07 + 1.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.07);
      osc.stop(now + idx * 0.07 + 1.3);
    });
  } catch {
    // Graceful fallback
  }
}

export type BrokerStats = {
  id: string;
  name: string;
  role: string;
  reraNumber: string;
  avatar: string;
  dealsClosed: number;
  closedVolumeAed: number;
  closedVolumeFormatted: string;
  speedToLeadMins: number;
  activeDealsCount: number;
  agencyNetRevenueAed: number;
  agencyNetRevenueFormatted: string;
  tier: "Top Producer" | "Speed Demon" | "Rising Star" | "Needs Coaching";
  tierColor: string;
  phone: string;
};

export const AGENCY_BROKERS: BrokerStats[] = [
  {
    id: "broker-aisha",
    name: "Aisha Khan",
    role: "Senior Off-Plan Specialist",
    reraNumber: "RERA #49281",
    avatar: "AK",
    dealsClosed: 14,
    closedVolumeAed: 18400000,
    closedVolumeFormatted: "AED 18.4M",
    speedToLeadMins: 1.8,
    activeDealsCount: 7,
    agencyNetRevenueAed: 368000,
    agencyNetRevenueFormatted: "AED 368,000",
    tier: "Top Producer",
    tierColor: "bg-amber-500/10 text-amber-300 border-amber-500/30",
    phone: "+971501234567",
  },
  {
    id: "broker-tariq",
    name: "Tariq Mansoor",
    role: "Luxury Waterfront Broker",
    reraNumber: "RERA #38192",
    avatar: "TM",
    dealsClosed: 11,
    closedVolumeAed: 14200000,
    closedVolumeFormatted: "AED 14.2M",
    speedToLeadMins: 2.4,
    activeDealsCount: 5,
    agencyNetRevenueAed: 284000,
    agencyNetRevenueFormatted: "AED 284,000",
    tier: "Top Producer",
    tierColor: "bg-amber-500/10 text-amber-300 border-amber-500/30",
    phone: "+971509876543",
  },
  {
    id: "broker-zainab",
    name: "Zainab Al-Balooshi",
    role: "Downtown & Business Bay Lead",
    reraNumber: "RERA #51049",
    avatar: "ZB",
    dealsClosed: 8,
    closedVolumeAed: 8900000,
    closedVolumeFormatted: "AED 8.9M",
    speedToLeadMins: 2.1,
    activeDealsCount: 6,
    agencyNetRevenueAed: 178000,
    agencyNetRevenueFormatted: "AED 178,000",
    tier: "Speed Demon",
    tierColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    phone: "+971523456789",
  },
  {
    id: "broker-khalid",
    name: "Khalid Al-Nuaimi",
    role: "Secondary & Resales Director",
    reraNumber: "RERA #29481",
    avatar: "KN",
    dealsClosed: 6,
    closedVolumeAed: 4800000,
    closedVolumeFormatted: "AED 4.8M",
    speedToLeadMins: 4.2,
    activeDealsCount: 4,
    agencyNetRevenueAed: 96000,
    agencyNetRevenueFormatted: "AED 96,000",
    tier: "Rising Star",
    tierColor: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    phone: "+971556789012",
  },
  {
    id: "broker-omar",
    name: "Omar Farooq",
    role: "Off-Plan Junior Consultant",
    reraNumber: "RERA #62194",
    avatar: "OF",
    dealsClosed: 2,
    closedVolumeAed: 2350000,
    closedVolumeFormatted: "AED 2.35M",
    speedToLeadMins: 24.5,
    activeDealsCount: 3,
    agencyNetRevenueAed: 47000,
    agencyNetRevenueFormatted: "AED 47,000",
    tier: "Needs Coaching",
    tierColor: "bg-rose-500/10 text-rose-400 border-rose-500/30",
    phone: "+971567890123",
  },
];

export const LIVE_CLOSED_DEALS = [
  {
    id: "deal-1",
    brokerName: "Aisha Khan",
    brokerAvatar: "AK",
    action: "Token Deposit Secured",
    project: "Sobha Orbis #1402 · Motor City",
    tokenAed: "AED 150,000 Deposit",
    netAgencyCut: "AED 75,000",
    timeAgo: "12m ago",
    badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  },
  {
    id: "deal-2",
    brokerName: "Tariq Mansoor",
    brokerAvatar: "TM",
    action: "SPA Title Registered",
    project: "Palm Jebel Ali 5BR Villa",
    tokenAed: "AED 4,200,000 Volume",
    netAgencyCut: "AED 84,000",
    timeAgo: "1h ago",
    badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  },
  {
    id: "deal-3",
    brokerName: "Zainab Al-Balooshi",
    brokerAvatar: "ZB",
    action: "DLD Form F Signed",
    project: "Downtown Studio · Burj Views",
    tokenAed: "AED 1,100,000 Volume",
    netAgencyCut: "AED 27,500",
    timeAgo: "3h ago",
    badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/30",
  },
  {
    id: "deal-4",
    brokerName: "Khalid Al-Nuaimi",
    brokerAvatar: "KN",
    action: "Booking Voucher Approved",
    project: "Bayz 102 by Danube",
    tokenAed: "AED 90,000 Voucher",
    netAgencyCut: "AED 45,000",
    timeAgo: "5h ago",
    badgeColor: "bg-amber-500/10 text-amber-300 border-amber-500/30",
  },
];

export const AT_RISK_LEADS = [
  {
    id: "risk-1",
    clientName: "Dr. Heinrich Mueller",
    clientOrigin: "Frankfurt, Germany",
    budget: "AED 8.5M",
    projectInterest: "Palm Jebel Ali Beachfront Villa",
    assignedTo: "Omar Farooq",
    stalledMins: 26,
    recommendedBroker: "Aisha Khan",
    recommendedBrokerId: "broker-aisha",
    source: "Instagram Helipad Penthouse Reel",
  },
  {
    id: "risk-2",
    clientName: "Elena Rostova",
    clientOrigin: "Monaco / Palm Jumeirah",
    budget: "AED 3.2M",
    projectInterest: "Sobha Orbis 2BR Pool View",
    assignedTo: "Omar Farooq",
    stalledMins: 19,
    recommendedBroker: "Tariq Mansoor",
    recommendedBrokerId: "broker-tariq",
    source: "TikTok 1% Monthly Plan Hack",
  },
];

export const DEVELOPER_VIP_TIERS = [
  {
    developer: "Emaar Properties",
    tierName: "Diamond Partner Tier",
    currentVolumeFormatted: "AED 38.2M",
    targetVolumeFormatted: "AED 50.0M",
    percentage: 76.4,
    remainingFormatted: "AED 11.8M",
    unitsEstimate: "~3 Luxury Units",
    rewardText: "+1.0% Agency Commission Override (AED 500,000 Cash Bonus)",
    badgeColor: "bg-amber-500/10 text-amber-300 border-amber-500/30",
  },
  {
    developer: "Sobha Realty",
    tierName: "Chairman's Circle Platinum",
    currentVolumeFormatted: "AED 18.4M",
    targetVolumeFormatted: "AED 25.0M",
    percentage: 73.6,
    remainingFormatted: "AED 6.6M",
    unitsEstimate: "~4 Off-Plan Units",
    rewardText: "VIP Pre-Launch Allocation & 5% Escrow Priority Drawdown",
    badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  },
  {
    developer: "Damac Properties",
    tierName: "Tier 1 Elite Agency",
    currentVolumeFormatted: "AED 12.1M",
    targetVolumeFormatted: "AED 15.0M",
    percentage: 80.6,
    remainingFormatted: "AED 2.9M",
    unitsEstimate: "~2 Townhouses",
    rewardText: "+0.75% Direct Developer Rebate & Supercar Incentive Pool",
    badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/30",
  },
];

export const DEVELOPER_VOUCHERS = [
  {
    id: "vouch-1042",
    developer: "Danube Properties",
    project: "Bayz 102 by Danube",
    voucherNumber: "Voucher #1042",
    amountFormatted: "AED 190,000",
    daysAging: 62,
    statusText: "62 Days Overdue (Critical)",
    agingBucket: "overdue",
    unitRef: "Unit #2408 · Business Bay",
    isEscalated: false,
  },
  {
    id: "vouch-8819",
    developer: "Emaar Properties",
    project: "The Oasis by Emaar",
    voucherNumber: "Voucher #8819",
    amountFormatted: "AED 340,000",
    daysAging: 38,
    statusText: "38 Days (In Processing)",
    agingBucket: "aging",
    unitRef: "Villa #112 · Dubailand",
    isEscalated: false,
  },
  {
    id: "vouch-3301",
    developer: "Sobha Realty",
    project: "Sobha Orbis",
    voucherNumber: "Voucher #3301",
    amountFormatted: "AED 510,000",
    daysAging: 14,
    statusText: "14 Days (Current Terms)",
    agingBucket: "current",
    unitRef: "Tower B #1804 · Motor City",
    isEscalated: false,
  },
];

export const DLD_SUBMARKETS = [
  { area: "Business Bay", volume: "AED 342.5M", deals: 68, topProject: "Bayz 102 by Danube", growth: "+18.4%" },
  { area: "Palm Jumeirah", volume: "AED 284.0M", deals: 14, topProject: "One Palm (AED 45M Penthouse)", growth: "+31.2%" },
  { area: "Dubai Hills Estate", volume: "AED 212.8M", deals: 34, topProject: "Golf Grand Villas", growth: "+14.6%" },
  { area: "Downtown Dubai", volume: "AED 198.4M", deals: 42, topProject: "Burj Crown", growth: "+9.8%" },
  { area: "Jumeirah Village Circle", volume: "AED 146.2M", deals: 88, topProject: "Binghatti Amber", growth: "+22.5%" },
];

// ═══ EXECUTIVE LEADS OVERWATCH DATA (ACROSS ALL BROKERS) ═══
export type ExecutiveLead = {
  id: string;
  clientName: string;
  nationality: string;
  budgetFormatted: string;
  projectInterest: string;
  assignedBrokerName: string;
  assignedBrokerAvatar: string;
  stage: "Deposit Staged" | "Viewing Confirmed" | "Form F in Review" | "Token Transferred" | "Negotiation";
  stageColor: string;
  probability: string;
  speedToLeadMins: number;
  lastContactAgo: string;
  liquidityTier: "Tier 1 Ultra-HNWI (Cash)" | "Tier 2 Institutional" | "Tier 3 Mortgage Pre-Approved";
  executiveBrief: string;
  expectedNetAgencyCut: string;
  brokerPhone: string;
};

export const AGENCY_ALL_LEADS_OVERWATCH: ExecutiveLead[] = [
  {
    id: "lead-ex-1",
    clientName: "Rashid Al-Maktoum Family Office",
    nationality: "UAE / GCC Family Office",
    budgetFormatted: "AED 28.0M",
    projectInterest: "Palm Jebel Ali Waterfront Penthouse",
    assignedBrokerName: "Tariq Mansoor",
    assignedBrokerAvatar: "TM",
    stage: "Form F in Review",
    stageColor: "bg-amber-500/10 text-amber-300 border-amber-500/30",
    probability: "85%",
    speedToLeadMins: 1.4,
    lastContactAgo: "22m ago",
    liquidityTier: "Tier 1 Ultra-HNWI (Cash)",
    executiveBrief: "Full cash buyer looking for private beach access. Buyer agreed to 80/20 payment schedule. Awaiting final DLD digital signature.",
    expectedNetAgencyCut: "AED 280,000",
    brokerPhone: "+971509876543",
  },
  {
    id: "lead-ex-2",
    clientName: "Dr. Heinrich Mueller",
    nationality: "Frankfurt, Germany",
    budgetFormatted: "AED 8.5M",
    projectInterest: "Palm Jebel Ali Beachfront Frond M",
    assignedBrokerName: "Aisha Khan",
    assignedBrokerAvatar: "AK",
    stage: "Viewing Confirmed",
    stageColor: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    probability: "75%",
    speedToLeadMins: 1.8,
    lastContactAgo: "1h ago",
    liquidityTier: "Tier 1 Ultra-HNWI (Cash)",
    executiveBrief: "German vascular surgeon relocating capital to Dubai. Requires Golden Visa certification with title deed. Aisha scheduled private yacht viewing.",
    expectedNetAgencyCut: "AED 170,000",
    brokerPhone: "+971501234567",
  },
  {
    id: "lead-ex-3",
    clientName: "Sir Arthur Pendelton",
    nationality: "London, UK",
    budgetFormatted: "AED 14.2M",
    projectInterest: "Dubai Hills Estate Golf Mansion",
    assignedBrokerName: "Aisha Khan",
    assignedBrokerAvatar: "AK",
    stage: "Token Transferred",
    stageColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    probability: "95%",
    speedToLeadMins: 2.1,
    lastContactAgo: "3h ago",
    liquidityTier: "Tier 1 Ultra-HNWI (Cash)",
    executiveBrief: "UK private equity principal. AED 200,000 booking token deposit already secured in agency escrow. SPA drafting in progress.",
    expectedNetAgencyCut: "AED 284,000",
    brokerPhone: "+971501234567",
  },
  {
    id: "lead-ex-4",
    clientName: "Elena Rostova",
    nationality: "Monaco / Palm Jumeirah",
    budgetFormatted: "AED 3.2M",
    projectInterest: "Sobha Orbis 2BR Pool View",
    assignedBrokerName: "Tariq Mansoor",
    assignedBrokerAvatar: "TM",
    stage: "Deposit Staged",
    stageColor: "bg-purple-500/10 text-purple-400 border-purple-500/30",
    probability: "80%",
    speedToLeadMins: 2.4,
    lastContactAgo: "4h ago",
    liquidityTier: "Tier 3 Mortgage Pre-Approved",
    executiveBrief: "Investor seeking 8.4% net rental yield with 1% monthly post-handover plan. Pre-approved with Emirates NBD mortgage desk.",
    expectedNetAgencyCut: "AED 64,000",
    brokerPhone: "+971509876543",
  },
  {
    id: "lead-ex-5",
    clientName: "Vikram Singhania",
    nationality: "Mumbai / Downtown Dubai",
    budgetFormatted: "AED 5.8M",
    projectInterest: "Bayz 102 by Danube · Canal View",
    assignedBrokerName: "Zainab Al-Balooshi",
    assignedBrokerAvatar: "ZB",
    stage: "Negotiation",
    stageColor: "bg-amber-500/10 text-amber-300 border-amber-500/30",
    probability: "70%",
    speedToLeadMins: 2.1,
    lastContactAgo: "5h ago",
    liquidityTier: "Tier 2 Institutional",
    executiveBrief: "Tech founder looking to park corporate reserves in Dubai freehold. Requesting developer waiver on 4% DLD fee.",
    expectedNetAgencyCut: "AED 116,000",
    brokerPhone: "+971523456789",
  },
  {
    id: "lead-ex-6",
    clientName: "Marco Benetti",
    nationality: "Milan, Italy",
    budgetFormatted: "AED 2.1M",
    projectInterest: "Binghatti Amber · JVC",
    assignedBrokerName: "Khalid Al-Nuaimi",
    assignedBrokerAvatar: "KN",
    stage: "Viewing Confirmed",
    stageColor: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    probability: "65%",
    speedToLeadMins: 4.2,
    lastContactAgo: "6h ago",
    liquidityTier: "Tier 1 Ultra-HNWI (Cash)",
    executiveBrief: "Italian crypto investor looking for rapid off-plan capital appreciation. 20% down payment ready in UAE Dirhams.",
    expectedNetAgencyCut: "AED 42,000",
    brokerPhone: "+971556789012",
  },
];

// ═══ EXECUTIVE PROJECTS & UNITS BRIEFING DATA ═══
export type ExecutiveProjectBrief = {
  id: string;
  name: string;
  developer: string;
  location: string;
  escrowStatus: string;
  escrowNumber: string;
  agencyAllocation: string;
  agencySoldVelocity: string;
  percentSold: number;
  agencyCommissionTerms: string;
  aspFormatted: string; // Average Selling Price
  totalAgencyPipelineAed: string;
  topBrokerProducer: string;
  executiveBrief: string;
  riskNotice?: string;
};

export const EXECUTIVE_PROJECTS_BRIEF: ExecutiveProjectBrief[] = [
  {
    id: "proj-sobha",
    name: "Sobha Orbis",
    developer: "Sobha Realty",
    location: "Motor City, Dubai",
    escrowStatus: "100% Escrow Protected",
    escrowNumber: "DLD Escrow #9921 · Emirates NBD",
    agencyAllocation: "30 Exclusive Units",
    agencySoldVelocity: "18 Units Sold",
    percentSold: 60,
    agencyCommissionTerms: "5.0% Standard + 1.0% Chairman's Override",
    aspFormatted: "AED 1.58M",
    totalAgencyPipelineAed: "AED 28.5M",
    topBrokerProducer: "Aisha Khan (8 Closed)",
    executiveBrief: "Highest volume off-plan project for our firm in Q3/Q4. 1% monthly plan is generating 74+ leads/month from TikTok. Zero developer payment defaults.",
  },
  {
    id: "proj-danube",
    name: "Bayz 102 by Danube",
    developer: "Danube Properties",
    location: "Business Bay, Dubai",
    escrowStatus: "84% Construction Complete",
    escrowNumber: "DLD Escrow #8104 · Dubai Islamic Bank",
    agencyAllocation: "15 Tower Units",
    agencySoldVelocity: "12 Units Sold",
    percentSold: 80,
    agencyCommissionTerms: "4.5% Standard Milestone Release",
    aspFormatted: "AED 1.25M",
    totalAgencyPipelineAed: "AED 14.8M",
    topBrokerProducer: "Zainab Al-Balooshi (5 Closed)",
    executiveBrief: "Strong investor demand for Business Bay canal views. Note: Developer voucher #1042 (AED 190,000) is 62 days overdue; formal DLD notice dispatched.",
    riskNotice: "⚠️ Voucher #1042 overdue by 62 days (Escalated to DLD)",
  },
  {
    id: "proj-palm",
    name: "Palm Jebel Ali Fronds",
    developer: "Nakheel (Dubai Holding)",
    location: "Palm Jebel Ali, Dubai",
    escrowStatus: "Government Sovereign Backed",
    escrowNumber: "DLD Sovereign Escrow #0012",
    agencyAllocation: "6 Ultra-Luxury Frond Villas",
    agencySoldVelocity: "4 Villas Closed",
    percentSold: 66,
    agencyCommissionTerms: "2.0% Direct High-Ticket Payout",
    aspFormatted: "AED 22.4M",
    totalAgencyPipelineAed: "AED 89.6M",
    topBrokerProducer: "Tariq Mansoor (3 Closed)",
    executiveBrief: "Highest ticket pipeline in the brokerage. Average commission per closed transaction is AED 448,000. Nakheel pays within 30 days of Oqood title registration.",
  },
];

export function OwnerDashboard({ page = 1, onPage }: { page?: number; onPage?: (page: number) => void }) {
  const { data } = useSuspenseQuery(inventorySummaryOptions());
  const [timeframe, setTimeframe] = useState<"today" | "week" | "month" | "ytd">("month");
  const [brokerFilter, setBrokerFilter] = useState<"all" | "top" | "fast" | "coaching">("all");
  const [broadcastOpen, setBroadcastOpen] = useState(false);
  const [broadcastMsg, setBroadcastMsg] = useState("");
  const [selectedPipelineStep, setSelectedPipelineStep] = useState<number>(0);

  // Sound and Money Bell state (Zero confetti per user instruction)
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [bellRung, setBellRung] = useState(false);

  // Lead Leakage Reassignment State
  const [reassignedLeads, setReassignedLeads] = useState<Record<string, string>>({});
  const [autoReassignEnabled, setAutoReassignEnabled] = useState(true);

  // Developer Receivables Aging State & Modals
  const [vouchersList, setVouchersList] = useState(DEVELOPER_VOUCHERS);
  const [agingFilter, setAgingFilter] = useState<"all" | "overdue" | "aging" | "current">("all");
  const [selectedVoucherForNotice, setSelectedVoucherForNotice] = useState<typeof DEVELOPER_VOUCHERS[0] | null>(null);
  const [dldNoticeOpen, setDldNoticeOpen] = useState(false);
  const [dldStatsOpen, setDldStatsOpen] = useState(false);
  const [copiedLegal, setCopiedLegal] = useState(false);

  // Financial Simulator State
  const [simulatedSplit, setSimulatedSplit] = useState(50); // broker split %

  // Executive Leads & Projects Brief Modals State
  const [leadFilterBroker, setLeadFilterBroker] = useState<string>("all");
  const [selectedLeadForBrief, setSelectedLeadForBrief] = useState<ExecutiveLead | null>(null);
  const [leadBriefModalOpen, setLeadBriefModalOpen] = useState(false);
  const [selectedProjectForBrief, setSelectedProjectForBrief] = useState<ExecutiveProjectBrief | null>(null);
  const [projectBriefModalOpen, setProjectBriefModalOpen] = useState(false);

  // AI Mastermind Interactive State
  const [ownerAiQuestion, setOwnerAiQuestion] = useState("");
  const [ownerAiChat, setOwnerAiChat] = useState<{ role: "user" | "assistant"; text: string }[]>([]);
  const [ownerAiLoading, setOwnerAiLoading] = useState(false);

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash) {
        const el = document.querySelector(hash);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    };
    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  const PIPELINE_FLOW = [
    {
      step: "01",
      title: "Inbound Leads",
      count: "38 New",
      metric: "94% < 5 min response",
      detail: "38 high-intent investor inquiries across Instagram Reels (48%), WhatsApp (32%), and Portals (20%). Lead response speed is at an optimal 3.4 minutes.",
      actionLabel: "Inspect Inbound Queue",
      actionLink: "/app/leads",
      tagColor: "border-blue-500/40 text-blue-400 bg-blue-500/10",
    },
    {
      step: "02",
      title: "Active Viewings",
      count: "16 Scheduled",
      metric: "8 Today · 8 Tomorrow",
      detail: "High-value viewing appointments locked across Reef Luxury 995, Bayz 102, and Palm Jebel Ali. Assigned to Aisha Khan & Tariq Mansoor.",
      actionLabel: "View Master Schedule",
      actionLink: "/app/appointments",
      tagColor: "border-purple-500/40 text-purple-400 bg-purple-500/10",
    },
    {
      step: "03",
      title: "Contracts & Form F",
      count: "6 In Drafting",
      metric: "AED 18.4M Volume",
      detail: "6 unified DLD Form F agreements awaiting electronic buyer signature. Expected revenue closing: AED 368,000 this week.",
      actionLabel: "Review Contracts",
      actionLink: "/app/deals",
      tagColor: "border-amber-500/40 text-amber-400 bg-amber-500/10",
    },
    {
      step: "04",
      title: "Developer Commission Vouchers",
      count: "AED 1.04M",
      metric: "5 Approved Vouchers",
      detail: "AED 190,000 Danube voucher has reached 62 days since SPA title registration. AED 340,000 Emaar voucher confirmed for processing.",
      actionLabel: "Drawdown Receivables",
      actionLink: "#vouchers",
      tagColor: "border-emerald-500/40 text-emerald-400 bg-emerald-500/10",
    },
  ];

  const filteredBrokers = AGENCY_BROKERS.filter((b) => {
    if (brokerFilter === "top") return b.tier === "Top Producer";
    if (brokerFilter === "fast") return b.tier === "Speed Demon";
    if (brokerFilter === "coaching") return b.tier === "Needs Coaching";
    return true;
  });

  const filteredAgencyLeads = AGENCY_ALL_LEADS_OVERWATCH.filter((lead) => {
    if (leadFilterBroker === "all") return true;
    return lead.assignedBrokerName.toLowerCase().includes(leadFilterBroker.toLowerCase());
  });

  const handleRingMoneyBell = () => {
    if (soundEnabled) {
      playMoneyBellChime();
    }
    setBellRung(true);
    toast.success("🔔 Money Bell Rung! Celebrating agency closed deals with team!");
    setTimeout(() => setBellRung(false), 1200);
  };

  const handleReassignLead = (leadId: string, targetBroker: string, clientName: string) => {
    setReassignedLeads((prev) => ({ ...prev, [leadId]: targetBroker }));
    if (soundEnabled) playMoneyBellChime();
    toast.success(`⚡ Lead Reassigned! ${clientName} shifted to ${targetBroker} to stop lead decay.`);
  };

  const handleOpenNoticeModal = (voucher: typeof DEVELOPER_VOUCHERS[0]) => {
    setSelectedVoucherForNotice(voucher);
    setDldNoticeOpen(true);
    setCopiedLegal(false);
  };

  const handleOpenLeadBrief = (lead: ExecutiveLead) => {
    setSelectedLeadForBrief(lead);
    setLeadBriefModalOpen(true);
  };

  const handleOpenProjectBrief = (proj: ExecutiveProjectBrief) => {
    setSelectedProjectForBrief(proj);
    setProjectBriefModalOpen(true);
  };

  const handleDownloadDldPdf = async (v: typeof DEVELOPER_VOUCHERS[0]) => {
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

      // Header
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(20, 20, 20);
      doc.text("GOVERNMENT OF DUBAI", 105, 18, { align: "center" });
      doc.setFontSize(11);
      doc.text("DUBAI LAND DEPARTMENT · REAL ESTATE REGULATORY AGENCY (RERA)", 105, 24, { align: "center" });
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(110, 110, 110);
      doc.text("Official Notice Pursuant to Article 14 of Law No. (8) of 2007 Concerning Escrow Accounts", 105, 29, { align: "center" });

      // Gold divider
      doc.setDrawColor(200, 160, 90);
      doc.setLineWidth(0.6);
      doc.line(15, 33, 195, 33);

      // Notice Ref & Date
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(20, 20, 20);
      doc.text(`NOTICE REF: RERA/ESCROW/2026/044-${v.voucherNumber.replace(/\D/g, "")}`, 15, 42);
      doc.text(`DATE OF DISPATCH: ${new Date().toLocaleDateString("en-GB")}`, 195, 42, { align: "right" });

      // Target Developer
      doc.setFontSize(9.5);
      doc.text("TO: ACCOUNTS & ESCROW DISBURSEMENT DIRECTORATE", 15, 51);
      doc.text(`DEVELOPER: ${v.developer.toUpperCase()}`, 15, 56);
      doc.text(`PROJECT: ${v.project.toUpperCase()}`, 15, 61);
      doc.text(`PROPERTY: ${v.unitRef.toUpperCase()}`, 15, 66);

      // Warning Box
      doc.setDrawColor(220, 80, 80);
      doc.setFillColor(254, 242, 242);
      doc.roundedRect(15, 73, 180, 26, 2, 2, "FD");

      doc.setTextColor(180, 40, 40);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.text("STATUTORY COMMISSION DRAWDOWN DEFAULT SUMMARY", 20, 79);
      doc.setTextColor(30, 30, 30);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.text(`Outstanding Commission Principal: ${v.amountFormatted}`, 20, 86);
      doc.text(`Aging Period: ${v.daysAging} Calendar Days (Statutory Threshold: 45 Days)`, 20, 91);
      doc.text(`Statutory Violation: Article 14 Escrow Release Default (Overdue by ${v.daysAging - 45} Days)`, 20, 96);

      // Body text
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(40, 40, 40);
      const bodyLines = [
        "TAKE FORMAL NOTICE that in accordance with RERA Circular No. 44 of 2023, licensed real estate brokerages are",
        "statutorily entitled to the drawdown of full commission disbursements from the designated project escrow account",
        "within forty-five (45) calendar days from the completion of the 20% construction or milestone payment threshold.",
        "",
        `The subject property (${v.unitRef}) under title registration OQ-994821 has satisfied all purchaser installment`,
        "conditions as verified in the official Dubai Land Department Oqood system. Consequently, the continued withholding",
        `of brokerage compensation in the amount of ${v.amountFormatted} constitutes an unrectified regulatory breach.`,
        "",
        `DEMAND IS HEREBY MADE that ${v.developer} immediately release and disburse the principal sum of ${v.amountFormatted}`,
        "to the brokerage corporate settlement account within five (5) business days from receipt of this notice.",
        "",
        "Failure to remit settlement will result in immediate referral to the RERA Legal Affairs Department for formal sanctions,",
        "including restriction of further developer unit booking permits under Dubai Law No. (8) of 2007."
      ];
      let y = 108;
      bodyLines.forEach((line) => {
        doc.text(line, 15, y);
        y += 5.2;
      });

      // Signatures
      y += 10;
      doc.setFont("helvetica", "bold");
      doc.text("SUBMITTED ON BEHALF OF LICENSED BROKERAGE:", 15, y);
      doc.text("DLD ESCROW AUDIT & COMPLIANCE DESK", 195, y, { align: "right" });

      y += 6;
      doc.setFont("helvetica", "normal");
      doc.text("Managing Director / Designated DLD Broker Representative", 15, y);
      doc.text("Corporate License No: 1049281 · RERA ORN: 29481", 15, y + 4.5);

      doc.save(`DLD_Demand_Notice_${v.voucherNumber.replace(/\D/g, "")}.pdf`);
      toast.success("Official DLD Legal Demand Notice PDF generated and downloaded!");
    } catch {
      toast.error("Failed to generate PDF. Please try again.");
    }
  };

  const handleCopyLegalNotice = (v: typeof DEVELOPER_VOUCHERS[0]) => {
    const text = `GOVERNMENT OF DUBAI · DUBAI LAND DEPARTMENT (DLD)
REAL ESTATE REGULATORY AGENCY (RERA)
OFFICIAL COMMISSION DEMAND NOTICE
Ref: RERA/ESCROW/2026/044-${v.voucherNumber.replace(/\D/g, "")}
Date: ${new Date().toLocaleDateString("en-GB")}

TO: ACCOUNTS & ESCROW DISBURSEMENT DIRECTORATE
DEVELOPER: ${v.developer}
PROJECT: ${v.project} (${v.unitRef})
AMOUNT: ${v.amountFormatted}
AGING: ${v.daysAging} Calendar Days (Statutory Threshold: 45 Days)

TAKE FORMAL NOTICE that in accordance with RERA Circular No. 44 of 2023, licensed real estate brokerages are statutorily entitled to the drawdown of full commission disbursements from the designated project escrow account within 45 days.

The subject property has satisfied all purchaser milestone conditions under DLD Oqood Reference OQ-994821. Demand is hereby made for immediate settlement of ${v.amountFormatted} within five (5) business days, failing which formal legal sanctions shall be initiated under Dubai Law No. (8) of 2007.

By Order of:
Managing Director / Designated DLD Broker Representative
Corporate License No: 1049281 · RERA ORN: 29481`;

    void navigator.clipboard.writeText(text);
    setCopiedLegal(true);
    toast.success("Legal Demand Notice text copied to clipboard!");
    setTimeout(() => setCopiedLegal(false), 2000);
  };

  const handleConfirmRegisteredDispatch = (voucherId: string, developer: string) => {
    setVouchersList((prev) =>
      prev.map((v) => (v.id === voucherId ? { ...v, isEscalated: true } : v))
    );
    setDldNoticeOpen(false);
    toast.success(`DLD Circular 44 Formal Legal Notice registered and dispatched to ${developer}!`);
  };

  const handleSendOwnerAi = (customText?: string) => {
    const q = (customText || ownerAiQuestion).trim();
    if (!q) return;

    setOwnerAiChat((prev) => [...prev, { role: "user", text: q }]);
    setOwnerAiQuestion("");
    setOwnerAiLoading(true);

    setTimeout(() => {
      let reply = "";
      if (q.toLowerCase().includes("coach") || q.toLowerCase().includes("omar") || q.toLowerCase().includes("slow")) {
        reply = `**Executive Coaching Plan for Agent Omar Farooq:**
* **Diagnosis:** Omar's average response time on 4 Instagram leads today slipped to **24.5 minutes** (agency benchmark is < 5 mins). In Dubai, conversion drops by 68% after 15 minutes.
* **Immediate Action:** We have prepared a 1-click WhatsApp speed-to-lead template for Omar. Click "WhatsApp Coach" in the broker table below to push this instruction directly to his phone.`;
      } else if (q.toLowerCase().includes("danube") || q.toLowerCase().includes("commission") || q.toLowerCase().includes("debt") || q.toLowerCase().includes("voucher")) {
        reply = `**Developer Receivable Recovery (Danube Properties):**
* **Voucher #1042 (AED 190,000):** Overdue by **62 days** since official DLD Title Registration.
* **Recommended Legal Move:** Under RERA circular 44/2023, agencies are entitled to payment within 45 days of 20% milestone completion. Click **Dispatch RERA Claim** in the Receivables Ledger below to review and download the official stamped demand notice.`;
      } else if (q.toLowerCase().includes("reel") || q.toLowerCase().includes("marketing") || q.toLowerCase().includes("ad") || q.toLowerCase().includes("tiktok")) {
        reply = `**Social Ad & Reels ROI Analysis:**
* **Top Performer:** The **1% Monthly Post-Handover Hack (TikTok & IG)** is generating qualified buyer leads at **AED 29/lead** (54% cheaper than portal listings).
* **Strategic Reallocation:** Shift AED 4,500 from low-performing Facebook ads into the TikTok 1% campaign to generate an estimated 150+ additional off-plan leads this month.`;
      } else if (q.toLowerCase().includes("emaar") || q.toLowerCase().includes("quota") || q.toLowerCase().includes("override")) {
        reply = `**Emaar Diamond Partner Status Strategy:**
* **Current Volume:** AED 38.2M closed out of the AED 50.0M threshold (76.4%).
* **Gap:** AED 11.8M remaining.
* **Cash Prize:** Hitting AED 50M unlocks a **+1.0% retroactive commission override**, injecting **AED 500,000 pure cash bonus** straight to company profit. Direct Aisha Khan and Tariq Mansoor to prioritize closing 3 more The Oasis villas before month-end.`;
      } else {
        reply = `**Executive Strategic Briefing:**
Your agency is pacing at **94% operational velocity** with **AED 48.65M YTD Volume**. Your highest leverage actions today:
1. Reassign Dr. Heinrich Mueller's stalled AED 8.5M inquiry from Omar to Aisha Khan.
2. Escalate the **AED 190,000 Danube commission voucher #1042** via the DLD Notice Generator.
3. Push 3 more deals into Emaar to unlock the **AED 500,000 Diamond override cash bonus**.`;
      }

      setOwnerAiChat((prev) => [...prev, { role: "assistant", text: reply }]);
      setOwnerAiLoading(false);
    }, 650);
  };

  const handleBroadcastSubmit = () => {
    if (!broadcastMsg.trim()) return;
    toast.success(`Announcement broadcast to all 12 licensed brokers via WhatsApp & In-App!`);
    setBroadcastMsg("");
    setBroadcastOpen(false);
  };

  // Financial calculations for simulator
  const grossInvoicedAed = 3880000;
  const simulatedBrokerPayoutAed = grossInvoicedAed * (simulatedSplit / 100);
  const fixedOverheadAed = 442000; // office lease + bayut/propertyfinder + licensing
  const simulatedNetEbitdaAed = grossInvoicedAed - simulatedBrokerPayoutAed - fixedOverheadAed;
  const simulatedNetMargin = ((simulatedNetEbitdaAed / grossInvoicedAed) * 100).toFixed(1);
  const simulatedRunwayMonths = (simulatedNetEbitdaAed / (fixedOverheadAed / 12)).toFixed(1);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-24 animate-in fade-in-50 duration-300">
      {/* ═══ 1. ZEN EXECUTIVE COMMAND CANOPY ═══ */}
      <section className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-r from-card via-card/95 to-secondary/30 p-6 sm:p-8 shadow-sm">
        <div className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-primary/10 blur-3xl" />

        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                Agency Overwatch · 12 Licensed Brokers Live
              </span>
              <span className="text-muted-foreground">•</span>
              <span className="text-xs text-muted-foreground font-mono">
                94% Operational Velocity · DLD Trust Certified
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-display">
              Good morning, Managing Director
            </h1>

            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
              Your brokerage has closed <strong className="text-foreground font-mono">AED 48.65M YTD</strong>. Today you have <strong className="text-foreground">38 active buyer leads</strong> across your team, and <strong className="text-foreground font-mono">AED 1.04M</strong> in developer commission vouchers awaiting drawdown.
            </p>
          </div>

          {/* Executive Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {/* Timeframe Selector */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-secondary/70 border border-border/60 text-xs font-bold">
              {[
                { id: "today", label: "Today" },
                { id: "week", label: "Week" },
                { id: "month", label: "October" },
                { id: "ytd", label: "2026 YTD" },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTimeframe(t.id as typeof timeframe)}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    timeframe === t.id
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Broadcast Button */}
            <Button
              variant="outline"
              onClick={() => setBroadcastOpen(true)}
              className="h-10 rounded-2xl text-xs font-bold gap-1.5 border-border shadow-sm hover:bg-secondary"
            >
              <Megaphone size={14} className="text-amber-400" />
              <span>Broadcast to Team</span>
            </Button>

            {/* Switch to Broker Workspace */}
            <Button
              asChild
              className="h-10 rounded-2xl text-xs font-bold gap-1.5 bg-primary text-primary-foreground shadow-sm hover:brightness-105"
            >
              <Link to="/app/leads">
                <span>Broker Leads View ↗</span>
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ═══ 2. LIVE DUBAI LAND DEPARTMENT (DLD) CITYWIDE PULSE ═══ */}
      <section className="rounded-2xl border border-primary/30 bg-primary/5 p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary font-bold text-sm">
              🇦🇪
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-primary font-display">
                  Live Dubai Land Department (DLD) OpenData Pulse
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[9px] font-mono font-bold text-emerald-400">
                  <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  API SYNCED
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Today's citywide real estate transaction volume across the Emirate of Dubai
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs flex-1 lg:max-w-3xl">
            <div className="rounded-xl bg-card border border-border/70 p-2.5">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">Dubai Total Today</span>
              <strong className="text-sm font-black font-mono text-foreground">AED 1.84 Billion</strong>
              <span className="text-[10px] text-muted-foreground block">412 Transactions</span>
            </div>

            <div className="rounded-xl bg-card border border-border/70 p-2.5">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">Off-Plan Sales</span>
              <strong className="text-sm font-black font-mono text-emerald-400">AED 1.28 Billion</strong>
              <span className="text-[10px] text-muted-foreground block">284 Registrations</span>
            </div>

            <div className="rounded-xl bg-card border border-border/70 p-2.5">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">Secondary Resale</span>
              <strong className="text-sm font-black font-mono text-blue-400">AED 560 Million</strong>
              <span className="text-[10px] text-muted-foreground block">128 Title Deeds</span>
            </div>

            <div className="rounded-xl bg-card border border-border/70 p-2.5">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">Our Market Share</span>
              <strong className="text-sm font-black font-mono text-amber-400">2.64% of Velocity</strong>
              <span className="text-[10px] text-muted-foreground block">#14 Dubai Brokerage</span>
            </div>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setDldStatsOpen(true)}
            className="rounded-xl text-xs font-bold gap-1.5 shrink-0"
          >
            <Building size={13} className="text-primary" />
            <span>DLD Breakdown</span>
          </Button>
        </div>
      </section>

      {/* ═══ 3. LIVE DEAL TICKER & MONEY BELL RIBBON ═══ */}
      <section className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={handleRingMoneyBell}
              className={`size-11 rounded-2xl flex items-center justify-center transition-all shadow-md ${
                bellRung
                  ? "bg-amber-400 text-black scale-110 rotate-12"
                  : "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-black border border-emerald-500/40"
              }`}
              title="Click to Ring Money Bell!"
            >
              <Bell size={20} className={bellRung ? "animate-bounce" : ""} />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-400 font-display">
                  Live Closed Deals &amp; Booking Deposits
                </span>
                <span className="size-2 rounded-full bg-emerald-500 animate-ping" />
              </div>
              <p className="text-xs text-muted-foreground">
                Real-time commission bell for company owner · 4 deals locked today
              </p>
            </div>
          </div>

          {/* Deal Cards Carousel */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            {LIVE_CLOSED_DEALS.map((deal) => (
              <div
                key={deal.id}
                className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-card border border-border/80 text-xs shrink-0 shadow-xs"
              >
                <div className="size-7 rounded-lg bg-secondary border border-border flex items-center justify-center font-bold text-[11px] text-foreground">
                  {deal.brokerAvatar}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <strong className="text-foreground truncate">{deal.brokerName}</strong>
                    <span className="text-[10px] text-muted-foreground font-mono">{deal.timeAgo}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <span className="text-muted-foreground truncate">{deal.project}</span>
                    <span className="text-emerald-400 font-bold font-mono">+{deal.netAgencyCut}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Audio Sound Toggle & Manual Ring */}
          <div className="flex items-center gap-2 shrink-0 border-t lg:border-t-0 lg:border-l border-border/60 pt-2 lg:pt-0 lg:pl-3">
            <button
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                toast.info(`Money Bell Sound: ${!soundEnabled ? "Enabled" : "Muted"}`);
              }}
              className="p-2 rounded-xl bg-card border border-border text-muted-foreground hover:text-foreground text-xs"
              title={soundEnabled ? "Mute Money Bell" : "Enable Money Bell Sound"}
            >
              {soundEnabled ? <Volume2 size={16} className="text-emerald-400" /> : <VolumeX size={16} />}
            </button>

            <Button
              size="sm"
              onClick={handleRingMoneyBell}
              className="h-8 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-black gap-1.5"
            >
              <Bell size={13} />
              <span>Ring Bell</span>
            </Button>
          </div>
        </div>
      </section>

      {/* ═══ 4. TOP 4 EXECUTIVE METRIC CARDS ═══ */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Closed GMV */}
        <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-border/50 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <TrendingUp size={14} className="text-emerald-400" /> Closed GMV (YTD)
            </span>
            <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-400 font-mono">
              +24.2% YoY
            </span>
          </div>

          <div className="space-y-1">
            <p className="text-3xl font-black text-foreground font-mono font-display">
              AED 48.65M
            </p>
            <p className="text-xs text-muted-foreground">
              41 Transactions closed across off-plan &amp; secondary.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-1">
            <div className="p-2 rounded-xl bg-secondary/40 border border-border/60">
              <span className="text-[10px] uppercase font-bold text-muted-foreground">Off-Plan</span>
              <p className="font-mono font-bold text-foreground">AED 36.4M</p>
            </div>
            <div className="p-2 rounded-xl bg-secondary/40 border border-border/60">
              <span className="text-[10px] uppercase font-bold text-muted-foreground">Secondary</span>
              <p className="font-mono font-bold text-foreground">AED 12.2M</p>
            </div>
          </div>
        </div>

        {/* Card 2: Net Agency Commission (With Radial Dial) */}
        <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-border/50 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <DollarSign size={14} className="text-primary" /> Net Agency Revenue
            </span>
            <span className="rounded-full bg-primary/10 border border-primary/30 px-2 py-0.5 text-[10px] font-bold text-primary font-mono">
              84% of Q4 Goal
            </span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-3xl font-black text-foreground font-mono font-display">
                AED 1.94M
              </p>
              <p className="text-xs text-muted-foreground">
                Company share after 50/50 broker commission splits.
              </p>
            </div>

            {/* Visual Ring Representation */}
            <div className="relative size-16 shrink-0 rounded-full border-4 border-secondary flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent -rotate-45" />
              <span className="text-xs font-black font-mono text-foreground">84%</span>
            </div>
          </div>

          <div className="rounded-xl bg-secondary/40 border border-border/60 p-2.5 text-xs text-muted-foreground flex items-center justify-between">
            <span>Quarterly Target:</span>
            <strong className="text-foreground font-mono">AED 2.30M</strong>
          </div>
        </div>

        {/* Card 3: Developer Debt / Receivables Ledger */}
        <div id="vouchers" className="rounded-3xl border border-amber-500/30 bg-amber-500/5 p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
              <Clock size={14} className="text-amber-400" /> Developer Receivables
            </span>
            <span className="rounded-full bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 text-[10px] font-bold text-amber-300 font-mono">
              5 Vouchers Due
            </span>
          </div>

          <div className="space-y-1">
            <p className="text-3xl font-black text-amber-400 font-mono font-display">
              AED 1.04M
            </p>
            <p className="text-xs text-amber-200/80">
              ⚠️ Danube voucher #1042 (AED 190,000) reached 62 days.
            </p>
          </div>

          <Button
            size="sm"
            onClick={() => {
              handleOpenNoticeModal(vouchersList[0]);
            }}
            className="w-full h-9 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-black gap-1.5 shadow-sm"
          >
            <FileText size={13} />
            <span>1-Click DLD Demand Notice</span>
          </Button>
        </div>

        {/* Card 4: Agency Speed-to-Lead Response */}
        <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-border/50 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Zap size={14} className="text-blue-400" /> Speed-To-Lead Pulse
            </span>
            <span className="rounded-full bg-blue-500/10 border border-blue-500/30 px-2 py-0.5 text-[10px] font-bold text-blue-400 font-mono">
              94.2% &lt; 5m
            </span>
          </div>

          <div className="space-y-1">
            <p className="text-3xl font-black text-foreground font-mono font-display">
              3.4 Mins
            </p>
            <p className="text-xs text-muted-foreground">
              Median time from inquiry arrival to first WhatsApp outreach.
            </p>
          </div>

          <div className="rounded-xl bg-secondary/40 border border-border/60 p-2.5 text-xs text-muted-foreground flex items-center justify-between">
            <span>Fastest Broker:</span>
            <strong className="text-emerald-400">Aisha Khan (1.8m)</strong>
          </div>
        </div>
      </section>

      {/* ═══ 5. EXECUTIVE ALL LEADS OVERWATCH (BRIEF MODE FOR OWNER) ═══ */}
      <section className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/60 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-foreground font-display flex items-center gap-2">
                <Briefcase size={18} className="text-primary" />
                <span>Executive Leads Overwatch</span>
              </h2>
              <span className="rounded-full bg-primary/10 border border-primary/30 px-2.5 py-0.5 text-[10px] font-mono font-bold text-primary">
                {AGENCY_ALL_LEADS_OVERWATCH.length} Priority In-Flight Dossiers
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              High-level brief of all active investor leads across your brokers. Click any lead for the executive brief (no micro-detail clutter).
            </p>
          </div>

          {/* Broker Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-secondary/70 border border-border/60 text-xs font-bold overflow-x-auto">
            {[
              { id: "all", label: "All Brokers (6)" },
              { id: "aisha", label: "Aisha (2)" },
              { id: "tariq", label: "Tariq (2)" },
              { id: "zainab", label: "Zainab (1)" },
              { id: "khalid", label: "Khalid (1)" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setLeadFilterBroker(f.id)}
                className={`px-3 py-1.5 rounded-lg transition-all shrink-0 ${
                  leadFilterBroker === f.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Leads Table in Brief */}
        <div className="space-y-3">
          {filteredAgencyLeads.map((lead) => (
            <div
              key={lead.id}
              className="rounded-2xl border border-border/80 bg-secondary/30 hover:bg-secondary/50 p-4 transition-all flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 shadow-xs"
            >
              <div className="space-y-1 min-w-[240px]">
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-sm text-foreground">{lead.clientName}</h4>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border font-mono ${lead.stageColor}`}>
                    {lead.stage}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{lead.projectInterest} · <span className="font-mono">{lead.nationality}</span></p>
              </div>

              {/* High-level stats cluster */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs flex-1 lg:px-6 lg:border-l lg:border-r lg:border-border/60">
                <div>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">Investor Budget</span>
                  <p className="font-extrabold font-mono text-sm text-foreground">{lead.budgetFormatted}</p>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">Assigned Broker</span>
                  <p className="font-bold text-foreground flex items-center gap-1.5">
                    <span className="size-5 rounded-full bg-secondary border border-border flex items-center justify-center text-[10px] font-bold">
                      {lead.assignedBrokerAvatar}
                    </span>
                    <span>{lead.assignedBrokerName}</span>
                  </p>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">Deal Probability</span>
                  <p className="font-extrabold font-mono text-sm text-emerald-400">{lead.probability}</p>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">Agency Net Cut</span>
                  <p className="font-extrabold font-mono text-sm text-primary">{lead.expectedNetAgencyCut}</p>
                </div>
              </div>

              {/* 1-Click Executive Brief Modal Trigger */}
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  size="sm"
                  onClick={() => handleOpenLeadBrief(lead)}
                  className="h-9 px-3.5 rounded-xl text-xs font-bold bg-primary text-primary-foreground gap-1.5 shadow-sm"
                >
                  <Eye size={13} />
                  <span>Executive Brief ↗</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ 6. EXECUTIVE PROJECTS & UNITS BRIEFING (HIGH-LEVEL FOR OWNER) ═══ */}
      <section className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/60 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-foreground font-display flex items-center gap-2">
                <Building2 size={18} className="text-primary" />
                <span>Executive Projects &amp; Unit Portfolio Brief</span>
              </h2>
              <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-mono font-bold text-emerald-400">
                Developer Solvency &amp; Agency Inventory
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              High-level brief on developer escrow health, inventory sell-through, and commission override terms (no raw technical floorplans).
            </p>
          </div>

          <span className="text-xs text-muted-foreground font-mono">3 Core Developments</span>
        </div>

        {/* 3 Executive Project Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {EXECUTIVE_PROJECTS_BRIEF.map((proj) => (
            <div
              key={proj.id}
              className="rounded-2xl border border-border/80 bg-secondary/30 p-5 space-y-4 shadow-xs flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-extrabold text-base text-foreground font-display">{proj.name}</h4>
                    <p className="text-xs text-muted-foreground">{proj.developer} · {proj.location}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-mono shrink-0">
                    {proj.escrowStatus}
                  </span>
                </div>

                {proj.riskNotice && (
                  <div className="rounded-xl bg-rose-500/10 border border-rose-500/30 p-2 text-[11px] font-bold text-rose-400">
                    {proj.riskNotice}
                  </div>
                )}

                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-muted-foreground">Agency Sell-Through:</span>
                    <strong className="text-foreground">{proj.agencySoldVelocity} ({proj.percentSold}%)</strong>
                  </div>
                  <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${proj.percentSold}%` }} />
                  </div>
                </div>

                <div className="space-y-1 text-xs pt-2">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Commission Structure:</span>
                    <strong className="text-foreground">{proj.agencyCommissionTerms}</strong>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Agency Pipeline:</span>
                    <strong className="text-emerald-400 font-mono">{proj.totalAgencyPipelineAed}</strong>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Top Broker Producer:</span>
                    <strong className="text-primary">{proj.topBrokerProducer}</strong>
                  </div>
                </div>
              </div>

              <Button
                size="sm"
                variant="outline"
                onClick={() => handleOpenProjectBrief(proj)}
                className="w-full h-9 rounded-xl text-xs font-bold gap-1.5 border-border hover:bg-secondary"
              >
                <FileText size={13} className="text-primary" />
                <span>Executive Project Brief ↗</span>
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ 7. LEAD LEAKAGE RESCUE & AUTO-REASSIGNMENT ENGINE ═══ */}
      <section className="rounded-3xl border border-rose-500/30 bg-rose-500/5 p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-rose-500/20 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-foreground font-display flex items-center gap-2">
                <AlertCircle size={18} className="text-rose-400" />
                <span>Lead Leakage Rescue &amp; Auto-Reassignment Engine</span>
              </h2>
              <span className="rounded-full bg-rose-500/20 border border-rose-500/40 px-2.5 py-0.5 text-[10px] font-mono font-bold text-rose-300">
                2 Stalled Inquiries
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Leads unattended past 15 minutes drop conversion probability by 72%. Reassign instantly to top producers.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setAutoReassignEnabled(!autoReassignEnabled);
                toast.success(`Auto-Reassignment: ${!autoReassignEnabled ? "Activated (15m rule)" : "Disabled"}`);
              }}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                autoReassignEnabled
                  ? "bg-rose-500/20 border-rose-500/40 text-rose-300"
                  : "bg-secondary border-border text-muted-foreground"
              }`}
            >
              Auto-Reassign at 15m: {autoReassignEnabled ? "ON" : "OFF"}
            </button>
          </div>
        </div>

        {/* At-risk leads list */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {AT_RISK_LEADS.map((lead) => {
            const isReassigned = reassignedLeads[lead.id];
            return (
              <div
                key={lead.id}
                className="rounded-2xl border border-border/80 bg-card p-5 space-y-3.5 shadow-xs"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-sm text-foreground">{lead.clientName}</h4>
                      <span className="text-[10px] text-muted-foreground font-mono">({lead.clientOrigin})</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{lead.projectInterest}</p>
                  </div>

                  <span className="rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 font-mono font-extrabold text-xs px-2.5 py-0.5 shrink-0">
                    Stalled {lead.stalledMins}m
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs py-1">
                  <div className="p-2 rounded-xl bg-secondary/40 border border-border/60">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground">Investor Budget</span>
                    <p className="font-mono font-extrabold text-foreground">{lead.budget}</p>
                  </div>
                  <div className="p-2 rounded-xl bg-secondary/40 border border-border/60">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground">Assigned Broker</span>
                    <p className="font-bold text-rose-400">{lead.assignedTo}</p>
                  </div>
                </div>

                {isReassigned ? (
                  <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-2.5 text-xs text-emerald-400 font-bold flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <CheckCheck size={14} /> Reassigned to {isReassigned}
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground">WhatsApp pinged</span>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => handleReassignLead(lead.id, lead.recommendedBroker, lead.clientName)}
                    className="w-full h-9 rounded-xl text-xs font-bold bg-primary text-primary-foreground gap-1.5 shadow-sm"
                  >
                    <UserCheck size={13} />
                    <span>Reassign to {lead.recommendedBroker} (Top Closer)</span>
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ═══ 8. DEVELOPER COMMISSION AGING LEDGER ═══ */}
      <section className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/60 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-foreground font-display flex items-center gap-2">
                <Wallet size={18} className="text-amber-400" />
                <span>Developer Commission Aging Ledger</span>
              </h2>
              <span className="rounded-full bg-secondary border border-border px-2.5 py-0.5 text-[10px] font-mono font-bold text-muted-foreground">
                AED 1.04M Outstanding
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Escalate developer overdue commission drawdowns under official RERA Circular 44 rules.
            </p>
          </div>

          {/* Aging Filter Pills */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-secondary/70 border border-border/60 text-xs font-bold">
            {[
              { id: "all", label: "All Vouchers (3)" },
              { id: "overdue", label: "🔴 60+ Days (Danube)" },
              { id: "aging", label: "🟡 31-60 Days (Emaar)" },
              { id: "current", label: "🟢 0-30 Days (Sobha)" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setAgingFilter(f.id as typeof agingFilter)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  agingFilter === f.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Visual Aging Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono font-bold">
            <span className="text-emerald-400">0–30 Days (AED 510k)</span>
            <span className="text-amber-400">31–60 Days (AED 340k)</span>
            <span className="text-rose-400">60+ Days Overdue (AED 190k)</span>
          </div>

          <div className="h-3 w-full rounded-full bg-secondary overflow-hidden flex">
            <div className="h-full bg-emerald-500 w-[49%]" title="0-30 Days: AED 510,000" />
            <div className="h-full bg-amber-500 w-[33%]" title="31-60 Days: AED 340,000" />
            <div className="h-full bg-rose-500 w-[18%]" title="60+ Days Overdue: AED 190,000" />
          </div>
        </div>

        {/* Vouchers Table */}
        <div className="space-y-3">
          {vouchersList
            .filter((v) => {
              if (agingFilter === "overdue") return v.agingBucket === "overdue";
              if (agingFilter === "aging") return v.agingBucket === "aging";
              if (agingFilter === "current") return v.agingBucket === "current";
              return true;
            })
            .map((voucher) => (
              <div
                key={voucher.id}
                className="rounded-2xl border border-border/80 bg-secondary/30 hover:bg-secondary/50 p-4 transition-all flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 shadow-xs"
              >
                <div className="space-y-1 min-w-[220px]">
                  <div className="flex items-center gap-2">
                    <strong className="text-foreground text-sm">{voucher.developer}</strong>
                    <span className="text-xs text-muted-foreground font-mono">{voucher.voucherNumber}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{voucher.project} · {voucher.unitRef}</p>
                </div>

                <div className="flex items-center gap-6 text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-muted-foreground block uppercase font-bold">Commission</span>
                    <strong className="text-foreground text-sm font-extrabold">{voucher.amountFormatted}</strong>
                  </div>

                  <div>
                    <span className="text-[10px] text-muted-foreground block uppercase font-bold">Aging Status</span>
                    <span className={`font-bold ${voucher.daysAging > 60 ? "text-rose-400" : voucher.daysAging > 30 ? "text-amber-400" : "text-emerald-400"}`}>
                      {voucher.statusText}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {voucher.isEscalated ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                      <CheckCheck size={14} /> Notice Dispatched to DLD
                    </span>
                  ) : voucher.daysAging > 60 ? (
                    <Button
                      size="sm"
                      onClick={() => handleOpenNoticeModal(voucher)}
                      className="h-9 px-3.5 rounded-xl text-xs font-bold bg-rose-500 hover:bg-rose-600 text-white gap-1.5 shadow-sm"
                    >
                      <FileText size={13} />
                      <span>Dispatch RERA Claim</span>
                    </Button>
                  ) : (
                    <a
                      href={`https://wa.me/971501112233?text=${encodeURIComponent(
                        `Hi Accounts Department, checking status of voucher ${voucher.voucherNumber} for ${voucher.amountFormatted} on ${voucher.project}. Can you confirm payout date?`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-xl border border-border bg-card hover:bg-secondary text-foreground font-bold text-xs shadow-xs"
                    >
                      <MessageCircle size={14} className="text-emerald-500" />
                      <span>Ping Accounts</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* ═══ 9. DEVELOPER VIP QUOTA TRACKER (+1% OVERRIDES) ═══ */}
      <section className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/60 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-foreground font-display flex items-center gap-2">
                <Crown size={18} className="text-amber-400" />
                <span>Developer VIP Quota Tracker &amp; Bonus Overrides</span>
              </h2>
              <span className="rounded-full bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 text-[10px] font-mono font-bold text-amber-300">
                +1.0% Agency Override Pool
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Unlock retroactive cash overrides by hitting Master Developer annual volume thresholds.
            </p>
          </div>

          <span className="text-xs text-muted-foreground font-mono">Q4 Pacing Live</span>
        </div>

        {/* 3 Developer Quota Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {DEVELOPER_VIP_TIERS.map((tier) => (
            <div
              key={tier.developer}
              className="rounded-2xl border border-border/80 bg-secondary/30 p-5 space-y-4 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-sm text-foreground">{tier.developer}</h4>
                  <span className={`inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold border font-mono ${tier.badgeColor}`}>
                    {tier.tierName}
                  </span>
                </div>
                <span className="text-sm font-black font-mono text-primary">{tier.percentage}%</span>
              </div>

              {/* Progress bar */}
              <div className="space-y-1.5">
                <div className="h-2.5 w-full rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-amber-400 rounded-full transition-all duration-500"
                    style={{ width: `${tier.percentage}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] font-mono text-muted-foreground">
                  <span>{tier.currentVolumeFormatted}</span>
                  <span>Goal: {tier.targetVolumeFormatted}</span>
                </div>
              </div>

              <div className="rounded-xl bg-card border border-border/70 p-3 space-y-1 text-xs">
                <div className="flex justify-between text-muted-foreground">
                  <span>To Unlock Override:</span>
                  <strong className="text-foreground font-mono">{tier.remainingFormatted}</strong>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Estimated Volume:</span>
                  <strong className="text-emerald-400 font-mono">{tier.unitsEstimate}</strong>
                </div>
                <p className="text-[11px] text-amber-300/90 pt-1 font-semibold leading-relaxed border-t border-border/50">
                  🎁 {tier.rewardText}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ 10. AGENCY NET PROFIT & RUNWAY SIMULATOR ═══ */}
      <section className="rounded-3xl border border-border/80 bg-gradient-to-br from-card via-card to-secondary/30 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/60 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-foreground font-display flex items-center gap-2">
                <Sliders size={18} className="text-primary" />
                <span>Agency Net Profit &amp; Cash Runway Simulator</span>
              </h2>
              <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-mono font-bold text-emerald-400">
                Live Financial Model
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Adjust broker commission splits and portal overheads to simulate company net EBITDA and runway.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="text-muted-foreground">Gross Invoiced: <strong className="text-foreground">AED 3.88M</strong></span>
          </div>
        </div>

        {/* The Interactive Split Slider */}
        <div className="rounded-2xl bg-secondary/30 border border-border/70 p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Broker Commission Split:
              </span>
              <p className="text-2xl font-black font-mono text-foreground">{simulatedSplit}% Broker / {100 - simulatedSplit}% Agency</p>
            </div>

            <span className="text-xs text-muted-foreground max-w-xs sm:text-right">
              Drag slider to test impact of moving from a 50/50 model to high-performance tier (e.g. 60/40 or 70/30).
            </span>
          </div>

          <input
            type="range"
            min={40}
            max={75}
            step={5}
            value={simulatedSplit}
            onChange={(e) => setSimulatedSplit(Number(e.target.value))}
            className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
          />

          <div className="flex justify-between text-[11px] font-mono text-muted-foreground">
            <span>40% (Conservative)</span>
            <span>50% (Dubai Standard)</span>
            <span>60% (Senior Tier)</span>
            <span>75% (Super-Producer)</span>
          </div>
        </div>

        {/* Simulated Metrics Cluster */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-border/70 bg-card p-4 space-y-1 shadow-xs">
            <span className="text-[10px] uppercase font-bold text-muted-foreground">Broker Split Payout</span>
            <p className="text-xl font-black font-mono text-foreground">AED {(simulatedBrokerPayoutAed / 1000000).toFixed(2)}M</p>
            <span className="text-[10px] text-muted-foreground">Paid to 12 licensed brokers</span>
          </div>

          <div className="rounded-2xl border border-border/70 bg-card p-4 space-y-1 shadow-xs">
            <span className="text-[10px] uppercase font-bold text-muted-foreground">Fixed Agency Overhead</span>
            <p className="text-xl font-black font-mono text-foreground">AED 442,000</p>
            <span className="text-[10px] text-muted-foreground">Portals + Business Bay office</span>
          </div>

          <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4 space-y-1 shadow-xs">
            <span className="text-[10px] uppercase font-bold text-primary">Simulated Net EBITDA</span>
            <p className="text-xl font-black font-mono text-primary">AED {(simulatedNetEbitdaAed / 1000000).toFixed(2)}M</p>
            <span className="text-[10px] text-emerald-400 font-bold font-mono">{simulatedNetMargin}% Net Margin</span>
          </div>

          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4 space-y-1 shadow-xs">
            <span className="text-[10px] uppercase font-bold text-emerald-400">Cash Runway</span>
            <p className="text-xl font-black font-mono text-emerald-400">{simulatedRunwayMonths} Months</p>
            <span className="text-[10px] text-muted-foreground">Zero deal buffer</span>
          </div>
        </div>
      </section>

      {/* ═══ 11. BROKER OVERWATCH & EMPLOYEE LEADERBOARD ═══ */}
      <section id="brokers" className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/60 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-foreground font-display flex items-center gap-2">
                <Users size={18} className="text-primary" />
                <span>Broker &amp; Agent Overwatch</span>
              </h2>
              <span className="rounded-full bg-secondary border border-border px-2.5 py-0.5 text-[10px] font-mono font-bold text-muted-foreground">
                12 Active Agents
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Monitor individual revenue contribution, closing rates, response speeds, and coach underperforming agents in 1 click.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-secondary/70 border border-border/60 text-xs font-bold">
            {[
              { id: "all", label: "All Agents (12)" },
              { id: "top", label: "🏆 Top Producers" },
              { id: "fast", label: "⚡ Fast Responders" },
              { id: "coaching", label: "⚠️ Needs Coaching" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setBrokerFilter(f.id as typeof brokerFilter)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  brokerFilter === f.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* The Leaderboard List */}
        <div className="space-y-3">
          {filteredBrokers.map((broker, idx) => (
            <div
              key={broker.id}
              className="rounded-2xl border border-border/80 bg-secondary/30 hover:border-primary/50 hover:bg-secondary/50 p-4 transition-all duration-200 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 shadow-sm"
            >
              {/* Identity & Rank */}
              <div className="flex items-center gap-4 min-w-[240px]">
                <div className="relative flex size-12 shrink-0 items-center justify-center rounded-2xl bg-secondary border border-border/80 font-display font-black text-base text-foreground shadow-sm">
                  {broker.avatar}
                  <span className="size-2.5 rounded-full bg-emerald-500 absolute -top-1 -right-1 border-2 border-card" />
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-base text-foreground font-display">
                      #{idx + 1} {broker.name}
                    </h3>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold border font-mono ${broker.tierColor}`}>
                      {broker.tier}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground font-mono">
                    {broker.role} · {broker.reraNumber}
                  </p>
                </div>
              </div>

              {/* Performance Metrics Cluster */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs flex-1 lg:px-6 lg:border-l lg:border-r lg:border-border/60">
                <div>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">Closed Volume</span>
                  <p className="text-sm font-extrabold font-mono text-foreground">{broker.closedVolumeFormatted}</p>
                  <span className="text-[10px] text-muted-foreground">({broker.dealsClosed} closed deals)</span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">Speed to Lead</span>
                  <p className={`text-sm font-extrabold font-mono ${broker.speedToLeadMins > 10 ? "text-rose-400" : "text-emerald-400"}`}>
                    {broker.speedToLeadMins} mins
                  </p>
                  <span className="text-[10px] text-muted-foreground">{broker.speedToLeadMins < 5 ? "⚡ Instant" : "⚠️ Delayed"}</span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">Active Deals</span>
                  <p className="text-sm font-extrabold font-mono text-foreground">{broker.activeDealsCount} in flight</p>
                  <span className="text-[10px] text-muted-foreground">DLD Form F/Viewings</span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">Agency Net</span>
                  <p className="text-sm font-extrabold font-mono text-primary">{broker.agencyNetRevenueFormatted}</p>
                  <span className="text-[10px] text-muted-foreground">Company share</span>
                </div>
              </div>

              {/* 1-Click Management Triggers */}
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={`https://wa.me/${broker.phone.replace(/\D/g, "")}?text=${encodeURIComponent(
                    broker.tier === "Needs Coaching"
                      ? `Hi ${broker.name.split(" ")[0]}, noticed your average lead response time slipped to ${broker.speedToLeadMins} mins today. Let's make sure we hit inquiries within 5 minutes to keep conversion high!`
                      : `Great work ${broker.name.split(" ")[0]}! You've brought in ${broker.agencyNetRevenueFormatted} net for the agency this month. Keep up the great velocity!`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-xl border border-border bg-card hover:bg-secondary text-foreground font-bold text-xs shadow-sm transition-all"
                  title="WhatsApp Coaching Prompt"
                >
                  <MessageCircle size={14} className="text-emerald-500" />
                  <span>{broker.tier === "Needs Coaching" ? "Coach Agent" : "Congratulate"}</span>
                </a>

                <Button asChild size="sm" className="h-9 px-3.5 rounded-xl text-xs font-bold bg-primary text-primary-foreground shadow-sm">
                  <Link to="/app/leads">
                    <span>Inspect</span>
                    <ArrowUpRight size={13} className="ml-1" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ 12. COMPANY DEAL STAGES RADAR ═══ */}
      <section id="pipeline" className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-border/60 pb-4">
          <div>
            <h2 className="text-lg font-extrabold text-foreground font-display flex items-center gap-2">
              <Layers size={18} className="text-primary" />
              <span>Agency Operational Flow &amp; Pipeline Radar</span>
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Click any stage to inspect today's volume, bottlenecks, and broker distribution.
            </p>
          </div>
          <span className="text-xs text-muted-foreground font-mono">4 Linked Milestones</span>
        </div>

        {/* The Horizontal Flow Line */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PIPELINE_FLOW.map((item, idx) => (
            <div
              key={item.step}
              onClick={() => setSelectedPipelineStep(idx)}
              className={`cursor-pointer rounded-2xl border p-4 transition-all duration-200 space-y-2 ${
                selectedPipelineStep === idx
                  ? "bg-secondary/70 border-primary shadow-sm ring-2 ring-primary/20"
                  : "bg-card hover:bg-secondary/30 border-border/70"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-extrabold text-muted-foreground">
                  Stage {item.step}
                </span>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold border font-mono ${item.tagColor}`}>
                  {item.count}
                </span>
              </div>

              <h3 className="font-bold text-sm text-foreground">{item.title}</h3>
              <p className="text-xs text-muted-foreground font-mono">{item.metric}</p>
            </div>
          ))}
        </div>

        {/* Selected Stage Detail Banner */}
        <div className="rounded-2xl bg-secondary/30 border border-border/70 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-primary uppercase tracking-wider">
              {PIPELINE_FLOW[selectedPipelineStep].title} Focus:
            </span>
            <p className="text-xs sm:text-sm text-foreground leading-relaxed">
              {PIPELINE_FLOW[selectedPipelineStep].detail}
            </p>
          </div>

          <Button asChild size="sm" className="rounded-xl text-xs font-bold shrink-0">
            <Link to={PIPELINE_FLOW[selectedPipelineStep].actionLink}>
              <span>{PIPELINE_FLOW[selectedPipelineStep].actionLabel}</span>
              <ArrowUpRight size={13} className="ml-1" />
            </Link>
          </Button>
        </div>
      </section>

      {/* ═══ 13. REELS & SOCIAL AD CAMPAIGN OVERWATCH ═══ */}
      <section id="reels" className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/60 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-extrabold text-foreground font-display flex items-center gap-2">
                <Video size={18} className="text-rose-400" />
                <span>Reels &amp; Social Ad Lead Generation Overwatch</span>
              </h2>
              <span className="rounded-full bg-rose-500/10 border border-rose-500/30 px-2.5 py-0.5 text-[10px] font-mono font-bold text-rose-400">
                36.8x ROAS
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Live lead generation attribution across Instagram Reels, TikTok tours, and paid Meta investor corridors.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="text-muted-foreground">Total Spend: <strong className="text-foreground">AED 18,500</strong></span>
            <span className="text-muted-foreground">•</span>
            <span className="text-emerald-400 font-bold">Pipeline: AED 68.7M</span>
          </div>
        </div>

        {/* The 3 Campaigns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Reel 1 */}
          <div className="rounded-2xl border border-border/80 bg-secondary/30 p-5 space-y-3 shadow-sm">
            <div className="flex items-center justify-between text-xs">
              <span className="inline-flex items-center gap-1 font-bold text-rose-400">
                <Play size={12} fill="currentColor" /> Instagram Reel #1
              </span>
              <span className="font-mono text-muted-foreground">142k Views</span>
            </div>
            <h4 className="font-extrabold text-sm text-foreground">
              "Inside the AED 40M Penthouse with Helipad"
            </h4>
            <div className="space-y-1.5 text-xs pt-1">
              <div className="flex justify-between text-muted-foreground">
                <span>Qualified Leads:</span>
                <strong className="text-foreground font-mono">48 Leads</strong>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Cost Per Lead (CPL):</span>
                <strong className="text-emerald-400 font-mono">AED 38</strong>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Pipeline Generated:</span>
                <strong className="text-foreground font-mono">AED 24.2M</strong>
              </div>
            </div>
          </div>

          {/* Reel 2 */}
          <div className="rounded-2xl border border-border/80 bg-secondary/30 p-5 space-y-3 shadow-sm">
            <div className="flex items-center justify-between text-xs">
              <span className="inline-flex items-center gap-1 font-bold text-blue-400">
                <Play size={12} fill="currentColor" /> Instagram Reel #2
              </span>
              <span className="font-mono text-muted-foreground">98k Views</span>
            </div>
            <h4 className="font-extrabold text-sm text-foreground">
              "Why Palm Jebel Ali is Beating Palm Jumeirah in 2026"
            </h4>
            <div className="space-y-1.5 text-xs pt-1">
              <div className="flex justify-between text-muted-foreground">
                <span>Qualified Leads:</span>
                <strong className="text-foreground font-mono">32 Leads</strong>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Cost Per Lead (CPL):</span>
                <strong className="text-emerald-400 font-mono">AED 44</strong>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Pipeline Generated:</span>
                <strong className="text-foreground font-mono">AED 16.5M</strong>
              </div>
            </div>
          </div>

          {/* Reel 3 */}
          <div className="rounded-2xl border border-primary/40 bg-primary/5 p-5 space-y-3 shadow-sm">
            <div className="flex items-center justify-between text-xs">
              <span className="inline-flex items-center gap-1 font-bold text-primary">
                <Flame size={13} className="text-amber-400" /> TikTok Top Performer
              </span>
              <span className="font-mono text-muted-foreground">230k Views</span>
            </div>
            <h4 className="font-extrabold text-sm text-foreground">
              "The 1% Monthly Post-Handover Payment Plan Hack"
            </h4>
            <div className="space-y-1.5 text-xs pt-1">
              <div className="flex justify-between text-muted-foreground">
                <span>Qualified Leads:</span>
                <strong className="text-foreground font-mono">74 Leads</strong>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Cost Per Lead (CPL):</span>
                <strong className="text-emerald-400 font-mono">AED 29</strong>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Pipeline Generated:</span>
                <strong className="text-emerald-400 font-mono">AED 28.0M</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 14. DEDICATED COMPANY OWNER AI MASTERMIND ═══ */}
      <section id="mastermind" className="rounded-3xl border border-primary/40 bg-card p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/60 pb-5">
          <div className="flex items-center gap-3">
            <div className="size-11 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">
                Company Owner AI Mastermind
              </h2>
              <p className="text-xs text-muted-foreground">
                Strategic decision support: broker coaching, developer commission recovery, and ad budget optimization.
              </p>
            </div>
          </div>

          <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3 py-1 font-mono font-bold text-xs">
            Agency Executive Model Live
          </span>
        </div>

        {/* 3 Executive Strategy Suggestions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          <div
            onClick={() => handleSendOwnerAi("Coach underperforming agent Omar Farooq on speed to lead")}
            className="cursor-pointer rounded-2xl border border-rose-500/30 bg-rose-500/5 hover:bg-rose-500/10 p-4 space-y-2 transition-all shadow-sm"
          >
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
              <span>⚠️</span> Broker Coaching Alert
            </span>
            <p className="text-xs font-bold text-foreground">Omar's response time is 24 mins today.</p>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Click to generate personalized WhatsApp speed coaching for Omar.
            </p>
          </div>

          <div
            onClick={() => handleSendOwnerAi("Recover AED 190,000 overdue commission from Danube")}
            className="cursor-pointer rounded-2xl border border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10 p-4 space-y-2 transition-all shadow-sm"
          >
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <span>💳</span> Commission Claim Notice
            </span>
            <p className="text-xs font-bold text-foreground">Danube voucher is 62 days overdue.</p>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Click to review DLD Trust formal claim demand letter.
            </p>
          </div>

          <div
            onClick={() => handleSendOwnerAi("Scale budget on TikTok 1% monthly Reels campaign")}
            className="cursor-pointer rounded-2xl border border-primary/30 bg-primary/5 hover:bg-primary/10 p-4 space-y-2 transition-all shadow-sm"
          >
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-primary flex items-center gap-1.5">
              <span>📈</span> Ad Budget Scaling
            </span>
            <p className="text-xs font-bold text-foreground">TikTok Reel is at AED 29/lead.</p>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Click to review budget reallocation plan to gain 150+ extra leads.
            </p>
          </div>
        </div>

        {/* AI Stream */}
        {ownerAiChat.length > 0 && (
          <div className="space-y-3 pt-2">
            {ownerAiChat.map((item, idx) => (
              <div
                key={idx}
                className={`rounded-2xl p-4 text-xs leading-relaxed ${
                  item.role === "user"
                    ? "bg-primary text-primary-foreground font-semibold ml-auto max-w-xl text-right"
                    : "bg-secondary/40 border border-border/70 text-foreground max-w-2xl whitespace-pre-wrap"
                }`}
              >
                {item.text}
              </div>
            ))}
          </div>
        )}

        {ownerAiLoading && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground p-3">
            <Sparkles size={14} className="text-primary animate-spin" />
            <span>Owner AI Mastermind is computing strategic revenue recommendations...</span>
          </div>
        )}

        {/* Input Bar */}
        <div className="flex gap-2">
          <input
            value={ownerAiQuestion}
            onChange={(e) => setOwnerAiQuestion(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleSendOwnerAi(); }}
            placeholder="Ask Owner AI anything (e.g., 'What is our expected profit next month?', 'Which developer owes us money?')..."
            className="flex-1 h-11 rounded-2xl border border-border bg-secondary/40 px-4 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary shadow-sm"
          />
          <Button
            onClick={() => handleSendOwnerAi()}
            disabled={!ownerAiQuestion.trim()}
            className="h-11 px-5 rounded-2xl bg-primary text-primary-foreground text-xs font-bold gap-2 shadow-sm"
          >
            <span>Ask Mastermind</span>
            <Send size={14} />
          </Button>
        </div>
      </section>

      {/* ═══ TEAM BROADCAST MODAL ═══ */}
      {broadcastOpen && (
        <Dialog open={broadcastOpen} onOpenChange={setBroadcastOpen}>
          <DialogContent className="max-w-md rounded-3xl bg-card border-border p-6 space-y-4">
            <DialogHeader className="border-b border-border/60 pb-3">
              <DialogTitle className="text-lg font-black text-foreground font-display flex items-center gap-2">
                <Megaphone size={18} className="text-amber-400" />
                <span>Broadcast to All 12 Brokers</span>
              </DialogTitle>
              <p className="text-xs text-muted-foreground">
                Dispatches a high-priority push notice and WhatsApp ping to all active team members.
              </p>
            </DialogHeader>

            <textarea
              rows={4}
              value={broadcastMsg}
              onChange={(e) => setBroadcastMsg(e.target.value)}
              placeholder="e.g. Attention team: Sobha Orbis has released 10 new pool-view units with 1% monthly plan. Priority call all leads in DLRC and Motor City!"
              className="w-full rounded-2xl border border-border bg-secondary/40 p-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setBroadcastOpen(false)} className="rounded-xl text-xs">
                Cancel
              </Button>
              <Button
                onClick={handleBroadcastSubmit}
                disabled={!broadcastMsg.trim()}
                className="rounded-xl text-xs font-bold bg-primary text-primary-foreground gap-1.5"
              >
                <Send size={13} />
                <span>Send Broadcast</span>
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* ═══ OFFICIAL DLD LEGAL DEMAND NOTICE MODAL ═══ */}
      {dldNoticeOpen && selectedVoucherForNotice && (
        <Dialog open={dldNoticeOpen} onOpenChange={setDldNoticeOpen}>
          <DialogContent className="max-w-2xl rounded-3xl bg-card border-border p-6 sm:p-8 space-y-5">
            <DialogHeader className="border-b border-border/60 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="size-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
                    🏛️
                  </div>
                  <div>
                    <DialogTitle className="text-base sm:text-lg font-black text-foreground font-display">
                      Government of Dubai · RERA Legal Demand Notice
                    </DialogTitle>
                    <p className="text-xs text-muted-foreground">
                      Official Commission Drawdown Demand under DLD Circular No. 44/2023
                    </p>
                  </div>
                </div>

                <span className="rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 font-mono text-[10px] font-bold px-2.5 py-0.5">
                  Ref: RERA-2026/044-1042
                </span>
              </div>
            </DialogHeader>

            {/* Document Preview Shell */}
            <div className="rounded-2xl border border-border/80 bg-secondary/30 p-5 space-y-4 text-xs font-mono">
              <div className="grid grid-cols-2 gap-3 pb-3 border-b border-border/60">
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold block">Developer Debtor</span>
                  <strong className="text-foreground font-bold">{selectedVoucherForNotice.developer}</strong>
                  <p className="text-[11px] text-muted-foreground">Escrow Accounts Directorate</p>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold block">Property Milestone</span>
                  <strong className="text-foreground font-bold">{selectedVoucherForNotice.project}</strong>
                  <p className="text-[11px] text-muted-foreground">{selectedVoucherForNotice.unitRef}</p>
                </div>
              </div>

              <div className="rounded-xl bg-rose-500/10 border border-rose-500/30 p-3 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-rose-400 font-bold uppercase block">Outstanding Principal Default</span>
                  <strong className="text-base font-extrabold text-rose-400">{selectedVoucherForNotice.amountFormatted}</strong>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold block">Elapsed Delinquency</span>
                  <strong className="text-rose-400 font-extrabold">{selectedVoucherForNotice.daysAging} Calendar Days</strong>
                  <p className="text-[10px] text-muted-foreground font-sans">(17 Days past 45-day statutory limit)</p>
                </div>
              </div>

              <div className="space-y-2 text-[11px] text-foreground font-sans leading-relaxed">
                <p>
                  <strong>FORMAL NOTICE:</strong> Pursuant to Dubai Law No. (8) of 2007 and RERA Circular 44/2023, licensed real estate agencies are entitled to immediate commission release from project escrow accounts within 45 days of 20% milestone completion.
                </p>
                <p>
                  Title registration reference <strong>OQ-994821</strong> is verified as fully settled. Demand is hereby made for the release of <strong>{selectedVoucherForNotice.amountFormatted}</strong> within five (5) business days.
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopyLegalNotice(selectedVoucherForNotice)}
                className="w-full sm:w-auto rounded-xl text-xs font-bold gap-1.5"
              >
                {copiedLegal ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                <span>{copiedLegal ? "Notice Text Copied" : "Copy Legal Notice"}</span>
              </Button>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownloadDldPdf(selectedVoucherForNotice)}
                  className="rounded-xl text-xs font-bold gap-1.5 border-primary/50 text-primary hover:bg-primary/10"
                >
                  <Download size={13} />
                  <span>Download Signed PDF</span>
                </Button>

                <Button
                  size="sm"
                  onClick={() => handleConfirmRegisteredDispatch(selectedVoucherForNotice.id, selectedVoucherForNotice.developer)}
                  className="rounded-xl text-xs font-bold bg-rose-500 hover:bg-rose-600 text-white gap-1.5 shadow-sm"
                >
                  <Send size={13} />
                  <span>Confirm Dispatch</span>
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* ═══ DLD OPENDATA CITYWIDE STATS MODAL ═══ */}
      {dldStatsOpen && (
        <Dialog open={dldStatsOpen} onOpenChange={setDldStatsOpen}>
          <DialogContent className="max-w-xl rounded-3xl bg-card border-border p-6 space-y-4">
            <DialogHeader className="border-b border-border/60 pb-3">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-lg font-black text-foreground font-display flex items-center gap-2">
                  <span>🇦🇪 Dubai Land Department (DLD) Daily OpenData</span>
                </DialogTitle>
                <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] font-bold px-2 py-0.5">
                  LIVE REST FEED
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Top 5 property sub-markets registered in Dubai today across DLD REST Gateway.
              </p>
            </DialogHeader>

            <div className="space-y-2.5">
              {DLD_SUBMARKETS.map((sub, idx) => (
                <div
                  key={sub.area}
                  className="rounded-2xl border border-border/70 bg-secondary/30 p-3.5 flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-muted-foreground">#{idx + 1}</span>
                      <strong className="text-foreground text-sm">{sub.area}</strong>
                      <span className="text-emerald-400 font-mono text-[11px] font-bold">{sub.growth}</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">Top Sale: {sub.topProject}</p>
                  </div>

                  <div className="text-right font-mono">
                    <strong className="text-foreground text-sm font-extrabold">{sub.volume}</strong>
                    <span className="text-[10px] text-muted-foreground block">{sub.deals} Title Deeds</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-xl bg-card border border-border/70 p-3 text-xs flex items-center justify-between">
              <span className="text-muted-foreground">Our Brokerage Off-Plan Market Share:</span>
              <strong className="text-amber-400 font-mono font-extrabold">2.64% (#14 Registered Firm)</strong>
            </div>

            <div className="flex justify-end pt-2">
              <Button onClick={() => setDldStatsOpen(false)} className="rounded-xl text-xs font-bold">
                Close DLD Feed
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* ═══ EXECUTIVE LEAD BRIEF MODAL (FOR OWNER) ═══ */}
      {leadBriefModalOpen && selectedLeadForBrief && (
        <Dialog open={leadBriefModalOpen} onOpenChange={setLeadBriefModalOpen}>
          <DialogContent className="max-w-xl rounded-3xl bg-card border-border p-6 sm:p-8 space-y-5">
            <DialogHeader className="border-b border-border/60 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle className="text-base sm:text-lg font-black text-foreground font-display flex items-center gap-2">
                    <Briefcase size={18} className="text-primary" />
                    <span>Executive Lead Dossier: {selectedLeadForBrief.clientName}</span>
                  </DialogTitle>
                  <p className="text-xs text-muted-foreground mt-0.5 font-mono">
                    {selectedLeadForBrief.nationality} · Assigned to {selectedLeadForBrief.assignedBrokerName}
                  </p>
                </div>

                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border font-mono ${selectedLeadForBrief.stageColor}`}>
                  {selectedLeadForBrief.stage}
                </span>
              </div>
            </DialogHeader>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="rounded-xl bg-secondary/40 border border-border/70 p-3">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold block">Purchasing Power</span>
                  <strong className="text-base font-extrabold font-mono text-foreground">{selectedLeadForBrief.budgetFormatted}</strong>
                  <span className="text-[10px] text-emerald-400 font-bold block mt-0.5">{selectedLeadForBrief.liquidityTier}</span>
                </div>

                <div className="rounded-xl bg-secondary/40 border border-border/70 p-3">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold block">Closing Probability</span>
                  <strong className="text-base font-extrabold font-mono text-emerald-400">{selectedLeadForBrief.probability}</strong>
                  <span className="text-[10px] text-muted-foreground block mt-0.5">High Conviction</span>
                </div>

                <div className="rounded-xl bg-primary/10 border border-primary/30 p-3">
                  <span className="text-[10px] text-primary uppercase font-bold block">Agency Net Cut</span>
                  <strong className="text-base font-extrabold font-mono text-primary">{selectedLeadForBrief.expectedNetAgencyCut}</strong>
                  <span className="text-[10px] text-muted-foreground block mt-0.5">50% Company Split</span>
                </div>
              </div>

              <div className="rounded-2xl border border-border/80 bg-secondary/30 p-4 space-y-1.5">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-primary block">
                  Executive Deal Summary (Brief)
                </span>
                <p className="text-xs text-foreground leading-relaxed">
                  {selectedLeadForBrief.executiveBrief}
                </p>
              </div>

              <div className="rounded-xl bg-card border border-border/70 p-3 text-xs flex items-center justify-between text-muted-foreground">
                <span>Speed to First Contact: <strong className="text-foreground font-mono">{selectedLeadForBrief.speedToLeadMins} mins</strong></span>
                <span>Last Broker Activity: <strong className="text-foreground font-mono">{selectedLeadForBrief.lastContactAgo}</strong></span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <Button variant="outline" onClick={() => setLeadBriefModalOpen(false)} className="rounded-xl text-xs">
                Close Brief
              </Button>

              <a
                href={`https://wa.me/${selectedLeadForBrief.brokerPhone.replace(/\D/g, "")}?text=${encodeURIComponent(
                  `Hi ${selectedLeadForBrief.assignedBrokerName.split(" ")[0]}, following up on your lead ${selectedLeadForBrief.clientName} (${selectedLeadForBrief.budgetFormatted} on ${selectedLeadForBrief.projectInterest}). What is the next step to lock this deal today?`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-xs shadow-sm transition-all"
              >
                <MessageCircle size={14} />
                <span>Coach Broker on WhatsApp</span>
              </a>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* ═══ EXECUTIVE PROJECT BRIEF MODAL (FOR OWNER) ═══ */}
      {projectBriefModalOpen && selectedProjectForBrief && (
        <Dialog open={projectBriefModalOpen} onOpenChange={setProjectBriefModalOpen}>
          <DialogContent className="max-w-xl rounded-3xl bg-card border-border p-6 sm:p-8 space-y-5">
            <DialogHeader className="border-b border-border/60 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle className="text-base sm:text-lg font-black text-foreground font-display flex items-center gap-2">
                    <Building2 size={18} className="text-primary" />
                    <span>Executive Brief: {selectedProjectForBrief.name}</span>
                  </DialogTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {selectedProjectForBrief.developer} · {selectedProjectForBrief.location}
                  </p>
                </div>

                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-mono">
                  {selectedProjectForBrief.escrowStatus}
                </span>
              </div>
            </DialogHeader>

            <div className="space-y-4 text-xs">
              <div className="rounded-xl bg-card border border-border/70 p-3 space-y-1">
                <span className="text-[10px] text-muted-foreground uppercase font-bold block">Official Escrow Registration</span>
                <p className="font-mono text-foreground font-bold">{selectedProjectForBrief.escrowNumber}</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="rounded-xl bg-secondary/40 border border-border/70 p-3">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold block">Agency Quota Sold</span>
                  <strong className="text-base font-extrabold font-mono text-foreground">{selectedProjectForBrief.agencySoldVelocity}</strong>
                  <span className="text-[10px] text-muted-foreground block">of {selectedProjectForBrief.agencyAllocation}</span>
                </div>

                <div className="rounded-xl bg-secondary/40 border border-border/70 p-3">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold block">Average Selling Price</span>
                  <strong className="text-base font-extrabold font-mono text-foreground">{selectedProjectForBrief.aspFormatted}</strong>
                  <span className="text-[10px] text-emerald-400 font-bold block">ASP Metric</span>
                </div>

                <div className="rounded-xl bg-primary/10 border border-primary/30 p-3">
                  <span className="text-[10px] text-primary uppercase font-bold block">Total Pipeline Value</span>
                  <strong className="text-base font-extrabold font-mono text-primary">{selectedProjectForBrief.totalAgencyPipelineAed}</strong>
                  <span className="text-[10px] text-muted-foreground block">Firm Revenue Pool</span>
                </div>
              </div>

              <div className="rounded-2xl border border-border/80 bg-secondary/30 p-4 space-y-1.5">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-primary block">
                  Director's Brief &amp; Commercial Terms
                </span>
                <p className="text-xs text-foreground leading-relaxed">
                  {selectedProjectForBrief.executiveBrief}
                </p>
                <div className="pt-2 border-t border-border/50 text-[11px] text-muted-foreground flex justify-between">
                  <span>Commission Terms: <strong className="text-foreground">{selectedProjectForBrief.agencyCommissionTerms}</strong></span>
                  <span>Top Closer: <strong className="text-primary">{selectedProjectForBrief.topBrokerProducer}</strong></span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button onClick={() => setProjectBriefModalOpen(false)} className="rounded-xl text-xs font-bold">
                Close Project Brief
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
