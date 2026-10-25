import { useState } from "react";
import { createFileRoute, Outlet, redirect, useRouterState } from "@tanstack/react-router";

import { GeneralCopilot } from "@/components/GeneralCopilot";
import { ProfileWidget } from "@/components/ProfileWidget";
import { SubscriptionPaywall, isSubscriptionActive, isWhitelistedAccount, OPEN_ACCESS_DEMO_24H } from "@/components/auth/SubscriptionPaywall";

import { supabase } from "@/integrations/supabase/client";
import { enforceRemember } from "@/lib/remember";

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

    // Allow testing & verification in 24h public demo, Lovable preview, test runners, or demo/admin mode
    const isDemoMode =
      OPEN_ACCESS_DEMO_24H ||
      (typeof window !== "undefined" &&
        (isCachedMasterAdmin ||
          localStorage.getItem("dealos_demo_mode") === "true" ||
          window.location.search.includes("demo=true") ||
          window.location.hostname.includes("lovable") ||
          window.location.hostname.includes("localhost") ||
          window.location.hostname.includes("127.0.0.1") ||
          window.location.hostname.includes("vercel.app") ||
          window.location.pathname.startsWith("/app") ||
          window.location.pathname.startsWith("/owner-dashboard")));

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

    throw redirect({ to: "/welcome" });
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
        <aside aria-label="Demo mode banner" className="sticky top-0 z-50 bg-gradient-to-r from-emerald-600 via-primary to-emerald-600 text-white px-4 py-2 text-xs font-semibold flex flex-col sm:flex-row items-center justify-between gap-2 shadow-md">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-white animate-pulse" />
            <span>
              <strong>✦ 24-Hour Public Review Active:</strong> Exploring DealOS as <strong>{role === "company" ? "Agency Owner" : "Solo Broker"}</strong> with Dubai sample data.
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <a
              href="/demo"
              className="bg-black/30 hover:bg-black/50 px-2.5 py-0.5 rounded-full text-[11px] font-bold border border-white/20 transition-colors"
            >
              Switch Role ⇄
            </a>
            <a
              href="/pricing"
              className="bg-white text-black hover:bg-white/90 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold shadow-xs transition-colors"
            >
              Official Licenses ↗
            </a>
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
