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

type Tpl = { tag: string; accent: string; layers: (r: () => number) => Layer[] };

const TEMPLATES: Tpl[] = [
  {
    tag: "Partner ecosystems", accent: "#4FD6E8",
    layers: () => {
      const cx = 16, cy = 8, a = "#4FD6E8";
      const sats: Cell[] = [[22, 3], [23, 10], [20, 13], [10, 12], [9, 5], [15, 3], [5, 8]];
      const L: Cell[] = [], N: Cell[] = [];
      sats.forEach(([x, y]) => L.push(...line(cx, cy, x, y)));
      [[[22, 3], [23, 10]], [[9, 5], [15, 3]], [[10, 12], [5, 8]]].forEach(([p, q]) => L.push(...line(p[0], p[1], q[0], q[1])));
      sats.forEach(([x, y]) => N.push(...blk(x - 1, y - 1)));
      return [[mix(BG, a, 0.45), L], [a, N], [mix(BG, LIME, 0.7), ring(cx, cy, 3.6, 0.55)], [LIME, ring(cx, cy, 2.0, 0.9, true)]];
    },
  },
  {
    tag: "Co-selling", accent: "#FF7A3D",
    layers: () => {
      const a = ring(11, 8, 4.6, 0.8), b = ring(16, 7, 4.6, 0.8), O = "#FF7A3D";
      const key = (c: Cell) => c[0] + "," + c[1];
      const ka = new Set(a.map(key)), kb = new Set(b.map(key));
      const ov = a.filter((c) => kb.has(key(c)));
      return [[LIME, a.filter((c) => !kb.has(key(c)))], [O, b.filter((c) => !ka.has(key(c)))], ["#ECECEE", ov], [mix(BG, LIME, 0.5), ring(11, 8, 2.2, 0.7)], [mix(BG, O, 0.5), ring(16, 7, 2.2, 0.7)]];
    },
  },
  {
    tag: "Marketplace", accent: "#8B7BFF",
    layers: () => {
      const V = "#8B7BFF", dim: Cell[] = [], vi: Cell[] = [], li: Cell[] = [];
      const pos: Cell[] = [[3, 4], [7, 4], [11, 4], [15, 4], [19, 4], [3, 8], [7, 8], [11, 8], [15, 8], [19, 8], [7, 12], [11, 12], [15, 12], [19, 12], [3, 12]];
      pos.forEach(([x, y], i) => {
        const k = i % 5, t = blk(x, y, 3, y === 12 ? 2 : 3);
        if (k === 0 || k === 3) li.push(...t); else if (k === 1 || k === 4) vi.push(...t); else dim.push(...t);
      });
      const path: Cell[] = [];
      [[[4, 5], [8, 9]], [[8, 9], [12, 13]], [[12, 13], [16, 9]], [[16, 9], [20, 5]]].forEach(([p, q]) => path.push(...line(p[0], p[1], q[0], q[1])));
      return [[mix(BG, "#3A3B40", 0.7), dim], [mix(BG, V, 0.55), vi], [mix(BG, LIME, 0.55), li], ["#ECECEE", path]];
    },
  },
  {
    tag: "Pipeline", accent: "#FF4FA3",
    layers: (r) => {
      const P = "#FF4FA3", dots: Cell[] = [], fun: Cell[] = [];
      for (let i = 0; i < 22; i++) dots.push([1 + Math.floor(r() * 8), 4 + Math.floor(r() * 10)]);
      for (let x = 9; x < 17; x++) {
        const t = (x - 9) / 7, half = Math.round(6 * (1 - t) + 1 * t);
        fun.push([x, 7 - half], [x, 7 + half]);
      }
      fun.push(...line(17, 7, 22, 7));
      return [[mix(BG, "#85868B", 0.8), dots], [mix(BG, P, 0.5), fun], [LIME, line(9, 7, 17, 7)], [P, blk(21, 5, 4, 4)], [LIME, blk(23, 6, 2, 2)]];
    },
  },
  {
    tag: "Partner tiers", accent: "#FFD23F",
    layers: () => {
      const Y = "#FFD23F", st: Cell[] = [], sd: Cell[] = [];
      for (let i = 0; i < 6; i++) for (let x = 2 + 3 * i; x < 5 + 3 * i; x++) {
        for (let j = 0; j < 2; j++) st.push([x, 12 - 2 * i - j]);
        for (let y = 13 - 2 * i; y < 15; y++) sd.push([x, y]);
      }
      return [[mix(BG, LIME, 0.45), sd], [LIME, st.filter((c) => c[0] < 17)], [Y, st.filter((c) => c[0] >= 17)], [Y, [[21, 0], [22, 0]]]];
    },
  },
  {
    tag: "Ecosystem", accent: "#5B8CFF",
    layers: () => {
      const B = "#5B8CFF";
      const sat = [...blk(19, 3), ...blk(8, 10), ...blk(13, 12, 1, 1), ...blk(11, 2)];
      return [[mix(BG, B, 0.4), ring(14, 8, 6, 0.7)], [mix(BG, LIME, 0.4), ring(14, 8, 3.4, 0.7)], [LIME, blk(13, 7)], [B, sat], ["#ECECEE", [...blk(19, 3, 1, 1), ...blk(8, 10, 1, 1)]]];
    },
  },
];

// pick a template by topic words in the title, otherwise rotate by position
export function templateIndex(title: string, i: number) {
  const t = title.toLowerCase();
  if (/marketplace/.test(t)) return 2;
  if (/co-market|co-sell|mdf|market development/.test(t)) return 1;
  if (/pipeline|lead|kpi|metric|funnel|sales growth|revops/.test(t)) return 3;
  if (/program|tier|value proposition|strategy|playbook|skills/.test(t)) return 4;
  if (/network|ecosystem/.test(t)) return 0;
  return i % TEMPLATES.length;
}

export function buildCover(slug: string, title: string, i: number) {
  let h = 0;
  for (const c of slug) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const r = rng(h);
  const tpl = TEMPLATES[templateIndex(title, i)];
  const bg = new Map<string, string>();
  for (let x = 0; x < W; x++) for (let y = 0; y < H; y++) if (r() < 0.3) bg.set(x + "," + y, mix(BG, "#3A3B40", 0.18 + r() * 0.3));
  const fg = new Map<string, string>();
  tpl.layers(r).forEach(([col, cells]) => cells.forEach(([x, y]) => { if (x >= 0 && x < W && y >= 0 && y < H) fg.set(x + "," + y, col); }));
  const groups = new Map<string, string>();
  const add = (k: string, col: string) => {
    const [x, y] = k.split(",").map(Number);
    groups.set(col, (groups.get(col) ?? "") + `M${OX + x * C + 1} ${y * C + 1}h${C - 2}v${C - 2}h-${C - 2}z`);
  };
  bg.forEach((col, k) => { if (!fg.has(k)) add(k, col); });
  fg.forEach((col, k) => add(k, col));
  return { paths: [...groups.entries()].map(([fill, d]) => ({ fill, d })), tag: tpl.tag, accent: tpl.accent };
}
