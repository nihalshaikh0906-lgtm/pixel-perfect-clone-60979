import { useState } from "react";
import { motion } from "framer-motion";
import {
  SlidersHorizontal,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  DollarSign,
  Zap,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

function formatAED(val: number): string {
  if (val >= 1_000_000) {
    const m = val / 1_000_000;
    return `AED ${m.toFixed(m % 1 === 0 ? 0 : 1)}M`;
  }
  return `AED ${val.toLocaleString()}`;
}

export function BrokerRoiCalculator({ onOpenDemo }: { onOpenDemo?: () => void }) {
  // Slider 1: Deals closed per month (1 to 12)
  const [dealsPerMonth, setDealsPerMonth] = useState(3);
  // Slider 2: Average Property Price (AED 1.5M to 12M, step 250k)
  const [avgPrice, setAvgPrice] = useState(2_750_000);

  // Dubai standard broker commission = 2%
  const standardCommissionPerDeal = avgPrice * 0.02;
  const annualBaseCommission = dealsPerMonth * standardCommissionPerDeal * 12;

  // DealOS benchmark: 18% closing uplift from instant speed-to-lead & DLD escrow matching
  const additionalAnnualCommission = Math.round(annualBaseCommission * 0.18);

  // Time saved: ~3.8 hours per deal sourced + WhatsApp pitch generation
  const hoursSavedPerMonth = Math.round(dealsPerMonth * 4.5 * 4); // ~18 hrs/mo for 1 deal, scales realistically

  return (
    <section className="relative w-full max-w-5xl mx-auto px-4 sm:px-6 my-16 lg:my-24">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-amber-500/10 via-primary/10 to-transparent blur-[100px] rounded-full pointer-events-none -z-10" />

      <div className="rounded-[28px] sm:rounded-[36px] border border-border/80 bg-card/90 backdrop-blur-2xl p-6 sm:p-10 shadow-2xl">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold">
            <SlidersHorizontal size={13} />
            <span>INTERACTIVE VELOCITY &amp; COMMISSION MULTIPLIER</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground font-display">
            Calculate Your DealOS Advantage
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Drag the sliders below to see how much additional commission and drive-time DealOS unlocks for your Dubai real estate practice.
          </p>
        </div>

        {/* Dual Sliders Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Column: Tactile Sliders */}
          <div className="space-y-6">
            {/* Slider 1: Deals per month */}
            <div className="p-5 rounded-2xl bg-secondary/40 border border-border/60 space-y-3">
              <div className="flex items-center justify-between">
                <label htmlFor="deals-slider" className="text-xs sm:text-sm font-bold text-foreground">
                  Deals Closed Per Month:
                </label>
                <span className="text-lg sm:text-xl font-extrabold text-primary font-mono bg-primary/10 px-3 py-0.5 rounded-xl border border-primary/20">
                  {dealsPerMonth} {dealsPerMonth === 1 ? "deal" : "deals"}
                </span>
              </div>
              <input
                id="deals-slider"
                type="range"
                min="1"
                max="12"
                step="1"
                value={dealsPerMonth}
                onChange={(e) => setDealsPerMonth(Number(e.target.value))}
                className="w-full h-2.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none"
                style={{ touchAction: "pan-y" }}
              />
              <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
                <span>1 deal / mo</span>
                <span>6 deals</span>
                <span>12 deals / mo</span>
              </div>
            </div>

            {/* Slider 2: Average Property Price */}
            <div className="p-5 rounded-2xl bg-secondary/40 border border-border/60 space-y-3">
              <div className="flex items-center justify-between">
                <label htmlFor="price-slider" className="text-xs sm:text-sm font-bold text-foreground">
                  Average Deal Value (AED):
                </label>
                <span className="text-lg sm:text-xl font-extrabold text-amber-400 font-mono bg-amber-500/10 px-3 py-0.5 rounded-xl border border-amber-500/20">
                  {formatAED(avgPrice)}
                </span>
              </div>
              <input
                id="price-slider"
                type="range"
                min="1200000"
                max="12000000"
                step="250000"
                value={avgPrice}
                onChange={(e) => setAvgPrice(Number(e.target.value))}
                className="w-full h-2.5 bg-muted rounded-lg appearance-none cursor-pointer accent-amber-500 focus:outline-none"
                style={{ touchAction: "pan-y" }}
              />
              <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
                <span>AED 1.2M</span>
                <span>AED 6M</span>
                <span>AED 12M+</span>
              </div>
            </div>

            {/* Speed-to-lead comparison note */}
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400">
              <Zap size={16} className="shrink-0" />
              <span>
                <strong>Dubai Market SLA:</strong> DealOS reduces lead inquiry response time from <strong>4.2 hours</strong> to <strong>45 seconds</strong>.
              </span>
            </div>
          </div>

          {/* Right Column: Live Dynamic Metrics Output (Ziina Style) */}
          <div className="flex flex-col gap-4">
            {/* Metric 1: Additional Annual Commission */}
            <div className="relative overflow-hidden rounded-2xl border border-amber-500/40 bg-gradient-to-br from-amber-500/15 via-amber-500/5 to-transparent p-6 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles size={14} />
                  PROJECTED COMMISSION UPLIFT
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  +18% Win Rate
                </span>
              </div>
              <motion.div
                key={additionalAnnualCommission}
                initial={{ scale: 0.95, opacity: 0.6 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="mt-3"
              >
                <span className="text-3xl sm:text-5xl font-black text-foreground font-display tracking-tight">
                  +{formatAED(additionalAnnualCommission)}
                </span>
                <span className="text-xs text-muted-foreground block mt-1">
                  Estimated extra commission unlocked annually through automated speed-to-lead
                </span>
              </motion.div>
            </div>

            {/* Metric 2 & 3: Dual Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-secondary/50 border border-border/70 space-y-1">
                <span className="text-[10px] font-mono uppercase text-muted-foreground block flex items-center gap-1">
                  <Clock size={12} className="text-primary" />
                  TIME SAVED
                </span>
                <p className="text-2xl sm:text-3xl font-black text-foreground font-display">
                  ~{hoursSavedPerMonth} hrs
                </p>
                <p className="text-[11px] text-muted-foreground">Every single month</p>
              </div>

              <div className="p-5 rounded-2xl bg-secondary/50 border border-border/70 space-y-1">
                <span className="text-[10px] font-mono uppercase text-muted-foreground block flex items-center gap-1">
                  <ShieldCheck size={12} className="text-emerald-400" />
                  ESCROW ACCURACY
                </span>
                <p className="text-2xl sm:text-3xl font-black text-emerald-400 font-display">
                  100%
                </p>
                <p className="text-[11px] text-muted-foreground">Official DLD Sync</p>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <Button
                asChild
                className="w-full sm:flex-1 h-12 rounded-xl text-xs sm:text-sm font-extrabold bg-amber-400 hover:bg-amber-300 text-black shadow-lg shadow-amber-400/20 gap-2 cursor-pointer"
              >
                <Link to="/signup">
                  <span>Start Free Trial</span>
                  <ArrowRight size={15} />
                </Link>
              </Button>
              {onOpenDemo && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onOpenDemo}
                  className="w-full sm:w-auto h-12 px-5 rounded-xl text-xs sm:text-sm font-bold border-border/80 hover:bg-secondary cursor-pointer"
                >
                  Book 15-Min Demo
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
