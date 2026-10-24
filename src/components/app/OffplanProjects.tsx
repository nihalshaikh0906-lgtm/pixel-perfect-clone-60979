import { useState } from "react";
import {
  Building2, Train, CreditCard, ShieldCheck, Award, MessageCircle,
  Eye, MapPin, ExternalLink, ArrowRight, Layers, Image as ImageIcon,
  Calendar, Check, ChevronDown, Sparkles, ArrowUpRight, DollarSign,
  Maximize2, X, Compass, CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useShell } from "./AppShell";

export type OffplanProjectDetail = {
  id: string;
  name: string;
  developer: string;
  district: string;
  priceAed: string;
  priceUsd: string;
  handover: string;
  paymentPlanHeadline: string;
  planMilestones: { milestone: string; percent: string }[];
  bedrooms: string;
  sizeSqft: string;
  projectedRoi: string;
  metroInfo: string;
  coverImage: string;
  gallery: string[];
  floorPlanUrl: string;
  googleMapsUrl: string;
  tagline: string;
  description: string;
  amenities: string[];
  escrowNumber: string;
  isPhpp: boolean;
  isMetroLinked: boolean;
  isWaterfront: boolean;
};

export const FAMOUS_DUBAI_PROJECTS: OffplanProjectDetail[] = [
  {
    id: "reef-995",
    name: "Reef Luxury 995",
    developer: "Reef Luxury Developments",
    district: "Dubai Land Residential Complex (DLRC)",
    priceAed: "From AED 684,000",
    priceUsd: "~$186,000 USD",
    handover: "Q4 2026",
    paymentPlanHeadline: "10% Booking · 40% Construction · 50% On Handover",
    planMilestones: [
      { milestone: "Booking Deposit", percent: "10%" },
      { milestone: "During Construction (Linked to Milestones)", percent: "40%" },
      { milestone: "Upon Final Handover (Q4 2026)", percent: "50%" },
    ],
    bedrooms: "1 & 2 Bedroom Luxury Suites",
    sizeSqft: "695 – 1,180 sq.ft",
    projectedRoi: "8.4% Net Yield",
    metroInfo: "3 Min to Dubai Metro Blue Line 2029 Station",
    coverImage: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=85",
    ],
    floorPlanUrl: "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1600&q=85",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Dubai+Land+Residential+Complex+Reef+Luxury",
    tagline: "Patented Climate-Controlled Sunken Terraces & Rooftop Lagoon",
    description: "Architectural innovation in DLRC featuring climate-controlled outdoor terraces, rooftop infinity lagoon pool, and instant connection to Al Ain Road and the upcoming Metro Blue Line.",
    amenities: ["Climate-Controlled Sunken Terraces", "Rooftop Lagoon Pool", "Technogym Studio", "Private Balcony Jacuzzi", "24/7 Concierge"],
    escrowNumber: "DLD Escrow #9952 (Emirates NBD)",
    isPhpp: true,
    isMetroLinked: true,
    isWaterfront: false,
  },
  {
    id: "bayz-102",
    name: "Bayz 102 by Danube",
    developer: "Danube Properties",
    district: "Business Bay, Dubai (Direct Canal Front)",
    priceAed: "From AED 1,290,000",
    priceUsd: "~$351,000 USD",
    handover: "Dec 2028",
    paymentPlanHeadline: "1% Monthly Post-Handover Payment Plan (70/30)",
    planMilestones: [
      { milestone: "Booking Deposit", percent: "10%" },
      { milestone: "During Construction (1% Monthly)", percent: "60%" },
      { milestone: "Post-Handover Over 30 Months (1% Monthly)", percent: "30%" },
    ],
    bedrooms: "Studio, 1 & 2 Bedrooms",
    sizeSqft: "480 – 1,120 sq.ft",
    projectedRoi: "7.9% Net Yield",
    metroInfo: "5 Mins to Business Bay Metro & Dubai Canal",
    coverImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1600&q=85",
    ],
    floorPlanUrl: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=85",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Business+Bay+Danube+Bayz+102",
    tagline: "Ultra-Luxury Skyscraper with Helipad & 40+ Lifestyle Amenities",
    description: "Soaring 102 levels above Business Bay, offering panoramic Dubai Canal vistas, an operational helipad, and Dolce Vita Italian designer furnishings.",
    amenities: ["Rooftop Helipad", "Infinity Sky Pool", "Dolce Vita Designer Furnished", "Private Cinema", "Direct Canal Promenade"],
    escrowNumber: "DLD Escrow #1024 (Mashreq Bank)",
    isPhpp: true,
    isMetroLinked: true,
    isWaterfront: true,
  },
  {
    id: "sobha-orbis",
    name: "Sobha Orbis",
    developer: "Sobha Realty",
    district: "Motor City, Dubai",
    priceAed: "From AED 985,000",
    priceUsd: "~$268,000 USD",
    handover: "Q4 2027",
    paymentPlanHeadline: "80/20 Standard Escrow Plan (10% Booking · 70% Milestones · 20% Handover)",
    planMilestones: [
      { milestone: "Booking & DLD Fee", percent: "10%" },
      { milestone: "Linked Construction Milestones", percent: "70%" },
      { milestone: "Handover Completion", percent: "20%" },
    ],
    bedrooms: "1, 1.5 & 2 Bedroom Premium Apartments",
    sizeSqft: "580 – 1,040 sq.ft",
    projectedRoi: "8.1% Net Yield",
    metroInfo: "Fast connection to Al Qudra & Hessa Street corridors",
    coverImage: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85",
    ],
    floorPlanUrl: "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1600&q=85",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Motor+City+Sobha+Orbis",
    tagline: "German Backward-Integrated Quality & Lush Botanical Landscaping",
    description: "Built with Sobha's signature self-manufactured materials and zero-tolerance precision. Expansive resort lagoons and clubhouse nestled in serene Motor City.",
    amenities: ["Signature German Craftsmanship", "Resort Lagoon Pool", "Landscaped Podium Gardens", "Clubhouse & Retail Strip", "DLD Escrow Registered"],
    escrowNumber: "DLD Escrow #8821 (Dubai Islamic Bank)",
    isPhpp: false,
    isMetroLinked: false,
    isWaterfront: false,
  },
  {
    id: "binghatti-hills",
    name: "Binghatti Hills",
    developer: "Binghatti Developers",
    district: "Dubai Science Park (Al Barsha South)",
    priceAed: "From AED 777,777",
    priceUsd: "~$211,000 USD",
    handover: "Q3 2026",
    paymentPlanHeadline: "70/30 Fast Handover Plan (20% Down · 50% Construction · 30% Handover)",
    planMilestones: [
      { milestone: "Down Payment / Booking", percent: "20%" },
      { milestone: "During Construction", percent: "50%" },
      { milestone: "Handover (Q3 2026)", percent: "30%" },
    ],
    bedrooms: "Studio, 1 & 2 Bedroom Smart Suites",
    sizeSqft: "446 – 1,480 sq.ft",
    projectedRoi: "8.8% Net Yield",
    metroInfo: "2 Mins to Dubai Hills Mall & Umm Suqeim Road",
    coverImage: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=85",
    ],
    floorPlanUrl: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=85",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Dubai+Science+Park+Binghatti+Hills",
    tagline: "Artificial Private Beach, Paddle Tennis & Integrated Smart Automation",
    description: "One of the largest residential developments in the world inspired by natural topography, featuring private sandy beach, sports facilities, and full smart-home automation.",
    amenities: ["Private Sandy Beach Lagoon", "Paddle Tennis Courts", "Smart Automation Suites", "Zen Meditation Garden", "Infinity Lap Pool"],
    escrowNumber: "DLD Escrow #4419 (First Abu Dhabi Bank)",
    isPhpp: false,
    isMetroLinked: true,
    isWaterfront: false,
  },
  {
    id: "address-zabeel",
    name: "Address Residences Zabeel",
    developer: "Emaar Properties",
    district: "Financial Centre / Zabeel, Downtown Dubai",
    priceAed: "From AED 2,150,000",
    priceUsd: "~$585,000 USD",
    handover: "Q4 2028",
    paymentPlanHeadline: "80/20 Construction-Linked Payment Plan",
    planMilestones: [
      { milestone: "Booking & 4% DLD", percent: "10%" },
      { milestone: "During Construction Milestones", percent: "70%" },
      { milestone: "100% Handover Completion", percent: "20%" },
    ],
    bedrooms: "1, 2 & 3 Bedroom Ultra-Luxury Branded Residences",
    sizeSqft: "735 – 2,100 sq.ft",
    projectedRoi: "7.5% Capital & Yield",
    metroInfo: "Direct AC Bridge to DIFC & Dubai Mall Metro",
    coverImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=85",
    ],
    floorPlanUrl: "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1600&q=85",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Address+Residences+Zabeel+Emaar",
    tagline: "Emaar Flagship 5-Star Address Hotel Living with Burj Khalifa Panorama",
    description: "Trophy branded residence offering 360-degree vistas of the Burj Khalifa, Dubai Frame, and the Arabian Gulf with full 5-star Address hotel hospitality.",
    amenities: ["Address 5-Star Hotel Services", "Burj Khalifa Panorama", "Sky Deck Infinity Pool", "DIFC Direct Air Bridge", "Private Valet Concierge"],
    escrowNumber: "DLD Escrow #3091 (Emirates NBD)",
    isPhpp: false,
    isMetroLinked: true,
    isWaterfront: false,
  },
  {
    id: "palm-jebel-ali",
    name: "Palm Jebel Ali Beach Mansions",
    developer: "Nakheel",
    district: "Palm Jebel Ali, Dubai Coastline",
    priceAed: "From AED 18,500,000",
    priceUsd: "~$5,030,000 USD",
    handover: "Q4 2028",
    paymentPlanHeadline: "80/20 Nakheel Sovereign Escrow Plan",
    planMilestones: [
      { milestone: "Reservation Deposit", percent: "20%" },
      { milestone: "Construction Milestones", percent: "60%" },
      { milestone: "Handover Completion", percent: "20%" },
    ],
    bedrooms: "5 & 6 Bedroom Private Beachfront Mansions",
    sizeSqft: "7,300 – 12,000 sq.ft",
    projectedRoi: "High Ultra-Prime Capital Growth",
    metroInfo: "Private Gated Island Causeway",
    coverImage: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85",
    ],
    floorPlanUrl: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=85",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Palm+Jebel+Ali+Nakheel",
    tagline: "Direct Private Beach Access, Marble Architecture & Yacht Mooring",
    description: "The crown jewel of Dubai's ultra-luxury coastline. Twice the size of Palm Jumeirah, offering pristine private beaches, show kitchens, and superyacht berths.",
    amenities: ["Private White Sand Beach", "Private Infinity Beach Pool", "Superyacht Mooring", "Show & Chef Prep Kitchens", "Rooftop Stargazing Terrace"],
    escrowNumber: "DLD Escrow #7701 (Dubai Islamic Bank)",
    isPhpp: false,
    isMetroLinked: false,
    isWaterfront: true,
  },
  {
    id: "mercedes-benz-places",
    name: "Mercedes-Benz Places",
    developer: "Binghatti x Mercedes-Benz",
    district: "Downtown Dubai",
    priceAed: "From AED 8,900,000",
    priceUsd: "~$2,420,000 USD",
    handover: "Q4 2026",
    paymentPlanHeadline: "70/30 Landmark Escrow Plan",
    planMilestones: [
      { milestone: "Booking & Registration", percent: "20%" },
      { milestone: "Linked Construction Stages", percent: "50%" },
      { milestone: "Handover (Q4 2026)", percent: "30%" },
    ],
    bedrooms: "2, 3 & 4 Bedroom Signature Penthouses",
    sizeSqft: "1,840 – 4,500 sq.ft",
    projectedRoi: "8.0% Iconic Trophy Asset",
    metroInfo: "2 Mins to Burj Khalifa & Dubai Opera",
    coverImage: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=85",
    ],
    floorPlanUrl: "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1600&q=85",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Downtown+Dubai+Mercedes+Benz+Places",
    tagline: "Sensual Aerodynamic Architecture with Private In-Suite Car Lifts",
    description: "The world's first Mercedes-Benz branded residential skyscraper featuring acoustic silence engineering, private car elevator to your penthouse, and direct Burj Khalifa views.",
    amenities: ["Private In-Suite Car Elevator", "Burj Khalifa Direct Panorama", "Acoustic Silence Engineering", "Mercedes-Benz Valet & Concierge", "Private Sky Pool"],
    escrowNumber: "DLD Escrow #5512 (Emirates NBD)",
    isPhpp: false,
    isMetroLinked: true,
    isWaterfront: false,
  },
];

export function OffplanProjects({
  page = 1,
  q = "",
  onSearch,
}: {
  page?: number;
  q?: string;
  onSearch?: (search: { page: number; q: string }) => void;
}) {
  const { clientMode } = useShell();
  const [filter, setFilter] = useState<"all" | "phpp" | "metro" | "waterfront">("all");
  const [activeModalProject, setActiveModalProject] = useState<OffplanProjectDetail | null>(null);
  const [modalTab, setModalTab] = useState<"gallery" | "floorplan" | "map" | "plan">("gallery");

  const filteredProjects = FAMOUS_DUBAI_PROJECTS.filter((p) => {
    if (filter === "phpp" && !p.isPhpp) return false;
    if (filter === "metro" && !p.isMetroLinked) return false;
    if (filter === "waterfront" && !p.isWaterfront) return false;
    if (q) {
      const match = `${p.name} ${p.developer} ${p.district}`.toLowerCase().includes(q.toLowerCase());
      if (!match) return false;
    }
    return true;
  });

  const handleShareWhatsApp = (project: OffplanProjectDetail) => {
    const pitch = `🏛️ *${project.name}* by *${project.developer}*\n📍 *Location:* ${project.district}\n💰 *Price:* ${project.priceAed} (${project.priceUsd})\n💳 *Payment Plan:* ${project.paymentPlanHeadline}\n🏗️ *Handover:* ${project.handover}\n📈 *Projected Yield:* ${project.projectedRoi}\n🛡️ *DLD Escrow:* ${project.escrowNumber}\n🗺️ *Location on Maps:* ${project.googleMapsUrl}\n\nWould you like me to reserve a holding unit or send the official PDF brochure and unit floor plans?`;
    window.open(`https://wa.me/?text=${encodeURIComponent(pitch)}`, "_blank");
    toast.success(`WhatsApp luxury pitch generated for ${project.name}`);
  };

  const scrollToProject = (id: string) => {
    const el = document.getElementById(`proj-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="w-full space-y-8 pb-24 animate-in fade-in-50 duration-300">
      {/* ═══ STICKY EXECUTIVE NAVIGATION & FILTER DOCK ═══ */}
      <div className="sticky top-0 z-30 -mx-4 sm:-mx-6 px-4 sm:px-6 py-3 bg-background/85 backdrop-blur-xl border-b border-border/80 flex flex-wrap items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-extrabold uppercase tracking-wider text-foreground font-display">
              Dubai Off-Plan Showcase
            </span>
          </div>
          <span className="text-muted-foreground/60 hidden sm:inline">•</span>
          <span className="text-xs text-muted-foreground hidden sm:inline">
            7 Iconic Developments · DLD Escrow Synced
          </span>
          {clientMode && (
            <span className="rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 px-2.5 py-0.5 text-[11px] font-bold font-mono">
              💎 Client Presentation Deck Active
            </span>
          )}
        </div>

        {/* Filter Pills with Generous Spacing */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs sm:text-sm font-semibold">
          {[
            { id: "all", label: "All Famous Projects" },
            { id: "phpp", label: "1% Monthly (PHPP)" },
            { id: "metro", label: "Metro 2029 Linked" },
            { id: "waterfront", label: "Ultra Waterfront" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setFilter(t.id as typeof filter)}
              className={`px-4 py-2 rounded-xl transition-all shadow-sm ${
                filter === t.id
                  ? "bg-primary text-primary-foreground font-bold shadow-md ring-2 ring-primary/20"
                  : "bg-secondary/70 text-muted-foreground hover:text-foreground hover:bg-secondary border border-border/60"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Quick Project Jump Switcher */}
        <div className="hidden lg:flex items-center gap-2 overflow-x-auto py-1">
          {FAMOUS_DUBAI_PROJECTS.map((p, idx) => (
            <button
              key={p.id}
              onClick={() => scrollToProject(p.id)}
              className="text-xs font-bold px-3 py-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/80 border border-transparent hover:border-border/60 transition-all shrink-0"
            >
              #{idx + 1} {p.name.split(" ")[0]}
            </button>
          ))}
        </div>
      </div>

      {/* ═══ FULL-SCREEN EDITORIAL PROJECTS STREAM (ONE PROJECT PER SCREEN) ═══ */}
      <div className="space-y-12">
        {filteredProjects.map((project, index) => (
          <section
            id={`proj-${project.id}`}
            key={project.id}
            className="group relative min-h-[85vh] lg:h-[calc(100vh-6.5rem)] rounded-3xl border border-border/80 bg-card overflow-hidden shadow-xl flex flex-col lg:flex-row transition-all"
          >
            {/* ═══ LEFT SIDE: THE BIG CINEMATIC IMAGE MONOLITH (COVERS FULL LEFT) ═══ */}
            <div className="relative lg:w-7/12 h-64 sm:h-80 lg:h-full overflow-hidden bg-secondary">
              <img
                src={project.coverImage}
                alt={project.name}
                className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

              {/* Top Floating Badges */}
              <div className="absolute top-5 left-5 right-5 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-white px-3.5 py-1 text-xs font-bold font-mono">
                    #{String(index + 1).padStart(2, "0")} · {project.developer}
                  </span>
                  <span className="rounded-full bg-emerald-500/90 backdrop-blur-md text-white px-3 py-1 text-xs font-bold flex items-center gap-1 shadow-sm">
                    <ShieldCheck size={13} /> Escrow Verified
                  </span>
                </div>

                <span className="rounded-full bg-amber-500/90 backdrop-blur-md text-black px-3 py-1 text-xs font-extrabold font-mono">
                  {project.projectedRoi}
                </span>
              </div>

              {/* Bottom Visual Highlights on Image */}
              <div className="absolute bottom-6 left-6 right-6 space-y-2 text-white">
                <p className="text-xs uppercase tracking-widest text-emerald-300 font-bold font-mono">
                  {project.district}
                </p>
                <h2 className="text-3xl sm:text-4xl font-extrabold font-display leading-tight tracking-tight drop-shadow-md">
                  {project.name}
                </h2>
                <p className="text-xs sm:text-sm text-zinc-300 italic max-w-xl">
                  "{project.tagline}"
                </p>

                {/* Thumbnail Previews & Gallery Launcher */}
                <div className="pt-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {project.gallery.slice(0, 3).map((img, i) => (
                      <div
                        key={i}
                        onClick={() => {
                          setActiveModalProject(project);
                          setModalTab("gallery");
                        }}
                        className="size-12 rounded-xl overflow-hidden border-2 border-white/40 cursor-pointer hover:border-emerald-400 transition-all hover:scale-105"
                      >
                        <img src={img} alt="Thumb" className="size-full object-cover" />
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      setActiveModalProject(project);
                      setModalTab("gallery");
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-bold bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-3.5 py-2 rounded-xl transition-all"
                  >
                    <Maximize2 size={13} />
                    <span>View 4K Gallery</span>
                  </button>
                </div>
              </div>
            </div>

            {/* ═══ RIGHT SIDE: DATA & INFORMATION COCKPIT ═══ */}
            <div className="lg:w-5/12 p-6 sm:p-8 flex flex-col justify-between bg-card overflow-y-auto space-y-6">
              <div className="space-y-5">
                {/* Header & Pricing */}
                <div className="space-y-2 border-b border-border/70 pb-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Developer Direct Allocation
                    </span>
                    <span className="rounded-full bg-secondary border border-border px-2.5 py-0.5 text-[11px] font-mono text-muted-foreground">
                      Handover {project.handover}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-3">
                    <p className="text-3xl sm:text-4xl font-black text-foreground font-mono font-display text-emerald-400">
                      {project.priceAed}
                    </p>
                    <span className="text-xs font-semibold text-muted-foreground font-mono">
                      ({project.priceUsd})
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin size={13} className="text-rose-400 shrink-0" />
                    <span className="truncate">{project.district}</span>
                  </p>
                </div>

                {/* Payment Plan Milestone Flow (Not Basic Box) */}
                <div className="rounded-2xl bg-secondary/40 border border-border/70 p-4 sm:p-5 space-y-3.5">
                  <div className="flex items-center justify-between text-sm font-bold text-foreground">
                    <span className="flex items-center gap-2">
                      <CreditCard size={15} className="text-primary" />
                      <span>Payment Plan Structure</span>
                    </span>
                    <span className="text-emerald-400 font-mono text-xs font-bold">
                      {project.isPhpp ? "Post-Handover Available" : "Escrow Construction Linked"}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm font-semibold text-foreground/90 leading-relaxed">
                    {project.paymentPlanHeadline}
                  </p>

                  <div className="space-y-2 pt-1 border-t border-border/50">
                    {project.planMilestones.map((m, i) => (
                      <div key={i} className="flex items-center justify-between text-xs sm:text-[13px] text-muted-foreground">
                        <span>{m.milestone}</span>
                        <span className="font-mono font-bold text-foreground">{m.percent}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key Metrics Ribbon */}
                <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
                  <div className="rounded-2xl bg-secondary/30 border border-border/60 p-3.5 space-y-1">
                    <span className="text-muted-foreground uppercase text-xs font-bold block">Configurations</span>
                    <p className="font-extrabold text-foreground text-sm truncate">{project.bedrooms}</p>
                    <p className="text-xs text-muted-foreground">{project.sizeSqft}</p>
                  </div>

                  <div className="rounded-2xl bg-secondary/30 border border-border/60 p-3.5 space-y-1">
                    <span className="text-muted-foreground uppercase text-xs font-bold block">Transit &amp; Metro</span>
                    <p className="font-extrabold text-foreground text-sm truncate">{project.metroInfo}</p>
                    <p className="text-xs text-muted-foreground">High Capital Growth</p>
                  </div>
                </div>

                {/* Narrative Overview */}
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {project.description}
                </p>

                {/* Verified Amenities Tags */}
                <div className="space-y-2.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                    Signature Amenities
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {project.amenities.map((amenity) => (
                      <span
                        key={amenity}
                        className="rounded-full bg-secondary/80 border border-border px-3 py-1 text-xs font-semibold text-foreground shadow-xs"
                      >
                        ✓ {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Hub */}
              <div className="pt-4 border-t border-border/60 space-y-2.5">
                <Button
                  onClick={() => handleShareWhatsApp(project)}
                  className="w-full h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <MessageCircle size={16} />
                  <span>Share 1-Click Dossier to WhatsApp Client</span>
                </Button>

                <div className="flex gap-2.5">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setActiveModalProject(project);
                      setModalTab("floorplan");
                    }}
                    className="flex-1 h-11 rounded-2xl border-border text-xs sm:text-[13px] font-bold gap-1.5 text-foreground hover:bg-secondary cursor-pointer"
                  >
                    <Layers size={15} className="text-primary" />
                    <span>Floor Plans</span>
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => {
                      setActiveModalProject(project);
                      setModalTab("map");
                    }}
                    className="flex-1 h-10 rounded-2xl border-border text-xs font-bold gap-1.5 text-foreground hover:bg-secondary"
                  >
                    <MapPin size={14} className="text-rose-400" />
                    <span>Location Maps</span>
                  </Button>
                </div>

                <div className="flex items-center justify-between text-[11px] text-muted-foreground px-1 pt-1 font-mono">
                  <span>{project.escrowNumber}</span>
                  <span className="text-emerald-400 font-bold">100% Verified DLD Allocation</span>
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* ═══ FULL-SCREEN PROJECT IMMERSION DIALOG (GALLERY, MAP, FLOOR PLAN, PLAN) ═══ */}
      {activeModalProject && (
        <Dialog open={!!activeModalProject} onOpenChange={(open) => { if (!open) setActiveModalProject(null); }}>
          <DialogContent className="max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl bg-card border-border p-6 sm:p-8 space-y-6">
            <DialogHeader className="border-b border-border/60 pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <DialogTitle className="text-2xl font-extrabold text-foreground font-display">
                    {activeModalProject.name}
                  </DialogTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {activeModalProject.developer} · {activeModalProject.district}
                  </p>
                </div>
                <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-xs font-mono font-bold text-emerald-400">
                  {activeModalProject.priceAed}
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
                    onClick={() => setModalTab(t.id as typeof modalTab)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      modalTab === t.id
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
            {modalTab === "gallery" && (
              <div className="space-y-3 animate-in fade-in-50 duration-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeModalProject.gallery.map((img, i) => (
                    <div key={i} className="h-56 rounded-2xl overflow-hidden border border-border/60 bg-secondary">
                      <img src={img} alt="Render" className="h-full w-full object-cover hover:scale-105 transition-transform duration-300" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: FLOOR PLAN */}
            {modalTab === "floorplan" && (
              <div className="space-y-3 animate-in fade-in-50 duration-200">
                <div className="h-80 rounded-2xl border border-border/60 overflow-hidden bg-secondary/30 p-2 flex items-center justify-center">
                  <img
                    src={activeModalProject.floorPlanUrl}
                    alt="Floor Plan"
                    className="max-h-full max-w-full object-contain rounded-xl"
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
                  <span>Configuration: <strong>{activeModalProject.bedrooms}</strong></span>
                  <span>Total Area: <strong>{activeModalProject.sizeSqft}</strong></span>
                </div>
              </div>
            )}

            {/* TAB 3: LOCATION & MAP */}
            {modalTab === "map" && (
              <div className="space-y-4 animate-in fade-in-50 duration-200">
                <div className="rounded-2xl border border-border/60 bg-secondary/30 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <MapPin size={15} className="text-rose-400" /> {activeModalProject.district}
                    </span>
                    <a
                      href={activeModalProject.googleMapsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                    >
                      <span>Open Satellite Coordinates</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {activeModalProject.description}
                  </p>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-foreground">Luxury Amenities:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeModalProject.amenities.map((a) => (
                      <span key={a} className="rounded-full bg-secondary border border-border px-2.5 py-0.5 text-[11px] font-medium text-foreground">
                        ✓ {a}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: PAYMENT PLAN */}
            {modalTab === "plan" && (
              <div className="space-y-4 animate-in fade-in-50 duration-200">
                <div className="space-y-2">
                  {activeModalProject.planMilestones.map((s, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3.5 rounded-2xl bg-secondary/40 border border-border/50 text-xs">
                      <span className="font-semibold text-foreground">{s.milestone}</span>
                      <span className="font-mono font-extrabold text-emerald-400">{s.percent}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  {activeModalProject.escrowNumber} · Handover Targeted {activeModalProject.handover}
                </p>
              </div>
            )}

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/60">
              <Button variant="outline" onClick={() => setActiveModalProject(null)} className="rounded-xl text-xs">
                Close
              </Button>
              <Button
                onClick={() => handleShareWhatsApp(activeModalProject)}
                className="rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
              >
                <MessageCircle size={14} />
                <span>Share Complete Dossier to WhatsApp Client</span>
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
