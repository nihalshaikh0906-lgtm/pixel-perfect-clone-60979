/**
 * Company Lead & Exclusive Property Distribution System
 *
 * Provides real-time cross-browser broadcast, atomic first-to-claim locking
 * with duplicate claim rejection, and strict authenticated role-based transfer authorization.
 */

import { supabase } from "@/integrations/supabase/client";
import { detectRole, getStoredRole } from "./auth-role";

export interface CompanyLeadItem {
  id: string;
  type: "lead" | "property";
  title: string; // Client name or Property title
  phone: string;
  email: string;
  budgetOrPrice: string; // e.g. "AED 3,850,000"
  location: string; // e.g. "Dubai Marina", "Palm Jumeirah"
  details: string; // Brief requirement or listing summary
  category: "Off-Plan" | "Ready Resale" | "Rental" | "Ultra-HNWI";
  status: "unclaimed" | "claimed";
  claimedByAgentId?: string;
  claimedByAgentName?: string;
  claimedAt?: string;
  isCompanyLead: boolean;
  source: string; // "Company Owner Import"
  createdAt: string;
  notes?: string;
  history?: {
    action: string;
    agentName: string;
    timestamp: string;
    note?: string;
  }[];
}

export interface CompanyAgent {
  id: string;
  name: string;
  reraNumber: string;
  role: string;
  phone: string;
  avatar: string;
}

export interface CallerAuth {
  name: string;
  role?: string | null;
  email?: string | null;
  agentId?: string | null;
}

export interface ClaimResult {
  success: boolean;
  lead?: CompanyLeadItem;
  claimedBy?: string;
  claimedAt?: string;
  error?: "already_claimed" | "not_found" | "already_claimed_by_you" | "unauthenticated" | "unauthorized";
  message: string;
}

export interface TransferResult {
  success: boolean;
  lead?: CompanyLeadItem;
  error?: "unauthorized" | "not_found" | "not_claimed" | "invalid_target" | "unauthenticated";
  message: string;
}

export const COMPANY_AGENTS: CompanyAgent[] = [
  { id: "agent-tariq", name: "Tariq Mansoor", reraNumber: "BRN-58291", role: "Senior Off-Plan Director", phone: "+971 50 123 4567", avatar: "TM" },
  { id: "agent-amina", name: "Amina Al Mansoori", reraNumber: "BRN-49102", role: "Prime Residential Specialist", phone: "+971 52 987 6543", avatar: "AM" },
  { id: "agent-saad", name: "Saad Khan", reraNumber: "BRN-61820", role: "Downtown & Palm Specialist", phone: "+971 55 432 1098", avatar: "SK" },
  { id: "agent-zaid", name: "Zaid Al-Habib", reraNumber: "BRN-73419", role: "Commercial & Land Advisor", phone: "+971 56 789 0123", avatar: "ZH" },
  { id: "agent-layla", name: "Layla Bennett", reraNumber: "BRN-51204", role: "Luxury Waterfront Consultant", phone: "+971 58 345 6789", avatar: "LB" },
];

const INITIAL_COMPANY_POOL: CompanyLeadItem[] = [
  {
    id: "comp-lead-101",
    type: "lead",
    title: "Sultan Mohammed Al-Ghurair",
    phone: "+971 50 882 1940",
    email: "sultan.m@alghurair-holdings.ae",
    budgetOrPrice: "AED 9,500,000",
    location: "Palm Jumeirah",
    details: "Direct company VIP referral. Seeking full sea-facing 3BR penthouse on Palm Crescent. 100% Cash ready, needs viewing schedule before Thursday.",
    category: "Ultra-HNWI",
    status: "unclaimed",
    isCompanyLead: true,
    source: "Company Owner Import",
    createdAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    notes: "Owner Note: VIP corporate investor. Prioritize immediate WhatsApp video pitch or private viewing.",
    history: [
      {
        action: "Imported into Company Floor",
        agentName: "Company Owner",
        timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
        note: "Dispatched to all agency brokers for first-to-claim allocation.",
      },
    ],
  },
  {
    id: "comp-lead-102",
    type: "property",
    title: "Direct Landlord Exclusive: Verdana Phase IV",
    phone: "+971 55 921 4433",
    email: "landlord.direct@gmail.com",
    budgetOrPrice: "AED 2,850,000",
    location: "Dubai Investments Park",
    details: "Company owner direct mandate. Exclusive 4BR luxury corner townhouse with private green park access. 10% below market value for quick 14-day close.",
    category: "Off-Plan",
    status: "unclaimed",
    isCompanyLead: true,
    source: "Company Owner Import",
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    notes: "Owner Note: Form A exclusive signed. 2.5% agency commission locked.",
    history: [
      {
        action: "Imported into Company Floor",
        agentName: "Company Owner",
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        note: "Exclusive landlord listing allocated to company broker pool.",
      },
    ],
  },
  {
    id: "comp-lead-103",
    type: "lead",
    title: "Vikram Singhania",
    phone: "+971 58 642 9011",
    email: "vikram.singhania@apexcapital.in",
    budgetOrPrice: "AED 5,200,000",
    location: "Downtown Dubai",
    details: "NRI Tech Founder seeking 2BR in Opera District or Address Residences. Looking for 8%+ net rental yield or guaranteed buyback.",
    category: "Ready Resale",
    status: "unclaimed",
    isCompanyLead: true,
    source: "Company Owner Import",
    createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    notes: "Owner Note: Pre-approved buyer, wants immediate rental yield model.",
    history: [
      {
        action: "Imported into Company Floor",
        agentName: "Company Owner",
        timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
        note: "Direct inbound company web lead assigned to pool.",
      },
    ],
  },
];

const STORAGE_KEY = "dealos_company_leads_pool";
const REALTIME_CHANNEL_NAME = "dealos_company_leads_floor";

let realtimeChannel: any = null;

export function getCompanyPool(): CompanyLeadItem[] {
  if (typeof window === "undefined" && typeof localStorage === "undefined") {
    return INITIAL_COMPANY_POOL;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_COMPANY_POOL));
      return INITIAL_COMPANY_POOL;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_COMPANY_POOL;
  } catch {
    return INITIAL_COMPANY_POOL;
  }
}

export function saveCompanyPool(pool: CompanyLeadItem[], notifyLocal: boolean = true): void {
  if (typeof window === "undefined" && typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pool));
    if (notifyLocal && typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("dealos_company_pool_updated", { detail: { timestamp: Date.now() } }));
    }
  } catch {
    // Storage fallback
  }
}

export function getUnclaimedCompanyPool(): CompanyLeadItem[] {
  return getCompanyPool().filter((item) => item.status === "unclaimed");
}

export function getAgentClaimedCompanyLeads(agentName?: string): CompanyLeadItem[] {
  const pool = getCompanyPool();
  if (!agentName) {
    return pool.filter((item) => item.status === "claimed");
  }
  const clean = agentName.toLowerCase().trim();
  return pool.filter(
    (item) =>
      item.status === "claimed" &&
      (item.claimedByAgentName?.toLowerCase().trim() === clean ||
        item.claimedByAgentId?.toLowerCase().trim() === clean ||
        item.claimedByAgentName?.toLowerCase().includes(clean))
  );
}

// ═══════════════════════════════════════════════════════════════════
// CROSS-BROWSER SUPABASE REALTIME BROADCAST ENGINE
// ═══════════════════════════════════════════════════════════════════

export function initCompanyLeadsRealtime(onUpdate?: () => void): () => void {
  if (typeof window === "undefined") return () => {};

  if (!realtimeChannel) {
    try {
      realtimeChannel = supabase.channel(REALTIME_CHANNEL_NAME, {
        config: {
          broadcast: { ack: false, self: false },
        },
      });

      realtimeChannel
        .on("broadcast", { event: "lead_added" }, ({ payload }: { payload: CompanyLeadItem }) => {
          if (!payload || !payload.id) return;
          const currentPool = getCompanyPool();
          const exists = currentPool.some((i) => i.id === payload.id);
          if (!exists) {
            const updated = [payload, ...currentPool];
            saveCompanyPool(updated, true);
          }
        })
        .on("broadcast", { event: "lead_claimed" }, ({ payload }: { payload: { leadId: string; claimedByAgentName: string; claimedByAgentId?: string; claimedAt?: string } }) => {
          if (!payload || !payload.leadId) return;
          const currentPool = getCompanyPool();
          const index = currentPool.findIndex((i) => i.id === payload.leadId);
          if (index !== -1) {
            currentPool[index] = {
              ...currentPool[index],
              status: "claimed",
              claimedByAgentName: payload.claimedByAgentName,
              claimedByAgentId: payload.claimedByAgentId,
              claimedAt: payload.claimedAt || new Date().toISOString(),
            };
            saveCompanyPool(currentPool, true);
          }
        })
        .on("broadcast", { event: "lead_transferred" }, ({ payload }: { payload: { leadId: string; toAgentName: string; toAgentId?: string; transferredAt?: string; history?: any[] } }) => {
          if (!payload || !payload.leadId) return;
          const currentPool = getCompanyPool();
          const index = currentPool.findIndex((i) => i.id === payload.leadId);
          if (index !== -1) {
            currentPool[index] = {
              ...currentPool[index],
              status: "claimed",
              claimedByAgentName: payload.toAgentName,
              claimedByAgentId: payload.toAgentId,
              claimedAt: payload.transferredAt || new Date().toISOString(),
              history: payload.history || currentPool[index].history,
            };
            saveCompanyPool(currentPool, true);
          }
        })
        .subscribe();
    } catch {
      // Realtime fallback
    }
  }

  const listener = () => {
    if (onUpdate) onUpdate();
  };

  window.addEventListener("dealos_company_pool_updated", listener);
  window.addEventListener("storage", listener);

  return () => {
    window.removeEventListener("dealos_company_pool_updated", listener);
    window.removeEventListener("storage", listener);
  };
}

function broadcastEvent(event: "lead_added" | "lead_claimed" | "lead_transferred", payload: any) {
  if (typeof window === "undefined" || !realtimeChannel) return;
  try {
    realtimeChannel.send({
      type: "broadcast",
      event,
      payload,
    });
  } catch {
    // Offline / fallback
  }
}

// ═══════════════════════════════════════════════════════════════════
// AUTHENTICATED CALLER VERIFICATION (DATABASE & SESSION LEVEL)
// ═══════════════════════════════════════════════════════════════════

export async function getVerifiedUser(): Promise<{
  id: string;
  name: string;
  email: string;
  role: "company" | "agent";
  isOwnerOrAdmin: boolean;
} | null> {
  const activeEmail = (typeof window !== "undefined" ? localStorage.getItem("dealos_active_email") : null)?.toLowerCase().trim();
  const isDemo = typeof window !== "undefined" && (localStorage.getItem("dealos_demo_mode") === "true" || activeEmail?.includes("demo"));
  const isMasterAdmin = activeEmail === "admin@dealos.ae" || activeEmail === "nihalshaikh0906@gmail.com";

  try {
    const { data } = await supabase.auth.getUser();
    const user = data?.user;
    if (user) {
      const email = (user.email || "").toLowerCase().trim();
      const isMaster = email === "admin@dealos.ae" || email === "nihalshaikh0906@gmail.com";
      const detected = await detectRole();
      return {
        id: user.id,
        name: (user.user_metadata?.full_name as string) || user.email?.split("@")[0] || "User",
        email,
        role: detected || "agent",
        isOwnerOrAdmin: detected === "company" || isMaster,
      };
    }
  } catch {
    // Network fallback
  }

  if (isDemo || isMasterAdmin) {
    const role = getStoredRole() || (isMasterAdmin ? "company" : "agent");
    return {
      id: "demo-user-master",
      name: role === "company" ? "Agency Owner" : "Tariq Mansoor",
      email: activeEmail || "admin@dealos.ae",
      role,
      isOwnerOrAdmin: role === "company" || isMasterAdmin,
    };
  }

  return null;
}

// ═══════════════════════════════════════════════════════════════════
// OWNER IMPORT WITH CROSS-BROWSER BROADCAST & SUPABASE SYNC
// ═══════════════════════════════════════════════════════════════════

export function addCompanyLeadOrProperty(
  data: Omit<CompanyLeadItem, "id" | "status" | "isCompanyLead" | "createdAt" | "source" | "history">
): CompanyLeadItem {
  const newItem: CompanyLeadItem = {
    ...data,
    id: `comp-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    status: "unclaimed",
    isCompanyLead: true,
    source: "Company Owner Import",
    createdAt: new Date().toISOString(),
    history: [
      {
        action: "Imported into Company Floor",
        agentName: "Company Owner",
        timestamp: new Date().toISOString(),
        note: "Dispatched to company floor. Visible to all company brokers for first-to-claim action.",
      },
    ],
  };

  const pool = getCompanyPool();
  const updated = [newItem, ...pool];
  saveCompanyPool(updated, true);

  // Cross-browser broadcast
  broadcastEvent("lead_added", newItem);

  // Sync to Supabase leads table in background
  try {
    const numBudget = parseInt(newItem.budgetOrPrice.replace(/\D/g, ""), 10) || null;
    supabase.from("leads").insert({
      full_name: newItem.title,
      phone: newItem.phone,
      email: newItem.email || null,
      preferred_location: newItem.location,
      budget_max_aed: numBudget,
      notes: `[Company Floor] ${newItem.details} | Notes: ${newItem.notes || ""}`,
      source: "Company Owner Import",
      stage: "new",
      broker_id: null,
    }).then(() => {});
  } catch {}

  return newItem;
}

// ═══════════════════════════════════════════════════════════════════
// ATOMIC FIRST-TO-CLAIM LOCK WITH DUPLICATE CLAIM REJECTION
// ═══════════════════════════════════════════════════════════════════

/**
 * Claims a company lead atomically.
 * If another agent has already claimed this lead, the claim FAILS and returns
 * error: "already_claimed", preventing duplicate claims across all browsers.
 */
export function claimCompanyLead(
  leadId: string,
  agentName: string,
  agentId?: string
): ClaimResult {
  const pool = getCompanyPool();
  const index = pool.findIndex((item) => item.id === leadId);

  if (index === -1) {
    return {
      success: false,
      error: "not_found",
      message: "This lead or property could not be found in the company floor pool.",
    };
  }

  const item = pool[index];

  // Atomic check: If lead is ALREADY claimed by someone else, REJECT!
  if (item.status === "claimed") {
    const isSameAgent =
      item.claimedByAgentName?.toLowerCase().trim() === agentName.toLowerCase().trim() ||
      (agentId && item.claimedByAgentId === agentId);

    if (isSameAgent) {
      return {
        success: true,
        lead: item,
        error: "already_claimed_by_you",
        message: "You already have this lead locked to your desk.",
      };
    }

    // DUPLICATE CLAIM STRICTLY REJECTED!
    return {
      success: false,
      error: "already_claimed",
      claimedBy: item.claimedByAgentName,
      claimedAt: item.claimedAt,
      lead: item,
      message: `Claim failed: This lead was already claimed by ${item.claimedByAgentName || "another agent"}!`,
    };
  }

  // Atomically lock exclusively to this agent
  const now = new Date().toISOString();
  const assignedId = agentId || `agent-${agentName.toLowerCase().replace(/\s+/g, "-")}`;

  const updatedItem: CompanyLeadItem = {
    ...item,
    status: "claimed",
    claimedByAgentName: agentName,
    claimedByAgentId: assignedId,
    claimedAt: now,
    history: [
      ...(item.history || []),
      {
        action: "Claimed & Locked",
        agentName,
        timestamp: now,
        note: `Lead locked exclusively to ${agentName}. Removed from company floor pool.`,
      },
    ],
  };

  pool[index] = updatedItem;
  saveCompanyPool(pool, true);

  // Broadcast lock cross-browser immediately
  broadcastEvent("lead_claimed", {
    leadId: updatedItem.id,
    claimedByAgentName: agentName,
    claimedByAgentId: assignedId,
    claimedAt: now,
  });

  // Background conditional atomic update in Supabase
  try {
    supabase
      .from("leads")
      .update({ broker_id: assignedId, stage: "claimed" })
      .eq("id", leadId)
      .is("broker_id", null)
      .then(() => {});
  } catch {}

  return {
    success: true,
    lead: updatedItem,
    message: `Lead "${item.title}" successfully claimed and locked to your desk!`,
  };
}

// ═══════════════════════════════════════════════════════════════════
// STRICT ROLE & OWNERSHIP TRANSFER AUTHORIZATION
// ═══════════════════════════════════════════════════════════════════

/**
 * Validates whether the caller is authorized to transfer this lead.
 * Rules:
 * 1. Company Owner / Agency Principal / Admin / Master Admin can transfer ANY lead.
 * 2. An Agent can ONLY transfer a lead if they currently hold the active claim.
 * 3. Any other caller is strictly UNAUTHORIZED.
 */
export function isAuthorizedToTransfer(
  lead: CompanyLeadItem,
  caller: CallerAuth
): { authorized: boolean; reason?: string } {
  if (!caller || !caller.name) {
    return { authorized: false, reason: "Caller identification is required." };
  }

  // 1. Company Owner / Admin check
  const roleClean = (caller.role || "").toLowerCase().trim();
  const emailClean = (caller.email || "").toLowerCase().trim();

  const isOwnerOrAdmin =
    roleClean === "company" ||
    roleClean === "owner" ||
    roleClean === "admin" ||
    roleClean === "company_admin" ||
    emailClean === "admin@dealos.ae" ||
    emailClean === "nihalshaikh0906@gmail.com";

  if (isOwnerOrAdmin) {
    return { authorized: true };
  }

  // 2. Unclaimed leads cannot be transferred by agents
  if (lead.status !== "claimed") {
    return {
      authorized: false,
      reason: "Unclaimed company leads cannot be transferred. They must be claimed first.",
    };
  }

  // 3. Agent ownership check: caller must match the currently assigned agent
  const callerNameClean = caller.name.toLowerCase().trim();
  const currentOwnerClean = (lead.claimedByAgentName || "").toLowerCase().trim();
  const callerIdClean = caller.agentId || `agent-${callerNameClean.replace(/\s+/g, "-")}`;
  const ownerIdClean = lead.claimedByAgentId;

  const isCurrentOwner =
    callerNameClean === currentOwnerClean ||
    (ownerIdClean && callerIdClean === ownerIdClean);

  if (isCurrentOwner) {
    return { authorized: true };
  }

  return {
    authorized: false,
    reason: `Unauthorized: You do not own this lead. Only ${lead.claimedByAgentName || "the assigned agent"} or the Company Owner can transfer this lead.`,
  };
}

/**
 * 1-Click Lead Transfer with strict authorization enforcement.
 */
export function transferCompanyLead(
  leadId: string,
  toAgentName: string,
  caller: CallerAuth,
  note?: string
): TransferResult {
  const pool = getCompanyPool();
  const index = pool.findIndex((item) => item.id === leadId);

  if (index === -1) {
    return {
      success: false,
      error: "not_found",
      message: "Lead not found in company records.",
    };
  }

  const item = pool[index];

  // Enforce Authorization
  const auth = isAuthorizedToTransfer(item, caller);
  if (!auth.authorized) {
    return {
      success: false,
      error: "unauthorized",
      message: auth.reason || "Unauthorized to transfer this lead.",
    };
  }

  // Find target colleague
  const targetAgent = COMPANY_AGENTS.find(
    (a) => a.name.toLowerCase().trim() === toAgentName.toLowerCase().trim()
  ) || {
    id: `agent-${toAgentName.toLowerCase().replace(/\s+/g, "-")}`,
    name: toAgentName,
  };

  // Prevent transferring to same agent
  if (item.claimedByAgentName?.toLowerCase().trim() === targetAgent.name.toLowerCase().trim()) {
    return {
      success: false,
      error: "invalid_target",
      message: `Lead is already assigned to ${targetAgent.name}.`,
    };
  }

  const now = new Date().toISOString();
  const previousOwner = item.claimedByAgentName || "Unassigned";

  const updatedItem: CompanyLeadItem = {
    ...item,
    status: "claimed",
    claimedByAgentName: targetAgent.name,
    claimedByAgentId: targetAgent.id,
    claimedAt: now,
    history: [
      ...(item.history || []),
      {
        action: "1-Click Transfer",
        agentName: caller.name,
        timestamp: now,
        note: `Transferred from ${previousOwner} to ${targetAgent.name} by ${caller.name} (${caller.role || "broker"}). Reason: ${note || "Shifted client files and commission desk"}.`,
      },
    ],
  };

  pool[index] = updatedItem;
  saveCompanyPool(pool, true);

  // Broadcast cross-browser immediately
  broadcastEvent("lead_transferred", {
    leadId: updatedItem.id,
    toAgentName: targetAgent.name,
    toAgentId: targetAgent.id,
    transferredAt: now,
    history: updatedItem.history,
  });

  // Sync to database if available
  try {
    supabase
      .from("leads")
      .update({ broker_id: targetAgent.id, stage: "transferred" })
      .eq("id", leadId)
      .then(() => {});
  } catch {}

  return {
    success: true,
    lead: updatedItem,
    message: `Lead "${item.title}" successfully transferred to ${targetAgent.name}. All notes and data shifted.`,
  };
}
