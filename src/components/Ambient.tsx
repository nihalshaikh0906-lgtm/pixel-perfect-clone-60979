const NOISE =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

/** Silk canvas: drifting champagne orbs and paper noise. Native cursor is kept for speed. */
export function Ambient() {
  return (
    <>
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div
          className="absolute -left-40 -top-40 size-[600px] rounded-full blur-3xl"
          style={{ background: "var(--orb-1)", animation: "orb-drift-a 15s ease-in-out infinite" }}
        />
        <div
          className="absolute -bottom-40 -right-40 size-[600px] rounded-full blur-3xl"
          style={{ background: "var(--orb-2)", animation: "orb-drift-b 15s ease-in-out infinite" }}
        />
        <div className="absolute inset-0" style={{ backgroundImage: NOISE, opacity: 0.025 }} />
      </div>
    </>
  );
}
