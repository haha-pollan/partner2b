import type { ReactNode } from "react";
import { Nav } from "@/components/Nav";

// Calm typographic hero: label, two-tone title, plain subtitle, buttons, a faint ghost shape and one strap.
export function PageHero({ label, title, accent, sub, ghost, words, children }: { label: ReactNode; title: string; accent: string; sub: string; ghost: string; words: string[]; children: ReactNode }) {
  const line = Array.from({ length: 3 }).map(() => words.map((t) => `${t} ◆ `).join("")).join("");
  return (
    <div className="hero">
      <Nav />
      <div className="wrap phero">
        <div className="phtext">
          {label}
          <h1 className="phtitle">
            <span style={{ display: "block" }}>{title}</span>
            <span style={{ display: "block", color: "#A8FF5C" }}>{accent}</span>
          </h1>
          <p className="phsub">{sub}</p>
          <div className="phbtns">{children}</div>
        </div>
        <div className="phghost" aria-hidden="true">{ghost}</div>
      </div>
      <div className="phstrapwrap" aria-hidden="true"><div className="phstrap">{line}</div></div>
    </div>
  );
}
