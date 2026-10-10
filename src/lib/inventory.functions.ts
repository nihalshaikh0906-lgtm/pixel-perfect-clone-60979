import { createServerFn } from "@tanstack/react-start";
import { queryOptions } from "@tanstack/react-query";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { CATEGORY_TYPES, inventoryCategory, INVENTORY_PAGE_SIZE } from "./inventory-category";
import { mediaUrl, deepMedia } from "./media";

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
      .select("id,name,developer_name,developer_description,overview,escrow,dld,district,emirate_or_country,media,handover_date,cover_image_url,sale_status,amenities,latitude,longitude,furnishing,service_charge,build_progress_pct,developer_logo_url")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!project) return null;
    const { data: units, error: unitError } = await context.supabase.from("units")
      .select("id,project_id,unit_number,bedrooms,size_sqft,price_aed,status,unit_type,floor_label,floor_plan_urls")
      .eq("project_id", data.id)
      .order("price_aed", { ascending: true, nullsFirst: false })
      .limit(200);
    if (unitError) throw new Error(unitError.message);
    const rows = units ?? [];
    const files: Array<{ id: string; project_id: number | null; name: string | null; type: string | null; url: string | null }> = [];
    for (let from = 0; ; from += 1000) {
      const { data: batch, error: filesError } = await context.supabase.from("project_files")
        .select("*").eq("project_id", data.id).order("id").range(from, from + 999);
      if (filesError) throw new Error(filesError.message);
      files.push(...(batch ?? []));
      if ((batch?.length ?? 0) < 1000) break;
    }
    const countQuery = context.supabase.from("units")
      .select("id", { count: "exact", head: true })
      .eq("project_id", data.id)
      .in("status", ["available", "active", "Available", "Active"]);
    const cheapest = rows.find((u) => u.price_aed != null) ?? rows[0] ?? null;
    let available_units = 0;
    let payment_plan_summary: string | null = null;
    if (cheapest) {
      const [countResult, packResult] = await Promise.all([
        countQuery,
        context.supabase.rpc("get_property_pack", { p_project_id: data.id, p_unit_id: cheapest.id }),
      ]);
      if (countResult.error) throw new Error(countResult.error.message);
      available_units = countResult.count ?? 0;
      if (!packResult.error) {
        const plan = (packResult.data as { plans?: Array<{ steps?: Array<{ percent?: unknown }>; post_handover?: unknown }> } | null)?.plans?.[0];
        const booking = Math.round(Number(plan?.steps?.[0]?.percent ?? 0));
        if (booking > 0 && booking < 100) payment_plan_summary = `${booking}% booking · ${100 - booking}% to handover`;
      }
    } else {
      const countResult = await countQuery;
      if (countResult.error) throw new Error(countResult.error.message);
      available_units = countResult.count ?? 0;
    }
    const { data: plans } = await context.supabase.from("payment_plans")
      .select("id,name,has_post_handover,payment_plan_steps(name,percentage,position,stage_type,parent_step_id)")
      .eq("project_id", data.id).limit(10);
    const payment_plans = (plans ?? []).map((pl) => ({
      id: pl.id, name: pl.name, post_handover: pl.has_post_handover,
      steps: ((pl.payment_plan_steps ?? []) as Array<{ name: string | null; percentage: number | null; position: number | null; parent_step_id: string | null }>)
        .filter((st) => !st.parent_step_id && Number(st.percentage) > 0)
        .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
        .map((st) => ({ name: st.name ?? "Instalment", percent: Number(st.percentage) })),
    })).filter((pl) => pl.steps.length);
    return {
      project: { ...project, cover_image_url: mediaUrl(project.cover_image_url), media: deepMedia(project.media) },
      units: rows.map((u) => ({ ...u, floor_plan_urls: (u.floor_plan_urls ?? []).map(mediaUrl) })),
      available_units,
      payment_plan_summary,
      documents: (files ?? []).map((f) => ({ ...f, url: mediaUrl(f.url) })),
      payment_plans,
    };
  });

export const inventorySummaryOptions = () => queryOptions({ queryKey: ["live-inventory-summary"], queryFn: () => getInventorySummary(), staleTime: 300_000 });
export const inventoryPageOptions = (category: "offplan" | "ready" | "rental", page: number, q: string) => queryOptions({ queryKey: ["live-inventory", category, page, q], queryFn: () => getInventoryPage({ data: { category, page, q } }), staleTime: 60_000 });
export const projectPageOptions = (page: number) => queryOptions({ queryKey: ["live-projects", page], queryFn: () => getProjectPage({ data: { page } }), staleTime: 60_000 });
export const offplanProjectsOptions = (page: number, q: string) => queryOptions({ queryKey: ["offplan-projects", page, q], queryFn: () => getOffplanProjects({ data: { page, q } }), staleTime: 60_000 });
export const projectDetailOptions = (id: number) => queryOptions({ queryKey: ["project-detail", id], queryFn: () => getProjectDetail({ data: { id } }), staleTime: 60_000 });