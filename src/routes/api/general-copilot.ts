import { createClient } from "@supabase/supabase-js";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const bodySchema = z.object({
  messages: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().max(8000) }))
    .min(1)
    .max(20),
});

export const Route = createFileRoute("/api/general-copilot")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const url = process.env["SUPABASE_URL"];
        const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
        const token = (request.headers.get("authorization") ?? "").replace(/^Bearer /, "");
        if (!url || !key) return Response.json({ error: "Server not configured" }, { status: 500 });
        if (!token) return Response.json({ error: "Unauthorized" }, { status: 401 });
        const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
        const { data, error } = await supabase.auth.getUser(token);
        if (error || !data?.user) return Response.json({ error: "Unauthorized" }, { status: 401 });

        const parsed = bodySchema.safeParse(await request.json().catch(() => null));
        if (!parsed.success) return Response.json({ error: "Invalid request" }, { status: 400 });

        try {
          const { generalChat } = await import("@/lib/deal-os.server");
          const reply = await generalChat(parsed.data.messages);
          return Response.json({ reply });
        } catch (err) {
          return Response.json({ error: err instanceof Error ? err.message : String(err) }, { status: 502 });
        }
      },
    },
  },
});
