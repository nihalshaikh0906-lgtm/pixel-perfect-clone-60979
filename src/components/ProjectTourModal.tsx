import { X } from "lucide-react";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { youtubeEmbed } from "@/lib/youtube";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Any YouTube link shape: watch, youtu.be, shorts, embed or a bare id. */
  url: string | null;
  title: string;
  subtitle?: string | null;
};

/**
 * Borderless project-tour overlay: a dark silk wash behind a single 16:9
 * player, framed by a thin champagne hairline. Nothing else on screen.
 */
export function ProjectTourModal({ open, onOpenChange, url, title, subtitle }: Props) {
  const embed = open ? youtubeEmbed(url, { autoplay: true }) : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[min(94vw,1080px)] max-w-none translate-x-[-50%] translate-y-[-50%] border-0 bg-transparent p-0 shadow-none backdrop-blur-none sm:rounded-none [&>button]:hidden">
        <div className="flex items-end justify-between gap-4 px-1 pb-3">
          <div className="min-w-0">
            <DialogTitle className="truncate text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--silk)]">
              {title}
            </DialogTitle>
            {subtitle ? (
              <p className="mt-1 truncate text-[11px] uppercase tracking-[0.18em] text-[var(--champagne)]/70">
                {subtitle}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label="Close project tour"
            className="flex shrink-0 items-center gap-2 rounded-full border border-[var(--gold)]/40 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--gold)] transition-colors hover:bg-[var(--gold)]/10"
          >
            <X className="size-3.5" /> Close
          </button>
        </div>

        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black ring-1 ring-[var(--gold)]/30 shadow-[0_60px_140px_-40px_rgba(0,0,0,0.9)]">
          {embed ? (
            <iframe
              title={`${title} project tour`}
              src={embed}
              className="absolute inset-0 size-full"
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
            />
          ) : (
            <p className="flex h-full items-center justify-center px-6 text-center text-[13px] uppercase tracking-[0.18em] text-[var(--silk)]/60">
              No tour available for this property
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
