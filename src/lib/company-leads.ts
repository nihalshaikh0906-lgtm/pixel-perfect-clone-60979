/**
 * Company Lead & Property Import and Distribution System
 * Enables Company Owners to import leads and properties into the company pool.
 * All company agents see unclaimed leads. When any agent claims or acts on one,
 * it disappears from other agents' pool and moves to the claiming agent's leads section,
 * tagged with "Company Lead" and support for 1-click agent transfer.
 */

export interface CompanyLeadItem {
  id: string;
  type: "lead" | "property";
  title: string; // Client name or Property title
  phone: string;
  email: string;
  budgetOrPrice: string; // e.g. "AED 3,850,000"
  location: string; // e.g. "Dubai Marina", "Palm Jumeirah"
  details: string; // e.g. "Looking for 2BR luxury apartment with canal view"
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

export function getCompanyPool(): CompanyLeadItem[] {
  if (typeof window === "undefined") return INITIAL_COMPANY_POOL;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_COMPANY_POOL));
      return INITIAL_COMPANY_POOL;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_COMPANY_POOL;
  }
}

export function saveCompanyPool(items: CompanyLeadItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event("dealos_company_pool_updated"));
  } catch (err) {
    console.error("Failed to save company leads pool:", err);
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
  return pool.filter(
    (item) =>
      item.status === "claimed" &&
      (item.claimedByAgentName?.toLowerCase().includes(agentName.toLowerCase()) ||
        item.claimedByAgentId === agentName)
  );
}

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
        note: "Added to company lead box for broker action.",
      },
    ],
  };

  const pool = getCompanyPool();
  const updated = [newItem, ...pool];
  saveCompanyPool(updated);
  return newItem;
}

/**
 * Claims a company lead for an agent.
 * Instantly removes it from all other agents' unclaimed pool
 * and attributes it exclusively to the claiming agent.
 */
export function claimCompanyLead(leadId: string, agentName: string, agentId?: string): CompanyLeadItem | null {
  const pool = getCompanyPool();
  const index = pool.findIndex((item) => item.id === leadId);
  if (index === -1) return null;

  const item = pool[index];
  if (item.status === "claimed") {
    // Already claimed by another agent
    return item;
  }

  const updatedItem: CompanyLeadItem = {
    ...item,
    status: "claimed",
    claimedByAgentName: agentName,
    claimedByAgentId: agentId || `agent-${agentName.toLowerCase().replace(/\s+/g, "-")}`,
    claimedAt: new Date().toISOString(),
    history: [
      ...(item.history || []),
      {
        action: "Claimed & Action Taken",
        agentName,
        timestamp: new Date().toISOString(),
        note: `Lead locked exclusively to ${agentName}. Removed from general company leadbox.`,
      },
    ],
  };

  pool[index] = updatedItem;
  saveCompanyPool(pool);
  return updatedItem;
}

/**
 * 1-Click Lead Transfer:
 * Moves the company lead and all its data, history, and notes
 * from one agent to another agent in the company.
 */
export function transferCompanyLead(leadId: string, fromAgentName: string, toAgentName: string): CompanyLeadItem | null {
  const pool = getCompanyPool();
  const index = pool.findIndex((item) => item.id === leadId);
  if (index === -1) return null;

  const item = pool[index];
  const targetAgent = COMPANY_AGENTS.find((a) => a.name.toLowerCase() === toAgentName.toLowerCase()) || {
    id: `agent-${toAgentName.toLowerCase().replace(/\s+/g, "-")}`,
    name: toAgentName,
  };

  const updatedItem: CompanyLeadItem = {
    ...item,
    status: "claimed",
    claimedByAgentName: targetAgent.name,
    claimedByAgentId: targetAgent.id,
    claimedAt: new Date().toISOString(),
    history: [
      ...(item.history || []),
      {
        action: "1-Click Transfer",
        agentName: fromAgentName,
        timestamp: new Date().toISOString(),
        note: `Transferred lead ownership from ${fromAgentName} to ${targetAgent.name}. All notes & data shifted.`,
      },
    ],
  };

  pool[index] = updatedItem;
  saveCompanyPool(pool);
  return updatedItem;
}
