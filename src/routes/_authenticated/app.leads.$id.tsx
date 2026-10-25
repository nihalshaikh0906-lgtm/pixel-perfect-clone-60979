import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft, ArrowRight, Mail, MessageCircle, Phone, Send, Sparkles, Building2,
  Calendar, Check, Copy, CheckCheck, MapPin, ExternalLink, ShieldCheck,
  ChevronRight, FileText, Compass, Eye, Image as ImageIcon, Layers, X,
  TrendingUp, Award, Clock, ArrowUpRight, CheckCircle2, ChevronLeft
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { useShell } from "@/components/app/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { ago, formatAed, LEAD_BY_ID, OPEN_STAGES, priorityOf, wants, type Lead, type Stage } from "@/lib/demo-leads";
import { openWhatsApp, getWhatsAppNativeUrl } from "@/lib/whatsapp-send";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DealRoomView } from "../deal-room.$id";
import { DriveTimeVoiceTranscriber } from "@/components/leads/DriveTimeVoiceTranscriber";

export const Route = createFileRoute("/_authenticated/app/leads/$id")({
  head: () => ({
    meta: [
      { title: "Client Profile & AI Match — DealOS" },
      { name: "description", content: "Unique executive investor profile, verified matched Dubai units, and dedicated lead AI copilot." },
    ],
  }),
  component: LeadPage,
});

type ProjectDetail = {
  id: string;
  name: string;
  developer: string;
  district: string;
  price: string;
  priceNum: number;
  matchScore: number;
  handover: string;
  paymentPlan: string;
  planBreakdown: { milestone: string; percent: string }[];
  bedrooms: string;
  size: string;
  roi: string;
  coverImage: string;
  gallery: string[];
  floorPlanUrl: string;
  googleMapsUrl: string;
  description: string;
  amenities: string[];
};

const VERIFIED_MATCHES: ProjectDetail[] = [
  {
    id: "proj-reef-995",
    name: "Reef Luxury 995",
    developer: "Reef Luxury Developments",
    district: "Dubai Land Residential Complex (DLRC)",
    price: "From AED 684,000",
    priceNum: 684000,
    matchScore: 99,
    handover: "Q4 2026",
    paymentPlan: "10% Booking · 40% Construction · 50% Handover",
    planBreakdown: [
      { milestone: "Down Payment / Booking", percent: "10%" },
      { milestone: "During Construction (Linked to Milestones)", percent: "40%" },
      { milestone: "On Handover (Q4 2026)", percent: "50%" },
    ],
    bedrooms: "1 Bedroom Luxury Suite",
    size: "695 – 745 sq.ft",
    roi: "8.4% Net Yield",
    coverImage: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
    ],
    floorPlanUrl: "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1200&q=80",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Dubai+Land+Residential+Complex+Reef+995",
    description: "Architectural luxury in DLRC equipped with patented climate-controlled sunken outdoor terraces, rooftop infinity lagoon pool, and instant Al Ain Road metro connectivity.",
    amenities: ["Rooftop Lagoon Pool", "Technogym Fitness Studio", "Private Balcony Jacuzzis", "24/7 Valet Concierge", "DLD Escrow Account Registered"],
  },
  {
    id: "proj-bayz-102",
    name: "Bayz 102 by Danube",
    developer: "Danube Properties",
    district: "Business Bay, Dubai",
    price: "From AED 1,290,000",
    priceNum: 1290000,
    matchScore: 97,
    handover: "Dec 2028",
    paymentPlan: "1% Monthly Post-Handover Plan (70/30)",
    planBreakdown: [
      { milestone: "Booking Deposit", percent: "10%" },
      { milestone: "During Construction (1% Monthly)", percent: "60%" },
      { milestone: "Post-Handover (30 Months @ 1%)", percent: "30%" },
    ],
    bedrooms: "1 & 2 Bedrooms",
    size: "740 – 1,120 sq.ft",
    roi: "7.9% Net Yield",
    coverImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80",
    ],
    floorPlanUrl: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Business+Bay+Danube+Bayz+102",
    description: "Ultra-luxury residential skyscraper 2 minutes from Dubai Canal and Downtown Dubai, featuring helipad access and 40+ luxury resort amenities.",
    amenities: ["Helipad Access", "Infinity Sky Pool", "Cinema & Bowling Alley", "Direct Canal Views", "Furnished by Dolce Vita"],
  },
  {
    id: "proj-sobha-orbis",
    name: "Sobha Orbis",
    developer: "Sobha Realty",
    district: "Motor City, Dubai",
    price: "From AED 985,000",
    priceNum: 985000,
    matchScore: 94,
    handover: "Q4 2027",
    paymentPlan: "80/20 Standard Escrow Plan",
    planBreakdown: [
      { milestone: "Booking & DLD Fee", percent: "10%" },
      { milestone: "During Construction Milestones", percent: "70%" },
      { milestone: "Handover Completion", percent: "20%" },
    ],
    bedrooms: "1 & 2 Bedrooms",
    size: "680 – 1,050 sq.ft",
    roi: "8.1% Net Yield",
    coverImage: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    ],
    floorPlanUrl: "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1200&q=80",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Motor+City+Sobha+Orbis",
    description: "Premium high-rise development with Sobha's signature German backward integration quality, expansive green landscaped gardens, and resort amenities.",
    amenities: ["Resort Style Pool", "Landscaped Podium", "Clubhouse & Kids Play", "Retail Boulevard", "Signature Sobha Craftsmanship"],
  },
];

function LeadPage() {
  const { id } = Route.useParams();
  const { clientMode } = useShell();
  const lead = LEAD_BY_ID.get(id);

  if (!lead) {
    return (
      <div className="rounded-3xl border border-border bg-card p-8 text-center max-w-md mx-auto my-12 space-y-4">
        <h2 className="text-xl font-bold text-foreground">Lead not found</h2>
        <p className="text-xs text-muted-foreground">There is no active lead with ID #{id}.</p>
        <Button asChild variant="outline" className="rounded-xl">
          <Link to="/app/leads" search={{ queue: "all" }}>← Back to Leads Inbox</Link>
        </Button>
      </div>
    );
  }

  return <BespokeLeadDossier lead={lead} clientMode={clientMode} />;
}

function BespokeLeadDossier({ lead, clientMode }: { lead: Lead; clientMode?: boolean }) {
  const [stage, setStage] = useState<Stage>(lead.stage);
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const [inspectProject, setInspectProject] = useState<ProjectDetail | null>(null);
  const [activeModalTab, setActiveModalTab] = useState<"gallery" | "map" | "floorplan" | "plan">("gallery");
  const [projectMediaTab, setProjectMediaTab] = useState<"gallery" | "floorplan" | "plan" | "map">("gallery");

  // Script switcher tabs
  const [scriptTab, setScriptTab] = useState<"opener" | "escrow" | "roi" | "urgency">("opener");

  // Interactive KYC Checklist State
  const [checklist, setChecklist] = useState({
    passport: false,
    funds: true,
    eoi: false,
    contract: false,
  });

  // AI Chat State
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiChatHistory, setAiChatHistory] = useState<{ role: "user" | "assistant"; text: string }[]>([]);
  const [aiTyping, setAiTyping] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);
  const [showDealRoomModal, setShowDealRoomModal] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [lead.id]);

  const p = priorityOf(lead);
  const cleanPhone = lead.phone.replace(/\D/g, "");
  const heroProject = VERIFIED_MATCHES[activeProjectIndex] ?? VERIFIED_MATCHES[0]!;
  const firstName = lead.name.split(" ")[0];

  // Dynamic high-converting tailored WhatsApp scripts
  const SCRIPTS: Record<"opener" | "escrow" | "roi" | "urgency", { label: string; text: string; badge: string }> = {
    opener: {
      label: "⚡ 10s Fast Opener",
      badge: "Speed to Lead",
      text: `Hi ${firstName}, hope you're having a productive week! Following up on your requirement for ${wants(lead)} in ${lead.area} (Budget: ${formatAed(lead.budget)}). We just received direct developer allocations for ${heroProject.name} (${heroProject.price}) with ${heroProject.paymentPlan} and verified DLD escrow. When are you free today for a quick 2-minute overview?`,
    },
    escrow: {
      label: "🛡️ DLD Escrow Proof",
      badge: "Overcomes Hesitation",
      text: `Hi ${firstName}, regarding safety and construction guarantees: ${heroProject.name} is 100% registered with the Dubai Land Department Escrow system. Your payments are legally held in the designated escrow account and released only upon certified construction milestones. Would you like me to send you the official DLD registration certificate and trust details?`,
    },
    roi: {
      label: "📈 1% Monthly ROI",
      badge: "Cashflow Pitch",
      text: `Hi ${firstName}, looking at ${heroProject.name} from an investment angle: with projected ${heroProject.roi} and the developer's 1% monthly payment plan, this asset delivers maximum liquidity. Plus, developer policy allows capital gain resale after completing only 30% of milestones. Would you like me to share the ROI cash-flow sheet?`,
    },
    urgency: {
      label: "🔥 Price Hike Alert",
      badge: "Closes EOI Today",
      text: `Hi ${firstName}, quick urgent update: ${heroProject.name} is closing this phase ahead of an announced 4% developer price revision this Sunday. I have a high-floor ${heroProject.bedrooms} unit on temporary hold. Can I lock your holding slip with an EOI reservation before the price increases?`,
    },
  };

  const currentScript = SCRIPTS[scriptTab].text;

  const copyScript = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedScript(true);
    toast.success("Tailored WhatsApp script copied to clipboard!");
    setTimeout(() => setCopiedScript(false), 2000);
  };

  const toggleChecklist = (key: keyof typeof checklist) => {
    setChecklist((prev) => {
      const next = !prev[key];
      toast.success(next ? "Checklist item marked complete!" : "Checklist item updated.");
      return { ...prev, [key]: next };
    });
  };

  const handleSendAi = (customText?: string) => {
    const q = (customText || aiQuestion).trim();
    if (!q) return;

    setAiChatHistory((prev) => [...prev, { role: "user", text: q }]);
    setAiQuestion("");
    setAiTyping(true);

    setTimeout(() => {
      let reply = "";
      if (q.toLowerCase().includes("discount") || q.toLowerCase().includes("cheaper")) {
        reply = `**Counter-Negotiation Strategy for ${firstName}:**
Developer prices for **${heroProject.name}** are fixed by the master developer, but we can negotiate:
1. **DLD Fee Waiver**: Request developer absorption of the 4% Land Department fee (~AED ${(heroProject.priceNum * 0.04).toLocaleString("en-US")}).
2. **Post-Handover Extension**: Structure an extra 6 months into the 1% monthly installments.`;
      } else if (q.toLowerCase().includes("delay") || q.toLowerCase().includes("late")) {
        reply = `**Dubai Escrow Law Protection:**
Under UAE Law No. 8, developer funds are locked in Escrow. The developer cannot withdraw buyer capital until RERA inspectors certify structural progress. Reassure ${firstName} by sending the DLD Trust Certificate.`;
      } else {
        reply = `**Instant Closing Recommendation for ${lead.name}:**
${firstName} has strong purchasing power (**${formatAed(lead.budget)}**) vs ${heroProject.name} at **${heroProject.price}**. Send the **1% Monthly ROI** script via WhatsApp now to schedule an executive video call today.`;
      }

      setAiChatHistory((prev) => [...prev, { role: "assistant", text: reply }]);
      setAiTyping(false);
    }, 600);
  };

  const checklistCount = Object.values(checklist).filter(Boolean).length;

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-28 animate-in fade-in-50 duration-200">
      {/* ═══ TOP BREADCRUMB & CONTEXT HEADER ═══ */}
      <div className="flex items-center justify-between">
        <Link
          to="/app/leads"
          search={{ queue: "all" }}
          className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Leads Inbox</span>
        </Link>
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs text-muted-foreground font-mono">
            Client Profile #{lead.id} · Priority {p} · Dubai DLD Synced
          </span>
        </div>
      </div>

      {/* ═══ 10/10 EXECUTIVE SPLIT COCKPIT GRID ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ════════════════════════════════════════════════════════════
            LEFT COLUMN (7 COLS / ~60%): INVESTOR CANOPY & PROPERTY MATCHES
            ════════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-7 xl:col-span-7 space-y-6">
          {/* ═══ 1. INVESTOR EXECUTIVE CANOPY ═══ */}
          <section className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-r from-card via-card/95 to-secondary/30 p-6 sm:p-7 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
              <div className="flex items-center gap-4">
                <div className="relative flex size-15 shrink-0 items-center justify-center rounded-2xl bg-secondary border border-border/80 font-display font-black text-2xl text-foreground shadow-sm">
                  {lead.initials}
                  <span className={`absolute -bottom-1 -right-1 size-5 rounded-full border-2 border-card flex items-center justify-center text-[10px] font-bold text-white ${
                    p === "Hot" ? "bg-rose-500" : p === "Warm" ? "bg-amber-500" : "bg-blue-500"
                  }`}>
                    ★
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl font-extrabold tracking-tight text-foreground font-display">
                      {lead.name}
                    </h1>
                    <span className="text-xs font-semibold text-muted-foreground">({lead.country})</span>
                    <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-[11px] font-bold text-emerald-400 font-mono">
                      Score {lead.score}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <span>Received {ago(lead.receivedHoursAgo)} via <strong className="text-foreground">{lead.source}</strong></span>
                    <span>•</span>
                    <span className="text-rose-400 font-bold">⚡ Reply Priority Active</span>
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowDealRoomModal(true)}
                  className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-xl border border-primary/30 bg-primary/10 hover:bg-primary/20 text-primary font-bold text-xs transition-all shadow-xs cursor-pointer"
                  title="Preview client-facing Live Deal Room"
                >
                  <Sparkles size={13} className="text-primary" />
                  <span>Preview Deal Room</span>
                </button>

                <Link
                  to="/deal-room/$id"
                  params={{ id: lead.id }}
                  className="inline-flex items-center gap-1.5 h-9 px-3 rounded-xl border border-border bg-card hover:bg-secondary text-foreground font-bold text-xs transition-all shadow-xs"
                  title="Open full page"
                >
                  <ExternalLink size={13} className="text-muted-foreground" />
                  <span className="hidden sm:inline">Full Page</span>
                </Link>

                <a
                  href={`tel:${lead.phone.replace(/\s/g, "")}`}
                  className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-xl border border-border bg-card hover:bg-secondary text-foreground font-bold text-xs transition-all shadow-sm"
                  title="Direct phone call"
                >
                  <Phone size={14} className="text-muted-foreground" />
                  <span>Call</span>
                </a>

                <select
                  value={stage}
                  onChange={(e) => {
                    setStage(e.target.value as Stage);
                    toast.success(`Pipeline moved to ${e.target.value}`);
                  }}
                  className="h-9 px-3 rounded-xl border border-border bg-card text-foreground font-bold text-xs cursor-pointer focus:outline-none focus:border-primary shadow-sm"
                >
                  {[...OPEN_STAGES, "Won", "Lost"].map((st) => (
                    <option key={st} value={st}>
                      Stage: {st}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Investor Flow Ribbon */}
            <div className="pt-4 border-t border-border/60 flex flex-wrap items-center gap-2.5 text-xs">
              <div className="inline-flex items-center gap-2 rounded-xl bg-secondary/60 border border-border/80 px-3 py-1.5">
                <span className="text-muted-foreground uppercase text-[10px] font-bold tracking-wider">Budget</span>
                <span className="font-mono font-extrabold text-emerald-400 text-xs sm:text-sm">{formatAed(lead.budget)}</span>
              </div>

              <span className="text-muted-foreground/60 hidden sm:inline">➔</span>

              <div className="inline-flex items-center gap-2 rounded-xl bg-secondary/60 border border-border/80 px-3 py-1.5">
                <span className="text-muted-foreground uppercase text-[10px] font-bold tracking-wider">Target</span>
                <span className="font-bold text-foreground text-xs sm:text-sm">{wants(lead)} in {lead.area}</span>
              </div>

              <span className="text-muted-foreground/60 hidden sm:inline">➔</span>

              <div className="inline-flex items-center gap-2 rounded-xl bg-secondary/60 border border-border/80 px-3 py-1.5">
                <span className="text-muted-foreground uppercase text-[10px] font-bold tracking-wider">Terms</span>
                <span className="font-bold text-foreground text-xs sm:text-sm">{lead.payment}</span>
              </div>
            </div>

            {/* Inbound message quote */}
            <div className="rounded-xl bg-secondary/40 border border-border/60 p-3 text-xs text-foreground italic flex items-center gap-2">
              <FileText size={14} className="text-primary shrink-0" />
              <span>"{lead.message}"</span>
            </div>
          </section>

          {/* ═══ 2. CURATED DUBAI PROPERTY ALLOCATIONS (INTERACTIVE HUD) ═══ */}
          <section className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-lg font-extrabold text-foreground font-display flex items-center gap-2">
                  <Award className="size-5 text-amber-400" />
                  <span>Curated Allocations for {firstName}</span>
                </h2>
                <p className="text-xs text-muted-foreground">
                  Switch matched developments to update instant WhatsApp pitches & ROI.
                </p>
              </div>

              {/* Match Switcher Tabs */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-secondary/70 border border-border/60 text-xs font-bold">
                {VERIFIED_MATCHES.map((m, idx) => (
                  <button
                    key={m.id}
                    onClick={() => setActiveProjectIndex(idx)}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      activeProjectIndex === idx
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                  >
                    #{idx + 1} {m.name.split(" ")[0]} ({m.matchScore}%)
                  </button>
                ))}
              </div>
            </div>

            {/* ═══ HERO PROJECT SPOTLIGHT CARD ═══ */}
            <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-card shadow-md space-y-4 p-5 sm:p-6">
              {/* Cover & Overlay Header */}
              <div className="relative h-64 sm:h-72 rounded-2xl overflow-hidden bg-secondary">
                <img
                  src={heroProject.coverImage}
                  alt={heroProject.name}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />

                <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
                  <span className="rounded-full bg-emerald-500/90 text-white px-3 py-1 text-xs font-bold backdrop-blur-md">
                    ★ {heroProject.matchScore}% Lead Match
                  </span>
                  <span className="rounded-full bg-black/60 text-white px-3 py-1 text-xs font-mono font-bold backdrop-blur-md">
                    {heroProject.roi}
                  </span>
                </div>

                <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white flex items-end justify-between gap-3">
                  <div className="space-y-0.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-primary-foreground/80">{heroProject.developer}</span>
                    <h3 className="text-2xl font-black font-display leading-tight">{heroProject.name}</h3>
                    <p className="text-xs text-zinc-300 flex items-center gap-1">
                      <MapPin size={13} className="text-rose-400" /> {heroProject.district}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-bold text-zinc-300 uppercase">Starting From</span>
                    <p className="text-xl sm:text-2xl font-black font-mono text-emerald-400">{heroProject.price}</p>
                  </div>
                </div>
              </div>

              {/* Embedded Project Inspection Tabs */}
              <div className="flex flex-wrap items-center gap-2 border-b border-border/60 pb-3">
                {[
                  { id: "gallery", label: "📸 4K Gallery" },
                  { id: "floorplan", label: "📐 Floor Plan" },
                  { id: "plan", label: "💳 Payment Plan" },
                  { id: "map", label: "🗺️ Location & Maps" },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setProjectMediaTab(t.id as typeof projectMediaTab)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      projectMediaTab === t.id
                        ? "bg-secondary text-foreground border border-border shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => {
                    setInspectProject(heroProject);
                    setActiveModalTab(projectMediaTab);
                  }}
                  className="ml-auto inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                >
                  <span>Full Screen Renders</span>
                  <ArrowUpRight size={13} />
                </button>
              </div>

              {/* Tab Display Area */}
              {projectMediaTab === "gallery" && (
                <div className="grid grid-cols-3 gap-2.5 animate-in fade-in duration-200">
                  {heroProject.gallery.slice(0, 3).map((img, i) => (
                    <div key={i} className="h-28 rounded-xl overflow-hidden border border-border/60 bg-secondary">
                      <img src={img} alt="Render" className="h-full w-full object-cover hover:scale-105 transition-transform" />
                    </div>
                  ))}
                </div>
              )}

              {projectMediaTab === "floorplan" && (
                <div className="p-4 rounded-2xl bg-secondary/30 border border-border/60 flex items-center justify-between gap-4 animate-in fade-in duration-200">
                  <div className="h-28 w-44 rounded-xl overflow-hidden bg-background border border-border flex items-center justify-center p-1 shrink-0">
                    <img src={heroProject.floorPlanUrl} alt="Floor plan" className="max-h-full max-w-full object-contain" />
                  </div>
                  <div className="space-y-1 text-xs">
                    <p className="font-extrabold text-foreground text-sm">{heroProject.bedrooms}</p>
                    <p className="text-muted-foreground font-mono">Total Area: {heroProject.size}</p>
                    <p className="text-emerald-400 font-bold">DLD Approved Architecture</p>
                  </div>
                </div>
              )}

              {projectMediaTab === "plan" && (
                <div className="space-y-2 animate-in fade-in duration-200">
                  <div className="grid grid-cols-3 gap-2">
                    {heroProject.planBreakdown.map((s, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-secondary/50 border border-border/60 text-xs text-center space-y-1">
                        <span className="font-bold font-mono text-emerald-400 text-sm">{s.percent}</span>
                        <p className="text-[11px] text-muted-foreground truncate">{s.milestone}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-[11px] text-muted-foreground text-center pt-1 font-mono">
                    Handover Scheduled: <strong>{heroProject.handover}</strong> · DLD Escrow Synced
                  </p>
                </div>
              )}

              {projectMediaTab === "map" && (
                <div className="p-3.5 rounded-2xl bg-secondary/30 border border-border/60 flex items-center justify-between gap-3 text-xs animate-in fade-in duration-200">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-rose-400 shrink-0" />
                    <div>
                      <p className="font-bold text-foreground">{heroProject.district}</p>
                      <p className="text-muted-foreground text-[11px]">Direct corridor to Downtown Dubai and Canal</p>
                    </div>
                  </div>
                  <a
                    href={heroProject.googleMapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="h-8 px-3 rounded-xl bg-primary text-primary-foreground font-bold text-xs inline-flex items-center gap-1 shadow-sm shrink-0"
                  >
                    <span>View Map ↗</span>
                  </a>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* ════════════════════════════════════════════════════════════
            RIGHT COLUMN (5 COLS / ~40%): STICKY AI DECISION RAIL & ACTION COCKPIT
            ════════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-5 xl:col-span-5 lg:sticky lg:top-4 space-y-5">
          {/* ═══ 0. DRIVE-TIME WHATSAPP VOICE NOTE TRANSCRIBER ═══ */}
          <DriveTimeVoiceTranscriber leadName={lead.name} leadId={lead.id} />

          {/* ═══ 1. LIVE AI COPILOT & SCRIPT LAUNCHPAD ═══ */}
          <div className="rounded-3xl border border-primary/40 bg-card/95 backdrop-blur-xl p-5 sm:p-6 shadow-xl space-y-5">
            {/* Playbook Header */}
            <div className="flex items-center justify-between border-b border-border/60 pb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="size-9 rounded-xl bg-gradient-to-br from-violet-600 to-primary flex items-center justify-center text-white shadow-md">
                  <Sparkles size={16} />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-foreground flex items-center gap-1.5">
                    <span>AI Deal Intelligence</span>
                    <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                  </h3>
                  <p className="text-[11px] text-muted-foreground">Dedicated to closing {firstName}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => toast.success("AI model refreshed against live Dubai Land Department records.")}
                className="text-[11px] font-bold text-primary hover:underline"
              >
                Refresh
              </button>
            </div>

            {/* ═══ 1-CLICK TAILORED WHATSAPP SCRIPT SWITCHER ═══ */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  Select WhatsApp Angle:
                </span>
                <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  {SCRIPTS[scriptTab].badge}
                </span>
              </div>

              {/* Script Tabs */}
              <div className="grid grid-cols-2 gap-1.5 text-xs font-bold">
                {(["opener", "escrow", "roi", "urgency"] as const).map((key) => (
                  <button
                    key={key}
                    onClick={() => setScriptTab(key)}
                    className={`py-2 px-2.5 rounded-xl transition-all text-left truncate ${
                      scriptTab === key
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-secondary/70 text-muted-foreground hover:text-foreground hover:bg-secondary border border-border/50"
                    }`}
                  >
                    {SCRIPTS[key].label}
                  </button>
                ))}
              </div>

              {/* Script Preview Box */}
              <div className="rounded-2xl border border-primary/30 bg-primary/5 p-3.5 space-y-2">
                <p className="text-xs text-foreground font-medium leading-relaxed italic">
                  "{currentScript}"
                </p>
              </div>

              {/* High-Impact Action Triggers */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => copyScript(currentScript)}
                  className="h-10 rounded-xl border border-border bg-card hover:bg-secondary text-foreground text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-all shadow-sm"
                >
                  {copiedScript ? <CheckCheck size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  <span>{copiedScript ? "Script Copied!" : "Copy Script"}</span>
                </button>

                <a
                  href={getWhatsAppNativeUrl(cleanPhone, currentScript)}
                  onClick={(e) => {
                    e.preventDefault();
                    openWhatsApp({ phone: cleanPhone, text: currentScript, recipientName: firstName });
                  }}
                  className="h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold inline-flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
                >
                  <MessageCircle size={15} />
                  <span>Send on WhatsApp ↗</span>
                </a>

                <button
                  type="button"
                  onClick={() => {
                    const origin = typeof window !== "undefined" ? window.location.origin : "https://dealos.ae";
                    const dealRoomUrl = `${origin}/deal-room/${lead.id}`;
                    const dealRoomMsg = `Hi ${firstName}, I've engineered your private Live Deal Room with real-time ROI simulations, unit floor plans, and verified DLD escrow milestones:\n\n${dealRoomUrl}\n\nHave a look and let me know if you would like me to lock in the 48-hour reservation.`;
                    openWhatsApp({ phone: cleanPhone, text: dealRoomMsg, recipientName: firstName });
                  }}
                  className="col-span-2 h-10 rounded-xl bg-gradient-to-r from-primary to-violet-600 hover:brightness-105 text-white font-extrabold text-xs inline-flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                >
                  <Sparkles size={14} />
                  <span>Send Live Deal Room Link on WhatsApp ⚡</span>
                </button>
              </div>
            </div>

            {/* ═══ 2. INTERACTIVE KYC & DLD TRANSACTION CHECKLIST ═══ */}
            <div className="pt-4 border-t border-border/60 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  DLD KYC & Transaction Checklist
                </span>
                <span className="text-[11px] font-mono font-bold text-primary">
                  {checklistCount} / 4 Complete
                </span>
              </div>

              <div className="space-y-2 text-xs">
                {[
                  { key: "passport", label: "Passport / Emirates ID Copy", detail: "Required for reservation holding slip" },
                  { key: "funds", label: "Proof of Funds / Cash Readiness", detail: "AED 3.5M budget validated" },
                  { key: "eoi", label: "EOI Deposit (AED 20,000)", detail: "Secures unit allocation before price hike" },
                  { key: "contract", label: "DLD Form F / MOU Contract", detail: "Official Land Department sales contract" },
                ].map((item) => {
                  const done = checklist[item.key as keyof typeof checklist];
                  return (
                    <div
                      key={item.key}
                      onClick={() => toggleChecklist(item.key as keyof typeof checklist)}
                      className={`cursor-pointer rounded-xl p-2.5 border transition-all flex items-start gap-3 ${
                        done
                          ? "bg-emerald-500/10 border-emerald-500/30 text-foreground"
                          : "bg-secondary/40 border-border/60 hover:bg-secondary/70 text-muted-foreground"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={done}
                        readOnly
                        className="mt-0.5 size-4 rounded text-emerald-600 focus:ring-0 cursor-pointer pointer-events-none"
                      />
                      <div className="min-w-0 space-y-0.5">
                        <p className={`font-bold text-xs ${done ? "text-emerald-400 line-through" : "text-foreground"}`}>
                          {item.label}
                        </p>
                        <p className="text-[10px] text-muted-foreground truncate">{item.detail}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ═══ 3. STRATEGIC OVERVIEW & NEXT MOVE ═══ */}
            <div className="pt-4 border-t border-border/60 space-y-2 text-xs">
              <span className="text-[11px] font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                <span>⚡</span> AI Closing Recommendation:
              </span>
              <p className="text-foreground leading-relaxed text-xs">
                {firstName} has substantial headroom (**{formatAed(lead.budget)}**) vs {heroProject.name} (**{heroProject.price}**). Call now and send the **{SCRIPTS[scriptTab].label}** to secure an EOI deposit before phase sell-out.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ MOBILE FLOATING STICKY ACTION DOCK ═══ */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-3 bg-card/95 backdrop-blur-xl border-t border-border/80 z-40 flex items-center gap-2 shadow-2xl">
        <a
          href={getWhatsAppNativeUrl(cleanPhone, currentScript)}
          onClick={(e) => {
            e.preventDefault();
            openWhatsApp({ phone: cleanPhone, text: currentScript, recipientName: firstName });
          }}
          className="flex-1 h-11 rounded-2xl bg-emerald-600 text-white font-extrabold text-xs inline-flex items-center justify-center gap-2 shadow-lg cursor-pointer"
        >
          <MessageCircle size={16} />
          <span>WhatsApp {firstName} ↗</span>
        </a>

        <a
          href={`tel:${lead.phone.replace(/\s/g, "")}`}
          className="size-11 rounded-2xl border border-border bg-card flex items-center justify-center text-foreground shrink-0 shadow-sm"
        >
          <Phone size={16} />
        </a>
      </div>

      {/* ═══ FULL PROJECT IMMERSION DIALOG ═══ */}
      {inspectProject && (
        <Dialog open={!!inspectProject} onOpenChange={(open) => { if (!open) setInspectProject(null); }}>
          <DialogContent className="max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl bg-card border-border p-6 sm:p-8 space-y-6">
            <DialogHeader className="border-b border-border/60 pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <DialogTitle className="text-2xl font-extrabold text-foreground font-display">
                    {inspectProject.name}
                  </DialogTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {inspectProject.developer} · {inspectProject.district}
                  </p>
                </div>
                <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-xs font-mono font-bold text-emerald-400">
                  {inspectProject.price}
                </span>
              </div>
            </DialogHeader>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {inspectProject.gallery.map((img, i) => (
                <div key={i} className="h-56 rounded-2xl overflow-hidden border border-border/60 bg-secondary">
                  <img src={img} alt="Render" className="h-full w-full object-cover hover:scale-105 transition-transform duration-300" />
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/60">
              <Button variant="outline" onClick={() => setInspectProject(null)} className="rounded-xl text-xs">
                Close
              </Button>
              <Button
                onClick={() => {
                  openWhatsApp({ phone: cleanPhone, text: currentScript, recipientName: firstName });
                }}
                className="rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 cursor-pointer"
              >
                <MessageCircle size={14} />
                <span>Send Script on WhatsApp</span>
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* ═══ LIVE DEAL ROOM PREVIEW MODAL ═══ */}
      <Dialog open={showDealRoomModal} onOpenChange={setShowDealRoomModal}>
        <DialogContent className="max-w-6xl max-h-[92vh] overflow-y-auto p-0 bg-[#F7F8FC] border border-[#E6E9F5] rounded-3xl shadow-2xl">
          <div className="p-4 bg-white border-b border-[#E6E9F5] flex items-center justify-between sticky top-0 z-50">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-extrabold text-[#141A33]">Live Deal Room Preview</span>
              <span className="px-2 py-0.5 rounded-full bg-[#EEF1FF] text-[#2A45C8] font-mono font-bold text-[10px]">
                Client View
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/deal-room/$id"
                params={{ id: lead.id }}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
              >
                <ExternalLink size={13} />
                <span>Open in Full Page</span>
              </Link>
              <button
                type="button"
                onClick={() => setShowDealRoomModal(false)}
                className="text-xs font-bold text-[#4B5272] hover:text-[#141A33] px-2.5 py-1 rounded-lg border border-[#E6E9F5] bg-[#F7F8FC]"
              >
                Close
              </button>
            </div>
          </div>
          <DealRoomView leadId={lead.id} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
