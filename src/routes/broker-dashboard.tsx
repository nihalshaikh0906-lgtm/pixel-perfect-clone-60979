import { createFileRoute, redirect } from "@tanstack/react-router";
import { detectRole } from "@/lib/auth-role";

export const Route = createFileRoute("/broker-dashboard")({
  beforeLoad: async () => {
    const role = await detectRole();
    if (role === "company") {
      throw redirect({ to: "/owner-dashboard", replace: true });
    }
    throw redirect({ to: "/app", replace: true });
  },
});
