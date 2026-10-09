import { Link, useNavigate } from "@tanstack/react-router";
import { Bell, Check, Monitor, Moon, Plus, Sun, Inbox, CalendarClock } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import * as Popover from "@radix-ui/react-popover";

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

// Illustrative attention counts only; these alerts never write to Supabase.
const attentionItems = [
  { title: "Unassigned leads", detail: "3 leads awaiting assignment", count: 3, icon: Inbox, to: "/app/crm" },
  { title: "Overdue follow-ups", detail: "2 follow-ups past their due date", count: 2, icon: CalendarClock, to: "/app/follow-ups" },
] as const;

export function Notifications() {
  const [open, setOpen] = useState(false);
  const total = attentionItems.reduce((sum, item) => sum + item.count, 0);
  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <div className="a-pop-wrap">
        <Popover.Trigger asChild>
          <Button variant="ghost" size="icon" className="a-btn a-btn-line a-bell" aria-label={`Needs Attention, ${total} demo alerts`}>
            <Bell size={17} /><span className="a-bell-n num">{total}</span>
          </Button>
        </Popover.Trigger>
        <Popover.Content align="end" sideOffset={8} collisionPadding={12} className="a-pop a-attention" aria-label="Needs Attention">
          <div className="a-card-head">
            <h2>Needs Attention</h2>
            <span className="a-chip c-stage">Demo data</span>
          </div>
          {attentionItems.map((item) => (
            <Button key={item.title} asChild variant="ghost" className="a-attention-item" onClick={() => setOpen(false)}>
              <Link to={item.to}>
                <item.icon size={18} />
                <span className="a-attention-copy"><b>{item.title}</b><small>{item.detail}</small></span>
                <span className="a-badge num">{item.count}</span>
              </Link>
            </Button>
          ))}
        </Popover.Content>
      </div>
    </Popover.Root>
  );
}
