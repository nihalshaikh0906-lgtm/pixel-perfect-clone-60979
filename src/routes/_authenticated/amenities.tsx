import { createFileRoute, redirect } from "@tanstack/react-router";

// /amenities is a shortcut for the workspace page that lives inside the app shell.
export const Route = createFileRoute("/_authenticated/amenities")({
  beforeLoad: () => {
    throw redirect({ to: "/app/amenities" });
  },
  component: () => null,
});
