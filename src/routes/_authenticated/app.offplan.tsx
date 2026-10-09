import { createFileRoute } from "@tanstack/react-router";
import { WorkspacePlaceholder, workspaceHead } from "@/components/app/WorkspacePlaceholder";

export const Route = createFileRoute("/_authenticated/app/offplan")({
  head: () => workspaceHead("Offplan"),
  component: Page,
});

function Page() {
  return <WorkspacePlaceholder title="Offplan" group="CRM" />;
}
