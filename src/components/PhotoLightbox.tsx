import { mediaUrl } from "@/lib/media";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect } from "react";
import { createPortal } from "react-dom";

export function PhotoLightbox({
  photos,
  index,
  title,
  onIndex,
  onClose,
}: {
  photos: string[];
  index: number | null;
  title: string;
  onIndex: (i: number) => void;
  onClose: () => void;
}) {
  const open = index != null && photos.length > 0;
  const n = photos.length;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
      if (e.key === "ArrowRight") onIndex((index! + 1) % n);
      if (e.key === "ArrowLeft") onIndex((index! - 1 + n) % n);
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [open, index, n, onIndex, onClose]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal
      aria-label="Photo viewer"
      className="pointer-events-auto fixed inset-0 z-[200] flex animate-in fade-in flex-col items-center justify-center bg-black/85 p-6 backdrop-blur-md duration-200"
      onClick={onClose}
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute right-5 top-5 rounded-full border border-white/30 p-2 text-white/90 hover:bg-white/10"
      >
        <X className="size-5" />
      </button>
      <img
        key={photos[index!]}
        src={mediaUrl(photos[index!])}
        alt={`${title} photo ${index! + 1}`}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[80vh] max-w-full animate-in fade-in zoom-in-95 rounded-lg object-contain shadow-2xl duration-300"
      />
      {n > 1 ? (
        <>
          <button
            type="button"
            aria-label="Previous photo"
            onClick={(e) => {
              e.stopPropagation();
              onIndex((index! - 1 + n) % n);
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full border border-white/30 p-3 text-white/90 hover:bg-white/10"
          >
            <ChevronLeft className="size-6" />
          </button>
          <button
            type="button"
            aria-label="Next photo"
            onClick={(e) => {
              e.stopPropagation();
              onIndex((index! + 1) % n);
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full border border-white/30 p-3 text-white/90 hover:bg-white/10"
          >
            <ChevronRight className="size-6" />
          </button>
        </>
      ) : null}
      <p className="mt-4 text-sm tracking-wide text-white/80">
        Image {index! + 1} of {n} • {title}
      </p>
    </div>,
    document.body,
  );
}
