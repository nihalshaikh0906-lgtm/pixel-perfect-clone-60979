import { createFileRoute } from "@tanstack/react-router";
import { WorkspacePlaceholder, workspaceHead } from "@/components/app/WorkspacePlaceholder";

export const Route = createFileRoute("/_authenticated/app/appointments")({
  head: () => workspaceHead("Appointments"),
  component: Page,
});

function Page() {
  return <WorkspacePlaceholder title="Appointments" group="CRM" />;
}
