import { useState } from "react";
import {
  Key, MapPin, ExternalLink, MessageCircle, Phone, Sparkles,
  Building2, Layers, Image as ImageIcon, Calendar, Check,
  ShieldCheck, ArrowUpRight, Search, CheckCircle2, User, Users,
  Heart, Share2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LEADS, formatAed, type Lead } from "@/lib/demo-leads";
import { toast } from "sonner";

export type RentalProperty = {
  id: string;
  title: string;
  tower: string;
  district: string;
  annualRent: number;
  rentFormatted: string;
  cheques: string;
  deposit: string;
  bedrooms: number;
  bathrooms: number;
  sizeSqft: number;
  furnishing: "Fully Furnished" | "Semi-Furnished" | "Unfurnished";
  floor: string;
  view: string;
  chillerFree: boolean;
  coverImage: string;
  gallery: string[];
  floorPlanUrl: string;
  googleMapsUrl: string;
  description: string;
  amenities: string[];
  ejariPermit: string;
};

export const DEMO_RENTAL_PROPERTIES: RentalProperty[] = [
  {
    id: "rent-marina-gate",
    title: "Marina Gate Tower 1 Luxury Residence",
    tower: "Marina Gate Tower 1",
    district: "Dubai Marina",
    annualRent: 135000,
    rentFormatted: "AED 135,000 / year",
    cheques: "2 – 4 Cheques",
    deposit: "5% Refundable",
    bedrooms: 1,
    bathrooms: 2,
    sizeSqft: 890,
    furnishing: "Fully Furnished",
    floor: "High Floor (38th)",
    view: "Full Marina & Yacht Club View",
    chillerFree: true,
    coverImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1400&q=80",
    ],
    floorPlanUrl: "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1400&q=80",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Marina+Gate+Tower+1+Dubai+Marina",
    description: "Immaculate high-floor luxury suite in premier Marina Gate. Floor-to-ceiling windows overlooking mega yachts, designer furnishings by Marina Home, and infinity pool access.",
    amenities: ["Chiller Free", "Infinity Marina Pool", "Dual-Level Technogym", "Direct Marina Walk Access", "24/7 Concierge & Valet"],
    ejariPermit: "RERA Permit #558291 (Ejari Ready)",
  },
  {
    id: "rent-downtown-views",
    title: "Downtown Views II Executive Suite",
    tower: "Downtown Views II (Tower 1)",
    district: "Downtown Dubai",
    annualRent: 195000,
    rentFormatted: "AED 195,000 / year",
    cheques: "1 – 2 Cheques",
    deposit: "5% Refundable",
    bedrooms: 2,
    bathrooms: 3,
    sizeSqft: 1240,
    furnishing: "Fully Furnished",
    floor: "Mid Floor (24th)",
    view: "Burj Khalifa & Dubai Canal",
    chillerFree: true,
    coverImage: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=80",
    ],
    floorPlanUrl: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1400&q=80",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Downtown+Views+II+Dubai",
    description: "5-minute air-conditioned link to Dubai Mall and Za'abeel extension. Sweeping panoramic vistas of the Burj Khalifa skyline with modern minimalist Scandinavian decor.",
    amenities: ["Chiller Free", "Direct Mall Air-Bridge", "Resort Pool & Cabanas", "Children's Splash Park", "Secure Covered Parking"],
    ejariPermit: "RERA Permit #884102 (Ejari Ready)",
  },
  {
    id: "rent-park-heights",
    title: "Park Heights Green Boulevard Residence",
    tower: "Park Heights 1",
    district: "Dubai Hills Estate",
    annualRent: 95000,
    rentFormatted: "AED 95,000 / year",
    cheques: "4 Cheques",
    deposit: "5% Refundable",
    bedrooms: 1,
    bathrooms: 1,
    sizeSqft: 685,
    furnishing: "Semi-Furnished",
    floor: "High Floor (16th)",
    view: "Dubai Hills Central Park & Boulevard",
    chillerFree: true,
    coverImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=80",
    ],
    floorPlanUrl: "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1400&q=80",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Park+Heights+1+Dubai+Hills+Estate",
    description: "Steps from Dubai Hills Central Park, cafes, and dog parks. Sleek open-plan kitchen with brand-new German appliances and wide private balcony.",
    amenities: ["Chiller Free", "Walk to Central Park", "Outdoor Infinity Pool", "Children's Play Area", "24/7 Security"],
    ejariPermit: "RERA Permit #310492 (Ejari Ready)",
  },
  {
    id: "rent-one-palm",
    title: "One Palm Dorchester Beachfront Residence",
    tower: "One Palm by Omniyat",
    district: "Palm Jumeirah",
    annualRent: 380000,
    rentFormatted: "AED 380,000 / year",
    cheques: "1 – 2 Cheques",
    deposit: "10% Security Deposit",
    bedrooms: 3,
    bathrooms: 4,
    sizeSqft: 3200,
    furnishing: "Fully Furnished",
    floor: "Penthouse Floor (19th)",
    view: "Private Beach, Sunset & Ain Dubai",
    chillerFree: false,
    coverImage: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1400&q=80",
    ],
    floorPlanUrl: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1400&q=80",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=One+Palm+Omniyat+Palm+Jumeirah",
    description: "The pinnacle of ultra-luxury living managed by Dorchester Collection. Private white-sand beach access, private lift lobby, and Italian travertine marble finishes.",
    amenities: ["Private Beach Access", "Dorchester Collection Concierge", "Private Boat Jetty", "Indoor Lap Pool & Spa", "Private Cinema"],
    ejariPermit: "RERA Permit #992015 (Ejari Ready)",
  },
  {
    id: "rent-bloom-towers",
    title: "Bloom Towers Smart Urban Residence",
    tower: "Bloom Towers (Tower B)",
    district: "JVC (Jumeirah Village Circle)",
    annualRent: 68000,
    rentFormatted: "AED 68,000 / year",
    cheques: "4 – 6 Cheques",
    deposit: "5% Refundable",
    bedrooms: 1,
    bathrooms: 1,
    sizeSqft: 650,
    furnishing: "Fully Furnished",
    floor: "High Floor (22nd)",
    view: "Open Community Skyline View",
    chillerFree: true,
    coverImage: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1400&q=80",
    ],
    floorPlanUrl: "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1400&q=80",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Bloom+Towers+JVC",
    description: "Vibrant high-rise community with smart automation, modern co-working cafe lounge, amphitheater pool, and multiple flexible cheque payment options.",
    amenities: ["Chiller Free", "Co-Working Lounge", "Rooftop Swimming Pool", "Jogging Track", "Steam & Sauna"],
    ejariPermit: "RERA Permit #229410 (Ejari Ready)",
  },
  {
    id: "rent-armani-residences",
    title: "Armani Residences at Burj Khalifa",
    tower: "Burj Khalifa",
    district: "Downtown Dubai",
    annualRent: 320000,
    rentFormatted: "AED 320,000 / year",
    cheques: "1 – 2 Cheques",
    deposit: "10% Security Deposit",
    bedrooms: 2,
    bathrooms: 3,
    sizeSqft: 1850,
    furnishing: "Fully Furnished",
    floor: "High Floor (14th Armani Level)",
    view: "Dubai Fountain & Opera District",
    chillerFree: true,
    coverImage: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1400&q=80",
    ],
    floorPlanUrl: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1400&q=80",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Burj+Khalifa+Armani+Residences",
    description: "Designed personally by Giorgio Armani inside the world's tallest tower. Custom Armani Casa curved furniture, Zebrawood paneling, and direct room-service dining.",
    amenities: ["Chiller Free", "Armani Hotel Room Service", "Private Burj Khalifa Spa Access", "Valet Concierge", "Direct Dubai Mall Access"],
    ejariPermit: "RERA Permit #109281 (Ejari Ready)",
  },
];

export function RentalInventory({
  q = "",
  onSearch,
}: {
  q?: string;
  onSearch?: (search: { page: number; q: string }) => void;
}) {
  const [filter, setFilter] = useState<"all" | "chiller_free" | "furnished" | "waterfront">("all");
  const [selectedProperty, setSelectedProperty] = useState<RentalProperty | null>(null);
  const [activeModalTab, setActiveModalTab] = useState<"gallery" | "floorplan" | "map" | "terms">("gallery");

  // Grab all demo rental leads
  const rentalLeads = LEADS.filter((l) => l.type === "Rent");

  const filteredProperties = DEMO_RENTAL_PROPERTIES.filter((p) => {
    if (filter === "chiller_free" && !p.chillerFree) return false;
    if (filter === "furnished" && p.furnishing !== "Fully Furnished") return false;
    if (filter === "waterfront" && !["Dubai Marina", "Palm Jumeirah"].includes(p.district)) return false;
    if (q) {
      const match = `${p.title} ${p.district} ${p.tower}`.toLowerCase().includes(q.toLowerCase());
      if (!match) return false;
    }
    return true;
  });

  const getMatchedLeads = (property: RentalProperty): Lead[] => {
    return rentalLeads
      .filter((l) => {
        const areaMatch = l.area.toLowerCase().includes(property.district.toLowerCase()) || property.district.toLowerCase().includes(l.area.toLowerCase());
        const budgetMatch = l.budget >= property.annualRent * 0.75 && l.budget <= property.annualRent * 1.35;
        const bedsMatch = l.beds === 0 || l.beds === property.bedrooms || Math.abs(l.beds - property.bedrooms) <= 1;
        return (areaMatch && budgetMatch) || (budgetMatch && bedsMatch);
      })
      .slice(0, 3);
  };

  const handleWhatsAppTenant = (lead: Lead, property: RentalProperty) => {
    const text = `Hi ${lead.name.split(" ")[0]}! We just registered a verified tenancy at *${property.tower}* in ${property.district} that matches your rental criteria:\n\n🏡 *Property:* ${property.title}\n💰 *Rent:* ${property.rentFormatted} (${property.cheques})\n❄️ *Chiller:* ${property.chillerFree ? "Free Included" : "Standard"}\n🛋️ *Furnishing:* ${property.furnishing}\n📍 *Maps:* ${property.googleMapsUrl}\n\nWould you like to schedule an Ejari viewing inspection this week?`;
    window.open(`https://wa.me/${lead.phone.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`, "_blank");
    toast.success(`WhatsApp match dispatched to ${lead.name}`);
  };

  const handleShareListing = (property: RentalProperty) => {
    const text = `Verified Dubai Rental Listing:\n\n*${property.title}*\n📍 Location: ${property.district} (${property.tower})\n💰 Rent: ${property.rentFormatted}\n💳 Terms: ${property.cheques} · ${property.deposit}\n🛋️ Furnishing: ${property.furnishing}\n📐 Size: ${property.bedrooms} BR · ${property.sizeSqft} sq.ft\n🗺️ Google Maps: ${property.googleMapsUrl}\n🛡️ Permit: ${property.ejariPermit}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
    toast.success(`Rental brochure copied for ${property.title}`);
  };

  return (
    <div className="w-full space-y-6 pb-20 animate-in fade-in-50 duration-300">
      {/* ═══ CLEAN RENTAL HEADER & FILTER BAR ═══ */}
      <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-r from-card via-card to-secondary/30 p-6 sm:p-7 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-primary">
                Tenancy & Ejari Showcase
              </span>
              <span className="text-muted-foreground">•</span>
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                <ShieldCheck size={14} /> Synced with {rentalLeads.length} Demo Rental Leads
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-display">
              Verified Dubai Rental Suites
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Every rental unit mapped to live tenant requests with 1-click WhatsApp match dispatch.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
            {[
              { id: "all", label: "All Rental Suites" },
              { id: "chiller_free", label: "❄️ Chiller Free" },
              { id: "furnished", label: "🛋️ Fully Furnished" },
              { id: "waterfront", label: "🌊 Waterfront & Marina" },
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
          const matchedLeads = getMatchedLeads(property);

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
                    {property.district}
                  </span>
                  {property.chillerFree && (
                    <span className="rounded-full bg-blue-500/90 backdrop-blur-md text-white px-2.5 py-0.5 text-[11px] font-bold">
                      ❄️ Chiller Free
                    </span>
                  )}
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="text-xs text-zinc-300 font-mono font-semibold">{property.tower}</p>
                  <p className="text-sm font-bold truncate">{property.view}</p>
                </div>
              </div>

              {/* Data & Tenant Match on Right */}
              <div className="lg:w-7/12 p-6 sm:p-7 flex flex-col justify-between space-y-5">
                <div className="space-y-4">
                  {/* Title & Rent Ribbon */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-border/60 pb-4">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-extrabold text-foreground font-display">
                        {property.title}
                      </h2>
                      <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                        <MapPin size={13} className="text-rose-400" />
                        <span>{property.district} · {property.floor}</span>
                      </p>
                    </div>

                    <div className="text-left sm:text-right">
                      <p className="text-2xl font-black text-emerald-400 font-mono font-display">
                        {property.rentFormatted}
                      </p>
                      <p className="text-xs font-semibold text-muted-foreground font-mono">
                        {property.cheques} · {property.deposit}
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
                      {property.ejariPermit}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {property.description}
                  </p>

                  {/* ═══ LIVE TENANT LEADS MATCH BANNER ═══ */}
                  <div className="rounded-2xl bg-secondary/40 border border-border/70 p-3.5 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-foreground">
                      <span className="flex items-center gap-1.5 text-primary">
                        <Users size={14} />
                        <span>Matched Tenant Leads ({matchedLeads.length} Inquiring)</span>
                      </span>
                      <span className="text-[11px] text-muted-foreground font-mono">
                        Instant WhatsApp Dispatch
                      </span>
                    </div>

                    {matchedLeads.length > 0 ? (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {matchedLeads.map((lead) => (
                          <div
                            key={lead.id}
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-card border border-border/80 text-xs shadow-sm"
                          >
                            <span className="font-bold text-foreground">{lead.name}</span>
                            <span className="text-muted-foreground font-mono">({formatAed(lead.budget)}/yr)</span>
                            <button
                              onClick={() => handleWhatsAppTenant(lead, property)}
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
                        No active tenant lead currently matches exact filter parameters.
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
                      <span>Inspect Rental Suite & Floor Plan</span>
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

      {/* ═══ FULL-SCREEN RENTAL INSPECTION DIALOG ═══ */}
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
                    {selectedProperty.district} · {selectedProperty.tower} · {selectedProperty.floor}
                  </p>
                </div>
                <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1 text-sm font-mono font-bold text-emerald-400">
                  {selectedProperty.rentFormatted}
                </span>
              </div>

              {/* Modal Tabs */}
              <div className="flex items-center gap-2 pt-3">
                {[
                  { id: "gallery", label: "📸 Suite Gallery", icon: ImageIcon },
                  { id: "floorplan", label: "📐 Floor Plan", icon: Layers },
                  { id: "terms", label: "📝 Tenancy & Ejari Terms", icon: Calendar },
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

            {/* TAB 3: TENANCY TERMS */}
            {activeModalTab === "terms" && (
              <div className="space-y-4 animate-in fade-in-50 duration-200">
                <div className="rounded-2xl border border-border/60 bg-secondary/30 p-4 space-y-3">
                  <span className="text-xs font-bold text-foreground">Standard DLD Ejari Conditions:</span>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-card border border-border/60">
                      <span className="text-muted-foreground">Payment Frequency:</span>
                      <span className="font-bold text-foreground font-mono">{selectedProperty.cheques}</span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-card border border-border/60">
                      <span className="text-muted-foreground">Security Deposit:</span>
                      <span className="font-bold text-foreground font-mono">{selectedProperty.deposit}</span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-card border border-border/60">
                      <span className="text-muted-foreground">Chiller Status:</span>
                      <span className="font-bold text-foreground font-mono">{selectedProperty.chillerFree ? "Chiller Free (Owner Paid)" : "Tenant Pays Empower"}</span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-card border border-border/60">
                      <span className="text-muted-foreground">RERA Permit:</span>
                      <span className="font-bold text-emerald-400 font-mono">{selectedProperty.ejariPermit}</span>
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
                      <MapPin size={15} className="text-rose-400" /> {selectedProperty.district} · {selectedProperty.tower}
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
                <span>Share Complete Tenancy Dossier</span>
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
