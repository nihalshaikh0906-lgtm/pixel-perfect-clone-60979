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

export type BrokerProfile = { name: string; phone: string | null; instagram: string | null; email: string | null; company: string | null; logoPath: string | null };

export function brokerProfile(user: UserLike): BrokerProfile {
  const meta = user?.user_metadata ?? {};
  const ig = str(meta["instagram_handle"]);
  return {
    name: brokerName(user),
    phone: str(meta["phone"]),
    instagram: ig ? `@${ig.replace(/^@/, "")}` : null,
    email: user?.email ?? null,
    company: str(meta["company_name"]),
    logoPath: str(meta["company_logo_path"]),
  };
}

export function useBrokerProfile() {
  const [profile, setProfile] = useState<BrokerProfile | null>(null);
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setProfile(brokerProfile(data.user)));
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "USER_UPDATED" && session?.user) setProfile(brokerProfile(session.user));
    });
    return () => sub.subscription.unsubscribe();
  }, []);
  return profile;
}

/** Downloads the broker's private logo as a data URL (for PDFs/previews). */
export async function logoDataUrl(path: string | null): Promise<string | null> {
  if (!path) return null;
  const { data, error } = await supabase.storage.from("broker-logos").download(path);
  if (error || !data) return null;
  return await new Promise((resolve) => {
    const r = new FileReader();
    r.onload = () => resolve(typeof r.result === "string" ? r.result : null);
    r.onerror = () => resolve(null);
    r.readAsDataURL(data);
  });
}
