import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, MessageCircle, ShieldCheck, ArrowRight, Building2 } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { WhatsAppHandoffCard } from './WhatsAppHandoffCard';
import { openWhatsAppDemo } from './WhatsAppInteractivePitchModal';

interface ProjectSample {
  id: string;
  community: string;
  icon: string;
  projectName: string;
  unit: string;
  price: string;
  yieldRate: string;
  escrowNum: string;
  paymentPlan: string;
  pitchBrief: string;
}

const SAMPLE_PROJECTS: ProjectSample[] = [
  {
    id: 'palm',
    community: 'Palm Jumeirah',
    icon: '🌴',
    projectName: 'The Royal Mansions · Emaar',
    unit: '2BR Waterfront Suite · 1,840 sqft',
    price: 'AED 8,950,000',
    yieldRate: '7.4% Gross ROI',
    escrowNum: 'DLD #4829 (100% Escrow Funded)',
    paymentPlan: '80% Construction · 20% Handover (Q4 2027)',
    pitchBrief:
      'Salam! Prepared your verified Palm Jumeirah allocation for The Royal Mansions (2BR Waterfront · AED 8.95M). 100% DLD escrow protected with 7.4% projected yield. Milestone: 80/20. Full project dossier attached.',
  },
  {
    id: 'downtown',
    community: 'Downtown Dubai',
    icon: '🏙️',
    projectName: 'Burj Crown Residence',
    unit: '1BR Opera View · 920 sqft',
    price: 'AED 2,850,000',
    yieldRate: '6.9% Gross ROI',
    escrowNum: 'DLD #9142 (Active Milestone)',
    paymentPlan: '70% During Build · 30% on Handover',
    pitchBrief:
      'Salam! Here is the prime Downtown Burj Crown 1BR (920 sqft · AED 2.85M) with unobstructed Opera views. DLD verified escrow #9142. Ready for immediate investor allocation.',
  },
  {
    id: 'hills',
    community: 'Dubai Hills',
    icon: '⛳',
    projectName: 'Club Villas by Emaar',
    unit: '4BR Standalone Golf Villa',
    price: 'AED 6,450,000',
    yieldRate: '6.5% Gross ROI',
    escrowNum: 'DLD #3108 (Construction 62%)',
    paymentPlan: '60/40 Post-Handover Linked',
    pitchBrief:
      'Salam! Sourced an exclusive 4BR Club Villa in Dubai Hills Estate (AED 6.45M · 60/40 payment plan). 62% DLD construction milestone completed. Viewings and deal room active.',
  },
];

export function HeroTestDriveWidget() {
  const [selectedId, setSelectedId] = useState<string>('palm');
  const [showPitch, setShowPitch] = useState<boolean>(false);

  const active = SAMPLE_PROJECTS.find((p) => p.id === selectedId) || SAMPLE_PROJECTS[0]!;

  return (
    <div className="w-full max-w-3xl mx-auto px-2 sm:px-4 mt-6 sm:mt-8">
      <div className="rounded-2xl sm:rounded-3xl border border-primary/25 bg-card/85 backdrop-blur-xl p-3.5 sm:p-6 shadow-2xl relative overflow-hidden text-left transition-all">
        {/* Top Header & Fast Filter Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 pb-3 border-b border-border/60">
          <div className="flex items-center gap-2 shrink-0">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            <span className="text-[11px] font-mono font-extrabold uppercase tracking-wider text-emerald-400">
              Interactive 3-Second Test Drive
            </span>
          </div>

          {/* 3 Community Fast Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none w-full sm:w-auto">
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
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 shrink-0 active:scale-95 ${
                    isSelected
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'bg-secondary/60 hover:bg-secondary text-muted-foreground hover:text-foreground border border-border/50'
                  }`}
                >
                  <span>{p.icon}</span>
                  <span>{p.community}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Project Details Box */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="pt-3.5 sm:pt-4 space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-base sm:text-lg font-black text-foreground font-display">
                  {active.projectName}
                </h4>
                <p className="text-xs text-muted-foreground font-medium mt-0.5">
                  {active.unit}
                </p>
              </div>

              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-lg sm:text-xl font-extrabold text-foreground font-mono">
                  {active.price}
                </span>
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                  {active.yieldRate}
                </span>
              </div>
            </div>

            {/* Escrow and Payment Plan Badges with Distinct Colors & Bold Typography */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2.5 p-2.5 sm:p-3 rounded-xl bg-blue-500/10 border border-blue-500/25">
                <div className="size-6 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                  <ShieldCheck size={14} />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-400 block">DLD Escrow Status</span>
                  <span className="text-foreground font-mono font-extrabold text-[11px] truncate block mt-0.5">
                    {active.escrowNum}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2.5 sm:p-3 rounded-xl bg-amber-500/10 border border-amber-500/25">
                <div className="size-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <Building2 size={14} />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 block">Payment Plan</span>
                  <span className="text-foreground font-mono font-extrabold text-[11px] truncate block mt-0.5">
                    {active.paymentPlan}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Trigger Row */}
            <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2.5">
              <button
                type="button"
                onClick={() => openWhatsAppDemo(active.id)}
                className="w-full sm:flex-1 min-h-[44px] py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-110 text-black font-black text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/25 transition-all cursor-pointer active:scale-98 text-center"
              >
                <MessageCircle size={15} className="shrink-0" />
                <span>Test WhatsApp Pitch (iPhone Demo)</span>
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setShowPitch((v) => !v)}
                  className="flex-1 sm:flex-initial h-11 px-3 sm:px-4 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground border border-border font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-98"
                >
                  <span>{showPitch ? 'Hide Brief' : 'Preview Brief'}</span>
                </button>

                <Link
                  to="/demo"
                  className="flex-1 sm:flex-initial h-11 px-3 sm:px-4 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground border border-border font-bold text-xs flex items-center justify-center gap-1.5 transition-all text-center"
                >
                  <span>Full Cockpit</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>

            {/* Instant WhatsApp Pitch & Dynamic Phone Handoff Box */}
            {showPitch && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-3"
              >
                <WhatsAppHandoffCard
                  text={active.pitchBrief}
                  title="WhatsApp Investor Script (Formatted for Dubai HNWIs)"
                  subtitle="Scan QR to open directly on your mobile device"
                  dealRoomUrl={`https://dealos.ae/deal-room/${active.id}`}
                />
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
