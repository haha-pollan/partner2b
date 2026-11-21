type Kind = "percent" | "tag" | "award" | "cap" | "chat" | "grid" | "megaphone" | "window" | "shield" | "code" | "arrows" | "target" | "layers" | "gift" | "chart" | "diamond";

const RULES: [RegExp, Kind][] = [
  [/commission|revenue share|payout|referral fee|earn|\d\s?%/i, "percent"],
  [/discount|pricing|credit|upfront|free/i, "tag"],
  [/certif|badge|competenc|specializ|award/i, "award"],
  [/train|enablement|academy|learn|playbook|onboard|resource|guide/i, "cap"],
  [/support|manager|success|dedicated|helpdesk/i, "chat"],
  [/directory|listing|locator|marketplace|visibility|catalog/i, "grid"],
  [/co-?sell|co-?market|campaign|promot|event|joint|go-to-market|brand|lead gen/i, "megaphone"],
  [/portal|dashboard|tracking|demo|environment|sandbox/i, "window"],
  [/deal reg|protect|attribution/i, "shield"],
  [/integrat|api|plugin|embed|white|oem|technical|connector|ats|hris/i, "code"],
  [/referral|refer\b/i, "arrows"],
  [/customer|lead|match|introduc/i, "target"],
  [/tier|status|level/i, "layers"],
  [/early|beta|access|gift/i, "gift"],
  [/margin|growth|revenue|arr|sales/i, "chart"],
];
const FALLBACK: Kind[] = ["diamond", "layers", "target", "award", "chart", "grid"];

export function benefitKind(text: string, index: number): Kind {
  for (const [re, k] of RULES) if (re.test(text)) return k;
  return FALLBACK[index % FALLBACK.length];
}

export function BenefitIcon({ text, index, size = 40 }: { text: string; index: number; size?: number }) {
  const k = benefitKind(text, index);
  const p = { fill: "none", stroke: "#A8FF5C", strokeWidth: 1.8, strokeLinejoin: "miter", strokeLinecap: "square" } as const;
  const f = { fill: "#A8FF5C" };
  let g: React.ReactNode;
  switch (k) {
    case "percent": g = (<><line x1="5" y1="19" x2="19" y2="5" {...p} /><rect x="4.5" y="4.5" width="5" height="5" {...p} /><rect x="14.5" y="14.5" width="5" height="5" {...p} /></>); break;
    case "tag": g = (<><polygon points="3,12 12,3 21,3 21,12 12,21" {...p} /><rect x="15" y="6" width="3" height="3" {...f} /></>); break;
    case "award": g = <polygon points="12,3 14.8,9 21,9.7 16.2,14 17.6,20.5 12,17.2 6.4,20.5 7.8,14 3,9.7 9.2,9" {...p} />; break;
    case "cap": g = (<><polygon points="2,9 12,4 22,9 12,14" {...p} /><polyline points="6,11.5 6,16.5 12,19 18,16.5 18,11.5" {...p} /></>); break;
    case "chat": g = <polygon points="3,4 21,4 21,16 12,16 7,20 7,16 3,16" {...p} />; break;
    case "grid": g = (<><rect x="4" y="4" width="6.5" height="6.5" {...p} /><rect x="13.5" y="4" width="6.5" height="6.5" {...p} /><rect x="4" y="13.5" width="6.5" height="6.5" {...p} /><rect x="13.5" y="13.5" width="6.5" height="6.5" {...f} /></>); break;
    case "megaphone": g = (<><polygon points="3,10 8,10 17,5 17,19 8,14 3,14" {...p} /><line x1="9" y1="15" x2="10.5" y2="20" {...p} /></>); break;
    case "window": g = (<><rect x="3" y="4" width="18" height="16" {...p} /><line x1="3" y1="9" x2="21" y2="9" {...p} /><rect x="6" y="12" width="4" height="5" {...f} /><rect x="12" y="12" width="6" height="2" {...f} /></>); break;
    case "shield": g = (<><polygon points="12,3 20,6 20,12 12,21 4,12 4,6" {...p} /><polyline points="8.5,12 11,14.5 15.5,9.5" {...p} /></>); break;
    case "code": g = (<><polyline points="8,7 3,12 8,17" {...p} /><polyline points="16,7 21,12 16,17" {...p} /><line x1="14" y1="5" x2="10" y2="19" {...p} /></>); break;
    case "arrows": g = (<><polyline points="4,8 20,8 16,4" {...p} /><polyline points="20,16 4,16 8,20" {...p} /></>); break;
    case "target": g = (<><polygon points="12,3 21,12 12,21 3,12" {...p} /><rect x="10" y="10" width="4" height="4" {...f} /></>); break;
    case "layers": g = (<><polygon points="12,3 22,8 12,13 2,8" {...p} /><polyline points="2,12.5 12,17.5 22,12.5" {...p} /><polyline points="2,17 12,22 22,17" {...p} /></>); break;
    case "gift": g = (<><rect x="4" y="10" width="16" height="10" {...p} /><rect x="3" y="7" width="18" height="3" {...p} /><line x1="12" y1="7" x2="12" y2="20" {...p} /><polyline points="12,7 8,3.5 8,7" {...p} /><polyline points="12,7 16,3.5 16,7" {...p} /></>); break;
    case "chart": g = (<><polyline points="3,18 9,12 13,15 21,6" {...p} /><polyline points="16,6 21,6 21,11" {...p} /></>); break;
    default: g = <polygon points="12,3 19,12 12,21 5,12" {...f} />;
  }
  return (
    <span style={{ flex: `0 0 ${size}px`, width: size, height: size, background: "#0A0A0B", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width={Math.round(size * 0.58)} height={Math.round(size * 0.58)} viewBox="0 0 24 24" aria-hidden="true">{g}</svg>
    </span>
  );
}
