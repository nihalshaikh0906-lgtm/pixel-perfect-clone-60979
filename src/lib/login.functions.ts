import { createServerFn } from "@tanstack/react-start";

export const requestDemoSession = createServerFn({ method: "POST" })
  .inputValidator((input: { role?: "company" | "agent" }) => ({
    role: input?.role === "company" ? ("company" as const) : ("agent" as const),
  }))
  .handler(async ({ data }) => {
    const role = data.role === "company" ? "company" : "agent";
    return {
      ok: true,
      role,
      user: {
        id: role === "company" ? "demo-owner-user-1" : "demo-broker-user-1",
        email: role === "company" ? "owner-demo@dealos.ae" : "broker-demo@dealos.ae",
        role,
      },
    };
  });
