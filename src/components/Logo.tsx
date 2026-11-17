import { useId } from "react";

export interface LogoMarkProps {
  size?: number;
  variant?: "light" | "dark" | "gradient" | "solid";
  className?: string;
}

/**
 * DealOS "Door D" Brand Logo Mark
 * An italic D with a notch and an arched doorway.
 * - Solid versions: fill #F3EEE6 on dark, or #0B0B0B on light (or below 24px)
 * - Gradient version: Ember linear gradient (#FF9A4A -> #FF5A1F -> #D7190E -> #8E0C06)
 */
export function LogoMark({ size = 32, variant = "gradient", className = "" }: LogoMarkProps) {
  const id = useId().replace(/:/g, "");
  const isSmall = size < 24;

  // Solid below 24px per brand guidelines, or if explicitly requested
  if (variant === "dark" || (isSmall && variant !== "light")) {
    return (
      <svg
        className={`logo-mark ${className}`}
        viewBox="0 0 156 140"
        width={size * (156 / 140)}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <g transform="translate(-20 -30) translate(17.6 0) skewX(-10)">
          <path
            fillRule="evenodd"
            fill="#F3EEE6"
            d="M30 30 H104 A70 70 0 0 1 104 170 H30 L54 100 Z M84 140 V80 A20 20 0 0 1 124 80 V140 Z"
          />
        </g>
      </svg>
    );
  }

  if (variant === "light" || (isSmall && variant === "light")) {
    return (
      <svg
        className={`logo-mark ${className}`}
        viewBox="0 0 156 140"
        width={size * (156 / 140)}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <g transform="translate(-20 -30) translate(17.6 0) skewX(-10)">
          <path
            fillRule="evenodd"
            fill="#0B0B0B"
            d="M30 30 H104 A70 70 0 0 1 104 170 H30 L54 100 Z M84 140 V80 A20 20 0 0 1 124 80 V140 Z"
          />
        </g>
      </svg>
    );
  }

  // Official Gradient "Ember" Mark
  return (
    <svg
      className={`logo-mark ${className}`}
      viewBox="0 0 156 140"
      width={size * (156 / 140)}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`dg-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FF9A4A" />
          <stop offset="0.35" stopColor="#FF5A1F" />
          <stop offset="0.7" stopColor="#D7190E" />
          <stop offset="1" stopColor="#8E0C06" />
        </linearGradient>
      </defs>
      <g transform="translate(-20 -30) translate(17.6 0) skewX(-10)">
        <path
          fillRule="evenodd"
          fill={`url(#dg-${id})`}
          d="M30 30 H104 A70 70 0 0 1 104 170 H30 L54 100 Z M84 140 V80 A20 20 0 0 1 124 80 V140 Z"
        />
      </g>
    </svg>
  );
}

export interface LogoProps {
  size?: number;
  variant?: "light" | "dark" | "gradient";
  showWordmark?: boolean;
  className?: string;
  textColor?: string;
}

export function Logo({
  size = 28,
  variant = "gradient",
  showWordmark = true,
  className = "",
  textColor,
}: LogoProps) {
  const isDarkContext = variant === "dark";
  const wordColor = textColor || (isDarkContext ? "#F3EEE6" : "#0B0B0B");

  return (
    <span
      className={`logo inline-flex items-center select-none ${className}`}
      style={{ gap: Math.max(6, Math.round(size * 0.28)) }}
    >
      <LogoMark size={size} variant={variant} />
      {showWordmark && (
        <span
          className="logo-word tracking-tight"
          style={{
            fontSize: Math.round(size * 0.72),
            fontWeight: 800,
            letterSpacing: "-0.03em",
            fontFamily: "Inter, 'Inter Display', sans-serif",
            lineHeight: 1,
            color: wordColor,
          }}
        >
          Deal<span style={{ color: "#D7190E" }}>OS</span>
        </span>
      )}
    </span>
  );
}
