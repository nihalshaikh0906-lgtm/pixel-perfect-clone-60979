import type { SupabaseClient } from "@supabase/supabase-js";

export type UnitRef = { project_id: number; unit_id: number; score: number };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Db = SupabaseClient<any, any, any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Json = any;
type ChatMsg = { role: "user" | "assistant"; content: string };

const MAX_TOOL_ROUNDS = 5;

function aiConfig() {
  const key = process.env["AI_API_KEY"];
  const base = process.env["AI_BASE_URL"];
  const model = process.env["AI_MODEL"];
  if (!key || !base || !model) {
    throw new Error("AI is not configured: AI_API_KEY, AI_BASE_URL and AI_MODEL must be set.");
  }
  const url = `${base.endsWith("/") ? base : base + "/"}chat/completions`;
  return { key, url, model };
}

function describeStatus(status: number): string {
  if (status === 401) return "invalid API key";
  if (status === 403) return "access denied";
  if (status === 404) return "model or endpoint not found";
  if (status === 429) return "rate limited";
  if (status >= 500) return "provider error";
  return "request failed";
}

async function chatCompletion(body: Json): Promise<Json> {
  const { key, url, model } = aiConfig();
  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model, ...body }),
  });
  const text = await res.text();
  if (!res.ok) {
    let msg = text;
    try {
      const j = JSON.parse(text);
      msg = j?.error?.message ?? j?.message ?? text;
    } catch {
      /* keep raw text */
    }
    console.error(`[deal-os] AI provider ${res.status}: ${msg}`);
    throw new Error(`AI provider error ${res.status} (${describeStatus(res.status)}): ${String(msg).slice(0, 400)}`);
  }
  return JSON.parse(text);
}

function shortenPack(pack: Json) {
  if (!pack || typeof pack !== "object") return pack;
  const p: Json = { ...pack };
  if (Array.isArray(p.photos)) p.photos = p.photos.slice(0, 5);
  if (p.project && typeof p.project.overview === "string") {
    p.project = { ...p.project, overview: p.project.overview.slice(0, 1500) };
  }
  return p;
}

const toolDefs = [
  {
    type: "function",
    function: {
      name: "match_client",
      description: "Top matching units for this client, ranked by fit score.",
      parameters: {
        type: "object",
        properties: { limit: { type: "integer", description: "1-8, default 4" } },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "search_units",
      description: "Search live inventory by budget, bedrooms, unit types, areas and handover.",
      parameters: {
        type: "object",
        properties: {
          budget_min: { type: "number" },
          budget_max: { type: "number" },
          bedrooms: { type: "array", items: { type: "number" } },
          unit_types: { type: "array", items: { type: "string" } },
          areas: { type: "array", items: { type: "string" } },
          location: { type: "string", description: "Default Dubai" },
          handover_before: { type: "string", description: "ISO date" },
          post_handover: { type: "boolean" },
          limit: { type: "integer", description: "1-8, default 4" },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_property_pack",
      description: "Full pack for one project/unit: photos, documents, payment plans, parking.",
      parameters: {
        type: "object",
        properties: { project_id: { type: "number" }, unit_id: { type: "number" } },
        required: ["project_id"],
      },
    },
  },
];

function clampLimit(v: unknown) {
  const n = Number(v);
  return Number.isFinite(n) ? Math.min(8, Math.max(1, Math.round(n))) : 4;
}

/** Runs the Investment Engineer assistant with inventory tools, returns reply + recommended units. */
export async function runAssistant(
  supabase: Db,
  clientId: string,
  history: ChatMsg[],
): Promise<{ reply: string; units: UnitRef[] }> {
  const { data: client, error: clientError } = await supabase
    .from("clients")
    .select("*")
    .eq("id", clientId)
    .maybeSingle();
  if (clientError) throw new Error(clientError.message);
  if (!client) throw new Error("Client not found.");

  let lastUnits: UnitRef[] = [];
  const capture = (rows: Json) => {
    if (!Array.isArray(rows)) return;
    const refs = rows
      .filter((r: Json) => r?.unit_id && r?.project_id)
      .map((r: Json) => ({
        project_id: Number(r.project_id),
        unit_id: Number(r.unit_id),
        score: Number(r.score ?? 0),
      }));
    if (refs.length) lastUnits = refs;
  };

  async function runTool(name: string, args: Json): Promise<Json> {
    let res;
    if (name === "match_client") {
      res = await supabase.rpc("match_client", { p_client_id: clientId, p_limit: clampLimit(args.limit) });
    } else if (name === "search_units") {
      res = await supabase.rpc("search_units", {
        p_budget_min: args.budget_min ?? null,
        p_budget_max: args.budget_max ?? null,
        p_bedrooms: args.bedrooms ?? null,
        p_unit_types: args.unit_types ?? null,
        p_areas: args.areas ?? null,
        p_location: args.location ?? "Dubai",
        p_handover_before: args.handover_before ?? null,
        p_post_handover: args.post_handover ?? null,
        p_limit: clampLimit(args.limit),
      });
    } else if (name === "get_property_pack") {
      res = await supabase.rpc("get_property_pack", {
        p_project_id: Number(args.project_id),
        p_unit_id: args.unit_id == null ? null : Number(args.unit_id),
      });
    } else {
      console.log(`[deal-os] tool ${name}: unknown tool`);
      return { error: `Unknown tool ${name}` };
    }
    if (res.error) {
      console.log(`[deal-os] tool ${name} ${JSON.stringify(args)}: ERROR ${res.error.message}`);
      return { error: res.error.message };
    }
    const data = res.data;
    const count = Array.isArray(data) ? data.length : data ? 1 : 0;
    console.log(`[deal-os] tool ${name} ${JSON.stringify(args)}: ${count} rows`);
    if (name === "get_property_pack") return shortenPack(data);
    capture(data);
    return data;
  }

  const system = [
    "You are the Investment Engineer: a Dubai real-estate sales co-pilot for a broker.",
    "Only recommend units returned by your tools. Never invent projects, prices, metro distances, ROI or yields.",
    "Always state price, size, handover, payment plan steps, and which documents exist (use get_property_pack).",
    "Be short, concrete and sales-ready. Reply in the same language the broker writes in. Plain sentences and short dash bullets only — no markdown tables or headings.",
    `Client profile: ${JSON.stringify(client)}`,
  ].join("\n");

  const messages: Json[] = [{ role: "system", content: system }, ...history];

  for (let round = 0; round <= MAX_TOOL_ROUNDS; round++) {
    const finalRound = round === MAX_TOOL_ROUNDS;
    const completion = await chatCompletion(
      finalRound ? { messages } : { messages, tools: toolDefs, tool_choice: "auto" },
    );
    const msg = completion?.choices?.[0]?.message;
    if (!msg) throw new Error("AI provider returned no message.");
    const calls = msg.tool_calls ?? [];
    if (!calls.length || finalRound) {
      return { reply: String(msg.content ?? "").trim() || "(no answer)", units: lastUnits };
    }
    messages.push({ role: "assistant", content: msg.content ?? null, tool_calls: calls });
    for (const call of calls) {
      let args: Json = {};
      try {
        args = JSON.parse(call.function?.arguments || "{}");
      } catch {
        /* empty args */
      }
      const result = await runTool(call.function?.name, args);
      messages.push({ role: "tool", tool_call_id: call.id, content: JSON.stringify(result ?? null) });
    }
  }
  return { reply: "(no answer)", units: lastUnits };
}

/** Writes a 5-line meeting wrap-up. */
export async function runWrapUp(transcript: ChatMsg[], clientName: string): Promise<string> {
  const conversation = transcript.map((m) => `${m.role}: ${m.content}`).join("\n");
  const completion = await chatCompletion({
    messages: [
      {
        role: "system",
        content:
          "Write a wrap-up of this broker session in exactly 5 short lines: client intent, budget fit, units discussed, objections, next action. No preamble, no markdown headings.",
      },
      {
        role: "user",
        content: `Client: ${clientName}\n\nSession notes:\n${conversation || "(no chat this session)"}`,
      },
    ],
  });
  return String(completion?.choices?.[0]?.message?.content ?? "").trim();
}
