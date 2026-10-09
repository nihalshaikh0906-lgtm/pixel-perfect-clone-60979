import { createFileRoute } from "@tanstack/react-router";

import { OwnerDashboard } from "@/pages/OwnerDashboard";

export const Route = createFileRoute("/od-preview")({
  component: OdPreviewPage,
});

function OdPreviewPage() {
  return (
    <div className="dapp" style={{ padding: 24 }}>
      <OwnerDashboard />
    </div>
  );
}
