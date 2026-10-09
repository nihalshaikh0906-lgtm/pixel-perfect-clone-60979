import { createFileRoute } from "@tanstack/react-router";
import { OffplanProjects } from "@/components/app/OffplanProjects";
import { offplanProjectsOptions } from "@/lib/inventory.functions";
import { inventorySearch } from "@/lib/inventory-category";
import { workspaceHead } from "@/components/app/WorkspacePlaceholder";

export const Route = createFileRoute("/_authenticated/app/offplan")({
  validateSearch: inventorySearch,
  loaderDeps: ({ search }) => search,
  loader: ({ context, deps }) => context.queryClient.ensureQueryData(offplanProjectsOptions(deps.page, deps.q)),
  errorComponent: ({ error }) => <div role="alert">Unable to load projects: {error instanceof Error ? error.message : "Please try again."}</div>,
  notFoundComponent: () => <div>No inventory found.</div>,
  head: () => workspaceHead("Offplan"),
  component: Page,
});

function Page() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  return <OffplanProjects {...search} onSearch={(next) => void navigate({ search: next })} />;
}
