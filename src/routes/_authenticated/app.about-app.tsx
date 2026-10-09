import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/app/about-app")({
  beforeLoad: () => { throw redirect({ to: "/app/about", replace: true }); },
});
