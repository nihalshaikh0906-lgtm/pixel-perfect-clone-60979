import { createFileRoute } from "@tanstack/react-router";
import { WorkspacePlaceholder, workspaceHead } from "@/components/app/WorkspacePlaceholder";

export const Route = createFileRoute("/_authenticated/app/tenancies")({
  head: () => workspaceHead("Tenancies"),
  component: Page,
});

function Page() {
  return <WorkspacePlaceholder title="Tenancies" group="MONEY" />;
}
