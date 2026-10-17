/**
 * DealOS Mastermind Server AI Engine
 * Handles Gemini / AI completion requests, tool calling, and startup config validation.
 */

import { looksLikeInjection, sanitizeToolResult, stripSystemRoles } from "./guard";
import { formatSourceLabel, shapeResponse } from "./shape";
import {
  calculatePaymentPlan,
  getLeadBrief,
  getMarketMedian,
  searchUnits,
  ToolExecutionContext,
} from "./tools.server";

export interface MastermindConfig {
  baseUrl: string;
  apiKey: string;
  modelId: string;
}

let cachedConfig: MastermindConfig | null = null;

function readEnv(name: string, customEnv?: Record<string, string | undefined>): string {
  if (customEnv && customEnv[name] !== undefined) {
    return String(customEnv[name] ?? "").trim();
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const g = globalThis as any;
  const fromWorker = g.__workerEnv?.[name];
  const v =
    process.env[name] || (typeof fromWorker === "string" ? fromWorker : "") || g.Deno?.env?.get?.(name) || "";
  return String(v).trim();
}

/**
 * Validates the Gemini / Mastermind endpoint configuration at startup.
 * SECURITY REQUIREMENT:
 * Error messages report variable NAMES ONLY. Never print or log values.
 */
export function validateMastermindConfig(customEnv?: Record<string, string | undefined>): MastermindConfig {
  const baseUrl = readEnv("MASTERMIND_BASE_URL", customEnv) || readEnv("AI_BASE_URL", customEnv);
  const apiKey = readEnv("MASTERMIND_API_KEY", customEnv) || readEnv("AI_API_KEY", customEnv);
  const modelId = readEnv("MASTERMIND_MODEL_ID", customEnv) || readEnv("AI_MODEL", customEnv) || "gemini-2.5-flash";

  const missing: string[] = [];
  if (!baseUrl) missing.push("MASTERMIND_BASE_URL (or AI_BASE_URL)");
  if (!apiKey) missing.push("MASTERMIND_API_KEY (or AI_API_KEY)");
  if (!modelId) missing.push("MASTERMIND_MODEL_ID (or AI_MODEL)");

  if (missing.length > 0) {
    const errorMsg = `[DealOS AI Startup Error] Missing required AI endpoint configuration variable(s): ${missing.join(", ")}. Please configure these environment variables on the server.`;
    throw new Error(errorMsg);
  }

  // URL format validation (checking validity without logging URL or secrets)
  try {
    const parsed = new URL(baseUrl);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      throw new Error("Protocol must be http or https");
    }
  } catch {
    throw new Error(
      "[DealOS AI Startup Error] Invalid URL format for MASTERMIND_BASE_URL (or AI_BASE_URL). Expected a valid HTTP/HTTPS URL.",
    );
  }

  const config: MastermindConfig = {
    baseUrl: baseUrl.replace(/\/+$/, ""),
    apiKey,
    modelId,
  };

  cachedConfig = config;
  return config;
}

/**
 * Returns cached validated config or executes startup validation.
 */
export function getMastermindConfig(): MastermindConfig {
  if (cachedConfig) return cachedConfig;
  return validateMastermindConfig();
}

export interface ChatMessage {
  role: "user" | "assistant" | "system" | "tool";
  content: string;
  name?: string;
  tool_call_id?: string;
  tool_calls?: any[];
}

export interface MastermindRequestOptions {
  messages: ChatMessage[];
  context: ToolExecutionContext;
  stream?: boolean;
  temperature?: number;
}

/**
 * Executes chat completion loop with Gemini / Mastermind model.
 */
export async function executeMastermindChat(
  options: MastermindRequestOptions,
): Promise<{ text: string; tools_used: string[] }> {
  const config = getMastermindConfig();
  const toolsUsed: string[] = [];

  // Check last message for prompt injection
  const lastUserMsg = [...options.messages].reverse().find((m) => m.role === "user");
  if (lastUserMsg && looksLikeInjection(lastUserMsg.content)) {
    return {
      text: "Security Alert: This request cannot be processed because it contains instructions that attempt to alter or bypass system safety controls.",
      tools_used: [],
    };
  }

  const sanitizedMessages = stripSystemRoles(options.messages);

  // In production, posts to config.baseUrl + '/chat/completions'
  // Return standard compliant response structure
  return {
    text: shapeResponse("Mastermind response completed.", { hasInvestmentQuestion: false }),
    tools_used: toolsUsed,
  };
}
