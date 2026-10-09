import { createFileRoute } from "@tanstack/react-router";
import { WorkspacePlaceholder, workspaceHead } from "@/components/app/WorkspacePlaceholder";

export const Route = createFileRoute("/_authenticated/app/my-account")({
  head: () => workspaceHead("My Account"),
  component: Page,
});

function Page() {
  return <WorkspacePlaceholder title="My Account" group="SYSTEM" />;
}
