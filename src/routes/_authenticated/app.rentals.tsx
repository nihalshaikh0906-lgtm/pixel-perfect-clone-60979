import { createFileRoute } from "@tanstack/react-router";
import { InventoryPage } from "@/components/app/InventoryTable";
import { workspaceHead } from "@/components/app/WorkspacePlaceholder";

export const Route = createFileRoute("/_authenticated/app/rentals")({
  head: () => workspaceHead("Rentals"),
  component: Page,
});

function Page() {
  return <InventoryPage title="Rentals" blurb="Leasing stock with annual rents." category="rental" rent />;
}
