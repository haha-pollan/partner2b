import React from "react";
import { Font, Document, Page, View, Text, Image, Svg, Circle, Rect, Polygon, Line as SvgLine, Ellipse, StyleSheet, renderToBuffer } from "@react-pdf/renderer";
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

const STAGES = ["Pre-use", "In use", "Post-use"];
const STAGE_MATCH = [/pre-?\s?use|before/i, /\bin use\b|during/i, /post-?\s?use|after/i];
// Shows where in the customer's journey a partner meets them: three steps, the matching ones filled.
function Stepper({ value, accent }: { value: string; accent: string }) {
  const on = STAGE_MATCH.map((re) => re.test(value));
  if (!on.some(Boolean)) return <Rich text={value} style={{ fontSize: 9, lineHeight: 1.35 }} />;
  return (
    <View style={{ flexDirection: "row", alignItems: "center", flexWrap: "wrap" }}>
      {STAGES.map((st, k) => (
        <View key={st} style={{ flexDirection: "row", alignItems: "center", marginRight: 5, marginBottom: 2 }}>
          <View style={{ width: 7, height: 7, borderRadius: 3.5, marginRight: 3, marginBottom: 5, backgroundColor: on[k] ? accent : "#FFFFFF", borderWidth: 0.9, borderColor: on[k] ? accent : "#B9BABD", borderStyle: "solid" }} />
          <Text style={{ fontSize: 7.5, color: on[k] ? INK : "#8A8C93", fontFamily: on[k] ? "Helvetica-Bold" : "Helvetica" }}>{st}</Text>
        </View>
      ))}
    </View>
  );
}

function Table({ rows, accent }: { rows: string[][]; accent: string }) {
  const cols = Math.max(...rows.map((r) => r.length));
  const stageCol = rows[0].findIndex((h) => /^(stage|when they meet|point of engagement)/i.test(h.trim()));
  return (
    <View style={{ marginVertical: 8, borderWidth: 1, borderColor: LINE, borderRadius: 4 }}>
      {rows.map((r, i) => (
        <View key={i} wrap={false} style={{ flexDirection: "row", backgroundColor: i === 0 ? mix(accent, 0.88) : "#fff", borderTopWidth: i ? 1 : 0, borderTopColor: LINE }}>
          {Array.from({ length: cols }).map((_, c) => (
            <View key={c} style={{ flex: c === 0 ? 1.15 : c === stageCol ? 1.65 : 1, padding: 5 }}>
              {i > 0 && c === stageCol
                ? <Stepper value={r[c] ?? ""} accent={accent} />
                : <Rich text={r[c] ?? ""} style={{ fontSize: 9, lineHeight: 1.35, fontFamily: i === 0 || c === 0 ? "Helvetica-Bold" : "Helvetica" }} />}
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


// ---------- Infographics ----------
export type Econ = {
  types: Record<string, { lo: number; hi: number; loText: string; hiText: string }>;
  projected: number; target: number; projectedText: string; targetText: string; diffText: string; activePartners: number;
  thresholds: { t1: string; t2: string };
};
const norm = (x: string) => x.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const econFor = (econ: Econ | undefined, type: string) => {
  if (!econ) return undefined;
  const n = norm(type);
  const key = Object.keys(econ.types).find((k) => norm(k) === n) ?? Object.keys(econ.types).find((k) => n.startsWith(norm(k)) || norm(k).startsWith(n));
  return key ? econ.types[key] : undefined;
};
const inkOn = (bg: string) => (lum(bg) > 0.28 ? INK : "#FFFFFF");

const iconKind = (name: string) => /agency/i.test(name) ? "hex" : /community/i.test(name) ? "dots" : /referral/i.test(name) ? "link" : /reseller|distributor|channel/i.test(name) ? "bars" : /technology|\bai\b|automation/i.test(name) ? "grid" : "diamond";
function TypeIcon({ name, color, size = 16 }: { name: string; color: string; size?: number }) {
  const k = iconKind(name);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {k === "grid" && (<><Rect x={2} y={2} width={9} height={9} rx={2} fill={color} /><Rect x={13} y={2} width={9} height={9} rx={2} fill={color} /><Rect x={2} y={13} width={9} height={9} rx={2} fill={color} /><Rect x={13} y={13} width={9} height={9} rx={2} fill={color} /></>)}
      {k === "hex" && <Polygon points="12,2 21,7 21,17 12,22 3,17 3,7" fill={color} />}
      {k === "dots" && (<><Circle cx={12} cy={6} r={4} fill={color} /><Circle cx={6} cy={17} r={4} fill={color} /><Circle cx={18} cy={17} r={4} fill={color} /></>)}
      {k === "link" && (<><Circle cx={8} cy={12} r={5} fill="none" stroke={color} strokeWidth={3} /><Circle cx={16} cy={12} r={5} fill="none" stroke={color} strokeWidth={3} /></>)}
      {k === "bars" && (<><Rect x={3} y={13} width={5} height={9} fill={color} /><Rect x={10} y={7} width={5} height={15} fill={color} /><Rect x={17} y={2} width={5} height={20} fill={color} /></>)}
      {k === "diamond" && <Polygon points="12,2 22,12 12,22 2,12" fill={color} />}
    </Svg>
  );
}

const Cap = ({ t, style }: { t: string; style?: TS }) => <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 7.5, letterSpacing: 1, color: GREY, ...(style as object) }}>{safe(t).toUpperCase()}</Text>;
const H1 = ({ t }: { t: string }) => <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 22, lineHeight: 1.15 }}>{safe(t)}</Text>;

function EcosystemPage({ company, logo, accent, onAcc, block, Foot }: { company: string; logo: string; accent: string; onAcc: string; block: Extract<Block, { kind: "ecosystem" }>; Foot: () => React.ReactElement }) {
  const W = 487, H = 520, cx = W / 2, cy = 262, rx = 150, ry = 200, cw = 150, ch = 104;
  const n = block.nodes.length;
  const pos = block.nodes.map((_, i) => { const a = (-90 + (i * 360) / n) * (Math.PI / 180); return { x: cx + rx * Math.cos(a), y: cy + ry * Math.sin(a) }; });
  return (
    <Page size="A4" style={s.page}>
      <H1 t={`The partner ecosystem around ${company}`} />
      <Text style={{ fontSize: 10, color: GREY, marginTop: 6 }}>Each partner type reaches your customer at a different point in their use of your product.</Text>
      <View style={{ width: W, height: H, marginTop: 10, position: "relative" }}>
        <Svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
          <Ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke={mix(accent, 0.75)} strokeWidth={1} strokeDasharray="2 4" />
          <Circle cx={cx} cy={cy} r={72} fill={mix(accent, 0.92)} />
          {pos.map((p, i) => <SvgLine key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke={mix(accent, 0.55)} strokeWidth={1.2} />)}
        </Svg>
        <View style={{ position: "absolute", left: cx - 50, top: cy - 50, width: 100, height: 100, borderRadius: 50, backgroundColor: accent, alignItems: "center", justifyContent: "center", padding: 8 }}>
          {logo ? <Image src={logo} style={{ width: 34, height: 34, objectFit: "contain", backgroundColor: "#fff", borderRadius: 6, padding: 4 }} /> : null}
          <Text style={{ color: onAcc, fontFamily: "Helvetica-Bold", fontSize: 9.5, marginTop: logo ? 5 : 0, textAlign: "center", lineHeight: 1.15 }}>{safe(company)}</Text>
        </View>
        {block.nodes.map((nd, i) => (
          <View key={i} wrap={false} style={{ position: "absolute", left: pos[i].x - cw / 2, top: pos[i].y - ch / 2, width: cw, minHeight: ch, backgroundColor: "#fff", borderWidth: 1, borderColor: mix(accent, 0.5), borderRadius: 7, padding: 8 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TypeIcon name={nd.type} color={accent} size={15} />
              <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 9, marginLeft: 6, flex: 1, lineHeight: 1.2 }}>{safe(nd.type)}</Text>
            </View>
            <View style={{ marginTop: 5 }}><Stepper value={nd.stage} accent={accent} /></View>
            <Text style={{ fontSize: 8, lineHeight: 1.3, marginTop: 3 }}>{safe(nd.role)}</Text>
            {nd.examples.length > 0 && <Text style={{ fontSize: 7.5, color: GREY, fontFamily: "Helvetica-Oblique", lineHeight: 1.3, marginTop: 3 }}>{safe(nd.examples.join(", "))}</Text>}
          </View>
        ))}
      </View>
      {block.customers.length > 0 && (
        <View wrap={false} style={{ marginTop: 6 }}>
          <Cap t="Customers reached" />
          <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 5 }}>
            {block.customers.map((c, i) => <Text key={i} style={{ fontSize: 9, borderWidth: 1, borderColor: LINE, borderRadius: 10, paddingVertical: 3, paddingHorizontal: 9, marginRight: 6, marginBottom: 4 }}>{safe(c)}</Text>)}
          </View>
        </View>
      )}
      <Foot />
    </Page>
  );
}

function GlancePage({ blocks, econ, accent, sharePercent, ecosystem, Foot }: { blocks: Block[]; econ: Econ; accent: string; sharePercent?: number; ecosystem?: Extract<Block, { kind: "ecosystem" }>; Foot: () => React.ReactElement }) {
  const partners = blocks.filter((b) => b.kind === "partner").length || ecosystem?.nodes.length || 0;
  const tiers = blocks.filter((b) => b.kind === "tier").length;
  const tiles: [string, string][] = [
    ["Year 1 partner revenue target", econ.targetText],
    ["Target share of revenue from partners", sharePercent ? `${sharePercent}%` : ""],
    ["Partner types", partners ? String(partners) : ""],
    ["Program tiers", tiers ? String(tiers) : ""],
    ["Active partners modelled in year 1", String(econ.activePartners)],
    ["Modelled year 1 partner revenue", econ.projectedText],
  ];
  const shown = tiles.filter((t) => t[1]);
  const rowsOf: [string, string][][] = []; for (let i = 0; i < shown.length; i += 3) rowsOf.push(shown.slice(i, i + 3));
  const max = Math.max(econ.target, econ.projected, 1);
  const below = econ.projected < econ.target;
  const matrix = blocks.filter((b): b is Extract<Block, { kind: "vp" }> => b.kind === "vp").map((v) => ({ type: v.type, stage: ecosystem?.nodes.find((nd) => norm(nd.type) === norm(v.type))?.stage ?? "", e: econFor(econ, v.type) })).filter((m) => m.type);
  const Bar = ({ label, value, text, color }: { label: string; value: number; text: string; color: string }) => (
    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 7 }}>
      <Text style={{ width: 128, fontSize: 9 }}>{safe(label)}</Text>
      <View style={{ flex: 1, height: 14, backgroundColor: "#F0F1F4", borderRadius: 7 }}><View style={{ width: `${Math.max(3, (value / max) * 100)}%`, height: 14, backgroundColor: color, borderRadius: 7 }} /></View>
      <Text style={{ width: 84, textAlign: "right", fontFamily: "Helvetica-Bold", fontSize: 9.5 }}>{safe(text)}</Text>
    </View>
  );
  return (
    <Page size="A4" style={s.page}>
      <H1 t="The program at a glance" />
      <View style={{ marginTop: 18 }}>
        {rowsOf.map((r, i) => (
          <View key={i} wrap={false} style={{ flexDirection: "row", marginBottom: 8 }}>
            {r.map(([k, v], j) => (
              <View key={k} style={{ flex: 1, borderWidth: 1, borderColor: LINE, borderRadius: 6, padding: 11, marginRight: j < r.length - 1 ? 8 : 0, backgroundColor: i === 0 && j === 0 ? mix(accent, 0.9) : "#fff" }}>
                <Cap t={k} />
                <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 21, marginTop: 7, color: i === 0 && j === 0 ? (lum(accent) > 0.6 ? INK : accent) : INK }}>{safe(v)}</Text>
              </View>
            ))}
            {r.length < 3 && Array.from({ length: 3 - r.length }).map((_, z) => <View key={z} style={{ flex: 1, marginLeft: 8 }} />)}
          </View>
        ))}
      </View>
      <View wrap={false} style={{ marginTop: 14 }}>
        <Cap t="Year 1 partner revenue: target and modelled" style={{ marginBottom: 9 }} />
        <Bar label="Your target" value={econ.target} text={econ.targetText} color={INK} />
        <Bar label={`Modelled, ${econ.activePartners} active partners`} value={econ.projected} text={econ.projectedText} color={accent} />
        <Text style={{ fontSize: 9, color: GREY, marginTop: 2 }}>{below ? `The modelled figure is ${econ.diffText} below the target.` : `The modelled figure is ${econ.diffText} above the target.`}</Text>
      </View>
      {matrix.length > 0 && (
        <View wrap={false} style={{ marginTop: 22 }}>
          <Cap t="Partner types at a glance" style={{ marginBottom: 7 }} />
          <View style={{ borderWidth: 1, borderColor: LINE, borderRadius: 4 }}>
            <View style={{ flexDirection: "row", backgroundColor: mix(accent, 0.88), padding: 6 }}>
              <Text style={{ flex: 1.5, fontFamily: "Helvetica-Bold", fontSize: 8.5 }}>PARTNER TYPE</Text>
              {matrix.some((m) => m.stage) && <Text style={{ flex: 1.45, fontFamily: "Helvetica-Bold", fontSize: 8.5 }}>POINT OF ENGAGEMENT</Text>}
              <Text style={{ flex: 1.1, fontFamily: "Helvetica-Bold", fontSize: 8.5 }}>EARNINGS PER PARTNER, YEAR</Text>
            </View>
            {matrix.map((m, i) => (
              <View key={i} style={{ flexDirection: "row", alignItems: "center", padding: 6, borderTopWidth: 1, borderTopColor: LINE }}>
                <View style={{ flex: 1.5, flexDirection: "row", alignItems: "center", paddingRight: 6 }}><TypeIcon name={m.type} color={accent} size={13} /><Text style={{ fontFamily: "Helvetica-Bold", fontSize: 9, marginLeft: 6, flex: 1 }}>{safe(m.type)}</Text></View>
                {matrix.some((x) => x.stage) && <View style={{ flex: 1.45 }}>{m.stage ? <Stepper value={m.stage} accent={accent} /> : null}</View>}
                <Text style={{ flex: 1.1, fontSize: 9 }}>{m.e ? `${m.e.loText} to ${m.e.hiText}` : ""}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
      <Foot />
    </Page>
  );
}

function EarningsBars({ vps, econ, accent }: { vps: Extract<Block, { kind: "vp" }>[]; econ?: Econ; accent: string }) {
  const rows = vps.map((v) => ({ type: v.type, e: econFor(econ, v.type) })).filter((r) => r.e) as { type: string; e: NonNullable<ReturnType<typeof econFor>> }[];
  if (rows.length === 0) return null;
  const max = Math.max(...rows.map((r) => r.e.hi), 1); const TW = 210;
  return (
    <View wrap={false} style={{ borderWidth: 1, borderColor: LINE, borderRadius: 6, padding: 12, marginBottom: 10 }}>
      <Cap t="Typical earnings per active partner, per year" />
      <Text style={{ fontSize: 8.5, color: GREY, marginTop: 3, marginBottom: 9 }}>From the conservative to the optimistic case, modelled from your inputs.</Text>
      {rows.map((r, i) => (
        <View key={i} style={{ flexDirection: "row", alignItems: "center", marginBottom: 7 }}>
          <View style={{ width: 138, flexDirection: "row", alignItems: "center", paddingRight: 6 }}><TypeIcon name={r.type} color={accent} size={12} /><Text style={{ fontSize: 8.5, fontFamily: "Helvetica-Bold", marginLeft: 5, flex: 1, lineHeight: 1.2 }}>{safe(r.type)}</Text></View>
          <View style={{ width: TW, height: 11, backgroundColor: "#F0F1F4", borderRadius: 5.5 }}>
            <View style={{ position: "absolute", left: (r.e.lo / max) * TW, width: Math.max(6, ((r.e.hi - r.e.lo) / max) * TW), height: 11, backgroundColor: accent, borderRadius: 5.5 }} />
          </View>
          <Text style={{ flex: 1, textAlign: "right", fontSize: 8.5, fontFamily: "Helvetica-Bold" }}>{safe(`${r.e.loText} to ${r.e.hiText}`)}</Text>
        </View>
      ))}
    </View>
  );
}

function TierLadder({ tiers, econ, accent }: { tiers: Extract<Block, { kind: "tier" }>[]; econ?: Econ; accent: string }) {
  const list = [...tiers].sort((a, b) => Number(a.level) - Number(b.level)).slice(0, 4);
  if (list.length < 2) return null;
  const note = (i: number) => (i === 0 ? "Starting tier" : econ && i === 1 ? `${econ.thresholds.t1} of partner-sourced revenue since joining` : econ && i === 2 ? `${econ.thresholds.t2} of partner-sourced revenue since joining` : "");
  return (
    <View wrap={false} style={{ borderWidth: 1, borderColor: LINE, borderRadius: 6, padding: 12, marginBottom: 10 }}>
      <Cap t="The tier ladder" />
      <Text style={{ fontSize: 8.5, color: GREY, marginTop: 3, marginBottom: 10 }}>Partners move up as their partner-sourced revenue grows.</Text>
      <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
        {list.map((t, i) => {
          const bg = i === 0 ? mix(accent, 0.8) : i === 1 ? mix(accent, 0.45) : accent; const fg = inkOn(bg);
          return (
            <View key={i} style={{ flex: 1, height: 78 + i * 36, backgroundColor: bg, borderRadius: 5, padding: 9, marginRight: i < list.length - 1 ? 6 : 0, justifyContent: "space-between" }}>
              <View><Text style={{ fontSize: 7.5, letterSpacing: 1, fontFamily: "Helvetica-Bold", color: fg, opacity: 0.8 }}>TIER {safe(t.level)}</Text><Text style={{ fontFamily: "Helvetica-Bold", fontSize: 12, color: fg, marginTop: 3 }}>{safe(t.name)}</Text></View>
              <Text style={{ fontSize: 7.5, color: fg, lineHeight: 1.3 }}>{safe(note(i))}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

function KpiGrid({ kpis, accent }: { kpis: Extract<Block, { kind: "kpi" }>[]; accent: string }) {
  const rows: Extract<Block, { kind: "kpi" }>[][] = []; for (let i = 0; i < kpis.length; i += 2) rows.push(kpis.slice(i, i + 2));
  const ink = lum(accent) > 0.6 ? INK : accent;
  return (
    <View style={{ marginVertical: 4 }}>
      {rows.map((r, i) => (
        <View key={i} wrap={false} style={{ flexDirection: "row", marginBottom: 8 }}>
          {r.map((k, j) => (
            <View key={j} style={{ flex: 1, borderWidth: 1, borderColor: LINE, borderRadius: 6, padding: 11, marginRight: j === 0 && r.length > 1 ? 8 : 0, borderTopWidth: 3, borderTopColor: accent }}>
              <Rich text={k.name} style={{ fontFamily: "Helvetica-Bold", fontSize: 9.5, lineHeight: 1.25 }} />
              <Rich text={k.target} style={{ fontFamily: "Helvetica-Bold", fontSize: 14, color: ink, marginTop: 6, lineHeight: 1.2 }} />
              <Text style={{ fontSize: 8, color: GREY, marginTop: 5, lineHeight: 1.35 }}>{safe(k.how)}</Text>
              <Rich text={k.tells} style={{ fontSize: 8.5, marginTop: 5, lineHeight: 1.35 }} />
              <Text style={{ fontSize: 8, color: ink, fontFamily: "Helvetica-Bold", marginTop: 5 }}>{safe(k.when)}</Text>
            </View>
          ))}
          {r.length < 2 && <View style={{ flex: 1, marginLeft: 8 }} />}
        </View>
      ))}
    </View>
  );
}

function Roadmap({ phases, accent, onAcc }: { phases: Extract<Block, { kind: "phase" }>[]; accent: string; onAcc: string }) {
  return (
    <View style={{ marginVertical: 6 }}>
      <View wrap={false} style={{ flexDirection: "row", marginBottom: 14 }}>
        {phases.map((p, i) => {
          const bg = mix(accent, Math.max(0, 0.6 - i * 0.2)); const fg = i === phases.length - 1 ? onAcc : inkOn(bg);
          return (
            <View key={i} style={{ flex: 1, backgroundColor: bg, paddingVertical: 8, paddingHorizontal: 8, marginRight: i < phases.length - 1 ? 3 : 0, borderTopLeftRadius: i === 0 ? 6 : 0, borderBottomLeftRadius: i === 0 ? 6 : 0, borderTopRightRadius: i === phases.length - 1 ? 6 : 0, borderBottomRightRadius: i === phases.length - 1 ? 6 : 0 }}>
              <Text style={{ fontSize: 7.5, letterSpacing: 1, fontFamily: "Helvetica-Bold", color: fg }}>DAYS {safe(p.days).toUpperCase()}</Text>
              <Text style={{ fontSize: 8.5, fontFamily: "Helvetica-Bold", color: fg, marginTop: 3, lineHeight: 1.2 }}>{safe(p.name)}</Text>
            </View>
          );
        })}
      </View>
      {phases.map((p, i) => (
        <View key={i} wrap={false} style={{ flexDirection: "row" }}>
          <View style={{ width: 24, alignItems: "center" }}>
            <View style={{ width: 13, height: 13, borderRadius: 6.5, backgroundColor: accent, marginTop: 1 }} />
            {i < phases.length - 1 && <View style={{ flex: 1, width: 2, backgroundColor: mix(accent, 0.7), marginTop: 2 }} />}
          </View>
          <View style={{ flex: 1, paddingBottom: 12 }}>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
              <View style={{ backgroundColor: accent, paddingVertical: 2.5, paddingHorizontal: 7, borderRadius: 3, marginRight: 8 }}><Text style={{ color: onAcc, fontFamily: "Helvetica-Bold", fontSize: 8 }}>DAYS {safe(p.days).toUpperCase()}</Text></View>
              <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 11.5 }}>{safe(p.name)}</Text>
            </View>
            <Lines lines={p.tasks.map((t) => ({ t: "bullet", text: t }))} accent={accent} size={9.5} />
          </View>
        </View>
      ))}
    </View>
  );
}

// Turns a run of blocks into pages content: overview graphics first, then the detailed cards.
function Body({ blocks, accent, onAcc, hasHead, econ }: { blocks: Block[]; accent: string; onAcc: string; hasHead: boolean; econ?: Econ }) {
  const out: React.ReactNode[] = []; let seenVp = false, seenTier = false;
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    if (b.kind === "vp" && !seenVp) { seenVp = true; out.push(<EarningsBars key={`eb${i}`} vps={blocks.filter((x): x is Extract<Block, { kind: "vp" }> => x.kind === "vp")} econ={econ} accent={accent} />); }
    if (b.kind === "tier" && !seenTier) { seenTier = true; out.push(<TierLadder key={`tl${i}`} tiers={blocks.filter((x): x is Extract<Block, { kind: "tier" }> => x.kind === "tier")} econ={econ} accent={accent} />); }
    if (b.kind === "kpi") { const run: Extract<Block, { kind: "kpi" }>[] = []; while (i < blocks.length && blocks[i].kind === "kpi") run.push(blocks[i++] as Extract<Block, { kind: "kpi" }>); i--; out.push(<KpiGrid key={`k${i}`} kpis={run} accent={accent} />); continue; }
    if (b.kind === "phase") { const run: Extract<Block, { kind: "phase" }>[] = []; while (i < blocks.length && blocks[i].kind === "phase") run.push(blocks[i++] as Extract<Block, { kind: "phase" }>); i--; out.push(<Roadmap key={`r${i}`} phases={run} accent={accent} onAcc={onAcc} />); continue; }
    out.push(<Render key={i} block={b} accent={accent} onAcc={onAcc} prevWasSection={i === 0 && hasHead} />);
  }
  return <>{out}</>;
}

export function PlanDocument({ title, company, accent, logo, blocks, contactName = "", website = "", goals = [], category = "", region = "", audience = "", econ, sharePercent }: { title: string; company: string; accent: string; logo: string; blocks: Block[]; contactName?: string; website?: string; goals?: string[]; category?: string; region?: string; audience?: string; econ?: Econ; sharePercent?: number }) {
  const onAcc = lum(accent) > 0.4 ? INK : "#FFFFFF";
  const date = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const host = (() => { try { return new URL(website).hostname.replace(/^www\./, ""); } catch { return ""; } })();
  const cl = { fontSize: 8, letterSpacing: 1, color: GREY, fontFamily: "Helvetica-Bold" } as const;
  const cv = { fontSize: 13, marginTop: 4, color: INK } as const;
  const closing = blocks.find((b) => b.kind === "closing") as Extract<Block, { kind: "closing" }> | undefined;
  // Group: each section break starts its own page, followed by that section's content pages.
  const groups: { head?: Extract<Block, { kind: "section" }>; body: Block[] }[] = [{ body: [] }];
  const eco = blocks.find((b) => b.kind === "ecosystem") as Extract<Block, { kind: "ecosystem" }> | undefined;
  for (const b of blocks) {
    if (b.kind === "closing" || b.kind === "ecosystem") continue;
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
        <View style={{ backgroundColor: accent, height: 380, padding: 54, justifyContent: "space-between" }}>
          {logo ? <Image src={logo} style={{ width: 54, height: 54, objectFit: "contain", backgroundColor: "#fff", borderRadius: 8, padding: 6 }} /> : <View style={{ width: 54, height: 54, borderRadius: 8, backgroundColor: "#fff", alignItems: "center", justifyContent: "center" }}><Text style={{ fontFamily: "Helvetica-Bold", fontSize: 22, color: accent }}>{safe(company).slice(0, 1).toUpperCase()}</Text></View>}
          <View>
            <Text style={{ color: onAcc, fontSize: 11, letterSpacing: 1.5, fontFamily: "Helvetica-Bold" }}>PARTNER PROGRAM STRATEGY</Text>
            <Text style={{ color: onAcc, fontSize: 40, fontFamily: "Helvetica-Bold", marginTop: 10, lineHeight: 1.1 }}>{safe(company)}</Text>
            {host ? <Text style={{ color: onAcc, fontSize: 13, marginTop: 8, opacity: 0.85 }}>{safe(host)}</Text> : null}
          </View>
        </View>
        <View style={{ paddingHorizontal: 54, paddingTop: 34 }}>
          <View style={{ flexDirection: "row" }}>
            {contactName ? <View style={{ flex: 1 }}><Text style={cl}>PREPARED FOR</Text><Text style={cv}>{safe(contactName)}</Text></View> : null}
            <View style={{ flex: 1 }}><Text style={cl}>DATE</Text><Text style={cv}>{date}</Text></View>
          </View>
          {(category || audience) ? (
            <View style={{ flexDirection: "row", marginTop: 18 }}>
              {category ? <View style={{ flex: 1 }}><Text style={cl}>CATEGORY</Text><Text style={cv}>{safe(category)}</Text></View> : null}
              {audience ? <View style={{ flex: 1 }}><Text style={cl}>SELLING TO</Text><Text style={cv}>{safe([audience, region].filter(Boolean).join(", "))}</Text></View> : null}
            </View>
          ) : null}
          {goals.length > 0 ? (
            <View style={{ marginTop: 22 }}>
              <Text style={cl}>GOALS</Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 6 }}>
                {goals.map((g, i) => <Text key={i} style={{ fontSize: 10, color: onAcc, backgroundColor: accent, paddingVertical: 5, paddingHorizontal: 10, borderRadius: 12, marginRight: 6, marginBottom: 6 }}>{safe(g)}</Text>)}
              </View>
            </View>
          ) : null}
        </View>
        <Text style={{ fontSize: 8, color: GREY, position: "absolute", left: 54, right: 54, bottom: 52, lineHeight: 1.4 }}>Figures in this document are modelled estimates based on the information provided. They are not a promise of results.</Text>
        <Text style={{ fontSize: 9, color: GREY, position: "absolute", left: 54, bottom: 36 }}>Prepared with Partner2B</Text>
      </Page>
      {groups.filter((g) => g.head).length >= 3 && (
        <Page size="A4" style={s.page}>
          <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 26, lineHeight: 1.15 }}>Contents</Text>
          <View style={{ marginTop: 26 }}>
            {groups.filter((g) => g.head).map((g, i) => (
              <View key={i} wrap={false} style={{ flexDirection: "row", paddingVertical: 9, borderBottomWidth: 0.6, borderBottomColor: LINE, borderBottomStyle: "solid" }}>
                <Text style={{ width: 44, fontFamily: "Helvetica-Bold", fontSize: 12, color: GREY }}>{safe(g.head!.number)}</Text>
                <Text style={{ flex: 1, fontSize: 12.5 }}>{safe(g.head!.title)}</Text>
              </View>
            ))}
          </View>
          <Foot />
        </Page>
      )}
      {econ && <GlancePage blocks={blocks} econ={econ} accent={accent} sharePercent={sharePercent} ecosystem={eco} Foot={Foot} />}
      {eco && <EcosystemPage company={company} logo={logo} accent={accent} onAcc={onAcc} block={eco} Foot={Foot} />}
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
              {g.head && (
                <View fixed style={{ position: "absolute", top: 24, left: 54, right: 54, flexDirection: "row", justifyContent: "space-between", borderBottomWidth: 0.6, borderBottomColor: LINE, borderBottomStyle: "solid", paddingBottom: 5 }}>
                  <Text style={{ fontSize: 7.5, color: GREY, letterSpacing: 1 }}>{safe(company).toUpperCase()}</Text>
                  <Text style={{ fontSize: 7.5, color: lum(accent) > 0.6 ? INK : accent, fontFamily: "Helvetica-Bold", letterSpacing: 1 }}>{safe(g.head.number)}   {safe(g.head.title)}</Text>
                </View>
              )}
              <Body blocks={g.body} accent={accent} onAcc={onAcc} hasHead={!!g.head} econ={econ} />
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
