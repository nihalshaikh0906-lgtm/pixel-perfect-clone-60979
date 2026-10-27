import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, MessageCircle, ShieldCheck, CheckCheck, Copy, ArrowRight, Building2, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from '@tanstack/react-router';

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
  const [copied, setCopied] = useState<boolean>(false);

  const active = SAMPLE_PROJECTS.find((p) => p.id === selectedId) || SAMPLE_PROJECTS[0]!;

  const handleCopyPitch = () => {
    navigator.clipboard.writeText(active.pitchBrief);
    setCopied(true);
    toast.success('WhatsApp investor brief copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 mt-6 sm:mt-8">
      <div className="rounded-2xl sm:rounded-3xl border border-primary/25 bg-card/85 backdrop-blur-xl p-4 sm:p-6 shadow-2xl relative overflow-hidden text-left transition-all">
        {/* Top Header & Fast Filter Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/60">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            <span className="text-[11px] font-mono font-extrabold uppercase tracking-wider text-emerald-400">
              Interactive 3-Second Test Drive
            </span>
          </div>

          {/* 3 Community Fast Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
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
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 active:scale-95 ${
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
            className="pt-4 space-y-3"
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

              <div className="flex items-baseline gap-2">
                <span className="text-lg sm:text-xl font-extrabold text-foreground font-mono">
                  {active.price}
                </span>
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {active.yieldRate}
                </span>
              </div>
            </div>

            {/* Escrow and Payment Plan Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-secondary/40 border border-border/50">
                <ShieldCheck size={14} className="text-primary shrink-0" />
                <span className="text-muted-foreground font-mono text-[11px] truncate">
                  {active.escrowNum}
                </span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-secondary/40 border border-border/50">
                <Building2 size={14} className="text-amber-400 shrink-0" />
                <span className="text-muted-foreground font-mono text-[11px] truncate">
                  {active.paymentPlan}
                </span>
              </div>
            </div>

            {/* Action Trigger Row */}
            <div className="pt-1 flex flex-col sm:flex-row items-center gap-2.5">
              <button
                type="button"
                onClick={() => setShowPitch((v) => !v)}
                className="w-full sm:flex-1 h-11 px-4 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
              >
                <MessageCircle size={15} />
                <span>
                  {showPitch ? 'Hide WhatsApp Brief' : '⚡ Generate 45-Second WhatsApp Brief'}
                </span>
              </button>

              <Link
                to="/demo"
                className="w-full sm:w-auto h-11 px-4 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground border border-border font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
              >
                <span>Full Cockpit</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            {/* Instant WhatsApp Pitch Preview Box */}
            {showPitch && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-3 p-3.5 rounded-2xl bg-[#0B141A] border border-emerald-500/30 text-xs text-zinc-100 space-y-2.5 shadow-xl"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[11px] font-mono text-emerald-400 font-bold">
                      WhatsApp Investor Script (Formatted for Dubai HNWIs)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyPitch}
                    className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20"
                  >
                    {copied ? <CheckCheck size={12} /> : <Copy size={12} />}
                    <span>{copied ? 'Copied' : 'Copy Text'}</span>
                  </button>
                </div>

                <div className="bg-[#005c4b]/30 p-3 rounded-xl border border-emerald-500/20 text-[11px] leading-relaxed text-zinc-200">
                  {active.pitchBrief}
                </div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
