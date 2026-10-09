import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/app/AppShell";
import { OwnerDashboard } from "@/pages/OwnerDashboard";
import { inventorySummaryOptions, projectPageOptions } from "@/lib/inventory.functions";

export const Route = createFileRoute("/_authenticated/owner-dashboard")({
  validateSearch: (s: Record<string, unknown>) => ({ page: Math.max(1, Math.floor(Number(s["page"]) || 1)) }),
  loaderDeps: ({ search }) => ({ page: search.page }),
  loader: async ({ context, deps }) => { await Promise.all([context.queryClient.ensureQueryData(inventorySummaryOptions()), context.queryClient.ensureQueryData(projectPageOptions(deps.page))]); },
  errorComponent: ({ error }) => <div role="alert">Unable to load inventory: {error.message}</div>,
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
      <OwnerDashboard page={page} onPage={(next) => void navigate({ search: { page: next } })} />
    </AppShell>
  );
}
