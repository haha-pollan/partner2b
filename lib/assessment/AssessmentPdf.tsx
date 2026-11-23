import React from "react";
import path from "node:path";
import { Font, Document, Page, View, Text, Image, Link, Svg, Polygon, StyleSheet, renderToBuffer } from "@react-pdf/renderer";
import { AREAS, BAND_LABEL, areaOf, bandOf, headline, summaryLine, type AreaKey, type Band, type Raw, type Result } from "./model";

// One A4 page: score, the two bottlenecks with a first fix, and all eight areas.
const A = (f: string) => path.join(process.cwd(), "lib", "pipeline", "assets", f);
Font.register({ family: "Michroma", src: A("Michroma.woff") });
Font.register({ family: "Sora", fonts: [{ src: A("Sora-500.woff"), fontWeight: 500 }, { src: A("Sora-700.woff"), fontWeight: 700 }] });
Font.registerHyphenationCallback((w) => [w]);

const INK = "#0A0A0B", LIME = "#A8FF5C", G600 = "#4A4B51", G700 = "#3A3B40", RED = "#D64545", YELLOW = "#F5C542";
const s = StyleSheet.create({ body: { fontFamily: "Sora", fontWeight: 500, color: INK } });
const bandFill: Record<Band, string> = { critical: RED, work: YELLOW, solid: LIME };

function Disp({ children, size, color = INK }: { children: string; size: number; color?: string }) {
  const st = { fontFamily: "Michroma", fontSize: size, color, lineHeight: 1.2 } as const;
  return (
    <View>
      <Text style={st}>{children}</Text>
      <Text style={{ ...st, position: "absolute", top: 0, left: 0.5 }}>{children}</Text>
    </View>
  );
}

function Cut({ w, h, c, fill, style, children }: { w: number; h: number; c: number; fill: string; style?: object; children?: React.ReactNode }) {
  return (
    <View style={{ width: w, height: h, ...style }}>
      <Svg width={w} height={h} style={{ position: "absolute", top: 0, left: 0 }}>
        <Polygon points={`0,0 ${w},0 ${w},${h - c} ${w - c},${h} 0,${h}`} fill={fill} />
      </Svg>
      {children}
    </View>
  );
}

function Gap({ k, n, score }: { k: AreaKey; n: number; score: number }) {
  const a = areaOf(k), b = bandOf(score);
  return (
    <Cut w={497} h={140} c={16} fill="#FFFFFF" style={{ marginTop: 12 }}>
      <View style={{ padding: 16 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Text style={{ fontFamily: "Michroma", fontSize: 15, color: "#7C5CFF" }}>{String(n)}</Text>
          <Disp size={13}>{a.name}</Disp>
          <Text style={{ backgroundColor: bandFill[b], color: b === "critical" ? "#FFFFFF" : INK, fontSize: 8, fontWeight: 700, paddingVertical: 2, paddingHorizontal: 7, borderRadius: 8 }}>{BAND_LABEL[b]}</Text>
        </View>
        <View style={{ flexDirection: "row", gap: 16, marginTop: 10 }}>
          <View style={{ width: 225 }}><Text style={{ fontSize: 9.5, fontWeight: 700 }}>Why it holds you back</Text><Text style={{ fontSize: 9, lineHeight: 1.45, marginTop: 3, color: G700 }}>{a.why}</Text></View>
          <View style={{ width: 225 }}><Text style={{ fontSize: 9.5, fontWeight: 700 }}>First fix</Text><Text style={{ fontSize: 9, lineHeight: 1.45, marginTop: 3, color: G700 }}>{a.fix}</Text></View>
        </View>
        <Text style={{ marginTop: 10, fontSize: 8.5, color: G600 }}>{a.tool.live ? "Free next step: " : "Coming soon: "}{a.tool.name}. {a.tool.line}</Text>
      </View>
    </Cut>
  );
}

function Doc({ r }: { raw: Raw; r: Result }) {
  const first = r.bottlenecks[0] ?? r.weakest;
  const second = r.bottlenecks[1];
  return (
    <Document title="Your partner program assessment" author="Partner2B" subject="Partner program assessment">
      <Page size={[595.28, 841.89]} style={{ ...s.body, padding: 0 }}>
        <View style={{ position: "relative", width: 595.28, height: 841.89, overflow: "hidden" }}>
          <Image src={A("mesh-light.jpg")} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }} />
          <View style={{ paddingTop: 34, paddingHorizontal: 49 }}>
            <Disp size={22}>Your partner program assessment</Disp>
            <Text style={{ marginTop: 7, fontSize: 10.5, lineHeight: 1.5, color: G600 }}>{headline(r.percent)}. {summaryLine(r)}.</Text>
            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 12 }}>
              <Cut w={190} h={62} c={14} fill={LIME}>
                <View style={{ flexDirection: "row", alignItems: "center", paddingLeft: 14, height: 62, gap: 10 }}>
                  <Text style={{ fontFamily: "Michroma", fontSize: 26 }}>{r.percent}%</Text>
                  <Text style={{ fontSize: 8.5, lineHeight: 1.35, width: 80 }}>of the partner program basics in place</Text>
                </View>
              </Cut>
            </View>
            <Gap k={first} n={1} score={r.scores[first]} />
            {second && <Gap k={second} n={2} score={r.scores[second]} />}
            <View style={{ marginTop: 14 }}>
              <Disp size={12}>All eight areas</Disp>
              <View style={{ marginTop: 8, gap: 5 }}>
                {AREAS.map((a) => {
                  const sc = r.scores[a.key], b = bandOf(sc);
                  return (
                    <View key={a.key} style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                      <Text style={{ width: 130, fontSize: 9, fontWeight: 700 }}>{a.name}</Text>
                      <View style={{ width: 260, height: 8, backgroundColor: "#ECECEE" }}><View style={{ width: sc * 65, height: 8, backgroundColor: bandFill[b] }} /></View>
                      <Text style={{ fontSize: 8.5, color: G600 }}>{BAND_LABEL[b]}</Text>
                    </View>
                  );
                })}
              </View>
            </View>
          </View>
          <View style={{ position: "absolute", left: 49, right: 49, bottom: 44, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Link src="https://partner2b.com/partner-program-assessment" style={{ fontSize: 9, fontWeight: 700, color: INK }}>partner2b.com</Link>
            <Link src="mailto:hello@partner2b.com" style={{ fontSize: 9, fontWeight: 700, color: INK }}>hello@partner2b.com</Link>
          </View>
          <Text style={{ position: "absolute", left: 49, right: 49, bottom: 20, fontSize: 6.5, color: G600 }}>Illustrative assessment based on your own answers. Not a forecast or a promise of results.</Text>
        </View>
      </Page>
    </Document>
  );
}

export async function renderAssessmentPdf(data: { raw: Raw; r: Result }): Promise<Buffer> {
  return renderToBuffer(<Doc {...data} />);
}
