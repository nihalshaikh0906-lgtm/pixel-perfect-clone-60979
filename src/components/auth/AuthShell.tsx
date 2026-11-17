import { Link } from "@tanstack/react-router";
import { Logo as DealLogo } from "@/components/Logo";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { type ReactNode } from "react";

import "@/components/dealos/dealos.css";
import "./auth.css";

export function Logo({ size = 36 }: { size?: number }) {
  return (
    <Link
      to="/welcome"
      className="au-logo d-brand hover:opacity-90 transition-opacity"
      aria-label="DealOS home"
    >
      <DealLogo size={size} variant="gradient" />
    </Link>
  );
}

export function AuthShell({ children, leaving = false }: { children: ReactNode; leaving?: boolean }) {
  return (
    <div className={`dauth-split-wrapper ${leaving ? "is-leaving" : ""}`}>
      {/* ═══ LEFT HALF: DARK EMBER GRADIENT FIELD WITH FILM GRAIN ═══ */}
      <aside className="dauth-brand-pane">
        {/* Film grain noise overlay */}
        <div className="dauth-grain-overlay" aria-hidden="true" />

        {/* Ambient radial glows */}
        <div className="dauth-radial-glows" aria-hidden="true">
          <div className="dauth-glow dauth-glow-corner" />
          <div className="dauth-glow dauth-glow-mid" />
          <div className="dauth-glow dauth-glow-deep" />
        </div>

        {/* Brand header */}
        <div className="dauth-brand-content">
          <div className="dauth-brand-top">
            <Link to="/welcome" className="inline-flex items-center gap-3">
              <DealLogo size={34} variant="dark" textColor="#F3EEE6" />
            </Link>
          </div>

          <div className="dauth-brand-bottom">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-white/10 text-[#FF9A4A] border border-white/15">
                <span className="size-1.5 rounded-full bg-[#FF5A1F] animate-pulse" />
                OFFICIAL WORKSPACE PLATFORM
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#F3EEE6] tracking-tight font-display leading-tight">
                AI, software and SaaS, built in Dubai.
              </h2>
              <p className="text-xs sm:text-sm text-[#B3A9A0] leading-relaxed max-w-sm">
                Empowering licensed UAE real estate brokerages with instant DLD property intelligence and 45-second client pitch decks.
              </p>
            </div>

            <div className="pt-8 border-t border-white/10 flex items-center justify-between text-xs text-[#B3A9A0]">
              <div className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-[#1F7A4D]" />
                <span>RERA &amp; DLD Escrow Compliant</span>
              </div>
              <span className="font-mono text-[11px]">v2.4.0</span>
            </div>
          </div>
        </div>
      </aside>

      {/* ═══ RIGHT HALF: CLEAN WORKSPACE FORM ON #FBF8F3 ═══ */}
      <main className="dauth-form-pane">
        <div className="dauth-form-container">
          {/* Top navigation */}
          <div className="flex items-center justify-between mb-8">
            <Link
              to="/welcome"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#5E5650] hover:text-[#0B0B0B] transition-colors group px-3.5 py-1.5 rounded-full bg-white border border-[#ECE6DD] shadow-xs"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform text-[#D7190E]" />
              <span>Back to Overview</span>
            </Link>

            <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#FBE7E1] text-[#B8140B] border border-[#D7190E]/20">
              SECURE ACCESS
            </span>
          </div>

          {/* Form Card */}
          <div className="dauth-form-card">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
