import { createFileRoute } from "@tanstack/react-router";
import { WorkspacePlaceholder, workspaceHead } from "@/components/app/WorkspacePlaceholder";

export const Route = createFileRoute("/_authenticated/app/trash")({
  head: () => workspaceHead("Trash"),
  component: Page,
});

function Page() {
  return <WorkspacePlaceholder title="Trash" group="SYSTEM" />;
}
