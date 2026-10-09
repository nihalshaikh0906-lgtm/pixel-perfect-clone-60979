import { createFileRoute } from "@tanstack/react-router";
import { WorkspacePlaceholder, workspaceHead } from "@/components/app/WorkspacePlaceholder";

export const Route = createFileRoute("/_authenticated/app/deals")({
  head: () => workspaceHead("Deals"),
  component: Page,
});

function Page() {
  return <WorkspacePlaceholder title="Deals" group="MONEY" />;
}
