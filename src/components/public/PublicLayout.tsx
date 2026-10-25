import { Link } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { useState, type ReactNode } from "react";

const navCls = "border-b border-transparent pb-0.5 text-[13px] hover:text-[var(--bronze)]";
const active = { className: "border-[var(--bronze)] font-medium text-[var(--obsidian)]" };

export function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--silk)] text-[var(--obsidian)]">
      <header className="sticky top-0 z-30 border-b border-[var(--obsidian)]/10 bg-[var(--silk)]/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
          <Link to="/welcome" className="flex items-center gap-1.5 text-lg font-bold tracking-[0.25em]">
            DEALOS<span className="size-1.5 rounded-full bg-[var(--bronze)]" />
          </Link>
          <nav className="hidden gap-8 text-[#4B5272] md:flex">
            <Link to="/about" className={navCls} activeProps={active}>About Us</Link>
            <Link to="/faq" className={navCls} activeProps={active}>FAQ</Link>
            <Link to="/pricing" className={navCls} activeProps={active}>Pricing</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/demo" className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/25 flex items-center gap-1 shadow-xs">
              <span>Try Demo ⚡</span>
            </Link>
            <Link to="/login" search={{ mode: undefined }} className="text-[13px] font-medium hover:text-[var(--bronze)]">Login</Link>
            <Link to="/pricing" className="rounded-full bg-[var(--bronze)] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--silk)] hover:opacity-90">View Plans</Link>
          </div>
        </div>
        <nav className="flex items-center justify-center gap-5 pb-3 text-[#4B5272] md:hidden text-xs">
          <Link to="/demo" className="font-bold text-emerald-600 dark:text-emerald-400">Try Demo ⚡</Link>
          <Link to="/about" className={navCls} activeProps={active}>About Us</Link>
          <Link to="/faq" className={navCls} activeProps={active}>FAQ</Link>
          <Link to="/pricing" className={navCls} activeProps={active}>Pricing</Link>
        </nav>
      </header>
      <main>{children}</main>
      <footer className="border-t border-[var(--obsidian)]/10 px-6 py-8 text-center text-xs text-[#4B5272]">
        © {new Date().getFullYear()} DealOS Technologies Ltd. · Institutional OS for Dubai real estate brokerages
      </footer>
    </div>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--bronze)]">{children}</p>;
}

export function Accordion({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="border-t border-[var(--obsidian)]/10">
      {items.map((f, n) => (
        <div key={f.q} className="border-b border-[var(--obsidian)]/10">
          <button onClick={() => setOpen(open === n ? null : n)} className="flex w-full items-center justify-between gap-4 py-5 text-left text-[16px] font-medium">
            {f.q}
            <ChevronDown className={`size-4 shrink-0 transition-transform ${open === n ? "rotate-180" : ""}`} />
          </button>
          {open === n ? <p className="max-w-2xl pb-5 text-[15px] text-[#4B5272]">{f.a}</p> : null}
        </div>
      ))}
    </div>
  );
}

export function meta(title: string, description: string) {
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  };
}
