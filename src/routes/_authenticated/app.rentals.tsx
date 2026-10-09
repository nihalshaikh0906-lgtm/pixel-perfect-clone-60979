import { createFileRoute } from "@tanstack/react-router";
import { WorkspacePlaceholder, workspaceHead } from "@/components/app/WorkspacePlaceholder";

export const Route = createFileRoute("/_authenticated/app/rentals")({
  head: () => workspaceHead("Rentals"),
  component: Page,
});

function Page() {
  return <WorkspacePlaceholder title="Rentals" group="CRM" />;
}
