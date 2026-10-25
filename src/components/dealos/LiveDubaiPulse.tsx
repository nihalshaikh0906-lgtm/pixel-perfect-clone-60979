import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  MessageCircle,
  Sparkles,
  Building2,
  Zap,
  ChevronRight,
  TrendingUp,
} from "lucide-react";

interface PulseItem {
  id: string;
  category: string;
  headline: string;
  meta: string;
  timeAgo: string;
  icon: typeof ShieldCheck;
  colorScheme: "emerald" | "amber" | "sky" | "violet";
}

const PULSE_ITEMS: PulseItem[] = [
  {
    id: "escrow",
    category: "DLD ESCROW VERIFIED",
    headline: "Sobha Hartland II · Trust Account #4829",
    meta: "100% Active Escrow · DLD Milestone Guaranteed",
    timeAgo: "34s ago",
    icon: ShieldCheck,
    colorScheme: "emerald",
  },
  {
    id: "whatsapp",
    category: "SPEED-TO-LEAD DISPATCH",
    headline: "WhatsApp Investor Dossier Dispatched",
    meta: "2BR Creek Waters (AED 3.85M) · 42s Response Time",
    timeAgo: "1m ago",
    icon: MessageCircle,
    colorScheme: "sky",
  },
  {
    id: "commission",
    category: "COMMISSION LOGGED",
    headline: "AED 96,000 Commission Split Cleared",
    meta: "Downtown 3BR Penthouse · Auto-split to Broker Cockpit",
    timeAgo: "2m ago",
    icon: Sparkles,
    colorScheme: "amber",
  },
  {
    id: "dealroom",
    category: "LIVE DEAL ROOM",
    headline: "Zurich Cash Buyer Unlocked Room",
    meta: "Palm Jumeirah Villa · KYC & Proof of Funds Verified",
    timeAgo: "4m ago",
    icon: Building2,
    colorScheme: "violet",
  },
  {
    id: "allocation",
    category: "DIRECT DEVELOPER ALLOCATION",
    headline: "Exclusive 1% Monthly Units Sourced",
    meta: "Dubai Hills Estate · 18 Units Matched to Waiting Leads",
    timeAgo: "6m ago",
    icon: Zap,
    colorScheme: "emerald",
  },
];

export function LiveDubaiPulse() {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % PULSE_ITEMS.length);
    }, 4200);
    return () => clearInterval(timer);
  }, [isPaused]);

  const current = PULSE_ITEMS[index]!;
  const Icon = current.icon;

  const colorStyles = {
    emerald: {
      badge: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
      dot: "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]",
      border: "hover:border-emerald-500/40",
      iconBg: "bg-emerald-500/10 text-emerald-400",
    },
    amber: {
      badge: "bg-amber-500/15 text-amber-400 border-amber-500/30",
      dot: "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]",
      border: "hover:border-amber-500/40",
      iconBg: "bg-amber-500/10 text-amber-400",
    },
    sky: {
      badge: "bg-sky-500/15 text-sky-400 border-sky-500/30",
      dot: "bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.8)]",
      border: "hover:border-sky-500/40",
      iconBg: "bg-sky-500/10 text-sky-400",
    },
    violet: {
      badge: "bg-violet-500/15 text-violet-400 border-violet-500/30",
      dot: "bg-violet-400 shadow-[0_0_8px_rgba(167,139,250,0.8)]",
      border: "hover:border-violet-500/40",
      iconBg: "bg-violet-500/10 text-violet-400",
    },
  }[current.colorScheme];

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
      onClick={() => setIndex((prev) => (prev + 1) % PULSE_ITEMS.length)}
      className="w-full max-w-[94vw] sm:max-w-2xl mx-auto my-6 px-2 select-none cursor-pointer"
      title="Tap to see next live Dubai broker activity"
    >
      <div
        className={`relative overflow-hidden rounded-2xl sm:rounded-full bg-card/85 backdrop-blur-xl border border-border/70 p-2 sm:p-2.5 shadow-lg transition-all duration-300 hover:shadow-xl ${colorStyles.border}`}
      >
        <div className="flex items-center gap-3">
          {/* Pulsing Live Dot + Icon */}
          <div className="relative shrink-0 flex items-center justify-center">
            <div
              className={`size-9 sm:size-10 rounded-full flex items-center justify-center ${colorStyles.iconBg}`}
            >
              <Icon size={18} />
            </div>
            <span
              className={`absolute -top-0.5 -right-0.5 size-2.5 rounded-full animate-pulse ${colorStyles.dot}`}
            />
          </div>

          {/* Morphing Activity Content */}
          <div className="flex-1 min-w-0 pr-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[9px] sm:text-[10px] font-mono font-extrabold uppercase px-2 py-0.5 rounded-full border ${colorStyles.badge}`}
                    >
                      {current.category}
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground hidden sm:inline">
                      • {current.timeAgo}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-extrabold text-foreground tracking-tight truncate mt-0.5">
                    {current.headline}
                  </p>
                  <p className="text-[11px] text-muted-foreground truncate hidden xs:block">
                    {current.meta}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                  <span className="text-[10px] font-mono text-muted-foreground sm:hidden">
                    {current.timeAgo}
                  </span>
                  <span className="text-[10px] font-bold text-primary flex items-center gap-0.5 bg-primary/10 px-2 py-1 rounded-full">
                    <span>Live</span>
                    <ChevronRight size={12} />
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Dynamic cycling progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-muted/40 overflow-hidden">
          <motion.div
            key={current.id}
            initial={{ width: "0%" }}
            animate={{ width: isPaused ? "100%" : "100%" }}
            transition={{
              duration: isPaused ? 0 : 4.2,
              ease: "linear",
            }}
            className="h-full bg-primary/60"
          />
        </div>
      </div>
    </div>
  );
}
