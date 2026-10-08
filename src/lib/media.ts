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
