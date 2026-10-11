import { Link, useNavigate } from "@tanstack/react-router";
import { Bell, Check, Monitor, Moon, Plus, Sun, Inbox, CalendarClock, Eye, Banknote, Activity } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import * as Popover from "@radix-ui/react-popover";

export type ThemePref = "light" | "dark" | "system";

export function useTheme() {
  const [pref, setPref] = useState<ThemePref>("dark");
  const [dark, setDark] = useState(true);
  useEffect(() => { setPref((localStorage.getItem("dealos.theme") as ThemePref) || "dark"); }, []);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => setDark(pref === "dark" || (pref === "system" && mq.matches));
    apply(); mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [pref]);
  const set = (p: ThemePref) => { setPref(p); localStorage.setItem("dealos.theme", p); };
  return { pref, dark, set };
}

export function ThemeToggle({ pref, dark, set }: ReturnType<typeof useTheme>) {
  const [open, setOpen] = useState(false);
  return (
    <div className="a-pop-wrap">
      <button type="button" className="a-btn a-btn-line" style={{ width: 42, padding: 0 }} aria-label="Theme" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
        {dark ? <Moon size={17} /> : <Sun size={17} />}
      </button>
      {open ? (
        <div className="a-pop" role="menu">
          {([["light", Sun, "Light"], ["dark", Moon, "Dark"], ["system", Monitor, "System"]] as const).map(([k, I, l]) => (
            <button key={k} type="button" role="menuitemradio" aria-checked={pref === k} onClick={() => { set(k); setOpen(false); }}>
              <I size={15} /> {l} {pref === k ? <Check size={14} style={{ marginLeft: "auto" }} /> : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function AddMenu() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const go = (action: string, to: "/app/crm" | "/app/listings") => { setOpen(false); void navigate({ to, search: { action } as never }); };
  return (
    <div className="a-pop-wrap">
      <button type="button" className="a-btn a-btn-line" aria-expanded={open} onClick={() => setOpen((v) => !v)}><Plus size={16} /><span className="a-hide-sm">Add</span></button>
      {open ? (
        <div className="a-pop" role="menu">
          <button type="button" role="menuitem" onClick={() => go("add", "/app/crm")}>Add lead</button>
          <button type="button" role="menuitem" onClick={() => go("import", "/app/crm")}>Import leads</button>
          <button type="button" role="menuitem" onClick={() => go("add", "/app/listings")}>Add listing</button>
          <button type="button" role="menuitem" onClick={() => go("import", "/app/listings")}>Import listings</button>
        </div>
      ) : null}
    </div>
  );
}

// ═══ LIVE EXECUTIVE NOTIFICATION STREAM ═══
export type LiveAlert = {
  id: string;
  category: "leads" | "escrow" | "viewing" | "tenancy";
  title: string;
  description: string;
  time: string;
  badge: string;
  badgeColor: string;
  actionLabel: string;
  to: string;
  read: boolean;
};

const INITIAL_ALERTS: LiveAlert[] = [
  {
    id: "alert-1",
    category: "leads",
    title: "Elena Rostova viewed Bayz 102 Brochure",
    description: "Hot priority investor (AED 2.2M budget) inspected payment plan & floor plans.",
    time: "2 mins ago",
    badge: "Hot Investor",
    badgeColor: "bg-rose-500/15 text-rose-400 border-rose-500/30",
    actionLabel: "Open Dossier",
    to: "/app/leads",
    read: false,
  },
  {
    id: "alert-2",
    category: "leads",
    title: "Speed-to-Lead SLA Warning: 4 Mins",
    description: "New Bayut inquiry from Tariq Al-Hashimi (AED 3.5M cash) waiting for first response.",
    time: "4 mins ago",
    badge: "Urgent SLA",
    badgeColor: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    actionLabel: "Reply via WhatsApp",
    to: "/app/leads",
    read: false,
  },
  {
    id: "alert-3",
    category: "escrow",
    title: "Danube Properties: AED 190,000 Payout Verified",
    description: "DLD escrow confirmed Form F title registration milestone. Ready for drawdown voucher.",
    time: "45 mins ago",
    badge: "Commission Ready",
    badgeColor: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    actionLabel: "Claim Voucher",
    to: "/app/deals",
    read: false,
  },
  {
    id: "alert-4",
    category: "viewing",
    title: "VIP Viewing at 2:30 PM Today",
    description: "Dr. Sarah at Reef Luxury 995 DLRC suite with broker Aisha Khan. Digital gate pass active.",
    time: "Today 2:30 PM",
    badge: "Calendar",
    badgeColor: "bg-purple-500/15 text-purple-400 border-purple-500/30",
    actionLabel: "View Gate Pass",
    to: "/app/appointments",
    read: false,
  },
  {
    id: "alert-5",
    category: "tenancy",
    title: "Ejari 60-Day Renewal Notice",
    description: "Marina Arcade Suite 1404 lease reaches 60-day renewal window. DLD contract generated.",
    time: "Today",
    badge: "Ejari Renewal",
    badgeColor: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    actionLabel: "Open Lease",
    to: "/app/tenancies",
    read: false,
  },
];

export function Notifications() {
  const [open, setOpen] = useState(false);
  const [alerts, setAlerts] = useState<LiveAlert[]>(INITIAL_ALERTS);
  const [filter, setFilter] = useState<"all" | "leads" | "escrow" | "viewing">("all");

  const unreadCount = alerts.filter((a) => !a.read).length;

  const markAllRead = () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, read: true })));
  };

  const filtered = alerts.filter((a) => filter === "all" || a.category === filter);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <div className="a-pop-wrap">
        <Popover.Trigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="a-btn a-btn-line a-bell relative"
            aria-label={`Executive Notifications, ${unreadCount} unread`}
          >
            <Bell size={17} />
            {unreadCount > 0 && (
              <span className="a-bell-n num bg-rose-500 text-white font-bold">{unreadCount}</span>
            )}
          </Button>
        </Popover.Trigger>

        <Popover.Content
          align="end"
          sideOffset={8}
          collisionPadding={12}
          className="a-pop a-attention w-96 max-w-[calc(100vw-24px)] rounded-3xl border border-border/80 bg-card p-4 sm:p-5 shadow-2xl space-y-4"
          aria-label="Executive Action Alerts"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                <h2 className="text-sm font-extrabold text-foreground font-display m-0">Live Executive Radar</h2>
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {unreadCount > 0 ? `${unreadCount} urgent items requiring attention` : "All notifications reviewed"}
              </p>
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className="text-[11px] font-bold text-primary hover:underline cursor-pointer"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[11px] font-bold">
            {[
              { id: "all", label: `All (${alerts.length})` },
              { id: "leads", label: "Hot Leads" },
              { id: "escrow", label: "Escrow & Payouts" },
              { id: "viewing", label: "Viewings" },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setFilter(t.id as typeof filter)}
                className={`px-2.5 py-1 rounded-lg transition-all shrink-0 ${
                  filter === t.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-secondary/60 text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Alert Stream List */}
          <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-0.5">
            {filtered.map((item) => (
              <div
                key={item.id}
                className={`rounded-2xl border p-3 transition-all space-y-1.5 ${
                  item.read ? "bg-secondary/20 border-border/50 opacity-75" : "bg-secondary/40 border-border/80 hover:border-primary/50 shadow-sm"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className={`rounded-full px-2 py-0.2 text-[10px] font-mono font-bold border ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                  <span className="text-[10px] text-muted-foreground font-mono">{item.time}</span>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-foreground leading-snug">{item.title}</h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{item.description}</p>
                </div>

                <div className="pt-1 flex items-center justify-between">
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="h-7 text-[11px] font-bold border-border gap-1 hover:bg-primary hover:text-primary-foreground"
                    onClick={() => {
                      setAlerts((prev) => prev.map((a) => (a.id === item.id ? { ...a, read: true } : a)));
                      setOpen(false);
                    }}
                  >
                    <Link to={item.to}>
                      <span>{item.actionLabel}</span>
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs">
            <Button asChild variant="ghost" size="sm" className="h-8 text-xs font-bold text-muted-foreground hover:text-foreground p-0" onClick={() => setOpen(false)}>
              <Link to="/app/activity-logs">
                <Activity size={13} className="mr-1" />
                <span>View Full Audit Trail</span>
              </Link>
            </Button>
            <span className="text-[10px] text-muted-foreground font-mono">DLD Escrow Synced</span>
          </div>
        </Popover.Content>
      </div>
    </Popover.Root>
  );
}
