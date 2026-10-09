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
  .inputValidator((input: { category: "offplan" | "ready" | "rental"; page: number; q: string }) => {
    if (!["offplan", "ready", "rental"].includes(input.category)) throw new Error("Invalid inventory category");
    return { category: input.category, page: Number.isFinite(input.page) ? Math.max(1, Math.floor(input.page)) : 1, q: typeof input.q === "string" ? input.q.slice(0, 120) : "" };
  })
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
  .inputValidator((input: { page: number }) => ({ page: Number.isFinite(input.page) ? Math.max(1, Math.floor(input.page)) : 1 }))
  .handler(async ({ data, context }) => {
    const { data: rows, count, error } = await context.supabase.from("projects")
      .select("id,name,developer_name,district,handover_date,sale_status", { count: "exact" })
      .order("name").order("id").range((data.page - 1) * INVENTORY_PAGE_SIZE, data.page * INVENTORY_PAGE_SIZE - 1);
    if (error) throw new Error(error.message);
    return { rows: rows ?? [], count: count ?? 0 };
  });

export const getOffplanProjects = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { page: number; q: string }) => ({
    page: Number.isFinite(input.page) ? Math.max(1, Math.floor(input.page)) : 1,
    q: typeof input.q === "string" ? input.q.slice(0, 120) : "",
  }))
  .handler(async ({ data, context }) => {
    let query = context.supabase.from("projects")
      .select("id,name,developer_name,district,handover_date,cover_image_url,sale_status", { count: "exact" });
    if (data.q.trim()) query = query.ilike("name", `%${data.q.replace(/[%_]/g, "").trim()}%`);
    const { data: rows, count, error } = await query.order("name").order("id").range((data.page - 1) * INVENTORY_PAGE_SIZE, data.page * INVENTORY_PAGE_SIZE - 1);
    if (error) throw new Error(error.message);
    const projects = rows ?? [];
    const ids = projects.map((p) => p.id);
    const stats = new Map<number, { price: number | null; beds: Set<number>; seen: boolean }>();
    const ensure = (id: number) => {
      let s = stats.get(id);
      if (!s) { s = { price: null, beds: new Set<number>(), seen: false }; stats.set(id, s); }
      return s;
    };
    let from = 0;
    for (let round = 0; round < 6 && ids.length; round++) {
      const { data: unitRows, error: unitError } = await context.supabase.from("units")
        .select("project_id,price_aed,bedrooms")
        .in("project_id", ids)
        .in("listing_type", CATEGORY_TYPES.offplan)
        .order("price_aed", { ascending: true, nullsFirst: false })
        .range(from, from + 999);
      if (unitError) throw new Error(unitError.message);
      for (const u of unitRows ?? []) {
        const s = ensure(u.project_id as number);
        s.seen = true;
        if (s.price == null && u.price_aed != null) s.price = Number(u.price_aed);
        if (u.bedrooms != null) s.beds.add(Number(u.bedrooms));
      }
      const unseen = ids.filter((id) => !stats.get(id)?.seen);
      if (!unseen.length || !unitRows?.length) break;
      from += 1000;
    }
    return {
      rows: projects.map((p) => ({
        ...p,
        starting_price_aed: stats.get(p.id)?.price ?? null,
        bed_types: [...(stats.get(p.id)?.beds ?? [])].sort((a, b) => a - b),
      })),
      count: count ?? 0,
    };
  });

export const getProjectDetail = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: number }) => ({ id: Math.floor(Number(input.id)) }))
  .handler(async ({ data, context }) => {
    const { data: project, error } = await context.supabase.from("projects")
      .select("id,name,developer_name,district,handover_date,cover_image_url,sale_status")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!project) return null;
    const { data: units, error: unitError } = await context.supabase.from("units")
      .select("id,project_id,unit_number,bedrooms,size_sqft,price_aed,status,unit_type")
      .eq("project_id", data.id)
      .order("price_aed", { ascending: true, nullsFirst: false })
      .limit(24);
    if (unitError) throw new Error(unitError.message);
    return { project, units: units ?? [] };
  });

export const inventorySummaryOptions = () => queryOptions({ queryKey: ["live-inventory-summary"], queryFn: () => getInventorySummary(), staleTime: 300_000 });
export const inventoryPageOptions = (category: "offplan" | "ready" | "rental", page: number, q: string) => queryOptions({ queryKey: ["live-inventory", category, page, q], queryFn: () => getInventoryPage({ data: { category, page, q } }), staleTime: 60_000 });
export const projectPageOptions = (page: number) => queryOptions({ queryKey: ["live-projects", page], queryFn: () => getProjectPage({ data: { page } }), staleTime: 60_000 });
export const offplanProjectsOptions = (page: number, q: string) => queryOptions({ queryKey: ["offplan-projects", page, q], queryFn: () => getOffplanProjects({ data: { page, q } }), staleTime: 60_000 });
export const projectDetailOptions = (id: number) => queryOptions({ queryKey: ["project-detail", id], queryFn: () => getProjectDetail({ data: { id } }), staleTime: 60_000 });