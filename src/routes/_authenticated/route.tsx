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

    const cachedActiveEmail = typeof window !== "undefined" ? localStorage.getItem("dealos_active_email")?.toLowerCase().trim() : null;
    const isCachedMasterAdmin =
      cachedActiveEmail === "nihalshaikh0906@gmail.com" ||
      cachedActiveEmail === "admin@dealos.ae";

    // Demo Mode & Master Admin Instant Access: always takes priority so 1-click demo never gets blocked
    const isExplicitDemo = typeof window !== "undefined" && (
      localStorage.getItem("dealos_demo_mode") === "true" ||
      cachedActiveEmail?.includes("demo") ||
      window.location.search.includes("demo=true")
    );

    const isDemoMode = OPEN_ACCESS_DEMO_24H || isExplicitDemo || isCachedMasterAdmin;

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
          id: isOwner ? "demo-owner-user-1" : "demo-broker-user-1",
          email: activeEmail || (isOwner ? "demo-owner@dealos.ae" : "demo-agent@dealos.ae"),
          user_metadata: {
            full_name: adminFullName,
            role: isOwner ? "company" : "agent",
            is_super_admin: isAdminKey,
          },
        },
      };
    }

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

    throw redirect({ to: "/login" });
  },
  component: AuthedLayout,
});

function AuthedLayout() {
  const inApp = useRouterState({ select: (s) => s.location.pathname.startsWith("/app") });
  const { user } = Route.useRouteContext();
  const [hasPaid, setHasPaid] = useState<boolean>(() => isSubscriptionActive(user?.email));
  const isDemo = typeof window !== "undefined" && localStorage.getItem("dealos_demo_mode") === "true";

  const role = ((user?.user_metadata?.role as string | undefined)?.toLowerCase() === "company" ? "company" : "agent") as "company" | "agent";

  return (
    <>
      <aside aria-label="Platform Access Banner" className={`sticky top-0 z-50 text-white px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-semibold flex flex-col sm:flex-row items-center justify-between gap-1.5 sm:gap-2 shadow-xs ${isDemo ? "bg-gradient-to-r from-emerald-600 via-primary to-emerald-600" : "bg-gradient-to-r from-zinc-900 via-indigo-950 to-zinc-900 border-b border-indigo-500/30"}`}>
        <div className="flex items-center gap-2">
          <span className={`size-2 rounded-full animate-pulse shrink-0 ${isDemo ? "bg-white" : "bg-emerald-400"}`} />
          <span className="text-center sm:text-left text-[11px] sm:text-xs">
            {isDemo ? (
              <>
                <strong>✦ Demo Mode Active:</strong> 30+ Sample Items Loaded (<strong>{role === "company" ? "Owner Cockpit" : "Broker Desk"}</strong>) · 10 Days Free Access until 5 Nov 2026
              </>
            ) : (
              <>
                <strong>✦ 10-Day Free Access Active:</strong> Full platform unlocked · Software will need paid subscription from 5 Nov 2026
              </>
            )}
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
        </div>
      </aside>
      {!hasPaid && !isWhitelistedAccount(user?.email) && !OPEN_ACCESS_DEMO_24H && (
        <SubscriptionPaywall
          userEmail={user?.email}
          userRole={role}
          onActivated={() => setHasPaid(true)}
        />
      )}
      <Outlet />
      {inApp ? null : <GeneralCopilot />}
    </>
  );
}
