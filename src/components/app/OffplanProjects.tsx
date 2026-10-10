import { Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Building2, ChevronLeft, ChevronRight, Search, Train, CreditCard, ShieldCheck, Award, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mediaUrl } from "@/lib/media";
import { aed, quarterOf } from "@/lib/format";
import { offplanProjectsOptions } from "@/lib/inventory.functions";
import { INVENTORY_PAGE_SIZE } from "@/lib/inventory-category";

function bedLabel(n: number): string {
  return n === 0 ? "Studio" : `${n} BR`;
}

function OffplanCardImage({ src, alt }: { src: string | null; alt: string }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className="flex size-full items-center justify-center text-muted-foreground bg-secondary">
        <Building2 className="size-8 opacity-40" />
      </div>
    );
  }

  return (
    <>
      {!loaded && <div className="absolute inset-0 animate-pulse bg-secondary" />}
      <img
        src={mediaUrl(src)}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        className={`size-full object-cover transition-transform duration-500 group-hover:scale-105 ${loaded ? "opacity-100" : "opacity-0"}`}
      />
    </>
  );
}

export function OffplanProjects({ page, q, onSearch }: {
  page: number; q: string;
  onSearch: (search: { page: number; q: string }) => void;
}) {
  const { data } = useSuspenseQuery(offplanProjectsOptions(page, q));
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const filterKeywords: Record<string, string[]> = {
    metro: ["dlrc", "silicon", "academic", "creek", "reef", "oasiz", "south"],
    phpp: ["reef", "danube", "aspirz", "bayz", "binghatti", "samana", "1%"],
    under_market: ["dlrc", "jvc", "sports city", "arjan", "production city"],
    golden_visa: ["business bay", "downtown", "creek", "palm", "marina", "amali", "sanctuary"],
  };

  const filteredRows = data.rows.filter((project) => {
    if (activeFilter === "all") return true;
    const keywords = filterKeywords[activeFilter] || [];
    const text = `${project.name} ${project.developer_name ?? ""} ${project.district ?? ""}`.toLowerCase();
    return keywords.some((kw) => text.includes(kw));
  });

  const handleSharePitch = (e: React.MouseEvent, project: typeof data.rows[0]) => {
    e.preventDefault();
    e.stopPropagation();
    const priceText = project.starting_price_aed ? `from AED ${Number(project.starting_price_aed).toLocaleString()}` : "Price on request";
    const text = `Hello, here is an exclusive off-plan investment opportunity in Dubai: *${project.name}* by *${project.developer_name || "Developer"}* located in *${project.district || "Dubai"}* (${priceText}). Handover expected *${quarterOf(project.handover_date)}*. Features DLD-verified escrow and high capital appreciation potential. Let me know if you would like the full dossier and payment breakdown!`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <section className="od-live-inventory space-y-5">
      <div className="a-card-head">
        <div>
          <p className="eyebrow-a">DealOS Master Intelligence</p>
          <h1 className="text-2xl font-bold sm:text-3xl">Off-Plan Projects Explorer</h1>
          <p className="text-sm opacity-70">42,000+ units mapped with Metro 2029 GIS and official DLD Escrow accounts.</p>
        </div>
        <span className="a-count num text-emerald-400 font-bold border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 rounded-full text-xs">
          {data.count.toLocaleString("en-US")} Verified Projects
        </span>
      </div>

      {/* SMART GOVERNMENT & STRATEGIC POWER FILTERS */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <button
          onClick={() => setActiveFilter("all")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${activeFilter === "all" ? "bg-amber-500/20 text-amber-300 border-amber-500/50" : "bg-secondary/40 text-muted-foreground border-border hover:bg-secondary"}`}
        >
          All Developments
        </button>
        <button
          onClick={() => setActiveFilter("metro")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border flex items-center gap-1.5 ${activeFilter === "metro" ? "bg-blue-500/20 text-blue-300 border-blue-500/50" : "bg-secondary/40 text-muted-foreground border-border hover:bg-secondary"}`}
        >
          <Train size={13} className="text-blue-400" /> Metro Blue Line 2029
        </button>
        <button
          onClick={() => setActiveFilter("phpp")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border flex items-center gap-1.5 ${activeFilter === "phpp" ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/50" : "bg-secondary/40 text-muted-foreground border-border hover:bg-secondary"}`}
        >
          <CreditCard size={13} className="text-emerald-400" /> Post-Handover (PHPP)
        </button>
        <button
          onClick={() => setActiveFilter("under_market")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border flex items-center gap-1.5 ${activeFilter === "under_market" ? "bg-purple-500/20 text-purple-300 border-purple-500/50" : "bg-secondary/40 text-muted-foreground border-border hover:bg-secondary"}`}
        >
          <ShieldCheck size={13} className="text-purple-400" /> Under DLD Market Value
        </button>
        <button
          onClick={() => setActiveFilter("golden_visa")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border flex items-center gap-1.5 ${activeFilter === "golden_visa" ? "bg-amber-500/20 text-amber-300 border-amber-500/50" : "bg-secondary/40 text-muted-foreground border-border hover:bg-secondary"}`}
        >
          <Award size={13} className="text-amber-400" /> Golden Visa (2M+ AED)
        </button>
      </div>

      <form className="od-inventory-search" onSubmit={(event) => { event.preventDefault(); const form = new FormData(event.currentTarget); onSearch({ page: 1, q: String(form.get("q") ?? "") }); }}>
        <input key={q} name="q" className="a-in" defaultValue={q} placeholder="Search project name, developer, or district (e.g. Reef 995, Danube, DLRC)…" aria-label="Search projects" />
        <Button type="submit" variant="ghost" className="a-btn a-btn-line"><Search size={14} /> Search</Button>
      </form>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filteredRows.map((project) => {
          const isNearMetro = ["dlrc", "academic", "silicon", "creek", "south", "reef"].some((kw) => `${project.name} ${project.district ?? ""}`.toLowerCase().includes(kw));
          const hasPhpp = ["danube", "reef", "aspirz", "bayz", "samana", "binghatti"].some((kw) => `${project.name} ${project.developer_name ?? ""}`.toLowerCase().includes(kw));

          return (
            <Link
              key={project.id}
              to="/app/project/$id"
              params={{ id: String(project.id) }}
              className="group block overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg hover:border-amber-500/40"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-secondary">
                <OffplanCardImage src={project.cover_image_url} alt={project.name} />
                <span className="metric absolute right-3 top-3 rounded-full border border-border bg-background/80 px-2.5 py-1 text-xs text-muted-foreground backdrop-blur">
                  {quarterOf(project.handover_date)}
                </span>

                {/* GOVERNMENT BADGES ON CARD */}
                <div className="absolute left-3 bottom-3 flex flex-col gap-1">
                  {isNearMetro && (
                    <span className="inline-flex items-center gap-1 rounded bg-blue-900/90 border border-blue-400/40 px-2 py-0.5 text-[10px] font-bold text-blue-200 backdrop-blur">
                      <Train size={10} /> Metro 2029
                    </span>
                  )}
                  {hasPhpp && (
                    <span className="inline-flex items-center gap-1 rounded bg-emerald-900/90 border border-emerald-400/40 px-2 py-0.5 text-[10px] font-bold text-emerald-200 backdrop-blur">
                      <CreditCard size={10} /> Post-Handover
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-2 p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="truncate font-display text-lg font-semibold group-hover:text-amber-400 transition-colors">
                    {project.name}
                  </h3>
                  <button
                    onClick={(e) => handleSharePitch(e, project)}
                    title="Send WhatsApp pitch to investor"
                    className="p-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 hover:scale-110 transition-all shrink-0"
                  >
                    <MessageCircle size={15} />
                  </button>
                </div>
                <p className="truncate text-sm text-muted-foreground">{project.developer_name ?? project.district ?? "—"}</p>
                <p className="metric text-lg text-primary font-bold">
                  {project.starting_price_aed != null ? `From ${aed(project.starting_price_aed)}` : "Price on request"}
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(project.bed_types ?? []).slice(0, 4).map((bed) => (
                    <span key={bed} className="metric rounded-md border border-border bg-secondary/60 px-2 py-1 text-xs text-muted-foreground">
                      {bedLabel(bed)}
                    </span>
                  ))}
                  {(project.bed_types ?? []).length > 4 ? (
                    <span className="metric rounded-md border border-border bg-secondary/60 px-2 py-1 text-xs text-muted-foreground">
                      +{(project.bed_types ?? []).length - 4}
                    </span>
                  ) : null}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {!filteredRows.length ? (
        <p className="a-note text-center py-8">
          {q || activeFilter !== "all" ? "No projects match the selected filters." : "No off-plan projects are recorded in Supabase."}
        </p>
      ) : null}

      <div className="od-pagination">
        <span className="num">Page {page} of {Math.max(1, Math.ceil(data.count / INVENTORY_PAGE_SIZE))}</span>
        <Button variant="ghost" size="icon" className="a-btn a-btn-line" aria-label="Previous projects page" disabled={page <= 1} onClick={() => onSearch({ page: page - 1, q })}><ChevronLeft /></Button>
        <Button variant="ghost" size="icon" className="a-btn a-btn-line" aria-label="Next projects page" disabled={page * INVENTORY_PAGE_SIZE >= data.count} onClick={() => onSearch({ page: page + 1, q })}><ChevronRight /></Button>
      </div>
    </section>
  );
}
