// Turns the model's marker text into typed blocks for the PDF renderer.
export type Line =
  | { t: "p"; text: string }
  | { t: "bullet"; text: string }
  | { t: "table"; rows: string[][] }
  | { t: "h"; text: string };

export type Block =
  | { kind: "section"; number: string; title: string; intro: string }
  | { kind: "text"; lines: Line[] }
  | { kind: "highlight"; number: string; insight: string; tag: string }
  | { kind: "partner"; title: string; fields: { label: string; lines: Line[] }[] }
  | { kind: "vp"; type: string; target: string; prose: Line[]; earnings: string[][]; tier: Line[]; extra: Line[]; bottom: string }
  | { kind: "tier"; name: string; level: string; entry: string; receive: Line[]; terms: Line[]; progress: string }
  | { kind: "callout"; label: string; text: string }
  | { kind: "kpi"; name: string; target: string; how: string; tells: string; when: string }
  | { kind: "health"; label: string; text: string }
  | { kind: "phase"; days: string; name: string; tasks: string[] }
  | { kind: "closing"; headline: string; text: string; ctas: { title: string; subtitle: string }[]; attribution: string };

export const tidy = (s: string) => s.replace(/\s*[—–]\s*/g, ", ").replace(/!/g, ".").replace(/ /g, " ");

export function toLines(src: string): Line[] {
  const out: Line[] = []; let table: string[][] | null = null;
  const flush = () => { if (table) { out.push({ t: "table", rows: table }); table = null; } };
  for (const raw of src.split("\n")) {
    const l = raw.trim();
    if (!l) { flush(); continue; }
    if (l.startsWith("|")) {
      const cells = l.replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
      if (cells.every((c) => /^:?-{2,}:?$/.test(c))) continue;
      (table ??= []).push(cells); continue;
    }
    flush();
    if (/^[-*•]\s+/.test(l)) out.push({ t: "bullet", text: l.replace(/^[-*•]\s+/, "") });
    else out.push({ t: "p", text: l });
  }
  flush();
  return out;
}

// Splits a block body into labelled fields. A label is an all-capitals line ending with a colon, for example "EARNINGS:".
function fields(body: string): { label: string; text: string }[] {
  const res: { label: string; text: string }[] = []; let cur: { label: string; text: string } | null = null;
  for (const raw of body.split("\n")) {
    const m = raw.match(/^([A-Z][A-Z0-9 ,'.|&()\/\-]*?):\s*(.*)$/);
    if (m && ((m[1] === m[1].toUpperCase() && /[A-Z]{2}/.test(m[1])) || /^WHY THEY NEED /i.test(m[1]))) { cur = { label: m[1].trim(), text: m[2] }; res.push(cur); }
    else if (cur) cur.text += "\n" + raw;
  }
  return res.map((f) => ({ label: f.label, text: f.text.trim() }));
}
const get = (fs: { label: string; text: string }[], re: RegExp) => fs.find((f) => re.test(f.label))?.text ?? "";
const one = (s: string) => s.replace(/\s*\n\s*/g, " ").trim();

export function parse(raw: string): Block[] {
  const text = tidy(raw).replace(/\r/g, "");
  const blocks: Block[] = [];
  const re = /\[\[([A-Z_]+)([^\]]*)\]\]([\s\S]*?)\[\[\/\1\]\]/g;
  let last = 0, m: RegExpExecArray | null;
  const free = (s: string) => { const lines = toLines(s); if (lines.length) blocks.push({ kind: "text", lines }); };
  while ((m = re.exec(text))) {
    free(text.slice(last, m.index)); last = re.lastIndex;
    const [, tok, attrs, body] = m; const fs = fields(body);
    switch (tok) {
      case "SECTION_BREAK": blocks.push({ kind: "section", number: one(get(fs, /^NUMBER/)), title: one(get(fs, /^TITLE/)), intro: one(get(fs, /^INTRO/)) }); break;
      case "HIGHLIGHT_CARD": blocks.push({ kind: "highlight", number: (attrs.match(/number=(\d+)/)?.[1] ?? ""), insight: one(get(fs, /^INSIGHT/)), tag: one(get(fs, /^TAG/)) }); break;
      case "PARTNER_CARD": blocks.push({ kind: "partner", title: one(get(fs, /^TITLE/)), fields: fs.filter((f) => !/^TITLE/.test(f.label)).map((f) => ({ label: f.label, lines: toLines(f.text) })) }); break;
      case "VP_BLOCK": {
        const rows: string[][] = [["", "Conservative", "Optimistic"]];
        for (const l of body.split("\n")) {
          const mm = l.match(/^(ACV|Commission per deal|Deals per month|Introductions per month):\s*(.+?)\s*\|\s*(.+)$/i);
          if (mm) rows.push([mm[1].toUpperCase() === "ACV" ? "ACV" : mm[1].charAt(0).toUpperCase() + mm[1].slice(1).toLowerCase(), mm[2].trim(), mm[3].trim()]);
        }
        blocks.push({ kind: "vp", type: one(get(fs, /^PARTNER TYPE/)), target: one(get(fs, /^TARGET/)), prose: toLines(get(fs, /^VP PROSE/)), earnings: rows.length > 1 ? rows : [], tier: toLines(get(fs, /^AT EACH TIER/)), extra: toLines(get(fs, /^WITH IMPLEMENTATION/)), bottom: one(get(fs, /^BOTTOM LINE/)).replace(/\*\*/g, "") });
        break;
      }
      case "TIER_CARD": blocks.push({ kind: "tier", name: one(get(fs, /^TIER NAME/)), level: one(get(fs, /^TIER LEVEL/)), entry: one(get(fs, /^ENTRY/)).replace(/^\*|\*$/g, ""), receive: toLines(get(fs, /^WHAT PARTNERS RECEIVE/)), terms: toLines(get(fs, /^COMMERCIAL TERMS/)), progress: one(get(fs, /^TO PROGRESS/)) }); break;
      case "CALLOUT": blocks.push({ kind: "callout", label: one(get(fs, /^LABEL/)), text: one(get(fs, /^TEXT/)) }); break;
      case "KPI_BLOCK": blocks.push({ kind: "kpi", name: one(get(fs, /^NAME/)), target: one(get(fs, /^TARGET/)), how: one(get(fs, /^HOW WE GOT/)), tells: one(get(fs, /^WHAT IT TELLS/)), when: one(get(fs, /^WHEN YOU WILL/)) }); break;
      case "HEALTH_CARD": blocks.push({ kind: "health", label: one(get(fs, /^LABEL/)), text: one(get(fs, /^TEXT/)) }); break;
      case "PHASE_BLOCK": blocks.push({ kind: "phase", days: one(get(fs, /^DAYS/)), name: one(get(fs, /^PHASE NAME/)), tasks: toLines(get(fs, /^TASKS/)).map((l) => (l.t === "bullet" || l.t === "p" ? l.text : "")).filter(Boolean) }); break;
      case "CLOSING_PAGE": {
        const ctas = Array.from(body.matchAll(/CTA CARD \d:\s*TITLE:\s*(.*)\s*SUBTITLE:\s*(.*)/g)).map((x) => ({ title: x[1].trim(), subtitle: x[2].trim() }));
        blocks.push({ kind: "closing", headline: one(get(fs, /^HEADLINE/)), text: one(get(fs, /^CLOSING TEXT/)), ctas, attribution: one(get(fs, /^ATTRIBUTION/)) }); break;
      }
    }
  }
  free(text.slice(last));
  return blocks;
}

export function looksComplete(blocks: Block[]) {
  const sections = blocks.filter((b) => b.kind === "section").length;
  return sections >= 8 && blocks.some((b) => b.kind === "closing") && blocks.some((b) => b.kind === "kpi") && blocks.some((b) => b.kind === "phase");
}
