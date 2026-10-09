import { createFileRoute } from "@tanstack/react-router";
import { WorkspacePlaceholder, workspaceHead } from "@/components/app/WorkspacePlaceholder";

export const Route = createFileRoute("/_authenticated/app/agreements")({
  head: () => workspaceHead("Agreements"),
  component: Page,
});

function Page() {
  return <WorkspacePlaceholder title="Agreements" group="MONEY" />;
}
