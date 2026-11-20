const CUBE = {"dark": [["30,30 30.0,2.0 54.2,16.0", "#0A0A0B"], ["30,30 54.2,16.0 54.2,44.0", "#2A2B2F"], ["30,30 54.2,44.0 30.0,58.0", "#55565B"], ["30,30 30.0,58.0 5.8,44.0", "#0A0A0B"], ["30,30 5.8,44.0 5.8,16.0", "#3A3B40"], ["30,30 5.8,16.0 30.0,2.0", "#FFFFFF"]], "light": [["30,30 30.0,2.0 54.2,16.0", "#A8FF5C"], ["30,30 54.2,16.0 54.2,44.0", "#8FE443"], ["30,30 54.2,44.0 30.0,58.0", "#55565B"], ["30,30 30.0,58.0 5.8,44.0", "#C2FF8C"], ["30,30 5.8,44.0 5.8,16.0", "#3A3B40"], ["30,30 5.8,16.0 30.0,2.0", "#B9BABD"]]} as Record<"dark" | "light", [string, string][]>;

export function Logo({ variant = "dark", size = 28 }: { variant?: "dark" | "light"; size?: number }) {
  const cube = Math.round(size * 1.55);
  const onLime = variant === "dark";
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 12 }}>
      <svg width={cube} height={cube} viewBox="0 0 60 60" aria-hidden="true" style={{ display: "block", flex: "0 0 auto" }}>
        {CUBE[variant].map(([pts, fill], i) => (
          <polygon key={i} points={pts} fill={fill} stroke={fill} strokeWidth="0.6" />
        ))}
      </svg>
      <span style={{ fontFamily: "'Zen Dots', sans-serif", fontWeight: 400, fontSize: size, letterSpacing: "-0.03em", lineHeight: 1, color: onLime ? "#0A0A0B" : "#ECECEE" }}>
        Partner
        <span style={onLime ? { color: "#A8FF5C", background: "#0A0A0B", padding: "3px 9px 4px", marginLeft: 5 } : { color: "#A8FF5C" }}>2B</span>
      </span>
    </span>
  );
}
