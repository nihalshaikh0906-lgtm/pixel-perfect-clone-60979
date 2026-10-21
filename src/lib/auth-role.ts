import { supabase } from "@/integrations/supabase/client";

export type DealOSRole = "company" | "agent";

export function getStoredRole(): DealOSRole | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem("dealos_role");
  if (stored === "agent" || stored === "company") return stored;
  return null;
}

export function setStoredRole(role: DealOSRole): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("dealos_role", role);
}

export function clearStoredRole(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("dealos_role");
}

export async function detectRole(): Promise<DealOSRole> {
  const stored = getStoredRole();

  try {
    const { data } = await supabase.auth.getUser();
    const user = data?.user;
    if (!user) return stored ?? "agent";

    const metaRole = (user.user_metadata?.role as string | undefined)?.toLowerCase();
    if (metaRole === "agent" || metaRole === "broker") {
      setStoredRole("agent");
      return "agent";
    }
    if (metaRole === "company" || metaRole === "company_admin" || metaRole === "owner" || metaRole === "admin") {
      setStoredRole("company");
      return "company";
    }

    const email = (user.email ?? "").toLowerCase();
    if (email.includes("agent") || email.includes("broker")) {
      setStoredRole("agent");
      return "agent";
    }
    if (email.includes("company") || email.includes("owner") || email.includes("director") || email.includes("admin")) {
      setStoredRole("company");
      return "company";
    }

    const { data: mem } = await (supabase as unknown as { from: (t: string) => any })
      .from("org_members")
      .select("role")
      .eq("user_id", user.id)
      .maybeSingle();

    if (mem?.role === "agent" || mem?.role === "broker") {
      setStoredRole("agent");
      return "agent";
    }
    if (mem?.role === "company_admin" || mem?.role === "owner" || mem?.role === "admin") {
      setStoredRole("company");
      return "company";
    }
  } catch {
    // Network fallback
  }

  return stored ?? "agent";
}
