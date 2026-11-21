import Link from "next/link";
import { Tile } from "@/components/Tile";
import { commissionLabel, type Program } from "@/lib/programs";

export function AiRow({ p }: { p: Program }) {
  return (
    <Link href={`/directory/${p.slug}`} className="row cut">
      <Tile type={p.primary_type} domain={p.domain} />
      <div style={{ flex: "1 1 0", minWidth: 0 }}>
        <div style={{ fontFamily: "'Michroma',sans-serif", fontWeight: 400, fontSize: 19, letterSpacing: 0, lineHeight: 1.2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {p.company}{p.product_note ? <span style={{ fontSize: 13, fontWeight: 300, color: "#55565B", marginLeft: 10 }}>{p.product_note}</span> : null}
        </div>
        <div style={{ marginTop: 8, display: "flex", gap: 8, alignItems: "center" }}>
          <span className="pill">{p.primary_type}</span>
          <span style={{ color: "#55565B", fontSize: 14, whiteSpace: "nowrap" }}>{p.region}</span>
        </div>
        <div className="desc">{p.description}</div>
        <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
          <span className="tag">{p.product_category}</span>
          {p.commission_models.some((c) => c !== "Not published") && <span className="tag">{commissionLabel(p)}</span>}
        </div>
        <div className="more">Read full details <span aria-hidden="true">→</span></div>
      </div>
      <div className="arrow">→</div>
    </Link>
  );
}
