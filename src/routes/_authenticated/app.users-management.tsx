import { createFileRoute } from "@tanstack/react-router";
import { WorkspacePlaceholder, workspaceHead } from "@/components/app/WorkspacePlaceholder";

export const Route = createFileRoute("/_authenticated/app/users-management")({
  head: () => workspaceHead("Users Management"),
  component: Page,
});

function Page() {
  return <WorkspacePlaceholder title="Users Management" group="SYSTEM" />;
}
