import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  X,
  Phone,
  Video,
  MoreVertical,
  CheckCheck,
  Send,
  Paperclip,
  Smile,
  Mic,
  Sparkles,
  Building2,
  ShieldCheck,
  Copy,
  ExternalLink,
  RotateCcw,
} from 'lucide-react';
import { toast } from 'sonner';

export interface PitchSample {
  id: string;
  tabLabel: string;
  icon: string;
  buyerName: string;
  buyerAvatar: string;
  buyerStatus: string;
  buyerQuery: string;
  queryTime: string;
  copilotMatchNote: string;
  pitchTitle: string;
  pitchBody: string;
  yieldStat: string;
  escrowNum: string;
  paymentPlan: string;
  dealRoomUrl: string;
  dealRoomName: string;
  replyTime: string;
}

export const PITCH_SAMPLES: PitchSample[] = [
  {
    id: 'palm',
    tabLabel: 'Palm Jumeirah · AED 8.95M',
    icon: '🌴',
    buyerName: 'Dr. Mansoor Al-Ketbi',
    buyerAvatar: 'MK',
    buyerStatus: 'VIP Cash Buyer · UAE HNWI',
    buyerQuery:
      'Salam brother, following up on our call. Looking for a 2BR on Palm Jumeirah with direct beach access and DLD escrow under AED 9M. Can you send numbers & milestone breakdown?',
    queryTime: '14:31',
    copilotMatchNote: 'DealOS matched 1 unit in 0.4s · DLD Escrow #4829 Verified',
    pitchTitle: 'The Royal Mansions · Palm Jumeirah',
    pitchBody:
      'Salam Dr. Mansoor! Prepared your verified Palm Jumeirah allocation for The Royal Mansions (2BR Waterfront · 1,840 sqft · AED 8,950,000).\n\n• Projected Gross Yield: 7.4% ROI\n• DLD Escrow: #4829 (100% Escrow Funded)\n• Milestone: 80% Construction · 20% on Handover (Q4 2027)\n\nFull interactive Deal Room with floorplans & payment schedule attached below.',
    yieldStat: '7.4% Gross ROI',
    escrowNum: 'DLD #4829 (100% Escrow)',
    paymentPlan: '80/20 Handover Linked',
    dealRoomUrl: 'deals.dealos.ae/dr-mansoor',
    dealRoomName: 'Private Deal Room · The Royal Mansions',
    replyTime: '14:32',
  },
  {
    id: 'downtown',
    tabLabel: 'Downtown Opera · AED 2.85M',
    icon: '🏙️',
    buyerName: 'Omar Haddad',
    buyerAvatar: 'OH',
    buyerStatus: 'High-Yield Portfolio Investor',
    buyerQuery:
      'Salam, I want a high ROI 1BR in Downtown near the Opera or Burj Khalifa, max budget AED 3M. What do you have ready right now?',
    queryTime: '11:15',
    copilotMatchNote: 'Matched Burj Crown 1BR · 6.9% ROI · DLD #9142 Active',
    pitchTitle: 'Burj Crown Residence · Downtown',
    pitchBody:
      'Salam Omar! Sourced the prime Downtown Burj Crown 1BR (920 sqft · AED 2,850,000) with unobstructed Opera views.\n\n• Projected Gross Yield: 6.9% ROI (AED 196k/yr rental benchmark)\n• DLD Escrow: #9142 (Active Milestone)\n• Milestone: 70% During Build · 30% on Handover\n\nReady for immediate allocation. Deal Room link attached below.',
    yieldStat: '6.9% Gross ROI',
    escrowNum: 'DLD #9142 (Active)',
    paymentPlan: '70/30 Handover Linked',
    dealRoomUrl: 'deals.dealos.ae/omar-haddad',
    dealRoomName: 'Private Deal Room · Burj Crown Opera',
    replyTime: '11:16',
  },
  {
    id: 'hills',
    tabLabel: 'Dubai Hills Villa · AED 6.45M',
    icon: '⛳',
    buyerName: 'Sarah & Tariq Al-Hashemi',
    buyerAvatar: 'ST',
    buyerStatus: 'Family Luxury End-User',
    buyerQuery:
      'Salam! We are looking for a standalone 4BR golf villa in Dubai Hills Estate under AED 7M with construction progress verified.',
    queryTime: '16:04',
    copilotMatchNote: 'Matched Club Villas · 62% DLD Construction Progress',
    pitchTitle: 'Club Villas by Emaar · Dubai Hills',
    pitchBody:
      'Salam Sarah & Tariq! Secured an exclusive 4BR Club Villa in Dubai Hills Estate (AED 6,450,000 · Golf Course Facing).\n\n• DLD Construction Progress: 62% Completed (Verified #3108)\n• Payment Plan: 60/40 Post-Handover Linked\n• Immediate viewing available\n\nPrivate viewing access & floorplans loaded in your deal room.',
    yieldStat: '6.5% Gross ROI',
    escrowNum: 'DLD #3108 (62% Built)',
    paymentPlan: '60/40 Post-Handover',
    dealRoomUrl: 'deals.dealos.ae/sarah-tariq',
    dealRoomName: 'Private Deal Room · Club Villas Golf',
    replyTime: '16:05',
  },
];

// Helper to open the WhatsApp pitch demo from anywhere in the app
export function openWhatsAppDemo(sampleId?: string) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('dealos:open-whatsapp-demo', {
        detail: { sampleId: sampleId || 'palm' },
      })
    );
  }
}

export function WhatsAppInteractivePitchModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string>('palm');
  const [isTyping, setIsTyping] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleOpen = (e: Event) => {
      const customEvent = e as CustomEvent<{ sampleId?: string }>;
      if (customEvent.detail?.sampleId) {
        setSelectedId(customEvent.detail.sampleId);
      }
      setIsOpen(true);
      // Brief typing simulation
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 450);
    };

    window.addEventListener('dealos:open-whatsapp-demo', handleOpen);
    return () => window.removeEventListener('dealos:open-whatsapp-demo', handleOpen);
  }, []);

  const active = PITCH_SAMPLES.find((p) => p.id === selectedId) || PITCH_SAMPLES[0]!;

  const handleSelectPitch = (id: string) => {
    setSelectedId(id);
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 350);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(
      `${active.pitchBody}\n\nLive Deal Room: https://${active.dealRoomUrl}`
    );
    setCopied(true);
    toast.success('Pitch script copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 backdrop-blur-xl p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-4xl max-h-[96vh] flex flex-col rounded-3xl bg-[#070D12] border border-emerald-500/30 shadow-2xl text-foreground overflow-hidden">
        {/* Top Header Bar with Prominent Back Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:px-6 sm:py-4 bg-[#0B141A] border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="h-10 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs flex items-center gap-2 border border-white/20 transition-all cursor-pointer active:scale-95 shadow-md"
            >
              <ArrowLeft size={16} />
              <span>← Back to Landing Page</span>
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                <h3 className="text-sm sm:text-base font-black text-white font-display">
                  DealOS WhatsApp Pitch Simulator
                </h3>
              </div>
              <p className="text-[11px] text-zinc-400 font-medium">
                Sample Lead Pitching · Formatted for Dubai HNWIs
              </p>
            </div>
          </div>

          {/* Quick Pitch Switcher Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {PITCH_SAMPLES.map((sample) => {
              const isSelected = sample.id === selectedId;
              return (
                <button
                  key={sample.id}
                  type="button"
                  onClick={() => handleSelectPitch(sample.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 active:scale-95 ${
                    isSelected
                      ? 'bg-emerald-500 text-black shadow-md font-extrabold'
                      : 'bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10'
                  }`}
                >
                  <span>{sample.icon}</span>
                  <span>{sample.tabLabel}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content: iPhone Device Frame Simulator */}
        <div className="p-4 sm:p-6 overflow-y-auto flex flex-col lg:flex-row items-center justify-center gap-6 bg-[#04080B]">
          {/* Authentic iPhone 16 Pro Chassis */}
          <div className="w-full max-w-[360px] rounded-[44px] bg-[#1a1f26] p-3 shadow-2xl border-4 border-[#2b3340] relative shrink-0">
            {/* iPhone Top Screen Bezel with Dynamic Island */}
            <div className="rounded-[36px] bg-[#0B141A] overflow-hidden border border-white/10 relative flex flex-col min-h-[580px]">
              {/* iPhone Status Bar */}
              <div className="pt-2 px-6 flex items-center justify-between text-[11px] font-mono text-zinc-300 bg-[#1F2C34] shrink-0">
                <span className="font-bold">9:41</span>
                {/* Dynamic Island pill */}
                <div className="w-20 h-4 rounded-full bg-black mx-auto" />
                <div className="flex items-center gap-1">
                  <span className="text-[9px]">5G</span>
                  <div className="w-5 h-2.5 rounded-xs border border-zinc-300 p-0.5 flex items-center">
                    <div className="w-full h-full bg-emerald-400 rounded-2xs" />
                  </div>
                </div>
              </div>

              {/* WhatsApp Chat Navigation Bar */}
              <div className="p-3 bg-[#1F2C34] border-b border-white/10 flex items-center justify-between text-white shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="size-9 rounded-full bg-emerald-700/80 border border-emerald-400/40 flex items-center justify-center text-xs font-black text-white shrink-0 shadow-xs">
                    {active.buyerAvatar}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white truncate max-w-[140px]">
                      {active.buyerName}
                    </h4>
                    <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                      <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      online
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-zinc-300">
                  <Video size={16} className="cursor-pointer hover:text-white" />
                  <Phone size={15} className="cursor-pointer hover:text-white" />
                  <MoreVertical size={16} className="cursor-pointer hover:text-white" />
                </div>
              </div>

              {/* WhatsApp Chat Body Wallpaper */}
              <div className="flex-1 p-3.5 space-y-3 overflow-y-auto bg-[#0B141A] bg-[radial-gradient(#1f2c34_1px,transparent_1px)] [background-size:16px_16px]">
                {/* Timestamp Pill */}
                <div className="flex justify-center">
                  <span className="px-2.5 py-0.5 rounded-md bg-[#182229] text-[10px] font-mono text-zinc-400 shadow-xs">
                    TODAY
                  </span>
                </div>

                {/* 1. Incoming Message from Dubai Investor */}
                <div className="flex flex-col items-start max-w-[85%]">
                  <div className="p-3 rounded-2xl rounded-tl-xs bg-[#202C33] text-zinc-100 text-[11px] leading-relaxed shadow-sm border border-white/5 space-y-1">
                    <p>{active.buyerQuery}</p>
                    <span className="text-[9px] font-mono text-zinc-400 block text-right mt-1">
                      {active.queryTime}
                    </span>
                  </div>
                </div>

                {/* 2. DealOS System Intelligence Note */}
                <div className="flex justify-center">
                  <div className="px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono text-emerald-300 flex items-center gap-1.5 shadow-xs">
                    <Sparkles size={11} className="text-emerald-400 shrink-0" />
                    <span>{active.copilotMatchNote}</span>
                  </div>
                </div>

                {/* 3. Outgoing DealOS AI WhatsApp Pitch */}
                <div className="flex flex-col items-end">
                  <div className="p-3 rounded-2xl rounded-tr-xs bg-[#005C4B] text-zinc-100 text-[11px] leading-relaxed shadow-md border border-emerald-400/20 space-y-2 max-w-[92%]">
                    {/* Pitch Text with formatted bullets */}
                    <div className="whitespace-pre-line font-sans text-[11px] leading-normal text-zinc-100">
                      {active.pitchBody}
                    </div>

                    {/* Rich Deal Room Interactive Link Card */}
                    <div className="mt-2 p-2.5 rounded-xl bg-black/40 border border-white/10 space-y-1.5 hover:border-emerald-400/40 transition-colors">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-violet-300">
                          🔗 {active.dealRoomUrl}
                        </span>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                          Active
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-300 font-medium">
                        {active.dealRoomName}
                      </p>
                      <div className="flex items-center gap-2 text-[9px] text-zinc-400 font-mono pt-0.5">
                        <ShieldCheck size={11} className="text-emerald-400" />
                        <span>DLD Escrow Protected</span>
                      </div>
                    </div>

                    {/* Delivery & Read Receipts */}
                    <div className="flex items-center justify-end gap-1 pt-0.5 text-[9px] font-mono text-zinc-300">
                      <span>{active.replyTime}</span>
                      <CheckCheck size={13} className="text-[#53BDEB]" />
                    </div>
                  </div>
                </div>

                {isTyping && (
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 italic px-2">
                    <span className="size-1.5 rounded-full bg-emerald-400 animate-ping" />
                    DealOS Copilot generating tailored pitch...
                  </div>
                )}
              </div>

              {/* WhatsApp Chat Bottom Input Bar */}
              <div className="p-2.5 bg-[#202C33] border-t border-white/10 flex items-center gap-2 text-zinc-400 shrink-0">
                <Smile size={18} className="cursor-pointer hover:text-white" />
                <Paperclip size={18} className="cursor-pointer hover:text-white" />
                <div className="flex-1 h-8 rounded-full bg-[#2A3942] px-3.5 flex items-center text-xs text-zinc-400">
                  <span className="text-[11px]">Type a message</span>
                </div>
                <div className="size-8 rounded-full bg-[#00A884] text-white flex items-center justify-center cursor-pointer shadow-sm">
                  <Send size={14} />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Explainer & Actions */}
          <div className="w-full max-w-sm space-y-4 text-left">
            <div className="p-5 rounded-2xl bg-[#0B141A] border border-white/10 space-y-3">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-emerald-400" />
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                  Real Estate Speed-To-Lead Engine
                </span>
              </div>

              <h4 className="text-lg font-black text-white font-display">
                {active.pitchTitle}
              </h4>

              <p className="text-xs text-zinc-300 leading-relaxed">
                When a Dubai buyer inquires on WhatsApp or portals, DealOS matches the criteria against 34,850+ live DLD units and generates this structured HNWI investor pitch in under 45 seconds.
              </p>

              {/* 3 Metric Pills */}
              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase block">Yield</span>
                  <span className="text-xs font-bold text-emerald-400 font-mono mt-0.5 block">
                    {active.yieldStat}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase block">Escrow</span>
                  <span className="text-xs font-bold text-blue-400 font-mono mt-0.5 block truncate">
                    {active.escrowNum}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="w-full h-11 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer active:scale-98 transition-all shadow-md"
                >
                  <Copy size={14} />
                  <span>{copied ? '✓ Script Copied!' : 'Copy This Pitch Script'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full h-11 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs flex items-center justify-center gap-2 border border-white/15 transition-all cursor-pointer active:scale-98"
                >
                  <ArrowLeft size={14} />
                  <span>← Back to Landing Page</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
