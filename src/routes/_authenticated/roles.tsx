import { createFileRoute, redirect } from "@tanstack/react-router";

// /roles is a shortcut for the workspace page that lives inside the app shell.
export const Route = createFileRoute("/_authenticated/roles")({
  beforeLoad: () => {
    throw redirect({ to: "/app/roles-permissions" });
  },
  component: () => null,
});
