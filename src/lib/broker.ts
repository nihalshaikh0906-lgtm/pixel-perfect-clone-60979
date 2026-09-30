import { useEffect, useState } from "react";

import { supabase } from "@/integrations/supabase/client";

type UserLike = { email?: string | null; user_metadata?: Record<string, unknown> } | null;

function str(v: unknown) {
  return typeof v === "string" && v.trim() ? v.trim() : null;
}

/** Display name (uppercase) from user metadata, falling back to a cleaned email local part. */
export function brokerName(user: UserLike) {
  const meta = user?.user_metadata ?? {};
  const fromMeta = str(meta["first_name"]) ?? str(meta["full_name"]) ?? str(meta["name"]) ?? str(meta["display_name"]);
  if (fromMeta) return fromMeta.toUpperCase();
  const local = (user?.email ?? "").split("@")[0] ?? "";
  const cleaned = local.replace(/\d+/g, "").replace(/[._\-+]+/g, " ").trim();
  return cleaned ? cleaned.toUpperCase() : "BROKER";
}

export type BrokerProfile = { name: string; phone: string | null; instagram: string | null };

export function brokerProfile(user: UserLike): BrokerProfile {
  const meta = user?.user_metadata ?? {};
  const ig = str(meta["instagram_handle"]);
  return {
    name: brokerName(user),
    phone: str(meta["phone"]),
    instagram: ig ? `@${ig.replace(/^@/, "")}` : null,
  };
}

export function useBrokerProfile() {
  const [profile, setProfile] = useState<BrokerProfile | null>(null);
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setProfile(brokerProfile(data.user)));
  }, []);
  return profile;
}
