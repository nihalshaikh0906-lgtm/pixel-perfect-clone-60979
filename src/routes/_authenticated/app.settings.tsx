import { createFileRoute } from "@tanstack/react-router";
import { WorkspacePlaceholder, workspaceHead } from "@/components/app/WorkspacePlaceholder";

export const Route = createFileRoute("/_authenticated/app/settings")({
  head: () => workspaceHead("Settings"),
  component: Page,
});

function Page() {
  return <WorkspacePlaceholder title="Settings" group="SYSTEM" />;
}
