import { Link } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";

import { useBrokerProfile } from "@/lib/broker";

const NAV_PILL =
  "rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-foreground transition-colors hover:bg-secondary";
const NAV_ACTIVE = "bg-secondary";

export function TopBar({
  title,
  subtitle,
  right,
}: {
  back?: boolean;
  title?: ReactNode;
  subtitle?: ReactNode;
  right?: ReactNode;
}) {
  const profile = useBrokerProfile();
  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1720px] flex-wrap items-center gap-4 px-6 py-3">
        <div className="flex items-center">
          <Link to="/app" className="flex items-baseline gap-1 font-display text-2xl tracking-[0.25em]">
            PROPFLOW<span className="size-1.5 rounded-full bg-primary" />
          </Link>
          <span className="mx-3 hidden h-5 border-r border-border lg:block" />
          <AgencyBadge company={profile?.company ?? null} />
        </div>

        <nav className="order-last flex w-full flex-wrap items-center justify-center gap-1 xl:order-none xl:w-auto xl:flex-1">
          <Link to="/app/leads" className={NAV_PILL}>
            Leads
          </Link>
          <Link to="/inventory" className={NAV_PILL} activeProps={{ className: NAV_ACTIVE }}>
            Inventory
          </Link>
          <Link to="/listings" className={NAV_PILL} activeProps={{ className: NAV_ACTIVE }}>
            My Listings
          </Link>
          <Link to="/market" className={NAV_PILL} activeProps={{ className: NAV_ACTIVE }}>
            Market Intel
          </Link>
          <Link to="/news" className={NAV_PILL} activeProps={{ className: NAV_ACTIVE }}>
            News
          </Link>
        </nav>

        {title || subtitle ? (
          <div className="hidden min-w-0 max-w-xs 2xl:block">
            {title ? <div className="truncate text-sm font-semibold uppercase tracking-wider">{title}</div> : null}
            {subtitle ? <div className="eyebrow truncate">{subtitle}</div> : null}
          </div>
        ) : null}
        {right}
      </div>
    </header>
  );
}

const AGENCY_KEY = "propflow.agency";
const DEFAULT_AGENCY = "Private Client Office";

function AgencyBadge({ company }: { company: string | null }) {
  const [agency, setAgency] = useState(DEFAULT_AGENCY);
  const [editing, setEditing] = useState(false);
  useEffect(() => {
    const saved = localStorage.getItem(AGENCY_KEY);
    if (company) setAgency(company);
    else if (saved) setAgency(saved);
  }, [company]);

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
