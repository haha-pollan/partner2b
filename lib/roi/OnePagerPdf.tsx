import React from "react";
import path from "node:path";
import { Font, Document, Page, View, Text, Image, Link, Svg, Polygon, Polyline, Line, Rect, Circle, StyleSheet, renderToBuffer } from "@react-pdf/renderer";
import { deals1, pct, trim, usd, type Lever, type RoiInputs, type RoiResult } from "./model";

// A4 one-pager in the same look as the pipeline one-pager. Design pixels (794 x 1123) are converted to points with P().
const P = (n: number) => n * 0.75;
const A = (f: string) => path.join(process.cwd(), "lib", "pipeline", "assets", f);
Font.register({ family: "Michroma", src: A("Michroma.woff") });
Font.register({ family: "Sora", fonts: [{ src: A("Sora-500.woff"), fontWeight: 500 }, { src: A("Sora-700.woff"), fontWeight: 700 }] });
Font.registerHyphenationCallback((w) => [w]);

const INK = "#0A0A0B", LIME = "#A8FF5C", VIOLET = "#7C5CFF", G600 = "#4A4B51", G800 = "#2A2B30", G400 = "#85868B";
const s = StyleSheet.create({ body: { fontFamily: "Sora", fontWeight: 500, color: INK } });

function Disp({ children, size, color = INK }: { children: string; size: number; color?: string }) {
  const st = { fontFamily: "Michroma", fontSize: P(size), color, lineHeight: 1.2 } as const;
  return (
    <View>
      <Text style={st}>{children}</Text>
      <Text style={{ ...st, position: "absolute", top: 0, left: P(0.7) }}>{children}</Text>
    </View>
  );
}
function Cut({ w, h, c, fill, style, children }: { w: number; h: number; c: number; fill: string; style?: object; children?: React.ReactNode }) {
  const W = P(w), H = P(h), C = P(c);
  return (
    <View style={{ width: W, height: H, ...style }}>
      <Svg width={W} height={H} style={{ position: "absolute", top: 0, left: 0 }}>
        <Polygon points={`0,0 ${W},0 ${W},${H - C} ${W - C},${H} 0,${H}`} fill={fill} />
      </Svg>
      {children}
    </View>
  );
}

const short = (n: number) => `${n < 0 ? "-" : ""}${Math.abs(n) >= 1e6 ? `$${trim(Math.round(Math.abs(n) / 1e5) / 10)}M` : Math.abs(n) >= 1e4 ? `$${Math.round(Math.abs(n) / 1e3)}K` : usd(Math.abs(n))}`;
const nice = (max: number) => { const p = Math.pow(10, Math.floor(Math.log10(max))); const f = max / p; return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10) * p; };

export type OnePagerData = { inputs: RoiInputs; r: RoiResult; half: RoiResult | null; lever: Lever | null };

function Chart({ r, horizon }: { r: RoiResult; horizon: number }) {
  const W = 698, H = 300, L = 64, R = 14, T = 40, B = 34;
  const rows = [{ month: 0, cost: 0, revenue: 0, net: 0 }, ...r.rows];
  const top = nice(Math.max(...rows.map((x) => Math.max(x.cost, x.revenue))) * 1.05);
  const x = (m: number) => P(L + (m / horizon) * (W - L - R));
  const y = (v: number) => P(T + (1 - v / top) * (H - T - B));
  const pts = (k: "cost" | "revenue") => rows.map((p) => `${x(p.month)},${y(p[k])}`).join(" ");
  const grid = [0, 0.25, 0.5, 0.75, 1].map((f) => f * top);
  const step = horizon > 12 ? 4 : 2;
  const ticks: number[] = []; for (let m = 0; m <= horizon; m += step) ticks.push(m);
  const be = r.paybackExact !== null && r.paybackExact <= horizon ? r.paybackExact : null;
  const costAt = (m: number) => { const lo = Math.floor(m), hi = Math.min(Math.ceil(m), rows.length - 1); return rows[lo].cost + (rows[hi].cost - rows[lo].cost) * (m - lo); };
  const last = rows[rows.length - 1];
  return (
    <Svg width={P(W)} height={P(H)}>
      {grid.map((g) => (<Line key={g} x1={P(L)} x2={P(W - R)} y1={y(g)} y2={y(g)} stroke="#B9BABD" strokeWidth={g === 0 ? 1.5 : 0.6} />))}
      {grid.map((g) => (<Text key={`t${g}`} x={P(L - 8)} y={y(g) + 3} style={{ fontSize: 8, fontFamily: "Sora" }} fill={G600} textAnchor="end">{short(g)}</Text>))}
      {ticks.map((m) => (<Text key={`m${m}`} x={x(m)} y={P(H - 10)} style={{ fontSize: 8, fontFamily: "Sora" }} fill={G600} textAnchor="middle">{String(m)}</Text>))}
      <Polyline points={pts("cost")} stroke={INK} strokeWidth={P(14)} fill="none" />
      <Polyline points={pts("revenue")} stroke={LIME} strokeWidth={P(14)} fill="none" />
      {be !== null && <Circle cx={x(be)} cy={y(costAt(be))} r={P(11)} fill="#FFFFFF" stroke={VIOLET} strokeWidth={P(4)} />}
      <Rect x={P(W - R) - 52} y={y(last.revenue >= last.cost ? last.revenue : last.cost) - P(30)} width={52} height={14} fill={last.revenue >= last.cost ? LIME : INK} />
      <Text x={P(W - R) - 26} y={y(last.revenue >= last.cost ? last.revenue : last.cost) - P(30) + 10} style={{ fontSize: 8, fontFamily: "Sora" }} fill={last.revenue >= last.cost ? INK : "#FFFFFF"} textAnchor="middle">{last.revenue >= last.cost ? "Return" : "Cost"}</Text>
      <Rect x={P(W - R) - 52} y={y(last.revenue >= last.cost ? last.cost : last.revenue) + P(18)} width={52} height={14} fill={last.revenue >= last.cost ? INK : LIME} />
      <Text x={P(W - R) - 26} y={y(last.revenue >= last.cost ? last.cost : last.revenue) + P(18) + 10} style={{ fontSize: 8, fontFamily: "Sora" }} fill={last.revenue >= last.cost ? "#FFFFFF" : INK} textAnchor="middle">{last.revenue >= last.cost ? "Cost" : "Return"}</Text>
    </Svg>
  );
}

function Doc({ inputs, r, half, lever }: OnePagerData) {
  const H = trim(inputs.horizon);
  const dpp = deals1(r.dealsPerPartnerInWindow);
  const stats = [
    { n: pct(r.roi), l: `return on ${short(r.totalCost)} invested`, fill: "#FFFFFF", fg: INK, nc: INK, rot: -1.5 },
    { n: r.payback === null ? "None" : `Month ${r.payback}`, l: r.payback === null ? "break-even at these numbers" : "your program pays back", fill: LIME, fg: INK, nc: INK, rot: 1.2 },
    { n: short(r.revenue), l: "closed through partners", fill: VIOLET, fg: "#FFFFFF", nc: "#FFFFFF", rot: -1 },
  ];
  return (
    <Document title="Your partner ROI" author="Partner2B" subject="Partner ROI one-pager">
      <Page size={[595.28, 841.89]} style={{ ...s.body, padding: 0 }}>
      <View style={{ position: "relative", width: 595.28, height: 841.89, overflow: "hidden" }}>
        <Image src={A("mesh-light.jpg")} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }} />
        <View style={{ paddingTop: P(44), paddingHorizontal: P(48) }}>
          <Disp size={34}>Your partner ROI</Disp>
          <Text style={{ marginTop: P(10), fontSize: P(17), lineHeight: 1.5, color: G600, maxWidth: P(640) }}>
            {"If you invest "}
            <Text style={{ backgroundColor: LIME, color: INK }}>{` ${usd(r.totalCost)} over ${H} months `}</Text>
            {` in your partner program, this is what comes back. It takes ${dpp} deals.`}
          </Text>
          <View style={{ marginTop: P(14), height: P(2), backgroundColor: G800 }} />

          <View style={{ marginTop: P(26), flexDirection: "row" }}>
            {stats.map((t, i) => (
              <Cut key={t.l} w={222} h={104} c={18} fill={t.fill} style={{ marginRight: i < 2 ? P(16) : 0, padding: P(18), paddingHorizontal: P(20), transform: `rotate(${t.rot}deg)` }}>
                {t.n.endsWith("%") ? (
                  <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
                    <Disp size={30} color={t.nc}>{t.n.slice(0, -1)}</Disp>
                    <Text style={{ fontSize: P(30), fontWeight: 700, color: t.nc, marginLeft: P(2), lineHeight: 1 }}>%</Text>
                  </View>
                ) : (
                  <Disp size={t.n.length > 8 ? 24 : 30} color={t.nc}>{t.n}</Disp>
                )}
                <Text style={{ marginTop: P(10), fontSize: P(15), lineHeight: 1.3, color: t.fg }}>{t.l}</Text>
              </Cut>
            ))}
          </View>

          <View style={{ marginTop: P(40) }}><Disp size={18}>Cost versus return</Disp></View>
          <Text style={{ marginTop: P(8), fontSize: P(15), color: G600 }}>
            {r.payback === null ? "The return does not catch up with the cost at these numbers." : `Where the two tapes cross, the program has paid for itself, in month ${r.payback}.`}
          </Text>
          <View style={{ marginTop: P(10) }}><Chart r={r} horizon={inputs.horizon} /></View>

          <View style={{ marginTop: P(8), flexDirection: "row" }}>
            <View style={{ flex: 1, paddingRight: P(20) }}>
              <Text style={{ fontSize: P(15), lineHeight: 1.5 }}>{`Each customer through partners costs about ${usd(r.costPerCustomer)}, counting program cost and commission.`}</Text>
              {half && <Text style={{ marginTop: P(8), fontSize: P(15), lineHeight: 1.5 }}>{`If partners bring half as many deals, the return is ${pct(half.roi)}${half.payback === null ? " and the program does not pay back." : ` and it pays back in month ${half.payback}.`}`}</Text>}
            </View>
            {lever && (
              <View style={{ flex: 1, position: "relative", marginRight: P(6), marginBottom: P(6) }}>
                <View style={{ position: "absolute", top: P(6), left: P(6), right: P(-6), bottom: P(-6), backgroundColor: LIME }} />
                <View style={{ backgroundColor: "#FFFFFF", paddingVertical: P(14), paddingHorizontal: P(18) }}>
                  <Text style={{ fontSize: P(15), lineHeight: 1.45 }}>
                    <Text style={{ backgroundColor: LIME }}> The change that helps most </Text>
                    {` ${lever.text} would lift your return from ${pct(lever.from)} to ${pct(lever.to)}.`}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>

        <View style={{ position: "absolute", left: P(48), right: P(48), bottom: P(50), flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <Text style={{ fontSize: P(14), fontWeight: 500 }}>
            <Link src="https://partner2b.com/partner-roi-calculator" style={{ color: INK, textDecoration: "underline" }}>partner2b.com</Link>
            {"   ·   "}
            <Link src="mailto:hello@partner2b.com" style={{ color: INK, textDecoration: "underline" }}>hello@partner2b.com</Link>
          </Text>
          <Image src={A("lockup-ink.png")} style={{ height: P(36), width: P(36) * (562 / 140) }} />
        </View>
        <Text style={{ position: "absolute", left: P(48), right: P(48), bottom: P(20), fontSize: P(10), lineHeight: 1.3, color: G600 }}>
          Illustrative estimate based on the values entered. Return is the first-year contract value of deals closed through partners. Not a forecast or a promise of results.
        </Text>
      </View>
      </Page>
    </Document>
  );
}

export async function renderOnePager(data: OnePagerData): Promise<Buffer> {
  return renderToBuffer(<Doc {...data} />);
}
