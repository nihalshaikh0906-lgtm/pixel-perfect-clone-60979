import { createFileRoute } from "@tanstack/react-router";
import { LiveInventory } from "@/components/app/LiveInventory";
import { inventoryPageOptions } from "@/lib/inventory.functions";
import { inventorySearch } from "@/lib/inventory-category";
import { workspaceHead } from "@/components/app/WorkspacePlaceholder";

export const Route = createFileRoute("/_authenticated/app/offplan")({
  validateSearch: inventorySearch,
  loaderDeps: ({ search }) => search,
  loader: ({ context, deps }) => context.queryClient.ensureQueryData(inventoryPageOptions("offplan", deps.page, deps.q)),
  errorComponent: ({ error }) => <div role="alert">Unable to load units: {error.message}</div>,
  notFoundComponent: () => <div>No inventory found.</div>,
  head: () => workspaceHead("Offplan"),
  component: Page,
});

function Page() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  return <LiveInventory title="Offplan" category="offplan" {...search} onSearch={(next) => void navigate({ search: next })} />;
}
