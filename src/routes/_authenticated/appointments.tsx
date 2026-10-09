import { createFileRoute, redirect } from "@tanstack/react-router";

// /appointments is a shortcut for the workspace page that lives inside the app shell.
export const Route = createFileRoute("/_authenticated/appointments")({
  beforeLoad: () => {
    throw redirect({ to: "/app/appointments" });
  },
  component: () => null,
});
