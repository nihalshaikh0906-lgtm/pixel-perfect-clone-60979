// Rewrites upstream media links to our own /media/ path so the source host never shows in the app.
const UPSTREAM = "https://reelly-backend.s3.amazonaws.com/";

export function mediaUrl<T extends string | null | undefined>(u: T): T {
  if (typeof u === "string") {
    if (u.startsWith(UPSTREAM)) {
      return `/media/${u.slice(UPSTREAM.length)}` as T;
    }
    if (u.includes("reelly-backend.s3.amazonaws.com/")) {
      return u.replace(/https?:\/\/reelly-backend\.s3\.amazonaws\.com\//g, "/media/") as T;
    }
  }
  return u;
}

if (typeof globalThis !== "undefined") {
  (globalThis as unknown as Record<string, unknown>).mediaUrl = mediaUrl;
}

export function absoluteMediaUrl(u: string | null | undefined): string {
  const local = mediaUrl(u);
  if (!local) return "";
  if (local.startsWith("/media/")) {
    const origin = typeof window !== "undefined" && window.location.origin ? window.location.origin : "https://dealos.ae";
    return `${origin}${local}`;
  }
  return local;
}

if (typeof globalThis !== "undefined") {
  (globalThis as unknown as Record<string, unknown>).absoluteMediaUrl = absoluteMediaUrl;
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

if (typeof globalThis !== "undefined") {
  (globalThis as unknown as Record<string, unknown>).deepMedia = deepMedia;
}

export const MEDIA_UPSTREAM = UPSTREAM;

// Supabase media contains images [{ url, type, order }], alongside videos and plans.
export function projectGalleryImages(media: unknown, cover?: string | null, files: Array<{ url: string | null; type: string | null }> = []): string[] {
  let parsed = media;
  if (typeof parsed === "string") {
    try { parsed = JSON.parse(parsed); } catch { parsed = null; }
  }
  const images = Array.isArray(parsed) ? parsed : parsed && typeof parsed === "object" ? (parsed as Record<string, unknown>)["images"] : [];
  const urls = (Array.isArray(images) ? images : []).flatMap((image) => {
    const entry = image && typeof image === "object" ? image as Record<string, unknown> : null;
    const url = typeof image === "string" ? image : entry?.["url"];
    const type = typeof entry?.["type"] === "string" ? entry["type"].toLowerCase() : "";
    if (typeof url !== "string" || !/^https?:\/\//i.test(url) || /cover|plan|video|tour/.test(type)) return [];
    return url === cover ? [] : [mediaUrl(url)];
  });
  const fileImages = files.flatMap((file) => {
    const type = (file.type ?? "").toLowerCase();
    const url = file.url;
    if (!url || !/^https?:\/\//i.test(url) || /brochure|floor.?plan|document|video|tour/.test(type)) return [];
    return /\.(?:jpe?g|png|webp|avif|gif)(?:[?#]|$)/i.test(url) || /^(?:image|photo|gallery|exterior|interior)/.test(type) ? [mediaUrl(url)] : [];
  });
  return [...new Set([...(cover && /^https?:\/\//i.test(cover) ? [mediaUrl(cover)] : []), ...urls, ...fileImages])];
}
