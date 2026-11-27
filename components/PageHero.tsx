import type { ReactNode } from "react";
import { Nav } from "@/components/Nav";
import { Toby } from "@/components/Toby";

export type HeroLayout = "toby-split" | "toby-center" | "toby-strap" | "center-tiles" | "cards" | "form" | "figure";

// One hero for the whole site. Same style everywhere (two-tone one-line title, plain text, lime buttons);
// only the layout changes. `buttons` holds the main (btn btn-p) and optional secondary (btn btn-o) button.
export function PageHero({ layout, title, accent, sub, buttons, slot, words }: { layout: HeroLayout; title: string; accent: string; sub: string; buttons: ReactNode; slot?: ReactNode; words?: string[] }) {
  const strap = words ? Array.from({ length: 3 }).map(() => words.map((t) => `${t} ◆ `).join("")).join("") : "";
  const h1 = <h1 className="phtitle">{title} <span style={{ color: "#A8FF5C" }}>{accent}</span></h1>;
  const text = (<><p className="phsub">{sub}</p><div className="phbtns">{buttons}</div></>);
  const toby = (h: number, cls = "") => <div className={`phtoby ${cls}`} aria-hidden="true"><Toby height={h} rows={38} glasses style={{ width: "100%", height: "100%" }} /></div>;
  const strapEl = words ? <div className="phstrapwrap" aria-hidden="true"><div className="phstrap">{strap}</div></div> : null;

  let body: ReactNode;
  if (layout === "toby-split") {
    body = (<div className="wrap phero phsplit"><div className="phleft">{h1}{text}</div>{toby(520, "phbig")}</div>);
  } else if (layout === "toby-center") {
    body = (<div className="wrap phero phcenter">{toby(300, "phsmall")}{h1}{text}</div>);
  } else if (layout === "toby-strap") {
    body = (<><div className="wrap phero phwide">{h1}<div className="phrow"><div>{text}</div>{toby(300, "phrise")}</div></div>{strapEl}</>);
  } else if (layout === "center-tiles") {
    body = (<div className="wrap phero phcenter">{h1}{text}{slot ? <div className="phtiles">{slot}</div> : null}</div>);
  } else if (layout === "figure") {
    body = (<><div className="wrap phero phwide">{h1}<div className="phrow"><div>{text}</div>{slot}</div></div>{strapEl}</>);
  } else {
    body = (<div className="wrap phero phsplit"><div className="phleft">{h1}{text}</div><div className="phslot">{slot}</div></div>);
  }
  return (<div className="hero"><Nav />{body}</div>);
}
