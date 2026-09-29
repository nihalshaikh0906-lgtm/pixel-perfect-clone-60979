import { createClient } from "@supabase/supabase-js";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const bodySchema = z.object({
  client_id: z.string().uuid(),
  messages: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() })).min(1),
  context: z.string().max(40000).default(""),
});

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const url = process.env["SUPABASE_URL"];
        const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
        const token = (request.headers.get("authorization") ?? "").replace(/^Bearer /, "");
        if (!url || !key) return Response.json({ error: "Server not configured" }, { status: 500 });
        if (!token) return Response.json({ error: "Unauthorized" }, { status: 401 });

        const supabase = createClient(url, key, {
          global: { headers: { Authorization: `Bearer ${token}`, apikey: key } },
          auth: { persistSession: false, autoRefreshToken: false },
        });
        const { data: userData, error: userError } = await supabase.auth.getUser(token);
        if (userError || !userData?.user) return Response.json({ error: "Unauthorized" }, { status: 401 });

        const parsed = bodySchema.safeParse(await request.json().catch(() => null));
        if (!parsed.success) return Response.json({ error: "Invalid request" }, { status: 400 });

        const { streamChat } = await import("@/lib/deal-os.server");
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
          async start(controller) {
            const emit = (e: unknown) => controller.enqueue(encoder.encode(JSON.stringify(e) + "\n"));
            try {
              await streamChat(supabase, parsed.data.client_id, parsed.data.messages, parsed.data.context, emit);
              emit({ type: "done" });
            } catch (err) {
              emit({ type: "error", message: err instanceof Error ? err.message : String(err) });
            }
            controller.close();
          },
        });
        return new Response(stream, {
          headers: { "content-type": "application/x-ndjson; charset=utf-8", "cache-control": "no-cache" },
        });
      },
    },
  },
});
