import { priorityOf, type Lead } from "@/lib/demo-leads";

export function TypeChip({ type }: { type: Lead["type"] }) {
  return <span className={`a-chip ${type === "Off-plan" ? "c-offplan" : type === "Ready" ? "c-ready" : "c-rent"}`}>{type}</span>;
}
export function PriorityChip({ lead }: { lead: Lead }) {
  const p = priorityOf(lead);
  return <span className={`a-chip ${p === "Hot" ? "c-hot" : p === "Warm" ? "c-warm" : "c-cold"}`}>{p} · {lead.score}</span>;
}
