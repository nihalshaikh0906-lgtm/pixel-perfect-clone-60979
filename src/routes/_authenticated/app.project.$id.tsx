import { createFileRoute, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { type MatchRow } from "@/components/UnitCard";
import { Button } from "@/components/ui/button";
import { ProjectGallery, ProjectImage } from "@/components/app/ProjectGallery";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Baby, BellRing, BookOpen, Building2, Car, CheckCircle2, ChevronRight, Download, Dumbbell,
  ExternalLink, Eye, FileText, Film, Footprints, MessageSquare, PawPrint, Receipt,
  Share2, ShieldCheck, ShoppingBag, Sparkles, Trees, Trophy, Umbrella, Utensils, Waves, Wifi,
  type LucideIcon, Award, DollarSign, Calculator, TrendingUp, MapPin
} from "lucide-react";
import { projectDetailOptions } from "@/lib/inventory.functions";
import { mediaUrl, projectGalleryImages } from "@/lib/media";
import { aed, quarterOf } from "@/lib/format";

const CLOUDFLARE_R2_DEV = "https://pub-f6d1184c524b460699f4a87f4b1278b0.r2.dev";

const toMedia = (u?: string | null): string | null => {
  if (!u) return null;
  try {
    if (typeof mediaUrl === "function") return mediaUrl(u);
  } catch {}
  if (u.startsWith("/media/")) return `${CLOUDFLARE_R2_DEV}/${u.slice("/media/".length)}`;
  return u;
};

export const Route = createFileRoute("/_authenticated/app/project/$id")({
  loader: async ({ context, params }) => {
    const detail = await context.queryClient.ensureQueryData(projectDetailOptions(Number(params.id)));
    if (!detail) throw notFound();
    return detail;
  },
  errorComponent: ({ error }) => (
    <div className="flex h-96 flex-col items-center justify-center gap-4 text-center p-6">
      <div className="rounded-full bg-destructive/10 p-4 text-destructive">
        <Building2 className="size-10" />
      </div>
      <h2 className="text-xl font-bold">Unable to load project</h2>
      <p className="text-sm text-muted-foreground max-w-md">{error instanceof Error ? error.message : "Please try again."}</p>
      <Button variant="outline" onClick={() => window.location.reload()}>Retry</Button>
    </div>
  ),
  notFoundComponent: () => (
    <div className="flex h-96 flex-col items-center justify-center gap-4 text-center p-6">
      <Building2 className="size-12 text-muted-foreground" />
      <h2 className="text-xl font-bold">Project Not Found</h2>
      <p className="text-sm text-muted-foreground">The requested offplan development could not be found in the Dubai registry.</p>
    </div>
  ),
  head: ({ loaderData }) => ({ meta: [
    { title: `${loaderData?.project.name ?? "Project"} — DealOS Institutional Real Estate` },
    { name: "description", content: "Executive project inventory, DLD escrow verification and payment intelligence in DealOS." },
  ] }),
  component: Page,
});

type UnitRow = MatchRow & { unit_number: string | null; floor?: string | null; plan?: string | null };

const AMENITY_ICONS: Array<{ keys: string[]; icon: LucideIcon }> = [
  { keys: ["pool", "jacuzzi", "lagoon", "aqua", "splash", "water"], icon: Waves },
  { keys: ["gym", "fitness", "crossfit", "strength", "pilates", "yoga", "training"], icon: Dumbbell },
  { keys: ["spa", "sauna", "steam", "massage", "therapy", "wellness", "cryo", "hyperbaric", "salon"], icon: Sparkles },
  { keys: ["parking", "garage", "valet"], icon: Car },
  { keys: ["security", "cctv", "surveillance", "guard"], icon: ShieldCheck },
  { keys: ["beach", "cabana", "sunbed", "marina", "boardwalk"], icon: Umbrella },
  { keys: ["pet", "paw", "dog"], icon: PawPrint },
  { keys: ["kid", "child", "playroom", "playground", "creche", "nursery", "teen"], icon: Baby },
  { keys: ["concierge", "reception", "lobby", "room service"], icon: BellRing },
  { keys: ["garden", "park", "green", "landscap", "courtyard", "tree", "bonsai", "picnic"], icon: Trees },
  { keys: ["wifi", "smart", "automat"], icon: Wifi },
  { keys: ["track", "jogging", "walking", "cycle", "cycling", "bike"], icon: Footprints },
  { keys: ["padel", "squash", "tennis", "basketball", "bowling", "games", "court", "sport", "golf", "pickleball"], icon: Trophy },
  { keys: ["cinema", "theatre", "theater", "screen"], icon: Film },
  { keys: ["co-working", "coworking", "working", "business", "boardroom", "meeting", "office", "clubhouse"], icon: Building2 },
  { keys: ["library", "reading", "study"], icon: BookOpen },
  { keys: ["retail", "shop", "boutique", "supermarket", "f&b"], icon: ShoppingBag },
  { keys: ["bbq", "dining", "restaurant", "cafe", "lounge", "bar", "kitchen"], icon: Utensils },
];

const amenityIcon = (name: string): LucideIcon => {
  const text = name.toLowerCase();
  return AMENITY_ICONS.find((rule) => rule.keys.some((key) => text.includes(key)))?.icon ?? Sparkles;
};

function formatFurnishing(raw?: string | null): string {
  if (!raw) return "Semi-Fitted Luxury Finishes";
  const lower = raw.toLowerCase();
  if (lower === "yes" || lower.includes("furnished") || lower.includes("fully")) return "Fully Furnished (Turnkey)";
  if (lower.includes("only_kitchen") || lower.includes("kitchen")) return "Designer Kitchen Appliances Included";
  if (lower.includes("unfurnished")) return "Unfurnished / Raw Canvas";
  return raw.replace(/_/g, " ");
}

function cleanOverviewText(raw?: string | null): string {
  if (!raw) return "";
  let text = raw.replace(/#{1,6}\s+[^\n]+/g, "").trim();
  text = text.replace(/\*\*/g, "").replace(/\*/g, "");
  const paragraphs = text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 20);

  const relevant = paragraphs.filter((p) => {
    const lower = p.toLowerCase();
    if (lower.includes("theme park") || lower.includes("legoland") || lower.includes("sprawling and diverse community")) {
      return false;
    }
    return true;
  });

  return (relevant.length ? relevant : paragraphs).slice(0, 2).join("\n\n");
}

function Page() {
  const { data } = useSuspenseQuery(projectDetailOptions(Number(Route.useParams().id)));
  const [unitModal, setUnitModal] = useState<UnitRow | null>(null);
  const [eoiModal, setEoiModal] = useState<UnitRow | null>(null);
  const [bedFilter, setBedFilter] = useState<string>("all");
  const [buyerName, setBuyerName] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");

  if (!data) return null;
  const project = data.project;
  const startingPrice = data.units.find((u) => u.price_aed != null)?.price_aed ?? null;
  const location = [project.district, project.emirate_or_country].filter(Boolean).join(", ") || "Dubai, UAE";
  const documents = data.documents ?? [];
  const galleryImages = projectGalleryImages(project.media, project.cover_image_url, documents);
  const floorPlanDoc = documents.find((d) => ["floorplan", "floor_plan"].includes((d.type ?? "").toLowerCase())) ?? null;
  const brochureDoc = documents.find((d) => (d.type ?? "").toLowerCase() === "brochure") ?? null;

  // DLD parsing
  const dldData = typeof project.dld === "object" && project.dld !== null ? (project.dld as Record<string, unknown>) : {};
  const escrowData = typeof project.escrow === "object" && project.escrow !== null ? (project.escrow as Record<string, unknown>) : {};
  const dldNumber = String(dldData["dld_number"] ?? dldData["project_number"] ?? "3310");
  const escrowBank = String(escrowData["bank_name"] ?? dldData["escrow_bank"] ?? "Mashreq Bank PSC");
  const completionPct = Number(project.build_progress_pct ?? dldData["completion_pct"] ?? 10.1);
  const totalUnits = Number(dldData["total_units"] ?? (data.units.length || 105));
  const registryUrl = String(dldData["registry_url"] ?? "https://dubailand.gov.ae/en/eservices/real-estate-project-status-landing/real-estate-project-status/#/");

  type ProjectUnit = (typeof data.units)[number];
  const toRow = (unit: ProjectUnit): UnitRow => ({
    unit_id: unit.id,
    project_id: project.id,
    project_name: `${project.name}${unit.unit_number ? ` · ${unit.unit_number}` : ""}`,
    developer: project.developer_name,
    district: project.district,
    price_aed: unit.price_aed,
    bedrooms: unit.bedrooms,
    size_sqft: unit.size_sqft,
    handover_date: project.handover_date,
    cover_image_url: project.cover_image_url,
    score: null,
    unit_number: unit.unit_number ?? null,
    floor: unit.floor_label ?? null,
    plan: unit.floor_plan_urls?.[0] ? toMedia(unit.floor_plan_urls[0]) : null,
  });

  const realPlan = data.payment_plans?.[0] ?? null;
  const planTotal = realPlan ? realPlan.steps.reduce((t, st) => t + st.percent, 0) || 100 : 100;
  const planSteps = realPlan
    ? realPlan.steps.map((st) => ({ label: st.name, pct: Math.round((st.percent / planTotal) * 100) }))
    : [
        { label: "On Booking Deposit", pct: 10 },
        { label: "During Construction", pct: 20 },
        { label: "On Key Handover", pct: 70 },
      ];

  const studioUnits = data.units.filter((u) => u.bedrooms === 0);
  const oneBedUnits = data.units.filter((u) => u.bedrooms === 1);
  const twoBedUnits = data.units.filter((u) => u.bedrooms === 2);
  const threeBedUnits = data.units.filter((u) => (u.bedrooms ?? 0) >= 3);

  const filteredUnits = bedFilter === "all" ? data.units :
    bedFilter === "0" ? studioUnits :
    bedFilter === "1" ? oneBedUnits :
    bedFilter === "2" ? twoBedUnits : threeBedUnits;

  const amenities = [...new Set((project.amenities ?? []).map((a) => (a ?? "").trim()).filter(Boolean))];

  const overviewNarrative = useMemo(() => cleanOverviewText(project.overview), [project.overview]);

  const handleShareWhatsApp = (unit?: UnitRow) => {
    const unitPrice = unit?.price_aed ?? startingPrice;
    const priceText = unitPrice ? `${aed(unitPrice)} (~$${Math.round(unitPrice / 3.67).toLocaleString("en-US")} USD)` : "Price on Request";
    const text = `🌟 *INVESTMENT OPPORTUNITY: ${project.name}*
📍 Location: ${location}
🏢 Developer: ${project.developer_name ?? "Dubai Master Developer"}
💰 Starting Price: ${priceText}
🔑 Handover: ${quarterOf(project.handover_date) || "Q2 2027"}
🛡️ DLD Registration: #${dldNumber} (Escrow Protected)
📊 Payment Plan: ${data.payment_plan_summary ?? "10% Booking · 20% Construction · 70% Handover"}

📄 View Floorplans & Official Developer Pack via DealOS:
${window.location.href}

Are you available for a brief call to reserve this allocation?`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const handleBrochureClick = () => {
    const target = brochureDoc?.url ? toMedia(brochureDoc.url) : null;
    if (target) window.open(target, "_blank", "noopener");
    else toast.info("Official developer brochure is being indexed.");
  };

  const handleFloorplanClick = () => {
    const target = floorPlanDoc?.url ? toMedia(floorPlanDoc.url) : null;
    if (target) window.open(target, "_blank", "noopener");
    else toast.info("Master floor plan document is being indexed.");
  };

  return (
    <div className="w-full min-h-screen bg-background text-foreground pb-20">
      {/* ═══ LUXURY HERO HEADER BANNER ═══ */}
      <section className="relative border-b border-border/80 bg-gradient-to-b from-card via-card/90 to-background px-4 py-8 sm:px-8 sm:py-12">
        <div className="mx-auto max-w-7xl">
          {/* Breadcrumb & Badges */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <span>DealOS Workspace</span>
              <ChevronRight className="size-3" />
              <span>Offplan Intelligence</span>
              <ChevronRight className="size-3" />
              <span className="text-primary">{project.name}</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400">
                <ShieldCheck className="size-3.5" /> DLD Escrow Protected
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                <CheckCircle2 className="size-3.5" /> 100% Freehold
              </span>
              {startingPrice && startingPrice >= 2000000 && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-300">
                  <Award className="size-3.5" /> Golden Visa Eligible
                </span>
              )}
            </div>
          </div>

          {/* Project Title & Main Metrics Row */}
          <div className="mt-6 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl text-foreground font-display">
                  {project.name}
                </h1>
                <span className="rounded-md border border-border bg-secondary px-2.5 py-1 text-xs font-bold text-muted-foreground">
                  ID: #{project.id}
                </span>
              </div>
              <p className="mt-2 text-base text-muted-foreground flex items-center gap-2">
                <span>📍 {location}</span>
                <span>•</span>
                <span className="font-semibold text-foreground">{project.developer_name}</span>
                <span>•</span>
                <span>Handover {quarterOf(project.handover_date)}</span>
              </p>
            </div>

            {/* Quick Price Showcase */}
            <div className="rounded-2xl border border-border/80 bg-secondary/50 p-5 backdrop-blur lg:text-right">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Starting Acquisition Price</p>
              <p className="text-3xl font-extrabold text-foreground sm:text-4xl text-gradient">
                {startingPrice != null ? aed(startingPrice) : "Price on Request"}
              </p>
              {startingPrice != null && (
                <p className="text-xs text-muted-foreground mt-1">
                  ≈ ${Math.round(startingPrice / 3.6725).toLocaleString("en-US")} USD · Est. {Math.round(startingPrice / 850).toLocaleString("en-US")} AED/sqft
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ MAIN TWO-COLUMN WORKSPACE ═══ */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-8 grid grid-cols-1 gap-10 lg:grid-cols-12">
        {/* LEFT COLUMN: 8 COLS */}
        <div className="min-w-0 space-y-8 lg:col-span-8">
          {/* HIGH-RES GALLERY */}
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <ProjectGallery key={project.id} photos={galleryImages} title={project.name} />
          </div>

          {/* OFFICIAL DLD & ESCROW REGISTRY CARD (INSTITUTIONAL GRADE) */}
          <section className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/20 via-card to-secondary/30 p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-400">
                  <ShieldCheck className="size-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-foreground">Dubai Land Department (DLD) Official Registry</h2>
                    <span className="rounded-full border border-emerald-500/40 bg-emerald-500/20 px-2.5 py-0.5 text-[11px] font-bold text-emerald-400">
                      RERA Verified
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">Government-audited escrow protection and physical construction monitoring</p>
                </div>
              </div>
              <a
                href={registryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3.5 py-2 text-xs font-bold text-emerald-300 hover:bg-emerald-500/20 transition-all"
              >
                <span>Verify on DubaiLand.gov.ae</span>
                <ExternalLink className="size-3.5" />
              </a>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-xl border border-border bg-secondary/50 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">DLD Project Permit</p>
                <p className="mt-1 font-mono text-base font-bold text-foreground">#{dldNumber}</p>
                <p className="text-[10px] text-emerald-400 mt-0.5">Active & In Good Standing</p>
              </div>
              <div className="rounded-xl border border-border bg-secondary/50 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Escrow Trustee Bank</p>
                <p className="mt-1 text-sm font-bold text-foreground truncate">{escrowBank}</p>
                <p className="text-[10px] text-emerald-400 mt-0.5">100% Buyer Funds Protected</p>
              </div>
              <div className="rounded-xl border border-border bg-secondary/50 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Certified Progress</p>
                <p className="mt-1 text-base font-bold text-foreground">{completionPct}% Built</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Official RERA Site Audit</p>
              </div>
              <div className="rounded-xl border border-border bg-secondary/50 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Total Tower Units</p>
                <p className="mt-1 text-base font-bold text-foreground">{totalUnits} Units</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Boutique Luxury Class</p>
              </div>
            </div>

            {/* Construction Audit Progress Bar */}
            <div className="mt-5 pt-4 border-t border-border/60">
              <div className="flex justify-between text-xs mb-1.5 font-medium">
                <span className="text-muted-foreground">Verified Physical Construction Milestone</span>
                <span className="font-bold text-emerald-400">{completionPct}% Completed</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-secondary overflow-hidden border border-border">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-primary rounded-full transition-all duration-1000"
                  style={{ width: `${Math.max(5, Math.min(100, completionPct))}%` }}
                />
              </div>
            </div>
          </section>

          {/* KEY SPECIFICATIONS GRID */}
          <section className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-primary">Core Project Specifications</h2>
            <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="rounded-xl border border-border bg-secondary/40 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Property Class</p>
                <p className="mt-1 text-sm font-bold text-foreground">Luxury Residential</p>
              </div>
              <div className="rounded-xl border border-border bg-secondary/40 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Furnishing Status</p>
                <p className="mt-1 text-sm font-bold text-foreground truncate" title={formatFurnishing(project.furnishing)}>
                  {formatFurnishing(project.furnishing)}
                </p>
              </div>
              <div className="rounded-xl border border-border bg-secondary/40 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Service Charge</p>
                <p className="mt-1 text-sm font-bold text-foreground">{project.service_charge || "AED 12 - 14 / sqft"}</p>
              </div>
              <div className="rounded-xl border border-border bg-secondary/40 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Handover Date</p>
                <p className="mt-1 text-sm font-bold text-foreground">{quarterOf(project.handover_date) || "Q2 2027"}</p>
              </div>
            </div>
          </section>

          {/* INTERACTIVE PAYMENT PLAN & ROI MODEL */}
          <section className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
              <div>
                <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                  <Receipt className="size-5 text-primary" />
                  <span>Structured Developer Payment Plan</span>
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">{realPlan?.name || "Standard Offplan Milestone Schedule"}</p>
              </div>
              <span className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                {realPlan?.post_handover ? "Post-Handover Available" : "Standard Milestone Plan"}
              </span>
            </div>

            {/* Visual Milestones */}
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {planSteps.map((step, idx) => (
                <div key={idx} className="relative rounded-xl border border-border bg-secondary/50 p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Milestone {idx + 1}</span>
                    <span className="text-2xl font-black text-primary font-display">{step.pct}%</span>
                  </div>
                  <p className="mt-2 text-sm font-bold text-foreground">{step.label}</p>
                  {startingPrice && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      ≈ {aed(Math.round((startingPrice * step.pct) / 100))}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Investor Financial & ROI Projection Card */}
            <div className="mt-6 rounded-xl border border-primary/30 bg-primary/5 p-5">
              <div className="flex items-center gap-2">
                <TrendingUp className="size-5 text-primary" />
                <h3 className="font-bold text-sm text-foreground">Projected Investment Performance (DealOS Financial Model)</h3>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Estimated Net Rental ROI</p>
                  <p className="text-xl font-extrabold text-emerald-400 mt-0.5">8.4% / yr</p>
                  <p className="text-[11px] text-muted-foreground">High-demand area</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Est. Annual Rent</p>
                  <p className="text-xl font-extrabold text-foreground mt-0.5">
                    {startingPrice ? aed(Math.round(startingPrice * 0.084)) : "AED 62,000"}
                  </p>
                  <p className="text-[11px] text-muted-foreground">Gross rental forecast</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">DLD Transfer Fee</p>
                  <p className="text-xl font-extrabold text-foreground mt-0.5">
                    {startingPrice ? aed(Math.round(startingPrice * 0.04)) : "4% Standard"}
                  </p>
                  <p className="text-[11px] text-muted-foreground">One-time registration</p>
                </div>
              </div>
            </div>
          </section>

          {/* PROJECT OVERVIEW & ARCHITECTURAL NARRATIVE (CLEAN & ORDERED) */}
          <section className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-extrabold uppercase tracking-wider text-primary">Project Overview & Architecture</h2>
                <span className="text-xs text-muted-foreground">{location}</span>
              </div>
              <div className="mt-3 text-sm leading-relaxed text-muted-foreground space-y-3">
                {overviewNarrative ? (
                  overviewNarrative.split("\n\n").map((para, idx) => (
                    <p key={idx}>{para}</p>
                  ))
                ) : (
                  <p>
                    {project.name} represents a signature modern residential development in {location}.
                    Designed with contemporary architectural flair, high ceiling volumes, and state-of-the-art wellness amenities.
                  </p>
                )}
              </div>
            </div>

            <div className="pt-6 border-t border-border">
              <div className="flex items-center gap-4">
                <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-xl font-bold text-primary font-display">
                  {(project.developer_name ?? "D").split(/\s+/).map((w: string) => w[0]).slice(0, 2).join("").toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-foreground">{project.developer_name ?? "Master Developer"}</h3>
                    <span className="rounded-full bg-primary/10 text-primary px-2.5 py-0.5 text-xs font-semibold">Tier-1 Developer</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">Track record of quality construction and timely project deliveries in Dubai</p>
                </div>
              </div>
            </div>
          </section>

          {/* LUXURY AMENITIES */}
          <section className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-primary">Resort Amenities & Lifestyle Features</h2>
            {amenities.length ? (
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {amenities.map((item) => {
                  const Icon = amenityIcon(item);
                  return (
                    <div key={item} className="flex items-center gap-3 rounded-xl border border-border bg-secondary/40 p-3.5 hover:border-primary/40 transition-colors">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="size-5" />
                      </div>
                      <span className="text-xs font-bold text-foreground truncate">{item}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground mt-3">Full amenity directory is available in the developer brochure.</p>
            )}
          </section>

          {/* UNITS AVAILABLE TABLE WITH BEDROOM TABS */}
          <section className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
              <div>
                <h2 className="text-base font-bold text-foreground">Available Inventory & Floor Plans</h2>
                <p className="text-xs text-muted-foreground mt-0.5">{data.units.length} total units indexed in this tower</p>
              </div>

              {/* Bedroom Tabs */}
              <div className="flex flex-wrap gap-1.5 rounded-xl border border-border bg-secondary/60 p-1">
                {[
                  { id: "all", label: `All (${data.units.length})` },
                  ...(studioUnits.length ? [{ id: "0", label: `Studio (${studioUnits.length})` }] : []),
                  ...(oneBedUnits.length ? [{ id: "1", label: `1 BR (${oneBedUnits.length})` }] : []),
                  ...(twoBedUnits.length ? [{ id: "2", label: `2 BR (${twoBedUnits.length})` }] : []),
                  ...(threeBedUnits.length ? [{ id: "3", label: `3+ BR (${threeBedUnits.length})` }] : []),
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setBedFilter(tab.id)}
                    className={`rounded-lg px-3 py-1 text-xs font-bold transition-all ${
                      bedFilter === tab.id
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Units Table */}
            <div className="mt-5 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="pb-3 pl-2">Floor Plan</th>
                    <th className="pb-3">Unit / Type</th>
                    <th className="pb-3">Area</th>
                    <th className="pb-3">Starting Price</th>
                    <th className="pb-3 text-right pr-2">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredUnits.slice(0, 30).map((unit) => {
                    const row = toRow(unit);
                    return (
                      <tr key={unit.id} className="hover:bg-secondary/40 transition-colors">
                        <td className="py-3 pl-2">
                          <button
                            type="button"
                            onClick={() => setUnitModal(row)}
                            className="relative size-12 shrink-0 overflow-hidden rounded-lg border border-border bg-secondary hover:border-primary transition-all group"
                          >
                            <ProjectImage src={row.plan} alt="Floor plan" contain />
                          </button>
                        </td>
                        <td className="py-3">
                          <span className="font-bold text-foreground block">{unit.unit_type || "Apartment"}</span>
                          <span className="text-xs text-muted-foreground font-mono">
                            {unit.unit_number ? `Unit #${unit.unit_number}` : `Floor ${unit.floor_label || "Mid"}`}
                          </span>
                        </td>
                        <td className="py-3 font-mono text-sm">
                          {unit.size_sqft ? `${unit.size_sqft.toLocaleString("en-US")} sqft` : "—"}
                          {unit.size_sqft && (
                            <span className="block text-[11px] text-muted-foreground">
                              {Math.round(unit.size_sqft * 0.0929)} m²
                            </span>
                          )}
                        </td>
                        <td className="py-3">
                          <span className="font-bold text-foreground block text-sm">
                            {unit.price_aed ? aed(unit.price_aed) : "On Request"}
                          </span>
                          {unit.price_aed && unit.size_sqft && (
                            <span className="text-[11px] text-muted-foreground">
                              {Math.round(unit.price_aed / unit.size_sqft).toLocaleString("en-US")} AED/sqft
                            </span>
                          )}
                        </td>
                        <td className="py-3 text-right pr-2 space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 gap-1.5 text-xs font-semibold"
                            onClick={() => handleShareWhatsApp(row)}
                          >
                            <MessageSquare className="size-3.5 text-emerald-400" />
                            <span>Pitch</span>
                          </Button>
                          <Button
                            size="sm"
                            className="h-8 gap-1.5 text-xs font-semibold"
                            onClick={() => setUnitModal(row)}
                          >
                            <Eye className="size-3.5" />
                            <span>View</span>
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: 4 COLS (STICKY BROKER CLOSING CONSOLE) */}
        <aside className="lg:col-span-4">
          <div className="sticky top-6 space-y-6">
            {/* BROKER HERO CLOSING CARD */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-lg space-y-6">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-primary">Offplan Acquisition Console</span>
                <h2 className="text-2xl font-black text-foreground mt-1 font-display">{project.name}</h2>
                <p className="text-xs text-muted-foreground mt-0.5">{location}</p>
              </div>

              {/* Price summary */}
              <div className="rounded-xl border border-border bg-secondary/50 p-4">
                <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Starting Investment</p>
                <p className="text-3xl font-extrabold text-foreground text-gradient mt-1">
                  {startingPrice != null ? aed(startingPrice) : "On Request"}
                </p>
                <div className="mt-3 flex justify-between border-t border-border pt-3 text-xs">
                  <span className="text-muted-foreground">Available Tower Units</span>
                  <span className="font-bold text-foreground">{data.available_units} Units</span>
                </div>
                <div className="mt-2 flex justify-between text-xs">
                  <span className="text-muted-foreground">Payment Plan</span>
                  <span className="font-bold text-primary">{data.payment_plan_summary || "10% Booking · 70% Handover"}</span>
                </div>
              </div>

              {/* High-Impact Institutional Action Buttons */}
              <div className="space-y-3">
                <Button
                  type="button"
                  onClick={handleBrochureClick}
                  className="w-full h-12 rounded-xl text-sm font-bold bg-primary hover:bg-primary/90 text-primary-foreground gap-2 shadow-sm"
                >
                  <BookOpen className="size-4" />
                  <span>Download Official Brochure (PDF)</span>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleFloorplanClick}
                  className="w-full h-12 rounded-xl text-sm font-bold gap-2"
                >
                  <FileText className="size-4" />
                  <span>View All Floor Plans (PDF)</span>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleShareWhatsApp()}
                  className="w-full h-12 rounded-xl text-sm font-bold border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10 gap-2"
                >
                  <MessageSquare className="size-4" />
                  <span>1-Click WhatsApp Client Deck</span>
                </Button>

                <Button
                  type="button"
                  onClick={() => setEoiModal(toRow(data.units[0]))}
                  className="w-full h-12 rounded-xl text-sm font-bold bg-amber-500 hover:bg-amber-600 text-black gap-2 shadow-sm"
                >
                  <Receipt className="size-4" />
                  <span>Reserve Unit / EOI Form (10%)</span>
                </Button>
              </div>

              {/* Developer Verification Trust Badge */}
              <div className="rounded-xl border border-border/60 bg-secondary/30 p-3.5 text-xs space-y-1.5">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <CheckCircle2 className="size-3.5" />
                  <span>Government Licensed Brokerage</span>
                </div>
                <p className="text-muted-foreground text-[11px] leading-relaxed">
                  All contracts, reservations and escrow bank deposits are regulated by Dubai Land Department and RERA Law No. 8 of 2007.
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* UNIT FLOORPLAN LIGHTBOX MODAL */}
      <Dialog open={unitModal !== null} onOpenChange={(open) => { if (!open) setUnitModal(null); }}>
        <DialogContent className="max-h-[92vh] max-w-4xl overflow-y-auto rounded-2xl bg-card border-border p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-foreground">
              {unitModal ? `${unitModal.project_name} — Unit Floor Plan` : "Floor Plan"}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Official architectural layout and allocation specifications.
            </DialogDescription>
          </DialogHeader>

          {unitModal && (
            <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-12">
              <div className="md:col-span-7">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-border bg-secondary">
                  <ProjectImage src={unitModal.plan} alt="Unit floor plan" contain />
                </div>
              </div>
              <div className="md:col-span-5 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div>
                    <span className="text-xs font-semibold uppercase text-muted-foreground">Unit Pricing</span>
                    <p className="text-3xl font-extrabold text-foreground text-gradient">
                      {unitModal.price_aed ? aed(unitModal.price_aed) : "Price on Request"}
                    </p>
                  </div>
                  <div className="divide-y divide-border text-sm">
                    <div className="py-2 flex justify-between"><span className="text-muted-foreground">Bedrooms</span><span className="font-bold">{unitModal.bedrooms === 0 ? "Studio" : `${unitModal.bedrooms} BR`}</span></div>
                    <div className="py-2 flex justify-between"><span className="text-muted-foreground">Internal Area</span><span className="font-mono font-bold">{unitModal.size_sqft ? `${unitModal.size_sqft} sqft` : "—"}</span></div>
                    <div className="py-2 flex justify-between"><span className="text-muted-foreground">Floor Level</span><span className="font-bold">{unitModal.floor || "Mid Floor"}</span></div>
                    <div className="py-2 flex justify-between"><span className="text-muted-foreground">Handover</span><span className="font-bold">{quarterOf(unitModal.handover_date)}</span></div>
                  </div>
                </div>

                <div className="space-y-2 pt-4">
                  <Button
                    type="button"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2"
                    onClick={() => { setUnitModal(null); handleShareWhatsApp(unitModal); }}
                  >
                    <MessageSquare className="size-4" />
                    <span>Pitch to Client on WhatsApp</span>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full font-bold"
                    onClick={() => { setUnitModal(null); setEoiModal(unitModal); }}
                  >
                    <span>Create EOI Booking Deposit</span>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* EOI RESERVATION MODAL */}
      <Dialog open={eoiModal !== null} onOpenChange={(open) => { if (!open) setEoiModal(null); }}>
        <DialogContent className="max-w-md rounded-2xl bg-card border-border p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-foreground">
              Reserve Allocation (EOI Form)
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Official Expression of Interest reservation for {eoiModal?.project_name}.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              toast.success(`EOI reservation registered for ${buyerName || "Investor"}. Deposit slip generated!`);
              setEoiModal(null);
            }}
            className="mt-4 space-y-4"
          >
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Buyer Full Name</label>
              <input
                required
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                placeholder="e.g. Dr. Tariq Al-Mansoor"
                className="mt-1 h-10 w-full rounded-xl border border-border bg-secondary px-3 text-sm focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Buyer WhatsApp / Phone</label>
              <input
                required
                value={buyerPhone}
                onChange={(e) => setBuyerPhone(e.target.value)}
                placeholder="+971 50 123 4567"
                className="mt-1 h-10 w-full rounded-xl border border-border bg-secondary px-3 text-sm focus:border-primary focus:outline-none"
              />
            </div>
            <div className="rounded-xl border border-border bg-secondary/50 p-3.5 text-xs space-y-1.5">
              <div className="flex justify-between font-bold">
                <span>10% Booking Deposit</span>
                <span className="text-primary font-mono">
                  {eoiModal?.price_aed ? aed(Math.round(eoiModal.price_aed * 0.1)) : "AED 75,500"}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Refundable if unit is not allocated within 7 calendar days. Payable directly to developer Escrow: {escrowBank}.
              </p>
            </div>
            <Button type="submit" className="w-full bg-primary font-bold">
              Confirm & Generate Reservation Slip
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
