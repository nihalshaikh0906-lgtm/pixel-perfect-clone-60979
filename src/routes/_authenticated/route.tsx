import { useState } from "react";
import { createFileRoute, Outlet, redirect, useRouterState } from "@tanstack/react-router";

import { GeneralCopilot } from "@/components/GeneralCopilot";
import { ProfileWidget } from "@/components/ProfileWidget";
import { SubscriptionPaywall, isSubscriptionActive, isWhitelistedAccount, OPEN_ACCESS_DEMO_24H } from "@/components/auth/SubscriptionPaywall";

import { supabase } from "@/integrations/supabase/client";
import { enforceRemember } from "@/lib/remember";
import { isTestingAccount } from "@/lib/testing-account";
import { setStoredRole, getActiveEmail } from "@/lib/auth-role";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    await enforceRemember();
    const { data } = await supabase.auth.getUser();
    if (data?.user) {
      const cleanEmail = (data.user.email ?? "").toLowerCase().trim();
      const storedRole = typeof window !== "undefined" ? localStorage.getItem("dealos_role") : null;
      const isMasterAdmin =
        cleanEmail === "nihalshaikh0906@gmail.com" ||
        cleanEmail === "admin@dealos.ae";

      if (isMasterAdmin) {
        const isOwner = storedRole === "company";
        const name = cleanEmail === "nihalshaikh0906@gmail.com"
          ? (isOwner ? "Nihal Shaikh (Principal Owner)" : "Nihal Shaikh (Licensed Broker)")
          : (isOwner ? "DealOS Master Admin (Owner Cockpit)" : "DealOS Master Admin (Broker Desk)");
        return {
          user: {
            ...data.user,
            user_metadata: {
              ...(data.user.user_metadata || {}),
              role: isOwner ? "company" : "agent",
              full_name: name,
              is_super_admin: true,
            },
          },
        };
      }
      return { user: data.user };
    }

    const cachedActiveEmail = typeof window !== "undefined" ? localStorage.getItem("dealos_active_email")?.toLowerCase().trim() : null;
    const isCachedMasterAdmin =
      cachedActiveEmail === "nihalshaikh0906@gmail.com" ||
      cachedActiveEmail === "admin@dealos.ae";

    // OPTION 1: Real-workspace protections remain 100% active.
    // Bypass occurs strictly via "Try Live Demo" (dealos_demo_mode = "true"), ?demo=true, or master admin.
    const isDemoMode =
      OPEN_ACCESS_DEMO_24H ||
      (typeof window !== "undefined" &&
        (isCachedMasterAdmin ||
          localStorage.getItem("dealos_demo_mode") === "true" ||
          window.location.search.includes("demo=true")));

    if (isDemoMode) {
      const activeEmail = cachedActiveEmail;
      const storedRole = typeof window !== "undefined" ? localStorage.getItem("dealos_role") : null;

      // Honor the user's selected role (storedRole === 'company' vs 'agent')
      const isOwner = storedRole === "company";
      const isAdminKey = isCachedMasterAdmin;

      const adminFullName = activeEmail === "nihalshaikh0906@gmail.com"
        ? (isOwner ? "Nihal Shaikh (Principal Owner)" : "Nihal Shaikh (Licensed Broker)")
        : activeEmail === "admin@dealos.ae"
        ? (isOwner ? "DealOS Master Admin (Owner Cockpit)" : "DealOS Master Admin (Broker Desk)")
        : (isOwner ? "DealOS Agency Owner" : "DealOS Licensed Broker");

      return {
        user: {
          id: isOwner ? "master-owner-user-1" : "master-broker-user-1",
          email: activeEmail || (isOwner ? "admin@dealos.ae" : "nihalshaikh0906@gmail.com"),
          user_metadata: {
            full_name: adminFullName,
            role: isOwner ? "company" : "agent",
            is_super_admin: isAdminKey,
          },
        },
      };
    }

    throw redirect({ to: "/login" });
  },
  component: AuthedLayout,
});

function AuthedLayout() {
  const inApp = useRouterState({ select: (s) => s.location.pathname.startsWith("/app") });
  const { user } = Route.useRouteContext();
  const [hasPaid, setHasPaid] = useState<boolean>(() => isSubscriptionActive(user?.email));
  const isDemo = typeof window !== "undefined" && (localStorage.getItem("dealos_demo_mode") === "true" || OPEN_ACCESS_DEMO_24H);

  const role = ((user?.user_metadata?.role as string | undefined)?.toLowerCase() === "company" ? "company" : "agent") as "company" | "agent";

  return (
    <>
      {isDemo && (
        <aside aria-label="Demo mode banner" className="sticky top-0 z-50 bg-gradient-to-r from-emerald-600 via-primary to-emerald-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-semibold flex flex-col sm:flex-row items-center justify-between gap-1.5 sm:gap-2 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-white animate-pulse shrink-0" />
            <span className="text-center sm:text-left text-[11px] sm:text-xs">
              <strong>✦ 7-Day Access Active:</strong> {isTestingAccount(user?.email || getActiveEmail()) ? "Universal Testrun Mode" : "Dubai Demo Mode"} (<strong>{role === "company" ? "Owner Cockpit" : "Broker Desk"}</strong>)
            </span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => {
                const nextRole = role === "company" ? "agent" : "company";
                setStoredRole(nextRole);
                window.location.href = nextRole === "company" ? "/owner-dashboard" : "/app";
              }}
              className="bg-black/30 hover:bg-black/50 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold border border-white/20 transition-colors cursor-pointer"
            >
              Switch to {role === "company" ? "Broker Desk" : "Owner Cockpit"} ⇄
            </button>
            <button
              type="button"
              onClick={() => {
                if (typeof window !== "undefined") {
                  localStorage.removeItem("dealos_demo_mode");
                  localStorage.removeItem("dealos_subscription_active");
                  localStorage.removeItem("dealos_active_email");
                  window.location.href = "/login";
                }
              }}
              className="bg-black/30 hover:bg-black/50 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold border border-white/20 transition-colors cursor-pointer"
            >
              Sign Out ✕
            </button>
          </div>
        </aside>
      )}
      {!hasPaid && !isWhitelistedAccount(user?.email) && !OPEN_ACCESS_DEMO_24H && (
        <SubscriptionPaywall
          userEmail={user?.email}
          userRole={role}
          onActivated={() => setHasPaid(true)}
        />
      )}
      <Outlet />
      {inApp ? null : <ProfileWidget />}
      {inApp ? null : <GeneralCopilot />}
    </>
  );
}
