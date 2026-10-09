import { createFileRoute, redirect } from "@tanstack/react-router";

// /rentals is a shortcut for the workspace page that lives inside the app shell.
export const Route = createFileRoute("/_authenticated/rentals")({
  beforeLoad: () => {
    throw redirect({ to: "/app/rentals" });
  },
  component: () => null,
});
