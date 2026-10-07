import { useEffect, useRef, type MutableRefObject } from "react";

// Normalised Dubai skyline: [centreX, halfWidth, height] (height as a fraction of the panel).
const TOWERS: [number, number, number][] = [
  [0.05, 0.035, 0.16], [0.12, 0.03, 0.24], [0.18, 0.025, 0.2], [0.24, 0.03, 0.31], [0.3, 0.022, 0.27],
  [0.36, 0.03, 0.36], [0.42, 0.025, 0.29], [0.48, 0.028, 0.4], [0.54, 0.02, 0.33], [0.71, 0.026, 0.38],
  [0.77, 0.03, 0.3], [0.83, 0.024, 0.42], [0.88, 0.03, 0.26], [0.94, 0.035, 0.2], [0.99, 0.03, 0.14],
];

function skyline(x: number) {
  let h = 0.06;
  for (const [cx, hw, th] of TOWERS) if (Math.abs(x - cx) < hw) h = Math.max(h, th);
  // Burj Khalifa: tapered spire
  const d = Math.abs(x - 0.62);
  if (d < 0.05) h = Math.max(h, 0.62 * Math.pow(1 - d / 0.05, 0.55));
  return h;
}

/** Canvas dot-grid that draws a twinkling gold Dubai skyline and ripples away from the pointer. */
export function DotSkyline({ boost }: { boost: MutableRefObject<number> }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current;
    const host = c?.parentElement;
    const ctx = c?.getContext("2d");
    if (!c || !host || !ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const gold = getComputedStyle(c).getPropertyValue("--au-gold").trim() || "currentColor";
    const GAP = 9;
    let w = 0, h = 0, n = 0, raf = 0, inView = true;
    let dots = new Float32Array(0);
    const mouse = { x: -9999, y: -9999 };

    const build = () => {
      const r = c.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      w = r.width; h = r.height;
      c.width = Math.round(w * dpr); c.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const arr: number[] = [];
      for (let y = GAP / 2; y < h; y += GAP)
        for (let x = GAP / 2; x < w; x += GAP) {
          const inside = y > h - skyline(x / w) * h;
          if (!inside && Math.random() > 0.16) continue;
          arr.push(x, y, inside ? 1 : 0, Math.random() * 6.283, 0.6 + Math.random() * 1.4);
        }
      dots = new Float32Array(arr); n = arr.length / 5;
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = gold;
      const b = 0.85 + 0.35 * boost.current;
      for (let i = 0; i < n; i++) {
        const k = i * 5;
        let x = dots[k]!, y = dots[k + 1]!;
        const sky = dots[k + 2]!, ph = dots[k + 3]!, sp = dots[k + 4]!;
        const tw = reduce ? 0.5 : 0.5 + 0.5 * Math.sin(t * 0.0012 * sp + ph);
        let o = sky ? 0.15 + 0.45 * tw : 0.04 + 0.08 * tw;
        const dx = x - mouse.x, dy = y - mouse.y, d2 = dx * dx + dy * dy;
        if (!reduce && d2 < 19600) {
          const d = Math.sqrt(d2) || 1, f = 1 - d / 140;
          const push = f * 8 * (1 + 0.3 * Math.sin(t * 0.006 - d * 0.08));
          x += (dx / d) * push; y += (dy / d) * push; o = Math.min(1, o + f * 0.35);
        }
        ctx.globalAlpha = Math.min(1, o * b);
        ctx.fillRect(x - 1, y - 1, 2, 2);
      }
      ctx.globalAlpha = 1;
    };

    const loop = (t: number) => {
      draw(t);
      raf = !reduce && inView && !document.hidden ? requestAnimationFrame(loop) : 0;
    };
    const start = () => { if (!raf) raf = requestAnimationFrame(loop); };

    build(); draw(0); if (!reduce) start();
    const ro = new ResizeObserver(() => { build(); draw(performance.now()); });
    ro.observe(c);
    const io = new IntersectionObserver(([e]) => { inView = !!e?.isIntersecting; if (inView && !reduce) start(); });
    io.observe(c);
    const onVis = () => { if (!document.hidden && !reduce) start(); };
    const onMove = (e: PointerEvent) => {
      const r = c.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
      host.style.setProperty("--mx", String((e.clientX - r.left) / r.width - 0.5));
      host.style.setProperty("--my", String((e.clientY - r.top) / r.height - 0.5));
    };
    const onLeave = () => { mouse.x = mouse.y = -9999; host.style.setProperty("--mx", "0"); host.style.setProperty("--my", "0"); };
    document.addEventListener("visibilitychange", onVis);
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf); ro.disconnect(); io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
    };
  }, [boost]);
  return <canvas ref={ref} className="au-canvas" aria-hidden />;
}
