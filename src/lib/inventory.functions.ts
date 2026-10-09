import { createServerFn } from "@tanstack/react-start";
import { queryOptions } from "@tanstack/react-query";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { CATEGORY_TYPES, inventoryCategory, INVENTORY_PAGE_SIZE } from "./inventory-category";

export const getInventorySummary = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase } = context;
    const [projectResult, unitCount] = await Promise.all([
      supabase.from("projects").select("id", { count: "exact", head: true }),
      supabase.from("units").select("id", { count: "exact", head: true }),
    ]);
    if (projectResult.error) throw new Error(projectResult.error.message);
    if (unitCount.error) throw new Error(unitCount.error.message);
    const categories = { offplan: { units: 0, available: 0, value: 0, unpriced: 0 }, ready: { units: 0, available: 0, value: 0, unpriced: 0 }, rental: { units: 0, available: 0, value: 0, unpriced: 0 }, other: { units: 0, available: 0, value: 0, unpriced: 0 } };
    let available = 0;
    let value = 0;
    let unpriced = 0;
    const pages = Math.ceil((unitCount.count ?? 0) / 1000);
    for (let start = 0; start < pages; start += 6) {
      const results = await Promise.all(Array.from({ length: Math.min(6, pages - start) }, (_, i) =>
        supabase.from("units").select("listing_type,status,price_aed").order("id").range((start + i) * 1000, (start + i + 1) * 1000 - 1),
      ));
      for (const result of results) {
        if (result.error) throw new Error(result.error.message);
        for (const unit of result.data ?? []) {
          const bucket = categories[inventoryCategory(unit.listing_type)];
          const isAvailable = ["available", "active"].includes((unit.status ?? "").toLowerCase());
          bucket.units++;
          if (isAvailable) { bucket.available++; available++; }
          if (unit.price_aed == null) { bucket.unpriced++; unpriced++; }
          else { bucket.value += Number(unit.price_aed); value += Number(unit.price_aed); }
        }
      }
    }
    return { projects: projectResult.count ?? 0, units: unitCount.count ?? 0, available, value, unpriced, categories };
  });

export const getInventoryPage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { category: "offplan" | "ready" | "rental"; page: number; q: string }) => ({ ...input, page: Math.max(1, Math.floor(input.page)), q: input.q.slice(0, 120) }))
  .handler(async ({ data, context }) => {
    let query = context.supabase.from("units")
      .select("id,project_id,unit_number,bedrooms,size_sqft,price_aed,status,unit_type,projects!inner(id,name,developer_name,district,handover_date,cover_image_url)", { count: "exact" })
      .in("listing_type", CATEGORY_TYPES[data.category]);
    if (data.q.trim()) query = query.ilike("projects.name", `%${data.q.replace(/[%_]/g, "").trim()}%`);
    const { data: rows, count, error } = await query.order("id").range((data.page - 1) * INVENTORY_PAGE_SIZE, data.page * INVENTORY_PAGE_SIZE - 1);
    if (error) throw new Error(error.message);
    return { rows: rows ?? [], count: count ?? 0 };
  });

export const getProjectPage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { page: number }) => ({ page: Math.max(1, Math.floor(input.page)) }))
  .handler(async ({ data, context }) => {
    const { data: rows, count, error } = await context.supabase.from("projects")
      .select("id,name,developer_name,district,handover_date,sale_status", { count: "exact" })
      .order("name").order("id").range((data.page - 1) * INVENTORY_PAGE_SIZE, data.page * INVENTORY_PAGE_SIZE - 1);
    if (error) throw new Error(error.message);
    return { rows: rows ?? [], count: count ?? 0 };
  });

export const inventorySummaryOptions = () => queryOptions({ queryKey: ["live-inventory-summary"], queryFn: () => getInventorySummary(), staleTime: 300_000 });
export const inventoryPageOptions = (category: "offplan" | "ready" | "rental", page: number, q: string) => queryOptions({ queryKey: ["live-inventory", category, page, q], queryFn: () => getInventoryPage({ data: { category, page, q } }), staleTime: 60_000 });
export const projectPageOptions = (page: number) => queryOptions({ queryKey: ["live-projects", page], queryFn: () => getProjectPage({ data: { page } }), staleTime: 60_000 });