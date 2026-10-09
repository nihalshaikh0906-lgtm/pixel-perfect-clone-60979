import { createFileRoute } from "@tanstack/react-router";
import { WorkspacePlaceholder, workspaceHead } from "@/components/app/WorkspacePlaceholder";

export const Route = createFileRoute("/_authenticated/app/locations")({
  head: () => workspaceHead("Locations"),
  component: Page,
});

function Page() {
  return <WorkspacePlaceholder title="Locations" group="CATALOG" />;
}
