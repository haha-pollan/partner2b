import { AI_CATEGORIES } from "@/lib/ai";

const SHORT: Record<string, string> = {
  "foundation-models": "Models", agents: "Agents", infrastructure: "Infrastructure", "vector-databases": "Vector data",
  security: "Security", integrators: "Integrators", conversational: "Voice AI",
};

export function AiNetwork({ counts }: { counts: Record<string, number> }) {
  const cx = 290, cy = 230, rx = 215, ry = 160;
  const n = AI_CATEGORIES.length;
  const nodes = AI_CATEGORIES.map((c, i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    return { c, x: cx + rx * Math.cos(a), y: cy + ry * Math.sin(a) };
  });
  const W = 136, H = 50;
  return (
    <svg viewBox="0 0 580 460" role="group" aria-label="AI partner program categories" style={{ width: "100%", maxWidth: 560, height: "auto", display: "block" }}>
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke="#fff" strokeOpacity="0.25" strokeDasharray="3 7" />
      {nodes.map(({ c, x, y }) => (
        <line key={c.slug} x1={cx} y1={cy} x2={x} y2={y} stroke="#fff" strokeOpacity="0.5" strokeWidth="1.5" />
      ))}
      <polygon points={`${cx},${cy - 54} ${cx + 47},${cy - 27} ${cx + 47},${cy + 27} ${cx},${cy + 54} ${cx - 47},${cy + 27} ${cx - 47},${cy - 27}`} fill="#fff" />
      <text x={cx} y={cy + 4} textAnchor="middle" fontFamily="Michroma, sans-serif" fontSize="12" fill="#0A0A0B">Partners</text>
      {nodes.map(({ c, x, y }) => (
        <a key={c.slug} href={`/ai/${c.slug}`}>
          <polygon
            points={`${x - W / 2},${y - H / 2} ${x + W / 2 - 12},${y - H / 2} ${x + W / 2},${y - H / 2 + 12} ${x + W / 2},${y + H / 2} ${x - W / 2 + 12},${y + H / 2} ${x - W / 2},${y + H / 2 - 12}`}
            fill="#0A0A0B"
          />
          <text x={x} y={y - 3} textAnchor="middle" fontFamily="Michroma, sans-serif" fontSize="11" fill="#fff">{SHORT[c.slug] ?? c.name}</text>
          <text x={x} y={y + 14} textAnchor="middle" fontFamily="Sora, sans-serif" fontSize="12" fill="#C9BDFF">{counts[c.slug] ?? 0} programs</text>
        </a>
      ))}
    </svg>
  );
}
