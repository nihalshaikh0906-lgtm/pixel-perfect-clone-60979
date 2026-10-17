import { describe, it, expect } from "vitest";
import {
  searchUnits,
  getMarketMedian,
  getLeadBrief,
  calculatePaymentPlan,
  UnitRecord,
  LeadRecord,
} from "./tools.server";

describe("src/ai/tools.server.ts - Multi-Tenancy, Privacy & Regulatory Rules", () => {
  const companyAContext = { orgId: "org_alpha", userId: "user_a1" };
  const companyBContext = { orgId: "org_beta", userId: "user_b1" };

  describe("Multi-Tenant Isolation", () => {
    const mockInventory: UnitRecord[] = [
      {
        id: "public_1",
        project_id: "p1",
        project_name: "Public Project",
        price_aed: 1500000,
        bedrooms: 1,
        location: "Business Bay",
        is_private: false,
      },
      {
        id: "private_alpha",
        project_id: "p2",
        project_name: "Exclusive Off-Market Penthouse",
        price_aed: 5000000,
        bedrooms: 3,
        location: "Downtown Dubai",
        is_private: true,
        org_id: "org_alpha",
      },
      {
        id: "private_beta",
        project_id: "p3",
        project_name: "Secret Luxury Villa",
        price_aed: 12000000,
        bedrooms: 5,
        location: "Palm Jumeirah",
        is_private: true,
        org_id: "org_beta",
      },
    ];

    it("ensures Company A can never read Company B's private inventory", async () => {
      // Company A searches inventory
      const resA = await searchUnits(
        { inventory: mockInventory, budget_max: 20000000 },
        companyAContext,
      );

      const returnedIdsA = resA.units.map((u) => u.id);
      expect(returnedIdsA).toContain("public_1");
      expect(returnedIdsA).toContain("private_alpha");
      expect(returnedIdsA).not.toContain("private_beta"); // Company B's private unit is hidden!

      // Company B searches inventory
      const resB = await searchUnits(
        { inventory: mockInventory, budget_max: 20000000 },
        companyBContext,
      );

      const returnedIdsB = resB.units.map((u) => u.id);
      expect(returnedIdsB).toContain("public_1");
      expect(returnedIdsB).toContain("private_beta");
      expect(returnedIdsB).not.toContain("private_alpha"); // Company A's private unit is hidden!
    });

    it("ensures Company A can NEVER read Company B's lead data through getLeadBrief", async () => {
      const mockLeads: Record<string, LeadRecord> = {
        lead_alpha: {
          id: "lead_alpha",
          org_id: "org_alpha",
          name: "Alpha VIP Buyer",
          phone: "+971501111111",
          email: "alpha@buyer.com",
          passport_number: "PA123456",
          budget_min_aed: 3000000,
          budget_max_aed: 6000000,
        },
        lead_beta: {
          id: "lead_beta",
          org_id: "org_beta",
          name: "Beta High Net Worth",
          phone: "+971502222222",
          email: "beta@investor.com",
          passport_number: "PB987654",
          budget_min_aed: 10000000,
          budget_max_aed: 25000000,
        },
      };

      const leadProvider = (id: string) => mockLeads[id] ?? null;

      // Company A reading their own lead -> Succeeds
      const leadA = await getLeadBrief(
        { lead_id: "lead_alpha", lead_provider: leadProvider },
        companyAContext,
      );
      expect(leadA.name).toBe("Alpha VIP Buyer");

      // Company A attempting to read Company B's lead -> Strictly Throws Access Denied
      await expect(
        getLeadBrief(
          { lead_id: "lead_beta", lead_provider: leadProvider },
          companyAContext,
        ),
      ).rejects.toThrow("Access denied: Lead belongs to another organization.");
    });
  });

  describe("Lead PII Protection", () => {
    it("ensures the model never receives unnecessary personal lead data (phone, email, passport)", async () => {
      const mockLead: LeadRecord = {
        id: "lead_999",
        org_id: "org_alpha",
        name: "Confidential Client",
        phone: "+971559998877",
        email: "confidential@secret.com",
        passport_number: "X98765432",
        budget_min_aed: 4000000,
        budget_max_aed: 8000000,
        preferred_bedrooms: 3,
        preferred_areas: ["Downtown"],
        purpose: "Capital Appreciation",
      };

      const result = await getLeadBrief(
        { lead_id: "lead_999", lead_provider: () => mockLead },
        companyAContext,
      );

      // Model receives operational criteria
      expect(result.id).toBe("lead_999");
      expect(result.name).toBe("Confidential Client");
      expect(result.budget_min_aed).toBe(4000000);
      expect(result.budget_max_aed).toBe(8000000);
      expect(result.preferred_bedrooms).toBe(3);
      expect(result.preferred_areas).toEqual(["Downtown"]);
      expect(result.purpose).toBe("Capital Appreciation");

      // Model NEVER receives sensitive contact/ID data
      expect(result.phone).toBeUndefined();
      expect(result.email).toBeUndefined();
      expect(result.passport_number).toBeUndefined();
    });
  });

  describe("N >= 5 Rule for Ejari Medians", () => {
    it("refuses to quote a median when contract count N < 5", async () => {
      // Mock provider returning only 3 contracts
      const lowDataProvider = () => ({ count: 3, median_rent: 75000 });

      const result = await getMarketMedian(
        { community: "Creek Bay", bedrooms: 2, data_provider: lowDataProvider },
        companyAContext,
      );

      expect(result.meets_sample_threshold).toBe(false);
      expect(result.median_rent_aed).toBeNull();
      expect(result.disclaimer).toContain("minimum 5 required");
      expect(result.disclaimer).toContain("found 3");
    });

    it("successfully returns median when contract count N >= 5", async () => {
      // Mock provider returning 25 contracts
      const validDataProvider = () => ({ count: 25, median_rent: 110000 });

      const result = await getMarketMedian(
        { community: "Business Bay", bedrooms: 1, data_provider: validDataProvider },
        companyAContext,
      );

      expect(result.meets_sample_threshold).toBe(true);
      expect(result.median_rent_aed).toBe(110000);
      expect(result.contract_count).toBe(25);
      expect(result.source).toContain("n = 25");
    });
  });

  describe("Payment Plan Milestone Calculation", () => {
    it("calculates accurate milestones with DLD 4% without financial advice", () => {
      const plan = calculatePaymentPlan(
        {
          total_price_aed: 2000000,
          down_payment_pct: 20,
          construction_pct: 40,
          handover_pct: 40,
        },
        companyAContext,
      );

      expect(plan.breakdown.down_payment_aed).toBe(400000);
      expect(plan.breakdown.construction_installments_aed).toBe(800000);
      expect(plan.breakdown.handover_aed).toBe(800000);
      expect(plan.breakdown.estimated_dld_4pct_aed).toBe(80000);
      expect(plan.note).toContain("Subject to official SPA execution");
    });
  });
});
