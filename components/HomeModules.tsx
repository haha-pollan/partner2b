import Link from "next/link";
import Image from "next/image";
import { builderIsNew } from "@/lib/launch";

const STEPS = [
  { t: "Answer a few questions", d: "Your product, customers and goals" },
  { t: "Get your program shaped", d: "Partner types, tiers and modelled earnings" },
  { t: "Download your PDF", d: "With an ecosystem map and a 90 day plan" },
];

// Two intro modules that sit right after the home hero: what the directory is, and what the builder is.
export function HomeModules({ programs, aiPrograms, types }: { programs: number; aiPrograms: number; types: number }) {
  const stats = [
    { n: programs, l: "partner programs", cls: "hmstat0" },
    { n: aiPrograms, l: "AI partner programs", cls: "hmstat1" },
    { n: types, l: "program types", cls: "hmstat2" },
  ];
  return (
    <>
      <section className="hmdir" aria-labelledby="hm-dir">
        <div className="wrap hmdirin">
          <div className="hmdirtext">
            <span className="hmkick">The directory</span>
            <h2 id="hm-dir">Every partner program in one place</h2>
            <p>Partner2B is a free directory of B2B partner programs. Each listing shows commissions, tiers and requirements and links to the official source, so you can compare programs before you apply</p>
            <Link href="/directory" className="hmbtn hmbtndark">Browse the directory</Link>
          </div>
          <div className="hmstats">
            {stats.map((s) => (
              <div key={s.l} className={`hmstat ${s.cls}`}>
                <span className="hmnum">{s.n}</span>
                <span className="hmlab">{s.l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="hmbld" aria-labelledby="hm-bld">
        <div className="wrap">
          <div className="hmbldbox cut">
            <div className="hmbldtext">
              <span className="hmkick hmkickl">Program builder{builderIsNew() && <span className="hmnew" suppressHydrationWarning>New</span>}</span>
              <h2 id="hm-bld">Build your own partner program</h2>
              <p>Answer a few questions about your company and get a strategy PDF in your own branding</p>
              <ol className="hmsteps">
                {STEPS.map((s, i) => (
                  <li key={s.t}>
                    <span className="hmstepn">{i + 1}</span>
                    <span><b>{s.t}</b><i>{s.d}</i></span>
                  </li>
                ))}
              </ol>
              <Link href="/program-builder" className="hmbtn hmbtnlime">Open the program builder</Link>
            </div>
            <div className="hmpages" aria-hidden="true">
              <Image src="/builder/sample-ecosystem.jpg" alt="" width={728} height={1029} sizes="260px" className="hmpg hmpg0" />
              <Image src="/builder/sample-cover.jpg" alt="" width={728} height={1029} sizes="260px" className="hmpg hmpg1" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
