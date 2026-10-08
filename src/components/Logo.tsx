import { useId } from "react";

/** DealOS mark + wordmark. variant controls the knock-out colour behind the roof line. */
export function LogoMark({ size = 32, variant = "light" }: { size?: number; variant?: "light" | "dark" }) {
  const id = useId().replace(/:/g, "");
  const bg = variant === "dark" ? "var(--logo-bg-dark, #0B0E1A)" : "var(--logo-bg, #FFFFFF)";
  const win = variant === "dark" ? "#6E8BFF" : "#2A45C8";
  return (
    <svg className="logo-mark" viewBox="370 160 400 470" width={size * 0.85} height={size} aria-hidden>
      <defs>
        <linearGradient id={`d${id}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#2F6BFF" /><stop offset="1" stopColor="#7B4DFF" /></linearGradient>
        <linearGradient id={`r${id}`} gradientUnits="userSpaceOnUse" x1="392" y1="0" x2="724" y2="0"><stop offset="0" stopColor="#2F5BFF" /><stop offset="1" stopColor="#7A4BFF" /></linearGradient>
      </defs>
      <path fill={`url(#d${id})`} fillRule="evenodd" d="M400 175 H585 A175 215 0 0 1 585 605 H400 Z M482 255 H580 A95 135 0 0 1 580 525 H482 Z" />
      <path d="M378 548 L572 380 L738 524" fill="none" stroke={bg} strokeWidth="88" />
      <path d="M392 548 L572 392 L724 524" fill="none" stroke={`url(#r${id})`} strokeWidth="54" />
      <g fill={win}><rect x="549" y="470" width="20" height="20" rx="2" /><rect x="575" y="470" width="20" height="20" rx="2" /><rect x="549" y="496" width="20" height="20" rx="2" /><rect x="575" y="496" width="20" height="20" rx="2" /></g>
    </svg>
  );
}

export function Logo({ size = 30, variant = "light", showWordmark = true }: { size?: number; variant?: "light" | "dark"; showWordmark?: boolean }) {
  return (
    <span className="logo" style={{ display: "inline-flex", alignItems: "center", gap: size * 0.3 }}>
      <LogoMark size={size} variant={variant} />
      {showWordmark ? (
        <span className="logo-word" style={{ fontSize: size * 0.72, fontWeight: 800, letterSpacing: "-0.02em", fontFamily: "Manrope, sans-serif", lineHeight: 1 }}>
          Deal<span className="text-gradient">OS</span>
        </span>
      ) : null}
    </span>
  );
}
