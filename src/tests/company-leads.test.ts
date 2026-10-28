import { describe, it, expect, beforeEach } from "vitest";
import {
  getCompanyPool,
  saveCompanyPool,
  getUnclaimedCompanyPool,
  getAgentClaimedCompanyLeads,
  addCompanyLeadOrProperty,
  claimCompanyLead,
  transferCompanyLead,
  isAuthorizedToTransfer,
  COMPANY_AGENTS,
} from "@/lib/company-leads";

describe("Company Leads & Exclusive Property Distribution System", () => {
  beforeEach(() => {
    let store: Record<string, string> = {};
    const mockStorage = {
      getItem: (k: string) => (k in store ? store[k] : null),
      setItem: (k: string, v: string) => {
        store[k] = String(v);
      },
      removeItem: (k: string) => {
        delete store[k];
      },
      clear: () => {
        store = {};
      },
    };
    // @ts-expect-error mock window and localStorage
    globalThis.localStorage = mockStorage;
    // @ts-expect-error mock window
    globalThis.window = {
      dispatchEvent: () => true,
      addEventListener: () => {},
      removeEventListener: () => {},
    };
    mockStorage.clear();
  });

  it("seeds default company pool if empty", () => {
    const pool = getCompanyPool();
    expect(pool.length).toBeGreaterThanOrEqual(3);
    const unclaimed = getUnclaimedCompanyPool();
    expect(unclaimed.length).toBeGreaterThanOrEqual(2);
  });

  it("allows owner to import a new client lead and broadcasts", () => {
    const newLead = addCompanyLeadOrProperty({
      type: "lead",
      title: "H.E. Rashid Al Maktoum Family Office",
      phone: "+971501234567",
      email: "rashid@office.ae",
      location: "Palm Jumeirah",
      budgetOrPrice: "AED 45,000,000",
      category: "Ultra-HNWI",
      details: "Looking for prime beachfront plot or villa.",
    });

    expect(newLead.id).toBeDefined();
    expect(newLead.claimedByAgentName).toBeUndefined();
    expect(newLead.status).toBe("unclaimed");

    const unclaimed = getUnclaimedCompanyPool();
    const found = unclaimed.find((l) => l.id === newLead.id);
    expect(found).toBeDefined();
    expect(found?.title).toBe("H.E. Rashid Al Maktoum Family Office");
  });

  it("allows owner to import a new exclusive landlord property", () => {
    const newProp = addCompanyLeadOrProperty({
      type: "property",
      title: "Penthouse at Il Primo, Downtown",
      phone: "+971529876543",
      email: "farooq@penthouse.ae",
      location: "Downtown Dubai",
      budgetOrPrice: "AED 38,000,000",
      category: "Ready Resale",
      details: "Exclusive listing key with concierge.",
    });

    expect(newProp.type).toBe("property");
    expect(newProp.claimedByAgentName).toBeUndefined();

    const unclaimed = getUnclaimedCompanyPool();
    expect(unclaimed.some((p) => p.id === newProp.id)).toBe(true);
  });

  it("agent claims lead: disappears from unclaimed pool and binds to claiming agent", () => {
    const unclaimedBefore = getUnclaimedCompanyPool();
    const targetLead = unclaimedBefore[0];

    const claimRes = claimCompanyLead(targetLead.id, "Tariq Mansoor");
    expect(claimRes.success).toBe(true);
    expect(claimRes.lead?.claimedByAgentName).toBe("Tariq Mansoor");
    expect(claimRes.lead?.status).toBe("claimed");

    // It MUST disappear from unclaimed pool
    const unclaimedAfter = getUnclaimedCompanyPool();
    expect(unclaimedAfter.some((l) => l.id === targetLead.id)).toBe(false);

    // It MUST appear in Tariq's claimed leads with Company Lead badge integrity
    const tariqLeads = getAgentClaimedCompanyLeads("Tariq Mansoor");
    expect(tariqLeads.some((l) => l.id === targetLead.id)).toBe(true);

    // Another agent (Saad Khan) must NOT see it in their claimed leads
    const saadLeads = getAgentClaimedCompanyLeads("Saad Khan");
    expect(saadLeads.some((l) => l.id === targetLead.id)).toBe(false);
  });

  it("duplicate claims fail: when second agent attempts to claim the same lead, claim is rejected", () => {
    const unclaimed = getUnclaimedCompanyPool();
    const targetLead = unclaimed[0];

    // Agent 1 claims first
    const claim1 = claimCompanyLead(targetLead.id, "Tariq Mansoor");
    expect(claim1.success).toBe(true);
    expect(claim1.lead?.claimedByAgentName).toBe("Tariq Mansoor");

    // Agent 2 attempts duplicate claim on the same lead
    const claim2 = claimCompanyLead(targetLead.id, "Saad Khan");
    expect(claim2.success).toBe(false);
    expect(claim2.error).toBe("already_claimed");
    expect(claim2.claimedBy).toBe("Tariq Mansoor");
    expect(claim2.message).toContain("already claimed by Tariq Mansoor");

    // Lead remains strictly locked to Agent 1 (Tariq), not overwritten by Agent 2
    const currentPool = getCompanyPool();
    const lockedLead = currentPool.find((l) => l.id === targetLead.id);
    expect(lockedLead?.claimedByAgentName).toBe("Tariq Mansoor");

    const saadLeads = getAgentClaimedCompanyLeads("Saad Khan");
    expect(saadLeads.some((l) => l.id === targetLead.id)).toBe(false);
  });

  it("transfers reject unauthorized caller: another agent cannot transfer someone else's lead", () => {
    const unclaimed = getUnclaimedCompanyPool();
    const lead = unclaimed[0];
    claimCompanyLead(lead.id, "Tariq Mansoor");

    // Saad Khan (unauthorized agent) attempts to transfer Tariq's lead to Layla
    const unauthorizedCaller = { name: "Saad Khan", role: "agent" };
    const transferRes = transferCompanyLead(lead.id, "Layla Bennett", unauthorizedCaller);

    expect(transferRes.success).toBe(false);
    expect(transferRes.error).toBe("unauthorized");
    expect(transferRes.message).toContain("Unauthorized");

    // Lead remains assigned to Tariq Mansoor
    const pool = getCompanyPool();
    const checkLead = pool.find((l) => l.id === lead.id);
    expect(checkLead?.claimedByAgentName).toBe("Tariq Mansoor");
  });

  it("transfers succeed when authorized: assigned agent can transfer their own lead", () => {
    const unclaimed = getUnclaimedCompanyPool();
    const lead = unclaimed[0];
    claimCompanyLead(lead.id, "Tariq Mansoor");

    // Tariq (the owner of the lead) transfers to Layla Bennett
    const authorizedCaller = { name: "Tariq Mansoor", role: "agent" };
    const transferRes = transferCompanyLead(lead.id, "Layla Bennett", authorizedCaller, "Client prefers Russian speaker");

    expect(transferRes.success).toBe(true);
    expect(transferRes.lead?.claimedByAgentName).toBe("Layla Bennett");
    expect(transferRes.lead?.history?.some((h) => h.note?.includes("Client prefers Russian speaker"))).toBe(true);

    // Tariq no longer has it, Layla now has it
    expect(getAgentClaimedCompanyLeads("Tariq Mansoor").some((l) => l.id === lead.id)).toBe(false);
    expect(getAgentClaimedCompanyLeads("Layla Bennett").some((l) => l.id === lead.id)).toBe(true);
  });

  it("transfers succeed when owner: company owner or admin can reassign any lead", () => {
    const unclaimed = getUnclaimedCompanyPool();
    const lead = unclaimed[0];
    claimCompanyLead(lead.id, "Tariq Mansoor");

    // Company Owner reassigns Tariq's lead to Amina Al Mansoori
    const ownerCaller = { name: "Company Owner", role: "company" };
    const transferRes = transferCompanyLead(lead.id, "Amina Al Mansoori", ownerCaller, "Executive rebalance");

    expect(transferRes.success).toBe(true);
    expect(transferRes.lead?.claimedByAgentName).toBe("Amina Al Mansoori");

    // Amina now has it
    expect(getAgentClaimedCompanyLeads("Amina Al Mansoori").some((l) => l.id === lead.id)).toBe(true);
  });

  it("real lead assignment: assigning lead routes directly to designated broker leadbox", () => {
    // Simulate Owner adding a real lead assigned to Tariq Mansoor
    const lead = addCompanyLeadOrProperty({
      type: "lead",
      title: "Sheikh Ahmed Al-Maktoum",
      phone: "+971501112233",
      email: "ahmed@maktoum.ae",
      location: "Palm Jebel Ali",
      budgetOrPrice: "AED 25,000,000",
      category: "Ultra-HNWI",
      details: "Waterfront signature villa requirement.",
    });

    // Owner assigns to Tariq Mansoor
    const ownerCaller = { name: "Company Owner", role: "company" };
    const assignRes = transferCompanyLead(lead.id, "Tariq Mansoor", ownerCaller, "Direct Owner Delegation");

    expect(assignRes.success).toBe(true);
    expect(assignRes.lead?.claimedByAgentName).toBe("Tariq Mansoor");
    expect(assignRes.lead?.status).toBe("claimed");

    // Must be in Tariq's active claimed desk
    const tariqDesk = getAgentClaimedCompanyLeads("Tariq Mansoor");
    expect(tariqDesk.some((l) => l.id === lead.id)).toBe(true);
  });

  it("unauthorized transfer without caller identity is strictly rejected", () => {
    const unclaimed = getUnclaimedCompanyPool();
    const lead = unclaimed[0];
    claimCompanyLead(lead.id, "Tariq Mansoor");

    // Transfer attempt with empty caller
    // @ts-expect-error test invalid caller
    const invalidRes = transferCompanyLead(lead.id, "Amina Al Mansoori", {});
    expect(invalidRes.success).toBe(false);
    expect(invalidRes.error).toBe("unauthorized");
  });
});
