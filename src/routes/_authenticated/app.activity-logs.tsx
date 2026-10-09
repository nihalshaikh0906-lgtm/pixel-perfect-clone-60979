import { createFileRoute } from "@tanstack/react-router";
import { WorkspacePlaceholder, workspaceHead } from "@/components/app/WorkspacePlaceholder";

export const Route = createFileRoute("/_authenticated/app/activity-logs")({
  head: () => workspaceHead("Activity Logs"),
  component: Page,
});

function Page() {
  return <WorkspacePlaceholder title="Activity Logs" group="SYSTEM" />;
}
