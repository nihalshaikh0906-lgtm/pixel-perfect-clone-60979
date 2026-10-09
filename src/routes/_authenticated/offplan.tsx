import { createFileRoute, redirect } from "@tanstack/react-router";

// /offplan is a shortcut for the workspace page that lives inside the app shell.
export const Route = createFileRoute("/_authenticated/offplan")({
  beforeLoad: () => {
    throw redirect({ to: "/app/offplan" });
  },
  component: () => null,
});
