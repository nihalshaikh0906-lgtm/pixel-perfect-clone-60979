import { createOpenAI } from "@ai-sdk/openai";
import { streamText, tool, stepCountIs, type ModelMessage } from "ai";
import type { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";

import { createLovableAiGatewayRunIdFetch } from "./ai-run-id.server";

const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1";
const MODEL = "openai/gpt-6-astra";

export type UnitRef = { project_id: number; unit_id: number; score: number };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Db = SupabaseClient<any, any, any>;

function createProvider() {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new Error("AI is not configured (missing LOVABLE_API_KEY).");
  const runIdFetch = createLovableAiGatewayRunIdFetch();
  return createOpenAI({
    baseURL: GATEWAY_URL,
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: runIdFetch.fetch,
  });
}

const providerOptions = {
  openai: {
    store: false,
    forceReasoning: true,
    reasoningEffort: "medium",
    reasoningSummary: "auto",
    include: ["reasoning.encrypted_content"],
  },
} as const;

function gatewayError(error: unknown): Error {
  const message = error instanceof Error ? error.message : String(error);
  if (message.includes("402")) {
    return new Error("AI credits are exhausted. Top up in Settings → Plans & credits.");
  }
  if (message.includes("429")) {
    return new Error("The AI is rate limited right now. Try again in a moment.");
  }
  return new Error(message);
}

function shortenPack(pack: unknown) {
  if (!pack || typeof pack !== "object") return pack;
  const p = { ...(pack as Record<string, unknown>) };
  if (Array.isArray(p.photos)) p.photos = p.photos.slice(0, 5);
  const project = p.project as Record<string, unknown> | undefined;
  if (project && typeof project.overview === "string") {
    p.project = { ...project, overview: project.overview.slice(0, 1500) };
  }
  return p;
}

/** Runs the Investment Engineer assistant with inventory tools, returns reply + recommended units. */
export async function runAssistant(
  supabase: Db,
  clientId: string,
  history: { role: "user" | "assistant"; content: string }[],
): Promise<{ reply: string; units: UnitRef[] }> {
  const { data: client, error: clientError } = await supabase
    .from("clients")
    .select("*")
    .eq("id", clientId)
    .maybeSingle();
  if (clientError) throw new Error(clientError.message);
  if (!client) throw new Error("Client not found.");

  let lastUnits: UnitRef[] = [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const capture = (rows: any) => {
    if (!Array.isArray(rows)) return rows;
    lastUnits = rows
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .filter((r: any) => r?.unit_id && r?.project_id)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((r: any) => ({
        project_id: Number(r.project_id),
        unit_id: Number(r.unit_id),
        score: Number(r.score ?? 0),
      }));
    return rows;
  };

  const tools = {
    match_client: tool({
      description: "Top matching units for this client, ranked by fit score.",
      inputSchema: z.object({ limit: z.number().int().min(1).max(8).default(4) }),
      execute: async ({ limit }) => {
        const { data, error } = await supabase.rpc("match_client", {
          p_client_id: clientId,
          p_limit: limit,
        });
        if (error) throw new Error(error.message);
        return capture(data);
      },
    }),
    search_units: tool({
      description: "Search live inventory by budget, bedrooms, unit types, areas and handover.",
      inputSchema: z.object({
        budget_min: z.number().nullable().default(null),
        budget_max: z.number().nullable().default(null),
        bedrooms: z.array(z.number()).nullable().default(null),
        unit_types: z.array(z.string()).nullable().default(null),
        areas: z.array(z.string()).nullable().default(null),
        location: z.string().default("Dubai"),
        handover_before: z.string().nullable().default(null),
        post_handover: z.boolean().nullable().default(null),
        limit: z.number().int().min(1).max(8).default(4),
      }),
      execute: async (args) => {
        const { data, error } = await supabase.rpc("search_units", {
          p_budget_min: args.budget_min,
          p_budget_max: args.budget_max,
          p_bedrooms: args.bedrooms,
          p_unit_types: args.unit_types,
          p_areas: args.areas,
          p_location: args.location,
          p_handover_before: args.handover_before,
          p_post_handover: args.post_handover,
          p_limit: args.limit,
        });
        if (error) throw new Error(error.message);
        return capture(data);
      },
    }),
    get_property_pack: tool({
      description: "Full pack for one project/unit: photos, documents, payment plans, parking.",
      inputSchema: z.object({
        project_id: z.number(),
        unit_id: z.number().nullable().default(null),
      }),
      execute: async ({ project_id, unit_id }) => {
        const { data, error } = await supabase.rpc("get_property_pack", {
          p_project_id: project_id,
          p_unit_id: unit_id,
        });
        if (error) throw new Error(error.message);
        return shortenPack(data);
      },
    }),
  };

  const system = [
    "You are the Investment Engineer: a Dubai real-estate sales co-pilot for a broker.",
    "Only recommend units returned by your tools. Never invent projects, prices, metro distances, ROI or yields.",
    "Always state price, size, handover and payment plan steps, and which documents exist.",
    "Be short, concrete and sales-ready. Reply in the same language the broker writes in.",
    `Client profile: ${JSON.stringify(client)}`,
  ].join("\n");

  const messages: ModelMessage[] = history.map((m) => ({ role: m.role, content: m.content }));

  try {
    const result = streamText({
      model: createProvider().responses(MODEL),
      system,
      messages,
      tools,
      stopWhen: stepCountIs(5),
      providerOptions,
    });
    const reply = await result.text;
    return { reply: reply.trim(), units: lastUnits };
  } catch (error) {
    throw gatewayError(error);
  }
}

/** Writes a 5-line meeting wrap-up. */
export async function runWrapUp(
  transcript: { role: "user" | "assistant"; content: string }[],
  clientName: string,
): Promise<string> {
  const conversation = transcript.map((m) => `${m.role}: ${m.content}`).join("\n");
  try {
    const result = streamText({
      model: createProvider().responses(MODEL),
      system:
        "Write a wrap-up of this broker session in exactly 5 short lines: client intent, budget fit, units discussed, objections, next action. No preamble, no markdown headings.",
      messages: [
        {
          role: "user",
          content: `Client: ${clientName}\n\nSession notes:\n${conversation || "(no chat this session)"}`,
        },
      ],
      providerOptions,
    });
    return (await result.text).trim();
  } catch (error) {
    throw gatewayError(error);
  }
}
