/// <reference types="google.maps" />
import { Expand, Map as MapIcon, Satellite } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { loadGoogleMaps } from "@/lib/google-maps";

type Props = {
  name: string;
  district?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  developer?: string | null;
  /** When set, render only the modal, controlled from outside. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

const GOLD_PIN =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="48" viewBox="0 0 36 48"><path d="M18 1C8.6 1 1 8.6 1 18c0 12.4 17 29 17 29s17-16.6 17-29C35 8.6 27.4 1 18 1z" fill="#2F6BFF" stroke="#2A45C8" stroke-width="2"/><circle cx="18" cy="18" r="6.5" fill="#FFFFFF"/></svg>`,
  );

function fallbackEmbed({ name, district }: Props, hybrid: boolean, zoom: number) {
  const q = `${name} ${district ?? ""} Dubai`.trim();
  return `https://maps.google.com/maps?q=${encodeURIComponent(q)}&t=${hybrid ? "h" : "m"}&z=${zoom}&output=embed`;
}

function LiveMap({ props, hybrid, zoom, className }: { props: Props; hybrid: boolean; zoom: number; className: string }) {
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<google.maps.Map | null>(null);
  const [failed, setFailed] = useState<string | null>(null);
  const hasCoords = props.latitude != null && props.longitude != null;

  useEffect(() => {
    if (!hasCoords || !el.current) return;
    let cancelled = false;
    loadGoogleMaps()
      .then((maps) => {
        if (cancelled || !el.current) return;
        const center = { lat: Number(props.latitude), lng: Number(props.longitude) };
        const m = new maps.Map(el.current, {
          center,
          zoom,
          mapTypeId: hybrid ? "hybrid" : "roadmap",
          clickableIcons: false,
          zoomControl: true,
          fullscreenControl: true,
          mapTypeControl: false,
          streetViewControl: false,
        });
        map.current = m;
        const marker = new maps.Marker({
          position: center,
          map: m,
          title: props.name,
          icon: { url: GOLD_PIN, scaledSize: new maps.Size(36, 48), anchor: new maps.Point(18, 47) },
        });
        const box = document.createElement("div");
        box.style.cssText = "font-family:'Manrope',sans-serif;padding:2px 4px;color:#141A33";
        const t = document.createElement("div");
        t.style.cssText = "font-weight:700;letter-spacing:.08em;font-size:12px";
        t.textContent = `${props.name}${props.district ? ` • ${props.district}` : ""}`.toUpperCase();
        box.appendChild(t);
        if (props.developer) {
          const d = document.createElement("div");
          d.style.cssText = "font-size:11px;color:#4B5272;margin-top:2px";
          d.textContent = props.developer;
          box.appendChild(d);
        }
        const info = new maps.InfoWindow({ content: box });
        marker.addListener("click", () => info.open({ map: m, anchor: marker }));
        info.open({ map: m, anchor: marker });
      })
      .catch((e: Error) => !cancelled && setFailed(e.message));
    return () => {
      cancelled = true;
      map.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasCoords, props.latitude, props.longitude, props.name]);

  useEffect(() => {
    map.current?.setMapTypeId(hybrid ? "hybrid" : "roadmap");
  }, [hybrid]);

  if (!hasCoords || failed) {
    return (
      <iframe
        title={`Map of ${props.name}`}
        src={fallbackEmbed(props, hybrid, zoom)}
        className={className}
        loading="lazy"
        allowFullScreen
      />
    );
  }
  return <div ref={el} className={className} />;
}

/** Google map with gold project pin, Map / Satellite-hybrid toggle and a fullscreen presentation mode. */
export function ProjectMap(props: Props) {
  const [hybrid, setHybrid] = useState(true);
  const [fullState, setFullState] = useState(false);
  const controlled = props.open !== undefined;
  const full = controlled ? !!props.open : fullState;
  const setFull = (v: boolean) => (controlled ? props.onOpenChange?.(v) : setFullState(v));
  const label = `${props.name}${props.district ? ` • ${props.district}` : ""}`.toUpperCase();

  const pill = (active: boolean) =>
    `flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider ${active ? "bg-secondary text-foreground" : "text-muted-foreground"}`;
  const toggle = (
    <div className="flex gap-1 rounded-full border border-border bg-background/90 p-1">
      <button type="button" onClick={() => setHybrid(false)} className={pill(!hybrid)}>
        <MapIcon className="size-3.5" /> Map
      </button>
      <button type="button" onClick={() => setHybrid(true)} className={pill(hybrid)}>
        <Satellite className="size-3.5" /> Satellite
      </button>
    </div>
  );

  const modal = (
    <Dialog open={full} onOpenChange={setFull}>
      <DialogContent className="flex h-[92vh] max-w-[96vw] flex-col gap-3 p-4 sm:max-w-[96vw]">
        <div className="flex flex-wrap items-center justify-between gap-3 pr-8">
          <div>
            <DialogTitle className="text-sm font-semibold uppercase tracking-wider">{label}</DialogTitle>
            {props.developer ? <p className="eyebrow mt-1">{props.developer}</p> : null}
          </div>
          {toggle}
        </div>
        {full ? <LiveMap props={props} hybrid={hybrid} zoom={13} className="w-full flex-1 rounded-lg border border-border" /> : null}
      </DialogContent>
    </Dialog>
  );

  if (controlled) return modal;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        {toggle}
        <Button size="sm" variant="outline" onClick={() => setFull(true)} className="text-[11px] uppercase tracking-wider">
          <Expand className="size-3.5" /> Fullscreen map
        </Button>
      </div>
      <LiveMap props={props} hybrid={hybrid} zoom={15} className="h-64 w-full overflow-hidden rounded-lg border border-border" />
      <p className="eyebrow">{label}</p>
      {modal}
    </div>
  );
}
