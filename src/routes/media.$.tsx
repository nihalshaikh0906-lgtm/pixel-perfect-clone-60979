import { createFileRoute } from "@tanstack/react-router";
import { MEDIA_UPSTREAM } from "@/lib/media";

// Streams property media from the licensed upstream store under our own domain, cached for a week.
export const Route = createFileRoute("/media/$")({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const url = request ? new URL(request.url) : null;
        const splat = (params as { _splat?: string })?._splat;
        const path = splat || (url ? url.pathname.replace(/^\/media\//, "") : "");
        if (!path || path.includes("..")) return new Response("Not found", { status: 404 });
        return Response.redirect(MEDIA_UPSTREAM + path, 302);
      },
    },
  },
});
