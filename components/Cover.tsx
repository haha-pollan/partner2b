import { Glyph } from "./Tile";
import { coverFor } from "@/lib/articles";

export function Cover({ slug, title }: { slug: string; title: string }) {
  const c = coverFor(slug);
  const short = title.length > 70 ? title.slice(0, 67).replace(/\s+\S*$/, "") + "..." : title;
  return (
    <div className="cut" style={{ position: "relative", aspectRatio: "16 / 9", background: c.bg, color: c.fg, overflow: "hidden", width: "100%" }}>
      <div style={{ position: "absolute", right: "-4%", top: "-8%", transform: "rotate(12deg)", opacity: 0.95 }}>
        <Glyph kind={c.kind} fg={c.accent} size={230} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "0 7% 7%", display: "flex", flexDirection: "column", gap: 10 }}>
        <span style={{ alignSelf: "flex-start", background: c.accent, color: c.bg, fontSize: 11, fontWeight: 800, padding: "4px 10px", borderRadius: 999, letterSpacing: "0.04em" }}>PARTNER2B</span>
        <div style={{ fontFamily: "'Archivo',sans-serif", fontWeight: 800, fontSize: "clamp(15px,2vw,24px)", lineHeight: 1.1, letterSpacing: "-0.03em", maxWidth: "78%" }}>{short}</div>
      </div>
    </div>
  );
}
