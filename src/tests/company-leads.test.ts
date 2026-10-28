import { describe, it, expect, beforeEach } from "vitest";
import {
  getCompanyPool,
  saveCompanyPool,
  getUnclaimedCompanyPool,
  getAgentClaimedCompanyLeads,
  addCompanyLeadOrProperty,
  claimCompanyLead,
  transferCompanyLead,
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

  it("allows owner to import a new client lead", () => {
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

    const claimed = claimCompanyLead(targetLead.id, "Tariq Mansoor");
    expect(claimed).not.toBeNull();
    expect(claimed?.claimedByAgentName).toBe("Tariq Mansoor");
    expect(claimed?.status).toBe("claimed");

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

  it("1-click transfers lead to another company agent, shifting data completely", () => {
    const unclaimed = getUnclaimedCompanyPool();
    const lead = unclaimed[0];
    claimCompanyLead(lead.id, "Tariq Mansoor");

    // Transfer from Tariq to Layla Bennett
    const transferred = transferCompanyLead(lead.id, "Tariq Mansoor", "Layla Bennett");
    expect(transferred).not.toBeNull();
    expect(transferred?.claimedByAgentName).toBe("Layla Bennett");
    expect(transferred?.history?.length).toBeGreaterThan(1);
    expect(transferred?.history?.[transferred.history.length - 1].note).toContain("Transferred lead ownership");

    // Tariq no longer has it
    const tariqLeads = getAgentClaimedCompanyLeads("Tariq Mansoor");
    expect(tariqLeads.some((l) => l.id === lead.id)).toBe(false);

    // Layla now has it
    const laylaLeads = getAgentClaimedCompanyLeads("Layla Bennett");
    expect(laylaLeads.some((l) => l.id === lead.id)).toBe(true);
  });
});
