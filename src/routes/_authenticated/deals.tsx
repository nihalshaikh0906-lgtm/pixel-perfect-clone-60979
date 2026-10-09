import { createFileRoute, redirect } from "@tanstack/react-router";

// /deals is a shortcut for the workspace page that lives inside the app shell.
export const Route = createFileRoute("/_authenticated/deals")({
  beforeLoad: () => {
    throw redirect({ to: "/app/deals" });
  },
  component: () => null,
});
