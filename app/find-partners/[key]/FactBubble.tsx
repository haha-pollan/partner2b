"use client";
import { useEffect, useState } from "react";

// One fact in Toby's speech bubble. The fact changes per visitor: every visit on the same
// browser shows the next one in the list (the first visit starts at a random one). It does not
// rotate while the page is open. The number sits in a lime chip.
const FACTS = [
  { pre: "Cool, you are growing via partners. Deals with a partner in them are ", n: "53%", post: " more likely to close." },
  { pre: "Finding the right partners is the hard part: ", n: "37%", post: " of partnership leaders call it a top challenge." },
  { pre: "Speed matters. Partners with a first deal inside 90 days are ", n: "3 to 4x", post: " more likely to still be active after a year." },
];
const KEY = "p2b_fact_seen";
const chip = { background: "#A8FF5C", color: "#0A0A0B", padding: "0 8px", whiteSpace: "nowrap" as const };

export default function FactBubble({ total }: { total: string }) {
  const [i, setI] = useState<number | null>(null);
  useEffect(() => {
    let n = Math.floor(Math.random() * FACTS.length);
    try {
      const prev = parseInt(localStorage.getItem(KEY) ?? "", 10);
      if (Number.isFinite(prev)) n = prev + 1;
      localStorage.setItem(KEY, String(n % FACTS.length));
    } catch { /* storage blocked: keep the random fact */ }
    setI(n % FACTS.length);
  }, []);
  const f = FACTS[i ?? 0];
  return (
    <p className="bubble herosub" style={{ marginTop: 120, maxWidth: 700, minHeight: 0, fontSize: 17, padding: "18px 26px", boxShadow: "6px 6px 0 #A8FF5C", visibility: i === null ? "hidden" : "visible" }}>
      {f.pre}<span style={chip}>{f.n}</span>{f.post} I found <span style={chip}>{total}</span> companies for you today.
    </p>
  );
}
