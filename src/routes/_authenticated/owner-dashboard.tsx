import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/app/AppShell";
import { OwnerDashboard } from "@/pages/OwnerDashboard";

export const Route = createFileRoute("/_authenticated/owner-dashboard")({
  head: () => ({
    meta: [
      { title: "Executive Overview — DealOS CRM" },
      { name: "description", content: "Company owner dashboard: revenue, pipeline value, listings value and conversion rate." },
      { property: "og:title", content: "Executive Overview — DealOS CRM" },
      { property: "og:description", content: "Company owner dashboard: revenue, pipeline value, listings value and conversion rate." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: OwnerDashboardPage,
});

function OwnerDashboardPage() {
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
      <OwnerDashboard />
    </AppShell>
  );
}
