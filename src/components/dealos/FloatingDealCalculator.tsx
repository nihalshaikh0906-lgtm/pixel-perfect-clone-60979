import { useState, useEffect } from "react";
import {
  Calculator as CalcIcon,
  X,
  Sparkles,
  Volume2,
  VolumeX,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
    // blocked by browser policy until user gesture
  }
}

export type DubaiFinancials = {
  propertyPrice: number;
  dldFee: number;
  trusteeFee: number;
  deposit20Pct: number;
  loanAmount: number;
  monthlyMortgage: number;
  brokerCommission2Pct: number;
  totalCashToClose: number;
  minimumSalaryRequired: number;
  agentTakeHomeNet: number;
};

export function calculateDubaiFinancials(propertyPrice: number): DubaiFinancials {
  const price = Math.max(0, propertyPrice);
  const dldFee = Math.round(price * 0.04);
  const trusteeFee = price > 0 ? 4200 : 0;
  const deposit20Pct = Math.round(price * 0.20);
  const loanAmount = Math.max(0, price - deposit20Pct);
  const monthlyRate = 0.045 / 12;
  const numPayments = 25 * 12;
  const monthlyMortgage = loanAmount > 0
    ? Math.round((loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) / (Math.pow(1 + monthlyRate, numPayments) - 1))
    : 0;
  const brokerCommission2Pct = Math.round(price * 0.02);
  const totalCashToClose = deposit20Pct + dldFee + trusteeFee;
  const minimumSalaryRequired = monthlyMortgage * 2;
  const agentTakeHomeNet = Math.round(brokerCommission2Pct / 2);

  return {
    propertyPrice: price,
    dldFee,
    trusteeFee,
    deposit20Pct,
    loanAmount,
    monthlyMortgage,
    brokerCommission2Pct,
    totalCashToClose,
    minimumSalaryRequired,
    agentTakeHomeNet,
  };
}

export function generateDealAiSummary({
  price,
  preset,
}: {
  price: number;
  preset: "standard" | "dld" | "mortgage" | "commission";
}): string {
  if (price <= 0) {
    return "🤖 DealOS Copilot: Enter any property purchase price or commission amount to generate an instant institutional financial breakdown.";
  }
  const f = calculateDubaiFinancials(price);

  if (preset === "dld" || preset === "standard") {
    return `🤖 DealOS Copilot: On AED ${f.propertyPrice.toLocaleString()}, DLD transfer fee is AED ${f.dldFee.toLocaleString()} (+AED 4,200 trustee). Total cash-to-close with 20% down payment is AED ${f.totalCashToClose.toLocaleString()}.`;
  }
  if (preset === "mortgage") {
    return `🤖 DealOS Copilot: Loan balance of AED ${f.loanAmount.toLocaleString()} (80% LTV) yields ~AED ${f.monthlyMortgage.toLocaleString()}/mo at 4.5% over 25 yrs. Minimum required monthly salary is AED ${f.minimumSalaryRequired.toLocaleString()}.`;
  }
  return `🤖 DealOS Copilot: 2% gross commission is AED ${f.brokerCommission2Pct.toLocaleString()}. On a standard 50/50 broker split, agent take-home is AED ${f.agentTakeHomeNet.toLocaleString()} net.`;
}

export function PhysicalDealCalculator({
  embedded = false,
  onClose,
  initialValue = "2500000",
}: {
  embedded?: boolean;
  onClose?: () => void;
  initialValue?: string;
}) {
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Calculator State
  const [display, setDisplay] = useState(initialValue); // default standard AED 2.5M Dubai deal
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [formulaHistory, setFormulaHistory] = useState("2,500,000 AED");
  const [newNumberStarted, setNewNumberStarted] = useState(false);

  // Quick Preset Mode: "standard" | "dld" | "mortgage" | "commission"
  const [activePreset, setActivePreset] = useState<"standard" | "dld" | "mortgage" | "commission">("dld");

  const currentNumeric = parseFloat(display.replace(/,/g, "")) || 0;

  // Real-time Dubai Financial Calculations
  const financials = calculateDubaiFinancials(currentNumeric);
  const { dldFee, deposit20Pct, loanAmount, monthlyMortgage, brokerCommission2Pct, totalCashToClose } = financials;

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
  const getAiSummary = () => generateDealAiSummary({ price: currentNumeric, preset: activePreset });

  return (
    <div
      className={`relative select-none text-white overflow-hidden ${
        embedded
          ? "w-full max-w-[340px] sm:max-w-[360px] mx-auto rounded-[28px] sm:rounded-[32px] p-3.5 sm:p-5 bg-gradient-to-b from-[#181C28] via-[#101420] to-[#0A0D15] border border-white/20 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85),0_0_0_1px_rgba(255,255,255,0.12)]"
          : "w-[calc(100vw-24px)] max-w-[340px] sm:max-w-[360px] max-h-[92vh] overflow-y-auto rounded-[28px] sm:rounded-[34px] p-3.5 sm:p-5 bg-gradient-to-b from-[#181C28] via-[#101420] to-[#0A0D15] border border-white/20 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.15)] scrollbar-none"
      }`}
    >
      {/* Top Hardware Header & Brand */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
        <div className="flex items-center gap-2">
          <div
            className="size-3 rounded-full bg-rose-500/80 cursor-pointer"
            onClick={onClose || handleClear}
            title={onClose ? "Close" : "Reset"}
          />
          <div
            className="size-3 rounded-full bg-amber-500/80 cursor-pointer"
            onClick={handleClear}
            title="Clear display"
          />
          <div
            className="size-3 rounded-full bg-emerald-500/80 cursor-pointer"
            onClick={() => setDisplay("2500000")}
            title="Standard AED 2.5M"
          />
          <span className="text-[11px] font-mono font-bold text-zinc-300 ml-1">
            Deal<span className="text-primary font-black">OS</span> FX-991
          </span>
        </div>

        {/* Solar Cell / Sound / Close Controls */}
        <div className="flex items-center gap-2">
          {/* Mini Solar Cell Accent */}
          <div className="flex gap-0.5 p-1 rounded-xs bg-black/60 border border-white/10">
            <span className="w-1.5 h-3 bg-zinc-800 rounded-2xs" />
            <span className="w-1.5 h-3 bg-zinc-800 rounded-2xs" />
            <span className="w-1.5 h-3 bg-zinc-800 rounded-2xs" />
          </div>

          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="size-7 rounded-lg bg-white/5 hover:bg-white/15 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            title={soundEnabled ? "Mute clicks" : "Enable clicks"}
          >
            {soundEnabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
          </button>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="size-7 rounded-lg bg-white/5 hover:bg-white/15 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              title="Close calculator"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* ═══ HIGH-CONTRAST OLED DISPLAY ═══ */}
      <div className="p-3.5 rounded-2xl bg-black/85 border border-white/15 shadow-inner space-y-1 mb-3">
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
      <div className="grid grid-cols-4 gap-1.5 mb-2.5 text-[10px] font-mono font-bold">
        <button
          type="button"
          onClick={applyDld}
          className={`py-1.5 px-1 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer active:scale-95 ${
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
          className={`py-1.5 px-1 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer active:scale-95 ${
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
          className={`py-1.5 px-1 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer active:scale-95 ${
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
          className="py-1.5 px-1 rounded-xl bg-white/5 text-zinc-300 border border-white/10 hover:bg-white/10 flex flex-col items-center justify-center transition-all cursor-pointer active:scale-95"
        >
          <span>+Trustee</span>
        </button>
      </div>

      {/* ═══ PHYSICAL CALCULATOR KEYPAD (4x5 GRID) ═══ */}
      <div className="grid grid-cols-4 gap-1 sm:gap-1.5 mb-2.5 sm:mb-3">
        {/* Row 1: Clear, Backspace, %, Divide */}
        <button
          type="button"
          onClick={handleClear}
          className="h-9 sm:h-10 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 font-bold text-xs sm:text-sm transition-all active:scale-95 shadow-xs cursor-pointer"
        >
          AC
        </button>
        <button
          type="button"
          onClick={handleBackspace}
          className="h-9 sm:h-10 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm transition-all active:scale-95 shadow-xs cursor-pointer"
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
          className="h-9 sm:h-10 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm transition-all active:scale-95 shadow-xs cursor-pointer"
        >
          %
        </button>
        <button
          type="button"
          onClick={() => handleOp("÷")}
          className="h-9 sm:h-10 rounded-xl bg-primary hover:bg-primary/90 text-white font-extrabold text-sm sm:text-base transition-all active:scale-95 shadow-xs cursor-pointer"
        >
          ÷
        </button>

        {/* Row 2: 7, 8, 9, Multiply */}
        {["7", "8", "9"].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => handleDigit(n)}
            className="h-9 sm:h-10 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-white font-bold text-xs sm:text-sm transition-all active:scale-95 shadow-xs cursor-pointer"
          >
            {n}
          </button>
        ))}
        <button
          type="button"
          onClick={() => handleOp("×")}
          className="h-9 sm:h-10 rounded-xl bg-primary hover:bg-primary/90 text-white font-extrabold text-sm sm:text-base transition-all active:scale-95 shadow-xs cursor-pointer"
        >
          ×
        </button>

        {/* Row 3: 4, 5, 6, Subtract */}
        {["4", "5", "6"].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => handleDigit(n)}
            className="h-9 sm:h-10 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-white font-bold text-xs sm:text-sm transition-all active:scale-95 shadow-xs cursor-pointer"
          >
            {n}
          </button>
        ))}
        <button
          type="button"
          onClick={() => handleOp("−")}
          className="h-9 sm:h-10 rounded-xl bg-primary hover:bg-primary/90 text-white font-extrabold text-sm sm:text-base transition-all active:scale-95 shadow-xs cursor-pointer"
        >
          −
        </button>

        {/* Row 4: 1, 2, 3, Add */}
        {["1", "2", "3"].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => handleDigit(n)}
            className="h-9 sm:h-10 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-white font-bold text-xs sm:text-sm transition-all active:scale-95 shadow-xs cursor-pointer"
          >
            {n}
          </button>
        ))}
        <button
          type="button"
          onClick={() => handleOp("+")}
          className="h-9 sm:h-10 rounded-xl bg-primary hover:bg-primary/90 text-white font-extrabold text-sm sm:text-base transition-all active:scale-95 shadow-xs cursor-pointer"
        >
          +
        </button>

        {/* Row 5: 0, 00, Decimal, Equals */}
        <button
          type="button"
          onClick={() => handleDigit("0")}
          className="h-9 sm:h-10 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-white font-bold text-xs sm:text-sm transition-all active:scale-95 shadow-xs cursor-pointer"
        >
          0
        </button>
        <button
          type="button"
          onClick={() => {
            handleSoundClick("num");
            if (display !== "0") setDisplay(display + "00");
          }}
          className="h-9 sm:h-10 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-white font-bold text-[11px] sm:text-xs font-mono transition-all active:scale-95 shadow-xs cursor-pointer"
        >
          00
        </button>
        <button
          type="button"
          onClick={handleDecimal}
          className="h-9 sm:h-10 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-white font-bold text-xs sm:text-sm transition-all active:scale-95 shadow-xs cursor-pointer"
        >
          .
        </button>
        <button
          type="button"
          onClick={handleEquals}
          className="h-9 sm:h-10 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-sm sm:text-base transition-all active:scale-95 shadow-md shadow-emerald-500/20 cursor-pointer"
        >
          =
        </button>
      </div>

      {/* ═══ LIVE DUBAI METRICS QUICK-STRIP ═══ */}
      <div className="grid grid-cols-2 gap-1.5 p-2 rounded-xl bg-white/5 border border-white/10 mb-3 text-[11px] font-mono">
        <div>
          <span className="text-zinc-400 block text-[10px]">20% Deposit:</span>
          <span className="font-bold text-white">AED {deposit20Pct.toLocaleString()}</span>
        </div>
        <div>
          <span className="text-zinc-400 block text-[10px]">DLD 4% Fee:</span>
          <span className="font-bold text-amber-400">AED {dldFee.toLocaleString()}</span>
        </div>
        <div>
          <span className="text-zinc-400 block text-[10px]">25Y Mortgage:</span>
          <span className="font-bold text-emerald-400">~AED {monthlyMortgage.toLocaleString()}/mo</span>
        </div>
        <div>
          <span className="text-zinc-400 block text-[10px]">2% Commission:</span>
          <span className="font-bold text-primary">AED {brokerCommission2Pct.toLocaleString()}</span>
        </div>
      </div>

      {/* ═══ AI INTEGRATED SUMMARY ON BOTTOM (2-LINER BRIEF) ═══ */}
      <div className="p-3 rounded-2xl bg-gradient-to-r from-primary/15 via-[#7B4DFF]/15 to-emerald-500/10 border border-primary/30 text-xs space-y-1 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono font-bold text-primary uppercase flex items-center gap-1">
            <Sparkles size={11} className="text-amber-300" />
            AI FINANCIAL REPORT
          </span>
          <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/15 px-1.5 py-0.2 rounded font-bold">
            Live Brief
          </span>
        </div>
        <p className="text-[11px] text-zinc-200 leading-relaxed font-sans">
          {getAiSummary()}
        </p>
      </div>
    </div>
  );
}

// Modal dialog for when launched from the system on top (AppShell header)
export function DealCalculatorModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: "spring", stiffness: 380, damping: 26 }}
          className="relative my-auto"
        >
          <PhysicalDealCalculator onClose={onClose} />
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

// Deprecated alias for backwards compatibility
export function FloatingDealCalculator({
  defaultOpen = false,
  onClose,
}: {
  defaultOpen?: boolean;
  onClose?: () => void;
}) {
  // If explicitly opened, render the modal; otherwise, render nothing (no floating buttons)
  if (!defaultOpen) return null;
  return <DealCalculatorModal isOpen={defaultOpen} onClose={onClose || (() => {})} />;
}
