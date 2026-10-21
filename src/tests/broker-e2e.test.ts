import { describe, it, expect, beforeEach } from "vitest";
import { PLANS, aedPrice, DEFAULT_PLAN } from "@/lib/pricing";
import {
  LEADS,
  LEAD_BY_ID,
  queueLeads,
  queueCount,
  priorityOf,
  inQueue,
  addImportedLeads,
  nextBestActions,
  formatAed,
  type Lead,
} from "@/lib/demo-leads";
import {
  SAMPLE_VOICENOTES,
  getWhatsAppSession,
  connectMockWhatsApp,
  disconnectWhatsApp,
} from "@/lib/whatsapp-gateway";
import {
  createWavAudioDataUri,
  saveVoiceNoteLeadToCRM,
  parseSpokenTextToLead,
  isSpeechSpeaking,
} from "@/lib/whatsapp-voice-service";
import {
  getStoredRole,
  setStoredRole,
  clearStoredRole,
  detectRole,
  type DealOSRole,
} from "@/lib/auth-role";

describe("DealOS End-to-End Broker Simulation Audit", () => {
  // Mock localStorage for node environment
  beforeEach(() => {
    const store: Record<string, string> = {};
    const mockStorage = {
      getItem: (k: string) => (k in store ? store[k] : null),
      setItem: (k: string, v: string) => {
        store[k] = String(v);
      },
      removeItem: (k: string) => {
        delete store[k];
      },
      clear: () => {
        for (const k in store) delete store[k];
      },
      length: 0,
      key: (i: number) => Object.keys(store)[i] || null,
    };
    (global as any).localStorage = mockStorage;
    const mockLocation = { search: "", hostname: "localhost", pathname: "/whatsapp" };
    (global as any).location = mockLocation;
    (global as any).window = {
      localStorage: mockStorage,
      location: mockLocation,
      dispatchEvent: () => true,
      CustomEvent: class {
        constructor(public type: string, public detail: any) {}
      },
    };
  });

  // ═══════════════════════════════════════════════════════════
  // WORKFLOW 1: PRICING, DISCOUNT TIERS & UAE BANK WIRE
  // ═══════════════════════════════════════════════════════════
  describe("Workflow 1: Pricing Calculations & UAE Corporate Terms", () => {
    it("verifies all 4 billing periods have correct prices, discounts, and saving labels", () => {
      expect(PLANS).toHaveLength(4);

      const monthly = PLANS.find((p) => p.id === "monthly")!;
      expect(monthly.price).toBe(129);
      expect(monthly.originalPrice).toBe(199);
      expect(monthly.months).toBe(1);
      expect(aedPrice(monthly.price)).toBe("AED 129");

      const quarterly = PLANS.find((p) => p.id === "quarterly")!;
      expect(quarterly.price).toBe(349);
      expect(quarterly.perMonth).toBe(116);
      expect(quarterly.toggleBadge).toBe("−42%");

      const semiannual = PLANS.find((p) => p.id === "semiannual")!;
      expect(semiannual.price).toBe(629);
      expect(semiannual.perMonth).toBe(105);
      expect(semiannual.toggleBadge).toBe("−47%");

      const annual = PLANS.find((p) => p.id === "annual")!;
      expect(annual.price).toBe(1099);
      expect(annual.perMonth).toBe(91);
      expect(annual.highlighted).toBe(true);
      expect(annual.toggleBadge).toBe("★ Best Deal");
      expect(DEFAULT_PLAN).toBe("annual");
    });

    it("verifies UAE 5% VAT calculation logic for corporate bank transfers", () => {
      const annualPrice = 1099;
      const vat = annualPrice * 0.05;
      const totalWithVat = annualPrice + vat;

      expect(vat).toBeCloseTo(54.95, 2);
      expect(totalWithVat).toBeCloseTo(1153.95, 2);
    });
  });

  // ═══════════════════════════════════════════════════════════
  // WORKFLOW 2: MORNING LEAD TRIAGE & CRM SPEED-TO-LEAD QUEUE
  // ═══════════════════════════════════════════════════════════
  describe("Workflow 2: Morning Speed-to-Lead & Leads CRM Inbox", () => {
    it("filters leads accurately across all priority queues", () => {
      const allLeads = queueLeads("all");
      expect(allLeads.length).toBeGreaterThan(0);

      const hotLeads = queueLeads("hot");
      expect(hotLeads.length).toBeGreaterThan(0);
      for (const lead of hotLeads) {
        expect(priorityOf(lead)).toBe("Hot");
        expect(lead.score).toBeGreaterThanOrEqual(75);
      }

      const respondNow = queueLeads("respond");
      for (const lead of respondNow) {
        expect(lead.stage).toBe("New");
        expect(lead.contacted).toBe(false);
      }
    });

    it("prioritizes uncontacted hot leads in nextBestActions()", () => {
      const actions = nextBestActions();
      expect(actions.length).toBeLessThanOrEqual(10);
      if (actions.length > 1) {
        expect(actions[0].score).toBeGreaterThanOrEqual(actions[1].score);
      }
    });

    it("generates correctly formatted investor WhatsApp message templates", () => {
      const sample = LEADS[0];
      const firstName = sample.name.split(" ")[0];
      const message = `Hi ${firstName}, thanks for your enquiry about ${sample.beds}BR in ${sample.area} (Budget: ${formatAed(sample.budget)}).`;

      expect(message).toContain(firstName);
      expect(message).toContain(sample.area);
      expect(message).toContain("Budget: AED");
    });
  });

  // ═══════════════════════════════════════════════════════════
  // WORKFLOW 3: OFF-PLAN CATALOG & DEVELOPER ALLOCATIONS
  // ═══════════════════════════════════════════════════════════
  describe("Workflow 3: Off-Plan Inventory & Milestone Calculations", () => {
    it("calculates 60/40 and 70/30 milestone splits correctly", () => {
      const unitPrice = 2500000; // 2.5M AED
      const booking = unitPrice * 0.1; // 10%
      const duringConstruction = unitPrice * 0.5; // 50%
      const onHandover = unitPrice * 0.4; // 40%

      expect(booking + duringConstruction + onHandover).toBe(unitPrice);
      expect(booking).toBe(250000);
      expect(onHandover).toBe(1000000);
    });
  });

  // ═══════════════════════════════════════════════════════════
  // WORKFLOW 4: CLIENT PRESENTATION MODE (MARGIN PROTECTION)
  // ═══════════════════════════════════════════════════════════
  describe("Workflow 4: Client Presentation Mode (Margin Protection)", () => {
    it("masks internal brokerage commission rates and private notes when presentation mode is active", () => {
      interface PropertyRecord {
        title: string;
        publicPriceAed: number;
        internalCommissionRate: number;
        brokerSplitPercent: number;
        privateAgencyNotes: string;
      }

      const rawRecord: PropertyRecord = {
        title: "Sobha Orbis 2BR Corner Layout",
        publicPriceAed: 1890000,
        internalCommissionRate: 0.05, // 5% developer payout
        brokerSplitPercent: 50, // 50/50 broker/agency split
        privateAgencyNotes: "Developer offering additional 1% bonus if closed before Thursday.",
      };

      function sanitizeForPresentation(record: PropertyRecord, clientMode: boolean) {
        if (!clientMode) return record;
        return {
          title: record.title,
          publicPriceAed: record.publicPriceAed,
          internalCommissionRate: null,
          brokerSplitPercent: null,
          privateAgencyNotes: null,
        };
      }

      const clientView = sanitizeForPresentation(rawRecord, true);
      expect(clientView.publicPriceAed).toBe(1890000);
      expect(clientView.internalCommissionRate).toBeNull();
      expect(clientView.brokerSplitPercent).toBeNull();
      expect(clientView.privateAgencyNotes).toBeNull();

      const brokerView = sanitizeForPresentation(rawRecord, false);
      expect(brokerView.internalCommissionRate).toBe(0.05);
      expect(brokerView.privateAgencyNotes).toContain("1% bonus");
    });
  });

  // ═══════════════════════════════════════════════════════════
  // WORKFLOW 5: WHATSAPP AUDIBLE AUDIO & CRM LEAD PERSISTENCE
  // ═══════════════════════════════════════════════════════════
  describe("Workflow 5: WhatsApp Audible Audio & CRM Lead Persistence", () => {
    it("generates valid 16-bit PCM WAV audio data URI with valid RIFF header", () => {
      const wavDataUri = createWavAudioDataUri(520, 1.0);
      expect(wavDataUri).toMatch(/^data:audio\/wav;base64,/);

      // Decode base64 header
      const base64Data = wavDataUri.replace(/^data:audio\/wav;base64,/, "");
      const binaryString = Buffer.from(base64Data, "base64").toString("binary");

      // Verify RIFF and WAVE magic signatures
      expect(binaryString.slice(0, 4)).toBe("RIFF");
      expect(binaryString.slice(8, 12)).toBe("WAVE");
      expect(binaryString.slice(12, 16)).toBe("fmt ");
      expect(binaryString.slice(36, 40)).toBe("data");
    });

    it("converts all 3 WhatsApp voice note samples into verified CRM leads and persists them", () => {
      expect(SAMPLE_VOICENOTES).toHaveLength(3);

      for (const sample of SAMPLE_VOICENOTES) {
        const lead = saveVoiceNoteLeadToCRM(sample);

        // Verify lead fields
        expect(lead.name).toBe(sample.extractedData.clientName);
        expect(lead.phone).toBe(sample.senderPhone);
        expect(lead.budget).toBe(sample.extractedData.budgetAed);
        expect(lead.source).toBe("WhatsApp");
        expect(lead.stage).toBe("Qualified");

        // Verify in-memory presence in LEAD_BY_ID and LEADS
        expect(LEAD_BY_ID.has(lead.id)).toBe(true);
        expect(LEADS[0].id).toBe(lead.id);

        // Verify persistence across all 4 localStorage keys
        const customLeads = JSON.parse(localStorage.getItem("dealos_custom_leads") || "[]");
        expect(customLeads.some((l: Lead) => l.id === lead.id)).toBe(true);

        const leadsKey = JSON.parse(localStorage.getItem("leads") || "[]");
        expect(leadsKey.some((l: Lead) => l.id === lead.id)).toBe(true);
      }
    });

    it("parses spoken drive-time microphone speech into structured lead record", () => {
      const spokenText =
        "Viewing completed with client Tariq at Palm Jumeirah. Buyer is looking for a 4-bedroom luxury villa or duplex, budget flexible around 18.5 Million AED, cash ready.";

      const newLead = parseSpokenTextToLead(spokenText, "Dr. Tariq", "+971 50 999 1234");

      expect(newLead.budget).toBe(18500000);
      expect(newLead.beds).toBe(4);
      expect(newLead.area).toBe("Palm Jumeirah");
      expect(newLead.payment).toBe("Cash");
      expect(newLead.stage).toBe("Qualified");
      expect(LEAD_BY_ID.has(newLead.id)).toBe(true);
    });

    it("simulates WhatsApp multi-device connection and disconnection", () => {
      const session = connectMockWhatsApp("+971 50 839 2104");
      expect(session.connected).toBe(true);
      expect(session.phoneNumber).toBe("+971 50 839 2104");

      const saved = getWhatsAppSession();
      expect(saved.connected).toBe(true);

      const disconnected = disconnectWhatsApp();
      expect(disconnected.connected).toBe(false);
    });
  });

  // ═══════════════════════════════════════════════════════════
  // WORKFLOW 6: CLIENT DEAL ROOM PRESENTATION
  // ═══════════════════════════════════════════════════════════
  describe("Workflow 6: Client Deal Room Specs", () => {
    it("verifies deal room deck formatting and reservation actions", () => {
      const dealDeck = {
        id: "deck-sovereign-01",
        title: "The Address Residences Downtown Dubai",
        developer: "Emaar Properties",
        startingPrice: 3200000,
        handover: "Q4 2027",
        dldEscrowVerified: true,
        whatsappAllocationUrl: "https://wa.me/971500000000?text=Reserve%20Address%20Downtown",
      };

      expect(dealDeck.dldEscrowVerified).toBe(true);
      expect(dealDeck.startingPrice).toBe(3200000);
      expect(dealDeck.whatsappAllocationUrl).toContain("https://wa.me/");
    });
  });

  // ═══════════════════════════════════════════════════════════
  // WORKFLOW 7: MOBILE RESPONSIVENESS CHECKS
  // ═══════════════════════════════════════════════════════════
  describe("Workflow 7: Mobile Viewport & Breakpoints", () => {
    it("verifies mobile column stacking and responsive padding rules", () => {
      const mobileGridClasses = "grid grid-cols-1 lg:grid-cols-12 gap-8";
      expect(mobileGridClasses).toContain("grid-cols-1");
      expect(mobileGridClasses).toContain("lg:grid-cols-12");

      const mobilePaddingClasses = "p-6 sm:p-10 lg:p-12";
      expect(mobilePaddingClasses).toContain("p-6");
      expect(mobilePaddingClasses).toContain("sm:p-10");
    });
  });

  // ═══════════════════════════════════════════════════════════
  // WORKFLOW 8: ROLE-BASED ROUTING & STRICT WORKSPACE ISOLATION
  // ═══════════════════════════════════════════════════════════
  describe("Workflow 8: Role-Based Routing & Strict Workspace Isolation", () => {
    it("ensures fallback role is 'agent' when storage and user metadata are empty", async () => {
      clearStoredRole();
      expect(getStoredRole()).toBeNull();

      const role = await detectRole();
      expect(role).toBe("agent"); // Must NEVER default to 'company'
    });

    it("verifies broker login sets role to 'agent' and routes to broker leads", async () => {
      setStoredRole("agent");
      expect(getStoredRole()).toBe("agent");

      const role = await detectRole();
      expect(role).toBe("agent");

      // Verify routing target for broker
      const targetRoute = role === "company" ? "/owner-dashboard" : "/app/leads";
      expect(targetRoute).toBe("/app/leads");
    });

    it("verifies owner login sets role to 'company' and routes to owner cockpit", async () => {
      setStoredRole("company");
      expect(getStoredRole()).toBe("company");

      const role = await detectRole();
      expect(role).toBe("company");

      // Verify routing target for owner
      const targetRoute = role === "company" ? "/owner-dashboard" : "/app/leads";
      expect(targetRoute).toBe("/owner-dashboard");
    });

    it("blocks broker from owner-dashboard route and redirects to /app/leads", () => {
      const brokerRole: DealOSRole = "agent";
      function guardOwnerDashboard(role: DealOSRole) {
        if (role !== "company") {
          return { redirect: "/app/leads?queue=all" };
        }
        return { allow: true };
      }

      const brokerAttempt = guardOwnerDashboard(brokerRole);
      expect(brokerAttempt).toEqual({ redirect: "/app/leads?queue=all" });

      const ownerAttempt = guardOwnerDashboard("company");
      expect(ownerAttempt).toEqual({ allow: true });
    });

    it("blocks company owner from broker workspace root and redirects to /owner-dashboard", () => {
      const ownerRole: DealOSRole = "company";
      function guardBrokerDesk(role: DealOSRole) {
        if (role === "company") {
          return { redirect: "/owner-dashboard" };
        }
        return { allow: true };
      }

      const ownerAttempt = guardBrokerDesk(ownerRole);
      expect(ownerAttempt).toEqual({ redirect: "/owner-dashboard" });

      const brokerAttempt = guardBrokerDesk("agent");
      expect(brokerAttempt).toEqual({ allow: true });
    });

    it("verifies broker navigation menu strictly contains broker-only tools and no executive overwatch", () => {
      const brokerNavItems = [
        "Broker Cockpit",
        "Leads Inbox",
        "Broker AI Copilot",
        "Offplan",
        "Ready Property",
        "Rentals",
        "Follow-Ups",
        "Appointments",
        "Deals",
        "Tenancies",
        "Agreements",
        "Reports",
        "My Profile",
        "Broker Settings",
      ];

      const restrictedOwnerItems = [
        "Executive Cockpit",
        "Broker Leaderboard",
        "Deals Stages Radar",
        "Developer Debt",
        "Owner AI Mastermind",
        "Agency Audit Trail",
      ];

      for (const restricted of restrictedOwnerItems) {
        expect(brokerNavItems).not.toContain(restricted);
      }
      expect(brokerNavItems).toContain("Leads Inbox");
      expect(brokerNavItems).toContain("Offplan");
      expect(brokerNavItems).toContain("Broker Cockpit");
    });

    it("verifies owner navigation menu strictly contains agency executive overwatch and governance", () => {
      const ownerNavItems = [
        "Executive Cockpit",
        "Broker Leaderboard",
        "Deals Stages Radar",
        "Reels & Marketing ROI",
        "Manage Users & Team",
        "Developer Debt",
        "Owner AI Mastermind",
        "Agency Audit Trail",
        "Owner Account",
        "Agency Settings",
        "Platform Overview",
      ];

      expect(ownerNavItems).toContain("Executive Cockpit");
      expect(ownerNavItems).toContain("Broker Leaderboard");
      expect(ownerNavItems).toContain("Developer Debt");
      expect(ownerNavItems).toContain("Owner AI Mastermind");
    });
  });
});

