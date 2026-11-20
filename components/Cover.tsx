import { buildCover } from "@/lib/pixelCover";

export function Cover({ slug, title, i = 0 }: { slug: string; title: string; i?: number }) {
  const c = buildCover(slug, title, i);
  const id = "cv-" + slug.replace(/[^a-z0-9]/gi, "").slice(0, 24);
  const tw = Math.round(c.tag.length * 6.6 + 18);
  return (
    <svg viewBox="0 0 320 180" width="100%" role="img" aria-label={`${c.tag} cover`} style={{ display: "block", height: "auto" }}>
      <defs><clipPath id={id}><path d="M0 0H320V144L284 180H0Z" /></clipPath></defs>
      <g clipPath={`url(#${id})`}>
        <rect width="320" height="180" fill="#0A0A0B" />
        {c.paths.map((p) => <path key={p.fill} d={p.d} fill={p.fill} />)}
        <rect x="14.5" y="13.5" width={tw} height="20" rx="4" fill="#0A0A0B" stroke={c.accent} />
        <text x={14.5 + tw / 2} y="27.5" textAnchor="middle" fill="#ECECEE" fontSize="11" fontWeight="500" fontFamily="Inter,system-ui,sans-serif">{c.tag}</text>
      </g>
    </svg>
  );
}
