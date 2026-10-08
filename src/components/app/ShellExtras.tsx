import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { Bell, Check, Monitor, Moon, Plus, Sun, X } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const db = supabase as unknown as { from: (t: string) => any };
export type ThemePref = "light" | "dark" | "system";

export function useTheme() {
  const [pref, setPref] = useState<ThemePref>("light");
  const [dark, setDark] = useState(false);
  useEffect(() => { setPref((localStorage.getItem("dealos.theme") as ThemePref) || "light"); }, []);
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

type Notif = { id: string; title: string; body: string | null; link: string | null; is_read: boolean; created_at: string };

export function Notifications() {
  const [open, setOpen] = useState(false);
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => ((await db.from("notifications").select("*").order("created_at", { ascending: false }).limit(50)).data ?? []) as Notif[],
    refetchInterval: 60_000,
  });
  useEffect(() => {
    const ch = supabase.channel("notif").on("postgres_changes", { event: "*", schema: "public", table: "notifications" }, () => qc.invalidateQueries({ queryKey: ["notifications"] })).subscribe();
    return () => { void supabase.removeChannel(ch); };
  }, [qc]);
  const list = q.data ?? [];
  const unread = list.filter((n) => !n.is_read).length;
  const markAll = async () => {
    const ids = list.filter((n) => !n.is_read).map((n) => n.id);
    if (ids.length) await db.from("notifications").update({ is_read: true }).in("id", ids);
    void qc.invalidateQueries({ queryKey: ["notifications"] });
  };
  const read = async (id: string) => { await db.from("notifications").update({ is_read: true }).eq("id", id); void qc.invalidateQueries({ queryKey: ["notifications"] }); };
  return (
    <>
      <button type="button" className="a-btn a-btn-line a-bell" style={{ width: 42, padding: 0 }} aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`} onClick={() => setOpen(true)}>
        <Bell size={17} />{unread ? <span className="a-bell-n num">{unread > 99 ? "99+" : unread}</span> : null}
      </button>
      {open ? (
        <>
          <div className="a-scrim" style={{ display: "block" }} onClick={() => setOpen(false)} aria-hidden />
          <aside className="a-ndrawer" role="dialog" aria-label="Notifications">
            <header><h2>Notifications</h2><button type="button" className="a-btn a-btn-line" onClick={() => void markAll()} disabled={!unread}>Mark all read</button><button type="button" className="a-btn a-btn-line" style={{ width: 38, padding: 0 }} aria-label="Close" onClick={() => setOpen(false)}><X size={16} /></button></header>
            <div className="a-nlist">
              {list.map((n) => (
                <Link key={n.id} to={(n.link as "/app/crm") || "/app/crm"} className={`a-nitem ${n.is_read ? "" : "unread"}`} onClick={() => { void read(n.id); setOpen(false); }}>
                  <b>{n.title}</b>{n.body ? <span>{n.body}</span> : null}<small>{new Date(n.created_at).toLocaleString("en-GB", { timeZone: "Asia/Dubai", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</small>
                </Link>
              ))}
              {!list.length ? <p className="muted" style={{ padding: 20 }}>You're all caught up.</p> : null}
            </div>
          </aside>
        </>
      ) : null}
    </>
  );
}
