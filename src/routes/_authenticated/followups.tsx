import { createFileRoute, redirect } from "@tanstack/react-router";

// /followups is a shortcut for the workspace page that lives inside the app shell.
export const Route = createFileRoute("/_authenticated/followups")({
  beforeLoad: () => {
    throw redirect({ to: "/app/follow-ups" });
  },
  component: () => null,
});
