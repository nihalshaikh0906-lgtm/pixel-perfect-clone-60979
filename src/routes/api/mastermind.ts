import { createClient } from "@supabase/supabase-js";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { executeMastermindChat, validateMastermindConfig } from "@/ai/mastermind.server";

const requestSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant", "system"]),
        content: z.string(),
      }),
    )
    .min(1),
  org_id: z.string().optional(),
});

export const Route = createFileRoute("/api/mastermind")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        // Validate Gemini / Mastermind AI endpoint config at request/startup
        try {
          validateMastermindConfig();
        } catch (configErr) {
          return Response.json(
            { error: (configErr as Error).message },
            { status: 500 },
          );
        }

        const supabaseUrl = process.env["SUPABASE_URL"];
        const supabaseKey = process.env["SUPABASE_PUBLISHABLE_KEY"];
        const token = (request.headers.get("authorization") ?? "").replace(/^Bearer /, "");

        if (!supabaseUrl || !supabaseKey) {
          return Response.json({ error: "Database configuration missing." }, { status: 500 });
        }
        if (!token) {
          return Response.json({ error: "Unauthorized access: Bearer token required." }, { status: 401 });
        }

        const supabase = createClient(supabaseUrl, supabaseKey, {
          global: { headers: { Authorization: `Bearer ${token}`, apikey: supabaseKey } },
          auth: { persistSession: false, autoRefreshToken: false },
        });

        const { data: userData, error: userError } = await supabase.auth.getUser(token);
        if (userError || !userData?.user) {
          return Response.json({ error: "Unauthorized: Invalid or expired token." }, { status: 401 });
        }

        const body = await request.json().catch(() => null);
        const parsed = requestSchema.safeParse(body);
        if (!parsed.success) {
          return Response.json({ error: "Invalid request payload." }, { status: 400 });
        }

        // Derive org_id from user metadata or profile to enforce tenant boundaries
        const userOrgId =
          parsed.data.org_id ||
          (userData.user.user_metadata as Record<string, any>)?.org_id ||
          (userData.user.app_metadata as Record<string, any>)?.org_id ||
          "org_default";

        try {
          const result = await executeMastermindChat({
            messages: parsed.data.messages,
            context: {
              orgId: userOrgId,
              userId: userData.user.id,
              supabase,
            },
          });

          return Response.json(result);
        } catch (chatError) {
          return Response.json(
            { error: (chatError as Error).message || "AI Chat completion failed." },
            { status: 500 },
          );
        }
      },
    },
  },
});
