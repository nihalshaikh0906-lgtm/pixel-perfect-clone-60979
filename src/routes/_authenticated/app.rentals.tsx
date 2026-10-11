import { createFileRoute } from "@tanstack/react-router";
import { RentalInventory } from "@/components/app/RentalInventory";
import { workspaceHead } from "@/components/app/WorkspacePlaceholder";
import { inventorySearch } from "@/lib/inventory-category";

export const Route = createFileRoute("/_authenticated/app/rentals")({
  validateSearch: inventorySearch,
  head: () => workspaceHead("Rentals"),
  component: Page,
});

function Page() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  return <RentalInventory q={search.q} onSearch={(next) => void navigate({ search: next })} />;
}
