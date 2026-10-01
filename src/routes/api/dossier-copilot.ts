import { createClient } from "@supabase/supabase-js";
import { createFileRoute } from "@tanstack/react-router";
import { N8N_WEBHOOK_URL } from "@/lib/copilot-target";

// Same-origin front door for the dossier chat: the browser posts here, we forward the
// message to the n8n workflow and hand back the reply it produced.
function pickReply(raw: string): string {
  const text = raw.trim();
  if (!text) return "";
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    return text; // plain-text answer
  }
  if (typeof data === "string") return data;
  if (Array.isArray(data)) return pickReply(JSON.stringify(data[0] ?? ""));
  if (data && typeof data === "object") {
    const j = data as Record<string, unknown>;
    for (const key of ["reply", "output", "text", "message", "result", "data"]) {
      const value = j[key];
      if (typeof value === "string" && value.trim()) return value;
      if (value && typeof value === "object") {
        const nested = pickReply(JSON.stringify(value));
        if (nested) return nested;
      }
    }
  }
  return "";
}

export const Route = createFileRoute("/api/dossier-copilot")({
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

        const body = await request.json().catch(() => null);
        if (!body || typeof body.message !== "string") {
          return Response.json({ error: "Invalid request" }, { status: 400 });
        }

        let upstream: Response;
        try {
          upstream = await fetch(N8N_WEBHOOK_URL, {
            method: "POST",
            headers: { "content-type": "application/json", accept: "application/json" },
            body: JSON.stringify(body),
          });
        } catch (err) {
          return Response.json({ error: "n8n did not answer — is the workflow listening?" }, { status: 502 });
        }

        const raw = await upstream.text();
        if (!upstream.ok) {
          return Response.json(
            { error: `n8n returned ${upstream.status}: ${raw.slice(0, 220) || upstream.statusText}` },
            { status: 502 },
          );
        }

        const reply = pickReply(raw);
        if (!reply) {
          return Response.json(
            {
              error: `n8n sent back nothing to show (${raw.slice(0, 160) || "empty body"}). In n8n, your "Respond to Webhook" node must return the text, e.g. { "reply": "your answer" }`,
            },
            { status: 502 },
          );
        }
        return Response.json({ reply });
      },
    },
  },
});
