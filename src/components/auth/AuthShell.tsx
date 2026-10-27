import { Link } from "@tanstack/react-router";
import { Logo as DealLogo } from "@/components/Logo";
import { ArrowLeft, ShieldCheck, Sparkles } from "lucide-react";
import { type ReactNode } from "react";

import "@/components/dealos/dealos.css";
import "./auth.css";

export function Logo({ size = 42 }: { size?: number }) {
  return (
    <Link to="/welcome" className="au-logo d-brand hover:opacity-90 transition-opacity" style={{ fontSize: size * 0.6 }} aria-label="DealOS home">
      <DealLogo size={size} variant="light" />
    </Link>
  );
}

export function AuthShell({ children, leaving = false }: { children: ReactNode; leaving?: boolean; sections?: boolean }) {
  return (
    <div className={`dauth dauth-centered ${leaving ? "is-leaving" : ""}`}>
      {/* Radiant ambient glow orbs to prevent pale look and add rich depth */}
      <div className="au-ambient-glow" aria-hidden="true">
        <div className="au-orb au-orb-blue" />
        <div className="au-orb au-orb-purple" />
        <div className="au-orb au-orb-emerald" />
      </div>

      <div className="au-centered-wrapper">
        {/* Top Floating Navigation Bar */}
        <div className="au-top-nav">
          <Link
            to="/welcome"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-all group px-3.5 py-1.5 rounded-full bg-white/90 border border-slate-200/90 shadow-2xs hover:shadow-xs hover:border-slate-300"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform text-slate-500 group-hover:text-primary" />
            <span>Back to DealOS Overview</span>
          </Link>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-700 dark:text-emerald-500 text-[11px] font-mono font-bold shadow-2xs">
            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>RERA VERIFIED PORTAL</span>
          </div>
        </div>

        {/* Central Executive Glass Card */}
        <div className="au-centered-card">
          {children}
        </div>

        {/* Centered Footer */}
        <footer className="au-foot-centered">
          <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-slate-500">
            <ShieldCheck size={13} className="text-emerald-600" />
            <span>Dubai Land Department (DLD) &amp; RERA Broker Compliance Protocol</span>
          </div>
          <div className="flex items-center justify-center gap-4 text-xs text-slate-500 font-medium pt-1">
            <span>© 2026 DealOS Inc.</span>
            <span className="text-slate-300">·</span>
            <Link to="/privacy" className="hover:text-slate-800 transition-colors">Privacy Policy</Link>
            <span className="text-slate-300">·</span>
            <Link to="/terms" className="hover:text-slate-800 transition-colors">Terms of Service</Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
