import { createFileRoute } from "@tanstack/react-router";
import { WorkspacePlaceholder, workspaceHead } from "@/components/app/WorkspacePlaceholder";

export const Route = createFileRoute("/_authenticated/app/follow-ups")({
  head: () => workspaceHead("Follow-Ups"),
  component: Page,
});

function Page() {
  return <WorkspacePlaceholder title="Follow-Ups" group="CRM" />;
}
