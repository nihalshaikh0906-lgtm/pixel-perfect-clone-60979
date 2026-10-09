import { createFileRoute } from "@tanstack/react-router";
import { LiveInventory } from "@/components/app/LiveInventory";
import { workspaceHead } from "@/components/app/WorkspacePlaceholder";
import { inventoryPageOptions } from "@/lib/inventory.functions";
import { inventorySearch } from "@/lib/inventory-category";

export const Route = createFileRoute("/_authenticated/app/rentals")({
  validateSearch: inventorySearch,
  loaderDeps: ({ search }) => search,
  loader: ({ context, deps }) => context.queryClient.ensureQueryData(inventoryPageOptions("rental", deps.page, deps.q)),
  errorComponent: ({ error }) => <div role="alert">Unable to load rentals: {error.message}</div>,
  notFoundComponent: () => <div>No rental inventory found.</div>,
  head: () => workspaceHead("Rentals"),
  component: Page,
});
function Page() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  return <LiveInventory title="Rentals" category="rental" {...search} onSearch={(next) => void navigate({ search: next })} />;
}
