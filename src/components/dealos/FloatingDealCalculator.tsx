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
  const { dldFee, trusteeFee, deposit20Pct, loanAmount, monthlyMortgage, brokerCommission2Pct, totalCashToClose } = financials;

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

  // Modelled upfront: Deposit (20%) + DLD (4%) + Broker Commission (2%) + Trustee fee
  const modelledUpfront = deposit20Pct + dldFee + brokerCommission2Pct + trusteeFee;

  // Percentage breakdown for visual progress bar
  const depositShare = modelledUpfront > 0 ? Math.round((deposit20Pct / modelledUpfront) * 100) : 76;
  const dldShare = modelledUpfront > 0 ? Math.round((dldFee / modelledUpfront) * 100) : 15;
  const commShare = modelledUpfront > 0 ? Math.round((brokerCommission2Pct / modelledUpfront) * 100) : 8;
  const trusteeShare = modelledUpfront > 0 ? Math.max(1, 100 - depositShare - dldShare - commShare) : 1;

  // Exact 25Y mortgage EMI calculation
  const exactMortgageEmi = loanAmount > 0
    ? (loanAmount * ((0.045 / 12) * Math.pow(1 + 0.045 / 12, 300))) / (Math.pow(1 + 0.045 / 12, 300) - 1)
    : 0;

  // 2-Liner AI Summary based on calculation
  const getAiSummary = () => generateDealAiSummary({ price: currentNumeric, preset: activePreset });

  return (
    <div
      className={`relative select-none text-white overflow-hidden transition-all ${
        embedded
          ? "w-full max-w-4xl mx-auto rounded-3xl p-4 sm:p-7 bg-gradient-to-b from-[#181C28] via-[#101420] to-[#0A0D15] border border-white/20 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.12)]"
          : "w-[calc(100vw-20px)] max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl p-4 sm:p-7 bg-gradient-to-b from-[#181C28] via-[#101420] to-[#0A0D15] border border-white/20 shadow-[0_30px_90px_-20px_rgba(0,0,0,0.95),0_0_0_1px_rgba(255,255,255,0.15)] scrollbar-none"
      }`}
    >
      {/* Top Hardware Header & Brand */}
      <div className="flex items-center justify-between pb-3.5 border-b border-white/10 mb-4 sm:mb-6">
        <div className="flex items-center gap-2.5">
          <div
            className="size-3 rounded-full bg-rose-500/80 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={onClose || handleClear}
            title={onClose ? "Close" : "Reset"}
          />
          <div
            className="size-3 rounded-full bg-amber-500/80 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={handleClear}
            title="Clear display"
          />
          <div
            className="size-3 rounded-full bg-emerald-500/80 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => setDisplay("1500000")}
            title="Standard AED 1.5M"
          />
          <span className="text-xs font-mono font-bold text-zinc-300 ml-1">
            Deal<span className="text-primary font-black">OS</span> FX-991 Dubai Institutional
          </span>
        </div>

        {/* Sound & Close Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="size-8 rounded-xl bg-white/5 hover:bg-white/15 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            title={soundEnabled ? "Mute clicks" : "Enable clicks"}
          >
            {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
          </button>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="size-8 rounded-xl bg-white/5 hover:bg-white/15 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              title="Close calculator"
            >
              <X size={15} />
            </button>
          )}
        </div>
      </div>

      {/* ═══ RESPONSIVE DUAL-PANEL CHASSIS: STACKS ON MOBILE, SIDE-BY-SIDE ON DESKTOP ═══ */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-stretch">
        
        {/* ─── LEFT PANEL: PROPERTY PRICE & KEYPAD (Full width on mobile, 5 cols on desktop) ─── */}
        <div className="w-full lg:w-5/12 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg sm:text-xl font-black text-white font-display tracking-tight">
                  Deal calculator
                </h4>
                <p className="text-[11px] font-mono text-zinc-400 mt-0.5">
                  Indicative Dubai resale · AED
                </p>
              </div>
              <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                DLD Sync
              </span>
            </div>

            {/* High-Contrast Property Price Readout Box */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-black/85 border border-white/15 shadow-inner space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 block">
                PROPERTY PRICE
              </span>
              <div className="flex items-baseline justify-between gap-2 overflow-hidden">
                <span className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-white truncate">
                  AED {parseFloat(display).toLocaleString()}
                </span>
                <span className="text-xs font-mono font-bold text-emerald-400 shrink-0">
                  {formulaHistory ? "LIVE" : "READY"}
                </span>
              </div>
            </div>

            {/* Modelled Upfront Highlight Pill */}
            <div className="p-2.5 sm:p-3 rounded-xl bg-primary/10 border border-primary/25 space-y-0.5">
              <div className="flex items-baseline justify-between text-xs">
                <span className="text-zinc-300 font-semibold text-[11px]">Modelled upfront:</span>
                <span className="font-mono font-extrabold text-white text-sm">
                  AED {modelledUpfront.toLocaleString()}
                </span>
              </div>
              <p className="text-[10px] font-mono text-zinc-400">
                20% deposit + 4% DLD + 2% commission + trustee
              </p>
            </div>

            {/* Quick Deal Presets */}
            <div className="grid grid-cols-4 gap-1.5 text-[10px] font-mono font-bold">
              {[
                { label: "1.5M", val: "1500000" },
                { label: "2.5M", val: "2500000" },
                { label: "5.0M", val: "5000000" },
                { label: "10M", val: "10000000" },
              ].map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => {
                    handleSoundClick("num");
                    setDisplay(p.val);
                    setNewNumberStarted(true);
                  }}
                  className={`py-1.5 rounded-xl border transition-all cursor-pointer active:scale-95 ${
                    display === p.val
                      ? "bg-primary text-white border-primary shadow-xs font-black"
                      : "bg-white/5 text-zinc-300 border-white/10 hover:bg-white/10"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* ═══ TACTILE KEYPAD (Comfortable full-width touch buttons) ═══ */}
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2 pt-1">
            {["7", "8", "9", "4", "5", "6", "1", "2", "3"].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => handleDigit(n)}
                className="h-11 sm:h-12 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-white font-mono font-extrabold text-base sm:text-lg transition-all active:scale-95 shadow-xs cursor-pointer flex items-center justify-center"
              >
                {n}
              </button>
            ))}

            {/* Clear Button */}
            <button
              type="button"
              onClick={handleClear}
              className="h-11 sm:h-12 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 font-mono font-extrabold text-sm sm:text-base transition-all active:scale-95 shadow-xs cursor-pointer flex items-center justify-center"
            >
              C
            </button>

            {/* Zero Button */}
            <button
              type="button"
              onClick={() => handleDigit("0")}
              className="h-11 sm:h-12 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-white font-mono font-extrabold text-base sm:text-lg transition-all active:scale-95 shadow-xs cursor-pointer flex items-center justify-center"
            >
              0
            </button>

            {/* Backspace Button */}
            <button
              type="button"
              onClick={handleBackspace}
              className="h-11 sm:h-12 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono font-extrabold text-sm sm:text-base transition-all active:scale-95 shadow-xs cursor-pointer flex items-center justify-center"
            >
              ⌫
            </button>
          </div>
        </div>

        {/* ─── RIGHT PANEL: ITEMISED BREAKDOWN (Full width on mobile, 7 cols on desktop) ─── */}
        <div className="w-full lg:w-7/12 flex flex-col justify-between space-y-4 pt-4 lg:pt-0 border-t lg:border-t-0 lg:border-l border-white/10 lg:pl-8">
          <div className="space-y-3 sm:space-y-3.5">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-zinc-400 block">
                  ITEMISED BREAKDOWN
                </span>
                <h4 className="text-base sm:text-lg font-bold text-white font-display">
                  AED {parseFloat(display).toLocaleString()} <span className="text-xs font-normal text-zinc-400">Property price</span>
                </h4>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono text-zinc-400 block">Estimated Upfront</span>
                <span className="text-base sm:text-lg font-black font-mono text-emerald-400">
                  AED {modelledUpfront.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Visual Distribution Progress Bar */}
            <div className="space-y-1.5">
              <div className="w-full h-2.5 rounded-full bg-white/10 flex overflow-hidden shadow-inner">
                <div style={{ width: `${depositShare}%` }} className="bg-primary h-full transition-all duration-300" title={`20% Deposit (${depositShare}%)`} />
                <div style={{ width: `${dldShare}%` }} className="bg-amber-400 h-full transition-all duration-300" title={`DLD 4% (${dldShare}%)`} />
                <div style={{ width: `${commShare}%` }} className="bg-emerald-400 h-full transition-all duration-300" title={`2% Comm (${commShare}%)`} />
                <div style={{ width: `${trusteeShare}%` }} className="bg-rose-400 h-full transition-all duration-300" title={`Trustee fee (${trusteeShare}%)`} />
              </div>

              {/* Progress Bar Legend */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-mono text-zinc-400">
                <span className="flex items-center gap-1">
                  <span className="size-2 rounded-full bg-primary" />
                  Deposit {depositShare}%
                </span>
                <span className="flex items-center gap-1">
                  <span className="size-2 rounded-full bg-amber-400" />
                  DLD {dldShare}%
                </span>
                <span className="flex items-center gap-1">
                  <span className="size-2 rounded-full bg-emerald-400" />
                  Comm {commShare}%
                </span>
                <span className="flex items-center gap-1">
                  <span className="size-2 rounded-full bg-rose-400" />
                  Trustee {trusteeShare}%
                </span>
              </div>
            </div>

            {/* Itemised Rows List (Clean Cards with Responsive Layout) */}
            <div className="space-y-2 text-xs">
              {/* Row 1: DLD 4% */}
              <div className="p-2.5 sm:p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-2 hover:bg-white/[0.07] transition-colors">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-amber-400 shrink-0" />
                    <span className="font-extrabold text-white text-xs sm:text-sm">DLD 4%</span>
                  </div>
                  <span className="text-[10px] text-zinc-400 font-mono block ml-4">4% of price</span>
                </div>
                <span className="font-mono font-black text-amber-400 text-sm sm:text-base whitespace-nowrap">
                  AED {dldFee.toLocaleString()}
                </span>
              </div>

              {/* Row 2: 20% Deposit */}
              <div className="p-2.5 sm:p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-2 hover:bg-white/[0.07] transition-colors">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-primary shrink-0" />
                    <span className="font-extrabold text-white text-xs sm:text-sm">20% Deposit</span>
                  </div>
                  <span className="text-[10px] text-zinc-400 font-mono block ml-4">20% of price scenario</span>
                </div>
                <span className="font-mono font-black text-white text-sm sm:text-base whitespace-nowrap">
                  AED {deposit20Pct.toLocaleString()}
                </span>
              </div>

              {/* Row 3: 2% Comm */}
              <div className="p-2.5 sm:p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-2 hover:bg-white/[0.07] transition-colors">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-emerald-400 shrink-0" />
                    <span className="font-extrabold text-white text-xs sm:text-sm">2% Comm</span>
                  </div>
                  <span className="text-[10px] text-zinc-400 font-mono block ml-4">2% of price · before VAT</span>
                </div>
                <span className="font-mono font-black text-emerald-400 text-sm sm:text-base whitespace-nowrap">
                  AED {brokerCommission2Pct.toLocaleString()}
                </span>
              </div>

              {/* Row 4: Trustee fee */}
              <div className="p-2.5 sm:p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-2 hover:bg-white/[0.07] transition-colors">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-rose-400 shrink-0" />
                    <span className="font-extrabold text-white text-xs sm:text-sm">Trustee fee</span>
                  </div>
                  <span className="text-[10px] text-zinc-400 font-mono block ml-4">
                    {currentNumeric > 500000 ? "AED 4,000 + 5% VAT (price above AED 500,000)" : "AED 2,000 + 5% VAT"}
                  </span>
                </div>
                <span className="font-mono font-black text-rose-300 text-sm sm:text-base whitespace-nowrap">
                  AED {trusteeFee.toLocaleString()}
                </span>
              </div>

              {/* Row 5: Mortgage EMI */}
              <div className="p-2.5 sm:p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-2 hover:bg-white/[0.07] transition-colors">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-cyan-400 shrink-0" />
                    <span className="font-extrabold text-white text-xs sm:text-sm">Mortgage EMI</span>
                  </div>
                  <span className="text-[10px] text-zinc-400 font-mono block ml-4">
                    Monthly · AED {loanAmount.toLocaleString()} loan · 4.5% p.a. · 25 years assumed
                  </span>
                </div>
                <span className="font-mono font-black text-cyan-300 text-sm sm:text-base whitespace-nowrap">
                  AED {exactMortgageEmi.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          {/* Modelled Upfront Grand Total Banner */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-primary/20 via-[#7B4DFF]/20 to-emerald-500/15 border border-primary/30 flex items-center justify-between gap-3 shadow-md">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-primary block">
                TOTAL CAPITAL REQUIRED TO CLOSE
              </span>
              <span className="text-xs text-zinc-300 font-medium">
                Modelled upfront: Deposit + DLD + Commission + Trustee
              </span>
            </div>
            <span className="text-xl sm:text-2xl font-black font-mono text-white whitespace-nowrap">
              AED {modelledUpfront.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* ═══ AI FINANCIAL SUMMARY BRIEF (AT BOTTOM) ═══ */}
      <div className="mt-5 p-3 rounded-2xl bg-white/5 border border-white/10 text-xs space-y-1 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono font-bold text-primary uppercase flex items-center gap-1.5">
            <Sparkles size={12} className="text-amber-300" />
            INSTANT DEAL BRIEFING
          </span>
          <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded font-bold">
            Live Copilot
          </span>
        </div>
        <p className="text-[11px] text-zinc-300 leading-relaxed font-sans">
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
