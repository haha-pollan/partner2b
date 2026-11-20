// Turns raw article HTML into a more readable page:
// 1. wraps a leading "TL;DR" paragraph in a callout
// 2. builds one "At a glance" infographic from the article's own sections
// 3. places the infographic right after the intro

const ENT: Record<string, string> = { "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&#39;": "'", "&apos;": "'", "&nbsp;": " ", "&rsquo;": "’", "&lsquo;": "‘", "&ldquo;": "“", "&rdquo;": "”" };

const text = (h: string) =>
  h
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]*>/g, "")
    .replace(/&(#\d+|[a-z]+);/gi, (m) => ENT[m.toLowerCase()] ?? (m.startsWith("&#") ? String.fromCharCode(parseInt(m.slice(2, -1), 10)) : m))
    .replace(/\s+/g, " ")
    .trim();

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const GENERIC = /^(conclusion|final thoughts?|faq|frequently asked|key takeaways?|summary|what.?s next|ready to|about|wrapping up|bottom line|tl;?dr)/i;

function firstSentence(s: string, max = 118): string {
  const m = s.match(/^.*?[.!?](\s|$)/);
  let out = (m ? m[0] : s).trim();
  if (out.length > max) {
    out = out.slice(0, max);
    out = out.slice(0, out.lastIndexOf(" ")).replace(/[,;:(\s]+$/, "") + "…";
  }
  return out;
}

type Node = { title: string; note: string };

function sections(html: string): Node[] {
  const parts = html.split(/<h2[^>]*>/i).slice(1);
  const nodes: Node[] = [];
  for (const part of parts) {
    const [head, ...rest] = part.split(/<\/h2>/i);
    const title = text(head);
    if (!title || GENERIC.test(title)) continue;
    const body = rest.join("</h2>").split(/<h2/i)[0];
    const p = body.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
    const note = p ? firstSentence(text(p[1])) : "";
    nodes.push({ title: title.replace(/^\d+[.)]\s*/, ""), note });
  }
  return nodes;
}

function fallbackNodes(html: string): Node[] {
  // Articles without h2 headings: use bold lead-ins instead
  const out: Node[] = [];
  const re = /<strong[^>]*>([\s\S]*?)<\/strong>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) && out.length < 8) {
    const t = text(m[1]).replace(/[:.]$/, "");
    if (t.length > 6 && t.length < 90 && !GENERIC.test(t)) out.push({ title: t, note: "" });
  }
  return out;
}

function pick(nodes: Node[], max: number): Node[] {
  if (nodes.length <= max) return nodes;
  const step = (nodes.length - 1) / (max - 1);
  return Array.from({ length: max }, (_, i) => nodes[Math.round(i * step)]);
}

function infographic(html: string): string {
  let nodes = sections(html);
  if (nodes.length < 2) nodes = fallbackNodes(html);
  if (nodes.length < 2) return "";
  const total = nodes.length;
  const shown = pick(nodes, 8);
  const words = text(html).split(" ").length;
  const mins = Math.max(1, Math.round(words / 220));
  const items = shown
    .map(
      (n, i) =>
        `<li class="ig-node"><span class="ig-num">${String(i + 1).padStart(2, "0")}</span><div><h4>${esc(n.title)}</h4>${n.note ? `<p>${esc(n.note)}</p>` : ""}</div></li>`,
    )
    .join("");
  return (
    `<figure class="ig" aria-label="Article at a glance">` +
    `<div class="ig-head"><span class="ig-kicker">At a glance</span>` +
    `<span class="ig-chip">${mins} min read</span><span class="ig-chip">${total} key sections</span></div>` +
    `<ol class="ig-list">${items}</ol></figure>`
  );
}

export function enhance(html: string): string {
  if (!html) return "";
  let out = html;
  // TL;DR callout
  out = out.replace(/^\s*<p>\s*<strong>\s*(TL;?DR:?)\s*<\/strong>\s*([\s\S]*?)<\/p>/i, (_m, label, rest) => `<div class="callout"><span class="callout-label">${label.replace(/:$/, "")}</span><p>${rest.trim()}</p></div>`);
  const ig = infographic(out);
  if (!ig) return out;
  const i = out.search(/<h2[\s>]/i);
  if (i >= 0) return out.slice(0, i) + ig + out.slice(i);
  const p = out.search(/<\/p>/i);
  return p >= 0 ? out.slice(0, p + 4) + ig + out.slice(p + 4) : ig + out;
}
