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
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export const Route = createFileRoute("/_authenticated/app/leads/$id")({
  head: () => ({
    meta: [
      { title: "Lead Dossier & AI Match — DealOS" },
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

  return <BespokeLeadDossier lead={lead} />;
}

function BespokeLeadDossier({ lead }: { lead: Lead }) {
  const [stage, setStage] = useState<Stage>(lead.stage);
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const [inspectProject, setInspectProject] = useState<ProjectDetail | null>(null);
  const [activeModalTab, setActiveModalTab] = useState<"gallery" | "map" | "floorplan" | "plan">("gallery");

  // AI State
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiChatHistory, setAiChatHistory] = useState<{ role: "user" | "assistant"; text: string }[]>([]);
  const [aiTyping, setAiTyping] = useState(false);
  const [copiedPitch, setCopiedPitch] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [lead.id]);

  const p = priorityOf(lead);
  const cleanPhone = lead.phone.replace(/\D/g, "");
  const heroProject = VERIFIED_MATCHES[activeProjectIndex];

  const defaultPitch = `Hi ${lead.name.split(" ")[0]}, following up on your search for ${wants(lead)} (Budget: ${formatAed(lead.budget)}). We just received direct developer allocations for ${heroProject.name} (${heroProject.paymentPlan}) with verified DLD escrow. When are you free today for a quick 2-minute overview?`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPitch(true);
    toast.success("WhatsApp pitch copied to clipboard!");
    setTimeout(() => setCopiedPitch(false), 2000);
  };

  const handleSendAi = (customText?: string) => {
    const q = (customText || aiQuestion).trim();
    if (!q) return;

    setAiChatHistory((prev) => [...prev, { role: "user", text: q }]);
    setAiQuestion("");
    setAiTyping(true);

    setTimeout(() => {
      let reply = "";
      if (q.toLowerCase().includes("pitch") || q.toLowerCase().includes("whatsapp")) {
        reply = `Here is a high-converting WhatsApp message tailored for **${lead.name.split(" ")[0]}**:

> *"Hi ${lead.name.split(" ")[0]}, hope you're having a great week! Following up on your requirement for a ${lead.beds} BR in ${lead.area} (Budget: ${formatAed(lead.budget)}). I reserved a high-floor unit at **${heroProject.name}** with ${heroProject.paymentPlan} and projected **${heroProject.roi}**. Would you like me to send the official PDF brochure and payment breakdown today?"*`;
      } else if (q.toLowerCase().includes("objection") || q.toLowerCase().includes("hesitant")) {
        reply = `**Objection Handling Guide for ${lead.name}:**
* **If hesitant on completion:** Reassure them that **${heroProject.name}** has an approved Dubai Land Department Escrow account where buyer funds are legally linked to verified construction milestones.
* **If asking about resale flexibility:** Highlight that developer policy allows resale after completing only 30-40% of payments, offering strong early capital appreciation exits.`;
      } else {
        reply = `**Strategic Overview for ${lead.name}:**
This client matches **${heroProject.name}** with a **${heroProject.matchScore}% affinity score**. Their target budget of **${formatAed(lead.budget)}** comfortably accommodates this development. Recommend locking an EOI reservation deposit before the developer's upcoming phase price revision.`;
      }

      setAiChatHistory((prev) => [...prev, { role: "assistant", text: reply }]);
      setAiTyping(false);
    }, 750);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-20 animate-in fade-in-50 duration-200">
      {/* ═══ TOP BREADCRUMB ═══ */}
      <div className="flex items-center justify-between">
        <Link
          to="/app/leads"
          search={{ queue: "all" }}
          className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Leads Inbox</span>
        </Link>
        <span className="text-xs text-muted-foreground font-mono">Dossier #{lead.id} · Dubai Market Live</span>
      </div>

      {/* ═══ 1. BESPOKE INVESTOR CANOPY (NON-COLUMN, HORIZONTAL FLUID RIBBON) ═══ */}
      <section className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-r from-card via-card/95 to-secondary/30 p-6 sm:p-8 shadow-sm">
        {/* Subtle Ambient Accent */}
        <div className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-primary/10 blur-3xl" />

        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Identity & Ring */}
          <div className="flex items-center gap-5">
            <div className="relative flex size-16 shrink-0 items-center justify-center rounded-2xl bg-secondary border border-border/80 font-display font-black text-2xl text-foreground shadow-sm">
              {lead.initials}
              <span className={`absolute -bottom-1 -right-1 size-5 rounded-full border-2 border-card flex items-center justify-center text-[10px] font-bold text-white ${
                p === "Hot" ? "bg-rose-500" : p === "Warm" ? "bg-amber-500" : "bg-blue-500"
              }`}>
                ★
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-display">
                  {lead.name}
                </h1>
                <span className="text-xs font-semibold text-muted-foreground">({lead.country})</span>
                <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-bold text-emerald-400 font-mono">
                  Score {lead.score} · {p}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Inbound inquiry received {ago(lead.receivedHoursAgo)} via <strong className="text-foreground">{lead.source}</strong> · Verified Lead
              </p>
            </div>
          </div>

          {/* Action Hub */}
          <div className="flex flex-wrap items-center gap-2.5">
            <a
              href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(defaultPitch)}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all"
            >
              <MessageCircle size={15} />
              <span>WhatsApp Client</span>
            </a>

            <a
              href={`tel:${lead.phone.replace(/\s/g, "")}`}
              className="inline-flex items-center gap-2 h-10 px-4 rounded-xl border border-border bg-card hover:bg-secondary text-foreground font-bold text-xs transition-all"
            >
              <Phone size={15} className="text-muted-foreground" />
              <span>Call ({lead.phone})</span>
            </a>

            <select
              value={stage}
              onChange={(e) => {
                setStage(e.target.value as Stage);
                toast.success(`Stage moved to ${e.target.value}`);
              }}
              className="h-10 px-3 rounded-xl border border-border bg-card text-foreground font-bold text-xs cursor-pointer focus:outline-none focus:border-primary"
            >
              {[...OPEN_STAGES, "Won", "Lost"].map((st) => (
                <option key={st} value={st}>
                  Stage: {st}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ═══ UNIQUE INVESTOR FLOW RIBBON (NOT BASIC SEPARATE SQUARES) ═══ */}
        <div className="mt-6 pt-5 border-t border-border/60 flex flex-wrap items-center gap-3 text-xs">
          <div className="inline-flex items-center gap-2 rounded-xl bg-secondary/60 border border-border/80 px-3.5 py-2">
            <span className="text-muted-foreground uppercase text-[10px] font-bold tracking-wider">Budget</span>
            <span className="font-mono font-extrabold text-foreground text-sm">{formatAed(lead.budget)}</span>
          </div>

          <span className="text-muted-foreground/60 hidden sm:inline">➔</span>

          <div className="inline-flex items-center gap-2 rounded-xl bg-secondary/60 border border-border/80 px-3.5 py-2">
            <span className="text-muted-foreground uppercase text-[10px] font-bold tracking-wider">Wishlist</span>
            <span className="font-bold text-foreground text-sm">{wants(lead)} in {lead.area}</span>
          </div>

          <span className="text-muted-foreground/60 hidden sm:inline">➔</span>

          <div className="inline-flex items-center gap-2 rounded-xl bg-secondary/60 border border-border/80 px-3.5 py-2">
            <span className="text-muted-foreground uppercase text-[10px] font-bold tracking-wider">Payment Mode</span>
            <span className="font-bold text-foreground text-sm">{lead.payment}</span>
          </div>

          <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground bg-card/60 px-3 py-1.5 rounded-xl border border-border/60">
            <FileText size={13} className="text-primary" />
            <span className="italic truncate max-w-xs">"{lead.message}"</span>
          </div>
        </div>
      </section>

      {/* ═══ 2. NON-COLUMN EDITORIAL SPOTLIGHT & CURATED DECK ═══ */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-foreground font-display flex items-center gap-2">
              <Award className="size-5 text-amber-400" />
              <span>Curated Dubai Allocations for {lead.name.split(" ")[0]}</span>
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Select any project to explore full architectural renders, Google Maps satellite coordinates, floor plans, and escrow plans.
            </p>
          </div>

          {/* Quick Selector Tabs between matches */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-secondary/70 border border-border/60 text-xs font-bold">
            {VERIFIED_MATCHES.map((m, idx) => (
              <button
                key={m.id}
                onClick={() => setActiveProjectIndex(idx)}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activeProjectIndex === idx
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Match #{idx + 1} ({m.matchScore}%)
              </button>
            ))}
          </div>
        </div>

        {/* ═══ HERO EDITORIAL SPOTLIGHT CARD (CINEMATIC PANORAMA) ═══ */}
        <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-card shadow-lg flex flex-col lg:flex-row">
          {/* Panoramic Visual (Left / Top) */}
          <div className="relative lg:w-7/12 h-72 sm:h-96 overflow-hidden bg-secondary">
            <img
              src={heroProject.coverImage}
              alt={heroProject.name}
              className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className="rounded-full bg-emerald-500/90 text-white px-3 py-1 text-xs font-bold backdrop-blur-md">
                ★ {heroProject.matchScore}% Investor Match
              </span>
              <span className="rounded-full bg-black/60 text-white px-3 py-1 text-xs font-mono backdrop-blur-md">
                {heroProject.roi}
              </span>
            </div>

            <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary-foreground/80">{heroProject.developer}</span>
              <h3 className="text-2xl sm:text-3xl font-extrabold font-display leading-tight">{heroProject.name}</h3>
              <p className="text-xs text-zinc-300 flex items-center gap-1">
                <MapPin size={13} className="text-rose-400" /> {heroProject.district}
              </p>
            </div>
          </div>

          {/* Details & Actions HUD (Right / Bottom) */}
          <div className="lg:w-5/12 p-6 sm:p-8 flex flex-col justify-between bg-card space-y-5">
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Direct Developer Pricing</span>
                <p className="text-2xl sm:text-3xl font-extrabold text-foreground font-mono font-display text-emerald-400 mt-0.5">
                  {heroProject.price}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{heroProject.bedrooms} · {heroProject.size}</p>
              </div>

              <div className="rounded-2xl bg-secondary/50 border border-border/60 p-4 space-y-2 text-xs">
                <div className="flex items-center justify-between font-semibold text-foreground">
                  <span>Payment Schedule:</span>
                  <span className="font-mono text-emerald-400">Handover {heroProject.handover}</span>
                </div>
                <p className="text-muted-foreground leading-relaxed">{heroProject.paymentPlan}</p>
              </div>

              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                {heroProject.description}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-3 border-t border-border/50">
              <Button
                onClick={() => {
                  setInspectProject(heroProject);
                  setActiveModalTab("gallery");
                }}
                className="w-full h-11 rounded-2xl text-xs font-bold bg-primary text-primary-foreground gap-2 shadow-sm"
              >
                <Eye size={15} />
                <span>Open All Details (Images, Maps, Floor Plans)</span>
                <ArrowUpRight size={14} />
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  const text = `Hi ${lead.name.split(" ")[0]}! I matched your criteria with *${heroProject.name}* in ${heroProject.district}.\nStarting Price: ${heroProject.price}\nPayment Plan: ${heroProject.paymentPlan}\nHandover: ${heroProject.handover}\nLocation on Maps: ${heroProject.googleMapsUrl}`;
                  window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`, "_blank");
                }}
                className="w-full h-10 rounded-2xl text-xs font-bold border-border gap-2 text-foreground hover:bg-secondary"
              >
                <MessageCircle size={15} className="text-emerald-500" />
                <span>Share Complete Developer Dossier to WhatsApp</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Floating Mini Cards for Other Matches */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {VERIFIED_MATCHES.filter((_, idx) => idx !== activeProjectIndex).map((alt) => (
            <div
              key={alt.id}
              onClick={() => setActiveProjectIndex(VERIFIED_MATCHES.findIndex((m) => m.id === alt.id))}
              className="group cursor-pointer rounded-2xl border border-border/70 bg-card/70 hover:border-primary/50 hover:bg-card p-4 transition-all duration-200 flex items-center justify-between gap-4 shadow-sm"
            >
              <div className="flex items-center gap-3 min-w-0">
                <img src={alt.coverImage} alt={alt.name} className="size-12 rounded-xl object-cover shrink-0" />
                <div className="min-w-0">
                  <h4 className="font-bold text-sm text-foreground truncate group-hover:text-primary transition-colors">
                    {alt.name}
                  </h4>
                  <p className="text-xs text-muted-foreground truncate">{alt.district} · {alt.price}</p>
                </div>
              </div>
              <span className="text-xs font-bold text-primary shrink-0 flex items-center gap-1">
                <span>Switch to Spotlight</span>
                <ArrowRight size={13} />
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ 3. DEDICATED AI STRATEGY TERMINAL (UNDERNEATH) ═══ */}
      <section className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/60 pb-5">
          <div className="flex items-center gap-3">
            <div className="size-11 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">
                DealOS AI Copilot · Dedicated to {lead.name}
              </h2>
              <p className="text-xs text-muted-foreground">
                Strategic advice, objection handlers, and custom closing pitches for this specific client.
              </p>
            </div>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={() => copyToClipboard(defaultPitch)}
            className="rounded-xl text-xs font-semibold gap-1.5 border-border"
          >
            {copiedPitch ? <CheckCheck size={14} className="text-emerald-400" /> : <Copy size={14} />}
            <span>{copiedPitch ? "Pitch Copied" : "Copy WhatsApp Pitch"}</span>
          </Button>
        </div>

        {/* Interactive Quick Prompts */}
        <div className="flex flex-wrap gap-2">
          {[
            "💬 Draft 10-Second WhatsApp Opener",
            "🛡️ Address Handover Delay Objection",
            `📊 Compare ${heroProject.name} vs Alternative`,
            "💰 Calculate Mortgage & Cash-flow Milestones",
          ].map((promptText) => (
            <button
              key={promptText}
              onClick={() => handleSendAi(promptText)}
              className="text-xs font-semibold px-3 py-1.5 rounded-full border border-border bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground transition-all"
            >
              {promptText}
            </button>
          ))}
        </div>

        {/* AI Stream */}
        <div className="space-y-4">
          <div className="rounded-2xl bg-secondary/30 border border-border/60 p-5 text-sm space-y-2.5 leading-relaxed">
            <div className="flex items-center gap-2 text-xs font-bold text-primary">
              <Sparkles size={14} />
              <span>Lead Strategic Summary:</span>
            </div>
            <p className="text-foreground">
              <strong>{lead.name}</strong> is seeking a <strong>{wants(lead)}</strong> with a maximum budget of <strong>{formatAed(lead.budget)}</strong>. With <strong>{heroProject.name}</strong> priced at <strong>{heroProject.price}</strong>, they retain substantial financial headroom. We recommend emphasizing the <strong>{heroProject.paymentPlan}</strong> to secure an EOI reservation holding slip today.
            </p>
          </div>

          {aiChatHistory.map((item, idx) => (
            <div
              key={idx}
              className={`rounded-2xl p-4 text-sm leading-relaxed ${
                item.role === "user"
                  ? "bg-primary text-primary-foreground font-semibold ml-auto max-w-xl text-right"
                  : "bg-secondary/40 border border-border/70 text-foreground max-w-2xl"
              }`}
            >
              <div className="whitespace-pre-wrap">{item.text}</div>
            </div>
          ))}

          {aiTyping && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground p-3">
              <Sparkles size={14} className="text-primary animate-spin" />
              <span>DealOS AI is drafting strategy...</span>
            </div>
          )}
        </div>

        {/* Prompt Input */}
        <div className="flex gap-2">
          <input
            value={aiQuestion}
            onChange={(e) => setAiQuestion(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleSendAi(); }}
            placeholder={`Ask DealOS AI anything about ${lead.name.split(" ")[0]}...`}
            className="flex-1 h-11 rounded-2xl border border-border bg-secondary/40 px-4 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
          />
          <Button
            onClick={() => handleSendAi()}
            disabled={!aiQuestion.trim()}
            className="h-11 px-5 rounded-2xl bg-primary text-primary-foreground text-xs font-bold gap-2"
          >
            <span>Send</span>
            <Send size={14} />
          </Button>
        </div>
      </section>

      {/* ═══ 4. COMPLETE PROJECT IMMERSION MODAL (GALLERY, MAP, FLOOR PLAN, PLAN) ═══ */}
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

              {/* Modal Tabs */}
              <div className="flex items-center gap-2 pt-3">
                {[
                  { id: "gallery", label: "📸 4K Gallery", icon: ImageIcon },
                  { id: "floorplan", label: "📐 Floor Plan", icon: Layers },
                  { id: "map", label: "🗺️ Location & Maps", icon: MapPin },
                  { id: "plan", label: "💳 Payment Schedule", icon: Calendar },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveModalTab(t.id as typeof activeModalTab)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      activeModalTab === t.id
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-secondary/70 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </DialogHeader>

            {/* TAB 1: GALLERY */}
            {activeModalTab === "gallery" && (
              <div className="space-y-3 animate-in fade-in-50 duration-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {inspectProject.gallery.map((img, i) => (
                    <div key={i} className="h-56 rounded-2xl overflow-hidden border border-border/60 bg-secondary">
                      <img src={img} alt="Render" className="h-full w-full object-cover hover:scale-105 transition-transform duration-300" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: FLOOR PLAN */}
            {activeModalTab === "floorplan" && (
              <div className="space-y-3 animate-in fade-in-50 duration-200">
                <div className="h-80 rounded-2xl border border-border/60 overflow-hidden bg-secondary/30 p-2 flex items-center justify-center">
                  <img
                    src={inspectProject.floorPlanUrl}
                    alt="Floor Plan"
                    className="max-h-full max-w-full object-contain rounded-xl"
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
                  <span>Configuration: <strong>{inspectProject.bedrooms}</strong></span>
                  <span>Total Area: <strong>{inspectProject.size}</strong></span>
                </div>
              </div>
            )}

            {/* TAB 3: LOCATION & MAP */}
            {activeModalTab === "map" && (
              <div className="space-y-4 animate-in fade-in-50 duration-200">
                <div className="rounded-2xl border border-border/60 bg-secondary/30 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <MapPin size={15} className="text-rose-400" /> {inspectProject.district}
                    </span>
                    <a
                      href={inspectProject.googleMapsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                    >
                      <span>Open Satellite Coordinates</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {inspectProject.description}
                  </p>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-foreground">Luxury Amenities:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {inspectProject.amenities.map((a) => (
                      <span key={a} className="rounded-full bg-secondary border border-border px-2.5 py-0.5 text-[11px] font-medium text-foreground">
                        ✓ {a}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: PAYMENT PLAN */}
            {activeModalTab === "plan" && (
              <div className="space-y-4 animate-in fade-in-50 duration-200">
                <div className="space-y-2">
                  {inspectProject.planBreakdown.map((s, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3.5 rounded-2xl bg-secondary/40 border border-border/50 text-xs">
                      <span className="font-semibold text-foreground">{s.milestone}</span>
                      <span className="font-mono font-extrabold text-emerald-400">{s.percent}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  DLD Escrow Account Registered · Handover Targeted {inspectProject.handover}
                </p>
              </div>
            )}

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/60">
              <Button variant="outline" onClick={() => setInspectProject(null)} className="rounded-xl text-xs">
                Close
              </Button>
              <Button
                onClick={() => {
                  const text = `Hi ${lead.name.split(" ")[0]}! Here is the complete developer dossier for *${inspectProject.name}* in ${inspectProject.district}:\n\nPrice: ${inspectProject.price}\nPayment Plan: ${inspectProject.paymentPlan}\nHandover: ${inspectProject.handover}\nLocation on Maps: ${inspectProject.googleMapsUrl}`;
                  window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`, "_blank");
                }}
                className="rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
              >
                <MessageCircle size={14} />
                <span>Share Complete Dossier to {lead.name.split(" ")[0]}</span>
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
