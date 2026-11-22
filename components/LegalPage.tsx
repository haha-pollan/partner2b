import { Nav } from "./Nav";
import { Footer } from "./Footer";
import { LEGAL, type Section } from "@/lib/legal";

export function LegalPage({ title, intro, sections }: { title: string; intro: string; sections: Section[] }) {
  return (
    <div>
      <div style={{ overflow: "hidden" }}>
        <Nav />
        <div className="wrap" style={{ padding: "40px 40px clamp(36px,9vw,64px)" }}>
          <h1 className="h1big">{title}</h1>
          <p style={{ margin: "22px 0 0", maxWidth: 720, fontSize: 20, lineHeight: 1.5, color: "#ECECEE" }}>{intro}</p>
          <p style={{ margin: "14px 0 0", fontSize: 15, color: "#2A2B2F", fontWeight: 500 }}>Last updated {LEGAL.updated}</p>
        </div>
      </div>
      <main className="wrap" style={{ padding: "clamp(36px,9vw,64px) 40px clamp(36px,9vw,96px)" }}>
        <div style={{ maxWidth: 760 }}>
          {sections.map((s, i) => (
            <section key={s.h} style={{ marginTop: i === 0 ? 0 : 44 }}>
              <h2 style={{ fontWeight: 400, fontSize: 22, letterSpacing: 0 }}>
                {i + 1}. {s.h}
              </h2>
              {s.p.map((t, j) => (
                <p key={j} style={{ margin: "14px 0 0", fontSize: 18, lineHeight: 1.65, color: "#ECECEE" }}>
                  {t}
                </p>
              ))}
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
