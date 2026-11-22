// The Partner2B lockup. variant "light" is for dark grounds (white cube, lime 2B tile),
// variant "dark" is for light grounds (ink cube with grey diamonds, ink 2B tile).
const BARS = ["117,0 348,0 318,50 87,50", "73.5,75.5 304.5,75.5 274.5,125.5 43.5,125.5", "30,151 261,151 231,201 0,201"];
const BANDS = ["0,226 59,226 172,426 113,426", "87,226 146,226 259,426 200,426", "174,226 233,226 346,426 287,426"];
const DIAMONDS = ["370,13 399,63 370,113 341,63", "326.5,88 355.5,138 326.5,188 297.5,138", "413.5,88 442.5,138 413.5,188 384.5,138", "283,163 312,213 283,263 254,213", "370,163 399,213 370,263 341,213", "457,163 486,213 457,263 428,213", "326.5,238 355.5,288 326.5,338 297.5,288", "413.5,238 442.5,288 413.5,338 384.5,288", "370,313 399,363 370,413 341,363"];

export function Cube({ variant = "light", height = 34 }: { variant?: "light" | "dark"; height?: number }) {
  const main = variant === "light" ? "#FFFFFF" : "#0A0A0B";
  const dia = variant === "light" ? "#FFFFFF" : "#85868B";
  return (
    <svg className="logo-cube" width={Math.round((height * 486) / 426)} height={height} viewBox="0 0 486 426" aria-hidden="true" style={{ display: "block", flex: "0 0 auto" }}>
      {[...BARS, ...BANDS].map((p) => <polygon key={p} points={p} fill={main} />)}
      {DIAMONDS.map((p) => <polygon key={p} points={p} fill={dia} />)}
    </svg>
  );
}

export function Logo({ variant = "light", size = 28 }: { variant?: "light" | "dark"; size?: number }) {
  const light = variant === "light";
  return (
    <span className="logo" style={{ display: "inline-flex", alignItems: "center", gap: 12 }}>
      <Cube variant={variant} height={Math.round(size * 1.5)} />
      <span className="logo-text" style={{ fontFamily: "'Zen Dots', sans-serif", fontWeight: 400, fontSize: size, letterSpacing: "-0.02em", lineHeight: 1, color: light ? "#FFFFFF" : "#0A0A0B", whiteSpace: "nowrap" }}>
        Partner
        <span style={{ color: light ? "#0A0A0B" : "#A8FF5C", background: light ? "#A8FF5C" : "#0A0A0B", padding: "3px 8px 4px", marginLeft: 6 }}>2B</span>
      </span>
    </span>
  );
}
