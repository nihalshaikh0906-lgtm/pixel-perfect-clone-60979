// TEMPORARY: unauthenticated render check for the Owner Dashboard layout. Delete after verifying.
import { createFileRoute } from "@tanstack/react-router";

import { OwnerDashboard } from "@/pages/OwnerDashboard";

export const Route = createFileRoute("/od-preview")({
  component: OdPreview,
});

function OdPreview() {
  return (
    <div className="dapp" style={{ padding: 24, background: "var(--a-bg)" }}>
      <OwnerDashboard />
    </div>
  );
}
