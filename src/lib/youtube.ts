/**
 * YouTube helpers.
 *
 * The property pack payload carries a project's video links (either a plain
 * `youtube_url` field or the `videos` array from the listing media). These
 * helpers resolve whichever form is present into an embeddable URL, and return
 * null when there is nothing watchable so the UI can stay clean.
 */

type Maybe = string | null | undefined;

/** YouTube / YouTube-nocookie / Vimeo id extraction from any common link shape. */
export function youtubeId(url: Maybe): string | null {
  const raw = (url ?? "").trim();
  if (!raw) return null;
  const patterns = [
    /(?:youtube\.com\/(?:watch\?[^#]*\bv=|embed\/|shorts\/|live\/|v\/))([\w-]{6,})/i,
    /youtu\.be\/([\w-]{6,})/i,
  ];
  for (const re of patterns) {
    const m = raw.match(re);
    if (m?.[1]) return m[1];
  }
  // Bare video id.
  if (/^[\w-]{11}$/.test(raw)) return raw;
  return null;
}

/** Embed URL for an iframe, or null when the link is not a YouTube video. */
export function youtubeEmbed(url: Maybe, options: { autoplay?: boolean } = {}): string | null {
  const id = youtubeId(url);
  if (!id) return null;
  const params = new URLSearchParams({
    rel: "0",
    modestbranding: "1",
    playsinline: "1",
    autoplay: options.autoplay === false ? "0" : "1",
  });
  return `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function firstYouTube(candidates: any[]): Maybe {
  for (const item of candidates) {
    if (!item) continue;
    if (typeof item === "string") return youtubeId(item) ? item : null;
    const url = item.url ?? item.video_url ?? item.youtube_url ?? item.link;
    if (typeof url === "string" && youtubeId(url)) return url;
  }
  return null;
}

/**
 * Pull the project tour link out of a property pack payload.
 * Checks an explicit youtube_url field first, then the media video list,
 * then floor-plan-adjacent documents. Null means "no tour exists".
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function findTourUrl(pack: any): string | null {
  if (!pack || typeof pack !== "object") return null;

  const direct: Maybe[] = [
    pack.youtube_url,
    pack.project?.youtube_url,
    pack.selected_unit?.youtube_url,
    pack.video_url,
  ];
  for (const candidate of direct) {
    if (youtubeId(candidate)) return candidate!.trim();
  }

  const lists: unknown[] = [pack.videos, pack.tours, pack.documents, pack.project?.videos];
  for (const list of lists) {
    if (Array.isArray(list)) {
      const found = firstYouTube(list);
      if (found) return found;
    }
  }
  return null;
}
