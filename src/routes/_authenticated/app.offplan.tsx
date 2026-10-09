import { createFileRoute } from "@tanstack/react-router";
import { InventoryPage } from "@/components/app/InventoryTable";
import { workspaceHead } from "@/components/app/WorkspacePlaceholder";

export const Route = createFileRoute("/_authenticated/app/offplan")({
  head: () => workspaceHead("Offplan"),
  component: Page,
});

function Page() {
  return <InventoryPage title="Offplan" blurb="Under-construction launches and payment-plan stock." category="offplan" />;
}
