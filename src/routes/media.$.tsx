import { createFileRoute } from "@tanstack/react-router";
import { MEDIA_UPSTREAM } from "@/lib/media";

// Streams property media from the licensed upstream store under our own domain, cached for a week.
export const Route = createFileRoute("/media/$")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const path = (params as { _splat?: string })._splat ?? "";
        if (!path || path.includes("..")) return new Response("Not found", { status: 404 });
        const res = await fetch(MEDIA_UPSTREAM + path);
        if (!res.ok || !res.body) return new Response("Not found", { status: 404 });
        return new Response(res.body, {
          headers: {
            "Content-Type": res.headers.get("Content-Type") ?? "application/octet-stream",
            "Cache-Control": "public, max-age=604800",
          },
        });
      },
    },
  },
});
