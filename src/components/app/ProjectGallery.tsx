import { useState } from "react";
import { Building2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function ProjectImage({ src, alt, contain = false }: { src: string | null; alt: string; contain?: boolean }) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  if (!src || failedSrc === src) {
    return (
      <div role="img" aria-label={`${alt} — image unavailable`} className="absolute inset-0 flex items-center justify-center bg-secondary text-muted-foreground">
        <Building2 className="size-10 opacity-40" strokeWidth={1} />
      </div>
    );
  }

  return (
    <>
      {!loaded && <div className="absolute inset-0 animate-pulse bg-secondary" />}
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        onError={() => setFailedSrc(src)}
        className={`absolute inset-0 size-full transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"} ${contain ? "object-contain" : "object-cover"}`}
      />
    </>
  );
}

export function ProjectGallery({ photos, title }: { photos: string[]; title: string }) {
  const [index, setIndex] = useState<number | null>(null);
  const move = (delta: number) => setIndex((current) => current == null || !photos.length ? null : (current + delta + photos.length) % photos.length);
  const displayPhotos = photos.filter(Boolean);
  const slots = displayPhotos.length === 0 ? [0] : displayPhotos.length === 1 ? [0] : displayPhotos.length === 2 ? [0, 1] : [0, 1, 2];

  return <>
    <div className={`grid grid-cols-1 gap-4 ${displayPhotos.length > 1 ? "sm:grid-cols-3 sm:grid-rows-2" : ""}`}>
      {slots.map((slot) => (
        <Button
          key={slot}
          variant="ghost"
          disabled={!displayPhotos[slot]}
          aria-label={`Open ${title} photo ${slot + 1}`}
          onClick={() => setIndex(slot)}
          className={`relative h-auto aspect-[16/10] overflow-hidden rounded-2xl border border-border p-0 shadow-sm disabled:opacity-100 sm:aspect-auto ${
            displayPhotos.length > 1 && slot === 0 ? "sm:col-span-2 sm:row-span-2 sm:min-h-[420px]" : displayPhotos.length <= 1 ? "sm:min-h-[420px]" : ""
          }`}
        >
          <ProjectImage src={displayPhotos[slot] ?? null} alt={`${title} photo ${slot + 1}`} />
          {slot === 2 && displayPhotos.length > 3 ? (
            <span className="absolute bottom-3 right-3 rounded-md bg-card/90 backdrop-blur-sm px-3 py-1 text-sm font-semibold text-card-foreground shadow">
              +{displayPhotos.length - 3}
            </span>
          ) : null}
        </Button>
      ))}
    </div>
    <Dialog open={index != null && displayPhotos.length > 0} onOpenChange={(open) => { if (!open) setIndex(null); }}>
      <DialogContent className="dapp !fixed !inset-0 !left-0 !top-0 !flex !h-dvh !w-screen !max-w-none !translate-x-0 !translate-y-0 flex-col !rounded-none !border-0 !p-6 sm:!p-10" onKeyDown={(event) => {
        if (event.key === "ArrowRight") { event.preventDefault(); move(1); }
        if (event.key === "ArrowLeft") { event.preventDefault(); move(-1); }
      }}>
        <DialogHeader className="pr-8"><DialogTitle>{title}</DialogTitle><DialogDescription>Photo {(index ?? 0) + 1} of {displayPhotos.length}</DialogDescription></DialogHeader>
        <div className="relative min-h-0 flex-1 overflow-hidden rounded-lg bg-secondary">
          <ProjectImage src={index != null ? displayPhotos[index] ?? null : null} alt={`${title} photo ${(index ?? 0) + 1}`} contain />
          {displayPhotos.length > 1 ? <>
            <Button variant="outline" size="icon" aria-label="Previous photo" title="Previous photo" className="absolute left-2 top-1/2 -translate-y-1/2" onClick={() => move(-1)}><ChevronLeft /></Button>
            <Button variant="outline" size="icon" aria-label="Next photo" title="Next photo" className="absolute right-2 top-1/2 -translate-y-1/2" onClick={() => move(1)}><ChevronRight /></Button>
          </> : null}
        </div>
      </DialogContent>
    </Dialog>
  </>;
}