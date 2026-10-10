// Rewrites upstream media links to our own /media/ path so the source host never shows in the app.
const UPSTREAM = "https://reelly-backend.s3.amazonaws.com/";

export function mediaUrl<T extends string | null | undefined>(u: T): T {
  if (typeof u === "string" && u.startsWith(UPSTREAM)) return `/media/${u.slice(UPSTREAM.length)}` as T;
  return u;
}

export function deepMedia<T>(v: T): T {
  if (typeof v === "string") return mediaUrl(v) as T;
  if (Array.isArray(v)) return v.map(deepMedia) as T;
  if (v && typeof v === "object") {
    const o: Record<string, unknown> = {};
    for (const [k, x] of Object.entries(v)) o[k] = deepMedia(x);
    return o as T;
  }
  return v;
}

export const MEDIA_UPSTREAM = UPSTREAM;

// Supabase media contains images [{ url, type, order }], alongside videos and plans.
export function projectGalleryImages(media: unknown, cover?: string | null): string[] {
  let parsed = media;
  if (typeof parsed === "string") {
    try { parsed = JSON.parse(parsed); } catch { return []; }
  }
  if (!parsed || typeof parsed !== "object") return [];
  const images = Array.isArray(parsed) ? parsed : (parsed as Record<string, unknown>).images;
  if (!Array.isArray(images)) return [];
  const urls = images.flatMap((image) => {
    const entry = image && typeof image === "object" ? image as Record<string, unknown> : null;
    const url = typeof image === "string" ? image : entry?.url;
    const type = typeof entry?.type === "string" ? entry.type.toLowerCase() : "";
    if (typeof url !== "string" || !/^https?:\/\//i.test(url) || /cover|plan|video|tour/.test(type)) return [];
    return url === cover ? [] : [mediaUrl(url)];
  });
  return [...new Set(urls)];
}
