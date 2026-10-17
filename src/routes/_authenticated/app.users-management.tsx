import { createFileRoute, redirect } from "@tanstack/react-router";

// /app/users-management keeps working as a shortcut for the page inside the workspace shell.
export const Route = createFileRoute("/_authenticated/app/users-management")({
  beforeLoad: () => {
    throw redirect({ to: "/app/users", search: { filter: undefined } });
  },
  component: () => null,
});
