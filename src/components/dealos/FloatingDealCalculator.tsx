import { useState, useRef, useEffect } from "react";
import {
  Calculator as CalcIcon,
  X,
  Sparkles,
  Minimize2,
  Maximize2,
  Volume2,
  VolumeX,
  RotateCcw,
  Zap,
  ArrowRight,
  TrendingUp,
  Building2,
  DollarSign,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

// Tactile acoustic button press click
function playKeyClick(type: "num" | "op" | "eq" | "clear") {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    const freqs = { num: 440, op: 520, eq: 660, clear: 330 };
    osc.type = "sine";
    osc.frequency.setValueAtTime(freqs[type] || 440, ctx.currentTime);

    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.06);
  } catch {
    // blocked by browser
  }
}

export function FloatingDealCalculator({
  defaultOpen = false,
  onClose,
}: {
  defaultOpen?: boolean;
  onClose?: () => void;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [isMinimized, setIsMinimized] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Calculator State
  const [display, setDisplay] = useState("2500000"); // default to standard AED 2.5M Dubai deal
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [formulaHistory, setFormulaHistory] = useState("2,500,000 AED");
  const [newNumberStarted, setNewNumberStarted] = useState(false);

  // Quick Preset Mode: "standard" | "dld" | "mortgage" | "commission"
  const [activePreset, setActivePreset] = useState<"standard" | "dld" | "mortgage" | "commission">("dld");

  const currentNumeric = parseFloat(display.replace(/,/g, "")) || 0;

  // Real-time Dubai Financial Calculations
  const dldFee = Math.round(currentNumeric * 0.04);
  const trusteeFee = 4200; // standard UAE Land Department trustee fee
  const deposit20Pct = Math.round(currentNumeric * 0.20);
  const loanAmount = Math.max(0, currentNumeric - deposit20Pct);
  // 25-year mortgage at 4.5% annual rate
  const monthlyRate = 0.045 / 12;
  const numPayments = 25 * 12;
  const monthlyMortgage = loanAmount > 0
    ? Math.round((loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) / (Math.pow(1 + monthlyRate, numPayments) - 1))
    : 0;
  const brokerCommission2Pct = Math.round(currentNumeric * 0.02);
  const totalCashToClose = deposit20Pct + dldFee + trusteeFee;

  const handleSoundClick = (type: "num" | "op" | "eq" | "clear") => {
    if (soundEnabled) playKeyClick(type);
  };

  const handleDigit = (digit: string) => {
    handleSoundClick("num");
    if (newNumberStarted || display === "0") {
      setDisplay(digit);
      setNewNumberStarted(false);
    } else {
      if (display.length < 12) {
        setDisplay(display + digit);
      }
    }
  };

  const handleDecimal = () => {
    handleSoundClick("num");
    if (newNumberStarted) {
      setDisplay("0.");
      setNewNumberStarted(false);
      return;
    }
    if (!display.includes(".")) {
      setDisplay(display + ".");
    }
  };

  const handleClear = () => {
    handleSoundClick("clear");
    setDisplay("0");
    setPrevValue(null);
    setOperation(null);
    setFormulaHistory("");
    setNewNumberStarted(false);
  };

  const handleBackspace = () => {
    handleSoundClick("num");
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay("0");
    }
  };

  const handleOp = (op: string) => {
    handleSoundClick("op");
    const num = parseFloat(display);
    setPrevValue(num);
    setOperation(op);
    setFormulaHistory(`${num.toLocaleString()} ${op}`);
    setNewNumberStarted(true);
  };

  const handleEquals = () => {
    handleSoundClick("eq");
    if (operation === null || prevValue === null) return;
    const current = parseFloat(display);
    let result = 0;
    if (operation === "+") result = prevValue + current;
    else if (operation === "−" || operation === "-") result = prevValue - current;
    else if (operation === "×" || operation === "*") result = prevValue * current;
    else if (operation === "÷" || operation === "/") result = current !== 0 ? prevValue / current : 0;

    const rounded = Math.round(result * 100) / 100;
    setFormulaHistory(`${prevValue.toLocaleString()} ${operation} ${current.toLocaleString()} =`);
    setDisplay(String(rounded));
    setPrevValue(null);
    setOperation(null);
    setNewNumberStarted(true);
  };

  // Real Estate Shortcut Presets
  const applyDld = () => {
    handleSoundClick("op");
    setActivePreset("dld");
    const res = Math.round(currentNumeric * 0.04);
    setFormulaHistory(`${currentNumeric.toLocaleString()} × 4% DLD =`);
    setDisplay(String(res));
    setNewNumberStarted(true);
  };

  const applyDeposit = () => {
    handleSoundClick("op");
    setActivePreset("mortgage");
    const res = Math.round(currentNumeric * 0.20);
    setFormulaHistory(`${currentNumeric.toLocaleString()} × 20% Deposit =`);
    setDisplay(String(res));
    setNewNumberStarted(true);
  };

  const applyCommission = () => {
    handleSoundClick("op");
    setActivePreset("commission");
    const res = Math.round(currentNumeric * 0.02);
    setFormulaHistory(`${currentNumeric.toLocaleString()} × 2% Commission =`);
    setDisplay(String(res));
    setNewNumberStarted(true);
  };

  const applyTrustee = () => {
    handleSoundClick("op");
    const res = currentNumeric + 4200;
    setFormulaHistory(`${currentNumeric.toLocaleString()} + AED 4,200 Trustee =`);
    setDisplay(String(res));
    setNewNumberStarted(true);
  };

  // 2-Liner AI Summary based on calculation
  const getAiSummary = () => {
    if (currentNumeric === 0) {
      return "🤖 DealOS Copilot: Enter any property purchase price or commission amount to generate an instant institutional financial breakdown.";
    }
    if (activePreset === "dld" || activePreset === "standard") {
      return `🤖 DealOS Copilot: On AED ${currentNumeric.toLocaleString()}, DLD transfer fee is AED ${dldFee.toLocaleString()} (+AED 4,200 trustee). Total cash-to-close with 20% down payment is AED ${totalCashToClose.toLocaleString()}.`;
    }
    if (activePreset === "mortgage") {
      return `🤖 DealOS Copilot: Loan balance of AED ${loanAmount.toLocaleString()} (80% LTV) yields ~AED ${monthlyMortgage.toLocaleString()}/mo at 4.5% over 25 yrs. Minimum required monthly salary is AED ${(monthlyMortgage * 2).toLocaleString()}.`;
    }
    return `🤖 DealOS Copilot: 2% gross commission is AED ${brokerCommission2Pct.toLocaleString()}. On a standard 50/50 broker split, agent take-home is AED ${(brokerCommission2Pct / 2).toLocaleString()} net.`;
  };

  return (
    <>
      {/* Floating launcher trigger pill (bottom-left or wherever placed) */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed left-6 bottom-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#0B0F19] text-white border border-primary/40 shadow-2xl backdrop-blur-xl cursor-pointer hover:border-primary transition-all group"
          title="Open Floating Deal Calculator"
        >
          <div className="size-7 rounded-full bg-primary/20 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
            <CalcIcon size={15} />
          </div>
          <span className="text-xs font-mono font-bold tracking-tight">Deal Calculator</span>
          <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
        </motion.button>
      )}

      {/* Actual Physical Calculator Chassis (Floating Window) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              height: isMinimized ? "auto" : "auto",
            }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className="fixed z-50 bottom-4 sm:bottom-6 left-3 sm:left-8 w-[calc(100vw-24px)] max-w-[340px] xs:max-w-[360px] max-h-[90vh] overflow-y-auto rounded-[34px] p-4 sm:p-5 bg-gradient-to-b from-[#181C28] via-[#101420] to-[#0A0D15] border border-white/20 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85),0_0_0_1px_rgba(255,255,255,0.12)] text-white select-none scrollbar-none"
          >
            {/* Top Hardware Header & Brand */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
              <div className="flex items-center gap-2">
                <div className="size-3 rounded-full bg-rose-500/80 cursor-pointer" onClick={() => setIsOpen(false)} />
                <div className="size-3 rounded-full bg-amber-500/80 cursor-pointer" onClick={() => setIsMinimized(!isMinimized)} />
                <div className="size-3 rounded-full bg-emerald-500/80 cursor-pointer" onClick={() => setIsMinimized(false)} />
                <span className="text-[11px] font-mono font-bold text-zinc-300 ml-1">
                  Deal<span className="text-primary font-black">OS</span> FX-991
                </span>
              </div>

              {/* Solar Cell / Sound / Minimize Controls */}
              <div className="flex items-center gap-2">
                {/* Mini Solar Cell Accent */}
                <div className="hidden xs:flex gap-0.5 p-1 rounded-sm bg-black/60 border border-white/10">
                  <span className="w-1.5 h-3 bg-zinc-800 rounded-2xs" />
                  <span className="w-1.5 h-3 bg-zinc-800 rounded-2xs" />
                  <span className="w-1.5 h-3 bg-zinc-800 rounded-2xs" />
                </div>

                <button
                  type="button"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="size-7 rounded-lg bg-white/5 hover:bg-white/15 text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
                  title={soundEnabled ? "Mute clicks" : "Enable clicks"}
                >
                  {soundEnabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
                </button>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="size-7 rounded-lg bg-white/5 hover:bg-white/15 text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Minimized view indicator */}
            {isMinimized ? (
              <div className="py-2 flex items-center justify-between text-xs">
                <span className="font-mono font-bold text-emerald-400">{display} AED</span>
                <button
                  type="button"
                  onClick={() => setIsMinimized(false)}
                  className="text-primary font-bold text-xs hover:underline flex items-center gap-1"
                >
                  <span>Expand</span>
                  <Maximize2 size={12} />
                </button>
              </div>
            ) : (
              <>
                {/* ═══ HIGH-CONTRAST OLED DISPLAY ═══ */}
                <div className="p-3.5 rounded-2xl bg-black/80 border border-white/15 shadow-inner space-y-1 mb-3.5">
                  {/* Formula / Operation Subtext */}
                  <div className="h-4 flex items-center justify-between text-[11px] font-mono text-zinc-400">
                    <span className="truncate">{formulaHistory || "Ready"}</span>
                    <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-primary/20 text-primary font-bold">
                      DLD Sync
                    </span>
                  </div>

                  {/* Main Numeric Readout */}
                  <div className="flex items-baseline justify-end gap-1.5 overflow-hidden">
                    <span className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-white truncate">
                      {parseFloat(display).toLocaleString()}
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-400">AED</span>
                  </div>
                </div>

                {/* ═══ DUBAI PRESET SHORTCUT BUTTONS ═══ */}
                <div className="grid grid-cols-4 gap-1.5 mb-3 text-[10px] font-mono font-bold">
                  <button
                    type="button"
                    onClick={applyDld}
                    className={`py-2 px-1 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer active:scale-95 ${
                      activePreset === "dld"
                        ? "bg-primary text-white border-primary shadow-xs"
                        : "bg-white/5 text-zinc-300 border-white/10 hover:bg-white/10"
                    }`}
                  >
                    <span>DLD 4%</span>
                  </button>
                  <button
                    type="button"
                    onClick={applyDeposit}
                    className={`py-2 px-1 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer active:scale-95 ${
                      activePreset === "mortgage"
                        ? "bg-primary text-white border-primary shadow-xs"
                        : "bg-white/5 text-zinc-300 border-white/10 hover:bg-white/10"
                    }`}
                  >
                    <span>20% Dep</span>
                  </button>
                  <button
                    type="button"
                    onClick={applyCommission}
                    className={`py-2 px-1 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer active:scale-95 ${
                      activePreset === "commission"
                        ? "bg-primary text-white border-primary shadow-xs"
                        : "bg-white/5 text-zinc-300 border-white/10 hover:bg-white/10"
                    }`}
                  >
                    <span>2% Comm</span>
                  </button>
                  <button
                    type="button"
                    onClick={applyTrustee}
                    className="py-2 px-1 rounded-xl bg-white/5 text-zinc-300 border border-white/10 hover:bg-white/10 flex flex-col items-center justify-center transition-all cursor-pointer active:scale-95"
                  >
                    <span>+Trustee</span>
                  </button>
                </div>

                {/* ═══ PHYSICAL CALCULATOR KEYPAD (4x5 GRID) ═══ */}
                <div className="grid grid-cols-4 gap-1.5 sm:gap-2 mb-3">
                  {/* Row 1: Clear, Backspace, %, Divide */}
                  <button
                    type="button"
                    onClick={handleClear}
                    className="h-11 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 font-bold text-sm transition-all active:scale-95 shadow-xs"
                  >
                    AC
                  </button>
                  <button
                    type="button"
                    onClick={handleBackspace}
                    className="h-11 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm transition-all active:scale-95 shadow-xs"
                  >
                    ⌫
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleSoundClick("op");
                      const val = parseFloat(display) / 100;
                      setDisplay(String(val));
                    }}
                    className="h-11 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm transition-all active:scale-95 shadow-xs"
                  >
                    %
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOp("÷")}
                    className="h-11 rounded-xl bg-primary hover:bg-primary/90 text-white font-extrabold text-lg transition-all active:scale-95 shadow-xs"
                  >
                    ÷
                  </button>

                  {/* Row 2: 7, 8, 9, Multiply */}
                  {["7", "8", "9"].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => handleDigit(n)}
                      className="h-11 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-white font-bold text-base transition-all active:scale-95 shadow-xs"
                    >
                      {n}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleOp("×")}
                    className="h-11 rounded-xl bg-primary hover:bg-primary/90 text-white font-extrabold text-lg transition-all active:scale-95 shadow-xs"
                  >
                    ×
                  </button>

                  {/* Row 3: 4, 5, 6, Subtract */}
                  {["4", "5", "6"].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => handleDigit(n)}
                      className="h-11 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-white font-bold text-base transition-all active:scale-95 shadow-xs"
                    >
                      {n}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleOp("−")}
                    className="h-11 rounded-xl bg-primary hover:bg-primary/90 text-white font-extrabold text-lg transition-all active:scale-95 shadow-xs"
                  >
                    −
                  </button>

                  {/* Row 4: 1, 2, 3, Add */}
                  {["1", "2", "3"].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => handleDigit(n)}
                      className="h-11 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-white font-bold text-base transition-all active:scale-95 shadow-xs"
                    >
                      {n}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleOp("+")}
                    className="h-11 rounded-xl bg-primary hover:bg-primary/90 text-white font-extrabold text-lg transition-all active:scale-95 shadow-xs"
                  >
                    +
                  </button>

                  {/* Row 5: 0, 00, Decimal, Equals */}
                  <button
                    type="button"
                    onClick={() => handleDigit("0")}
                    className="h-11 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-white font-bold text-base transition-all active:scale-95 shadow-xs"
                  >
                    0
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleSoundClick("num");
                      if (display !== "0") setDisplay(display + "00");
                    }}
                    className="h-11 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-white font-bold text-xs font-mono transition-all active:scale-95 shadow-xs"
                  >
                    00
                  </button>
                  <button
                    type="button"
                    onClick={handleDecimal}
                    className="h-11 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-white font-bold text-base transition-all active:scale-95 shadow-xs"
                  >
                    .
                  </button>
                  <button
                    type="button"
                    onClick={handleEquals}
                    className="h-11 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-lg transition-all active:scale-95 shadow-md shadow-emerald-500/20"
                  >
                    =
                  </button>
                </div>

                {/* ═══ AI INTEGRATED SUMMARY ON BOTTOM (2-LINER BRIEF) ═══ */}
                <div className="p-3 rounded-2xl bg-gradient-to-r from-primary/15 via-[#7B4DFF]/15 to-emerald-500/10 border border-primary/30 text-xs space-y-1.5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-primary uppercase flex items-center gap-1">
                      <Sparkles size={11} className="text-amber-300" />
                      AI FINANCIAL DOSSIER
                    </span>
                    <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/15 px-1.5 py-0.2 rounded font-bold">
                      Live Brief
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-200 leading-relaxed font-sans">
                    {getAiSummary()}
                  </p>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
