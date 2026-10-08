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
  { id: "monthly", label: "Monthly", period: "/month", buttonLabel: "monthly", months: 1, originalPrice: 238, price: 119, perMonth: 119, savingLabel: "50% off launch price", stripePriceId: "price_PLACEHOLDER_monthly", highlighted: false },
  { id: "quarterly", label: "3 months", period: "/3 months", buttonLabel: "3 months", months: 3, originalPrice: 714, price: 339, perMonth: 113, savingLabel: "Save AED 18", toggleBadge: "−5%", stripePriceId: "price_PLACEHOLDER_quarterly", highlighted: false },
  { id: "semiannual", label: "6 months", period: "/6 months", buttonLabel: "6 months", months: 6, originalPrice: 1428, price: 660, perMonth: 110, savingLabel: "Save AED 54", toggleBadge: "−7.5%", stripePriceId: "price_PLACEHOLDER_semiannual", highlighted: false },
  { id: "annual", label: "Annual", period: "/year", buttonLabel: "annual", months: 12, originalPrice: 2856, price: 1309, perMonth: 109, perMonthNote: "pay 11 months, get 12", savingLabel: "1 month free", toggleBadge: "1 month free", stripePriceId: "price_PLACEHOLDER_annual", highlighted: true },
];

export const DEFAULT_PLAN: PlanId = "annual";

export const PLAN_FEATURES = [
  "Leads inbox with priority queues (Respond now, Hot, Follow-ups, Nurture)",
  "70,000+ units & 1,800+ projects with payment plans and floor plans",
  "DLD sales, rents and yields by area",
  "AI assistant on every page + saved AI lead summaries",
  "1-click client presentations & payment-plan calculators",
  "WhatsApp templates, follow-up reminders and pipeline board",
  "Portal & lead-source integrations",
  "Priority support",
];

export const aedPrice = (n: number) => `AED ${Math.round(n).toLocaleString("en-US")}`;
export const isPlanId = (v: unknown): v is PlanId => PLANS.some((p) => p.id === v);
