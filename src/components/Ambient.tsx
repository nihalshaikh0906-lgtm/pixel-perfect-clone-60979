import { useEffect, useRef, useState } from "react";

const NOISE =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

/** Silk canvas: drifting champagne orbs, paper noise, and a magnetic brass cursor. */
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
      <Cursor />
    </>
  );
}

const HOVER = "a, button, [role='button'], input, textarea, select, label";

function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setOn(true);
    document.body.classList.add("lux-cursor");
    const target = { x: -100, y: -100 };
    const pos = { x: -100, y: -100 };
    const vel = { x: 0, y: 0 };
    let size = 32;
    let goal = 32;
    let snap: { x: number; y: number } | null = null;
    let raf = 0;

    const move = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      const el = (e.target as Element | null)?.closest?.(HOVER);
      goal = el ? 56 : 32;
      if (el) {
        const r = el.getBoundingClientRect();
        snap = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      } else snap = null;
      let dx = e.clientX;
      let dy = e.clientY;
      if (snap) {
        dx += (snap.x - dx) * 0.15;
        dy += (snap.y - dy) * 0.15;
      }
      if (dot.current) dot.current.style.transform = `translate(${dx - 2.5}px, ${dy - 2.5}px)`;
    };

    const tick = () => {
      // spring: stiffness 200, damping 25 (per-frame approximation)
      const dt = 1 / 60;
      vel.x += ((target.x - pos.x) * 200 - vel.x * 25) * dt;
      vel.y += ((target.y - pos.y) * 200 - vel.y * 25) * dt;
      pos.x += vel.x * dt;
      pos.y += vel.y * dt;
      size += (goal - size) * 0.18;
      if (ring.current) {
        ring.current.style.transform = `translate(${pos.x - size / 2}px, ${pos.y - size / 2}px)`;
        ring.current.style.width = ring.current.style.height = `${size}px`;
        ring.current.dataset["hover"] = goal > 32 ? "1" : "0";
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", move);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(raf);
      document.body.classList.remove("lux-cursor");
    };
  }, []);

  if (!on) return null;
  return (
    <>
      <div
        ref={ring}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[100] rounded-full border border-primary/45 transition-[background-color,box-shadow] duration-300 data-[hover=1]:bg-primary/10 data-[hover=1]:shadow-[0_0_24px_var(--gold-hairline)] data-[hover=1]:backdrop-blur-[1px]"
      />
      <div
        ref={dot}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[101] size-[5px] rounded-full bg-primary"
      />
    </>
  );
}
