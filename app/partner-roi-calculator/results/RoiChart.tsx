import type { RoiResult } from "@/lib/roi/model";
import { trim } from "@/lib/roi/model";

const short = (n: number) => (n >= 1e6 ? `$${trim(Math.round(n / 1e5) / 10)}M` : n >= 1e3 ? `$${Math.round(n / 1e3)}K` : `$${Math.round(n)}`);
const nice = (max: number) => { const p = Math.pow(10, Math.floor(Math.log10(max))); const f = max / p; return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10) * p; };

// Cumulative cost and cumulative return drawn as two crossing tapes, with the break-even point where they meet.
export function RoiChart({ r, horizon }: { r: RoiResult; horizon: number }) {
  const W = 900, H = 440, L = 86, R = 40, T = 70, B = 56;
  const rows = [{ month: 0, cost: 0, revenue: 0, net: 0 }, ...r.rows];
  const top = nice(Math.max(...rows.map((x) => Math.max(x.cost, x.revenue))) * 1.05);
  const x = (m: number) => L + (m / horizon) * (W - L - R);
  const y = (v: number) => T + (1 - v / top) * (H - T - B);
  const line = (k: "cost" | "revenue") => rows.map((p) => `${x(p.month).toFixed(1)},${y(p[k]).toFixed(1)}`).join(" ");
  const grid = [0, 0.25, 0.5, 0.75, 1].map((f) => f * top);
  const step = horizon > 12 ? 4 : 2;
  const ticks: number[] = []; for (let m = 0; m <= horizon; m += step) ticks.push(m);
  const be = r.paybackExact !== null && r.paybackExact <= horizon ? r.paybackExact : null;
  // Cost at the break-even month, read off the cost line
  const costAt = (m: number) => { const lo = Math.floor(m), hi = Math.ceil(m); const a = rows[lo].cost, b = rows[Math.min(hi, rows.length - 1)].cost; return a + (b - a) * (m - lo); };
  const bx = be === null ? 0 : x(be), by = be === null ? 0 : y(costAt(be));
  const last = rows[rows.length - 1];
  const font = "'IBM Plex Sans',sans-serif";
  const chipW = (t: string) => t.length * 13.5 + 28;
  // End chips: the higher line gets its chip above the tape end, the lower line below it
  const retHigher = last.revenue >= last.cost;
  const endX = W - R - 6;
  const chip = (label: string, above: boolean, v: number, fill: string) => {
    const w = chipW(label), yy = y(v) + (above ? -50 : 20);
    return (<g key={label}><rect x={endX - w} y={yy} width={w} height={34} fill={fill} /><text x={endX - w / 2} y={yy + 24} textAnchor="middle" fontSize={21} fill="#0A0A0B" fontFamily={font}>{label}</text></g>);
  };
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Cumulative cost and return over ${horizon} months${be ? `, break-even in month ${trim(Math.ceil(be))}` : ""}`} style={{ width: "100%", height: "auto", display: "block" }}>
      {grid.map((g) => (
        <g key={g}>
          <line x1={L} x2={W - R} y1={y(g)} y2={y(g)} stroke="#3A3B40" strokeWidth={g === 0 ? 2 : 1} />
          <text x={L - 14} y={y(g) + 8} textAnchor="end" fontSize={22} fill="#B9BABD" fontFamily={font}>{short(g)}</text>
        </g>
      ))}
      {ticks.map((m) => (
        <text key={m} x={x(m)} y={H - 16} textAnchor="middle" fontSize={22} fill="#B9BABD" fontFamily={font}>{m}</text>
      ))}
      <text x={L - 14} y={H - 16} textAnchor="end" fontSize={20} fill="#85868B" fontFamily={font}>months</text>
      <polyline points={line("cost")} fill="none" stroke="#FFFFFF" strokeWidth={22} strokeLinejoin="bevel" strokeLinecap="butt" />
      <polyline points={line("revenue")} fill="none" stroke="#A8FF5C" strokeWidth={22} strokeLinejoin="bevel" strokeLinecap="butt" />
      {be !== null && (
        <g>
          <circle cx={bx} cy={by} r={17} fill="#0A0A0B" stroke="#A8FF5C" strokeWidth={5} />
          <line x1={bx} x2={bx} y1={by - 26} y2={T - 6} stroke="#A8FF5C" strokeWidth={2} strokeDasharray="6 6" />
          <rect x={Math.min(Math.max(bx - 120, L), W - R - 240)} y={T - 44} width={240} height={38} fill="#7C5CFF" />
          <text x={Math.min(Math.max(bx - 120, L), W - R - 240) + 120} y={T - 18} textAnchor="middle" fontSize={21} fill="#FFFFFF" fontFamily={font}>Break-even, month {trim(Math.ceil(be))}</text>
        </g>
      )}
      {chip("Return", retHigher, last.revenue, "#A8FF5C")}
      {chip("Cost", !retHigher, last.cost, "#FFFFFF")}
    </svg>
  );
}
