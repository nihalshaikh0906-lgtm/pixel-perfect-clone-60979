import type { SearchSchemaInput } from "@tanstack/react-router";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useEffect } from "react";

import { AppShell } from "@/components/app/AppShell";
import { OwnerDashboard } from "@/pages/OwnerDashboard";
import { inventorySummaryOptions, projectPageOptions } from "@/lib/inventory.functions";
import { detectRole, getStoredRole } from "@/lib/auth-role";

export const Route = createFileRoute("/_authenticated/owner-dashboard")({
  beforeLoad: async () => {
    const role = await detectRole();
    if (role === "agent") {
      throw redirect({ to: "/app/leads", search: { queue: "all" }, replace: true });
    }
  },
  validateSearch: (s: Record<string, unknown> & SearchSchemaInput) => ({ page: Math.max(1, Math.floor(Number(s["page"]) || 1)) }),
  loaderDeps: ({ search }) => ({ page: search.page }),
  loader: async ({ context, deps }) => {
    try {
      await Promise.allSettled([
        context.queryClient.ensureQueryData(inventorySummaryOptions()),
        context.queryClient.ensureQueryData(projectPageOptions(deps.page)),
      ]);
    } catch {
      // Resilient fallback
    }
  },
  errorComponent: ({ error }) => <div role="alert">Unable to load inventory: {error instanceof Error ? error.message : "Please try again."}</div>,
  notFoundComponent: () => <div>Inventory not found.</div>,
  head: () => ({
    meta: [
      { title: "Executive Overview — DealOS CRM" },
      { name: "description", content: "Live Supabase projects, available units and inventory value by property category." },
      { property: "og:title", content: "Executive Overview — DealOS CRM" },
      { property: "og:description", content: "Live Supabase projects, available units and inventory value by property category." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: OwnerDashboardPage,
});

function OwnerDashboardPage() {
  const { page } = Route.useSearch();
  const navigate = Route.useNavigate();
  const role = getStoredRole();

  useEffect(() => {
    if (role === "agent") {
      void navigate({ to: "/app/leads", search: { queue: "all" }, replace: true });
    }
  }, [role, navigate]);

  if (role === "agent") return null;

  const { user } = Route.useRouteContext();
  const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
  const raw = String(meta["full_name"] ?? meta["name"] ?? user.email?.split("@")[0] ?? "Owner");
  const first = (raw.split(/[\s._-]+/)[0] ?? "Owner").replace(/\d+/g, "") || "Owner";
  const name = first.charAt(0).toUpperCase() + first.slice(1).toLowerCase();
  const full = raw.replace(/\d+/g, "").trim();
  const initials = full.split(/\s+/).map((p) => p[0]).join("").slice(0, 2).toUpperCase() || name.slice(0, 2).toUpperCase();
  const agency = String(meta["company"] ?? meta["agency"] ?? "Your agency");
  return (
    <AppShell userName={name} initials={initials} agency={agency}>
      <OwnerDashboard page={page} onPage={(next) => void navigate({ search: { page: next } })} userName={name} />
    </AppShell>
  );
}
