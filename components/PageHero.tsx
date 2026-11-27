import type { ReactNode } from "react";
import { Nav } from "@/components/Nav";
import { Toby } from "@/components/Toby";

export type HeroLayout = "poster" | "diagonal" | "banner" | "fan" | "toby-center" | "toby-strap" | "form";
export type HeroCompany = { name: string; description: string | null; subtype: string | null };

// One hero for the whole site. One style (two-tone one-line title, plain text, lime main button, bordered lime secondary);
// only the layout changes. `buttons` holds the main (btn btn-p) and optional secondary (btn btn-o) button.
export function PageHero({ layout, title, accent, sub, buttons, slot, words, companies }: { layout: HeroLayout; title: string; accent: string; sub: string; buttons: ReactNode; slot?: ReactNode; words?: string[]; companies?: HeroCompany[] }) {
  const strap = words ? Array.from({ length: 3 }).map(() => words.map((t) => `${t} ◆ `).join("")).join("") : "";
  const h1 = <h1 className="phtitle">{title} <span style={{ color: "#A8FF5C" }}>{accent}</span></h1>;
  const text = (<><p className="phsub">{sub}</p><div className="phbtns">{buttons}</div></>);
  const toby = (cls: string) => <div className={`phtoby ${cls}`} aria-hidden="true"><Toby height={520} rows={38} glasses style={{ width: "100%", height: "100%" }} /></div>;
  const strapEl = words ? <div className="phstrapwrap" aria-hidden="true"><div className="phstrap">{strap}</div></div> : null;

  let body: ReactNode;
  if (layout === "poster") {
    body = (
      <div className="wrap phero phposter">
        <h1 className="phtitle phhuge"><span style={{ display: "block" }}>{title}</span><span style={{ display: "block", color: "#A8FF5C" }}>{accent}</span></h1>
        <div className="phline" />
        <div className="phrow"><p className="phsub">{sub}</p><div className="phbtns">{buttons}</div></div>
      </div>
    );
  } else if (layout === "diagonal") {
    body = (
      <div className="phdiag">
        <div className="phwedge" aria-hidden="true" />
        {toby("phdiagtoby")}
        <div className="wrap phdiagtext"><h1 className="phtitle phmid">{title} <span style={{ color: "#A8FF5C" }}>{accent}</span></h1>{text}</div>
      </div>
    );
  } else if (layout === "banner") {
    body = (
      <div className="phero phbannerwrap">
        <div className="phband"><h1 className="phtitle">{title} {accent}</h1></div>
        <div className="wrap phcenter">{text}</div>
      </div>
    );
  } else if (layout === "fan") {
    const tones = [{ bg: "#2A2B30", fg: "#ECECEE", sub: "#B9BABD", tag: "#2A2B2F", tagfg: "#B9BABD", rot: -11, y: 26 }, { bg: "#ECECEE", fg: "#0A0A0B", sub: "#3A3B40", tag: "#0A0A0B", tagfg: "#A8FF5C", rot: -5.5, y: 8 }, { bg: "#A8FF5C", fg: "#0A0A0B", sub: "#1C1D20", tag: "#0A0A0B", tagfg: "#A8FF5C", rot: 0, y: 0 }, { bg: "#ECECEE", fg: "#0A0A0B", sub: "#3A3B40", tag: "#0A0A0B", tagfg: "#A8FF5C", rot: 5.5, y: 8 }, { bg: "#2A2B30", fg: "#ECECEE", sub: "#B9BABD", tag: "#2A2B2F", tagfg: "#B9BABD", rot: 11, y: 26 }];
    body = (
      <div className="phero phfanwrap">
        <div className="wrap phcenter">{h1}{text}</div>
        {companies && companies.length >= 5 ? (
          <div className="phfan" aria-hidden="true">
            {companies.slice(0, 5).map((c, i) => {
              const T = tones[i];
              return (
                <div key={c.name} className="cut phfancard" style={{ background: T.bg, color: T.fg, transform: `rotate(${T.rot}deg) translateY(${T.y}px)`, zIndex: i === 2 ? 3 : i === 1 || i === 3 ? 2 : 1 }}>
                  <h3 style={{ fontSize: 16, lineHeight: 1.3 }}>{c.name}</h3>
                  <span className="phfandesc" style={{ color: T.sub }}>{c.description}</span>
                  {c.subtype ? <span className="phfantag" style={{ background: T.tag, color: T.tagfg }}>{c.subtype}</span> : null}
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    );
  } else if (layout === "toby-center") {
    body = (<div className="wrap phero phcenter">{toby("phsmall")}{h1}{text}</div>);
  } else if (layout === "toby-strap") {
    body = (<><div className="wrap phero phwide phnobottom">{h1}<div className="phrow phriserow"><div className="phriseleft">{text}</div>{toby("phrise")}</div></div>{strapEl}</>);
  } else {
    body = (<div className="wrap phero phsplit"><div className="phleft">{h1}{text}</div><div className="phslot">{slot}</div></div>);
  }
  return (<div className="hero"><Nav />{body}</div>);
}
