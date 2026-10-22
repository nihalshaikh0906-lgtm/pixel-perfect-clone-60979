import { useQueryClient } from "@tanstack/react-query";
import { LogoMark } from "@/components/Logo";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Building2, CalendarClock, ChevronsLeft, ChevronsRight, Construction, Home, Inbox, Key, LineChart, MapPinned,
  Menu, Settings, Sparkles, Search, LogOut, User, CalendarDays, Handshake, KeyRound,
  FileSignature, Users, Trees, Activity, Trash2, ShieldCheck, Info,
  Video, DollarSign, Layers, Crown, Megaphone, ChevronLeft, X,
} from "lucide-react";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";

import { AiChat } from "./AiChat";
import { AddMenu, Notifications, ThemeToggle, useTheme } from "./ShellExtras";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { detectRole, getStoredRole, setStoredRole, setActiveEmail, clearStoredRole, fullSignOut, type DealOSRole } from "@/lib/auth-role";

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
  const userMenuRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenu(false);
      }
    };
    if (userMenu) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [userMenu]);

  const signOut = async () => {
    await fullSignOut();
    await queryClient.cancelQueries();
    queryClient.clear();
    void navigate({ to: "/login", search: { mode: undefined }, replace: true });
  };

  const isOwnerRoute = pathname === "/owner-dashboard" || pathname.startsWith("/owner-dashboard");
  const [role, setRole] = useState<DealOSRole>(() => getStoredRole() ?? (isOwnerRoute ? "company" : "agent"));

  useEffect(() => {
    void detectRole().then((r) => setRole(r));
  }, []);

  const [executiveMode, setExecutiveMode] = useState<boolean>(() => {
    const r = getStoredRole();
    if (r === "agent") return false;
    return isOwnerRoute || r === "company";
  });

  useEffect(() => {
    if (role === "agent") {
      setExecutiveMode(false);
    } else if (isOwnerRoute || role === "company") {
      setExecutiveMode(true);
    }
  }, [isOwnerRoute, role]);

  const ownerGroups: { title: string; items: Item[] }[] = [
    {
      title: "OVERWATCH",
      items: [
        { label: "Executive Cockpit", desc: "Agency Overwatch & Speed to Lead", to: "/owner-dashboard", icon: Home, exact: true },
        { label: "Broker Leaderboard", desc: "12 Licensed Agents & Quotas", to: "/owner-dashboard#brokers", icon: Users },
        { label: "Deals Stages Radar", desc: "Inbound Leads, Pipeline & Form F", to: "/owner-dashboard#pipeline", icon: Layers },
      ],
    },
    {
      title: "GOVERNANCE",
      items: [
        { label: "Manage Users & Team", desc: "12 Licensed Agents & RERA Access", to: "/app/users", icon: Users, badge: 12 },
        { label: "Developer Debt", desc: "Danube & Emaar Overdue Commission Ledger", to: "/owner-dashboard#vouchers", icon: DollarSign },
        { label: "Owner AI Mastermind", desc: "Executive Decisions & Cashflow", to: "/owner-dashboard#mastermind", icon: Sparkles },
        { label: "Agency Settings", desc: "DLD License & Governance", to: "/app/settings?role=owner", icon: Settings },
      ],
    },
  ];

  const brokerGroups: { title: string; items: Item[] }[] = [
    {
      title: "BROKER DESK",
      items: [
        { label: "Broker Cockpit", desc: "Daily Deal Desk, Priority Tasks & Actions", to: "/app", icon: Home, exact: true },
        { label: "Leads Inbox", desc: "Investor Inbox & Priority Action Queue", to: "/app/leads", icon: Inbox },
        { label: "Broker AI Copilot", desc: "Strategic Mastermind & Real Estate Copilot", to: "/app/ai-assistant", icon: Sparkles },
      ],
    },
    {
      title: "INVENTORY",
      items: [
        { label: "Offplan", desc: "1,355+ Verified UAE Developments & Escrow", to: "/app/offplan", icon: Construction },
        { label: "Ready Property", desc: "Secondary Resales & Handed-over Units", to: "/app/listings", icon: Building2 },
        { label: "Rentals", desc: "Ejari Tenancies & Leasehold Listings", to: "/app/rentals", icon: Key },
      ],
    },
    {
      title: "CRM",
      items: [
        { label: "Follow-Ups", desc: "Scheduled Reminders & Client Outreach", to: "/app/follow-ups", icon: CalendarClock },
        { label: "Appointments", desc: "Calendar Viewings & Investor Meetings", to: "/app/appointments", icon: CalendarDays },
      ],
    },
    {
      title: "TRANSACTIONS",
      items: [
        { label: "Deals", desc: "Closed Sales Pipeline & Buyer Milestones", to: "/app/deals", icon: Handshake },
        { label: "Tenancies", desc: "Active Lease Contracts & Ejari Renewals", to: "/app/tenancies", icon: KeyRound },
        { label: "Agreements", desc: "DLD Form A/B/F & Official PDF Contracts", to: "/app/agreements", icon: FileSignature },
        { label: "Reports", desc: "Q4 Financial GMV & Broker Performance", to: "/app/reports", icon: LineChart },
      ],
    },
    {
      title: "MY WORKSPACE",
      items: [
        { label: "My Profile", desc: "Broker Profile & RERA BRN", to: "/app/my-account", icon: User },
        { label: "Broker Settings", desc: "WhatsApp API, Goals & Preferences", to: "/app/settings", icon: Settings },
      ],
    },
  ];

  const activeGroups = (role === "company" || (role !== "agent" && executiveMode)) ? ownerGroups : brokerGroups;

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

  const active = (it: Item) => {
    if (it.to.includes("#")) {
      const [path, hash] = it.to.split("#");
      const currentHash = typeof window !== "undefined" ? window.location.hash.replace("#", "") : "";
      return pathname === path && currentHash === hash;
    }
    return it.exact ? pathname === it.to || pathname === `${it.to}/` : pathname.startsWith(it.to);
  };

  const isAdmin = role === "company";
  const visibleGroups = activeGroups
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

  const isRootDashboard = pathname === "/app" || pathname === "/app/" || pathname === "/owner-dashboard";

  const getRouteMeta = (path: string): { title: string; parent?: string } => {
    if (path === "/app" || path === "/app/") return { title: "Broker Cockpit" };
    if (path.startsWith("/owner-dashboard")) return { title: "Executive Overwatch" };
    if (path.startsWith("/app/leads/")) return { title: "Lead Dossier", parent: "Leads" };
    if (path.startsWith("/app/leads")) return { title: "Leads Inbox" };
    if (path.startsWith("/app/project/")) return { title: "Project Dossier", parent: "Offplan" };
    if (path.startsWith("/app/deal-room/")) return { title: "Client Deal Room", parent: "Deals" };
    if (path.startsWith("/app/offplan")) return { title: "Offplan Catalog" };
    if (path.startsWith("/app/listings")) return { title: "Ready Property" };
    if (path.startsWith("/app/rentals")) return { title: "Rentals" };
    if (path.startsWith("/app/deals")) return { title: "Deals Pipeline" };
    if (path.startsWith("/app/appointments")) return { title: "Appointments" };
    if (path.startsWith("/app/follow-ups")) return { title: "Follow-ups" };
    if (path.startsWith("/app/settings")) return { title: "Broker Settings" };
    if (path.startsWith("/app/ai-assistant")) return { title: "AI Copilot" };
    if (path.startsWith("/app/my-account")) return { title: "My Profile" };
    if (path.startsWith("/app/users")) return { title: "Team & RERA Users" };
    if (path.startsWith("/app/reports")) return { title: "Reports" };
    if (path.startsWith("/app/agreements")) return { title: "DLD Agreements" };
    if (path.startsWith("/app/tenancies")) return { title: "Tenancy Contracts" };
    if (path.startsWith("/app/activity-logs")) return { title: "Activity Logs" };
    return { title: "Workspace" };
  };

  const routeMeta = getRouteMeta(pathname);

  const handleGoBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      window.history.back();
    } else {
      void navigate({ to: isRootDashboard ? "/welcome" : (role === "company" ? "/owner-dashboard" : "/app") });
    }
  };

  return (
    <Ctx.Provider value={{ clientMode, openAi: () => setAi(true) }}>
      <div className={`dapp ${theme.dark ? "a-dark" : ""}`}>
        {drawer ? <div className="a-scrim" onClick={() => setDrawer(false)} aria-hidden /> : null}

        {/* ═══ GEMINI-STYLE SIDEBAR RAIL ═══ */}
        <aside
          className={`a-side ${role === "company" || isOwnerRoute ? "owner-side-white" : ""} ${collapsed ? "collapsed" : ""} ${drawer ? "open" : ""}`}
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
                className="a-collapse-mini hidden md:inline-flex"
                onClick={() => setCollapsed(true)}
                title="Collapse to icon rail"
                aria-label="Collapse sidebar"
              >
                <ChevronsLeft size={16} />
              </button>
            )}
            <button
              type="button"
              className="a-collapse-mini md:hidden"
              onClick={() => setDrawer(false)}
              title="Close navigation"
              aria-label="Close navigation"
            >
              <X size={18} />
            </button>
          </div>

          {/* Persona Switcher Pill */}
          {!collapsed && (
            <div className="px-3 py-2 border-b border-border/50">
              {role === "agent" ? (
                <div className="rounded-xl bg-primary/10 border border-primary/30 p-2 text-xs flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <User size={14} className="text-primary shrink-0" />
                    <span className="font-extrabold text-[11px] text-primary truncate">Broker Desk</span>
                  </div>
                  <span className="text-[10px] text-primary/80 font-bold tracking-wider uppercase">Licensed Agent</span>
                </div>
              ) : (
                <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-2.5 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <Crown size={15} className="text-slate-800 shrink-0" />
                    <span className="font-bold text-[11.5px] text-slate-800 truncate">Agency Owner</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase">Executive</span>
                </div>
              )}
            </div>
          )}

          {collapsed && (
            <div className="flex justify-center py-2 border-b border-border/40">
              {role === "agent" ? (
                <div
                  className="size-8 rounded-xl flex items-center justify-center bg-primary/10 text-primary border border-primary/30"
                  title="Broker Desk Mode · Licensed Agent"
                  onMouseEnter={(e) =>
                    handleMouseEnter(e, {
                      label: "Broker Desk Mode",
                      desc: "Licensed Broker Leads, Properties & Deals Desk",
                    })
                  }
                  onMouseLeave={handleMouseLeave}
                >
                  <User size={15} />
                </div>
              ) : (
                <div
                  className="size-8 rounded-xl flex items-center justify-center bg-slate-100 text-slate-800 border border-slate-200"
                  title="Owner Cockpit Mode · Agency Owner"
                  onMouseEnter={(e) =>
                    handleMouseEnter(e, {
                      label: "Owner Cockpit Mode",
                      desc: "Agency Overwatch, GMV & Executive Radar",
                    })
                  }
                  onMouseLeave={handleMouseLeave}
                >
                  <Crown size={15} />
                </div>
              )}
            </div>
          )}

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
                    onClick={() => setDrawer(false)}
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

          {/* User Profile & Account Menu */}
          <div className="a-side-footer">
            <div className="a-user-wrap" ref={userMenuRef}>
              {userMenu ? (
                <div className="a-user-menu animate-in fade-in-50 zoom-in-95 duration-150" role="menu">
                  <div className="a-user-menu-head">
                    <span className="a-avatar sm">{initials}</span>
                    <div className="min-w-0">
                      <p className="font-bold text-xs truncate text-foreground">{userName}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{role === "company" ? "Company Owner & Principal" : "Property Consultant"} · {agency}</p>
                    </div>
                  </div>
                  <div className="a-user-menu-divider" />
                  {role === "company" && executiveMode ? (
                    <>
                      <Link
                        to="/app/my-account"
                        search={{ role: "owner" }}
                        role="menuitem"
                        className="a-user-menu-item"
                        onClick={() => setUserMenu(false)}
                      >
                        <Crown size={15} className="shrink-0 text-amber-400" />
                        <div className="flex flex-col text-left min-w-0">
                          <span className="font-semibold text-xs text-foreground">Owner Account</span>
                          <span className="text-[10px] text-muted-foreground truncate">ORN-28941 & DLD Credentials</span>
                        </div>
                      </Link>
                      <Link
                        to="/app/settings"
                        search={{ role: "owner" }}
                        role="menuitem"
                        className="a-user-menu-item"
                        onClick={() => setUserMenu(false)}
                      >
                        <Settings size={15} className="shrink-0 text-amber-400" />
                        <div className="flex flex-col text-left min-w-0">
                          <span className="font-semibold text-xs text-foreground">Agency Settings</span>
                          <span className="text-[10px] text-muted-foreground truncate">DLD Trakheesi, SLA & Security</span>
                        </div>
                      </Link>
                      <Link
                        to="/app/users"
                        role="menuitem"
                        className="a-user-menu-item"
                        onClick={() => setUserMenu(false)}
                      >
                        <Users size={15} className="shrink-0 text-emerald-400" />
                        <div className="flex flex-col text-left min-w-0">
                          <span className="font-semibold text-xs text-foreground">Manage Users & Team</span>
                          <span className="text-[10px] text-muted-foreground truncate">12 Licensed Agents & RERA BRN</span>
                        </div>
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/app/my-account"
                        search={{ role: undefined }}
                        role="menuitem"
                        className="a-user-menu-item"
                        onClick={() => setUserMenu(false)}
                      >
                        <User size={15} className="shrink-0 text-muted-foreground" />
                        <div className="flex flex-col text-left min-w-0">
                          <span className="font-semibold text-xs text-foreground">My Account</span>
                          <span className="text-[10px] text-muted-foreground truncate">Broker Profile & RERA BRN</span>
                        </div>
                      </Link>
                      <Link
                        to="/app/settings"
                        search={{ role: undefined }}
                        role="menuitem"
                        className="a-user-menu-item"
                        onClick={() => setUserMenu(false)}
                      >
                        <Settings size={15} className="shrink-0 text-muted-foreground" />
                        <div className="flex flex-col text-left min-w-0">
                          <span className="font-semibold text-xs text-foreground">Broker Settings</span>
                          <span className="text-[10px] text-muted-foreground truncate">WhatsApp API, Goals & Keys</span>
                        </div>
                      </Link>
                    </>
                  )}
                  <div className="a-user-menu-divider" />
                  <button
                    type="button"
                    role="menuitem"
                    className="a-user-menu-item a-user-menu-logout"
                    onClick={() => void signOut()}
                  >
                    <LogOut size={15} className="shrink-0" />
                    <span className="font-semibold text-xs">Log out</span>
                  </button>
                </div>
              ) : null}
              <button
                type="button"
                className={`a-user ${userMenu ? "active" : ""}`}
                aria-haspopup="menu"
                aria-expanded={userMenu}
                aria-label="Account menu"
                onClick={() => setUserMenu((v) => !v)}
                onMouseEnter={(e) => handleMouseEnter(e, { label: userName, desc: `${role === "company" ? "Company Owner" : "Licensed Broker"} · ${agency}` })}
                onMouseLeave={handleMouseLeave}
              >
                <span className="a-avatar">{initials}</span>
                {!collapsed && (
                  <span className="a-user-text">
                    <b>{userName}</b>
                    <small>{role === "company" ? "Owner" : "Broker"} · {agency}</small>
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

            {/* Universal Back Button for Phones, iPads & PCs */}
            <button
              type="button"
              onClick={handleGoBack}
              className="a-back-btn"
              aria-label="Go back"
              title="Go back to previous page"
            >
              <ChevronLeft size={16} className="text-primary shrink-0" />
              <span className="a-back-text">Back</span>
            </button>

            {/* Adaptive Route Meta Pill */}
            <div className="a-route-pill hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-secondary/60 border border-border/60 text-xs font-semibold text-foreground shrink-0">
              {routeMeta.parent && (
                <>
                  <span className="text-muted-foreground text-[11px]">{routeMeta.parent}</span>
                  <span className="text-muted-foreground/40 font-light text-[10px]">/</span>
                </>
              )}
              <span className="truncate max-w-[130px] lg:max-w-none">{routeMeta.title}</span>
            </div>

            {/* DLD / RERA Compliance License Pill */}
            <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-secondary/50 border border-border/50 text-[11px] font-bold text-foreground shrink-0">
              <ShieldCheck size={13} className="text-emerald-500 shrink-0" />
              <span>{role === "company" ? "DLD ORN-28941 · Agency Principal" : "RERA BRN-54109 · Licensed Broker"}</span>
            </div>

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
              {role === "agent" && (
                <button
                  type="button"
                  className={`a-btn a-btn-line a-hide-sm transition-all ${
                    clientMode ? "bg-amber-500/15 border-amber-500/50 text-amber-300 font-bold shadow-sm" : ""
                  }`}
                  aria-pressed={clientMode}
                  onClick={() => {
                    setClientMode((v) => {
                      const next = !v;
                      if (next) {
                        toast.success("Client Presentation Mode ON: Internal commissions, broker splits, and notes masked.");
                      } else {
                        toast.info("Broker Internal Mode: Full agency commission and internal data visible.");
                      }
                      return next;
                    });
                  }}
                  title="Hides commission and internal notes for client viewing"
                >
                  {clientMode ? "💎 Client Mode: ON" : "Client mode: off"}
                </button>
              )}
              {role === "agent" && <AddMenu />}
              <Notifications />
              <ThemeToggle {...theme} />
            </div>
          </header>

          {/* Full Screen Main Content with Live Ambient Background */}
          <main className="a-content relative">
            {/* ═══ 60 FPS HARDWARE-ACCELERATED AMBIENT GLOW (ZERO CONTINUOUS REPAINT) ═══ */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10 opacity-70 will-change-transform" aria-hidden="true">
              <div className="absolute -top-36 -left-36 size-[550px] rounded-full bg-gradient-to-br from-primary/8 via-indigo-500/4 to-transparent blur-2xl" />
              <div className="absolute top-1/3 -right-36 size-[500px] rounded-full bg-gradient-to-bl from-amber-500/5 via-rose-500/3 to-transparent blur-2xl" />
              <div className="absolute -bottom-36 left-1/4 size-[550px] rounded-full bg-gradient-to-tr from-cyan-500/5 via-primary/3 to-transparent blur-2xl" />
            </div>

            {clientMode && (
              <div className="mb-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/15 to-amber-500/5 border border-amber-500/40 px-5 py-3 flex items-center justify-between text-xs text-amber-300 shadow-sm animate-in fade-in duration-200">
                <div className="flex items-center gap-2.5">
                  <span className="size-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
                  <span className="font-extrabold uppercase tracking-wider text-[11px]">💎 Client Presentation Mode Active</span>
                  <span className="text-amber-300/80 hidden sm:inline">•</span>
                  <span className="text-amber-300/80 hidden sm:inline">Internal commissions, broker fee splits, and private notes are safely masked for client screen-sharing.</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setClientMode(false);
                    toast.info("Exited Client Presentation Mode.");
                  }}
                  className="text-[11px] font-bold text-amber-200 hover:text-white underline cursor-pointer shrink-0 ml-2"
                >
                  Exit Client Mode
                </button>
              </div>
            )}
            {children}
          </main>
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
