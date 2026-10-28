import { supabase } from "@/integrations/supabase/client";

export function isValidUuid(id?: string | null): boolean {
  if (!id) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}

let cachedOrgId: string | null = null;

/**
 * Resolves the active organization UUID for the user, creating one if needed.
 */
export async function getOrEnsureOrgId(): Promise<string | null> {
  if (cachedOrgId && isValidUuid(cachedOrgId)) {
    return cachedOrgId;
  }

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      // Check if there is an organization in DB we can link to
      try {
        const { data: orgs } = await (supabase as any)
          .from("organizations")
          .select("id")
          .limit(1);
        if (orgs && orgs.length > 0 && isValidUuid(orgs[0].id)) {
          cachedOrgId = orgs[0].id;
          return cachedOrgId;
        }
      } catch {}
      return null;
    }

    // 1. Look up existing org_members record
    const { data: member } = await (supabase as any)
      .from("org_members")
      .select("org_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (member?.org_id && isValidUuid(member.org_id)) {
      cachedOrgId = member.org_id;
      return cachedOrgId;
    }

    // 2. Call Postgres create_my_organization RPC
    const userName = (user.user_metadata?.full_name as string) || user.email?.split("@")[0] || "DealOS Agency Owner";
    try {
      const { data: createdOrgId, error: rpcErr } = await supabase.rpc("create_my_organization", {
        p_name: "DealOS Agency",
        p_full_name: userName,
      });

      if (!rpcErr && createdOrgId && isValidUuid(createdOrgId)) {
        cachedOrgId = createdOrgId;
        return cachedOrgId;
      }
    } catch {}

    // 3. Fallback: query any organization or insert
    const { data: existingOrgs } = await (supabase as any)
      .from("organizations")
      .select("id")
      .limit(1);

    if (existingOrgs && existingOrgs.length > 0 && isValidUuid(existingOrgs[0].id)) {
      const orgId = existingOrgs[0].id;
      try {
        await (supabase as any).from("org_members").insert({
          org_id: orgId,
          user_id: user.id,
          role: "company_admin",
          full_name: userName,
        });
      } catch {}
      cachedOrgId = orgId;
      return cachedOrgId;
    }
  } catch (err) {
    console.warn("Could not determine or ensure Supabase org_id:", err);
  }

  return null;
}

export interface SupabaseLeadInput {
  name: string;
  phone?: string | null;
  email?: string | null;
  preferred_areas?: string[] | null;
  budget_min?: number | null;
  budget_max?: number | null;
  bedrooms?: string | null;
  type?: string | null;
  stage?: string;
  priority?: string;
  score?: number | null;
  ai_summary?: string | null;
  source?: string | null;
  assigned_to?: string | null;
  next_follow_up_at?: string | null;
}

/**
 * Persists a single lead into the Supabase Postgres `leads` table.
 * Adheres strictly to the database migration schema.
 */
export async function saveLeadToSupabase(
  lead: SupabaseLeadInput
): Promise<{ success: boolean; leadId?: string; error?: string }> {
  try {
    const orgId = await getOrEnsureOrgId();
    if (!orgId) {
      return { success: false, error: "No organization found or authenticated." };
    }

    const payload = {
      org_id: orgId,
      name: lead.name.trim(),
      phone: lead.phone || null,
      email: lead.email || null,
      preferred_areas: lead.preferred_areas && lead.preferred_areas.length > 0 ? lead.preferred_areas : null,
      budget_min: lead.budget_min ?? null,
      budget_max: lead.budget_max ?? null,
      bedrooms: lead.bedrooms ? String(lead.bedrooms) : null,
      type: lead.type?.toLowerCase() || "off-plan",
      stage: lead.stage?.toLowerCase() || "new",
      priority: lead.priority?.toLowerCase() || "warm",
      score: lead.score ?? 85,
      ai_summary: lead.ai_summary || null,
      source: lead.source || "Company Owner Import",
      assigned_to: isValidUuid(lead.assigned_to) ? lead.assigned_to : null,
      next_follow_up_at: lead.next_follow_up_at || new Date(Date.now() + 3600e3).toISOString(),
    };

    const { data, error } = await (supabase as any)
      .from("leads")
      .insert(payload)
      .select("id")
      .single();

    if (error) {
      console.warn("Supabase lead insert notice:", error.message);
      return { success: false, error: error.message };
    }

    return { success: true, leadId: data?.id };
  } catch (err: any) {
    console.warn("Exception saving lead to Supabase:", err);
    return { success: false, error: err?.message || "Failed to persist lead" };
  }
}

/**
 * Batch persists multiple leads into the Supabase Postgres `leads` table.
 */
export async function batchSaveLeadsToSupabase(
  leads: SupabaseLeadInput[]
): Promise<{ success: boolean; count: number; error?: string }> {
  if (!leads || leads.length === 0) {
    return { success: true, count: 0 };
  }

  try {
    const orgId = await getOrEnsureOrgId();
    if (!orgId) {
      return { success: false, count: 0, error: "No organization found or authenticated." };
    }

    const payloads = leads.map((lead) => ({
      org_id: orgId,
      name: lead.name.trim(),
      phone: lead.phone || null,
      email: lead.email || null,
      preferred_areas: lead.preferred_areas && lead.preferred_areas.length > 0 ? lead.preferred_areas : null,
      budget_min: lead.budget_min ?? null,
      budget_max: lead.budget_max ?? null,
      bedrooms: lead.bedrooms ? String(lead.bedrooms) : null,
      type: lead.type?.toLowerCase() || "off-plan",
      stage: lead.stage?.toLowerCase() || "new",
      priority: lead.priority?.toLowerCase() || "warm",
      score: lead.score ?? 85,
      ai_summary: lead.ai_summary || null,
      source: lead.source || "CSV Import",
      assigned_to: isValidUuid(lead.assigned_to) ? lead.assigned_to : null,
      next_follow_up_at: lead.next_follow_up_at || new Date(Date.now() + 3600e3).toISOString(),
    }));

    const { data, error } = await (supabase as any)
      .from("leads")
      .insert(payloads)
      .select("id");

    if (error) {
      console.warn("Supabase batch insert error:", error.message);
      return { success: false, count: 0, error: error.message };
    }

    return { success: true, count: data?.length || payloads.length };
  } catch (err: any) {
    console.warn("Exception during batch lead insert:", err);
    return { success: false, count: 0, error: err?.message || "Batch insert failed" };
  }
}

/**
 * Atomically updates lead assignment in Supabase.
 * If lead is already assigned to someone else, this conditional update will not overwrite it.
 */
export async function atomicClaimLeadInSupabase(
  leadId: string,
  agentUserId: string
): Promise<{ success: boolean; error?: string }> {
  if (!isValidUuid(leadId)) {
    return { success: true };
  }

  try {
    const { data, error } = await (supabase as any)
      .from("leads")
      .update({
        assigned_to: isValidUuid(agentUserId) ? agentUserId : null,
        stage: "claimed",
        updated_at: new Date().toISOString(),
      })
      .eq("id", leadId)
      .is("assigned_to", null)
      .select("id");

    if (error) {
      return { success: false, error: error.message };
    }

    if (!data || data.length === 0) {
      return { success: false, error: "Lead already claimed by another agent." };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Atomic claim failed" };
  }
}
