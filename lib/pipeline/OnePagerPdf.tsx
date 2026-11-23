import React from "react";
import path from "node:path";
import { Font, Document, Page, View, Text, Image, Link, Svg, Polygon, StyleSheet, renderToBuffer } from "@react-pdf/renderer";
import { fmt, trim, usd, type Inputs, type Result } from "./model";

// Approved one-pager design (A4). Design pixels (794 x 1123) are converted to points with P().
const P = (n: number) => n * 0.75;
const A = (f: string) => path.join(process.cwd(), "lib", "pipeline", "assets", f);
Font.register({ family: "Michroma", src: A("Michroma.woff") });
Font.register({ family: "Sora", fonts: [{ src: A("Sora-500.woff"), fontWeight: 500 }, { src: A("Sora-700.woff"), fontWeight: 700 }] });
Font.registerHyphenationCallback((w) => [w]);

const INK = "#0A0A0B", LIME = "#A8FF5C", G600 = "#4A4B51", G700 = "#3A3B40", G800 = "#2A2B30", G400 = "#85868B";
const s = StyleSheet.create({ body: { fontFamily: "Sora", fontWeight: 500, color: INK } });

// Michroma has one weight, so the brand's bold look is drawn by laying the text twice with a hairline offset.
function Disp({ children, size, color = INK, w }: { children: string; size: number; color?: string; w?: number }) {
  const st = { fontFamily: "Michroma", fontSize: P(size), color, lineHeight: 1.2 } as const;
  return (
    <View style={{ width: w }}>
      <Text style={st}>{children}</Text>
      <Text style={{ ...st, position: "absolute", top: 0, left: P(0.7) }}>{children}</Text>
    </View>
  );
}

// A block with one cut corner, bottom right.
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

export type OnePagerData = { inputs: Inputs; r: Result; lever: { text: string; from: number; to: number } | null };

function Doc({ inputs, r, lever }: OnePagerData) {
  const win = trim(inputs.windowMonths);
  const firstDeal = Math.min(inputs.windowMonths, Math.ceil(inputs.recruitMonths + (inputs.cycleWeeks * 7) / 30.4));
  const perTxt = r.dealsPerPartnerInWindow >= 10 ? fmt(r.dealsPerPartnerInWindow) : String(Math.max(0.1, Math.round(r.dealsPerPartnerInWindow * 10) / 10));
  const plural = (n: number, one: string, many: string) => (n === 1 ? one : many);

  const stages = [
    { name: "Find", num: fmt(r.list), unit: "partner companies", text: `Companies that match your ideal partner profile, about ${fmt(r.perWeek)} a week over the first ${trim(inputs.recruitMonths)} months`, fill: "#FFFFFF", fg: INK, numColor: INK, indent: 0 },
    { name: "Sign", num: fmt(r.signed), unit: plural(r.signed, "partner", "partners"), text: "Partners that reply and agree to work with you", fill: LIME, fg: INK, numColor: INK, indent: 40 },
    { name: "Activate", num: fmt(r.activePartners), unit: plural(r.activePartners, "active partner", "active partners"), text: `Signed partners that bring you deals, each closing about ${perTxt} in your window`, fill: G400, fg: INK, numColor: INK, indent: 80 },
    { name: "Close", num: fmt(r.deals), unit: plural(r.deals, "deal", "deals"), text: `Deals closed, enough to reach ${usd(inputs.goal)} in ${win} months`, fill: G600, fg: "#FFFFFF", numColor: LIME, indent: 120 },
  ];
  const stats = [
    { n: trim(firstDeal), l: firstDeal === 1 ? "month to your first deal" : "months to your first deal", fill: "#FFFFFF", fg: INK, nc: INK, rot: -1.5 },
    { n: perTxt, l: "deals per active partner", fill: LIME, fg: INK, nc: INK, rot: 1.2 },
    { n: fmt(r.perWeek), l: "outreach messages a week", fill: G700, fg: "#FFFFFF", nc: LIME, rot: -1 },
  ];
  const plan = [
    ["Month 0", "Build the list", `${fmt(r.list)} companies`],
    [`Months 1 to ${trim(inputs.recruitMonths)}`, "Reach out", `About ${fmt(r.perWeek)} a week`],
    [`Month ${trim(inputs.recruitMonths)}`, `${fmt(r.signed)} ${plural(r.signed, "partner", "partners")} signed`, `${fmt(r.activePartners)} of them active`],
    [`Month ${trim(firstDeal)}`, "First deals close", `${trim(inputs.cycleWeeks)} week sales cycle`],
    [`Month ${win}`, `${usd(inputs.goal)} reached`, `${fmt(r.deals)} ${plural(r.deals, "deal", "deals")} in total`],
  ];
  const colW = 698 / 5;

  return (
    <Document title="Your partner pipeline" author="Partner2B" subject="Partner pipeline one-pager">
      <Page size={[595.28, 841.89]} style={{ ...s.body, padding: 0 }}>
      <View style={{ position: "relative", width: 595.28, height: 841.89, overflow: "hidden" }}>
        <Image src={A("mesh-light.jpg")} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }} />
        <View style={{ paddingTop: P(44), paddingHorizontal: P(48) }}>
          <Disp size={34}>Your partner pipeline</Disp>
          <Text style={{ marginTop: P(10), fontSize: P(17), lineHeight: 1.5, color: G600, maxWidth: P(640) }}>
            {"If you plan to reach "}
            <Text style={{ backgroundColor: LIME, color: INK }}>{` ${usd(inputs.goal)} in ${win} months `}</Text>
            {` with a deal size of ${usd(inputs.dealSize)}, this is the pipeline you need.`}
          </Text>
          <View style={{ marginTop: P(14), height: P(2), backgroundColor: G800 }} />

          <View style={{ marginTop: P(22) }}>
            {stages.map((st, i) => (
              <Cut key={st.name} w={698 - st.indent} h={76} c={18} fill={st.fill} style={{ marginLeft: P(st.indent), marginBottom: i < 3 ? P(8) : 0, flexDirection: "row", alignItems: "center", paddingHorizontal: P(24) }}>
                <View style={{ width: P(150), marginRight: P(18) }}>
                  <Disp size={30} color={st.numColor}>{st.num}</Disp>
                  <Text style={{ marginTop: P(6), fontSize: P(14), color: st.fg }}>{st.unit}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Disp size={16} color={st.fg}>{st.name}</Disp>
                  <Text style={{ marginTop: P(4), fontSize: P(14), lineHeight: 1.35, color: st.fg }}>{st.text}</Text>
                </View>
              </Cut>
            ))}
          </View>

          <View style={{ marginTop: P(24), flexDirection: "row" }}>
            {stats.map((t, i) => (
              <Cut key={t.l} w={222} h={92} c={18} fill={t.fill} style={{ marginRight: i < 2 ? P(16) : 0, padding: P(16), paddingHorizontal: P(20), transform: `rotate(${t.rot}deg)` }}>
                <Disp size={30} color={t.nc}>{t.n}</Disp>
                <Text style={{ marginTop: P(8), fontSize: P(15), color: t.fg }}>{t.l}</Text>
              </Cut>
            ))}
          </View>

          <View style={{ marginTop: P(46) }}><Disp size={18}>Your milestones</Disp></View>
          <View style={{ position: "relative", height: P(170), marginTop: P(4), width: P(698) }}>
            <View style={{ position: "absolute", left: 0, right: 0, top: P(84), height: P(3), backgroundColor: G800 }} />
            {plan.map(([when, what, note], k) => {
              const above = k % 2 === 0;
              return (
                <View key={when} style={{ position: "absolute", left: P(colW * k), width: P(colW), top: 0, height: P(170) }}>
                  <View style={{ position: "absolute", top: P(70), left: P(colW / 2 - 15), width: P(30), height: P(30), borderRadius: P(15), backgroundColor: INK, alignItems: "center", justifyContent: "center" }}>
                    <Text style={{ fontFamily: "Michroma", fontSize: P(11), color: LIME }}>{String(k + 1)}</Text>
                  </View>
                  <View style={{ position: "absolute", left: 0, right: 0, paddingHorizontal: P(6), textAlign: "center", ...(above ? { top: 0, height: P(70), justifyContent: "flex-end" } : { top: P(100) }) }}>
                    <Text style={{ fontSize: P(13), color: G600, textAlign: "center" }}>{when}</Text>
                    <Text style={{ fontSize: P(15), lineHeight: 1.25, textAlign: "center" }}>{what}</Text>
                    <Text style={{ fontSize: P(13), color: G600, textAlign: "center" }}>{note}</Text>
                  </View>
                </View>
              );
            })}
          </View>

          {lever && (
            <View style={{ marginTop: P(10), flexDirection: "row", alignItems: "flex-end" }}>
              <Cut w={112} h={112} c={20} fill={LIME} style={{ alignItems: "center", justifyContent: "flex-end", overflow: "hidden" }}>
                <Image src={A("toby.png")} style={{ height: P(104), width: P(104) * (307 / 700) }} />
              </Cut>
              <View style={{ flex: 1, marginLeft: P(22), marginBottom: P(14), position: "relative" }}>
                <View style={{ position: "absolute", top: P(6), left: P(6), right: P(-6), bottom: P(-6), backgroundColor: LIME }} />
                <View style={{ backgroundColor: "#FFFFFF", paddingVertical: P(16), paddingHorizontal: P(22) }}>
                  <Text style={{ fontSize: P(16), lineHeight: 1.5 }}>
                    <Text style={{ backgroundColor: LIME }}> The change that helps most </Text>
                    {` ${lever.text} would cut your list from ${fmt(lever.from)} to ${fmt(lever.to)}.`}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>

        <View style={{ position: "absolute", left: P(48), right: P(48), bottom: P(50), flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <Text style={{ fontSize: P(14), fontWeight: 500 }}>
            <Link src="https://partner2b.com/partner-pipeline-calculator" style={{ color: INK, textDecoration: "underline" }}>partner2b.com</Link>
            {"   ·   "}
            <Link src="mailto:hello@partner2b.com" style={{ color: INK, textDecoration: "underline" }}>hello@partner2b.com</Link>
          </Text>
          <Image src={A("lockup-ink.png")} style={{ height: P(36), width: P(36) * (562 / 140) }} />
        </View>
        <Text style={{ position: "absolute", left: P(48), right: P(48), bottom: P(20), fontSize: P(10), lineHeight: 1.3, color: G600 }}>
          Illustrative estimate based on published benchmarks and the values entered. Not a forecast or a promise of results.
        </Text>
      </View>
      </Page>
    </Document>
  );
}

export async function renderOnePager(data: OnePagerData): Promise<Buffer> {
  return renderToBuffer(<Doc {...data} />);
}
