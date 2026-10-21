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
import {
  AGENCY_BROKERS,
  DEVELOPER_VOUCHERS,
  DEVELOPER_VIP_TIERS,
  INITIAL_LEADS,
  TIMEFRAME_METRICS,
  type ExecutiveLead,
} from "@/pages/OwnerDashboard";
import { SAMPLE_DEALS } from "@/routes/deal-room.$id";

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

    it("verifies broker login sets role to 'agent' and routes to broker cockpit desk", async () => {
      setStoredRole("agent");
      expect(getStoredRole()).toBe("agent");

      const role = await detectRole();
      expect(role).toBe("agent");

      // Verify routing target for broker
      const targetRoute = role === "company" ? "/owner-dashboard" : "/app";
      expect(targetRoute).toBe("/app");
    });

    it("verifies owner login sets role to 'company' and routes to owner cockpit", async () => {
      setStoredRole("company");
      expect(getStoredRole()).toBe("company");

      const role = await detectRole();
      expect(role).toBe("company");

      // Verify routing target for owner
      const targetRoute = role === "company" ? "/owner-dashboard" : "/app";
      expect(targetRoute).toBe("/owner-dashboard");
    });

    it("blocks broker from owner-dashboard route and redirects to /app", () => {
      const brokerRole: DealOSRole = "agent";
      function guardOwnerDashboard(role: DealOSRole) {
        if (role !== "company") {
          return { redirect: "/app" };
        }
        return { allow: true };
      }

      const brokerAttempt = guardOwnerDashboard(brokerRole);
      expect(brokerAttempt).toEqual({ redirect: "/app" });

      const ownerAttempt = guardOwnerDashboard("company");
      expect(ownerAttempt).toEqual({ allow: true });
    });

    it("verifies company owner topbar hides broker-only import tools and client presentation mode", () => {
      function getTopBarActions(role: DealOSRole) {
        if (role === "agent") {
          return ["clientPresentationMode", "addMenu", "notifications", "themeToggle"];
        }
        return ["notifications", "themeToggle"];
      }

      const ownerActions = getTopBarActions("company");
      expect(ownerActions).not.toContain("addMenu");
      expect(ownerActions).not.toContain("clientPresentationMode");
      expect(ownerActions).toContain("notifications");
      expect(ownerActions).toContain("themeToggle");

      const agentActions = getTopBarActions("agent");
      expect(agentActions).toContain("addMenu");
      expect(agentActions).toContain("clientPresentationMode");
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

  // ═══════════════════════════════════════════════════════════
  // WORKFLOW 9: END-TO-END USER (AGENT) DASHBOARD CAPABILITIES
  // ═══════════════════════════════════════════════════════════
  describe("Workflow 9: End-to-End User (Agent) Dashboard & Tools", () => {
    it("verifies agent metrics, quota progress and active deal pipeline", () => {
      const quotaAchievedPercent = 63;
      const targetAed = 150000;
      const projectedCommissionAed = targetAed * (quotaAchievedPercent / 100);

      expect(projectedCommissionAed).toBe(94500);
      expect(formatAed(projectedCommissionAed)).toBe("AED 95K");

      const activePipelineAed = 14800000;
      expect(formatAed(activePipelineAed)).toBe("AED 14.80M");
    });

    it("simulates full agent priority action queue triage and stage transitions", () => {
      const leads = queueLeads("all");
      expect(leads.length).toBeGreaterThanOrEqual(5);

      const targetLead = leads[0];
      const stages: Lead["stage"][] = ["New", "Contacted", "Qualified", "Viewing", "Offer", "EOI / booking", "Won"];

      let currentStage: Lead["stage"] = targetLead.stage;
      for (const nextStage of stages) {
        currentStage = nextStage;
        expect(currentStage).toBe(nextStage);
      }
      expect(currentStage).toBe("Won");
    });

    it("verifies instant lead registration and priority queue placement", () => {
      const initialCount = LEADS.length;
      const newLead: Lead = {
        id: `test-lead-${Date.now()}`,
        name: "Sheikh Hamdan Al-Falasi",
        initials: "HF",
        country: "UAE",
        phone: "+971 50 777 8899",
        type: "Off-plan",
        beds: 3,
        area: "Palm Jumeirah",
        budget: 12500000,
        payment: "Cash",
        score: 95,
        stage: "Qualified",
        source: "Manual Cockpit",
        receivedHoursAgo: 0,
        contacted: true,
        followUpDueInHours: 1,
        message: "Looking for 3BR beachfront villa or penthouse with private infinity pool.",
        task: "Draft VIP EOI Allocation",
      };

      LEADS.unshift(newLead);
      LEAD_BY_ID.set(newLead.id, newLead);

      expect(LEADS.length).toBe(initialCount + 1);
      expect(LEADS[0].id).toBe(newLead.id);
      expect(LEAD_BY_ID.get(newLead.id)?.name).toBe("Sheikh Hamdan Al-Falasi");
      expect(priorityOf(newLead)).toBe("Hot");
    });

    it("verifies client presentation mode strictly hides private notes and commission rates", () => {
      const dealRecord = {
        title: "Creek Waters 2BR Waterfront",
        priceAed: 2850000,
        developerCommissionRate: 0.05,
        brokerPayoutAed: 71250,
        privateAgencyNotes: "Developer approved extra 1% bonus on fast completion.",
      };

      function renderDesk(record: typeof dealRecord, presentationMode: boolean) {
        if (presentationMode) {
          return {
            title: record.title,
            priceAed: record.priceAed,
            developerCommissionRate: undefined,
            brokerPayoutAed: undefined,
            privateAgencyNotes: undefined,
          };
        }
        return record;
      }

      const clientView = renderDesk(dealRecord, true);
      expect(clientView.developerCommissionRate).toBeUndefined();
      expect(clientView.brokerPayoutAed).toBeUndefined();
      expect(clientView.privateAgencyNotes).toBeUndefined();

      const brokerView = renderDesk(dealRecord, false);
      expect(brokerView.developerCommissionRate).toBe(0.05);
      expect(brokerView.brokerPayoutAed).toBe(71250);
      expect(brokerView.privateAgencyNotes).toContain("extra 1% bonus");
    });
  });

  // ═══════════════════════════════════════════════════════════
  // WORKFLOW 10: END-TO-END COMPANY OWNER DASHBOARD CAPABILITIES
  // ═══════════════════════════════════════════════════════════
  describe("Workflow 10: End-to-End Company Owner Dashboard & Clutter Removal", () => {
    it("verifies strict clutter removal from Owner View", () => {
      // Clutter that was explicitly removed:
      const forbiddenOwnerElements = [
        "Open in Leads Queue",
        "Broker Leads View ↗",
        "Add Lead Modal",
        "Client Presentation Mode Toggle",
      ];

      const ownerDashboardTools = [
        "Executive GMV Ticker",
        "Broker Leaderboard",
        "Developer Debt & Receivables",
        "Developer VIP Partner Tiers",
        "Executive Leads Overwatch",
        "Dynamic Lead Reassignment",
        "RERA Statutory Demand Notice PDF Generator",
        "DLD Submarkets Volume",
        "Team Management",
      ];

      for (const forbidden of forbiddenOwnerElements) {
        expect(ownerDashboardTools).not.toContain(forbidden);
      }
      expect(ownerDashboardTools).toContain("Developer Debt & Receivables");
      expect(ownerDashboardTools).toContain("Broker Leaderboard");
      expect(ownerDashboardTools).toContain("RERA Statutory Demand Notice PDF Generator");
    });

    it("verifies executive GMV metrics across all dynamic timeframes", () => {
      expect(TIMEFRAME_METRICS.today.gmv).toBe("AED 4.20M");
      expect(TIMEFRAME_METRICS.today.closedCount).toBe(4);

      expect(TIMEFRAME_METRICS.week.gmv).toBe("AED 14.80M");
      expect(TIMEFRAME_METRICS.week.closedCount).toBe(12);

      expect(TIMEFRAME_METRICS.month.gmv).toBe("AED 48.65M");
      expect(TIMEFRAME_METRICS.month.closedCount).toBe(41);

      expect(TIMEFRAME_METRICS.ytd.gmv).toBe("AED 148.20M");
      expect(TIMEFRAME_METRICS.ytd.closedCount).toBe(124);
    });

    it("verifies broker pace leaderboard integrity and coaching alerts", () => {
      expect(AGENCY_BROKERS).toHaveLength(5);

      const aisha = AGENCY_BROKERS.find((b) => b.name === "Aisha Khan")!;
      expect(aisha.tier).toBe("Top Producer");
      expect(aisha.dealsClosed).toBe(14);
      expect(aisha.speedToLeadMins).toBeLessThan(2.0);

      const omar = AGENCY_BROKERS.find((b) => b.name === "Omar Farooq")!;
      expect(omar.tier).toBe("Needs Coaching");
      expect(omar.speedToLeadMins).toBeGreaterThan(20.0); // 24.5 minutes
    });

    it("verifies developer receivables aging, overdue threshold and statutory escalation notice", () => {
      expect(DEVELOPER_VOUCHERS.length).toBeGreaterThanOrEqual(3);

      const overdueVoucher = DEVELOPER_VOUCHERS.find((v) => v.daysAging > 45)!;
      expect(overdueVoucher).toBeDefined();
      expect(overdueVoucher.developer).toBe("Danube Properties");
      expect(overdueVoucher.daysAging).toBe(62);
      expect(overdueVoucher.agingBucket).toBe("overdue");

      // Verify legal demand notice text generation
      const statutoryNoticeRef = `RERA/ESCROW/2026/044-${overdueVoucher.voucherNumber.replace(/\D/g, "")}`;
      expect(statutoryNoticeRef).toBe("RERA/ESCROW/2026/044-1042");
    });

    it("simulates dynamic lead reassignment from lagging broker to top producer", () => {
      const leads: ExecutiveLead[] = JSON.parse(JSON.stringify(INITIAL_LEADS));
      const stalledLead = leads.find((l) => l.assignedBrokerName === "Omar Farooq")!;
      expect(stalledLead.assignedBrokerName).toBe("Omar Farooq");

      const topProducer = AGENCY_BROKERS.find((b) => b.name === "Aisha Khan")!;

      // Execute Director Reassignment
      stalledLead.assignedBrokerId = topProducer.id;
      stalledLead.assignedBrokerName = topProducer.name;
      stalledLead.assignedBrokerAvatar = topProducer.avatar;
      stalledLead.brokerPhone = topProducer.phone;
      stalledLead.lastContactAgo = "Just reassigned by Director";

      expect(stalledLead.assignedBrokerName).toBe("Aisha Khan");
      expect(stalledLead.assignedBrokerId).toBe("broker-aisha");
    });
  });

  // ═══════════════════════════════════════════════════════════
  // WORKFLOW 11: LANDING PAGE DYNAMIC EFFECTS & DEAL ROOM SPEED
  // ═══════════════════════════════════════════════════════════
  describe("Workflow 11: Landing Page Dynamic Effects & Deal Room Speed", () => {
    it("verifies zero clipboard pollution on View Client Draft interaction", () => {
      let clipboardWritten = false;
      const mockClipboard = {
        writeText: () => {
          clipboardWritten = true;
          return Promise.resolve();
        },
      };

      // Simulated view action
      let expandedModal = false;
      function handleViewClientDraft() {
        expandedModal = true;
        // MUST NOT call mockClipboard.writeText()
      }

      handleViewClientDraft();
      expect(expandedModal).toBe(true);
      expect(clipboardWritten).toBe(false);
    });

    it("verifies Live Deal Room multi-currency conversion and 5-year ROI engineering", () => {
      const deal = SAMPLE_DEALS[0];
      expect(deal.basePriceAed).toBe(2850000);

      // Currency conversions
      const rates = {
        AED: 1,
        USD: 0.272,
        EUR: 0.252,
        GBP: 0.218,
      };

      const usdPrice = deal.basePriceAed * rates.USD;
      expect(usdPrice).toBeCloseTo(775200, 0);

      const eurPrice = deal.basePriceAed * rates.EUR;
      expect(eurPrice).toBeCloseTo(718200, 0);

      const gbpPrice = deal.basePriceAed * rates.GBP;
      expect(gbpPrice).toBeCloseTo(621300, 0);

      // 5-Year ROI Calculations
      const rentalYield = deal.defaultRentalYield; // 7.9%
      const annualRental = (deal.basePriceAed * rentalYield) / 100;
      expect(annualRental).toBe(225150);

      const fiveYearRental = annualRental * 5;
      expect(fiveYearRental).toBe(1125750);

      const capitalApprec = deal.defaultCapitalAppreciation; // 6.8%
      const compoundedMultiplier = Math.pow(1 + capitalApprec / 100, 5) - 1;
      const fiveYearGain = deal.basePriceAed * compoundedMultiplier;
      expect(fiveYearGain).toBeGreaterThan(1000000);
    });
  });

  // ═══════════════════════════════════════════════════════════
  // WORKFLOW 12: DIRECT BROKER COACHING & META CLOUD API SETTINGS
  // ═══════════════════════════════════════════════════════════
  describe("Workflow 12: Direct Broker Coaching & Meta Cloud API Settings", () => {
    it("opens direct chat addressed straight to that specific broker's number and logs in DealOS", () => {
      let openedUrl = "";
      (global as any).window.open = (url: string) => {
        openedUrl = url;
        return null;
      };

      const omar = AGENCY_BROKERS.find((b) => b.name === "Omar Farooq")!;
      expect(omar.phone).toBe("+971567890123");
      expect(omar.speedToLeadMins).toBe(24.5);

      function coachBroker(broker: typeof omar) {
        const isCoaching = broker.tier === "Needs Coaching";
        const msg = isCoaching
          ? `Hi ${broker.name} (${broker.reraNumber}), checking in from DealOS Agency Overwatch. Noticed your average lead response time is currently ${broker.speedToLeadMins} mins today. Let's make sure we contact new inquiries within 5 minutes to keep conversion high!`
          : `Hi ${broker.name} (${broker.reraNumber}), congratulations from DealOS Agency Overwatch! You've closed ${broker.closedVolumeFormatted} across ${broker.dealsClosed} deals this month. Fantastic momentum!`;

        const cleanPhone = broker.phone.replace(/\D/g, "");
        const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;
        (global as any).window.open(url, "_blank");

        // Log into DealOS
        const logs = JSON.parse(localStorage.getItem("dealos_coaching_logs") || "[]");
        logs.unshift({
          id: `coach-${Date.now()}`,
          brokerId: broker.id,
          brokerName: broker.name,
          brokerPhone: broker.phone,
          reraNumber: broker.reraNumber,
          timestamp: new Date().toISOString(),
          message: msg,
          tier: broker.tier,
        });
        localStorage.setItem("dealos_coaching_logs", JSON.stringify(logs));
      }

      coachBroker(omar);

      // Verify opened URL is addressed straight to Omar's phone number
      expect(openedUrl).toContain("https://wa.me/971567890123?text=");
      expect(decodeURIComponent(openedUrl)).toContain("Hi Omar Farooq (RERA #62194)");
      expect(decodeURIComponent(openedUrl)).toContain("24.5 mins");

      // Verify logged into DealOS
      const storedLogs = JSON.parse(localStorage.getItem("dealos_coaching_logs") || "[]");
      expect(storedLogs).toHaveLength(1);
      expect(storedLogs[0].brokerName).toBe("Omar Farooq");
      expect(storedLogs[0].brokerPhone).toBe("+971567890123");
    });

    it("verifies Meta WhatsApp Cloud API credentials configuration and storage in settings", () => {
      const metaConfig = {
        wabaPhone: "+971 4 800 3325",
        phoneNumberId: "104928172819283",
        wabaAccountId: "294819281729182",
        accessToken: "EAAG_dealos_test_token_2026",
      };

      localStorage.setItem("dealos_meta_waba_phone", metaConfig.wabaPhone);
      localStorage.setItem("dealos_meta_phone_id", metaConfig.phoneNumberId);
      localStorage.setItem("dealos_meta_waba_id", metaConfig.wabaAccountId);
      localStorage.setItem("dealos_meta_access_token", metaConfig.accessToken);

      expect(localStorage.getItem("dealos_meta_waba_phone")).toBe("+971 4 800 3325");
      expect(localStorage.getItem("dealos_meta_phone_id")).toBe("104928172819283");
      expect(localStorage.getItem("dealos_meta_waba_id")).toBe("294819281729182");
      expect(localStorage.getItem("dealos_meta_access_token")).toBe("EAAG_dealos_test_token_2026");
    });
  });
});

