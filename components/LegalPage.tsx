import { Nav } from "./Nav";
import { Footer } from "./Footer";
import { LEGAL, type Section } from "@/lib/legal";

export function LegalPage({ title, intro, sections }: { title: string; intro: string; sections: Section[] }) {
  return (
    <div style={{ background: "#fff" }}>
      <div style={{ background: "#fff url(/mesh-program.svg) top / 100% 220% no-repeat", overflow: "hidden" }}>
        <Nav />
        <div className="wrap" style={{ padding: "40px 40px 64px" }}>
          <h1 style={{ fontWeight: 400, fontSize: 43, lineHeight: 1, letterSpacing: 0, color: "#0A0A0B" }}>{title}</h1>
          <p style={{ margin: "22px 0 0", maxWidth: 720, fontSize: 20, lineHeight: 1.5, color: "#1C1D20" }}>{intro}</p>
          <p style={{ margin: "14px 0 0", fontSize: 15, color: "#2A2B2F", fontWeight: 600 }}>Last updated {LEGAL.updated}</p>
        </div>
      </div>
      <main className="wrap" style={{ padding: "64px 40px 96px" }}>
        <div style={{ maxWidth: 760 }}>
          {sections.map((s, i) => (
            <section key={s.h} style={{ marginTop: i === 0 ? 0 : 44 }}>
              <h2 style={{ fontWeight: 400, fontSize: 17, letterSpacing: 0 }}>
                {i + 1}. {s.h}
              </h2>
              {s.p.map((t, j) => (
                <p key={j} style={{ margin: "14px 0 0", fontSize: 18, lineHeight: 1.65, color: "#2A2B2F" }}>
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
