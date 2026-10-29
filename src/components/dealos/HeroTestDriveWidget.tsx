import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  MessageCircle,
  ShieldCheck,
  ArrowRight,
  Building2,
  CheckCircle2,
  TrendingUp,
  Award,
  Smartphone,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { WhatsAppHandoffCard } from './WhatsAppHandoffCard';
import { openWhatsAppDemo } from './WhatsAppInteractivePitchModal';

interface ProjectSample {
  id: string;
  community: string;
  category: string;
  icon: string;
  projectName: string;
  developer: string;
  unit: string;
  price: string;
  yieldRate: string;
  escrowNum: string;
  escrowStatus: string;
  paymentPlan: string;
  progressPercent: number;
  pitchBrief: string;
}

const SAMPLE_PROJECTS: ProjectSample[] = [
  {
    id: 'palm',
    community: 'Palm Jumeirah',
    category: 'Ultra-Luxury Waterfront',
    icon: '🌴',
    projectName: 'The Royal Mansions · Palm Jumeirah',
    developer: 'Emaar Signature Collection',
    unit: '2BR Waterfront Suite · 1,840 sqft · Private Beachfront',
    price: 'AED 8,950,000',
    yieldRate: '7.4% Net Yield',
    escrowNum: 'DLD Escrow #4829',
    escrowStatus: '100% Segregated · Central Bank Protected',
    paymentPlan: '80% Construction · 20% Handover (Q4 2027)',
    progressPercent: 80,
    pitchBrief:
      'Salam Dr. Mansoor! Prepared your verified Palm Jumeirah allocation for The Royal Mansions (2BR Waterfront Suite · 1,840 sqft · AED 8.95M). 100% DLD escrow protected (#4829) with 7.4% projected net rental yield. Milestone: 80% build / 20% handover. Full investor dossier and deal room active.',
  },
  {
    id: 'downtown',
    community: 'Downtown Dubai',
    category: 'Prime City & Opera District',
    icon: '🏙️',
    projectName: 'Burj Crown Residence · Downtown',
    developer: 'Emaar Properties',
    unit: '1BR Opera View · 920 sqft · High Floor',
    price: 'AED 2,850,000',
    yieldRate: '6.9% Net Yield',
    escrowNum: 'DLD Escrow #9142',
    escrowStatus: 'Active Milestone · RERA Audited',
    paymentPlan: '70% During Build · 30% on Handover',
    progressPercent: 70,
    pitchBrief:
      'Salam Dr. Mansoor! Sourced prime Downtown Burj Crown 1BR (920 sqft · AED 2.85M) with unobstructed Opera views. DLD verified escrow #9142. Ready for immediate cash investor allocation.',
  },
  {
    id: 'hills',
    community: 'Dubai Hills',
    category: 'Championship Golf Villa',
    icon: '⛳',
    projectName: 'Club Villas by Emaar · Dubai Hills',
    developer: 'Emaar Master Development',
    unit: '4BR Standalone Golf Villa · 3,450 sqft · Parkside',
    price: 'AED 6,450,000',
    yieldRate: '6.5% Net Yield',
    escrowNum: 'DLD Escrow #3108',
    escrowStatus: '62% Site Audit Verified',
    paymentPlan: '60/40 Post-Handover Linked',
    progressPercent: 62,
    pitchBrief:
      'Salam Dr. Mansoor! Exclusive 4BR Standalone Club Villa in Dubai Hills Estate (AED 6.45M · 60/40 payment plan). 62% DLD construction milestone completed. Full investor proforma and deal room ready.',
  },
];

export function HeroTestDriveWidget() {
  const [selectedId, setSelectedId] = useState<string>('palm');
  const [showPitch, setShowPitch] = useState<boolean>(false);

  const active = SAMPLE_PROJECTS.find((p) => p.id === selectedId) || SAMPLE_PROJECTS[0]!;

  return (
    <div className="w-full max-w-3xl mx-auto px-2 sm:px-4 mt-6 sm:mt-8">
      {/* Ambient Luxury Background Spotlight Glow */}
      <div className="relative">
        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-amber-500/20 via-emerald-500/20 to-primary/20 blur-xl opacity-70 pointer-events-none -z-10" />

        {/* Master Glassmorphic Card Container */}
        <div className="rounded-3xl border border-white/15 dark:border-white/10 bg-zinc-950/90 text-white backdrop-blur-2xl p-4 sm:p-7 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.65)] relative overflow-hidden text-left transition-all">
          {/* Top Header & Fast Filter Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
            {/* Live Interactive Badge */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="relative flex size-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full size-2.5 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.9)]" />
              </span>
              <div className="flex flex-col">
                <span className="text-[10px] sm:text-[11px] font-mono font-extrabold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <span>✦ INTERACTIVE 3-SECOND TEST DRIVE</span>
                </span>
                <span className="text-[10px] text-zinc-400 font-medium hidden sm:inline">
                  Real Dubai Off-Plan Data · 1-Click WhatsApp Delivery
                </span>
              </div>
            </div>

            {/* 3 Luxury Community Sliding Tabs */}
            <div className="inline-flex p-1 rounded-2xl bg-zinc-900/90 border border-white/10 backdrop-blur-md gap-1 overflow-x-auto scrollbar-none w-full sm:w-auto">
              {SAMPLE_PROJECTS.map((p) => {
                const isSelected = p.id === selectedId;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setSelectedId(p.id);
                      setShowPitch(false);
                    }}
                    className={`relative px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 shrink-0 select-none ${
                      isSelected
                        ? 'text-amber-300 font-extrabold'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {isSelected && (
                      <motion.div
                        layoutId="activeTabPill"
                        className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-500/25 via-primary/30 to-amber-500/25 border border-amber-400/50 shadow-[0_0_18px_rgba(245,158,11,0.35)]"
                        transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                      />
                    )}
                    <span className="relative z-10 text-sm">{p.icon}</span>
                    <span className="relative z-10">{p.community}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dynamic Animated Project Showcase Area */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="pt-4 sm:pt-5 space-y-4"
            >
              {/* Project Title, Category, and Financial Summary */}
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-mono font-bold uppercase tracking-wider">
                    <Award size={11} />
                    <span>{active.developer}</span>
                    <span className="text-amber-500/50">·</span>
                    <span>{active.category}</span>
                  </div>
                  <h4 className="text-xl sm:text-2xl font-black text-white font-display tracking-tight">
                    {active.projectName}
                  </h4>
                  <p className="text-xs sm:text-sm text-zinc-300 font-medium">
                    {active.unit}
                  </p>
                </div>

                {/* Price & Projected Yield Badge */}
                <div className="flex flex-row md:flex-col md:items-end justify-between items-baseline gap-1 pt-1 md:pt-0">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xs sm:text-sm font-bold text-zinc-400 font-mono">AED</span>
                    <span className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
                      {active.price.replace('AED ', '')}
                    </span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/35 text-emerald-400 text-[11px] font-mono font-bold shadow-[0_0_12px_rgba(16,185,129,0.25)]">
                    <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <TrendingUp size={12} />
                    <span>{active.yieldRate} (DLD Ejari)</span>
                  </div>
                </div>
              </div>

              {/* 2 Institutional Certification Cards (DLD Escrow + Milestone Progress) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                {/* Institutional Box 1: Dubai Land Department Escrow Assurance */}
                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-zinc-900/80 border border-emerald-500/30 hover:border-emerald-500/50 transition-colors shadow-inner">
                  <div className="size-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                    <ShieldCheck size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-emerald-400">
                        DLD Escrow Guarantee
                      </span>
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        100% Verified
                      </span>
                    </div>
                    <span className="text-white font-mono font-bold text-xs truncate block mt-0.5">
                      {active.escrowNum}
                    </span>
                    <span className="text-[10px] text-zinc-400 block mt-0.5 leading-tight">
                      {active.escrowStatus}
                    </span>
                  </div>
                </div>

                {/* Institutional Box 2: Payment Plan Milestone & Progress Bar */}
                <div className="flex flex-col justify-between p-3.5 rounded-2xl bg-zinc-900/80 border border-amber-500/30 hover:border-amber-500/50 transition-colors shadow-inner">
                  <div className="flex items-start gap-3">
                    <div className="size-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
                      <Building2 size={18} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-amber-400">
                          Payment Plan Milestone
                        </span>
                        <span className="text-[9px] font-mono font-bold text-zinc-300">
                          {active.progressPercent}% Build
                        </span>
                      </div>
                      <span className="text-white font-mono font-bold text-xs truncate block mt-0.5">
                        {active.paymentPlan}
                      </span>
                    </div>
                  </div>

                  {/* Visual Milestone Progress Bar */}
                  <div className="mt-2.5 space-y-1">
                    <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden border border-white/5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${active.progressPercent}%` }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Trigger Row: WhatsApp Shimmer CTA + Secondary Cockpit Pill */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                {/* High-Ticket Shimmer Primary Button */}
                <button
                  type="button"
                  onClick={() => openWhatsAppDemo(active.id)}
                  className="group relative overflow-hidden flex-1 min-h-[48px] py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 hover:brightness-110 text-black font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_10px_25px_rgba(16,185,129,0.35)] transition-all cursor-pointer active:scale-[0.98]"
                >
                  {/* Subtle animated moving sheen */}
                  <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

                  <MessageCircle size={17} className="shrink-0 fill-black/10" />
                  <span>Generate 45-Second WhatsApp Brief</span>
                  <span className="hidden sm:inline-flex items-center text-[10px] font-mono font-bold bg-black/15 px-2 py-0.5 rounded-full border border-black/10">
                    HNWI Script
                  </span>
                </button>

                {/* Secondary Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setShowPitch((v) => !v)}
                    className="flex-1 sm:flex-initial h-12 px-3.5 sm:px-4 rounded-2xl bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 border border-white/10 hover:border-white/20 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-98"
                  >
                    {showPitch ? <EyeOff size={14} /> : <Eye size={14} />}
                    <span>{showPitch ? 'Hide Brief' : 'Preview Brief'}</span>
                  </button>

                  <Button
                    asChild
                    variant="outline"
                    className="flex-1 sm:flex-initial h-12 px-4 sm:px-5 rounded-2xl bg-zinc-900/90 hover:bg-zinc-800 text-white border-white/15 hover:border-amber-400/50 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Link to="/demo">
                      <span>Full Cockpit</span>
                      <ArrowRight size={14} className="text-amber-400" />
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Instant WhatsApp Pitch & Dynamic Phone Handoff Drawer */}
              <AnimatePresence>
                {showPitch && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -6 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -6 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="overflow-hidden pt-2"
                  >
                    <WhatsAppHandoffCard
                      text={active.pitchBrief}
                      title="WhatsApp Investor Brief (Formatted for Dubai HNWIs)"
                      subtitle="Scan QR to open directly on your mobile device"
                      dealRoomUrl={`https://dealos.ae/deal-room/${active.id}`}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
