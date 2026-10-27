import { useEffect, useRef } from "react";

const NOISE =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

/** Silk canvas: drifting champagne orbs, paper noise, and high-performance hardware-accelerated cursor spotlight. */
export function Ambient() {
  const spotlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only enable on precise pointing devices (desktop mouse, not touchscreens)
    if (typeof window === "undefined" || !window.matchMedia("(pointer: fine)").matches) return;

    let rafId: number;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    const updatePosition = () => {
      // Smooth lerp easing for organic fluid light lag
      currentX += (targetX - currentX) * 0.15;
      currentY += (targetY - currentY) * 0.15;

      if (spotlightRef.current) {
        spotlightRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      }
      rafId = requestAnimationFrame(updatePosition);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    rafId = requestAnimationFrame(updatePosition);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden [contain:strict]" style={{ transform: "translate3d(0, 0, 0)" }}>
        {/* Cursor Spotlight Glow (Desktop only, 60fps transform-gpu) */}
        <div
          ref={spotlightRef}
          className="hidden md:block absolute -top-[300px] -left-[300px] size-[600px] rounded-full pointer-events-none will-change-transform opacity-60"
          style={{
            background: "radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, rgba(47, 107, 255, 0.03) 45%, transparent 70%)",
          }}
        />

        <div
          className="d-ambient-orb-1 absolute -left-40 -top-40 size-[650px] rounded-full blur-3xl transform-gpu will-change-[transform,opacity]"
          style={{ background: "var(--orb-1)", animation: "orb-drift-a 14s ease-in-out infinite alternate" }}
        />
        <div
          className="d-ambient-orb-2 absolute -bottom-40 -right-40 size-[650px] rounded-full blur-3xl transform-gpu will-change-[transform,opacity]"
          style={{ background: "var(--orb-2)", animation: "orb-drift-b 16s ease-in-out infinite alternate" }}
        />
        <div className="absolute inset-0" style={{ backgroundImage: NOISE, opacity: 0.025 }} />
      </div>
    </>
  );
}
