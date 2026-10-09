import { createFileRoute } from "@tanstack/react-router";
import { WorkspacePlaceholder, workspaceHead } from "@/components/app/WorkspacePlaceholder";

export const Route = createFileRoute("/_authenticated/app/reports")({
  head: () => workspaceHead("Reports"),
  component: Page,
});

function Page() {
  return <WorkspacePlaceholder title="Reports" group="MONEY" />;
}
