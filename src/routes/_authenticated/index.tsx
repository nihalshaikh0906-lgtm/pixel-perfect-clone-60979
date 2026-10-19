import { createFileRoute, redirect } from "@tanstack/react-router";
import { detectRole } from "@/lib/auth-role";

export const Route = createFileRoute("/_authenticated/")({
  beforeLoad: async () => {
    const role = await detectRole();
    if (role === "agent") {
      throw redirect({ to: "/app/leads", search: { queue: "all" }, replace: true });
    }
    throw redirect({ to: "/owner-dashboard", replace: true });
  },
});
