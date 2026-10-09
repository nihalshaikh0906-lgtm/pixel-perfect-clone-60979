import { createFileRoute } from "@tanstack/react-router";
import { WorkspacePlaceholder, workspaceHead } from "@/components/app/WorkspacePlaceholder";

export const Route = createFileRoute("/_authenticated/app/about-app")({
  head: () => workspaceHead("About App"),
  component: Page,
});

function Page() {
  return <WorkspacePlaceholder title="About App" group="SYSTEM" />;
}
