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
import { openWhatsApp } from "@/lib/whatsapp-send";

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
  {
    id: "ready-citywalk-14",
    title: "City Walk Building 14 Urban Loft",
    community: "City Walk / Jumeirah",
    developer: "Meraas",
    priceAed: 3250000,
    priceFormatted: "AED 3,250,000",
    priceUsd: "~$885,000 USD",
    status: "Vacant on Transfer",
    serviceCharge: "AED 21.0 / sq.ft",
    bedrooms: 2,
    bathrooms: 3,
    sizeSqft: 1620,
    furnishing: "Fully Furnished",
    view: "Boulevard & Coca-Cola Arena Lights",
    titleDeedStatus: "DLD Title Deed Issued",
    mortgageEligible: true,
    coverImage: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=80",
    ],
    floorPlanUrl: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1400&q=80",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=City+Walk+Building+14+Dubai",
    description: "Low-rise European style living in the heart of Jumeirah. Massive terrace overlooking the illuminated boulevard, steps away from Michelin-starred dining.",
    amenities: ["Rooftop Pool", "Landscaped Courtyard", "Concierge Service", "Valet Parking", "Direct Boulevard Retail"],
    permitNumber: "Trakheesi Permit #325019 (Verified Live)",
  },
  {
    id: "ready-bulgari-residences",
    title: "Bulgari Resort & Residences Mansion Suite",
    community: "Jumeirah Bay Island",
    developer: "Meraas",
    priceAed: 24500000,
    priceFormatted: "AED 24,500,000",
    priceUsd: "~$6,670,000 USD",
    status: "Vacant on Transfer",
    serviceCharge: "AED 48.0 / sq.ft",
    bedrooms: 3,
    bathrooms: 4,
    sizeSqft: 3450,
    furnishing: "Fully Furnished",
    view: "Private Marina & Arabian Gulf Sunset",
    titleDeedStatus: "Title Deed Issued",
    mortgageEligible: true,
    coverImage: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1400&q=80",
    ],
    floorPlanUrl: "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1400&q=80",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Bulgari+Resort+Jumeirah+Bay+Dubai",
    description: "The pinnacle of ultra-luxury island living. Private yacht club access, private beach, 24/7 Bulgari butler service, and private plunge pool.",
    amenities: ["Bulgari Yacht Club", "Private Beach Access", "24/7 Butler Service", "Private Marina Berth", "Michelin Dining"],
    permitNumber: "Trakheesi Permit #998811 (Verified Live)",
  },
  {
    id: "ready-bluewaters-residences",
    title: "Bluewaters Island Waterfront Residence",
    community: "Bluewaters Island",
    developer: "Meraas",
    priceAed: 5800000,
    priceFormatted: "AED 5,800,000",
    priceUsd: "~$1,579,000 USD",
    status: "Owner Occupied",
    serviceCharge: "AED 23.5 / sq.ft",
    bedrooms: 2,
    bathrooms: 3,
    sizeSqft: 1680,
    furnishing: "Fully Furnished",
    view: "Direct Ain Dubai & Sea Panorama",
    titleDeedStatus: "Title Deed Ready",
    mortgageEligible: true,
    coverImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1400&q=80",
    ],
    floorPlanUrl: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1400&q=80",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Bluewaters+Island+Dubai",
    description: "Luxury island residence facing Ain Dubai. Steps from Caesars Palace, private pedestrian bridge to JBR beach, and waterfront dining promenades.",
    amenities: ["Private Beach Access", "Infinity Edge Pools", "Pedestrian Bridge to JBR", "Basketball Court", "Kids Play Area"],
    permitNumber: "Trakheesi Permit #581023 (Verified Live)",
  },
  {
    id: "ready-downtown-views",
    title: "Downtown Views II High Floor Suite",
    community: "Downtown Dubai",
    developer: "Emaar Properties",
    priceAed: 2450000,
    priceFormatted: "AED 2,450,000",
    priceUsd: "~$667,000 USD",
    status: "Vacant on Transfer",
    serviceCharge: "AED 19.8 / sq.ft",
    bedrooms: 1,
    bathrooms: 2,
    sizeSqft: 890,
    furnishing: "Semi-Furnished",
    view: "Zabeel & Dubai Frame Skyline",
    titleDeedStatus: "Title Deed Issued",
    mortgageEligible: true,
    coverImage: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1400&q=80",
    ],
    floorPlanUrl: "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1400&q=80",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Downtown+Views+2+Dubai",
    description: "Direct air-conditioned link to Dubai Mall Zabeel extension. High rental yield potential with instant occupancy.",
    amenities: ["Direct Dubai Mall Air-Link", "Resort Pool Deck", "State of the Art Gym", "Multi-Sport Court", "24/7 Security"],
    permitNumber: "Trakheesi Permit #245190 (Verified Live)",
  },
  {
    id: "ready-creek-horizon",
    title: "Creek Horizon Tower 1 Island Suite",
    community: "Dubai Creek Harbour",
    developer: "Emaar Properties",
    priceAed: 1980000,
    priceFormatted: "AED 1,980,000",
    priceUsd: "~$539,000 USD",
    status: "Tenanted (High ROI)",
    tenancyYield: "7.8% Net Yield (AED 155k/yr)",
    serviceCharge: "AED 16.5 / sq.ft",
    bedrooms: 2,
    bathrooms: 2,
    sizeSqft: 1140,
    furnishing: "Unfurnished",
    view: "Central Park & Downtown Skyline Sunset",
    titleDeedStatus: "DLD Title Deed Issued",
    mortgageEligible: true,
    coverImage: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1400&q=80",
    ],
    floorPlanUrl: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1400&q=80",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Creek+Horizon+Tower+1+Dubai",
    description: "Prime island district position adjacent to Creek Marina. High-occupancy tenant with contract renewed at current market benchmark.",
    amenities: ["Swimming Pool", "Observation Deck", "Relaxation Lounge", "Children Play Zone", "Barbecue Area"],
    permitNumber: "Trakheesi Permit #198034 (Verified Live)",
  },
  {
    id: "ready-sobha-greens",
    title: "Sobha Hartland Greens Lagoon View",
    community: "Sobha Hartland / Meydan",
    developer: "Sobha Realty",
    priceAed: 1650000,
    priceFormatted: "AED 1,650,000",
    priceUsd: "~$449,000 USD",
    status: "Vacant on Transfer",
    serviceCharge: "AED 15.0 / sq.ft",
    bedrooms: 1,
    bathrooms: 2,
    sizeSqft: 870,
    furnishing: "Fully Furnished",
    view: "Crystal Lagoon & Green Park",
    titleDeedStatus: "Title Deed Ready",
    mortgageEligible: true,
    coverImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=80",
    ],
    floorPlanUrl: "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1400&q=80",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Sobha+Hartland+Greens+Dubai",
    description: "Flawless German construction standards by Sobha. Fully fitted Siemens kitchen, floor-to-ceiling soundproof glass, and park views.",
    amenities: ["Hartland International School Walk", "Infinity Pool", "Yoga Studio", "Clubhouse", "Park Walkways"],
    permitNumber: "Trakheesi Permit #165089 (Verified Live)",
  },
  {
    id: "ready-elan-townhouses",
    title: "Elan Contemporary 3BR Townhouse",
    community: "Tilal Al Ghaf",
    developer: "Majid Al Futtaim",
    priceAed: 3100000,
    priceFormatted: "AED 3,100,000",
    priceUsd: "~$844,000 USD",
    status: "Owner Occupied",
    serviceCharge: "AED 4.2 / sq.ft",
    bedrooms: 3,
    bathrooms: 4,
    sizeSqft: 2150,
    furnishing: "Unfurnished",
    view: "Private Garden & Community Park",
    titleDeedStatus: "DLD Title Deed Issued",
    mortgageEligible: true,
    coverImage: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1400&q=80",
    ],
    floorPlanUrl: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1400&q=80",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Elan+Tilal+Al+Ghaf+Dubai",
    description: "Sought-after eco-resort community centered around Lagoon Al Ghaf. Private garden, 2 covered parking bays, and 18km cycling track.",
    amenities: ["Crystal Lagoon Beach Access", "Royal Grammar School", "Cycling & Jogging Trails", "Fitness Center", "Dog Park"],
    permitNumber: "Trakheesi Permit #310245 (Verified Live)",
  },
  {
    id: "ready-arabian-ranches-joy",
    title: "Joy Family Townhouse with Private Lawn",
    community: "Arabian Ranches III",
    developer: "Emaar Properties",
    priceAed: 2650000,
    priceFormatted: "AED 2,650,000",
    priceUsd: "~$721,000 USD",
    status: "Vacant on Transfer",
    serviceCharge: "AED 3.5 / sq.ft",
    bedrooms: 3,
    bathrooms: 3,
    sizeSqft: 1940,
    furnishing: "Unfurnished",
    view: "Green Belt & Quiet Cul-de-sac",
    titleDeedStatus: "DLD Title Deed Issued",
    mortgageEligible: true,
    coverImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=80",
    ],
    floorPlanUrl: "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1400&q=80",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Joy+Arabian+Ranches+3+Dubai",
    description: "Brand new handover in Arabian Ranches III. Splash pads, community clubhouse, cricket pitch, and retail center right next door.",
    amenities: ["Community Clubhouse", "Splash Pads & Pool", "Central Park", "Tennis & Basketball", "Bicycle Tracks"],
    permitNumber: "Trakheesi Permit #265012 (Verified Live)",
  },
  {
    id: "ready-damac-promenade",
    title: "Golf Promenade Golf-Front Residence",
    community: "Damac Hills",
    developer: "Damac Properties",
    priceAed: 1420000,
    priceFormatted: "AED 1,420,000",
    priceUsd: "~$386,000 USD",
    status: "Tenanted (High ROI)",
    tenancyYield: "8.1% Net Yield (AED 115k/yr)",
    serviceCharge: "AED 13.8 / sq.ft",
    bedrooms: 1,
    bathrooms: 2,
    sizeSqft: 880,
    furnishing: "Fully Furnished",
    view: "Trump International Golf Course Panorama",
    titleDeedStatus: "Title Deed Issued",
    mortgageEligible: true,
    coverImage: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1400&q=80",
    ],
    floorPlanUrl: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1400&q=80",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Golf+Promenade+Damac+Hills+Dubai",
    description: "Overlooking the 18-hole championship golf course. Tenanted with steady rental receipts, full furniture package included.",
    amenities: ["Trump Golf Club Access", "Malibu Bay Wave Pool", "Horse Stables", "Spinneys & Carrefour", "Tennis Courts"],
    permitNumber: "Trakheesi Permit #142098 (Verified Live)",
  },
  {
    id: "ready-jge-orange-lake",
    title: "Orange Lake Mediterranean Golf Villa",
    community: "Jumeirah Golf Estates",
    developer: "JGE",
    priceAed: 9800000,
    priceFormatted: "AED 9,800,000",
    priceUsd: "~$2,668,000 USD",
    status: "Owner Occupied",
    serviceCharge: "AED 4.5 / sq.ft",
    bedrooms: 5,
    bathrooms: 6,
    sizeSqft: 6200,
    furnishing: "Semi-Furnished",
    view: "Lake & Earth Course Fairway",
    titleDeedStatus: "DLD Title Deed Issued",
    mortgageEligible: true,
    coverImage: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80",
    ],
    floorPlanUrl: "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1400&q=80",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Orange+Lake+Jumeirah+Golf+Estates+Dubai",
    description: "Tuscan-inspired luxury mansion on a 10,000 sq.ft plot. Private infinity pool, home cinema, Poggenpohl kitchen, and maid's/driver's quarters.",
    amenities: ["Private Infinity Pool", "Poggenpohl Kitchen", "Direct Golf Course View", "Championship Clubhouse", "24/7 Gated Security"],
    permitNumber: "Trakheesi Permit #980112 (Verified Live)",
  },
  {
    id: "ready-palm-views-east",
    title: "Palm Views East Waterfront Pied-à-Terre",
    community: "Palm Jumeirah",
    developer: "Nakheel",
    priceAed: 1850000,
    priceFormatted: "AED 1,850,000",
    priceUsd: "~$503,000 USD",
    status: "Vacant on Transfer",
    serviceCharge: "AED 16.0 / sq.ft",
    bedrooms: 1,
    bathrooms: 1,
    sizeSqft: 610,
    furnishing: "Fully Furnished",
    view: "Direct Marina & Burj Al Arab",
    titleDeedStatus: "Title Deed Ready",
    mortgageEligible: true,
    coverImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1400&q=80",
    ],
    floorPlanUrl: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1400&q=80",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Palm+Views+East+Dubai",
    description: "Boutique waterfront studio apartment on the trunk of Palm Jumeirah. Steps from Club Vista Mare restaurants and beach clubs.",
    amenities: ["Swimming Pool", "Fitness Center", "Club Vista Mare Restaurants", "Private Balcony", "Allocated Parking"],
    permitNumber: "Trakheesi Permit #185044 (Verified Live)",
  },
  {
    id: "ready-difc-limestone",
    title: "Limestone House Executive Penthouse",
    community: "DIFC / Downtown",
    developer: "DIFC Properties",
    priceAed: 6200000,
    priceFormatted: "AED 6,200,000",
    priceUsd: "~$1,688,000 USD",
    status: "Vacant on Transfer",
    serviceCharge: "AED 28.0 / sq.ft",
    bedrooms: 3,
    bathrooms: 4,
    sizeSqft: 2890,
    furnishing: "Semi-Furnished",
    view: "Gate Avenue & Financial Centre Skyline",
    titleDeedStatus: "DIFC Land Title Deed",
    mortgageEligible: true,
    coverImage: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1400&q=80",
    ],
    floorPlanUrl: "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1400&q=80",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Limestone+House+DIFC+Dubai",
    description: "Exclusive residence directly interconnected to The Ritz-Carlton DIFC and Gate Village art galleries. High ceilings, private elevator access.",
    amenities: ["Ritz-Carlton Hotel Privileges", "Indoor & Outdoor Pools", "Private Elevators", "Gate Avenue Direct Walk", "Concierge 24/7"],
    permitNumber: "Trakheesi Permit #620199 (Verified Live)",
  },
  {
    id: "ready-business-bay-exec",
    title: "Executive Bay Waterfront Office Suite",
    community: "Business Bay",
    developer: "Damac Properties",
    priceAed: 1350000,
    priceFormatted: "AED 1,350,000",
    priceUsd: "~$367,000 USD",
    status: "Tenanted (High ROI)",
    tenancyYield: "9.2% Net Yield (AED 125k/yr)",
    serviceCharge: "AED 18.0 / sq.ft",
    bedrooms: 0,
    bathrooms: 1,
    sizeSqft: 980,
    furnishing: "Fully Furnished",
    view: "Dubai Canal Panorama",
    titleDeedStatus: "Commercial Title Deed Ready",
    mortgageEligible: true,
    coverImage: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=80",
    ],
    floorPlanUrl: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1400&q=80",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Executive+Bay+Business+Bay+Dubai",
    description: "Turnkey fitted commercial office unit tenanted by international financial firm. High capitalization rate with 3-year registered lease.",
    amenities: ["Canal Promenade", "Conference Rooms", "Gym & Pool on Roof", "Covered Parking", "24/7 Security"],
    permitNumber: "Trakheesi Permit #135011 (Verified Live)",
  },
  {
    id: "ready-jlt-armada",
    title: "Armada Tower 3 Lakeside Residence",
    community: "JLT (Jumeirah Lake Towers)",
    developer: "Armada Group",
    priceAed: 950000,
    priceFormatted: "AED 950,000",
    priceUsd: "~$258,000 USD",
    status: "Vacant on Transfer",
    serviceCharge: "AED 12.5 / sq.ft",
    bedrooms: 1,
    bathrooms: 2,
    sizeSqft: 810,
    furnishing: "Semi-Furnished",
    view: "Lake & Marina Skyline",
    titleDeedStatus: "DMCC / DLD Title Deed Issued",
    mortgageEligible: true,
    coverImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1400&q=80",
    ],
    floorPlanUrl: "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1400&q=80",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Armada+Tower+3+JLT+Dubai",
    description: "Value-priced lakeside suite within Cluster P. Walking distance to DMCC metro station, lakeside cafes, and running tracks.",
    amenities: ["Rooftop Pool", "Health Club & Sauna", "Walk to Metro", "Lakeside Restaurants", "Supermarket Onsite"],
    permitNumber: "Trakheesi Permit #950231 (Verified Live)",
  },
  {
    id: "ready-creek-residences",
    title: "Dubai Creek Residences North Tower",
    community: "Dubai Creek Harbour",
    developer: "Emaar Properties",
    priceAed: 3450000,
    priceFormatted: "AED 3,450,000",
    priceUsd: "~$939,000 USD",
    status: "Vacant on Transfer",
    serviceCharge: "AED 17.5 / sq.ft",
    bedrooms: 2,
    bathrooms: 3,
    sizeSqft: 1510,
    furnishing: "Fully Furnished",
    view: "Historic Creek & Downtown Sunset",
    titleDeedStatus: "Title Deed Issued",
    mortgageEligible: true,
    coverImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=80",
    ],
    floorPlanUrl: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1400&q=80",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Dubai+Creek+Residences+North+Tower",
    description: "Front-row waterfront living overlooking the yacht marina and Ras Al Khor Wildlife Sanctuary. High-end timber finishes and wrap-around terrace.",
    amenities: ["Infinity Edge Pool", "Yacht Club Access", "Squash Courts", "Kids Daycare", "Marina Promenade"],
    permitNumber: "Trakheesi Permit #345091 (Verified Live)",
  },
  {
    id: "ready-villanova-amaranta",
    title: "Amaranta 3 Single Row Villa",
    community: "Dubailand / Villanova",
    developer: "Dubai Properties",
    priceAed: 2200000,
    priceFormatted: "AED 2,200,000",
    priceUsd: "~$599,000 USD",
    status: "Owner Occupied",
    serviceCharge: "AED 3.2 / sq.ft",
    bedrooms: 3,
    bathrooms: 4,
    sizeSqft: 1980,
    furnishing: "Unfurnished",
    view: "Linear Park & Playground",
    titleDeedStatus: "DLD Title Deed Issued",
    mortgageEligible: true,
    coverImage: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80",
    ],
    floorPlanUrl: "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1400&q=80",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Amaranta+Villanova+Dubai",
    description: "Mediterranean-inspired townhouse situated in a tranquil master development. Spacious backyard, covered double garage, and community center.",
    amenities: ["Community Pool House", "Linear Green Parks", "Geant Supermarket", "Sports Courts", "Walking Trails"],
    permitNumber: "Trakheesi Permit #220145 (Verified Live)",
  },
  {
    id: "ready-greens-al-samar",
    title: "Al Samar Lakeside Garden Apartment",
    community: "The Greens",
    developer: "Emaar Properties",
    priceAed: 1280000,
    priceFormatted: "AED 1,280,000",
    priceUsd: "~$348,000 USD",
    status: "Vacant on Transfer",
    serviceCharge: "AED 14.5 / sq.ft",
    bedrooms: 1,
    bathrooms: 1,
    sizeSqft: 760,
    furnishing: "Fully Furnished",
    view: "Internal Pool & Lush Courtyard",
    titleDeedStatus: "DLD Title Deed Ready",
    mortgageEligible: true,
    coverImage: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=80",
    ],
    floorPlanUrl: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1400&q=80",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Al+Samar+The+Greens+Dubai",
    description: "Mature pet-friendly community by Emaar. Shaded tree-lined streets, lakeside dog park, and easy walking access to Dubai Internet City metro.",
    amenities: ["Swimming Pool & Gym", "Pet Friendly Park", "Barbecue Areas", "Walk to Metro", "Emaar Community Center"],
    permitNumber: "Trakheesi Permit #128092 (Verified Live)",
  },
  {
    id: "ready-23-marina",
    title: "23 Marina Sky Mansion Duplex",
    community: "Dubai Marina",
    developer: "Hircon International",
    priceAed: 7400000,
    priceFormatted: "AED 7,400,000",
    priceUsd: "~$2,015,000 USD",
    status: "Vacant on Transfer",
    serviceCharge: "AED 16.8 / sq.ft",
    bedrooms: 4,
    bathrooms: 5,
    sizeSqft: 5640,
    furnishing: "Semi-Furnished",
    view: "Palm Jumeirah & Marina Skyline",
    titleDeedStatus: "DLD Title Deed Issued",
    mortgageEligible: true,
    coverImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=80",
    ],
    floorPlanUrl: "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1400&q=80",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=23+Marina+Dubai",
    description: "Duplex penthouse featuring a private internal elevator and private plunge pool on the high-floor sky deck. Panoramic sea and Palm views.",
    amenities: ["Private Internal Plunge Pool", "Private Elevator", "3 Swimming Pools", "Spa & Health Club", "Valet Parking"],
    permitNumber: "Trakheesi Permit #740118 (Verified Live)",
  },
  {
    id: "ready-palm-oceana",
    title: "Oceana Baltic Luxury Beach Residence",
    community: "Palm Jumeirah",
    developer: "Seven Tides",
    priceAed: 3850000,
    priceFormatted: "AED 3,850,000",
    priceUsd: "~$1,048,000 USD",
    status: "Vacant on Transfer",
    serviceCharge: "AED 22.0 / sq.ft",
    bedrooms: 2,
    bathrooms: 2,
    sizeSqft: 1740,
    furnishing: "Fully Furnished",
    view: "Private Beach & West Beach Skyline",
    titleDeedStatus: "Title Deed Issued",
    mortgageEligible: true,
    coverImage: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=80",
    ],
    floorPlanUrl: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1400&q=80",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Oceana+Baltic+Palm+Jumeirah",
    description: "Beachfront residence with direct access to West Beach. Infinity edge pool, lazy river, private gym, and Ula beach club on property.",
    amenities: ["Private Beach Access", "Lazy River Pool", "Ula Beach Restaurant", "Regatta Club Gym", "Underground Parking"],
    permitNumber: "Trakheesi Permit #385029 (Verified Live)",
  },
  {
    id: "ready-downtown-29blvd",
    title: "29 Boulevard Tower 2 Burj Suite",
    community: "Downtown Dubai",
    developer: "Emaar Properties",
    priceAed: 2750000,
    priceFormatted: "AED 2,750,000",
    priceUsd: "~$748,000 USD",
    status: "Tenanted (High ROI)",
    tenancyYield: "7.6% Net Yield (AED 190k/yr)",
    serviceCharge: "AED 24.5 / sq.ft",
    bedrooms: 2,
    bathrooms: 3,
    sizeSqft: 1280,
    furnishing: "Semi-Furnished",
    view: "Burj Khalifa Boulevard Direct",
    titleDeedStatus: "Title Deed Ready",
    mortgageEligible: true,
    coverImage: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1400&q=80",
    ],
    floorPlanUrl: "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1400&q=80",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=29+Boulevard+Tower+2+Downtown+Dubai",
    description: "Classic Emaar residence on Mohammed Bin Rashid Boulevard. Steps from Dubai Opera and the Dubai Fountain. Strong capital appreciation history.",
    amenities: ["Swimming Pool Deck", "Fully Equipped Gym", "Boulevard Cafes at Doorstep", "24/7 Concierge", "Covered Parking"],
    permitNumber: "Trakheesi Permit #275011 (Verified Live)",
  },
  {
    id: "ready-meydan-polo",
    title: "Polo Townhouses Contemporary Residence",
    community: "Meydan / Nad Al Sheba",
    developer: "MAG Property",
    priceAed: 4100000,
    priceFormatted: "AED 4,100,000",
    priceUsd: "~$1,116,000 USD",
    status: "Owner Occupied",
    serviceCharge: "AED 4.8 / sq.ft",
    bedrooms: 4,
    bathrooms: 5,
    sizeSqft: 3150,
    furnishing: "Unfurnished",
    view: "Polo Club & Downtown Skyline",
    titleDeedStatus: "DLD Title Deed Issued",
    mortgageEligible: true,
    coverImage: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80",
    ],
    floorPlanUrl: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1400&q=80",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Polo+Townhouses+Meydan+Dubai",
    description: "Boutique gated enclave overlooking Dubai Polo & Equestrian Club. Modern white-stone facade, private garden, and rooftop BBQ terrace.",
    amenities: ["Clubhouse & Gym", "Swimming Pool", "Polo Club Access", "Gated Security", "Quick Downtown Access"],
    permitNumber: "Trakheesi Permit #410298 (Verified Live)",
  },
  {
    id: "ready-jumeirah-islands",
    title: "Garden Hall Lakeside Villa with Pool",
    community: "Jumeirah Islands",
    developer: "Nakheel",
    priceAed: 13500000,
    priceFormatted: "AED 13,500,000",
    priceUsd: "~$3,675,000 USD",
    status: "Vacant on Transfer",
    serviceCharge: "AED 3.9 / sq.ft",
    bedrooms: 5,
    bathrooms: 6,
    sizeSqft: 5900,
    furnishing: "Semi-Furnished",
    view: "Crystal Lake & Water Fountain",
    titleDeedStatus: "DLD Title Deed Issued",
    mortgageEligible: true,
    coverImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=80",
    ],
    floorPlanUrl: "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1400&q=80",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Jumeirah+Islands+Dubai",
    description: "Fully upgraded Garden Hall layout on a 10,800 sq.ft lakeside plot. Private pool with chillers, landscaped gardens, and smart home automation.",
    amenities: ["Private Swimming Pool", "Jumeirah Islands Clubhouse", "Tennis Pavilion", "Lake Walkways", "24/7 Gated Security"],
    permitNumber: "Trakheesi Permit #135081 (Verified Live)",
  },
  {
    id: "ready-dubai-hills-club",
    title: "Club Villas 4BR Rooftop Terrace",
    community: "Dubai Hills Estate",
    developer: "Emaar Properties",
    priceAed: 7100000,
    priceFormatted: "AED 7,100,000",
    priceUsd: "~$1,933,000 USD",
    status: "Owner Occupied",
    serviceCharge: "AED 3.9 / sq.ft",
    bedrooms: 4,
    bathrooms: 4,
    sizeSqft: 3360,
    furnishing: "Unfurnished",
    view: "Dubai Hills Championship Golf Course",
    titleDeedStatus: "Title Deed Ready",
    mortgageEligible: true,
    coverImage: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1400&q=80",
    ],
    floorPlanUrl: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1400&q=80",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Club+Villas+Dubai+Hills+Estate",
    description: "Steps from Dubai Hills Golf Club. Expansive rooftop terrace with direct views of the Burj Khalifa and fairways. Contemporary cubist architecture.",
    amenities: ["Rooftop Golf Lounge", "Golf Clubhouse Walk", "Community Pool", "Dubai Hills Park", "Covered Garage"],
    permitNumber: "Trakheesi Permit #710291 (Verified Live)",
  },
  {
    id: "ready-al-barari-jasmine",
    title: "The Nest Botanical Villa Estate",
    community: "Al Barari",
    developer: "Al Barari Development",
    priceAed: 16800000,
    priceFormatted: "AED 16,800,000",
    priceUsd: "~$4,574,000 USD",
    status: "Vacant on Transfer",
    serviceCharge: "AED 5.2 / sq.ft",
    bedrooms: 4,
    bathrooms: 5,
    sizeSqft: 7460,
    furnishing: "Semi-Furnished",
    view: "Botanical Forest & Private Stream",
    titleDeedStatus: "Title Deed Issued",
    mortgageEligible: true,
    coverImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=80",
    ],
    floorPlanUrl: "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1400&q=80",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=The+Nest+Al+Barari+Dubai",
    description: "Sanctuary living surrounded by 80% lush green foliage and fresh-water streams. Floor-to-ceiling glass pavilions, private infinity pool, and outdoor kitchen.",
    amenities: ["Private Heated Infinity Pool", "Heart & Soul Spa", "The Farm Organic Dining", "Lush Botanical Gardens", "24/7 Security"],
    permitNumber: "Trakheesi Permit #168021 (Verified Live)",
  },
  {
    id: "ready-citywalk-celadon",
    title: "Central Park Celadon Parkside Suite",
    community: "City Walk / Jumeirah",
    developer: "Meraas",
    priceAed: 2890000,
    priceFormatted: "AED 2,890,000",
    priceUsd: "~$786,000 USD",
    status: "Vacant on Transfer",
    serviceCharge: "AED 19.5 / sq.ft",
    bedrooms: 2,
    bathrooms: 2,
    sizeSqft: 1210,
    furnishing: "Semi-Furnished",
    view: "Central Park Green Lawns",
    titleDeedStatus: "DLD Title Deed Issued",
    mortgageEligible: true,
    coverImage: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=80",
    ],
    floorPlanUrl: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1400&q=80",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Central+Park+Celadon+City+Walk",
    description: "Modern parkside apartment set in Dubai's greenest urban oasis. Infinity pools, dog parks, padel courts, and outdoor gym right below.",
    amenities: ["Padel Tennis Courts", "Infinity Pools", "Running Track", "Outdoor Gym", "Direct Park Access"],
    permitNumber: "Trakheesi Permit #289012 (Verified Live)",
  },
  {
    id: "ready-port-de-la-mer",
    title: "La Cote Mediterranean Island Waterfront",
    community: "Port de La Mer / Jumeirah",
    developer: "Meraas",
    priceAed: 3950000,
    priceFormatted: "AED 3,950,000",
    priceUsd: "~$1,075,000 USD",
    status: "Vacant on Transfer",
    serviceCharge: "AED 21.0 / sq.ft",
    bedrooms: 2,
    bathrooms: 3,
    sizeSqft: 1420,
    furnishing: "Fully Furnished",
    view: "Yacht Marina & Open Sea Horizon",
    titleDeedStatus: "Title Deed Issued",
    mortgageEligible: true,
    coverImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1400&q=80",
    ],
    floorPlanUrl: "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1400&q=80",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=La+Cote+Port+de+La+Mer+Dubai",
    description: "Charming French Riviera style marina community in Jumeirah 1. Private beach, 190+ berth marina, terracotta roofs, and pastel boutiques.",
    amenities: ["Private Beach Access", "Marina Berth Access", "Lakeside Pools", "Children Play Areas", "Promenade Boutiques"],
    permitNumber: "Trakheesi Permit #395044 (Verified Live)",
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
    openWhatsApp({ phone: lead.phone, text, recipientName: lead.name });
  };

  const handleShareListing = (property: ReadyProperty) => {
    const text = `Verified Dubai Ready Property Listing:\n\n*${property.title}*\n📍 Location: ${property.community}\n💰 Price: ${property.priceFormatted} (${property.priceUsd})\n🔑 Status: ${property.status}\n📐 Specs: ${property.bedrooms} BR · ${property.sizeSqft} sq.ft\n📜 Title: ${property.titleDeedStatus}\n🗺️ Google Maps: ${property.googleMapsUrl}\n🛡️ Permit: ${property.permitNumber}`;
    openWhatsApp({ text, recipientName: property.title });
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

          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs sm:text-sm font-semibold">
            {[
              { id: "all", label: "All Ready Units" },
              { id: "vacant", label: "🔑 Vacant on Transfer" },
              { id: "tenanted", label: "📈 Tenanted (Instant Cash Flow)" },
              { id: "golden_visa", label: "🇦🇪 Golden Visa (2M+ AED)" },
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
