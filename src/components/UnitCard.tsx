import { Building2 } from "lucide-react";

import { aed, beds, quarterOf, sqft } from "@/lib/format";

export type MatchRow = {
  unit_id: number;
  project_id: number;
  project_name: string | null;
  developer: string | null;
  district: string | null;
  price_aed: number | null;
  bedrooms: number | null;
  size_sqft: number | null;
  handover_date: string | null;
  cover_image_url: string | null;
  score: number | null;
};

export function UnitCard({ row, onOpen }: { row: MatchRow; onOpen: (row: MatchRow) => void }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(row)}
      className="panel group overflow-hidden text-left transition-all hover:-translate-y-0.5 hover:glow-ring"
    >
      <div className="relative h-36 w-full overflow-hidden bg-secondary">
        {row.cover_image_url ? (
          <img
            src={row.cover_image_url}
            alt={row.project_name ?? "Project"}
            loading="lazy"
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-muted-foreground">
            <Building2 className="size-8" />
          </div>
        )}
        {row.score != null && Math.round(row.score) > 0 ? (
          <span className="absolute right-3 top-3 rounded-full border border-primary/40 bg-background/80 px-2.5 py-1 text-xs font-semibold text-primary backdrop-blur">
            {Math.min(99, Math.round(row.score))}% match
          </span>
        ) : null}
      </div>
      <div className="space-y-2 p-4">
        <div>
          <h3 className="truncate font-display text-xl font-semibold">{row.project_name ?? "Project"}</h3>
          <p className="truncate text-[15px] text-muted-foreground">
            {row.developer ?? row.district ?? "—"}
          </p>
        </div>
        <p className="text-lg font-semibold text-primary">{aed(row.price_aed)}</p>
        <div className="flex flex-wrap gap-1.5">
          {[beds(row.bedrooms), sqft(row.size_sqft), quarterOf(row.handover_date)].map((chip) => (
            <span
              key={chip}
              className="rounded-md border border-border bg-secondary/60 px-2 py-1 text-xs text-muted-foreground"
            >
              {chip}
            </span>
          ))}
        </div>
      </div>
    </button>
  );
}
