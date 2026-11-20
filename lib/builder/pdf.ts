import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import type { Result } from "./engine";

const W = 595.28, H = 841.89, M = 48;
const INK = rgb(0.04, 0.04, 0.043), LIME = rgb(0.659, 1, 0.361), GREY = rgb(0.35, 0.36, 0.38), LIGHT = rgb(0.925, 0.925, 0.933);
const clean = (s: string) => s.replace(/[–—]/g, ", ").replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/•/g, "-").replace(/[^\x20-\x7E -ÿ]/g, "");

export async function buildPdf(r: Result): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const reg = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  doc.setTitle(`${r.program.name} blueprint`);
  doc.setAuthor("Partner2B");
  let page: PDFPage; let y = 0; let pageNo = 0;

  const footer = (p: PDFPage, n: number) => {
    p.drawText(clean("Partner2B  |  partner2b.com/program-builder"), { x: M, y: 26, size: 8, font: reg, color: GREY });
    p.drawText(String(n), { x: W - M - 10, y: 26, size: 8, font: reg, color: GREY });
  };
  const newPage = () => { page = doc.addPage([W, H]); pageNo += 1; y = H - M; footer(page, pageNo); };
  const need = (h: number) => { if (y - h < 56) newPage(); };
  const wrap = (text: string, font: PDFFont, size: number, width: number) => {
    const out: string[] = []; let line = "";
    for (const w of clean(text).split(/\s+/)) {
      const t = line ? `${line} ${w}` : w;
      if (font.widthOfTextAtSize(t, size) > width && line) { out.push(line); line = w; } else line = t;
    }
    if (line) out.push(line);
    return out;
  };
  const para = (text: string, o: { size?: number; font?: PDFFont; color?: ReturnType<typeof rgb>; x?: number; width?: number; gap?: number } = {}) => {
    const size = o.size ?? 10.5, font = o.font ?? reg, x = o.x ?? M, width = o.width ?? W - M - x, lh = size * 1.45;
    for (const l of wrap(text, font, size, width)) { need(lh); page.drawText(l, { x, y: y - size, size, font, color: o.color ?? INK }); y -= lh; }
    y -= o.gap ?? 6;
  };
  const h1 = (t: string) => {
    need(150); y -= 14;
    page.drawRectangle({ x: M, y: y - 4, width: 36, height: 3, color: LIME });
    y -= 12;
    for (const l of wrap(t, bold, 17, W - 2 * M)) { need(24); page.drawText(l, { x: M, y: y - 17, size: 17, font: bold, color: INK }); y -= 24; }
    y -= 4;
  };
  const h2 = (t: string) => { need(34); y -= 6; para(t, { size: 12, font: bold, gap: 4 }); };
  const bullets = (items: string[], x = M) => {
    for (const it of items) {
      const lines = wrap(it, reg, 10.5, W - M - x - 14); const lh = 15.2;
      need(lh * lines.length);
      page.drawCircle({ x: x + 3, y: y - 8, size: 1.8, color: INK });
      lines.forEach((l, i) => { page.drawText(l, { x: x + 14, y: y - 11 - i * lh + 3, size: 10.5, font: reg, color: INK }); });
      y -= lh * lines.length + 3;
    }
    y -= 3;
  };

  // Cover
  page = doc.addPage([W, H]); pageNo += 1;
  page.drawRectangle({ x: 0, y: 0, width: W, height: H, color: INK });
  page.drawRectangle({ x: 0, y: H - 18, width: W, height: 18, color: LIME });
  page.drawText("PARTNER2B", { x: M, y: H - 70, size: 12, font: bold, color: LIME });
  let cy = H - 230;
  for (const l of wrap(r.program.name, bold, 34, W - 2 * M)) { page.drawText(l, { x: M, y: cy, size: 34, font: bold, color: rgb(1, 1, 1) }); cy -= 42; }
  page.drawText("Partner program blueprint", { x: M, y: cy - 6, size: 16, font: reg, color: LIME });
  const cover = [`Website: ${r.company.domain}`, `Category: ${r.input.category}`, `Main goal: ${r.input.goal ? goalLabel(r) : ""}`, `Stage: ${r.input.stage}`];
  cover.forEach((t, i) => page.drawText(clean(t), { x: M, y: 200 - i * 18, size: 10.5, font: reg, color: rgb(0.72, 0.73, 0.74) }));
  page.drawText("Built from the Partner2B Directory of B2B partner programs", { x: M, y: 70, size: 9, font: reg, color: rgb(0.52, 0.53, 0.55) });

  newPage();
  h1("1. Your ideal partner profile");
  para(r.ipp.summary);
  h2("Partner types to recruit");
  for (const t of r.ipp.partnerTypes) {
    para(t.title, { font: bold, size: 11, gap: 2 });
    para(`${t.who} They earn: ${t.earns.toLowerCase()}. They need: ${t.need.toLowerCase()}.`, { gap: 8 });
  }
  h2("Who to approach first");
  bullets(r.ipp.archetypes);

  h1("2. Program structure");
  para(r.program.model);
  h2("Tiers");
  for (const t of r.program.tiers) {
    need(70);
    para(t.name, { font: bold, size: 11, gap: 2 });
    para(t.criteria, { color: GREY, gap: 4 });
    bullets(t.benefits);
  }
  h2("Economics by partner type");
  for (const e of r.program.economics) { para(e.title, { font: bold, size: 10.5, gap: 2 }); para(e.guidance, { gap: 8 }); }
  if (r.program.insight.length) { h2("What the benchmark programs do"); bullets(r.program.insight); }
  h2("Terms to write down before you recruit");
  bullets(r.program.terms);

  h1("3. Enablement kit");
  bullets(r.enablement);

  h1("4. First 90 days");
  for (const p of r.plan) { need(60); para(`${p.phase}  |  ${p.weeks}`, { font: bold, size: 11, gap: 3 }); bullets(p.actions); }
  h2("What to measure");
  bullets(r.kpis);

  h1("5. Ten programs to benchmark");
  para("These programs are the best fit for your ideal partner profile. They run the partner types recommended above, and they are ranked by how close they are to your category and goals.", { color: GREY });
  r.benchmarks.forEach((b, i) => {
    const title = `${i + 1}. ${b.company}${b.note ? " " + b.note : ""}`;
    const why = wrap(b.why, reg, 10, W - 2 * M - 20);
    const h = 18 + why.length * 14 + 34;
    need(h + 8);
    page.drawRectangle({ x: M, y: y - h, width: W - 2 * M, height: h, color: LIGHT });
    page.drawRectangle({ x: M, y: y - h, width: 4, height: h, color: LIME });
    page.drawText(clean(title).slice(0, 80), { x: M + 14, y: y - 18, size: 11.5, font: bold, color: INK });
    let ly = y - 34;
    why.forEach((l) => { page.drawText(l, { x: M + 14, y: ly, size: 10, font: reg, color: INK }); ly -= 14; });
    page.drawText(clean(`Types: ${b.types.join(", ")}   |   Commission: ${b.commission}`).slice(0, 110), { x: M + 14, y: ly - 2, size: 8.5, font: reg, color: GREY });
    page.drawText(clean(`partner2b.com/directory/${b.slug}`), { x: M + 14, y: ly - 14, size: 8.5, font: reg, color: GREY });
    y -= h + 8;
  });

  if (r.notes.length) { h2("Notes"); bullets(r.notes); }

  need(120); y -= 10;
  page.drawRectangle({ x: M, y: y - 96, width: W - 2 * M, height: 96, color: INK });
  page.drawText("Want help running this program?", { x: M + 18, y: y - 32, size: 14, font: bold, color: LIME });
  page.drawText("Partner2B is an AI-first partner marketing agency. We recruit, enable and market your partners.", { x: M + 18, y: y - 54, size: 9.5, font: reg, color: rgb(0.9, 0.9, 0.92) });
  page.drawText("info@partner2b.com   |   partner2b.com/services", { x: M + 18, y: y - 74, size: 9.5, font: bold, color: rgb(1, 1, 1) });
  return await doc.save();
}

import { GOALS } from "./config";
function goalLabel(r: Result) { return GOALS.find((g) => g.id === r.input.goal)?.label ?? ""; }
