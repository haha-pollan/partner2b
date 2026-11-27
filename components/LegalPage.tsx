import { PageHero } from "./PageHero";
import { Footer } from "./Footer";
import { LEGAL, type Section } from "@/lib/legal";

export function LegalPage({ title, intro, sections }: { title: string; intro: string; sections: Section[] }) {
  return (
    <div>
      <PageHero layout="banner" title={title} accent="" sub={intro} extra={<p style={{ margin: "14px 0 0", fontSize: 15, color: "#B9BABD", fontWeight: 400 }}>Last updated {LEGAL.updated}</p>} />
      <main className="wrap" style={{ padding: "clamp(36px,9vw,64px) var(--margin) clamp(36px,9vw,96px)" }}>
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
