import { useState } from "react";
import {
  Building2, MapPin, ExternalLink, MessageCircle, Phone, Sparkles,
  Layers, Image as ImageIcon, Calendar, Check, ShieldCheck,
  ArrowUpRight, Search, CheckCircle2, User, Users, FileText,
  Share2, Key, Award, DollarSign, Home
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LEADS, formatAed, type Lead } from "@/lib/demo-leads";
import { toast } from "sonner";
import { useShell } from "./AppShell";

export type ReadyProperty = {
  id: string;
  title: string;
  community: string;
  developer: string;
  priceAed: number;
  priceFormatted: string;
  priceUsd: string;
  status: "Vacant on Transfer" | "Tenanted (High ROI)" | "Owner Occupied";
  tenancyYield?: string;
  serviceCharge: string;
  bedrooms: number;
  bathrooms: number;
  sizeSqft: number;
  furnishing: "Fully Furnished" | "Semi-Furnished" | "Unfurnished";
  view: string;
  titleDeedStatus: string;
  mortgageEligible: boolean;
  coverImage: string;
  gallery: string[];
  floorPlanUrl: string;
  googleMapsUrl: string;
  description: string;
  amenities: string[];
  permitNumber: string;
};

export const DEMO_READY_PROPERTIES: ReadyProperty[] = [
  {
    id: "ready-address-skyview",
    title: "The Address Sky View Luxury Suite",
    community: "Downtown Dubai",
    developer: "Emaar Properties",
    priceAed: 4650000,
    priceFormatted: "AED 4,650,000",
    priceUsd: "~$1,265,000 USD",
    status: "Vacant on Transfer",
    serviceCharge: "AED 38 / sq.ft",
    bedrooms: 2,
    bathrooms: 3,
    sizeSqft: 1540,
    furnishing: "Fully Furnished",
    view: "Burj Khalifa & Skybridge Panorama",
    titleDeedStatus: "DLD Title Deed Issued (Clean Title)",
    mortgageEligible: true,
    coverImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=80",
    ],
    floorPlanUrl: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1400&q=80",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Address+Sky+View+Downtown+Dubai",
    description: "Trophy handed-over residence in the iconic twin-tower Address Sky View. Connected via private air bridge to Dubai Mall and Metro. Designer furniture package by Address Hotels included.",
    amenities: ["Address 5-Star Hotel Services", "Infinity Rooftop Pool", "Burj Khalifa Panorama", "Direct Dubai Mall Air-Bridge", "Valet Parking"],
    permitNumber: "Trakheesi Permit #712490 (Verified Live)",
  },
  {
    id: "ready-marina-gate",
    title: "Marina Gate II Waterfront Residence",
    community: "Dubai Marina",
    developer: "Select Group",
    priceAed: 2850000,
    priceFormatted: "AED 2,850,000",
    priceUsd: "~$775,000 USD",
    status: "Vacant on Transfer",
    serviceCharge: "AED 18.5 / sq.ft",
    bedrooms: 2,
    bathrooms: 2,
    sizeSqft: 1220,
    furnishing: "Semi-Furnished",
    view: "Direct Marina Promenade & Yacht Club",
    titleDeedStatus: "Title Deed Ready for Immediate DLD Transfer",
    mortgageEligible: true,
    coverImage: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80",
    ],
    floorPlanUrl: "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1400&q=80",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Marina+Gate+2+Dubai+Marina",
    description: "Premium corner suite in Marina Gate II. Floor-to-ceiling glass wrapping around the living room with uninterrupted views of the yachts. Vacant and ready for personal use or holiday rental.",
    amenities: ["Infinity Waterfront Pool", "Technogym Two-Level Gym", "Squash & Paddle Courts", "Direct Marina Walk Access", "24/7 Security"],
    permitNumber: "Trakheesi Permit #884120 (Verified Live)",
  },
  {
    id: "ready-maple-dubai-hills",
    title: "Maple 2 Family Villa with Landscaped Garden",
    community: "Dubai Hills Estate",
    developer: "Emaar Properties",
    priceAed: 4950000,
    priceFormatted: "AED 4,950,000",
    priceUsd: "~$1,348,000 USD",
    status: "Owner Occupied",
    serviceCharge: "AED 3.8 / sq.ft",
    bedrooms: 4,
    bathrooms: 4,
    sizeSqft: 2460,
    furnishing: "Unfurnished",
    view: "Single Row Backing Green Belt",
    titleDeedStatus: "DLD Title Deed Issued",
    mortgageEligible: true,
    coverImage: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80",
    ],
    floorPlanUrl: "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1400&q=80",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Maple+2+Dubai+Hills+Estate",
    description: "Immaculate single-row Type 2E villa in Maple 2. Private pergola garden, maid's room, covered dual carport, and 3 minutes walk to community pool and children's park.",
    amenities: ["Private Landscaped Garden", "Maid's Room with Ensuite", "Community Pool & Park", "Barbecue Pavilion", "Dubai Hills Golf Club Access"],
    permitNumber: "Trakheesi Permit #339102 (Verified Live)",
  },
  {
    id: "ready-executive-towers",
    title: "Executive Towers Canal Residence",
    community: "Business Bay",
    developer: "Dubai Properties",
    priceAed: 1480000,
    priceFormatted: "AED 1,480,000",
    priceUsd: "~$403,000 USD",
    status: "Tenanted (High ROI)",
    tenancyYield: "8.1% Net Rental Yield (AED 120k/yr)",
    serviceCharge: "AED 15 / sq.ft",
    bedrooms: 1,
    bathrooms: 2,
    sizeSqft: 980,
    furnishing: "Fully Furnished",
    view: "Dubai Canal & Skyline View",
    titleDeedStatus: "Title Deed in Hand (Mortgage Free)",
    mortgageEligible: true,
    coverImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1400&q=80",
    ],
    floorPlanUrl: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1400&q=80",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Executive+Towers+Business+Bay",
    description: "High-yield investment asset in Executive Towers. Currently tenanted to a corporate professional. Direct access to Bay Avenue Mall, Spinneys, and Business Bay Metro station.",
    amenities: ["Direct Bay Avenue Mall Link", "Business Bay Metro 2 Min", "Swimming Pool & Gym", "High Rental Yield", "Covered Basement Parking"],
    permitNumber: "Trakheesi Permit #440915 (Verified Live)",
  },
  {
    id: "ready-one-palm",
    title: "One Palm Dorchester Beachfront Residence",
    community: "Palm Jumeirah",
    developer: "Omniyat",
    priceAed: 16500000,
    priceFormatted: "AED 16,500,000",
    priceUsd: "~$4,490,000 USD",
    status: "Vacant on Transfer",
    serviceCharge: "AED 42 / sq.ft",
    bedrooms: 3,
    bathrooms: 4,
    sizeSqft: 3450,
    furnishing: "Fully Furnished",
    view: "Private Beach, Sunset & Marina Skyline",
    titleDeedStatus: "Handed Over · Title Deed Issued",
    mortgageEligible: true,
    coverImage: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1400&q=80",
    ],
    floorPlanUrl: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1400&q=80",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=One+Palm+Omniyat+Palm+Jumeirah",
    description: "Ultra-prime handed-over trophy asset managed by Dorchester Collection. Private beachfront access, private infinity pool on terrace, bespoke Italian marble, and private boat berth.",
    amenities: ["Private White Sand Beach", "Dorchester Collection Hospitality", "Private Pool on Terrace", "Indoor Lap Pool & Spa", "Private Marina Jetty"],
    permitNumber: "Trakheesi Permit #991040 (Verified Live)",
  },
  {
    id: "ready-park-heights-2",
    title: "Park Heights II Boulevard Apartment",
    community: "Dubai Hills Estate",
    developer: "Emaar Properties",
    priceAed: 1180000,
    priceFormatted: "AED 1,180,000",
    priceUsd: "~$321,000 USD",
    status: "Tenanted (High ROI)",
    tenancyYield: "8.5% Net Yield (AED 95k/yr)",
    serviceCharge: "AED 14.2 / sq.ft",
    bedrooms: 1,
    bathrooms: 1,
    sizeSqft: 680,
    furnishing: "Semi-Furnished",
    view: "Park & Boulevard Green View",
    titleDeedStatus: "Title Deed Issued",
    mortgageEligible: true,
    coverImage: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1400&q=80",
    ],
    floorPlanUrl: "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1400&q=80",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Park+Heights+2+Dubai+Hills+Estate",
    description: "Turnkey ready investment generating instant rental cash flow. Walking distance to Dubai Hills Mall and Central Park. Clean title deed ready for swift registration.",
    amenities: ["Immediate Rental Cash Flow", "Walk to Central Park", "Swimming Pool & Gym", "Chiller Free", "Covered Parking"],
    permitNumber: "Trakheesi Permit #118492 (Verified Live)",
  },
];

export function ReadyInventory({
  q = "",
  onSearch,
}: {
  q?: string;
  onSearch?: (search: { page: number; q: string }) => void;
}) {
  const { clientMode } = useShell();
  const [filter, setFilter] = useState<"all" | "vacant" | "tenanted" | "golden_visa">("all");
  const [selectedProperty, setSelectedProperty] = useState<ReadyProperty | null>(null);
  const [activeModalTab, setActiveModalTab] = useState<"gallery" | "floorplan" | "deed" | "map">("gallery");

  // Filter ready leads from demo data
  const readyLeads = LEADS.filter((l) => l.type === "Ready");

  const filteredProperties = DEMO_READY_PROPERTIES.filter((p) => {
    if (filter === "vacant" && p.status !== "Vacant on Transfer") return false;
    if (filter === "tenanted" && p.status !== "Tenanted (High ROI)") return false;
    if (filter === "golden_visa" && p.priceAed < 2000000) return false;
    if (q) {
      const match = `${p.title} ${p.community} ${p.developer}`.toLowerCase().includes(q.toLowerCase());
      if (!match) return false;
    }
    return true;
  });

  const getMatchedBuyers = (property: ReadyProperty): Lead[] => {
    return readyLeads
      .filter((l) => {
        const areaMatch = l.area.toLowerCase().includes(property.community.toLowerCase()) || property.community.toLowerCase().includes(l.area.toLowerCase());
        const budgetMatch = l.budget >= property.priceAed * 0.75 && l.budget <= property.priceAed * 1.35;
        const bedsMatch = l.beds === 0 || l.beds === property.bedrooms || Math.abs(l.beds - property.bedrooms) <= 1;
        return (areaMatch && budgetMatch) || (budgetMatch && bedsMatch);
      })
      .slice(0, 3);
  };

  const handleWhatsAppBuyer = (lead: Lead, property: ReadyProperty) => {
    const text = `Hi ${lead.name.split(" ")[0]}! We just listed a verified handed-over ready property in ${property.community} that matches your purchase budget:\n\n🏡 *Property:* ${property.title}\n💰 *Price:* ${property.priceFormatted} (${property.priceUsd})\n📜 *Title Deed:* ${property.titleDeedStatus}\n🔑 *Status:* ${property.status}\n📍 *Maps:* ${property.googleMapsUrl}\n\nWould you like to schedule an immediate viewing inspection this week?`;
    window.open(`https://wa.me/${lead.phone.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`, "_blank");
    toast.success(`WhatsApp ready match dispatched to ${lead.name}`);
  };

  const handleShareListing = (property: ReadyProperty) => {
    const text = `Verified Dubai Ready Property Listing:\n\n*${property.title}*\n📍 Location: ${property.community}\n💰 Price: ${property.priceFormatted} (${property.priceUsd})\n🔑 Status: ${property.status}\n📐 Specs: ${property.bedrooms} BR · ${property.sizeSqft} sq.ft\n📜 Title: ${property.titleDeedStatus}\n🗺️ Google Maps: ${property.googleMapsUrl}\n🛡️ Permit: ${property.permitNumber}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
    toast.success(`Ready brochure shared for ${property.title}`);
  };

  return (
    <div className="w-full space-y-6 pb-20 animate-in fade-in-50 duration-300">
      {/* ═══ CLEAN READY PROPERTY HEADER & FILTER BAR ═══ */}
      <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-r from-card via-card to-secondary/30 p-6 sm:p-7 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-primary">
                Secondary Resales & Handed-Over Stock
              </span>
              <span className="text-muted-foreground">•</span>
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                <ShieldCheck size={14} /> Synced with {readyLeads.length} Demo Ready Buyers
              </span>
              {clientMode && (
                <span className="rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 px-2.5 py-0.5 text-[11px] font-bold font-mono">
                  💎 Client Presentation Deck Active
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-display">
              Ready Dubai Properties (Secondary Resales)
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Handed-over properties with verified DLD Title Deeds, mapped to active buyer requests.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
            {[
              { id: "all", label: "All Ready Units" },
              { id: "vacant", label: "🔑 Vacant on Transfer" },
              { id: "tenanted", label: "📈 Tenanted (Instant Cash Flow)" },
              { id: "golden_visa", label: "🇦🇪 Golden Visa (2M+ AED)" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setFilter(t.id as typeof filter)}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  filter === t.id
                    ? "bg-primary text-primary-foreground font-bold shadow-sm"
                    : "bg-secondary/70 text-muted-foreground hover:text-foreground border border-border/60"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ HORIZONTAL LUXURY SUITES (NOT COLUMN CARDS OR MATH GRIDS) ═══ */}
      <div className="space-y-5">
        {filteredProperties.map((property) => {
          const matchedBuyers = getMatchedBuyers(property);

          return (
            <div
              key={property.id}
              className="group rounded-3xl border border-border/80 bg-card overflow-hidden shadow-sm hover:border-primary/50 transition-all duration-300 flex flex-col lg:flex-row"
            >
              {/* Photo on Left */}
              <div className="relative lg:w-5/12 h-64 lg:h-auto overflow-hidden bg-secondary shrink-0">
                <img
                  src={property.coverImage}
                  alt={property.title}
                  className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="rounded-full bg-black/70 backdrop-blur-md text-white px-2.5 py-0.5 text-xs font-mono font-bold">
                    {property.community}
                  </span>
                  <span className={`rounded-full backdrop-blur-md text-white px-2.5 py-0.5 text-[11px] font-bold ${
                    property.status === "Vacant on Transfer" ? "bg-emerald-500/90" : "bg-amber-500/90"
                  }`}>
                    {property.status}
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="text-xs text-zinc-300 font-mono font-semibold">{property.developer}</p>
                  <p className="text-sm font-bold truncate">{property.view}</p>
                </div>
              </div>

              {/* Data & Buyer Match on Right */}
              <div className="lg:w-7/12 p-6 sm:p-7 flex flex-col justify-between space-y-5">
                <div className="space-y-4">
                  {/* Title & Price Ribbon */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-border/60 pb-4">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-extrabold text-foreground font-display">
                        {property.title}
                      </h2>
                      <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                        <MapPin size={13} className="text-rose-400" />
                        <span>{property.community} · {property.developer}</span>
                      </p>
                    </div>

                    <div className="text-left sm:text-right">
                      <p className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono font-display">
                        {property.priceFormatted}
                      </p>
                      <p className="text-xs font-semibold text-muted-foreground font-mono">
                        {property.priceUsd} · Mortgage Eligible
                      </p>
                    </div>
                  </div>

                  {/* Specs Matrix */}
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="px-3 py-1 rounded-xl bg-secondary/70 border border-border/70 font-semibold text-foreground">
                      🛏️ {property.bedrooms} Bed · 🚿 {property.bathrooms} Bath
                    </span>
                    <span className="px-3 py-1 rounded-xl bg-secondary/70 border border-border/70 font-semibold text-foreground">
                      📐 {property.sizeSqft} sq.ft
                    </span>
                    <span className="px-3 py-1 rounded-xl bg-secondary/70 border border-border/70 font-semibold text-foreground">
                      🛋️ {property.furnishing}
                    </span>
                    <span className="px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono font-bold">
                      {property.titleDeedStatus}
                    </span>
                    {property.tenancyYield && (
                      <span className="px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono font-bold">
                        {property.tenancyYield}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {property.description}
                  </p>

                  {/* ═══ LIVE READY BUYER LEADS MATCH BANNER ═══ */}
                  <div className="rounded-2xl bg-secondary/40 border border-border/70 p-3.5 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-foreground">
                      <span className="flex items-center gap-1.5 text-primary">
                        <Users size={14} />
                        <span>Matched Ready Buyer Leads ({matchedBuyers.length} Inquiring)</span>
                      </span>
                      <span className="text-[11px] text-muted-foreground font-mono">
                        Instant WhatsApp Dispatch
                      </span>
                    </div>

                    {matchedBuyers.length > 0 ? (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {matchedBuyers.map((lead) => (
                          <div
                            key={lead.id}
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-card border border-border/80 text-xs shadow-sm"
                          >
                            <span className="font-bold text-foreground">{lead.name}</span>
                            <span className="text-muted-foreground font-mono">({formatAed(lead.budget)})</span>
                            <span className="text-[10px] text-primary font-bold">({lead.payment})</span>
                            <button
                              onClick={() => handleWhatsAppBuyer(lead, property)}
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 hover:text-emerald-300 ml-1 transition-colors"
                            >
                              <MessageCircle size={12} />
                              <span>Dispatch</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground italic">
                        No active buyer lead currently matches exact filter parameters.
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions Hub */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border/60">
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => {
                        setSelectedProperty(property);
                        setActiveModalTab("gallery");
                      }}
                      className="h-10 px-4 rounded-xl text-xs font-bold bg-primary text-primary-foreground gap-1.5 shadow-sm"
                    >
                      <Layers size={14} />
                      <span>Inspect Ready Property & Title Deed</span>
                      <ArrowUpRight size={13} />
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => handleShareListing(property)}
                      className="h-10 px-3.5 rounded-xl text-xs font-bold border-border gap-1.5 text-foreground hover:bg-secondary"
                    >
                      <Share2 size={14} className="text-primary" />
                      <span>Share Brochure</span>
                    </Button>
                  </div>

                  <a
                    href={property.googleMapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <MapPin size={13} className="text-rose-400" />
                    <span>View Location Coordinates</span>
                    <ExternalLink size={11} />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ═══ FULL-SCREEN READY PROPERTY INSPECTION DIALOG ═══ */}
      {selectedProperty && (
        <Dialog open={!!selectedProperty} onOpenChange={(open) => { if (!open) setSelectedProperty(null); }}>
          <DialogContent className="max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl bg-card border-border p-6 sm:p-8 space-y-6">
            <DialogHeader className="border-b border-border/60 pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <DialogTitle className="text-2xl font-extrabold text-foreground font-display">
                    {selectedProperty.title}
                  </DialogTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {selectedProperty.community} · {selectedProperty.developer}
                  </p>
                </div>
                <div className="text-right">
                  <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1 text-sm font-mono font-bold text-emerald-400">
                    {selectedProperty.priceFormatted}
                  </span>
                  <p className="text-[11px] text-muted-foreground font-mono mt-1">{selectedProperty.priceUsd}</p>
                </div>
              </div>

              {/* Modal Tabs */}
              <div className="flex items-center gap-2 pt-3">
                {[
                  { id: "gallery", label: "📸 4K Gallery", icon: ImageIcon },
                  { id: "floorplan", label: "📐 Floor Plan", icon: Layers },
                  { id: "deed", label: "📜 Title Deed & Legal Status", icon: ShieldCheck },
                  { id: "map", label: "🗺️ Location Maps", icon: MapPin },
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
                  {selectedProperty.gallery.map((img, i) => (
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
                    src={selectedProperty.floorPlanUrl}
                    alt="Floor Plan"
                    className="max-h-full max-w-full object-contain rounded-xl"
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
                  <span>Configuration: <strong>{selectedProperty.bedrooms} Bedroom Suite</strong></span>
                  <span>Total Area: <strong>{selectedProperty.sizeSqft} sq.ft</strong></span>
                </div>
              </div>
            )}

            {/* TAB 3: TITLE DEED & LEGAL STATUS */}
            {activeModalTab === "deed" && (
              <div className="space-y-4 animate-in fade-in-50 duration-200">
                <div className="rounded-2xl border border-border/60 bg-secondary/30 p-4 space-y-3">
                  <span className="text-xs font-bold text-foreground">DLD Official Verification:</span>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-card border border-border/60">
                      <span className="text-muted-foreground">Title Deed Verification:</span>
                      <span className="font-bold text-emerald-400 font-mono">{selectedProperty.titleDeedStatus}</span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-card border border-border/60">
                      <span className="text-muted-foreground">Occupancy Status:</span>
                      <span className="font-bold text-foreground font-mono">{selectedProperty.status}</span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-card border border-border/60">
                      <span className="text-muted-foreground">Mortgage Eligibility:</span>
                      <span className="font-bold text-foreground font-mono">{selectedProperty.mortgageEligible ? "100% Mortgage Ready (UAE Banks)" : "Cash Purchase"}</span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-card border border-border/60">
                      <span className="text-muted-foreground">Annual Service Charges:</span>
                      <span className="font-bold text-foreground font-mono">{selectedProperty.serviceCharge}</span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-card border border-border/60">
                      <span className="text-muted-foreground">RERA Permit Number:</span>
                      <span className="font-bold text-emerald-400 font-mono">{selectedProperty.permitNumber}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-foreground">Residence Amenities:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProperty.amenities.map((a) => (
                      <span key={a} className="rounded-full bg-secondary border border-border px-2.5 py-0.5 text-[11px] font-medium text-foreground">
                        ✓ {a}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: LOCATION & MAP */}
            {activeModalTab === "map" && (
              <div className="space-y-4 animate-in fade-in-50 duration-200">
                <div className="rounded-2xl border border-border/60 bg-secondary/30 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <MapPin size={15} className="text-rose-400" /> {selectedProperty.community} · {selectedProperty.developer}
                    </span>
                    <a
                      href={selectedProperty.googleMapsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                    >
                      <span>Open Satellite Coordinates</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {selectedProperty.description}
                  </p>
                </div>
              </div>
            )}

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/60">
              <Button variant="outline" onClick={() => setSelectedProperty(null)} className="rounded-xl text-xs">
                Close
              </Button>
              <Button
                onClick={() => handleShareListing(selectedProperty)}
                className="rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
              >
                <MessageCircle size={14} />
                <span>Share Complete Resale Dossier</span>
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
