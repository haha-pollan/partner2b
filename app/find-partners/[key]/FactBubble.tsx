"use client";
import { useEffect, useState } from "react";

// One fact at a time in Toby's speech bubble, rotating. The number sits in a lime chip.
const FACTS = [
  { pre: "Cool, you are growing via partners. Deals with a partner in them are ", n: "53%", post: " more likely to close." },
  { pre: "Finding the right partners is the hard part: ", n: "37%", post: " of partnership leaders call it a top challenge." },
  { pre: "Speed matters. Partners with a first deal inside 90 days are ", n: "3 to 4x", post: " more likely to still be active after a year." },
];
const chip = { background: "#A8FF5C", color: "#0A0A0B", padding: "0 8px", whiteSpace: "nowrap" as const };

export default function FactBubble({ total }: { total: string }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((x) => (x + 1) % FACTS.length), 7000);
    return () => clearInterval(t);
  }, []);
  const f = FACTS[i];
  return (
    <p className="bubble herosub" style={{ marginTop: 44, minHeight: 130 }}>
      {f.pre}<span style={chip}>{f.n}</span>{f.post} I found <span style={chip}>{total}</span> companies for you today.
    </p>
  );
}
