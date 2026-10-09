import { createFileRoute } from "@tanstack/react-router";
import { WorkspacePlaceholder, workspaceHead } from "@/components/app/WorkspacePlaceholder";

export const Route = createFileRoute("/_authenticated/app/roles-permissions")({
  head: () => workspaceHead("Roles & Permissions"),
  component: Page,
});

function Page() {
  return <WorkspacePlaceholder title="Roles & Permissions" group="SYSTEM" />;
}
