import { LogoTile } from "./LogoTile";

const TYPES: Record<string, { kind: string; bg: string; fg: string }> = {
  Reseller: { kind: "bars", bg: "#0A0A0B", fg: "#A8FF5C" },
  Referral: { kind: "diamond", bg: "#55565B", fg: "#FFFFFF" },
  Technology: { kind: "grid", bg: "#A8FF5C", fg: "#0A0A0B" },
  Services: { kind: "slants", bg: "#B9BABD", fg: "#0A0A0B" },
  MSP: { kind: "hex", bg: "#1C1D20", fg: "#ECECEE" },
  "OEM or white label": { kind: "stairs", bg: "#3A3B40", fg: "#A8FF5C" },
};

function Glyph({ kind, fg, size }: { kind: string; fg: string; size: number }) {
  const common = { width: size, height: size, viewBox: "0 0 120 120", "aria-hidden": true } as const;
  switch (kind) {
    case "bars":
      return (<svg {...common}><polygon points="22,26 100,22 90,42 14,46" fill={fg} /><polygon points="14,52 92,48 82,68 6,72" fill={fg} /><polygon points="8,78 86,74 76,94 0,98" fill={fg} /></svg>);
    case "diamond":
      return (<svg {...common}><polygon points="60,6 100,60 60,114 20,60" fill={fg} /></svg>);
    case "grid":
      return (<svg {...common}>{["60,12 78,26 60,40 42,26","84,29 102,43 84,57 66,43","108,46 126,60 108,74 90,60","36,29 54,43 36,57 18,43","60,46 78,60 60,74 42,60","84,63 102,77 84,91 66,77","12,46 30,60 12,74 -6,60","36,63 54,77 36,91 18,77","60,80 78,94 60,108 42,94"].map((p) => <polygon key={p} points={p} fill={fg} />)}</svg>);
    case "slants":
      return (<svg {...common}><polygon points="14,12 36,12 62,108 40,108" fill={fg} /><polygon points="44,12 66,12 92,108 70,108" fill={fg} /><polygon points="60,12 82,12 108,108 86,108" fill={fg} /></svg>);
    case "hex":
      return (<svg {...common}><polygon points="60,6 106,32 106,88 60,114 14,88 14,32" fill="none" stroke={fg} strokeWidth="12" strokeLinejoin="miter" /></svg>);
    default:
      return (<svg {...common}><rect x="8" y="70" width="28" height="44" fill={fg} /><rect x="46" y="44" width="28" height="70" fill={fg} /><rect x="84" y="14" width="28" height="100" fill={fg} /></svg>);
  }
}

export function Tile({ type, size = 88, domain }: { type: string; size?: number; domain?: string | null }) {
  const t = TYPES[type] ?? TYPES.Technology;
  const glyph = (
    <div style={{ flex: `0 0 ${size}px`, width: size, height: size, background: t.bg, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 14 }}>
      <Glyph kind={t.kind} fg={t.fg} size={Math.round(size * 0.62)} />
    </div>
  );
  if (!domain) return glyph;
  return <LogoTile domain={domain} size={size} fallback={glyph} />;
}
