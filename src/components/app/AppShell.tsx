import { useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Bell, Building2, CalendarClock, ChevronsLeft, ChevronsRight, Home, Inbox, KeyRound, LineChart, MapPinned,
  Menu, Newspaper, Settings, Sparkles, Workflow, Wrench, Zap, Search, ListChecks, LogOut, User,
} from "lucide-react";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";

import { AiChat } from "./AiChat";
import { supabase } from "@/integrations/supabase/client";
import { queueCount } from "@/lib/demo-leads";

type ShellCtx = { clientMode: boolean; openAi: () => void };
const Ctx = createContext<ShellCtx>({ clientMode: false, openAi: () => {} });
export const useShell = () => useContext(Ctx);

type Item = { label: string; to: string; icon: typeof Home; badge?: number; exact?: boolean };

export function AppShell({ children, userName, initials, agency }: { children: ReactNode; userName: string; initials: string; agency: string }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [clientMode, setClientMode] = useState(false);
  const [ai, setAi] = useState(false);
  const [q, setQ] = useState("");
  const [userMenu, setUserMenu] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const signOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    void navigate({ to: "/login", search: { mode: undefined }, replace: true });
  };

  const groups: { title: string; items: Item[] }[] = [
    { title: "Work", items: [
      { label: "Home", to: "/app", icon: Home, exact: true },
      { label: "Leads inbox", to: "/app/leads", icon: Inbox, badge: queueCount("respond") },
      { label: "Pipelines", to: "/app/pipelines", icon: Workflow },
      { label: "Today", to: "/app/today", icon: CalendarClock, badge: queueCount("followup") },
    ] },
    { title: "Property", items: [
      { label: "Off-plan", to: "/app/off-plan", icon: Building2 },
      { label: "Ready to buy", to: "/app/ready", icon: KeyRound },
      { label: "Rentals", to: "/app/rentals", icon: Home },
      { label: "Areas", to: "/app/areas", icon: MapPinned },
      { label: "My listings", to: "/app/listings", icon: ListChecks },
    ] },
    { title: "Insight", items: [
      { label: "Market", to: "/app/market", icon: LineChart },
      { label: "Updates", to: "/app/updates", icon: Newspaper },
      { label: "Tools", to: "/app/tools", icon: Wrench },
    ] },
    { title: "Setup", items: [
      { label: "Automations", to: "/app/automations", icon: Zap },
      { label: "Settings", to: "/app/settings", icon: Settings },
    ] },
  ];

  useEffect(() => { setDrawer(false); }, [pathname]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (e.key === "/" && !(t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable))) { e.preventDefault(); searchRef.current?.focus(); }
      if (e.key === "Escape") { setAi(false); setDrawer(false); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const active = (it: Item) => (it.exact ? pathname === it.to || pathname === `${it.to}/` : pathname.startsWith(it.to));

  return (
    <Ctx.Provider value={{ clientMode, openAi: () => setAi(true) }}>
      <div className="dapp">
        {drawer ? <div className="a-scrim" onClick={() => setDrawer(false)} aria-hidden /> : null}
        <aside className={`a-side ${collapsed ? "collapsed" : ""} ${drawer ? "open" : ""}`} aria-label="Workspace navigation">
          <div className="a-brand"><span className="a-logo">D</span><span className="a-brand-text">DealOS</span><span className="a-demo a-brand-text">DEMO</span></div>
          <nav className="a-nav">
            {groups.map((g) => (
              <div className="a-group" key={g.title}>
                <p>{g.title}</p>
                {g.items.map((it) => (
                  <Link key={it.to} to={it.to} className={`a-link ${active(it) ? "active" : ""}`} title={collapsed ? it.label : undefined} aria-current={active(it) ? "page" : undefined}>
                    <it.icon size={18} /><span>{it.label}</span>
                    {it.badge ? <span className="a-badge num">{it.badge}</span> : null}
                  </Link>
                ))}
              </div>
            ))}
          </nav>
          <button type="button" className="a-collapse" onClick={() => setCollapsed((v) => !v)} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}>
            {collapsed ? <ChevronsRight size={16} /> : <><ChevronsLeft size={16} /> Collapse</>}
          </button>
          <div className="a-user-wrap">
            {userMenu ? (
              <div className="a-user-menu" role="menu">
                <Link to="/settings" role="menuitem"><User size={16} /> Profile</Link>
                <Link to="/app/$section" params={{ section: "settings" }} role="menuitem"><Settings size={16} /> Settings</Link>
                <button type="button" role="menuitem" onClick={() => void signOut()}><LogOut size={16} /> Log out</button>
              </div>
            ) : null}
            <button type="button" className="a-user" aria-haspopup="menu" aria-expanded={userMenu} aria-label="Account menu" onClick={() => setUserMenu((v) => !v)}>
              <span className="a-avatar">{initials}</span><span className="a-user-text"><b>{userName}</b><small>Broker · {agency}</small></span>
            </button>
          </div>
        </aside>

        <div className="a-main">
          <header className="a-top">
            <button type="button" className="a-btn a-btn-line a-menu" style={{ width: 42, padding: 0 }} aria-label="Open navigation" onClick={() => setDrawer(true)}><Menu size={18} /></button>
            <form className="a-search" role="search" onSubmit={(e) => { e.preventDefault(); void navigate({ to: "/app/leads", search: { queue: "all", q: q.trim() || undefined } }); }}>
              <Search size={16} />
              <input ref={searchRef} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search leads, projects, units, areas…" aria-label="Search" />
              <kbd className="a-hide-sm">/</kbd>
            </form>
            <div className="a-top-actions">
              <button type="button" className="a-btn a-btn-line a-hide-sm" aria-pressed={clientMode} onClick={() => setClientMode((v) => !v)} title="Hides commission and internal notes">
                Client mode: {clientMode ? "on" : "off"}
              </button>
              <button type="button" className="a-btn a-btn-line a-hide-sm" style={{ width: 42, padding: 0 }} aria-label="Notifications"><Bell size={17} /></button>
              <button type="button" className="a-btn a-btn-gold" onClick={() => setAi(true)}><Sparkles size={16} /><span className="a-ask-label">Ask AI</span></button>
            </div>
          </header>
          <main className="a-content">{children}</main>
        </div>

        {ai ? (
          <div className="a-panel" role="dialog" aria-label="DealOS AI">
            <AiChat title="DealOS AI" onClose={() => setAi(false)} suggestions={["Which leads should I call first today?", "Draft a WhatsApp reply for a new off-plan lead", "How do I keep cold leads warm?"]} />
          </div>
        ) : null}
        <button type="button" className="a-fab" aria-label={ai ? "Close DealOS AI" : "Open DealOS AI"} onClick={() => setAi((v) => !v)}><Sparkles size={22} /></button>
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
