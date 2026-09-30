/* Loads the Google Maps JavaScript API once (async, with callback) in the browser. */
let loader: Promise<typeof google.maps> | null = null;

declare global {
  interface Window {
    __propflowMapsReady?: () => void;
  }
}

export function loadGoogleMaps(): Promise<typeof google.maps> {
  if (typeof window === "undefined") return Promise.reject(new Error("Maps only load in the browser"));
  if (window.google?.maps?.Map) return Promise.resolve(window.google.maps);
  if (loader) return loader;
  const env = import.meta.env as Record<string, string | undefined>;
  const key = env["VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY"];
  const channel = env["VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_TRACKING_ID"] ?? "";
  if (!key) return Promise.reject(new Error("Google Maps key is missing"));
  loader = new Promise((resolve, reject) => {
    window.__propflowMapsReady = () => resolve(window.google.maps);
    const s = document.createElement("script");
    s.src = `https://maps.googleapis.com/maps/api/js?key=${key}&loading=async&callback=__propflowMapsReady&channel=${channel}`;
    s.async = true;
    s.onerror = () => {
      loader = null;
      reject(new Error("Could not load Google Maps"));
    };
    document.head.appendChild(s);
  });
  return loader;
}
