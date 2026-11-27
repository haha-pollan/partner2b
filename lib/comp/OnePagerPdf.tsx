import React from "react";
import path from "node:path";
import { Font, Document, Page, View, Text, Image, Link, Svg, Polygon, StyleSheet, renderToBuffer } from "@react-pdf/renderer";
import { fmt, pct, short, trim, usd, type CompInputs, type CompResult } from "./model";

// A4 one-pager in the same look as the pipeline and ROI one-pagers. Design pixels (794 x 1123) are converted to points with P().
const P = (n: number) => n * 0.75;
const A = (f: string) => path.join(process.cwd(), "lib", "pipeline", "assets", f);
Font.register({ family: "Michroma", src: A("Michroma.woff") });
Font.register({ family: "Sora", fonts: [{ src: A("Sora-500.woff"), fontWeight: 500 }, { src: A("Sora-700.woff"), fontWeight: 700 }] });
Font.registerHyphenationCallback((w) => [w]);

const INK = "#0A0A0B", LIME = "#A8FF5C", VIOLET = "#7C5CFF", G600 = "#4A4B51", G800 = "#2A2B30";
const s = StyleSheet.create({ body: { fontFamily: "Sora", fontWeight: 500, color: INK } });
const STATUS = { solid: { t: "Solid", bg: LIME }, tight: { t: "Tight", bg: "#FFD84D" }, over: { t: "Over the ceiling", bg: "#FF6B6B" } } as const;

function Disp({ children, size, color = INK }: { children: string; size: number; color?: string }) {
  const st = { fontFamily: "Michroma", fontSize: P(size), color, lineHeight: 1.2 } as const;
  return (<View><Text style={st}>{children}</Text><Text style={{ ...st, position: "absolute", top: 0, left: P(0.7) }}>{children}</Text></View>);
}
function Cut({ w, h, c, fill, style, children }: { w: number; h: number; c: number; fill: string; style?: object; children?: React.ReactNode }) {
  const W = P(w), H = P(h), C = P(c);
  return (
    <View style={{ width: W, height: H, ...style }}>
      <Svg width={W} height={H} style={{ position: "absolute", top: 0, left: 0 }}><Polygon points={`0,0 ${W},0 ${W},${H - C} ${W - C},${H} 0,${H}`} fill={fill} /></Svg>
      {children}
    </View>
  );
}
function Row({ cells, head, widths }: { cells: string[]; head?: boolean; widths: number[] }) {
  return (
    <View style={{ flexDirection: "row", paddingVertical: P(7), borderBottomWidth: head ? 1.5 : 0.6, borderBottomColor: head ? INK : "#B9BABD" }}>
      {cells.map((c, i) => (<Text key={i} style={{ width: P(widths[i]), fontSize: P(14), color: head ? G600 : INK }}>{c}</Text>))}
    </View>
  );
}

export type OnePagerData = { inputs: CompInputs; r: CompResult };

function Doc({ inputs, r }: OnePagerData) {
  const S = STATUS[r.status];
  const parts: [string, number, string][] = ([["Commissions", r.commission, LIME], ["Renewals", r.renewals, "#FFFFFF"], ["Partner marketing funds", r.marketing, VIOLET], ["Performance bonuses", r.bonus, "#FFFFFF"]] as [string, number, string][]).filter((x) => x[1] > 0);
  const fit = r.status === "solid"
    ? `At ${pct(r.pctRevenue)} of partner revenue the budget stays well inside the ${r.ceilingPct}% ceiling, with ${usd(r.headroom)} of room.`
    : r.status === "tight"
      ? `At ${pct(r.pctRevenue)} of partner revenue the budget is close to the ${r.ceilingPct}% ceiling, with ${usd(r.headroom)} of room left.`
      : `At ${pct(r.pctRevenue)} of partner revenue the budget is ${usd(-r.headroom)} over the ${r.ceilingPct}% ceiling.`;
  const budgetAt = (f: number) => (r.commission + r.marketing + r.bonus) * f + r.renewals;
  const W = 698;
  const barW = W, gap = 6, total = parts.reduce((a, p) => a + Math.max(p[1], r.total * 0.06), 0);
  return (
    <Document title="Your partner compensation budget" author="Partner2B" subject="Partner compensation budget one-pager">
      <Page size={[595.28, 841.89]} style={{ ...s.body, padding: 0 }}>
      <View style={{ position: "relative", width: 595.28, height: 841.89, overflow: "hidden" }}>
        <Image src={A("mesh-light.jpg")} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }} />
        <View style={{ paddingTop: P(44), paddingHorizontal: P(48) }}>
          <Disp size={30}>Your compensation budget</Disp>
          <Text style={{ marginTop: P(10), fontSize: P(17), lineHeight: 1.5, color: G600, maxWidth: P(640) }}>
            {"If you plan to bring in "}
            <Text style={{ backgroundColor: LIME, color: INK }}>{` ${usd(inputs.goal)} `}</Text>
            {` through partners with a deal size of ${usd(inputs.dealSize)}, this is what to budget for partner compensation. It takes ${fmt(r.deals)} deals.`}
          </Text>
          <View style={{ marginTop: P(14), height: P(2), backgroundColor: G800 }} />

          <View style={{ marginTop: P(24), flexDirection: "row" }}>
            {([
              { n: usd(r.total), l: "a year for partner compensation", fill: "#FFFFFF", fg: INK, rot: -1.5 },
              { n: trim(Math.round(r.pctRevenue * 10) / 10), pc: true, l: "of partner-sourced revenue", fill: LIME, fg: INK, rot: 1.2 },
              { n: usd(r.perDeal), l: "per closed deal", fill: VIOLET, fg: "#FFFFFF", rot: -1 },
            ] as { n: string; pc?: boolean; l: string; fill: string; fg: string; rot: number }[]).map((t, i) => (
              <Cut key={t.l} w={222} h={104} c={18} fill={t.fill} style={{ marginRight: i < 2 ? P(16) : 0, padding: P(18), paddingHorizontal: P(20), transform: `rotate(${t.rot}deg)` }}>
                <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
                  <Disp size={t.n.length > 8 ? 24 : 28} color={t.fg}>{t.n}</Disp>
                  {t.pc && <Text style={{ fontSize: P(28), fontWeight: 700, color: t.fg, marginLeft: P(2), lineHeight: 1 }}>%</Text>}
                </View>
                <Text style={{ marginTop: P(10), fontSize: P(15), lineHeight: 1.3, color: t.fg }}>{t.l}</Text>
              </Cut>
            ))}
          </View>

          <View style={{ marginTop: P(38) }}><Disp size={18}>Where the budget goes</Disp></View>
          <View style={{ marginTop: P(14), flexDirection: "row", height: P(60) }}>
            {parts.map(([name, v, bg], k) => {
              const w = ((Math.max(v, r.total * 0.06) / total) * (barW - gap * (parts.length - 1)));
              return (<Cut key={name} w={w} h={60} c={12} fill={bg} style={{ marginRight: k < parts.length - 1 ? P(gap) : 0, alignItems: "center", justifyContent: "center" }}><Text style={{ fontSize: P(14), color: bg === VIOLET ? "#FFFFFF" : INK }}>{`${trim(Math.round((v / r.total) * 1000) / 10)} %`.replace(" %", "%")}</Text></Cut>);
            })}
          </View>
          <View style={{ marginTop: P(12), flexDirection: "row" }}>
            {parts.map(([name, v, bg]) => (
              <View key={name} style={{ flex: 1, borderTopWidth: 3, borderTopColor: bg === "#FFFFFF" ? INK : bg, paddingTop: P(8), paddingRight: P(8) }}>
                <Text style={{ fontSize: P(20), fontFamily: "Michroma" }}>{short(v)}</Text>
                <Text style={{ marginTop: P(4), fontSize: P(13), lineHeight: 1.25 }}>{name}</Text>
              </View>
            ))}
          </View>

          <View style={{ marginTop: P(26), flexDirection: "row", alignItems: "center" }}>
            <View style={{ backgroundColor: S.bg, paddingVertical: P(5), paddingHorizontal: P(14), marginRight: P(14) }}><Text style={{ fontSize: P(15) }}>{S.t}</Text></View>
            <Text style={{ flex: 1, fontSize: P(15), lineHeight: 1.4 }}>{fit}</Text>
          </View>

          <View style={{ marginTop: P(26), flexDirection: "row" }}>
            <View style={{ width: P(330), marginRight: P(38) }}>
              <Text style={{ fontSize: P(15), marginBottom: P(4) }}>By tier</Text>
              <Row head cells={["Tier", "Rate", "Deals", "Cost"]} widths={[50, 70, 70, 140]} />
              {r.tiers.map((t) => (<Row key={t.tier} cells={[String(t.tier), `${trim(t.rate)}%`, trim(Math.round(t.deals * 10) / 10), usd(t.cost)]} widths={[50, 70, 70, 140]} />))}
            </View>
            <View style={{ width: P(330) }}>
              <Text style={{ fontSize: P(15), marginBottom: P(4) }}>If you reach more or less than the goal</Text>
              <Row head cells={["Goal reached", "Revenue", "Budget"]} widths={[130, 90, 110]} />
              {([["50%", 0.5], ["100%", 1], ["150%", 1.5]] as [string, number][]).map(([l, f]) => (<Row key={l} cells={[l, short(inputs.goal * f), usd(budgetAt(f))]} widths={[130, 90, 110]} />))}
            </View>
          </View>
        </View>

        <View style={{ position: "absolute", left: P(48), right: P(48), bottom: P(50), flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <Text style={{ fontSize: P(14), fontWeight: 500 }}>
            <Link src="https://partner2b.com/partner-compensation-calculator" style={{ color: INK, textDecoration: "underline" }}>partner2b.com</Link>
            {"   ·   "}
            <Link src="mailto:hello@partner2b.com" style={{ color: INK, textDecoration: "underline" }}>hello@partner2b.com</Link>
          </Text>
          <Image src={A("lockup-ink.png")} style={{ height: P(36), width: P(36) * (562 / 140) }} />
        </View>
        <Text style={{ position: "absolute", left: P(48), right: P(48), bottom: P(20), fontSize: P(10), lineHeight: 1.3, color: G600 }}>
          Illustrative estimate based on the values entered and the Partner2B planning model. Not a forecast or a promise of results.
        </Text>
      </View>
      </Page>
    </Document>
  );
}

export async function renderOnePager(data: OnePagerData): Promise<Buffer> {
  return renderToBuffer(<Doc {...data} />);
}
