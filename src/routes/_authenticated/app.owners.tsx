import { createFileRoute } from "@tanstack/react-router";
import { WorkspacePlaceholder, workspaceHead } from "@/components/app/WorkspacePlaceholder";

export const Route = createFileRoute("/_authenticated/app/owners")({
  head: () => workspaceHead("Owners"),
  component: Page,
});

function Page() {
  return <WorkspacePlaceholder title="Owners" group="CATALOG" />;
}
