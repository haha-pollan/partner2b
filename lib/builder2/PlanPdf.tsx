import React from "react";
import { Font, Document, Page, View, Text, Image, StyleSheet, renderToBuffer } from "@react-pdf/renderer";
import type { Block, Line } from "./parse";
import { lum } from "./brand";

Font.registerHyphenationCallback((w) => [w]);
const INK = "#14151A", GREY = "#5F6168", LINE = "#E3E4E8";
const mix = (hex: string, w: number) => { const n = parseInt(hex.slice(1), 16); const c = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => Math.round(v + (255 - v) * w)); return "#" + c.map((v) => v.toString(16).padStart(2, "0")).join(""); };
// Helvetica only covers Latin-1, so typographic characters are mapped and anything else is dropped.
const safe = (s: string) => s.replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/…/g, "...").replace(/[•●]/g, "-").replace(/→/g, "to").replace(/[^\x09\x0A\x20-\x7E -ÿ]/g, "");

const s = StyleSheet.create({
  page: { paddingTop: 54, paddingBottom: 60, paddingHorizontal: 54, fontFamily: "Helvetica", fontSize: 10.5, color: INK, lineHeight: 1.5 },
  foot: { position: "absolute", bottom: 26, left: 54, right: 54, flexDirection: "row", justifyContent: "space-between", fontSize: 8, color: GREY },
});

type TS = React.ComponentProps<typeof View>["style"] & object;
function Rich({ text, style }: { text: string; style?: TS }) {
  const parts = safe(text).split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).filter(Boolean);
  return (
    <Text style={style}>
      {parts.map((p, i) => p.startsWith("**") ? <Text key={i} style={{ fontFamily: "Helvetica-Bold" }}>{p.slice(2, -2)}</Text>
        : p.startsWith("*") && p.endsWith("*") && p.length > 2 ? <Text key={i} style={{ fontFamily: "Helvetica-Oblique" }}>{p.slice(1, -1)}</Text> : p)}
    </Text>
  );
}

function Table({ rows, accent }: { rows: string[][]; accent: string }) {
  const cols = Math.max(...rows.map((r) => r.length));
  return (
    <View style={{ marginVertical: 8, borderWidth: 1, borderColor: LINE, borderRadius: 4 }}>
      {rows.map((r, i) => (
        <View key={i} wrap={false} style={{ flexDirection: "row", backgroundColor: i === 0 ? mix(accent, 0.88) : "#fff", borderTopWidth: i ? 1 : 0, borderTopColor: LINE }}>
          {Array.from({ length: cols }).map((_, c) => (
            <View key={c} style={{ flex: c === 0 ? 1.15 : 1, padding: 5 }}>
              <Rich text={r[c] ?? ""} style={{ fontSize: 9, lineHeight: 1.35, fontFamily: i === 0 || c === 0 ? "Helvetica-Bold" : "Helvetica" }} />
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

function Lines({ lines, accent, size = 10.5 }: { lines: Line[]; accent: string; size?: number }) {
  return (
    <View>
      {lines.map((l, i) => {
        if (l.t === "table") return <Table key={i} rows={l.rows} accent={accent} />;
        if (l.t === "bullet") return (
          <View key={i} wrap={false} style={{ flexDirection: "row", marginBottom: 3, paddingLeft: 4 }}>
            <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: accent, marginTop: 5, marginRight: 8 }} />
            <Rich text={l.text} style={{ flex: 1, fontSize: size }} />
          </View>
        );
        if (l.t === "h") return <Text key={i} style={{ fontFamily: "Helvetica-Bold", fontSize: 13, marginTop: 8, marginBottom: 4 }}>{safe(l.text)}</Text>;
        return <Rich key={i} text={l.text} style={{ fontSize: size, marginBottom: 7 }} />;
      })}
    </View>
  );
}

const Label = ({ t, accent }: { t: string; accent: string }) => (
  <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 8, letterSpacing: 0.8, color: accent, marginTop: 9, marginBottom: 3 }}>{safe(t).toUpperCase()}</Text>
);

// A short free-text line that opens a section (for example a sub-heading) is shown as a heading.
const isHeading = (l: Line, prev: boolean) => l.t === "p" && l.text.length < 110 && (/^(Why .*|Program tier structure\.?|Ideal partner profiles\.?)$/i.test(l.text.trim()) || (prev && /^[A-Z][^.!?]{3,70}$/.test(l.text.trim())));

function Render({ block, accent, onAcc, prevWasSection }: { block: Block; accent: string; onAcc: string; prevWasSection: boolean }) {
  switch (block.kind) {
    case "text": {
      const lines = block.lines.map((l, i) => (isHeading(l, i === 0 && prevWasSection) ? ({ t: "h", text: (l as { text: string }).text.replace(/\.$/, "") } as Line) : l));
      return <Lines lines={lines} accent={accent} />;
    }
    case "highlight": return (
      <View wrap={false} style={{ flexDirection: "row", backgroundColor: mix(accent, 0.9), borderLeftWidth: 4, borderLeftColor: accent, padding: 12, marginBottom: 8, borderRadius: 3 }}>
        <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 22, color: accent, width: 40 }}>{safe(block.number)}</Text>
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 7.5, letterSpacing: 0.8, color: GREY }}>{safe(block.tag).toUpperCase()}</Text>
          <Rich text={block.insight} style={{ fontSize: 12, marginTop: 3, fontFamily: "Helvetica-Bold" }} />
        </View>
      </View>
    );
    case "partner": return (
      <View style={{ borderWidth: 1, borderColor: LINE, borderRadius: 6, marginVertical: 8 }}>
        <View style={{ backgroundColor: accent, padding: 10, borderTopLeftRadius: 5, borderTopRightRadius: 5 }}>
          <Rich text={block.title} style={{ color: onAcc, fontFamily: "Helvetica-Bold", fontSize: 12 }} />
        </View>
        <View style={{ padding: 12 }}>
          {block.fields.map((f, i) => (<View key={i}><Label t={f.label} accent={accent} /><Lines lines={f.lines} accent={accent} size={10} /></View>))}
        </View>
      </View>
    );
    case "vp": return (
      <View style={{ borderWidth: 1, borderColor: LINE, borderRadius: 6, marginVertical: 8 }}>
        <View style={{ backgroundColor: mix(accent, 0.88), padding: 10, flexDirection: "row", justifyContent: "space-between" }} wrap={false}>
          <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 12, flex: 1, paddingRight: 10 }}>{safe(block.type)}</Text>
          <Text style={{ fontSize: 9, color: GREY, maxWidth: "58%", textAlign: "right" }}>{safe(block.target)}</Text>
        </View>
        <View style={{ padding: 12 }}>
          <Lines lines={block.prose} accent={accent} size={10} />
          {block.earnings.length > 0 && (<><Label t="Earnings: conservative and optimistic" accent={accent} /><Table rows={block.earnings} accent={accent} /></>)}
          {block.tier.length > 0 && (<><Label t="At each tier" accent={accent} /><Lines lines={block.tier} accent={accent} size={9.5} /></>)}
          {block.extra.length > 0 && (<><Label t="With implementation revenue" accent={accent} /><Lines lines={block.extra} accent={accent} size={9.5} /></>)}
          {block.bottom && (<View wrap={false} style={{ marginTop: 8, backgroundColor: INK, padding: 10, borderRadius: 4 }}><Rich text={block.bottom} style={{ color: "#fff", fontFamily: "Helvetica-Bold", fontSize: 10 }} /></View>)}
        </View>
      </View>
    );
    case "tier": return (
      <View style={{ borderWidth: 1, borderColor: LINE, borderRadius: 6, marginVertical: 8 }}>
        <View wrap={false} style={{ backgroundColor: accent, padding: 10, flexDirection: "row", justifyContent: "space-between", borderTopLeftRadius: 5, borderTopRightRadius: 5 }}>
          <Text style={{ color: onAcc, fontFamily: "Helvetica-Bold", fontSize: 13 }}>{safe(block.name)}</Text>
          <Text style={{ color: onAcc, fontSize: 9 }}>Tier {safe(block.level)}</Text>
        </View>
        <View style={{ padding: 12 }}>
          {block.entry && <Rich text={block.entry} style={{ fontFamily: "Helvetica-Oblique", marginBottom: 4 }} />}
          <Label t="What partners receive" accent={accent} /><Lines lines={block.receive} accent={accent} size={10} />
          <Label t="Commercial terms" accent={accent} /><Lines lines={block.terms} accent={accent} size={9.5} />
          {block.progress && (<><Label t="To progress to the next tier" accent={accent} /><Rich text={block.progress} /></>)}
        </View>
      </View>
    );
    case "callout": return (
      <View wrap={false} style={{ backgroundColor: mix(accent, 0.9), borderLeftWidth: 4, borderLeftColor: accent, padding: 10, marginVertical: 6, borderRadius: 3 }}>
        <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 8, letterSpacing: 0.8, color: accent }}>{safe(block.label).toUpperCase()}</Text>
        <Rich text={block.text} style={{ marginTop: 3 }} />
      </View>
    );
    case "kpi": return (
      <View wrap={false} style={{ borderWidth: 1, borderColor: LINE, borderRadius: 6, marginVertical: 5, padding: 11 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
          <Rich text={block.name} style={{ fontFamily: "Helvetica-Bold", fontSize: 11.5, flex: 1, paddingRight: 10 }} />
          <Rich text={block.target} style={{ fontFamily: "Helvetica-Bold", fontSize: 11.5, color: accent, maxWidth: 190, textAlign: "right" }} />
        </View>
        <Text style={{ fontSize: 8.5, color: GREY, marginTop: 4 }}>{safe(block.how)}</Text>
        <Rich text={block.tells} style={{ marginTop: 5, fontSize: 10 }} />
        <Text style={{ fontSize: 8.5, color: accent, fontFamily: "Helvetica-Bold", marginTop: 4 }}>{safe(block.when)}</Text>
      </View>
    );
    case "health": return (
      <View wrap={false} style={{ backgroundColor: INK, padding: 12, marginVertical: 5, borderRadius: 5 }}>
        <Text style={{ color: "#fff", fontFamily: "Helvetica-Bold", fontSize: 8.5, letterSpacing: 0.8 }}>{safe(block.label).toUpperCase()}</Text>
        <Rich text={block.text} style={{ color: "#fff", marginTop: 4, fontSize: 10 }} />
      </View>
    );
    case "phase": return (
      <View style={{ marginVertical: 8 }}>
        <View wrap={false} style={{ flexDirection: "row", alignItems: "center", marginBottom: 5 }}>
          <View style={{ backgroundColor: accent, paddingVertical: 3, paddingHorizontal: 8, borderRadius: 3, marginRight: 8 }}><Text style={{ color: onAcc, fontFamily: "Helvetica-Bold", fontSize: 8.5 }}>DAYS {safe(block.days).toUpperCase()}</Text></View>
          <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 12 }}>{safe(block.name)}</Text>
        </View>
        <Lines lines={block.tasks.map((t) => ({ t: "bullet", text: t }))} accent={accent} size={10} />
      </View>
    );
    default: return null;
  }
}

export function PlanDocument({ title, company, accent, logo, blocks }: { title: string; company: string; accent: string; logo: string; blocks: Block[] }) {
  const onAcc = lum(accent) > 0.4 ? INK : "#FFFFFF";
  const date = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const closing = blocks.find((b) => b.kind === "closing") as Extract<Block, { kind: "closing" }> | undefined;
  // Group: each section break starts its own page, followed by that section's content pages.
  const groups: { head?: Extract<Block, { kind: "section" }>; body: Block[] }[] = [{ body: [] }];
  for (const b of blocks) {
    if (b.kind === "closing") continue;
    if (b.kind === "section") groups.push({ head: b, body: [] }); else groups[groups.length - 1].body.push(b);
  }
  const Foot = () => (
    <View style={s.foot} fixed>
      <Text>{safe(company)} partner program strategy</Text>
      <Text render={({ pageNumber }) => `${pageNumber}`} />
    </View>
  );
  return (
    <Document title={safe(title)} author="Partner2B" creator="Partner2B">
      <Page size="A4" style={{ ...s.page, padding: 0 }}>
        <View style={{ backgroundColor: accent, height: 400, padding: 54, justifyContent: "space-between" }}>
          {logo ? <Image src={logo} style={{ width: 54, height: 54, objectFit: "contain", backgroundColor: "#fff", borderRadius: 8, padding: 6 }} /> : <View style={{ width: 54, height: 54, borderRadius: 8, backgroundColor: "#fff", alignItems: "center", justifyContent: "center" }}><Text style={{ fontFamily: "Helvetica-Bold", fontSize: 22, color: accent }}>{safe(company).slice(0, 1).toUpperCase()}</Text></View>}
          <View>
            <Text style={{ color: onAcc, fontSize: 11, letterSpacing: 1.5, fontFamily: "Helvetica-Bold" }}>PARTNER PROGRAM STRATEGY</Text>
            <Text style={{ color: onAcc, fontSize: 40, fontFamily: "Helvetica-Bold", marginTop: 10, lineHeight: 1.1 }}>{safe(company)}</Text>
          </View>
        </View>
        <View style={{ padding: 54 }}>
          <Text style={{ fontSize: 12, color: GREY }}>A strategy for building an inbound partner channel</Text>
          <Text style={{ fontSize: 10, color: GREY, marginTop: 4 }}>{date}</Text>
        </View>
        <Text style={{ fontSize: 9, color: GREY, position: "absolute", left: 54, bottom: 36 }}>Prepared with Partner2B</Text>
      </Page>
      {groups.map((g, gi) => (
        <React.Fragment key={gi}>
          {g.head && (
            <Page size="A4" style={{ ...s.page, backgroundColor: accent, justifyContent: "center" }}>
              <Text style={{ color: onAcc, fontSize: 96, fontFamily: "Helvetica-Bold", opacity: 0.9, lineHeight: 1 }}>{safe(g.head.number)}</Text>
              <Text style={{ color: onAcc, fontSize: 26, fontFamily: "Helvetica-Bold", marginTop: 14, lineHeight: 1.15 }}>{safe(g.head.title)}</Text>
              <Rich text={g.head.intro} style={{ color: onAcc, fontSize: 13, marginTop: 18, lineHeight: 1.5, maxWidth: 400 }} />
            </Page>
          )}
          {g.body.length > 0 && (
            <Page size="A4" style={s.page} wrap>
              {g.body.map((b, bi) => <Render key={bi} block={b} accent={accent} onAcc={onAcc} prevWasSection={bi === 0 && !!g.head} />)}
              <Foot />
            </Page>
          )}
        </React.Fragment>
      ))}
      {closing && (
        <Page size="A4" style={{ ...s.page, backgroundColor: INK, justifyContent: "center" }}>
          <Text style={{ color: "#fff", fontSize: 28, fontFamily: "Helvetica-Bold", lineHeight: 1.15 }}>{safe(closing.headline)}</Text>
          <Rich text={closing.text} style={{ color: "#D5D6DB", fontSize: 12.5, marginTop: 14, lineHeight: 1.55 }} />
          <View style={{ marginTop: 24 }}>
            {closing.ctas.map((c, i) => (
              <View key={i} wrap={false} style={{ backgroundColor: i === 0 ? accent : "#23242A", padding: 14, borderRadius: 6, marginBottom: 9 }}>
                <Text style={{ color: i === 0 ? onAcc : "#fff", fontFamily: "Helvetica-Bold", fontSize: 12 }}>{safe(c.title)}</Text>
                <Text style={{ color: i === 0 ? onAcc : "#C4C5CC", fontSize: 10, marginTop: 3 }}>{safe(c.subtitle)}</Text>
              </View>
            ))}
          </View>
          <Rich text={closing.attribution} style={{ color: "#9A9BA3", fontSize: 8.5, marginTop: 18 }} />
        </Page>
      )}
    </Document>
  );
}

export async function renderPlan(props: Parameters<typeof PlanDocument>[0]): Promise<Buffer> {
  return renderToBuffer(<PlanDocument {...props} />);
}
