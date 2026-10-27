// Single source of truth for DealOS Pro pricing. Change numbers here only.
export type PlanId = "monthly" | "quarterly" | "semiannual" | "annual";

export type Plan = {
  id: PlanId;
  label: string; // toggle label
  period: string; // "/month"
  buttonLabel: string; // "Start with …"
  months: number;
  originalPrice: number;
  price: number;
  perMonth: number;
  perMonthNote?: string;
  savingLabel: string;
  toggleBadge?: string;
  stripePriceId: string; // placeholder until Stripe Checkout is connected
  highlighted: boolean;
};

export const PLANS: Plan[] = [
  { id: "monthly", label: "1 Month", period: "/month", buttonLabel: "1 month", months: 1, originalPrice: 199, price: 129, perMonth: 129, savingLabel: "Launch discount · 35% off (AED 70 saved)", toggleBadge: "−35%", stripePriceId: "price_monthly_129", highlighted: false },
  { id: "quarterly", label: "3 Months", period: "/3 months", buttonLabel: "3 months", months: 3, originalPrice: 597, price: 349, perMonth: 116, savingLabel: "Save AED 248 (AED 116/mo · 42% off)", toggleBadge: "−42%", stripePriceId: "price_quarterly_349", highlighted: false },
  { id: "semiannual", label: "6 Months", period: "/6 months", buttonLabel: "6 months", months: 6, originalPrice: 1194, price: 629, perMonth: 105, savingLabel: "Save AED 565 (AED 105/mo · 47% off)", toggleBadge: "−47%", stripePriceId: "price_semiannual_629", highlighted: false },
  { id: "annual", label: "1 Year", period: "/year", buttonLabel: "1 year", months: 12, originalPrice: 2388, price: 1099, perMonth: 91, perMonthNote: "Only AED 91 / month", savingLabel: "Best Value · Save AED 1,289 (54% off)", toggleBadge: "−54% · Best", stripePriceId: "price_annual_1099", highlighted: true },
];

export const DEFAULT_PLAN: PlanId = "annual";

export const PLAN_FEATURES = [
  "Leads inbox with priority queues (Respond now, Hot, Follow-ups, Nurture)",
  "34,850+ verified UAE units & 1,355+ off-plan projects with payment plans and floor plans",
  "DLD sales, rents and yields by district across 6 Emirates",
  "AI assistant on every page + saved AI lead summaries",
  "1-click client presentations & payment-plan calculators",
  "WhatsApp templates, follow-up reminders and pipeline board",
  "Portal & lead-source integrations",
  "Priority support",
];

export type AgencyTierId = "boutique" | "growth" | "enterprise" | "corporate";

export interface AgencyTier {
  id: AgencyTierId;
  name: string;
  minAgents: number;
  maxAgents: number;
  agentRangeLabel: string;
  monthlyPrice: number;
  annualPrice: number;
  annualEquivalentMonthly: number;
  perSeatAnnual: number;
  perSeatMonthly: number;
  savingsPercentVsSolo: string;
  standardSoloAnnualCost: number;
  adminSeats: string;
  brokerSeats: string;
  recommended?: boolean;
  features: string[];
}

export const AGENCY_TIERS: AgencyTier[] = [
  {
    id: "boutique",
    name: "Boutique Agency",
    minAgents: 5,
    maxAgents: 10,
    agentRangeLabel: "5 – 10 Agents",
    monthlyPrice: 399,
    annualPrice: 3490,
    annualEquivalentMonthly: 290,
    perSeatAnnual: 29,
    perSeatMonthly: 39,
    savingsPercentVsSolo: "68% cheaper per person",
    standardSoloAnnualCost: 10990, // 10 x AED 1,099
    adminSeats: "1 Master Admin Cockpit",
    brokerSeats: "Up to 10 Dedicated Broker Desks",
    features: [
      "1 Master Admin + 10 Dedicated Broker Desks",
      "From AED 29 / person / mo (68% cheaper than solo)",
      "Full Dubai off-plan catalog (1,355+ developments)",
      "Team WhatsApp script library & branded presentations",
      "Centralized agency lead inbox & tracking",
      "UAE corporate tax invoice & Emirates NBD / Wio IBAN",
    ],
  },
  {
    id: "growth",
    name: "Growth Brokerage",
    minAgents: 11,
    maxAgents: 25,
    agentRangeLabel: "11 – 25 Agents",
    monthlyPrice: 799,
    annualPrice: 6990,
    annualEquivalentMonthly: 582,
    perSeatAnnual: 23,
    perSeatMonthly: 32,
    savingsPercentVsSolo: "75% cheaper per person",
    standardSoloAnnualCost: 27475, // 25 x AED 1,099
    adminSeats: "2 Admin Cockpits",
    brokerSeats: "Up to 25 Dedicated Broker Desks",
    recommended: true,
    features: [
      "2 Admin Cockpits + 25 Dedicated Broker Desks",
      "From AED 23 / person / mo (75% cheaper than solo)",
      "Automated Round-Robin Lead Distribution Engine",
      "Broker commission split ledger & payout tracking",
      "Custom agency branding on all client PDF decks",
      "Dedicated WhatsApp account manager & priority onboarding",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise Brokerage",
    minAgents: 26,
    maxAgents: 50,
    agentRangeLabel: "26 – 50 Agents",
    monthlyPrice: 1499,
    annualPrice: 12990,
    annualEquivalentMonthly: 1082,
    perSeatAnnual: 21,
    perSeatMonthly: 30,
    savingsPercentVsSolo: "77% cheaper per person",
    standardSoloAnnualCost: 54950, // 50 x AED 1,099
    adminSeats: "5 Admin Cockpits",
    brokerSeats: "Up to 50 Dedicated Broker Desks",
    features: [
      "5 Admin Cockpits + 50 Dedicated Broker Desks",
      "From AED 21 / person / mo (77% cheaper than solo)",
      "Custom Brokerage Domain (e.g. crm.youragency.ae)",
      "Developer direct inventory sync & priority feeds",
      "Agent productivity leaderboard & KPI analytics",
      "1-on-1 team training session & priority 24/7 SLA",
    ],
  },
  {
    id: "corporate",
    name: "Corporate Institutional",
    minAgents: 51,
    maxAgents: 200,
    agentRangeLabel: "50+ Agents",
    monthlyPrice: 2799,
    annualPrice: 24990,
    annualEquivalentMonthly: 2082,
    perSeatAnnual: 20,
    perSeatMonthly: 28,
    savingsPercentVsSolo: "78% cheaper per person",
    standardSoloAnnualCost: 109900, // 100 x AED 1,099
    adminSeats: "Unlimited Admins",
    brokerSeats: "Custom Unlimited Desks",
    features: [
      "Unlimited Admin & Manager accounts + custom desks",
      "From AED 20 / person / mo (78% cheaper than solo)",
      "Multi-branch / Multi-license isolation support",
      "Dedicated database instance & automated daily backup",
      "Custom CRM data migration from HubSpot / Salesforce",
      "Institutional SLA with dedicated UAE Account Executive",
    ],
  },
];

export const aedPrice = (n: number) => `AED ${Math.round(n).toLocaleString("en-US")}`;
export const isPlanId = (v: unknown): v is PlanId => PLANS.some((p) => p.id === v);

