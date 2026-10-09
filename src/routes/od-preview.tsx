import { createFileRoute } from "@tanstack/react-router";

import { OwnerDashboard } from "@/pages/OwnerDashboard";

export const Route = createFileRoute("/od-preview")({
  component: () => (
    <div className="dapp" style={{ padding: 24 }}>
      <OwnerDashboard />
    </div>
  ),
});
