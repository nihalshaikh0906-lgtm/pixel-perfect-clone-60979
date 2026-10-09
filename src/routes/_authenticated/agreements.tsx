import { createFileRoute, redirect } from "@tanstack/react-router";

// /agreements is a shortcut for the workspace page that lives inside the app shell.
export const Route = createFileRoute("/_authenticated/agreements")({
  beforeLoad: () => {
    throw redirect({ to: "/app/agreements" });
  },
  component: () => null,
});
