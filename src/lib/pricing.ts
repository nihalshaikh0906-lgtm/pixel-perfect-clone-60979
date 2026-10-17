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
  { id: "monthly", label: "1 Month", period: "/month", buttonLabel: "1 month", months: 1, originalPrice: 199, price: 129, perMonth: 129, savingLabel: "Launch discount · 35% off", toggleBadge: "Launch offer", stripePriceId: "price_monthly_129", highlighted: false },
  { id: "quarterly", label: "3 Months", period: "/3 months", buttonLabel: "3 months", months: 3, originalPrice: 597, price: 349, perMonth: 116, savingLabel: "Save AED 248 (AED 116/mo)", toggleBadge: "−42%", stripePriceId: "price_quarterly_349", highlighted: false },
  { id: "semiannual", label: "6 Months", period: "/6 months", buttonLabel: "6 months", months: 6, originalPrice: 1194, price: 629, perMonth: 105, savingLabel: "Save AED 565 (AED 105/mo)", toggleBadge: "−47%", stripePriceId: "price_semiannual_629", highlighted: false },
  { id: "annual", label: "1 Year", period: "/year", buttonLabel: "1 year", months: 12, originalPrice: 2388, price: 1099, perMonth: 91, perMonthNote: "Only AED 91 / month", savingLabel: "Best Value · Save 54%", toggleBadge: "★ Best Deal", stripePriceId: "price_annual_1099", highlighted: true },
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
