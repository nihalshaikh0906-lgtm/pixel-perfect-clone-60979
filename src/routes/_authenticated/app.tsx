import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { AppShell } from "@/components/app/AppShell";
import { detectRole } from "@/lib/auth-role";

export const Route = createFileRoute("/_authenticated/app")({
  beforeLoad: async ({ location }) => {
    const role = await detectRole();
    if (role === "company") {
      const allowedOwnerPaths = [
        "/app/settings",
        "/app/users",
        "/app/activity-logs",
        "/app/my-account",
        "/app/about",
      ];
      const isAllowed = allowedOwnerPaths.some((p) => location.pathname.startsWith(p));
      if (!isAllowed) {
        throw redirect({ to: "/owner-dashboard", replace: true });
      }
    }
  },
  head: () => ({
    meta: [
      { title: "DealOS Workspace — Broker dashboard" },
      { name: "description", content: "Your DealOS broker workspace: leads inbox, next best action, pipeline and Dubai market snapshot." },
      { property: "og:title", content: "DealOS Workspace — Broker dashboard" },
      { property: "og:description", content: "Leads, pipeline and AI assistance in one Dubai broker workspace." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AppLayout,
});

function AppLayout() {
  const { user } = Route.useRouteContext();
  const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
  const raw = String(meta["full_name"] ?? meta["name"] ?? user.email?.split("@")[0] ?? "Broker");
  const first = (raw.split(/[\s._-]+/)[0] ?? "Broker").replace(/\d+/g, "") || "Broker";
  const name = first.charAt(0).toUpperCase() + first.slice(1).toLowerCase();
  const full = raw.replace(/\d+/g, "").trim();
  const initials = full.split(/\s+/).map((p) => p[0]).join("").slice(0, 2).toUpperCase() || name.slice(0, 2).toUpperCase();
  const agency = String(meta["company"] ?? meta["agency"] ?? "Your agency");
  return (
    <AppShell userName={name} initials={initials} agency={agency}>
      <Outlet />
    </AppShell>
  );
}
