import { useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

export function InteractiveDeviceShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<"voice" | "dld" | "dealroom" | "owner">("voice");
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // 3D Parallax Mouse Tracking
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
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 py-16 lg:py-24 overflow-hidden"
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
        {/* Parallax Floating HUD Badges */}
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

        {/* 3D Hardware Frame */}
        <motion.div
          style={{ rotateX, rotateY }}
          className="w-full max-w-5xl rounded-[32px] p-3 sm:p-4 bg-gradient-to-b from-zinc-700 via-zinc-800 to-zinc-950 border border-white/20 shadow-[0_30px_100px_rgba(0,0,0,0.5)] transition-transform duration-200 ease-out"
        >
          {/* Inner Display Screen */}
          <div className="rounded-[24px] bg-[#0F1424] text-white overflow-hidden border border-white/10 shadow-inner flex flex-col min-h-[580px]">
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
                <button
                  type="button"
                  onClick={() => setActiveTab("voice")}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 ${
                    activeTab === "voice"
                      ? "bg-emerald-500 text-white shadow-sm"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <Mic size={12} />
                  <span>1. WhatsApp Voice</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("dld")}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 ${
                    activeTab === "dld"
                      ? "bg-primary text-white shadow-sm"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <Building2 size={12} />
                  <span>2. DLD Inventory</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("dealroom")}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 ${
                    activeTab === "dealroom"
                      ? "bg-violet-600 text-white shadow-sm"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <Share2 size={12} />
                  <span>3. Live Deal Room</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("owner")}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 ${
                    activeTab === "owner"
                      ? "bg-amber-500 text-black shadow-sm font-extrabold"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <DollarSign size={12} />
                  <span>4. Commission Ledger</span>
                </button>
              </div>
            </div>

            {/* Main Interactive Screen Content */}
            <div className="p-6 sm:p-8 flex-1 bg-gradient-to-b from-[#0F1424] to-[#0A0D18]">
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

                  {/* Audio Wave Player */}
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                        className="size-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
                      >
                        {isPlayingAudio ? <Pause size={16} /> : <Play size={16} className="ml-0.5 fill-current" />}
                      </button>
                      <div className="flex items-center gap-1">
                        {[14, 28, 20, 36, 18, 30, 24, 16, 32, 40, 22, 16, 26, 34, 18, 22, 30, 24, 16, 20].map((h, i) => (
                          <span
                            key={i}
                            style={{ height: `${h}px` }}
                            className={`w-1 rounded-full transition-all ${
                              isPlayingAudio && i % 2 === 0 ? "bg-emerald-400 animate-pulse" : "bg-emerald-500/40"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-xs font-mono text-zinc-400">Dr. Mansoor Al-Ketbi (+971 50...)</span>
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
                    ].map((p) => (
                      <div key={p.name} className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3 hover:border-primary/50 transition-colors">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
                            {p.badge}
                          </span>
                          <span className="text-[10px] text-zinc-400 font-mono">DLD Escrow Active</span>
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
                      deals.dealos.ae/mansoor
                    </span>
                  </div>

                  <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4 text-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <span className="text-[10px] uppercase font-mono text-violet-300 font-bold">Curated Allocation</span>
                        <p className="text-lg font-extrabold text-white">Creek Waters 2 · Waterfront 2BR Suite</p>
                        <p className="text-xs text-zinc-400">High Floor · Skyline &amp; Lagoon Panorama · 1,180 sq.ft</p>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-extrabold text-emerald-400 font-mono">AED 3,650,000</span>
                        <p className="text-[11px] text-zinc-400">Est. Rental: AED 280,000 / yr</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-white/10">
                      <div className="p-3 rounded-xl bg-white/5">
                        <span className="text-[10px] text-zinc-400 uppercase font-mono block">Booking Token</span>
                        <span className="font-extrabold text-white text-sm">10% (AED 365k)</span>
                      </div>
                      <div className="p-3 rounded-xl bg-white/5">
                        <span className="text-[10px] text-zinc-400 uppercase font-mono block">Construction Milestone</span>
                        <span className="font-extrabold text-white text-sm">40% Linked</span>
                      </div>
                      <div className="p-3 rounded-xl bg-white/5">
                        <span className="text-[10px] text-zinc-400 uppercase font-mono block">Handover Balance</span>
                        <span className="font-extrabold text-emerald-400 text-sm">50% in 2027</span>
                      </div>
                    </div>
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
                    <span className="text-[11px] font-mono font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                      AED 1,450,000 OUTSTANDING
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    {[
                      { dev: "Emaar Properties PJSC", deal: "Burj Crown (Unit 2402)", tranche: "2% on SPA Signing", amount: "AED 78,000", days: "68 Days Overdue", alert: true },
                      { dev: "DAMAC Properties", deal: "Damac Lagoons (Villa 89)", tranche: "2% Handover Tranche", amount: "AED 140,000", days: "42 Days Overdue", alert: true },
                      { dev: "Sobha Realty LLC", deal: "Sobha Hartland (Unit 1204)", tranche: "3% Full Broker Commission", amount: "AED 95,000", days: "14 Days (Processing)", alert: false },
                    ].map((row) => (
                      <div key={row.deal} className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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
                      </div>
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
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs transition-colors shadow-md"
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
        </motion.div>
      </div>
    </section>
  );
}
