import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { GeneralCopilot } from "@/components/GeneralCopilot";
import { ProfileWidget } from "@/components/ProfileWidget";

import { supabase } from "@/integrations/supabase/client";
import { enforceRemember } from "@/lib/remember";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    await enforceRemember();
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/welcome" });
    return { user: data.user };
  },
  component: () => (
    <>
      <Outlet />
      <ProfileWidget />
      <GeneralCopilot />
    </>
  ),
});
