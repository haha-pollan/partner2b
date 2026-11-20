import { Glyph } from "./Tile";
import { coverFor } from "@/lib/articles";

export function Cover({ slug, i }: { slug: string; i?: number }) {
  const c = coverFor(slug, i);
  return (
    <div className="cut" role="img" aria-hidden="true" style={{ position: "relative", aspectRatio: "16 / 9", background: c.bg, overflow: "hidden", width: "100%" }}>
      <div style={{ position: "absolute", right: "6%", top: "50%", transform: "translateY(-50%) rotate(8deg)" }}>
        <Glyph kind={c.kind} fg={c.accent} size={190} />
      </div>
      <div style={{ position: "absolute", left: "7%", bottom: "9%", display: "flex", flexDirection: "column", gap: 8 }}>
        <span style={{ alignSelf: "flex-start", background: c.accent, color: c.bg, fontSize: 12, fontWeight: 800, padding: "5px 12px", borderRadius: 999, letterSpacing: "0.05em" }}>PARTNER2B</span>
        <span style={{ fontFamily: "'Archivo',sans-serif", fontWeight: 800, fontSize: 15, color: c.fg, letterSpacing: "-0.01em" }}>Partner insights</span>
      </div>
    </div>
  );
}
