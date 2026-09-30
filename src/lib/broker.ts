import { useEffect, useState } from "react";

import { supabase } from "@/integrations/supabase/client";

/** Current hour/minute in Dubai (GST, UTC+4). */
export function dubaiNow() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Dubai",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? 0);
  const minute = parts.find((p) => p.type === "minute")?.value ?? "00";
  return { hour, label: `${String(hour).padStart(2, "0")}:${minute}` };
}

export function dubaiGreeting(hour: number) {
  if (hour >= 5 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 17) return "Good afternoon";
  if (hour >= 17 && hour < 22) return "Good evening";
  return "Good night";
}

/** Live Dubai clock, ticking every 15s. Null until mounted (avoids hydration mismatch). */
export function useDubaiClock() {
  const [now, setNow] = useState<ReturnType<typeof dubaiNow> | null>(null);
  useEffect(() => {
    setNow(dubaiNow());
    const t = setInterval(() => setNow(dubaiNow()), 15_000);
    return () => clearInterval(t);
  }, []);
  return now;
}

function titleCase(s: string) {
  return s
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0]!.toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

/** Display name from user metadata, falling back to a cleaned email local part. */
export function brokerName(user: { email?: string | null; user_metadata?: Record<string, unknown> } | null) {
  const meta = user?.user_metadata ?? {};
  const fromMeta = [meta["full_name"], meta["name"], meta["display_name"]].find(
    (v) => typeof v === "string" && v.trim(),
  ) as string | undefined;
  if (fromMeta) return titleCase(fromMeta.trim());
  const first = meta["first_name"];
  const last = meta["last_name"];
  if (typeof first === "string" && first.trim()) {
    return titleCase(`${first} ${typeof last === "string" ? last : ""}`);
  }
  const local = (user?.email ?? "").split("@")[0] ?? "";
  const cleaned = local.replace(/\d+/g, "").replace(/[._\-+]+/g, " ").trim();
  return cleaned ? titleCase(cleaned) : "Broker";
}

export function useBroker() {
  const [name, setName] = useState<string | null>(null);
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setName(brokerName(data.user)));
  }, []);
  return name;
}
