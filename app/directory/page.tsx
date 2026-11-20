import Link from "next/link";
import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Tile } from "@/components/Tile";
import { AutoForm } from "./AutoForm";
import CountUp from "@/components/CountUp";
import { getPrograms, commissionLabel, type Program } from "@/lib/programs";

export const revalidate = 600;
export const metadata: Metadata = {
  title: "Partner2B Directory: browse B2B partner programs",
  description: "Search B2B partner programs, reseller programs, referral programs and MSP programs. Filter by type, product category, commission model, features and region.",
};

const TYPES = ["Reseller", "Referral", "Technology", "Services", "MSP", "OEM or white label"];
const COMMISSION = ["Revenue share", "Referral fee", "Discount on resale", "Not published"];
const FEATURES = ["Partner portal", "Deal registration", "Co-selling", "Co-marketing funds", "Training", "Marketplace listing"];
const REGIONS = ["Global", "Europe", "North America", "Latin America", "Asia Pacific", "India", "Africa"];
const PAGE = 20;

type SP = Record<string, string | string[] | undefined>;
const arr = (v: string | string[] | undefined) => (v === undefined ? [] : Array.isArray(v) ? v : [v]);

function matches(p: Program, f: { q: string; type: string[]; cat: string[]; com: string[]; feat: string[]; region: string }, skip?: string) {
  if (f.q) {
    const hay = `${p.company} ${p.product_note ?? ""} ${p.description ?? ""} ${p.product_category}`.toLowerCase();
    if (!hay.includes(f.q.toLowerCase())) return false;
  }
  if (skip !== "type" && f.type.length && !f.type.some((t) => p.program_types.includes(t))) return false;
  if (skip !== "cat" && f.cat.length && !f.cat.includes(p.product_category)) return false;
  if (skip !== "com" && f.com.length && !f.com.some((c) => p.commission_models.includes(c))) return false;
  if (skip !== "feat" && f.feat.length && !f.feat.every((x) => p.feature_tags.includes(x))) return false;
  if (skip !== "region" && f.region && p.region !== f.region) return false;
  return true;
}

export default async function DirectoryPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const all = await getPrograms();
  const f = {
    q: (arr(sp.q)[0] ?? "").trim(),
    type: arr(sp.type),
    cat: arr(sp.cat),
    com: arr(sp.com),
    feat: arr(sp.feat),
    region: arr(sp.region)[0] ?? "",
  };
  const page = Math.max(1, parseInt(arr(sp.page)[0] ?? "1", 10) || 1);
  const results = all.filter((p) => matches(p, f));
  const pages = Math.max(1, Math.ceil(results.length / PAGE));
  const cur = Math.min(page, pages);
  const shown = results.slice((cur - 1) * PAGE, cur * PAGE);

  const categories = Array.from(new Set(all.map((p) => p.product_category))).sort();
  const count = (key: string, test: (p: Program) => boolean) => all.filter((p) => matches(p, f, key) && test(p)).length;

  const params = (over: Record<string, string | string[] | undefined>) => {
    const u = new URLSearchParams();
    const base: Record<string, string | string[]> = { q: f.q, type: f.type, cat: f.cat, com: f.com, feat: f.feat, region: f.region };
    for (const [k, v] of Object.entries({ ...base, ...over })) {
      if (v === undefined || v === "") continue;
      for (const x of Array.isArray(v) ? v : [v]) u.append(k, x);
    }
    const s = u.toString();
    return s ? `/directory?${s}` : "/directory";
  };

  const chips: { label: string; href: string }[] = [
    ...(f.q ? [{ label: `"${f.q}"`, href: params({ q: "" }) }] : []),
    ...f.type.map((x) => ({ label: x, href: params({ type: f.type.filter((y) => y !== x) }) })),
    ...f.cat.map((x) => ({ label: x, href: params({ cat: f.cat.filter((y) => y !== x) }) })),
    ...f.com.map((x) => ({ label: x, href: params({ com: f.com.filter((y) => y !== x) }) })),
    ...f.feat.map((x) => ({ label: x, href: params({ feat: f.feat.filter((y) => y !== x) }) })),
    ...(f.region ? [{ label: f.region, href: params({ region: "" }) }] : []),
  ];

  const group = (title: string, name: string, items: string[], selected: string[], test: (p: Program, v: string) => boolean) => (
    <details open>
      <summary>{title}</summary>
      {items.map((v) => (
        <label key={v}>
          <span className="l">
            <input type="checkbox" name={name} value={v} defaultChecked={selected.includes(v)} />
            {v}
          </span>
          <span className="cnt">{count(name, (p) => test(p, v))}</span>
        </label>
      ))}
    </details>
  );

  const pageList: (number | "gap")[] = [];
  for (let i = 1; i <= pages; i++) {
    if (i === 1 || i === pages || Math.abs(i - cur) <= 1) pageList.push(i);
    else if (pageList[pageList.length - 1] !== "gap") pageList.push("gap");
  }

  return (
    <div style={{ background: "#fff url(/mesh-directory.svg) top / 100% 100% no-repeat", overflow: "hidden" }}>
      <div style={{ position: "relative", overflow: "hidden", color: "#0A0A0B" }}>
        <div className="limepanel" />
        <Nav />
        <div className="wrap" style={{ padding: "24px 40px 96px", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 40, flexWrap: "wrap" }}>
          <div style={{ flex: "0 0 auto", maxWidth: "100%" }}>
            <h1 className="h1big"><span style={{ display: "block" }}>Browse partner</span><span style={{ display: "block" }}>programs</span></h1>
            <p style={{ margin: "24px 0 0", maxWidth: 720, fontSize: 21, lineHeight: 1.5, fontWeight: 300 }}>
              {all.length} public B2B programs. Every listing links to its official page
            </p>
            <form method="get" action="/directory" className="search" role="search">
              <label htmlFor="q" style={{ position: "absolute", left: -9999 }}>Search programs or companies</label>
              <input id="q" name="q" type="search" defaultValue={f.q} placeholder="Search programs or companies" />
              <button type="submit">Search</button>
            </form>
          </div>
          <div className="cut" style={{ flex: "0 0 360px", margin: "40px 40px 0 0", transform: "rotate(-4deg)", background: "#0A0A0B", color: "#ECECEE", padding: "32px 34px" }}>
            <div style={{ fontFamily: "'Michroma',sans-serif", fontWeight: 400, fontSize: 56, letterSpacing: 0, lineHeight: 1, color: "#A8FF5C" }}><CountUp to={all.length} /></div>
            <div style={{ marginTop: 10, fontSize: 19, lineHeight: 1.4 }}>programs, free to browse</div>
          </div>
        </div>
      </div>

      <div style={{ position: "relative", color: "#0A0A0B", padding: "96px 0 112px" }}>
        <div className="wrap" style={{ display: "flex", gap: 32, alignItems: "flex-start", flexWrap: "wrap" }}>
          <aside className="side cut">
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 18 }}>
              <div style={{ fontFamily: "'Michroma',sans-serif", fontWeight: 400, fontSize: 22, letterSpacing: 0 }}>Filters</div>
              <Link href="/directory" style={{ fontSize: 15, fontWeight: 400, color: "#A8FF5C" }}>Clear all</Link>
            </div>
            <AutoForm q={f.q}>
              {group("Program type", "type", TYPES, f.type, (p, v) => p.program_types.includes(v))}
              {group("Product category", "cat", categories, f.cat, (p, v) => p.product_category === v)}
              {group("Commission model", "com", COMMISSION, f.com, (p, v) => p.commission_models.includes(v))}
              {group("Program features", "feat", FEATURES, f.feat, (p, v) => p.feature_tags.includes(v))}
              <details open>
                <summary>Region</summary>
                <select name="region" defaultValue={f.region}>
                  <option value="">All regions</option>
                  {REGIONS.map((r) => (<option key={r} value={r}>{r}</option>))}
                </select>
              </details>
            </AutoForm>
          </aside>

          <div style={{ flex: "1 1 600px", minWidth: 0 }}>
            {chips.length > 0 && (
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", marginBottom: 20 }}>
                {chips.map((c) => (<Link key={c.label} href={c.href} className="chip">{c.label}<span style={{ color: "#ECECEE" }}>×</span></Link>))}
                <Link href="/directory" style={{ fontSize: 15, fontWeight: 500, textDecoration: "underline" }}>Clear all</Link>
              </div>
            )}
            <div style={{ marginBottom: 20, fontSize: 18, fontWeight: 400 }}>
              {results.length === 0 ? "No programs match these filters" : `Showing ${(cur - 1) * PAGE + 1} to ${(cur - 1) * PAGE + shown.length} of ${results.length} programs`}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {shown.map((p) => (
                <Link key={p.id} href={`/directory/${p.slug}`} className="row cut">
                  <Tile type={p.primary_type} domain={p.domain} />
                  <div style={{ flex: "1 1 0", minWidth: 0 }}>
                    <div style={{ fontFamily: "'Michroma',sans-serif", fontWeight: 400, fontSize: 19, letterSpacing: 0, lineHeight: 1.2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {p.company}{p.product_note ? <span style={{ fontSize: 13, fontWeight: 300, color: "#55565B", letterSpacing: 0, marginLeft: 10 }}>{p.product_note}</span> : null}
                    </div>
                    <div style={{ marginTop: 8, display: "flex", gap: 8, alignItems: "center" }}>
                      <span className="pill">{p.primary_type}</span>
                      <span style={{ color: "#55565B", fontSize: 14, fontWeight: 400, whiteSpace: "nowrap" }}>{p.region}</span>
                    </div>
                    <div className="desc">{p.description}</div>
                    <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <span className="tag">{p.product_category}</span>
                      {p.commission_models.some((c) => c !== "Not published") && <span className="tag">{commissionLabel(p)}</span>}
                      {p.feature_tags.find((x) => FEATURES.includes(x)) && <span className="tag">{p.feature_tags.find((x) => FEATURES.includes(x))}</span>}
                    </div>
                    <div className="more">Read full details <span aria-hidden="true">→</span></div>
                  </div>
                  <div className="rowmeta" style={{ flex: "0 0 170px", fontSize: 14, color: "#55565B", fontWeight: 300, lineHeight: 1.5 }}>Program types<div style={{ fontSize: 17, color: "#0A0A0B", fontWeight: 400 }}>{p.program_types.slice(0, 2).join(", ")}{p.program_types.length > 2 ? ` +${p.program_types.length - 2}` : ""}</div></div>
                  <div className="rowmeta" style={{ flex: "0 0 110px", fontSize: 14, color: "#55565B", fontWeight: 300, lineHeight: 1.5 }}>Partner tiers<div style={{ fontSize: 17, color: "#0A0A0B", fontWeight: 400 }}>{p.tiers.length > 0 ? `${p.tiers.length} ${p.tiers.length === 1 ? "tier" : "tiers"}` : "Not listed"}</div></div>
                  <div className="arrow">→</div>
                </Link>
              ))}
            </div>
            {pages > 1 && (
              <div style={{ display: "flex", gap: 10, marginTop: 32, alignItems: "center", flexWrap: "wrap" }}>
                {pageList.map((n, i) =>
                  n === "gap" ? <span key={`g${i}`} className="pg">…</span> : (
                    <Link key={n} href={params({ page: n === 1 ? "" : String(n) })} className={n === cur ? "pg on" : "pg"}>{n}</Link>
                  ),
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
