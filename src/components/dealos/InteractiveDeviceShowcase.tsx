import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  Sparkles,
  Mic,
  Building2,
  Share2,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  ArrowRight,
  TrendingUp,
  MapPin,
  Play,
  Pause,
  Clock,
  Layers,
  Radio,
  ExternalLink,
  MessageCircle,
  CheckCheck,
  Check,
  RotateCcw,
  Loader2,
  Eye,
  FileText,
  SlidersHorizontal,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { LogoMark } from "@/components/Logo";
import { WhatsAppHandoffCard } from "./WhatsAppHandoffCard";
import { openWhatsAppDemo } from "./WhatsAppInteractivePitchModal";

// Tactile acoustic WhatsApp confirmation chime
function playWhatsAppChime() {
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = "sine";
    osc2.type = "sine";
    osc1.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc2.frequency.setValueAtTime(880, ctx.currentTime + 0.08); // A5

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.08);
    osc2.start(ctx.currentTime + 0.08);
    osc2.stop(ctx.currentTime + 0.25);
  } catch {
    // AudioContext blocked
  }
}

export function InteractiveDeviceShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<"voice" | "dld" | "dealroom" | "owner">("voice");
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [dynamicIslandExpanded, setDynamicIslandExpanded] = useState(false);
  const [waDispatchState, setWaDispatchState] = useState<"idle" | "sending" | "delivered">("idle");
  const [showClientDraft, setShowClientDraft] = useState(false);
  const [selectedMatchIndex, setSelectedMatchIndex] = useState(0);
  const [commissionFilter, setCommissionFilter] = useState<"all" | "overdue" | "processing">("all");

  // Web Audio synthesizer for voice note preview
  const audioCtxRef = useRef<AudioContext | null>(null);
  const audioIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startVoiceAudio = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;
      if (ctx.state === "suspended") {
        void ctx.resume();
      }
      const notes = [220, 246.94, 261.63, 293.66, 329.63, 293.66, 261.63, 220];
      let noteIdx = 0;
      audioIntervalRef.current = setInterval(() => {
        if (!ctx || ctx.state === "closed") return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(notes[noteIdx % notes.length]!, ctx.currentTime);
        gain.gain.setValueAtTime(0.03, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.3);
        noteIdx++;
      }, 320);
    } catch {
      // browser policy
    }
  };

  const stopVoiceAudio = () => {
    if (audioIntervalRef.current) {
      clearInterval(audioIntervalRef.current);
      audioIntervalRef.current = null;
    }
    if (audioCtxRef.current) {
      try {
        void audioCtxRef.current.close();
      } catch {}
      audioCtxRef.current = null;
    }
  };

  const handleToggleAudio = () => {
    if (isPlayingAudio) {
      stopVoiceAudio();
      setIsPlayingAudio(false);
    } else {
      startVoiceAudio();
      setIsPlayingAudio(true);
    }
  };

  useEffect(() => {
    return () => {
      stopVoiceAudio();
    };
  }, []);

  const handleWhatsAppSimulate = () => {
    if (waDispatchState === "sending") return;
    setWaDispatchState("sending");
    playWhatsAppChime();
    setTimeout(() => {
      setWaDispatchState("delivered");
      openWhatsAppDemo("palm");
    }, 450);
  };

  // 3D Parallax Mouse Tracking for Desktop
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 120, damping: 20 });
  const mouseY = useSpring(y, { stiffness: 120, damping: 20 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], [6, -6]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-8, 8]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const currentX = (e.clientX - rect.left) / width - 0.5;
    const currentY = (e.clientY - rect.top) / height - 0.5;
    x.set(currentX);
    y.set(currentY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <section
      id="cockpit"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 py-10 lg:py-16 overflow-hidden"
    >
      {/* Ambient Radial Cobalt/Violet Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-[#2F6BFF]/20 via-[#7B4DFF]/15 to-transparent blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3 mb-10 sm:mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
          <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>INTERACTIVE PRODUCT DESK · LIVE PREVIEW</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground font-display">
          The Operating System Built on Dubai Data.
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          Test the interactive broker cockpit below: click between live WhatsApp voice note transcription, verified DLD inventory matching, client deal rooms, and developer commission ledgers.
        </p>
      </div>

      {/* Floating 3D Device Studio Display */}
      <div className="relative perspective-[1400px] flex justify-center items-center">
        {/* Parallax Floating HUD Badges (Desktop) */}
        <motion.div
          style={{ x: useTransform(mouseX, [-0.5, 0.5], [-18, 18]) }}
          className="hidden xl:flex absolute -top-4 left-10 z-20 items-center gap-2.5 p-3 rounded-2xl bg-card/90 border border-emerald-500/30 shadow-xl backdrop-blur-md text-xs"
        >
          <span className="size-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-extrabold text-foreground">Speed to Lead: &lt; 2 min</span>
          <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
            Top 1% Dubai SLA
          </span>
        </motion.div>

        <motion.div
          style={{ x: useTransform(mouseX, [-0.5, 0.5], [20, -20]) }}
          className="hidden xl:flex absolute -bottom-4 right-10 z-20 items-center gap-2.5 p-3 rounded-2xl bg-card/90 border border-primary/30 shadow-xl backdrop-blur-md text-xs"
        >
          <ShieldCheck size={16} className="text-primary" />
          <span className="font-extrabold text-foreground">UAE PDPL &amp; Escrow Synced</span>
          <span className="text-[10px] text-primary font-mono font-bold bg-primary/10 px-2 py-0.5 rounded">
            DLD Trust Grade
          </span>
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* VIEW A: 3D iMac Frame (DESKTOP & TABLETS: md:flex)        */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <motion.div
          style={{ rotateX, rotateY }}
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="hidden md:flex w-full max-w-5xl flex-col items-center transition-transform duration-200 ease-out"
        >
          {/* iMac Enclosure with Precision Aluminum Edge */}
          <div className="w-full rounded-[28px] sm:rounded-[36px] p-2.5 sm:p-3.5 bg-gradient-to-b from-zinc-300 via-zinc-400 to-zinc-500 dark:from-zinc-700 dark:via-zinc-800 dark:to-zinc-900 border border-white/40 dark:border-white/15 shadow-[0_30px_90px_-20px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.1)] overflow-hidden">
            {/* Inner Black Bezel + FaceTime HD Camera */}
            <div className="rounded-[20px] sm:rounded-[26px] bg-[#0A0D18] overflow-hidden border border-black/80 shadow-2xl flex flex-col">
              {/* iMac Top Bezel Camera Dot */}
              <div className="h-4 sm:h-5 bg-black flex items-center justify-center gap-2 select-none pointer-events-none">
                <span className="size-1 rounded-full bg-zinc-850 border border-zinc-700/50" />
                <span className="size-1.5 rounded-full bg-zinc-950 border border-zinc-700/80 flex items-center justify-center shadow-inner">
                  <span className="size-0.5 rounded-full bg-emerald-400/90 animate-pulse" />
                </span>
                <span className="size-1 rounded-full bg-zinc-850" />
              </div>

              {/* Inner Retina Display Screen */}
              <div className="rounded-none bg-[#0F1424] text-white overflow-hidden flex flex-col min-h-[560px]">
                {/* Top Display Header & Mode Switcher */}
                <div className="bg-[#141A33]/90 border-b border-white/10 p-3 sm:p-4 flex flex-col md:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5 pl-1 pr-3 border-r border-white/10">
                      <span className="size-3 rounded-full bg-rose-500/80" />
                      <span className="size-3 rounded-full bg-amber-500/80" />
                      <span className="size-3 rounded-full bg-emerald-500/80" />
                    </div>
                    <span className="text-xs font-mono font-bold text-zinc-300">
                      DealOS Executive Cockpit
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                      v2.4 Production
                    </span>
                  </div>

                  {/* 4 Interactive Feature Switcher Tabs */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 bg-black/40 rounded-xl border border-white/10 text-xs">
                    {[
                      { id: "voice", label: "1. WhatsApp Voice", icon: Mic, activeBg: "bg-emerald-500" },
                      { id: "dld", label: "2. DLD Inventory", icon: Building2, activeBg: "bg-primary" },
                      { id: "dealroom", label: "3. Live Deal Room", icon: Share2, activeBg: "bg-violet-600" },
                      { id: "owner", label: "4. Commission Ledger", icon: DollarSign, activeBg: "bg-primary" },
                    ].map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setActiveTab(t.id as typeof activeTab)}
                        className={`relative px-3 py-1.5 rounded-lg font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer z-10 ${
                          activeTab === t.id ? "text-white" : "text-zinc-400 hover:text-white"
                        }`}
                      >
                        {activeTab === t.id && (
                          <motion.div
                            layoutId="deviceShowcaseActiveTabDesktop"
                            className={`absolute inset-0 rounded-lg ${t.activeBg} shadow-sm -z-10`}
                            transition={{ type: "spring", stiffness: 450, damping: 32 }}
                          />
                        )}
                        <t.icon size={12} />
                        <span>{t.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Main Interactive Screen Content */}
                <div className="p-4 sm:p-8 flex-1 bg-gradient-to-b from-[#0F1424] to-[#0A0D18]">
                  {/* TAB 1: WHATSAPP VOICE INGESTION */}
                  {activeTab === "voice" && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                        <div>
                          <h4 className="text-xl font-extrabold font-display text-white">
                            Drive-Time WhatsApp Audio Transcriber
                          </h4>
                          <p className="text-xs text-zinc-400 mt-0.5">
                            Incoming WhatsApp investor voice note processed via Whisper Real Estate AI
                          </p>
                        </div>
                        <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                          AUDIO DURATION: 0:24
                        </span>
                      </div>

                      {/* Audio Wave Player with Working Audio Tone Synthesizer */}
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={handleToggleAudio}
                            className="size-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                            title={isPlayingAudio ? "Pause Audio" : "Play Investor Voice Note"}
                          >
                            {isPlayingAudio ? <Pause size={16} /> : <Play size={16} className="ml-0.5 fill-current" />}
                          </button>
                          <div className="flex items-center gap-1 h-10 items-end">
                            {[14, 28, 20, 36, 18, 30, 24, 16, 32, 40, 22, 16, 26, 34, 18, 22, 30, 24, 16, 20].map((h, i) => (
                              <motion.span
                                key={i}
                                animate={
                                  isPlayingAudio
                                    ? {
                                        height: [h, Math.max(8, (h * 1.4) % 38), Math.max(10, (h * 0.6) % 32), h],
                                        backgroundColor: ["#34D399", "#10B981", "#6EE7B7", "#34D399"],
                                      }
                                    : { height: `${h}px`, backgroundColor: "rgba(16, 185, 129, 0.4)" }
                                }
                                transition={
                                  isPlayingAudio
                                    ? { repeat: Infinity, duration: 0.5 + (i % 4) * 0.15, ease: "easeInOut" }
                                    : { duration: 0.2 }
                                }
                                className="w-1 rounded-full"
                              />
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-zinc-400">Dr. Mansoor Al-Ketbi (+971 50...)</span>
                          {isPlayingAudio && (
                            <span className="size-2 rounded-full bg-emerald-400 animate-ping" />
                          )}
                        </div>
                      </div>

                      {/* Transcript & Extraction */}
                      <div className="p-4 rounded-2xl bg-white/5 border-l-4 border-l-emerald-400 border border-white/10 text-xs italic text-zinc-200 leading-relaxed font-serif">
                        "Salam Tariq, I'm looking for a luxury 2-bedroom in Dubai Creek Harbour or Downtown around 3.5 to 4.0 Million AED. High floor with open canal view. Cash ready, let me know what developer allocations you have before the weekend."
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                        <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                          <span className="text-[10px] uppercase font-mono text-zinc-400 block">Identified Client</span>
                          <span className="font-extrabold text-white text-sm">Dr. Mansoor Al-Ketbi</span>
                        </div>
                        <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                          <span className="text-[10px] uppercase font-mono text-zinc-400 block">Parsed Budget</span>
                          <span className="font-extrabold text-emerald-400 font-mono text-sm">AED 4,000,000</span>
                        </div>
                        <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                          <span className="text-[10px] uppercase font-mono text-zinc-400 block">Target District</span>
                          <span className="font-extrabold text-white text-sm">Dubai Creek Harbour</span>
                        </div>
                        <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                          <span className="text-[10px] uppercase font-mono text-zinc-400 block">Settlement Type</span>
                          <span className="font-extrabold text-emerald-400 font-mono text-sm">100% Cash Ready</span>
                        </div>
                      </div>

                      {/* Action Row */}
                      <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setShowClientDraft(!showClientDraft)}
                            className="h-9 px-4 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white font-bold text-xs flex items-center gap-1.5 transition-all border border-white/10 cursor-pointer shadow-xs"
                          >
                            <Eye size={13} className="text-emerald-400" />
                            <span>{showClientDraft ? "Hide Client Draft" : "View Client Draft"}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setActiveTab("dealroom")}
                            className="h-9 px-4 rounded-xl bg-violet-600 hover:bg-violet-500 active:scale-95 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                          >
                            <span>Match Deal Room</span>
                            <ArrowRight size={13} />
                          </button>
                        </div>

                        <span className="text-[10px] font-mono text-zinc-400 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full">
                          Viewable button · Nothing copied to keyboard
                        </span>
                      </div>

                      {/* Viewable Client Draft Drawer */}
                      <AnimatePresence>
                        {showClientDraft && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="p-4 rounded-2xl bg-black/60 border border-emerald-500/30 space-y-2 text-xs overflow-hidden"
                          >
                            <div className="flex items-center justify-between border-b border-white/10 pb-2">
                              <span className="font-mono font-bold text-emerald-400 text-[11px] flex items-center gap-1.5">
                                <FileText size={13} />
                                Verified Client Intake Brief · Dr. Mansoor Al-Ketbi
                              </span>
                              <span className="text-[10px] font-mono text-zinc-400 bg-white/5 px-2 py-0.5 rounded">
                                Read-Only View
                              </span>
                            </div>
                            <p className="text-zinc-300 leading-relaxed text-[11px]">
                              <strong>Target:</strong> 2-Bedroom Waterfront Suite · <strong>Budget:</strong> AED 4,000,000 (Cash Ready) · <strong>Timeline:</strong> Pre-weekend allocation · <strong>DLD Registration:</strong> Primary Buyer
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  {/* TAB 2: DLD INVENTORY MATCH */}
                  {activeTab === "dld" && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                        <div>
                          <h4 className="text-xl font-extrabold font-display text-white">
                            Live DLD Off-Plan Matches (34,850+ Units)
                          </h4>
                          <p className="text-xs text-zinc-400 mt-0.5">
                            Matched automatically to Dr. Mansoor's AED 4M budget criteria
                          </p>
                        </div>
                        <span className="text-[11px] font-mono font-bold text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                          3 ALLOCATIONS FOUND
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                        {[
                          {
                            name: "Creek Waters 2",
                            dev: "Emaar Properties",
                            price: "AED 3,650,000",
                            plan: "90/10 On Handover",
                            yield: "8.6% Net ROI",
                            badge: "99% Match Score",
                          },
                          {
                            name: "Burj Crown",
                            dev: "Emaar Downtown",
                            price: "AED 3,890,000",
                            plan: "60/40 Construction",
                            yield: "7.9% Net ROI",
                            badge: "97% Match Score",
                          },
                          {
                            name: "Sobha SeaHaven",
                            dev: "Sobha Realty",
                            price: "AED 3,950,000",
                            plan: "80/20 Payment Plan",
                            yield: "8.2% Net ROI",
                            badge: "95% Match Score",
                          },
                        ].map((p, idx) => (
                          <div
                            key={p.name}
                            onClick={() => setSelectedMatchIndex(idx)}
                            className={`p-4 rounded-2xl bg-white/5 border transition-all cursor-pointer space-y-3 ${
                              selectedMatchIndex === idx
                                ? "border-emerald-400/80 bg-emerald-500/10 shadow-lg shadow-emerald-500/10 scale-[1.02]"
                                : "border-white/10 hover:border-white/20"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                                selectedMatchIndex === idx ? "bg-emerald-400 text-black" : "text-emerald-400 bg-emerald-500/10"
                              }`}>
                                {p.badge}
                              </span>
                              <span className="text-[10px] text-zinc-400 font-mono">
                                {selectedMatchIndex === idx ? "✓ Selected" : "DLD Escrow Active"}
                              </span>
                            </div>
                            <div>
                              <p className="font-extrabold text-base text-white">{p.name}</p>
                              <p className="text-[11px] text-zinc-400">{p.dev}</p>
                            </div>
                            <div className="space-y-1 pt-1 border-t border-white/10 font-mono text-xs">
                              <div className="flex justify-between">
                                <span className="text-zinc-400">Price:</span>
                                <span className="text-emerald-400 font-bold">{p.price}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-zinc-400">Projected Yield:</span>
                                <span className="text-primary font-bold">{p.yield}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TAB 3: LIVE DEAL ROOM */}
                  {activeTab === "dealroom" && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                        <div>
                          <h4 className="text-xl font-extrabold font-display text-white">
                            Private Live Deal Room (Client Presentation)
                          </h4>
                          <p className="text-xs text-zinc-400 mt-0.5">
                            Generated web link sent directly to investor WhatsApp in 1 tap
                          </p>
                        </div>
                        <span className="text-[11px] font-mono font-bold text-violet-400 bg-violet-500/10 px-3 py-1 rounded-full border border-violet-500/20">
                          LINK READY: DEALS.DEALOS.AE/MANSOOR
                        </span>
                      </div>

                      <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <button
                            type="button"
                            onClick={handleWhatsAppSimulate}
                            disabled={waDispatchState === "sending"}
                            className="h-11 px-6 rounded-xl bg-gradient-to-r from-[#2F6BFF] to-[#7B4DFF] hover:brightness-110 active:scale-[0.98] text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#2F6BFF]/25 transition-all cursor-pointer disabled:opacity-75"
                          >
                            {waDispatchState === "sending" ? (
                              <Loader2 size={16} className="animate-spin text-white" />
                            ) : (
                              <MessageCircle size={16} />
                            )}
                            <span>
                              {waDispatchState === "idle" && "Review in WhatsApp"}
                              {waDispatchState === "sending" && "Dispatching to WhatsApp..."}
                              {waDispatchState === "delivered" && "✓ Sent to Client WhatsApp (Simulated)"}
                            </span>
                          </button>

                          <span className="text-[10px] font-mono text-zinc-400 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full my-2 inline-flex items-center self-start sm:self-auto shadow-xs">
                            Project preview
                          </span>
                        </div>

                        {/* Dynamic WhatsApp Phone Handoff Card */}
                        <AnimatePresence>
                          {waDispatchState === "delivered" && (
                            <motion.div
                              initial={{ opacity: 0, y: 12, scale: 0.97 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: -8, scale: 0.98 }}
                              transition={{ type: "spring", stiffness: 350, damping: 25 }}
                            >
                              <WhatsAppHandoffCard
                                text="Salam Dr. Mansoor, following up on your voice note. I've prepared your private Live Deal Room for Creek Waters 2 (2BR Waterfront Suite · AED 3,650,000) with DLD escrow security."
                                title="WhatsApp Session · Dr. Mansoor Al-Ketbi (+971 50...)"
                                subtitle="Scan QR or open directly on phone"
                                dealRoomUrl="https://dealos.ae/deal-room/mansoor"
                              />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  )}

                  {/* TAB 4: OWNER COMMISSION LEDGER */}
                  {activeTab === "owner" && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                        <div>
                          <h4 className="text-xl font-extrabold font-display text-white">
                            Developer Commission Aging Ledger
                          </h4>
                          <p className="text-xs text-zinc-400 mt-0.5">
                            Tracking unpaid broker commission tranches across master developers
                          </p>
                        </div>
                        <span className="text-[11px] font-mono font-bold text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                          AED 1,450,000 OUTSTANDING
                        </span>
                      </div>

                      {/* Interactive Filter Pills */}
                      <div className="flex items-center gap-2">
                        {[
                          { id: "all", label: "All Tranches (3)" },
                          { id: "overdue", label: "⚠️ Overdue Claims (2)" },
                          { id: "processing", label: "✓ In Processing (1)" },
                        ].map((f) => (
                          <button
                            key={f.id}
                            type="button"
                            onClick={() => setCommissionFilter(f.id as "all" | "overdue" | "processing")}
                            className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                              commissionFilter === f.id
                                ? "bg-primary text-primary-foreground shadow-sm"
                                : "bg-white/5 text-zinc-400 hover:text-white border border-white/10"
                            }`}
                          >
                            {f.label}
                          </button>
                        ))}
                      </div>

                      <div className="space-y-2 text-xs">
                        {[
                          { dev: "Emaar Properties PJSC", deal: "Burj Crown (Unit 2402)", tranche: "2% on SPA Signing", amount: "AED 78,000", days: "68 Days Overdue", alert: true },
                          { dev: "DAMAC Properties", deal: "Damac Lagoons (Villa 89)", tranche: "2% Handover Tranche", amount: "AED 140,000", days: "42 Days Overdue", alert: true },
                          { dev: "Sobha Realty LLC", deal: "Sobha Hartland (Unit 1204)", tranche: "3% Full Broker Commission", amount: "AED 95,000", days: "14 Days (Processing)", alert: false },
                        ]
                          .filter((row) => {
                            if (commissionFilter === "overdue") return row.alert;
                            if (commissionFilter === "processing") return !row.alert;
                            return true;
                          })
                          .map((row) => (
                            <motion.div
                              layout
                              key={row.deal}
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-primary/40 transition-colors"
                            >
                            <div>
                              <p className="font-extrabold text-white">{row.dev}</p>
                              <p className="text-[11px] text-zinc-400">{row.deal} · {row.tranche}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="font-mono font-extrabold text-emerald-400 text-sm">{row.amount}</span>
                              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                                row.alert ? "bg-rose-500/20 text-rose-300 border border-rose-500/30" : "bg-emerald-500/20 text-emerald-300"
                              }`}>
                                {row.days}
                              </span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Bar inside Screen */}
                <div className="bg-[#141A33]/90 border-t border-white/10 p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <span className="text-zinc-400 font-mono text-[11px]">
                    Built for DLD &amp; RERA Licensed Brokerages in Dubai &amp; the UAE
                  </span>
                  <div className="flex items-center gap-2">
                    <Link
                      to="/welcome"
                      hash="cta"
                      className="px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-extrabold text-xs transition-colors shadow-md"
                    >
                      Book 15-Min Private Zoom
                    </Link>
                    <Link
                      to="/pricing"
                      className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/10 transition-colors"
                    >
                      View Agency Licenses
                    </Link>
                  </div>
                </div>
              </div>

              {/* The Iconic iMac Lower Chin with DealOS Logo */}
              <div className="relative h-14 sm:h-16 bg-gradient-to-r from-zinc-200 via-zinc-100 to-zinc-200 dark:from-zinc-800 dark:via-zinc-750 dark:to-zinc-800 border-t border-black/10 dark:border-white/10 flex items-center justify-center px-4 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)]">
                <div className="absolute inset-0 bg-gradient-to-b from-white/25 via-transparent to-black/10 pointer-events-none" />
                <div className="relative z-10 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/15 shadow-xs backdrop-blur-xs">
                  <LogoMark size={22} variant="dark" />
                  <span className="font-extrabold text-sm sm:text-base tracking-tight text-zinc-800 dark:text-zinc-100 font-display">
                    Deal<span className="text-primary font-black">OS</span>
                  </span>
                  <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 dark:text-zinc-400 font-bold ml-0.5 px-1.5 py-0.2 rounded bg-black/5 dark:bg-white/10">
                    Studio
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* iMac Anodized Aluminum Desktop Stand & Drop Shadow */}
          <div className="relative flex flex-col items-center w-full select-none pointer-events-none -mt-0.5">
            <div
              className="w-28 sm:w-36 h-12 sm:h-14 bg-gradient-to-b from-zinc-400 via-zinc-300 to-zinc-400 dark:from-zinc-700 dark:via-zinc-800 dark:to-zinc-850 border-x border-black/15 dark:border-white/10 shadow-lg relative flex items-center justify-center"
              style={{
                clipPath: "polygon(14% 0%, 86% 0%, 100% 100%, 0% 100%)",
              }}
            >
              <div className="size-4 sm:size-5 rounded-full bg-zinc-600/40 dark:bg-black/50 border border-black/20 dark:border-white/10 shadow-inner" />
            </div>
            <div className="w-52 sm:w-72 h-3 sm:h-3.5 rounded-full bg-gradient-to-r from-zinc-300 via-zinc-100 to-zinc-300 dark:from-zinc-700 dark:via-zinc-600 dark:to-zinc-700 border border-white/50 dark:border-white/15 shadow-[0_4px_14px_rgba(0,0,0,0.25)]" />
            <div className="w-72 sm:w-[420px] h-4 bg-black/35 blur-lg rounded-full mt-0.5" />
          </div>
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* VIEW B: iPhone 16 Pro Frame (PHONES ONLY: flex md:hidden)  */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="flex md:hidden w-full max-w-[340px] xs:max-w-[365px] flex-col items-center mx-auto"
        >
          {/* Outer Titanium Enclosure with Physical Side Button Accents */}
          <div className="relative w-full rounded-[48px] p-2.5 bg-gradient-to-b from-zinc-600 via-zinc-800 to-zinc-950 border border-white/25 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85),0_0_0_1px_rgba(255,255,255,0.12)]">
            {/* Side Hardware Buttons */}
            <div className="absolute top-24 -left-1 w-1 h-5 bg-zinc-500 rounded-l" />
            <div className="absolute top-34 -left-1 w-1 h-9 bg-zinc-500 rounded-l" />
            <div className="absolute top-46 -left-1 w-1 h-9 bg-zinc-500 rounded-l" />
            <div className="absolute top-32 -right-1 w-1 h-12 bg-zinc-500 rounded-r" />

            {/* Inner OLED Display */}
            <div className="rounded-[38px] bg-[#0A0D18] border border-black/95 overflow-hidden flex flex-col text-white min-h-[570px] shadow-inner">
              {/* iOS Status Bar + Dynamic Island */}
              <div className="px-5 pt-3 pb-1 flex items-center justify-between select-none">
                <span className="text-xs font-semibold text-zinc-200 font-mono tracking-tight pl-1">
                  9:41
                </span>

                {/* The Interactive Apple Dynamic Island */}
                <motion.button
                  type="button"
                  onClick={() => setDynamicIslandExpanded(!dynamicIslandExpanded)}
                  animate={{
                    width: dynamicIslandExpanded ? "190px" : "105px",
                    height: dynamicIslandExpanded ? "34px" : "24px",
                  }}
                  transition={{ type: "spring", stiffness: 450, damping: 30 }}
                  className="rounded-full bg-black border border-white/20 px-2.5 flex items-center justify-between shadow-lg cursor-pointer overflow-hidden z-20"
                  title="Tap Dynamic Island to inspect status"
                >
                  <div className="size-2 rounded-full bg-zinc-900 border border-zinc-700/80 flex items-center justify-center shrink-0">
                    <span className="size-1 rounded-full bg-[#0d1629]" />
                  </div>

                  {dynamicIslandExpanded ? (
                    <span className="text-[10px] font-mono font-bold text-emerald-400 truncate px-1 flex items-center gap-1">
                      <ShieldCheck size={11} /> DLD Active
                    </span>
                  ) : isPlayingAudio ? (
                    <div className="flex items-center gap-0.5 h-2.5 items-end">
                      {[4, 10, 6, 11, 7].map((h, i) => (
                        <motion.span
                          key={i}
                          animate={{ height: [h, Math.max(3, (h * 1.5) % 11), h] }}
                          transition={{ repeat: Infinity, duration: 0.35 + (i % 3) * 0.1 }}
                          className="w-0.5 rounded-full bg-emerald-400"
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <span className="size-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                      <span className="text-[9px] font-mono text-zinc-400">DLD</span>
                    </div>
                  )}
                </motion.button>

                <div className="flex items-center gap-1.5 text-zinc-300 pr-1">
                  <span className="text-[10px] font-mono font-bold">5G</span>
                  <div className="w-5 h-2.5 rounded-xs border border-zinc-400 p-0.5 flex items-center">
                    <div className="h-full w-full bg-white rounded-xs" />
                  </div>
                </div>
              </div>

              {/* DealOS Mobile Header */}
              <div className="px-4 py-2 border-b border-white/10 flex items-center justify-between bg-black/40">
                <div className="flex items-center gap-1.5">
                  <LogoMark size={16} />
                  <span className="font-extrabold text-xs text-white">DealOS Mobile</span>
                </div>
                <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                  Live Cockpit
                </span>
              </div>

              {/* 4 Mobile Quick Tabs */}
              <div className="grid grid-cols-4 gap-1 p-1.5 bg-black/60 border-b border-white/10 text-[10px]">
                {[
                  { id: "voice", label: "Voice", icon: Mic },
                  { id: "dld", label: "DLD", icon: Building2 },
                  { id: "dealroom", label: "Deals", icon: Share2 },
                  { id: "owner", label: "Splits", icon: DollarSign },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setActiveTab(t.id as typeof activeTab)}
                    className={`relative py-1.5 px-1 rounded-lg font-bold flex flex-col items-center justify-center gap-0.5 transition-colors cursor-pointer z-10 ${
                      activeTab === t.id ? "text-white" : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    {activeTab === t.id && (
                      <motion.div
                        layoutId="deviceShowcaseActiveTabMobile"
                        className="absolute inset-0 rounded-lg bg-primary shadow-xs -z-10"
                        transition={{ type: "spring", stiffness: 450, damping: 32 }}
                      />
                    )}
                    <t.icon size={13} />
                    <span>{t.label}</span>
                  </button>
                ))}
              </div>

              {/* iPhone Content Area */}
              <div className="p-3.5 flex-1 space-y-3.5 overflow-hidden">
                {activeTab === "voice" && (
                  <div className="space-y-3 animate-in fade-in duration-200">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <button
                          type="button"
                          onClick={handleToggleAudio}
                          className="size-9 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md active:scale-95 transition-transform"
                          title={isPlayingAudio ? "Pause" : "Play"}
                        >
                          {isPlayingAudio ? <Pause size={14} /> : <Play size={14} className="ml-0.5 fill-current" />}
                        </button>
                        <div>
                          <p className="text-xs font-bold text-white">Dr. Mansoor Al-Ketbi</p>
                          <p className="text-[10px] text-zinc-400 font-mono">0:24 · Dubai Creek 2BR</p>
                        </div>
                      </div>
                      <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">
                        {isPlayingAudio ? "PLAYING" : "TAP PLAY"}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-white/5 border-l-2 border-l-emerald-400 border border-white/10 text-[11px] text-zinc-300 italic">
                      "Looking for a luxury 2BR in Dubai Creek around AED 4M cash ready..."
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                        <span className="text-zinc-400 block uppercase">Budget</span>
                        <span className="font-extrabold text-emerald-400 font-mono text-xs">AED 4,000,000</span>
                      </div>
                      <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                        <span className="text-zinc-400 block uppercase">Location</span>
                        <span className="font-extrabold text-white text-xs">Creek Harbour</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveTab("dealroom")}
                      className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all"
                    >
                      <span>Match Live Deal Room</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                )}

                {activeTab === "dld" && (
                  <div className="space-y-2 animate-in fade-in duration-200">
                    <p className="text-[11px] font-bold text-zinc-300">Off-Plan Allocation Matches:</p>
                    {[
                      { name: "Creek Waters 2", dev: "Emaar", price: "AED 3.65M", yield: "8.6% ROI", match: "99%" },
                      { name: "Burj Crown", dev: "Emaar", price: "AED 3.89M", yield: "7.9% ROI", match: "97%" },
                      { name: "Sobha SeaHaven", dev: "Sobha", price: "AED 3.95M", yield: "8.2% ROI", match: "95%" },
                    ].map((p, idx) => (
                      <div
                        key={p.name}
                        onClick={() => setSelectedMatchIndex(idx)}
                        className={`p-2.5 rounded-xl border text-xs cursor-pointer flex items-center justify-between ${
                          selectedMatchIndex === idx
                            ? "border-emerald-400/80 bg-emerald-500/10"
                            : "border-white/10 bg-white/5"
                        }`}
                      >
                        <div>
                          <p className="font-bold text-white text-[11px]">{p.name}</p>
                          <p className="text-[10px] text-zinc-400">{p.dev} · {p.price}</p>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/20 px-1.5 py-0.5 rounded">
                          {p.match}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "dealroom" && (
                  <div className="space-y-3 animate-in fade-in duration-200">
                    <button
                      type="button"
                      onClick={handleWhatsAppSimulate}
                      disabled={waDispatchState === "sending"}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#2F6BFF] to-[#7B4DFF] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md"
                    >
                      {waDispatchState === "sending" ? <Loader2 size={14} className="animate-spin" /> : <MessageCircle size={14} />}
                      <span>{waDispatchState === "delivered" ? "✓ WhatsApp Delivered" : "Review in WhatsApp"}</span>
                    </button>

                    {waDispatchState === "delivered" && (
                      <WhatsAppHandoffCard
                        text="Salam Dr. Mansoor, following up on your voice note. I've prepared your private Live Deal Room for Creek Waters 2 (AED 3.65M)."
                        title="WhatsApp Deal Room"
                        dealRoomUrl="https://dealos.ae/deal-room/mansoor"
                        className="mt-2 text-[11px]"
                      />
                    )}
                  </div>
                )}

                {activeTab === "owner" && (
                  <div className="space-y-2 animate-in fade-in duration-200">
                    <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 flex justify-between items-center">
                      <span className="text-[10px] font-bold text-zinc-300">Pending Brokerage Tranches</span>
                      <span className="text-xs font-mono font-extrabold text-primary">AED 1.45M</span>
                    </div>
                    {[
                      { dev: "Emaar", deal: "Burj Crown", amount: "AED 78k", status: "Overdue 68d" },
                      { dev: "DAMAC", deal: "Lagoons Villa", amount: "AED 140k", status: "Overdue 42d" },
                      { dev: "Sobha", deal: "Hartland 2BR", amount: "AED 95k", status: "Processing" },
                    ].map((row) => (
                      <div key={row.deal} className="p-2 rounded-lg bg-white/5 border border-white/10 flex justify-between items-center text-[11px]">
                        <div>
                          <p className="font-bold text-white text-[10px]">{row.dev} · {row.deal}</p>
                          <span className="text-[9px] text-zinc-400">{row.status}</span>
                        </div>
                        <span className="text-emerald-400 font-mono font-bold text-xs">{row.amount}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* iOS Home Indicator Bar */}
              <div className="py-2.5 flex justify-center mt-auto">
                <div className="w-28 h-1 rounded-full bg-white/40" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
