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

export function getActiveEmail(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("dealos_active_email");
}

export function setActiveEmail(email: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("dealos_active_email", email.toLowerCase().trim());
}

export function clearStoredRole(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("dealos_role");
  localStorage.removeItem("dealos_active_email");
  localStorage.removeItem("dealos_demo_mode");
}

export async function fullSignOut(): Promise<void> {
  clearStoredRole();
  if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
    try {
      const toRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && (k.startsWith("sb-") || k.includes("supabase.auth"))) {
          toRemove.push(k);
        }
      }
      for (const k of toRemove) {
        localStorage.removeItem(k);
      }
    } catch {
      // Resilient fallback
    }
  }
  try {
    await supabase.auth.signOut();
  } catch {
    // Resilient fallback
  }
}

export async function detectRole(): Promise<DealOSRole> {
  const stored = getStoredRole();
  const activeEmail = (typeof window !== "undefined" ? localStorage.getItem("dealos_active_email") : null)?.toLowerCase().trim();

  // 1. Super Admin Master Key: nihalshaikh0906@gmail.com has universal access to BOTH Owner and Broker CRM
  if (activeEmail === "nihalshaikh0906@gmail.com") {
    const desiredRole: DealOSRole = stored === "company" ? "company" : stored === "agent" ? "agent" : "company";
    setStoredRole(desiredRole);
    return desiredRole;
  }
  // 2. Specific DealOS Executive Owner/Admin accounts (support dual access based on stored toggle)
  if (activeEmail === "driplab26@gmail.com" || activeEmail === "owner@dealos.ae" || activeEmail === "admin@dealos.ae") {
    const desiredRole: DealOSRole = stored === "agent" ? "agent" : "company";
    setStoredRole(desiredRole);
    return desiredRole;
  }

  try {
    const { data } = await supabase.auth.getUser();
    const user = data?.user;
    if (user) {
      const cleanEmail = (user.email ?? "").toLowerCase().trim();
      if (cleanEmail === "nihalshaikh0906@gmail.com") {
        const desiredRole: DealOSRole = stored === "company" ? "company" : stored === "agent" ? "agent" : "company";
        setStoredRole(desiredRole);
        setActiveEmail(cleanEmail);
        return desiredRole;
      }
      if (cleanEmail === "driplab26@gmail.com" || cleanEmail === "owner@dealos.ae" || cleanEmail === "admin@dealos.ae") {
        const desiredRole: DealOSRole = stored === "agent" ? "agent" : "company";
        setStoredRole(desiredRole);
        setActiveEmail(cleanEmail);
        return desiredRole;
      }

      // Check database membership role first
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

      // Check Supabase user metadata role
      const metaRole = (user.user_metadata?.role as string | undefined)?.toLowerCase();
      if (metaRole === "agent" || metaRole === "broker") {
        setStoredRole("agent");
        return "agent";
      }
      if (metaRole === "company" || metaRole === "company_admin" || metaRole === "owner" || metaRole === "admin") {
        setStoredRole("company");
        return "company";
      }
    }
  } catch {
    // Network fallback
  }

  // If no DB/meta role is found, strictly respect what the user selected (stored: Broker vs Company)
  return stored ?? "agent";
}
