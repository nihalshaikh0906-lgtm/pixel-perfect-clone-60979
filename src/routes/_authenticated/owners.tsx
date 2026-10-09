import { createFileRoute, redirect } from "@tanstack/react-router";

// /owners is a shortcut for the workspace page that lives inside the app shell.
export const Route = createFileRoute("/_authenticated/owners")({
  beforeLoad: () => {
    throw redirect({ to: "/app/owners" });
  },
  component: () => null,
});
