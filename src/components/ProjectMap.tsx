import { Expand, Map as MapIcon, Satellite } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

type Props = {
  name: string;
  district?: string | null;
  latitude?: number | null;
  longitude?: number | null;
};

function embedUrl({ name, district, latitude, longitude }: Props, hybrid: boolean, zoom: number) {
  const q =
    latitude != null && longitude != null
      ? `${latitude},${longitude}`
      : `${name} ${district ?? ""} Dubai`.trim();
  return `https://maps.google.com/maps?q=${encodeURIComponent(q)}&t=${hybrid ? "h" : "m"}&z=${zoom}&output=embed`;
}

/** Interactive Google map with Map / Satellite-hybrid toggle and a fullscreen presentation mode. */
export function ProjectMap(props: Props) {
  const [hybrid, setHybrid] = useState(true);
  const [full, setFull] = useState(false);
  const label = `${props.name}${props.district ? ` • ${props.district}` : ""}`.toUpperCase();

  const toggle = (
    <div className="flex gap-1 rounded-full border border-border bg-background/90 p-1">
      <button
        type="button"
        onClick={() => setHybrid(false)}
        className={`flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider ${!hybrid ? "bg-secondary text-foreground" : "text-muted-foreground"}`}
      >
        <MapIcon className="size-3.5" /> Map
      </button>
      <button
        type="button"
        onClick={() => setHybrid(true)}
        className={`flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider ${hybrid ? "bg-secondary text-foreground" : "text-muted-foreground"}`}
      >
        <Satellite className="size-3.5" /> Satellite
      </button>
    </div>
  );

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        {toggle}
        <Button size="sm" variant="outline" onClick={() => setFull(true)} className="text-[11px] uppercase tracking-wider">
          <Expand className="size-3.5" /> Fullscreen map
        </Button>
      </div>
      <div className="overflow-hidden rounded-lg border border-border">
        <iframe
          title={`Map of ${props.name}`}
          src={embedUrl(props, hybrid, 15)}
          className="h-64 w-full"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      <p className="eyebrow">{label}</p>

      <Dialog open={full} onOpenChange={setFull}>
        <DialogContent className="flex h-[92vh] max-w-[96vw] flex-col gap-3 p-4 sm:max-w-[96vw]">
          <div className="flex items-center justify-between gap-3 pr-8">
            <DialogTitle className="text-sm font-semibold uppercase tracking-wider">{label}</DialogTitle>
            {toggle}
          </div>
          <iframe
            title={`Fullscreen map of ${props.name}`}
            src={embedUrl(props, hybrid, 16)}
            className="w-full flex-1 rounded-lg border border-border"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
