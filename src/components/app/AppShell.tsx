import { useQueryClient } from "@tanstack/react-query";
import { LogoMark } from "@/components/Logo";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Building2, CalendarClock, ChevronsLeft, ChevronsRight, Construction, Home, Inbox, Key, LineChart, MapPinned,
  Menu, Settings, Sparkles, Search, LogOut, User, CalendarDays, Handshake, KeyRound,
  FileSignature, Users, Trees, Activity, Trash2, ShieldCheck, Info,
} from "lucide-react";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";

import { AiChat } from "./AiChat";
import { AddMenu, Notifications, ThemeToggle, useTheme } from "./ShellExtras";
import { supabase } from "@/integrations/supabase/client";

type ShellCtx = { clientMode: boolean; openAi: () => void };
const Ctx = createContext<ShellCtx>({ clientMode: false, openAi: () => {} });
export const useShell = () => useContext(Ctx);

type Item = {
  label: string;
  desc: string;
  to: string;
  icon: typeof Home;
  badge?: number;
  exact?: boolean;
  adminOnly?: boolean;
};

type TooltipState = {
  label: string;
  desc: string;
  badge?: number;
  top: number;
} | null;

export function AppShell({ children, userName, initials, agency }: { children: ReactNode; userName: string; initials: string; agency: string }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  // Default to collapsed rail (Gemini-style)
  const [collapsed, setCollapsed] = useState(true);
  const [drawer, setDrawer] = useState(false);
  const [clientMode, setClientMode] = useState(false);
  const [ai, setAi] = useState(false);
  const [q, setQ] = useState("");
  const [userMenu, setUserMenu] = useState(false);
  const [tooltip, setTooltip] = useState<TooltipState>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const signOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    void navigate({ to: "/login", search: { mode: undefined }, replace: true });
  };

  const groups: { title: string; items: Item[] }[] = [
    { title: "GENERAL", items: [
      { label: "Dashboard", desc: "Executive Cockpit & Agency Oversight", to: "/owner-dashboard", icon: Home, exact: true },
      { label: "AI Assistant", desc: "Strategic CEO Mastermind & Copilot", to: "/app/ai-assistant", icon: Sparkles },
    ] },
    { title: "INVENTORY", items: [
      { label: "Offplan", desc: "1,450+ Verified Dubai Developments & Escrow", to: "/app/offplan", icon: Construction },
      { label: "Ready Property", desc: "Secondary Resales & Handed-over Units", to: "/app/listings", icon: Building2 },
      { label: "Rentals", desc: "Ejari Tenancies & Leasehold Listings", to: "/app/rentals", icon: Key },
    ] },
    { title: "CRM", items: [
      { label: "Leads", desc: "Investor Inbox & Speed-to-Lead Follow-ups", to: "/app/leads", icon: Inbox },
      { label: "Follow-Ups", desc: "Scheduled Reminders & Client Outreach", to: "/app/follow-ups", icon: CalendarClock },
      { label: "Appointments", desc: "Calendar Viewings & Investor Meetings", to: "/app/appointments", icon: CalendarDays },
    ] },
    { title: "MONEY", items: [
      { label: "Deals", desc: "Closed Sales Pipeline & Buyer Milestones", to: "/app/deals", icon: Handshake },
      { label: "Tenancies", desc: "Active Lease Contracts & Ejari Renewals", to: "/app/tenancies", icon: KeyRound },
      { label: "Agreements", desc: "DLD Form A/B/F & Official PDF Contracts", to: "/app/agreements", icon: FileSignature },
      { label: "Reports", desc: "Q4 Financial GMV & Broker Performance", to: "/app/reports", icon: LineChart },
    ] },
    { title: "CATALOG", items: [
      { label: "Owners", desc: "Landlords & Master Developer Directory", to: "/app/owners", icon: Users },
      { label: "Locations", desc: "Dubai Master Communities & Map Registry", to: "/app/locations", icon: MapPinned },
      { label: "Amenities", desc: "Tower Features & Luxury Specifications", to: "/app/amenities", icon: Trees },
    ] },
    { title: "SYSTEM", items: [
      { label: "Users Management", desc: "Broker Accounts & Team Access", to: "/app/users", icon: Users, adminOnly: true },
      { label: "Settings", desc: "WhatsApp API & Agency Configuration", to: "/app/settings", icon: Settings },
      { label: "Activity Logs", desc: "Audit Trail & Compliance History", to: "/app/activity-logs", icon: Activity, adminOnly: true },
      { label: "Trash", desc: "Archived Leads & Deleted Records", to: "/app/trash", icon: Trash2, adminOnly: true },
      { label: "Roles & Permissions", desc: "Security Scopes & Commission Splits", to: "/app/roles-permissions", icon: ShieldCheck, adminOnly: true },
      { label: "My Account", desc: "Personal Profile & Broker Credentials", to: "/app/my-account", icon: User },
      { label: "About App", desc: "Platform Architecture & DLD Version", to: "/app/about", icon: Info },
    ] },
  ];

  useEffect(() => { setDrawer(false); }, [pathname]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (e.key === "/" && !(t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable))) { e.preventDefault(); searchRef.current?.focus(); }
      if (e.key === "Escape") { setAi(false); setDrawer(false); setTooltip(null); }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        setCollapsed((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const theme = useTheme();
  const [role, setRole] = useState<string | null>(null);
  useEffect(() => {
    void supabase.auth.getUser().then(({ data }) =>
      (supabase as unknown as { from: (t: string) => any })
        .from("org_members")
        .select("role")
        .eq("user_id", data.user?.id ?? "")
        .maybeSingle()
        .then((r: { data: { role: string } | null }) => setRole(r.data?.role ?? null))
    );
  }, []);

  const active = (it: Item) => (it.exact ? pathname === it.to || pathname === `${it.to}/` : pathname.startsWith(it.to));
  const isAdmin = role === "company_admin";
  const visibleGroups = groups
    .map((g) => ({ ...g, items: isAdmin ? g.items : g.items.filter((it) => !it.adminOnly) }))
    .filter((g) => g.items.length > 0);

  const handleMouseEnter = (e: React.MouseEvent<HTMLElement>, it: { label: string; desc: string; badge?: number }) => {
    if (!collapsed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({
      label: it.label,
      desc: it.desc,
      badge: it.badge,
      top: rect.top + rect.height / 2,
    });
  };

  const handleMouseLeave = () => {
    setTooltip(null);
  };

  return (
    <Ctx.Provider value={{ clientMode, openAi: () => setAi(true) }}>
      <div className={`dapp ${theme.dark ? "a-dark" : ""}`}>
        {drawer ? <div className="a-scrim" onClick={() => setDrawer(false)} aria-hidden /> : null}

        {/* ═══ GEMINI-STYLE SIDEBAR RAIL ═══ */}
        <aside
          className={`a-side ${collapsed ? "collapsed" : ""} ${drawer ? "open" : ""}`}
          aria-label="Workspace navigation"
        >
          {/* Top Logo Button: Toggles the entire sidebar like Gemini */}
          <div className="a-brand-wrap">
            <button
              type="button"
              className="a-logo-toggle"
              onClick={() => setCollapsed((v) => !v)}
              title={collapsed ? "Expand sidebar (⌘B)" : "Collapse sidebar (⌘B)"}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              onMouseEnter={(e) => handleMouseEnter(e, { label: "DealOS Navigation", desc: collapsed ? "Click to expand sidebar" : "Click to collapse into icon rail" })}
              onMouseLeave={handleMouseLeave}
            >
              <LogoMark size={28} />
              {!collapsed && (
                <div className="a-brand-text flex items-center gap-2">
                  <span className="logo-word font-extrabold text-base">Deal<span className="text-gradient">OS</span></span>
                  <span className="a-demo text-[10px] uppercase font-bold tracking-wider">PRO</span>
                </div>
              )}
            </button>
            {!collapsed && (
              <button
                type="button"
                className="a-collapse-mini"
                onClick={() => setCollapsed(true)}
                title="Collapse to icon rail"
                aria-label="Collapse sidebar"
              >
                <ChevronsLeft size={16} />
              </button>
            )}
          </div>

          {/* Navigation Items */}
          <nav className="a-nav">
            {visibleGroups.map((g) => (
              <div className="a-group" key={g.title}>
                {!collapsed && <p>{g.title}</p>}
                {g.items.map((it) => (
                  <Link
                    key={it.to}
                    to={it.to}
                    className={`a-link ${active(it) ? "active" : ""}`}
                    aria-current={active(it) ? "page" : undefined}
                    onMouseEnter={(e) => handleMouseEnter(e, it)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <it.icon size={19} className="shrink-0" />
                    {!collapsed && <span className="truncate">{it.label}</span>}
                    {!collapsed && it.badge ? <span className="a-badge num">{it.badge}</span> : null}
                  </Link>
                ))}
              </div>
            ))}
          </nav>

          {/* Bottom Controls (Settings & User Profile) */}
          <div className="a-side-footer">
            <Link
              to="/app/settings"
              className={`a-link ${pathname.startsWith("/app/settings") ? "active" : ""}`}
              onMouseEnter={(e) => handleMouseEnter(e, { label: "Settings", desc: "WhatsApp API, Webhooks & Preferences" })}
              onMouseLeave={handleMouseLeave}
            >
              <Settings size={19} className="shrink-0" />
              {!collapsed && <span>Settings</span>}
            </Link>

            <div className="a-user-wrap">
              {userMenu ? (
                <div className="a-user-menu" role="menu">
                  <Link to="/app/my-account" role="menuitem" onClick={() => setUserMenu(false)}><User size={16} /> My Account</Link>
                  <Link to="/app/settings" role="menuitem" onClick={() => setUserMenu(false)}><Settings size={16} /> Settings</Link>
                  <button type="button" role="menuitem" onClick={() => void signOut()}><LogOut size={16} /> Log out</button>
                </div>
              ) : null}
              <button
                type="button"
                className="a-user"
                aria-haspopup="menu"
                aria-expanded={userMenu}
                aria-label="Account menu"
                onClick={() => setUserMenu((v) => !v)}
                onMouseEnter={(e) => handleMouseEnter(e, { label: userName, desc: `${role === "company_admin" ? "Company Owner" : "Licensed Broker"} · ${agency}` })}
                onMouseLeave={handleMouseLeave}
              >
                <span className="a-avatar">{initials}</span>
                {!collapsed && (
                  <span className="a-user-text">
                    <b>{userName}</b>
                    <small>{role === "company_admin" ? "Owner" : "Broker"} · {agency}</small>
                  </span>
                )}
              </button>
            </div>
          </div>
        </aside>

        {/* ═══ FLOATING GEMINI-STYLE HOVER TOOLTIP ═══ */}
        {collapsed && tooltip && (
          <div
            className="fixed z-50 pointer-events-none transform -translate-y-1/2 flex items-center animate-in fade-in-50 zoom-in-95 duration-150"
            style={{ left: 74, top: tooltip.top }}
          >
            <div className="bg-zinc-950/95 dark:bg-zinc-900/95 text-white backdrop-blur-md border border-zinc-800/80 px-3.5 py-2 rounded-xl shadow-2xl flex flex-col gap-0.5 whitespace-nowrap min-w-[120px]">
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>{tooltip.label}</span>
                {tooltip.badge ? (
                  <span className="bg-primary/20 text-primary text-[10px] px-1.5 py-0.2 rounded-full font-mono">
                    {tooltip.badge}
                  </span>
                ) : null}
              </div>
              {tooltip.desc ? (
                <div className="text-[11px] text-zinc-400 font-normal">
                  {tooltip.desc}
                </div>
              ) : null}
            </div>
          </div>
        )}

        {/* ═══ EXPANSIVE FULL-SCREEN MAIN WORKSPACE ═══ */}
        <div className="a-main">
          <header className="a-top">
            <button
              type="button"
              className="a-btn a-btn-line a-menu"
              style={{ width: 42, padding: 0 }}
              aria-label="Open navigation"
              onClick={() => setDrawer(true)}
            >
              <Menu size={18} />
            </button>

            <form
              className="a-search"
              role="search"
              onSubmit={(e) => {
                e.preventDefault();
                void navigate({ to: "/app/leads", search: { queue: "all", q: q.trim() || undefined } });
              }}
            >
              <Search size={16} />
              <input
                ref={searchRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search leads, projects, units, areas…"
                aria-label="Search"
              />
              <kbd className="a-hide-sm">/</kbd>
            </form>

            <div className="a-top-actions">
              <button
                type="button"
                className="a-btn a-btn-line a-hide-sm"
                aria-pressed={clientMode}
                onClick={() => setClientMode((v) => !v)}
                title="Hides commission and internal notes"
              >
                Client mode: {clientMode ? "on" : "off"}
              </button>
              <AddMenu />
              <Notifications />
              <ThemeToggle {...theme} />
            </div>
          </header>

          {/* Full Screen Main Content */}
          <main className="a-content">{children}</main>
        </div>

        {ai ? (
          <div className="a-panel" role="dialog" aria-label="DealOS AI">
            <AiChat
              title="DealOS AI"
              onClose={() => setAi(false)}
              suggestions={[
                "Which leads should I call first today?",
                "Draft a WhatsApp reply for a new off-plan lead",
                "How do I keep cold leads warm?",
              ]}
            />
          </div>
        ) : null}
        <button
          type="button"
          className="a-fab"
          aria-label={ai ? "Close DealOS AI" : "Open DealOS AI"}
          onClick={() => setAi((v) => !v)}
        >
          <Sparkles size={22} />
        </button>
      </div>
    </Ctx.Provider>
  );
}

/** Count-up for KPI numbers; respects reduced motion. */
export function useCountUp(target: number, ms = 900) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setV(target); return; }
    let raf = 0; const start = performance.now();
    const tick = (t: number) => { const p = Math.min(1, (t - start) / ms); setV(target * (1 - Math.pow(1 - p, 3))); if (p < 1) raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return v;
}
