import { createFileRoute } from "@tanstack/react-router";
import { WorkspacePlaceholder, workspaceHead } from "@/components/app/WorkspacePlaceholder";

export const Route = createFileRoute("/_authenticated/app/amenities")({
  head: () => workspaceHead("Amenities"),
  component: Page,
});

function Page() {
  return <WorkspacePlaceholder title="Amenities" group="CATALOG" />;
}
