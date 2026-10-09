export type InventoryCategory = "offplan" | "ready" | "rental" | "other";
export const CATEGORY_TYPES = {
  offplan: ["off_plan", "offplan", "off-plan"],
  ready: ["secondary", "ready", "resale"],
  rental: ["rental", "rent", "lease"],
};
export function inventoryCategory(type: string | null): InventoryCategory {
  const normalized = (type ?? "").trim().toLowerCase();
  for (const [category, types] of Object.entries(CATEGORY_TYPES)) {
    if (types.includes(normalized)) return category as InventoryCategory;
  }
  return "other";
}
export const INVENTORY_PAGE_SIZE = 24;
export function inventorySearch(s: Record<string, unknown>) {
  return { page: Math.max(1, Math.floor(Number(s["page"]) || 1)), q: typeof s["q"] === "string" ? s["q"].slice(0, 120) : "" };
}