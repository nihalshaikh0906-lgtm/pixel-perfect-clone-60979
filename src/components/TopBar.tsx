import { useQueryClient } from "@tanstack/react-query";
import { Link, useRouter } from "@tanstack/react-router";
import { ArrowLeft, LogOut } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useBroker } from "@/lib/broker";
import { initials } from "@/lib/format";

export function TopBar({
  back,
  title,
  subtitle,
  right,
}: {
  back?: boolean;
  title?: ReactNode;
  subtitle?: ReactNode;
  right?: ReactNode;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const name = useBroker();

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    router.navigate({ to: "/login", replace: true });
  }

  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1720px] items-center gap-5 px-6 py-4">
        <div className="flex items-center">
          <Link to="/" className="flex items-baseline gap-1 font-display text-2xl tracking-[0.25em]">
            PROPFLOW<span className="size-1.5 rounded-full bg-primary" />
          </Link>
          <span className="mx-3 hidden h-5 border-r border-border lg:block" />
          <AgencyBadge />
        </div>
        {back ? (
          <Button asChild variant="outline" size="sm" className="rounded-full border-primary/40">
            <Link to="/">
              <ArrowLeft className="size-4" />
              Cockpit
            </Link>
          </Button>
        ) : null}
        <div className="hidden items-center gap-4 border-l border-border pl-5 text-xs text-muted-foreground xl:flex">
          <GstClock />
          <span className="flex items-center gap-2">
            <span className="gold-pulse size-2 rounded-full bg-primary" />
            AI Market Scanner Active
          </span>
        </div>
        <div className="min-w-0 flex-1">
          {title ? <div className="truncate text-lg font-semibold">{title}</div> : null}
          {subtitle ? <div className="eyebrow truncate">{subtitle}</div> : null}
        </div>
        {right}
        {name ? (
          <div className="hidden items-center gap-2.5 sm:flex">
            <span className="flex size-9 items-center justify-center rounded-full border border-primary bg-secondary text-xs font-semibold text-foreground">
              {initials(name)}
            </span>
            <span className="font-display text-lg font-semibold">{name}</span>
          </div>
        ) : null}
        <Button variant="ghost" size="sm" onClick={signOut} className="text-muted-foreground">
          <LogOut className="size-4" />
          Log out
        </Button>
      </div>
    </header>
  );
}

const AGENCY_KEY = "propflow.agency";
const DEFAULT_AGENCY = "Private Client Office";

function AgencyBadge() {
  const [agency, setAgency] = useState(DEFAULT_AGENCY);
  const [editing, setEditing] = useState(false);
  useEffect(() => {
    const saved = localStorage.getItem(AGENCY_KEY);
    if (saved) setAgency(saved);
  }, []);

  function commit(value: string) {
    const v = value.trim() || DEFAULT_AGENCY;
    setAgency(v);
    localStorage.setItem(AGENCY_KEY, v);
    setEditing(false);
  }

  return (
    <div className="hidden items-center gap-3 lg:flex">
      <div className="leading-tight">
        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Brokerage</p>
        {editing ? (
          <input
            autoFocus
            defaultValue={agency}
            onBlur={(e) => commit(e.currentTarget.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") commit(e.currentTarget.value);
              if (e.key === "Escape") setEditing(false);
            }}
            className="w-48 border-b border-primary/50 bg-transparent text-sm font-medium outline-none"
          />
        ) : (
          <button
            type="button"
            title="Click to edit agency name"
            onClick={() => setEditing(true)}
            className="text-sm font-medium hover:text-primary"
          >
            {agency}
          </button>
        )}
      </div>
      <span className="rounded-full border border-primary/40 px-2.5 py-0.5 text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
        ORN 12489 • DLD Verified
      </span>
    </div>
  );
}

function GstClock() {
  const [now, setNow] = useState<string | null>(null);
  useEffect(() => {
    const fmt = () =>
      new Date().toLocaleTimeString("en-GB", { timeZone: "Asia/Dubai", hour: "2-digit", minute: "2-digit", second: "2-digit" });
    setNow(fmt());
    const t = setInterval(() => setNow(fmt()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <span className="tabular-nums">
      <span className="eyebrow mr-1.5">GST UTC+4</span>
      {now ?? "--:--:--"}
    </span>
  );
}
