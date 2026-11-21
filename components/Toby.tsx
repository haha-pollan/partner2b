"use client";
import { useEffect, useRef } from "react";
import { TOBY_W, TOBY_H, TOBY_PALETTE, TOBY_ROWS, TOBY_BLOCKS, TOBY_EYES, TOBY_MOUTH, TOBY_SMILE } from "@/lib/toby";

type Item = { x: number; y: number; s: number; c: number; t: number };

const SKIN = 3; // palette index of the light face colour
const LIME = 5;
const DARK = "#0A0A0B";
const DARKI = 7; // palette index of the dark colour

// Deterministic pseudo random so the build-up looks the same on server and client
const rnd = (n: number) => {
  const v = Math.sin(n * 12.9898) * 43758.5453;
  return v - Math.floor(v);
};

export function Toby({ height = 300, lime = true, animate = true, className, style }: { height?: number; lime?: boolean; animate?: boolean; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const live = animate && !reduce;

    // all pixels in one list, each with the time it appears in the build-up
    const items: Item[] = [];
    // eyes and mouth are dark pixels, drawn first so the white highlights sit on top
    [...TOBY_EYES, ...TOBY_MOUTH].forEach(([x, y], i) => items.push({ x, y, s: 1, c: DARKI, t: (y / TOBY_H) * 0.9 + rnd(i * 5 + 1) * 0.7 }));
    TOBY_ROWS.forEach((row, y) => {
      for (let x = 0; x < row.length; x++) {
        const ch = row[x];
        if (ch === ".") continue;
        items.push({ x, y, s: 1, c: Number(ch), t: (y / TOBY_H) * 0.9 + rnd(x * 91 + y * 17) * 0.7 });
      }
    });
    TOBY_BLOCKS.forEach(([x, y, c], i) => {
      items.push({ x, y, s: 4, c: !lime && c === LIME ? 0 : c, t: (y / TOBY_H) * 0.9 + rnd(i * 7 + 3) * 0.7 });
    });
    items.sort((a, b) => a.y - b.y);

    const eyeRows = TOBY_EYES.map((e) => e[1]);
    const eyeTop = Math.min(...eyeRows);
    const eyeBottom = Math.max(...eyeRows);

    let cell = 1;
    let dpr = 1;
    let blinking = false;
    let smiling = false;
    let t0 = 0;
    let raf = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const size = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 3);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      cell = Math.min(canvas.width / TOBY_W, canvas.height / TOBY_H);
    };

    const rect = (x: number, y: number, s: number, color: string) => {
      const g = cell * 0.07;
      ctx.fillStyle = color;
      ctx.fillRect(x * cell + g, y * cell + g, s * cell - 2 * g, s * cell - 2 * g);
    };

    const draw = (progress: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const it of items) {
        if (it.t > progress) continue;
        // a short pop as each pixel appears
        const k = Math.min(1, (progress - it.t) / 0.18);
        const color = TOBY_PALETTE[it.c];
        if (k < 1) {
          const sc = 0.4 + 0.6 * k;
          const o = (1 - sc) * it.s * 0.5;
          const g = cell * 0.07;
          ctx.fillStyle = color;
          ctx.fillRect((it.x + o) * cell + g, (it.y + o) * cell + g, it.s * sc * cell - 2 * g, it.s * sc * cell - 2 * g);
        } else {
          rect(it.x, it.y, it.s, color);
        }
      }
      if (progress >= 1.6) {
        if (blinking) {
          // lids close over the upper part of each eye, a dark line stays
          for (const [x, y] of TOBY_EYES) if (y < eyeBottom) rect(x, y, 1, TOBY_PALETTE[SKIN]);
        }
        if (smiling) for (const [x, y] of TOBY_SMILE) rect(x, y, 1, DARK);
      }
    };

    const redraw = () => draw(10);

    const build = (now: number) => {
      if (!t0) t0 = now;
      const p = (now - t0) / 1000 * 1.0;
      draw(p);
      if (p < 2.4) raf = requestAnimationFrame(build);
      else { redraw(); scheduleBlink(); }
    };

    const scheduleBlink = () => {
      if (!live) return;
      timer = setTimeout(() => {
        blinking = true; redraw();
        setTimeout(() => {
          blinking = false; redraw();
          // sometimes a double blink
          if (Math.random() < 0.25) setTimeout(() => { blinking = true; redraw(); setTimeout(() => { blinking = false; redraw(); scheduleBlink(); }, 110); }, 160);
          else scheduleBlink();
        }, 120);
      }, 2200 + Math.random() * 3200);
    };

    const over = () => { smiling = true; redraw(); };
    const out = () => { smiling = false; redraw(); };

    size();
    if (live) raf = requestAnimationFrame(build);
    else redraw();
    canvas.addEventListener("mouseenter", over);
    canvas.addEventListener("mouseleave", out);
    const ro = new ResizeObserver(() => { size(); redraw(); });
    ro.observe(canvas);

    // pause the blink timer when the tab is hidden
    const vis = () => { if (document.hidden) { if (timer) clearTimeout(timer); } else if (live && t0) scheduleBlink(); };
    document.addEventListener("visibilitychange", vis);

    return () => {
      cancelAnimationFrame(raf);
      if (timer) clearTimeout(timer);
      ro.disconnect();
      canvas.removeEventListener("mouseenter", over);
      canvas.removeEventListener("mouseleave", out);
      document.removeEventListener("visibilitychange", vis);
    };
  }, [animate, lime]);

  const w = Math.round((height * TOBY_W) / TOBY_H);
  return <canvas ref={ref} aria-hidden="true" className={className} style={{ width: w, height, display: "block", ...style }} />;
}
