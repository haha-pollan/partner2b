// Pixel-grid article covers: dark background, one ecosystem shape built from squares, one accent colour each.
const C = 12, W = 26, H = 15, OX = 4;
type Cell = [number, number];
const BG = "#0A0A0B", LIME = "#A8FF5C";

function mix(a: string, b: string, t: number) {
  const p = (s: string) => [1, 3, 5].map((i) => parseInt(s.slice(i, i + 2), 16));
  const x = p(a), y = p(b);
  return "#" + x.map((v, i) => Math.round(v * (1 - t) + y[i] * t).toString(16).padStart(2, "0")).join("").toUpperCase();
}
function line(x0: number, y0: number, x1: number, y1: number): Cell[] {
  const pts: Cell[] = [];
  const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
  let e = dx + dy;
  for (;;) {
    pts.push([x0, y0]);
    if (x0 === x1 && y0 === y1) break;
    const e2 = 2 * e;
    if (e2 >= dy) { e += dy; x0 += sx; }
    if (e2 <= dx) { e += dx; y0 += sy; }
  }
  return pts;
}
function ring(cx: number, cy: number, r: number, w = 0.9, fill = false): Cell[] {
  const out: Cell[] = [];
  for (let x = 0; x < W; x++) for (let y = 0; y < H; y++) {
    const d = Math.hypot(x - cx, y - cy);
    if ((fill && d <= r) || (!fill && Math.abs(d - r) <= w)) out.push([x, y]);
  }
  return out;
}
const blk = (x: number, y: number, w = 2, h = 2): Cell[] => {
  const o: Cell[] = [];
  for (let i = 0; i < w; i++) for (let j = 0; j < h; j++) o.push([x + i, y + j]);
  return o;
};
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
type Layer = [string, Cell[]];

type Tpl = { tag: string; layers: (r: () => number, a: string) => Layer[] };
const ACCENTS = ["#4FD6E8", "#FF7A3D", "#8B7BFF", "#FF4FA3", "#FFD23F", "#5B8CFF", "#3DDBB0", "#FF5C5C"];
const ri = (r: () => number, lo: number, hi: number) => lo + Math.floor(r() * (hi - lo + 1));
const keyOf = (c: Cell) => c[0] + "," + c[1];

const TEMPLATES: Tpl[] = [
  { // network: hub with satellites
    tag: "Partner ecosystems",
    layers: (r, a) => {
      const cx = ri(r, 11, 17), cy = ri(r, 6, 9), n = ri(r, 5, 9);
      const sats: Cell[] = [];
      for (let k = 0; k < n; k++) {
        const ang = (k / n) * Math.PI * 2 + r() * 0.6, d = 4 + r() * 6;
        sats.push([Math.max(2, Math.min(W - 3, Math.round(cx + Math.cos(ang) * d * 1.5))), Math.max(3, Math.min(H - 3, Math.round(cy + Math.sin(ang) * d * 0.8)))]);
      }
      const L: Cell[] = [], N: Cell[] = [];
      sats.forEach(([x, y]) => L.push(...line(cx, cy, x, y)));
      for (let k = 0; k < n - 1; k += ri(r, 1, 2)) L.push(...line(sats[k][0], sats[k][1], sats[k + 1][0], sats[k + 1][1]));
      sats.forEach(([x, y]) => N.push(...blk(x - 1, y - 1, r() < 0.4 ? 3 : 2, r() < 0.4 ? 3 : 2)));
      return [[mix(BG, a, 0.45), L], [a, N], [mix(BG, LIME, 0.7), ring(cx, cy, 3.6, 0.55)], [LIME, ring(cx, cy, ri(r, 15, 22) / 10, 0.9, true)]];
    },
  },
  { // overlapping rings
    tag: "Co-selling",
    layers: (r, a) => {
      const n = ri(r, 2, 3), cs: [number, number, number][] = [];
      for (let k = 0; k < n; k++) cs.push([ri(r, 8, 18) + k * 2, ri(r, 5, 9), ri(r, 33, 55) / 10]);
      const sets = cs.map((c) => ring(c[0], c[1], c[2], 0.8));
      const cnt = new Map<string, number>();
      sets.forEach((s) => s.forEach((c) => cnt.set(keyOf(c), (cnt.get(keyOf(c)) ?? 0) + 1)));
      const cols = [LIME, a, LIME];
      const layers: Layer[] = sets.map((s, k) => [cols[k], s.filter((c) => cnt.get(keyOf(c)) === 1)] as Layer);
      layers.push(["#ECECEE", [...cnt.entries()].filter(([, v]) => v > 1).map(([k]) => k.split(",").map(Number) as Cell)]);
      cs.forEach((c, k) => layers.push([mix(BG, k % 2 ? a : LIME, 0.5), ring(c[0], c[1], 1.8, 0.7)]));
      return layers;
    },
  },
  { // marketplace tiles
    tag: "Marketplace",
    layers: (r, a) => {
      const dim: Cell[] = [], vi: Cell[] = [], li: Cell[] = [], path: Cell[] = [];
      const cols = ri(r, 4, 6), rows = ri(r, 2, 3), tw = ri(r, 2, 3), gap = tw + 1;
      const x0 = ri(r, 2, 4), y0 = ri(r, 3, 4);
      const picks: Cell[] = [];
      for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) {
        const x = x0 + i * gap, y = y0 + j * (tw + 1);
        if (x + tw > W - 1 || y + tw > H - 1 || r() < 0.12) continue;
        const t = blk(x, y, tw, tw), q = r();
        if (q < 0.34) li.push(...t); else if (q < 0.68) vi.push(...t); else dim.push(...t);
        picks.push([x + 1, y + 1]);
      }
      for (let k = 0; k < picks.length - 1; k += 2) path.push(...line(picks[k][0], picks[k][1], picks[k + 1][0], picks[k + 1][1]));
      return [[mix(BG, "#3A3B40", 0.7), dim], [mix(BG, a, 0.55), vi], [mix(BG, LIME, 0.55), li], ["#ECECEE", path]];
    },
  },
  { // pipeline funnel
    tag: "Pipeline",
    layers: (r, a) => {
      const dots: Cell[] = [], fun: Cell[] = [];
      const n = ri(r, 14, 30), fx = ri(r, 7, 10), fl = ri(r, 7, 10), cy = ri(r, 6, 8), h0 = ri(r, 4, 6);
      for (let i = 0; i < n; i++) dots.push([ri(r, 1, fx - 1), ri(r, 3, H - 2)]);
      for (let x = fx; x < fx + fl; x++) {
        const t = (x - fx) / (fl - 1), half = Math.round(h0 * (1 - t) + 1 * t);
        fun.push([x, cy - half], [x, cy + half]);
      }
      const ex = fx + fl;
      fun.push(...line(ex, cy, W - 4, cy));
      return [[mix(BG, "#85868B", 0.8), dots], [mix(BG, a, 0.5), fun], [LIME, line(fx, cy, ex, cy)], [a, blk(W - 5, cy - 2, 4, 4)], [LIME, blk(W - 3, cy - 1, 2, 2)]];
    },
  },
  { // tier stairs
    tag: "Partner tiers",
    layers: (r, a) => {
      const steps = ri(r, 4, 7), sw = ri(r, 2, 4), sh = ri(r, 1, 2), x0 = ri(r, 1, 4);
      const st: Cell[] = [], sd: Cell[] = [];
      for (let i = 0; i < steps; i++) for (let x = x0 + sw * i; x < x0 + sw * (i + 1); x++) {
        if (x >= W) continue;
        const top = H - 3 - sh * (i + 1);
        for (let y = top; y < top + sh; y++) st.push([x, y]);
        for (let y = top + sh; y < H; y++) sd.push([x, y]);
      }
      const cut = x0 + sw * Math.max(1, steps - ri(r, 1, 2));
      return [[mix(BG, LIME, 0.45), sd], [LIME, st.filter((c) => c[0] < cut)], [a, st.filter((c) => c[0] >= cut)], [a, [[W - 5, 1], [W - 4, 1], [W - 5, 2], [W - 4, 2]]]];
    },
  },
  { // orbits
    tag: "Ecosystem",
    layers: (r, a) => {
      const cx = ri(r, 11, 17), cy = ri(r, 6, 9), r1 = ri(r, 55, 70) / 10, r2 = ri(r, 28, 40) / 10;
      const sat: Cell[] = [], dots: Cell[] = [];
      const on = (rad: number): Cell => {
        const ang = r() * Math.PI * 2;
        return [Math.round(cx + Math.cos(ang) * rad * 1.5), Math.round(cy + Math.sin(ang) * rad * 0.9)];
      };
      const ns = ri(r, 2, 4), nd = ri(r, 1, 3);
      for (let k = 0; k < ns; k++) { const p = on(r1); sat.push(...blk(p[0], p[1], 2, 2)); }
      for (let k = 0; k < nd; k++) { const p = on(r2); dots.push(...blk(p[0], p[1], 1, 1)); }
      return [[mix(BG, a, 0.4), ring(cx, cy, r1, 0.7)], [mix(BG, LIME, 0.4), ring(cx, cy, r2, 0.7)], [LIME, blk(cx - 1, cy - 1)], [a, sat], ["#ECECEE", dots]];
    },
  },
];

// Covers made for one specific article. They are picked by slug, so they do not depend on the article's position in the list.
const PINNED: Record<string, { tpl: Tpl; accent: string }> = {
  "why-do-partners-go-quiet-after-signing": {
    accent: "#8B7BFF",
    tpl: { // one hub, many partners, only a few lit
      tag: "Partner activation",
      layers: (_r, a) => {
        const hub: Cell = [3, 7];
        const nodes: Cell[] = [];
        for (const x of [10, 15, 20]) for (const y of [2, 5, 8, 11]) nodes.push([x, y]);
        const on = new Set([2, 5, 8]);
        const dimL: Cell[] = [], litL: Cell[] = [], dimN: Cell[] = [], litN: Cell[] = [];
        nodes.forEach(([x, y], k) => {
          if (on.has(k)) { litL.push(...line(hub[0], hub[1], x, y + 1)); litN.push(...blk(x, y)); }
          else { dimL.push(...line(hub[0], hub[1], x, y + 1)); dimN.push(...blk(x, y)); }
        });
        return [[mix(BG, "#85868B", 0.28), dimL], [mix(BG, LIME, 0.7), litL], [mix(BG, "#85868B", 0.5), dimN], [a, litN], [LIME, blk(hub[0] - 1, hub[1] - 1, 3, 3)]];
      },
    },
  },
};

export function buildCover(slug: string, title: string, i: number) {
  let h = 0;
  for (const c of slug) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const r = rng(h);
  const pin = PINNED[slug];
  const tpl = pin ? pin.tpl : TEMPLATES[i % TEMPLATES.length];
  const accent = pin ? pin.accent : ACCENTS[(i + Math.floor(i / TEMPLATES.length)) % ACCENTS.length];
  const bg = new Map<string, string>();
  for (let x = 0; x < W; x++) for (let y = 0; y < H; y++) if (r() < 0.3) bg.set(x + "," + y, mix(BG, "#3A3B40", 0.18 + r() * 0.3));
  const fg = new Map<string, string>();
  tpl.layers(r, accent).forEach(([col, cells]) => cells.forEach(([x, y]) => { if (x >= 0 && x < W && y >= 0 && y < H) fg.set(x + "," + y, col); }));
  const groups = new Map<string, string>();
  const add = (k: string, col: string) => {
    const [x, y] = k.split(",").map(Number);
    groups.set(col, (groups.get(col) ?? "") + `M${OX + x * C + 1} ${y * C + 1}h${C - 2}v${C - 2}h-${C - 2}z`);
  };
  bg.forEach((col, k) => { if (!fg.has(k)) add(k, col); });
  fg.forEach((col, k) => add(k, col));
  return { paths: [...groups.entries()].map(([fill, d]) => ({ fill, d })), tag: tpl.tag, accent };
}
