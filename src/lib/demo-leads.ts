/**
 * Seeded demo data for the /app broker workspace.
 * Everything lives in this one module so it can later be swapped for real tables.
 * All counts shown in the UI are derived from these records.
 */
export type LeadType = "Off-plan" | "Ready" | "Rent";
export type Stage =
  | "New" | "Contacted" | "Qualified" | "Viewing" | "Presentation sent"
  | "Site visit" | "Offer" | "EOI / booking" | "Won" | "Lost";
export type Priority = "Hot" | "Warm" | "Cold";
export type Queue = "respond" | "hot" | "followup" | "nurture" | "all";

export type Lead = {
  id: string;
  name: string;
  initials: string;
  country: string;
  phone: string;
  type: LeadType;
  beds: number;
  area: string;
  budget: number;
  payment: string;
  score: number;
  stage: Stage;
  source: string;
  receivedHoursAgo: number;
  contacted: boolean;
  followUpDueInHours: number | null; // negative = overdue
  message: string;
  task: string;
};

export const SOURCES = ["Bayut", "Property Finder", "Dubizzle", "WhatsApp", "Meta Ads", "Referral", "Website"] as const;
export const OPEN_STAGES: Stage[] = ["Contacted", "Qualified", "Viewing", "New", "Presentation sent", "Site visit", "Offer", "EOI / booking"];
const QUALIFIED_PLUS: Stage[] = ["Qualified", "Viewing", "Presentation sent", "Site visit", "Offer", "EOI / booking"];

const FIRST = ["Lucy", "Ahmed", "Giulia", "Omar", "Priya", "James", "Fatima", "Ivan", "Sara", "Rahul", "Elena", "Khalid", "Mei", "Daniel", "Aisha", "Lukas", "Noor", "Tom", "Yasmin", "Marco", "Hana", "Arjun", "Chloe", "Faisal", "Olga", "Ben", "Layla", "Kenji", "Zara", "Pierre"];
const LAST = ["D.", "K.", "R.", "M.", "S.", "A.", "B.", "H.", "N.", "T.", "V.", "L.", "P.", "F.", "G."];
const COUNTRIES = ["UK", "UAE", "Saudi Arabia", "India", "Russia", "Germany", "Italy", "China", "Pakistan", "Egypt", "France", "Lebanon", "USA", "Canada", "Kazakhstan"];
const AREAS = ["Dubai Marina", "Downtown Dubai", "Business Bay", "JVC", "Dubai Hills Estate", "Palm Jumeirah", "Al Garhoud", "Arjan", "Dubai Creek Harbour", "JLT", "Mohammed Bin Rashid City", "Damac Hills 2", "Al Furjan", "Town Square", "Dubai South"];
const MESSAGES = [
  "Saw your ad. Is the {b}BR still available? Handover date?",
  "Looking for a {b}BR in {a}, what's the payment plan?",
  "Can we book a viewing this week?",
  "Interested — please send the floor plan and price.",
  "Is there a post-handover plan on this one?",
  "What is the service charge for a {b}BR?",
];
const TASKS = ["Qualify", "Send shortlist", "Confirm viewing", "Follow up offer", "Call back", "Send brochure"];

/** Small deterministic PRNG so the demo looks identical on every load. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const STAGE_WEIGHTS: [Stage, number][] = [
  ["New", 7.4], ["Contacted", 36], ["Qualified", 19.5], ["Viewing", 8.2], ["Presentation sent", 6.8],
  ["Site visit", 4.7], ["Offer", 4.6], ["EOI / booking", 2], ["Won", 3], ["Lost", 7.8],
];

function build(): Lead[] {
  const r = mulberry32(20261008);
  const pick = <T,>(a: readonly T[]) => a[Math.floor(r() * a.length)] as T;
  const total = STAGE_WEIGHTS.reduce((s, [, w]) => s + w, 0);
  const leads: Lead[] = [];
  for (let i = 0; i < 1000; i++) {
    let x = r() * total; let stage: Stage = "Contacted";
    for (const [s, w] of STAGE_WEIGHTS) { if ((x -= w) <= 0) { stage = s; break; } }
    const t = r(); const type: LeadType = t < 0.45 ? "Off-plan" : t < 0.78 ? "Ready" : "Rent";
    const beds = Math.floor(r() * 5) + (type === "Rent" ? 0 : 1);
    const budget = type === "Rent"
      ? Math.round((60 + r() * 340) / 5) * 5000
      : Math.round((0.8 + beds * (0.6 + r() * 1.4)) * 20) * 50000;
    const first = pick(FIRST); const last = pick(LAST);
    const score = Math.round(15 + r() * 84);
    const isNew = stage === "New";
    const receivedHoursAgo = isNew ? Math.round(r() * 47 * 10) / 10 + 0.2 : Math.round(r() * 24 * 60);
    const open = stage !== "Won" && stage !== "Lost";
    const followUpDueInHours = !open || isNew ? null : Math.round((r() * 2 - 1.05) * 72);
    const area = pick(AREAS);
    leads.push({
      id: `L-${1001 + i}`, name: `${first} ${last}`, initials: `${first[0]}${last[0]}`,
      country: pick(COUNTRIES), phone: `+971 5${Math.floor(r() * 9)} ${String(Math.floor(r() * 900) + 100)} ${String(1000 + i).slice(-4)}`,
      type, beds, area, budget,
      payment: type === "Rent" ? "Yearly" : type === "Off-plan" ? "Payment plan" : r() > 0.5 ? "Cash" : "Mortgage",
      score, stage, source: pick(SOURCES), receivedHoursAgo, contacted: !isNew, followUpDueInHours,
      message: pick(MESSAGES).replace("{b}", String(Math.max(beds, 1))).replace("{a}", area),
      task: pick(TASKS),
    });
  }
  return leads;
}

export const LEADS: Lead[] = build();
export const LEAD_BY_ID = new Map(LEADS.map((l) => [l.id, l]));

export const priorityOf = (l: Lead): Priority => (l.score >= 75 ? "Hot" : l.score >= 50 ? "Warm" : "Cold");
export const isOpen = (l: Lead) => l.stage !== "Won" && l.stage !== "Lost";

export const QUEUES: { id: Queue; label: string; dot: string; info: string; desc: string }[] = [
  { id: "respond", label: "Respond now", dot: "hot", info: "New and never contacted. Reply within 5 minutes.", desc: "New leads with no first reply yet. Speed to lead wins." },
  { id: "hot", label: "Hot", dot: "warm", info: "High-intent leads already in conversation. Qualify and send a shortlist.", desc: "Score 75+ and active. Qualify and shortlist today." },
  { id: "followup", label: "Follow-up due", dot: "gold", info: "Calls, viewings and replies that are due or overdue.", desc: "Due or overdue calls, viewings and replies." },
  { id: "nurture", label: "Nurture", dot: "cold", info: "Low-intent leads kept warm by automations until they are ready.", desc: "Cold leads kept warm by automations." },
  { id: "all", label: "All leads", dot: "ink", info: "Every lead in the workspace, newest first.", desc: "Everything in the workspace." },
];

export function inQueue(l: Lead, q: Queue): boolean {
  switch (q) {
    case "respond": return l.stage === "New" && !l.contacted;
    case "hot": return isOpen(l) && l.stage !== "New" && priorityOf(l) === "Hot";
    case "followup": return isOpen(l) && l.followUpDueInHours !== null && l.followUpDueInHours <= 0;
    case "nurture": return isOpen(l) && l.stage !== "New" && priorityOf(l) === "Cold";
    default: return true;
  }
}

export function queueLeads(q: Queue): Lead[] {
  const list = LEADS.filter((l) => inQueue(l, q));
  if (q === "followup") return list.sort((a, b) => (a.followUpDueInHours ?? 0) - (b.followUpDueInHours ?? 0));
  if (q === "hot") return list.sort((a, b) => b.score - a.score);
  return list.sort((a, b) => a.receivedHoursAgo - b.receivedHoursAgo);
}

export const queueCount = (q: Queue) => LEADS.reduce((n, l) => n + (inQueue(l, q) ? 1 : 0), 0);

export function stats() {
  const open = LEADS.filter(isOpen);
  const pipelineLeads = LEADS.filter((l) => l.type !== "Rent" && QUALIFIED_PLUS.includes(l.stage));
  const pipeline = pipelineLeads.reduce((s, l) => s + l.budget, 0);
  return {
    open: open.length,
    respond: queueCount("respond"),
    hot: queueCount("hot"),
    followup: queueCount("followup"),
    nurture: queueCount("nurture"),
    newToday: LEADS.filter((l) => l.receivedHoursAgo < 24).length,
    total: LEADS.length,
    pipeline,
    commission: pipeline * 0.02,
    won: LEADS.filter((l) => l.stage === "Won").length,
    byStage: OPEN_STAGES.map((s) => ({ stage: s, count: open.filter((l) => l.stage === s).length })).sort((a, b) => b.count - a.count),
  };
}

/** Ordered list of the best next actions: never-contacted hot leads first, newest first. */
export function nextBestActions(): Lead[] {
  return queueLeads("respond").sort((a, b) => b.score - a.score || a.receivedHoursAgo - b.receivedHoursAgo).slice(0, 10);
}

export function formatAed(n: number): string {
  if (n >= 1e9) return `AED ${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `AED ${(n / 1e6).toFixed(n >= 1e8 ? 0 : 2)}M`;
  if (n >= 1e3) return `AED ${Math.round(n / 1e3)}K`;
  return `AED ${n}`;
}

export function ago(hours: number): string {
  if (hours < 1) return `${Math.max(1, Math.round(hours * 60))} min ago`;
  if (hours < 24) return `${Math.round(hours)} h ago`;
  return `${Math.round(hours / 24)} d ago`;
}

export function wants(l: Lead): string {
  return `${l.beds === 0 ? "Studio" : `${l.beds}BR`} · ${l.area}`;
}
