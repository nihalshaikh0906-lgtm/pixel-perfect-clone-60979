import type { SupabaseClient } from "@supabase/supabase-js";

export type UnitRef = { project_id: number; unit_id: number; score: number };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Db = SupabaseClient<any, any, any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Json = any;
type ChatMsg = { role: "user" | "assistant"; content: string };

const MAX_TOOL_ROUNDS = 5;

type AiConfig = { key: string; url: string; model: string };
let cachedConfig: AiConfig | null = null;

function readEnv(name: string): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const g = globalThis as any;
  const fromWorker = g.__workerEnv?.[name];
  const v =
    process.env[name] || (typeof fromWorker === "string" ? fromWorker : "") || g.Deno?.env?.get?.(name) || "";
  return String(v).trim();
}

/** Reads the AI secrets. Call at the start of a request handler (where env is available). */
export function loadAiConfig(): AiConfig {
  const key = readEnv("AI_API_KEY");
  const base = readEnv("AI_BASE_URL");
  const model = readEnv("AI_MODEL");
  const missing = [!key && "AI_API_KEY", !base && "AI_BASE_URL", !model && "AI_MODEL"].filter(Boolean);
  if (missing.length) {
    if (cachedConfig) return cachedConfig;
    console.error(`[deal-os] missing AI secrets: ${missing.join(", ")}`);
    throw new Error(`AI is not configured: missing ${missing.join(", ")}.`);
  }
  const url = `${base.replace(/\/+$/, "")}/chat/completions`;
  cachedConfig = { key, url, model };
  return cachedConfig;
}

function aiConfig(): AiConfig {
  return loadAiConfig();
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
  let res: Response;
  for (let attempt = 0; ; attempt++) {
    res = await fetch(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model, ...body }),
    });
    const retryable = res.status === 429 || res.status >= 500;
    if (!retryable || attempt >= 2) break;
    console.log(`[deal-os] AI provider ${res.status}, retrying (${attempt + 1}/2)`);
    await new Promise((r) => setTimeout(r, 1500 * (attempt + 1) + Math.random() * 500));
  }
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
  {
    type: "function",
    function: {
      name: "web_search",
      description: "Live web search for developer history, project news, market trends or any fact not in the context.",
      parameters: {
        type: "object",
        properties: { query: { type: "string", description: "Search query" } },
        required: ["query"],
      },
    },
  },
];

/** Live web search via the Firecrawl connector. Returns compact results for the model. */
async function firecrawlSearch(query: string): Promise<Json> {
  const lovable = readEnv("LOVABLE_API_KEY");
  const fc = readEnv("FIRECRAWL_API_KEY");
  if (!lovable || !fc) return { error: "Web search is not configured." };
  const res = await fetch("https://connector-gateway.lovable.dev/firecrawl/v2/search", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${lovable}`, "X-Connection-Api-Key": fc },
    body: JSON.stringify({ query, limit: 6, sources: ["web", "news"] }),
  });
  const body = await res.text();
  if (!res.ok) return { error: `Search failed [${res.status}]: ${body.slice(0, 200)}` };
  const j = JSON.parse(body);
  const raw: { title?: string; url?: string; snippet?: string; description?: string; date?: string }[] = [
    ...(j?.data?.news ?? []),
    ...(j?.data?.web ?? []),
    ...(Array.isArray(j?.data) ? j.data : []),
  ];
  const clean = (t = "") =>
    t.replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/[#*_>`]+/g, " ").replace(/\s+/g, " ").trim().slice(0, 500);
  return raw
    .filter((r) => r.url && r.title)
    .slice(0, 6)
    .map((r) => ({ title: r.title, source: new URL(r.url!).hostname.replace(/^www\./, ""), url: r.url, date: r.date ?? null, snippet: clean(r.snippet ?? r.description) }));
}

function clampLimit(v: unknown) {
  const n = Number(v);
  return Number.isFinite(n) ? Math.min(8, Math.max(1, Math.round(n))) : 4;
}

// Fixed text so the provider's prefix cache applies. Changing context goes after it.
const CHAT_SYSTEM = [
  "You are PropFlow's Senior Dubai Real Estate Advisory Partner. You speak with brokers with white-glove courtesy, razor-sharp precision, and complete resourcefulness.",
  "CRITICAL RULES ON DOCUMENTS & FORMS:",
  "- NEVER refuse to generate forms, agreements, payment schedules, or documents. NEVER say you cannot generate reservation forms, that you have no PDF capability, or that you can't fabricate one. The dashboard exports any of your replies to PDF.",
  "- When the broker asks for a booking form, reservation sheet, payment plan document, or client agreement, immediately generate a complete, structured, professional draft in Markdown containing:",
  "  1. Header: '# EXPRESSION OF INTEREST & UNIT RESERVATION DRAFT'",
  "  2. '## Buyer & Broker Details' (Client Name, Contact, Passport/Emirates ID placeholder)",
  "  3. '## Unit Specifications' (Project Name, Unit Type, Size in SqFt, Handover Date)",
  "  4. '## Financial & Payment Schedule' (Total Price in AED, Down Payment %, milestone installments with AED amounts)",
  "  5. '## Reservation Terms & Deposit Conditions' (standard Dubai off-plan EOI terms, e.g. refundable/non-refundable deposit, validity, DLD 4% fee note)",
  "- Use Markdown tables (| a | b |) for details, specs and schedules. Use '[To be completed]' for any field not in the data.",
  "- If the project has no brochure in its documents, do not say you are blocked. Say: 'Official developer brochure is being indexed. I have compiled the full unit specifications and payment schedule below for immediate export.' then give the structured data.",
  "PRIORITY HIGHLIGHT FORMAT (property analysis):",
  "- Maximum 1 short intro sentence, then 1-5 numbered points (each line starting with the number), most important first, covering client fit, infrastructure, schools, metro/road connectivity, and yield catalysts. Bold the point title with **.",
  "- Close with one polite actionable question. For short practical requests (e.g. a WhatsApp message) answer directly.",
  "DATA RULES:",
  "- Use the provided context first. Call a tool only if the answer is not in the context. Only recommend units that appear in the context or in tool results.",
  "- Never invent projects, prices, sizes, handover dates or payment plans; in drafts, take them only from the data or leave a placeholder. Share infrastructure and market knowledge in general terms, never exact metro distances or yields not in the data.",
  "- Reply in the broker's language.",
].join("\n");

const chatTools = toolDefs.filter((t) => t.function.name !== "match_client");

type StreamResult = {
  text: string;
  toolCalls: { id: string; name: string; args: string }[];
  usage: Json;
};

async function openStream(body: Json): Promise<Response> {
  const { key, url, model } = aiConfig();
  const send = (extra: Json) =>
    fetch(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        stream: true,
        stream_options: { include_usage: true },
        max_tokens: 900,
        temperature: 0.3,
        ...extra,
        ...body,
      }),
    });
  let res: Response = await send({ thinking: { type: "disabled" } });
  // Provider may not know the "thinking" switch — retry without it.
  if (res.status === 400) res = await send({});
  for (let attempt = 0; (res.status === 429 || res.status >= 500) && attempt < 2; attempt++) {
    await new Promise((r) => setTimeout(r, 1500 * (attempt + 1) + Math.random() * 500));
    res = await send({});
  }
  if (!res.ok) {
    const text = await res.text();
    let msg = text;
    try {
      const j = JSON.parse(text);
      msg = j?.error?.message ?? j?.message ?? text;
    } catch {
      /* raw */
    }
    console.error(`[deal-os] AI provider ${res.status}: ${msg}`);
    throw new Error(`AI provider error ${res.status} (${describeStatus(res.status)}): ${String(msg).slice(0, 400)}`);
  }
  return res;
}

async function readStream(res: Response, onDelta: (t: string) => void): Promise<StreamResult> {
  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  let buf = "";
  let text = "";
  let usage: Json = null;
  const calls: Record<number, { id: string; name: string; args: string }> = {};
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    let nl;
    while ((nl = buf.indexOf("\n")) >= 0) {
      const line = buf.slice(0, nl).trim();
      buf = buf.slice(nl + 1);
      if (!line.startsWith("data:")) continue;
      const payload = line.slice(5).trim();
      if (payload === "[DONE]") continue;
      let j: Json;
      try {
        j = JSON.parse(payload);
      } catch {
        continue;
      }
      if (j.usage) usage = j.usage;
      const delta = j.choices?.[0]?.delta;
      if (!delta) continue;
      if (delta.content) {
        text += delta.content;
        onDelta(delta.content);
      }
      for (const tc of delta.tool_calls ?? []) {
        const c = (calls[tc.index ?? 0] ??= { id: "", name: "", args: "" });
        if (tc.id) c.id = tc.id;
        if (tc.function?.name) c.name += tc.function.name;
        if (tc.function?.arguments) c.args += tc.function.arguments;
      }
    }
  }
  return { text, toolCalls: Object.values(calls), usage };
}

export type ChatEvent =
  | { type: "text"; delta: string }
  | { type: "units"; units: UnitRef[] }
  | { type: "error"; message: string }
  | { type: "done" };

/** Streams one chat answer. Uses the browser-sent context first; at most 1 tool round. */
export async function streamChat(
  supabase: Db,
  clientId: string,
  history: ChatMsg[],
  context: string,
  emit: (e: ChatEvent) => void,
): Promise<void> {
  const started = Date.now();
  const { data: client, error: clientError } = await supabase
    .from("clients")
    .select("full_name, budget_min_aed, budget_max_aed, purpose, preferred_areas, preferred_location, handover_before, payment_preference, nationality, notes")
    .eq("id", clientId)
    .maybeSingle();
  if (clientError) throw new Error(clientError.message);
  if (!client) throw new Error("Client not found.");

  const messages: Json[] = [
    { role: "system", content: CHAT_SYSTEM },
    { role: "system", content: `Client: ${JSON.stringify(client)}\n\nSession context (units already shown):\n${context || "(none)"}` },
    ...history.slice(-8),
  ];

  const toolsUsed: string[] = [];
  let inTok = 0;
  let outTok = 0;
  let cached = 0;
  const addUsage = (u: Json) => {
    inTok += Number(u?.prompt_tokens ?? 0);
    outTok += Number(u?.completion_tokens ?? 0);
    cached += Number(u?.prompt_cache_hit_tokens ?? u?.prompt_tokens_details?.cached_tokens ?? 0);
  };

  try {
    const first = await readStream(
      await openStream({ messages, tools: chatTools, tool_choice: "auto" }),
      (d) => emit({ type: "text", delta: d }),
    );
    addUsage(first.usage);

    if (first.toolCalls.length) {
      messages.push({
        role: "assistant",
        content: first.text || null,
        tool_calls: first.toolCalls.map((c) => ({
          id: c.id,
          type: "function",
          function: { name: c.name, arguments: c.args || "{}" },
        })),
      });
      const newUnits: UnitRef[] = [];
      for (const call of first.toolCalls) {
        let args: Json = {};
        try {
          args = JSON.parse(call.args || "{}");
        } catch {
          /* empty */
        }
        toolsUsed.push(call.name);
        let result: Json;
        if (call.name === "search_units") {
          const res = await supabase.rpc("search_units", {
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
          result = res.error ? { error: res.error.message } : res.data;
          const rows = Array.isArray(res.data) ? res.data : [];
          console.log(`[deal-os] tool search_units ${JSON.stringify(args)}: ${res.error ? "ERROR " + res.error.message : rows.length + " rows"}`);
          for (const r of rows as Json[]) {
            if (r?.unit_id && r?.project_id)
              newUnits.push({ project_id: Number(r.project_id), unit_id: Number(r.unit_id), score: Number(r.score ?? 0) });
          }
        } else if (call.name === "get_property_pack") {
          const res = await supabase.rpc("get_property_pack", {
            p_project_id: Number(args.project_id),
            p_unit_id: args.unit_id == null ? null : Number(args.unit_id),
          });
          result = res.error ? { error: res.error.message } : shortenPack(res.data);
          console.log(`[deal-os] tool get_property_pack ${JSON.stringify(args)}: ${res.error ? "ERROR " + res.error.message : res.data ? "1 rows" : "0 rows"}`);
          if (!res.error && args.unit_id != null)
            newUnits.push({ project_id: Number(args.project_id), unit_id: Number(args.unit_id), score: 0 });
        } else {
          result = { error: `Unknown tool ${call.name}` };
        }
        messages.push({ role: "tool", tool_call_id: call.id, content: JSON.stringify(result ?? null) });
      }
      if (newUnits.length) emit({ type: "units", units: newUnits });

      if (first.text) emit({ type: "text", delta: "\n\n" });
      const second = await readStream(await openStream({ messages }), (d) =>
        emit({ type: "text", delta: d }),
      );
      addUsage(second.usage);
    }
  } finally {
    console.log(
      `[deal-os] chat client=${clientId} tool_used=${toolsUsed.length ? "yes" : "no"} tools=${toolsUsed.join(",") || "-"} input_tokens=${inTok} cached_input_tokens=${cached} output_tokens=${outTok} ms=${Date.now() - started}`,
    );
  }
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

/** One-shot DeepSeek call used by news, reports and other writing tasks. */
export async function aiWrite(system: string, user: string, maxTokens = 1200): Promise<string> {
  loadAiConfig();
  const completion = await chatCompletion({
    temperature: 0.3,
    max_tokens: maxTokens,
    thinking: { type: "disabled" },
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
  });
  return String(completion?.choices?.[0]?.message?.content ?? "").trim();
}
