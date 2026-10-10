import { mediaUrl } from "@/lib/media";
import { Building2 } from "lucide-react";

import { aed, beds, quarterOf, sqft } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

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
  const [coverFailed, setCoverFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const photo = useQuery({
    queryKey: ["unit-cover", row.project_id, row.unit_id],
    enabled: coverFailed || !row.cover_image_url,
    staleTime: Infinity,
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_property_pack", { p_project_id: row.project_id, p_unit_id: row.unit_id });
      if (error) throw new Error(error.message);
      const pack = data as { photos?: unknown[] } | null;
      return pack?.photos?.find((url): url is string => typeof url === "string" && url.length > 0) ?? null;
    },
  });
  const image = coverFailed || !row.cover_image_url ? photo.data : row.cover_image_url;
  return (
    <Button
      variant="ghost"
      type="button"
      onClick={() => onOpen(row)}
      className="panel group block h-auto w-full min-w-0 overflow-hidden p-0 text-left whitespace-normal transition-all hover:-translate-y-0.5 hover:glow-ring"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-secondary">
        {image ? (
          <>
            {!loaded && <div className="absolute inset-0 animate-pulse bg-secondary" />}
            <img
              src={mediaUrl(image)}
              onLoad={() => setLoaded(true)}
              onError={() => setCoverFailed(true)}
              alt={row.project_name ?? "Project"}
              loading="lazy"
              className={`size-full object-cover transition-transform duration-500 group-hover:scale-105 ${loaded ? "opacity-100" : "opacity-0"}`}
            />
          </>
        ) : (
          <div className="flex size-full items-center justify-center text-muted-foreground">
            <Building2 className="size-8 opacity-40" />
          </div>
        )}
        {row.score != null && Math.round(row.score) > 0 ? (
          <span className="metric absolute right-3 top-3 rounded-full border border-primary/40 bg-background/80 px-2.5 py-1 text-xs text-primary backdrop-blur">
            {Math.min(99, Math.round(row.score))}% match
          </span>
        ) : null}
      </div>
      <div className="space-y-2 p-4">
        <div>
          <h3 className="break-words font-display text-lg font-semibold">{row.project_name ?? "Project"}</h3>
          <p className="break-words text-sm text-muted-foreground">
            {row.developer ?? row.district ?? "—"}
          </p>
        </div>
        <p className="metric text-lg text-primary">{aed(row.price_aed)}</p>
        <div className="flex flex-wrap gap-1.5">
          {[beds(row.bedrooms), sqft(row.size_sqft), quarterOf(row.handover_date)].map((chip) => (
            <span
              key={chip}
               className="metric rounded-md border border-border bg-secondary/60 px-2 py-1 text-xs text-muted-foreground"
            >
              {chip}
            </span>
          ))}
        </div>
      </div>
    </Button>
  );
}
