import { createFileRoute } from "@tanstack/react-router";
import { WorkspacePlaceholder, workspaceHead } from "@/components/app/WorkspacePlaceholder";

export const Route = createFileRoute("/_authenticated/app/ai-assistant")({
  head: () => workspaceHead("AI Assistant"),
  component: Page,
});

function Page() {
  return <WorkspacePlaceholder title="AI Assistant" group="GENERAL" />;
}
