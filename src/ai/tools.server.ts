/**
 * Server-Side AI Tools Execution with Strict Multi-Tenancy & Privacy Enforcements
 */

import { sanitizeLeadData, sanitizeToolResult } from "./guard";
import { findClosestOptions, UnitCandidate } from "./closest";
import { formatSourceLabel } from "./shape";

export interface ToolExecutionContext {
  orgId: string;
  userId?: string;
  userRole?: string;
  supabase?: any;
}

export interface UnitRecord extends UnitCandidate {
  id: string | number;
  project_id: string | number;
  project_name: string;
  bedrooms: number;
  price_aed: number;
  area_sqft?: number;
  location: string;
  completion_date?: string;
  payment_plan?: string;
  org_id?: string; // If private listing, belongs to this org
  is_private?: boolean;
}

export interface MarketMedianResult {
  community: string;
  bedrooms: number;
  contract_count: number;
  meets_sample_threshold: boolean; // N >= 5 rule
  median_rent_aed: number | null;
  indicative_gross_yield_pct?: number | null;
  disclaimer: string;
  source: string;
}

export interface LeadRecord {
  id: string;
  org_id: string;
  name: string;
  phone?: string;
  email?: string;
  passport_number?: string;
  budget_min_aed?: number;
  budget_max_aed?: number;
  preferred_bedrooms?: number;
  preferred_areas?: string[];
  purpose?: string;
  notes?: string;
}

/**
 * Searches units. If exact search returns 0 results, invokes closest options fallback.
 * Strictly respects multi-tenant boundaries: private units are only visible if matching context.orgId.
 */
export async function searchUnits(
  params: {
    budget_min?: number;
    budget_max?: number;
    bedrooms?: number;
    location?: string;
    limit?: number;
    inventory?: UnitRecord[]; // Can be injected or queried from db
  },
  context: ToolExecutionContext,
): Promise<{
  units: UnitRecord[];
  is_closest_match: boolean;
  explanation?: string;
  source: string;
}> {
  if (!context?.orgId) {
    throw new Error("Unauthorized tool execution: missing orgId context.");
  }

  // Filter inventory by tenancy: public units (no org_id or is_private=false) OR matching context.orgId
  const availableInventory = (params.inventory || []).filter(
    (u) => !u.is_private || u.org_id === context.orgId,
  );

  const exactMatches = availableInventory.filter((u) => {
    if (params.budget_min && u.price_aed < params.budget_min) return false;
    if (params.budget_max && u.price_aed > params.budget_max) return false;
    if (params.bedrooms !== undefined && u.bedrooms !== params.bedrooms) return false;
    if (
      params.location &&
      u.location &&
      !u.location.toLowerCase().includes(params.location.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const limit = params.limit ?? 5;

  if (exactMatches.length > 0) {
    return {
      units: exactMatches.slice(0, limit),
      is_closest_match: false,
      source: formatSourceLabel("dealos"),
    };
  }

  // Fallback to closest matching options
  const fallback = findClosestOptions(
    availableInventory,
    {
      min_price: params.budget_min,
      max_price: params.budget_max,
      bedrooms: params.bedrooms,
      location: params.location,
    },
    limit,
  );

  return {
    units: fallback.closest_units,
    is_closest_match: true,
    explanation: fallback.explanation,
    source: formatSourceLabel("dealos"),
  };
}

/**
 * Retrieves DLD Ejari market median rental data.
 * STRICTLY ENFORCES THE N >= 5 RULE:
 * If fewer than 5 contracts exist in the sample, returns meets_sample_threshold = false
 * and refuses to calculate an unreliable median.
 */
export async function getMarketMedian(
  params: {
    community: string;
    bedrooms: number;
    data_provider?: (community: string, bedrooms: number) => { count: number; median_rent: number | null };
  },
  context: ToolExecutionContext,
): Promise<MarketMedianResult> {
  if (!context?.orgId) {
    throw new Error("Unauthorized tool execution: missing orgId context.");
  }

  const sample = params.data_provider
    ? params.data_provider(params.community, params.bedrooms)
    : { count: 0, median_rent: null };

  const count = sample.count;
  const meetsThreshold = count >= 5;

  if (!meetsThreshold) {
    return {
      community: params.community,
      bedrooms: params.bedrooms,
      contract_count: count,
      meets_sample_threshold: false,
      median_rent_aed: null,
      disclaimer: `Insufficient official DLD Ejari rental contracts (minimum 5 required, found ${count}) to calculate a reliable median rental yield.`,
      source: "Source: DLD Ejari (insufficient contracts for reliable median)",
    };
  }

  return {
    community: params.community,
    bedrooms: params.bedrooms,
    contract_count: count,
    meets_sample_threshold: true,
    median_rent_aed: sample.median_rent,
    disclaimer: "Indicative gross rental figure based on historical DLD Ejari registrations.",
    source: formatSourceLabel("ejari_median", { contractCount: count }),
  };
}

/**
 * Retrieves a lead profile for client matching.
 * ENFORCES MULTI-TENANCY:
 * One company can NEVER access another company's lead.
 * ENFORCES PRIVACY:
 * Strips phone, email, and private PII before returning data to the AI model.
 */
export async function getLeadBrief(
  params: {
    lead_id: string;
    lead_provider?: (id: string) => LeadRecord | null;
  },
  context: ToolExecutionContext,
): Promise<Record<string, unknown>> {
  if (!context?.orgId) {
    throw new Error("Unauthorized tool execution: missing orgId context.");
  }

  const lead = params.lead_provider ? params.lead_provider(params.lead_id) : null;

  if (!lead) {
    throw new Error(`Lead ${params.lead_id} not found.`);
  }

  // Cross-tenant boundary check
  if (lead.org_id !== context.orgId) {
    throw new Error(`Access denied: Lead belongs to another organization.`);
  }

  // Strip sensitive PII
  const sanitized = sanitizeLeadData(lead as unknown as Record<string, unknown>);
  return sanitizeToolResult(sanitized);
}

/**
 * Calculates milestone payment breakdown without speculative investment claims.
 */
export function calculatePaymentPlan(
  params: {
    total_price_aed: number;
    down_payment_pct: number;
    construction_pct: number;
    handover_pct: number;
    post_handover_pct?: number;
  },
  context: ToolExecutionContext,
) {
  if (!context?.orgId) {
    throw new Error("Unauthorized tool execution: missing orgId context.");
  }

  const price = params.total_price_aed;
  const downPayment = (price * params.down_payment_pct) / 100;
  const construction = (price * params.construction_pct) / 100;
  const handover = (price * params.handover_pct) / 100;
  const postHandover = ((params.post_handover_pct ?? 0) * price) / 100;
  const dldFee = price * 0.04;

  return {
    total_price_aed: price,
    breakdown: {
      down_payment_aed: downPayment,
      construction_installments_aed: construction,
      handover_aed: handover,
      post_handover_aed: postHandover,
      estimated_dld_4pct_aed: dldFee,
    },
    note: "All amounts derived directly from developer payment schedule. Subject to official SPA execution.",
    source: formatSourceLabel("dealos"),
  };
}
