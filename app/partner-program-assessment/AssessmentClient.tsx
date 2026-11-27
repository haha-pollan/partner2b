"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ACTIVE, AGE, AREAS, ANSWERS, MAX_SYMPTOMS, OWNER, SYMPTOMS, TYPES, toQuery } from "@/lib/assessment/model";
import { track } from "@/lib/track";
import { OPEN_EVENT } from "./StartLink";

const btn: React.CSSProperties = { background: "#A8FF5C", color: "#0A0A0B", fontFamily: "'IBM Plex Sans',sans-serif", fontWeight: 400, fontSize: 19, padding: "18px 34px", border: 0, cursor: "pointer", display: "inline-block", clipPath: "polygon(0 0,100% 0,100% calc(100% - 12px),calc(100% - 12px) 100%,0 100%)" };
const plain: React.CSSProperties = { background: "transparent", border: 0, color: "inherit", cursor: "pointer", font: "inherit", fontSize: 17, textDecoration: "underline", padding: 0 };
const chip = (on: boolean): React.CSSProperties => ({ font: "inherit", fontSize: 17, padding: "12px 20px", borderRadius: 999, border: "2px solid #0A0A0B", background: on ? "#A8FF5C" : "#fff", color: "#0A0A0B", cursor: "pointer" });
const opt = (on: boolean): React.CSSProperties => ({ font: "inherit", fontSize: 16, padding: "11px 17px", borderRadius: 10, border: 0, background: on ? "#0A0A0B" : "#ECECEE", color: on ? "#fff" : "#0A0A0B", cursor: "pointer" });
const michroma: React.CSSProperties = { fontFamily: "'Michroma',sans-serif", fontWeight: 400, WebkitTextStroke: "1.2px currentColor" };

const STATEMENTS = AREAS.flatMap((a) => a.statements.map((s) => ({ area: a.name, text: s })));

function Flow() {
  const router = useRouter();
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [age, setAge] = useState<number | null>(null);
  const [owner, setOwner] = useState<number | null>(null);
  const [types, setTypes] = useState<string[]>([]);
  const [active, setActive] = useState<number | null>(null);
  const [step, setStep] = useState(-1); // -1 is the start form, 0 to 15 are the statements
  const [answers, setAnswers] = useState<(number | null)[]>(Array(16).fill(null));
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const opened = useRef(false);
  const top = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (opened.current) return;
    opened.current = true;
    track("partner_program_assessment_start_clicked");
  }, []);
  useEffect(() => { if (step >= 0) top.current?.scrollIntoView({ block: "start" }); }, [step]);

  function pickSymptom(k: string) {
    setSymptoms((cur) => {
      if (k === "unsure") return cur.includes("unsure") ? [] : ["unsure"];
      const without = cur.filter((x) => x !== "unsure");
      if (without.includes(k)) return without.filter((x) => x !== k);
      return without.length >= MAX_SYMPTOMS ? [...without.slice(1), k] : [...without, k];
    });
  }
  const pickType = (k: string) => setTypes((cur) => (cur.includes(k) ? cur.filter((x) => x !== k) : [...cur, k]));

  function begin() {
    if (symptoms.length === 0) { setErr("Please pick what is not working, or choose I am not sure."); return; }
    if (age === null || owner === null || active === null || types.length === 0) { setErr("Please answer the four quick questions."); return; }
    setErr(""); setStep(0);
    track("partner_program_assessment_started", { problems: symptoms.length, age: AGE[age], active: ACTIVE[active] });
  }
  function answer(v: number) { setAnswers((cur) => cur.map((x, i) => (i === step ? v : x))); }
  function next() {
    if (answers[step] === null) return;
    if (step < 15) { setStep(step + 1); return; }
    setBusy(true);
    router.push("/partner-program-assessment/results?" + toQuery({ symptoms, age: age ?? 0, owner: owner ?? 0, types, active: active ?? 0, answers: answers.map((x) => x ?? 0) }));
  }

  // ---------- Statement steps ----------
  if (step >= 0) {
    const s = STATEMENTS[step];
    const pct = Math.round((step / 16) * 100);
    return (
      <div ref={top} style={{ scrollMarginTop: 24, display: "flex", gap: 28, flexWrap: "wrap", alignItems: "stretch" }}>
        <div className="cut" style={{ flex: "1 1 600px", minWidth: 0, background: "#fff", color: "#0A0A0B", padding: "40px 44px 48px", ["--c" as string]: "28px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <span style={{ background: "#A8FF5C", borderRadius: 999, padding: "6px 16px", fontSize: 15, whiteSpace: "nowrap" }}>Statement {step + 1} of 16</span>
            <div style={{ flex: 1, height: 12, background: "#ECECEE" }} aria-hidden="true"><div style={{ width: `${pct}%`, height: "100%", background: "#A8FF5C" }} /></div>
            <span style={{ ...michroma, fontSize: 16 }}>{pct}%</span>
          </div>
          <div style={{ marginTop: 28 }}><span style={{ display: "inline-block", border: "2px solid #0A0A0B", borderRadius: 999, padding: "4px 14px", fontSize: 15 }}>{s.area}</span></div>
          <h2 style={{ ...michroma, fontSize: "clamp(22px,2.6vw,32px)", lineHeight: 1.35, marginTop: 22, WebkitTextStroke: "1px currentColor" }}>{s.text}</h2>
          <p style={{ margin: "18px 0 0", fontSize: 17, lineHeight: 1.5, color: "#3A3B40" }}>Answer for how it is today, not how you plan it</p>
          <div role="radiogroup" aria-label={s.text} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))", gap: 14, marginTop: 28 }}>
            {ANSWERS.map((a) => {
              const on = answers[step] === a.v;
              return (
                <button key={a.label} type="button" role="radio" aria-checked={on} onClick={() => answer(a.v)}
                  style={{ font: "inherit", textAlign: "left", border: 0, cursor: "pointer", padding: "20px 20px 22px", background: on ? "#A8FF5C" : "#ECECEE", color: "#0A0A0B", clipPath: "polygon(0 0,100% 0,100% calc(100% - 14px),calc(100% - 14px) 100%,0 100%)" }}>
                  <span style={{ display: "block", fontSize: 21 }}>{a.label}</span>
                  <span style={{ display: "block", marginTop: 4, fontSize: 15, color: "#3A3B40" }}>{a.sub}</span>
                </button>
              );
            })}
          </div>
          <div style={{ marginTop: 32, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
            <button type="button" style={plain} onClick={() => setStep(step - 1)}>{step === 0 ? "Back to the start" : "Back"}</button>
            <button type="button" onClick={next} disabled={answers[step] === null || busy} style={{ ...btn, opacity: answers[step] === null || busy ? 0.5 : 1 }}>{step === 15 ? (busy ? "One moment" : "See my result") : "Next statement"}</button>
          </div>
        </div>
        <div style={{ flex: "0 0 300px", display: "flex", flexDirection: "column", gap: 20 }}>
          <div className="cut" style={{ background: "#FFFFFF", color: "#0A0A0B", padding: "26px 26px 32px", ["--c" as string]: "24px" }}>
            <div style={{ ...michroma, fontSize: 18 }}>Private</div>
            <p style={{ margin: "10px 0 0", fontSize: 16, lineHeight: 1.5 }}>No company name. Your answers are never published or shared with other companies</p>
          </div>
        </div>
      </div>
    );
  }

  // ---------- Start form ----------
  return (
    <div className="cut" style={{ background: "#fff", color: "#0A0A0B", padding: "44px 48px 54px", maxWidth: 1100, margin: "0 auto", ["--c" as string]: "28px" }}>
      <span style={{ display: "inline-block", border: "2px solid #0A0A0B", borderRadius: 999, padding: "4px 14px", fontSize: 15 }}>Step 1 of 3</span>
      <h2 style={{ ...michroma, fontSize: 28, marginTop: 20, WebkitTextStroke: "1px currentColor" }}>What is not working today?</h2>
      <p style={{ margin: "12px 0 0", fontSize: 17, color: "#3A3B40" }}>Pick up to two. We use it to weigh your answers</p>
      <div role="group" aria-label="What is not working" style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 24 }}>
        {SYMPTOMS.map((s) => <button key={s.key} type="button" aria-pressed={symptoms.includes(s.key)} onClick={() => pickSymptom(s.key)} style={chip(symptoms.includes(s.key))}>{s.label}</button>)}
      </div>
      <div style={{ height: 2, background: "#ECECEE", margin: "36px 0 30px" }} />
      <h2 style={{ ...michroma, fontSize: 22, WebkitTextStroke: "1px currentColor" }}>A bit about your program</h2>
      <p style={{ margin: "10px 0 0", fontSize: 17, color: "#3A3B40" }}>Four quick questions. They shape the notes in your result, not your score</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(380px,1fr))", gap: "28px 48px", marginTop: 26 }}>
        <fieldset style={{ border: 0, margin: 0, padding: 0 }}><legend style={{ fontSize: 17, marginBottom: 12 }}>How old is the program?</legend><div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>{AGE.map((l, i) => <button key={l} type="button" aria-pressed={age === i} onClick={() => setAge(i)} style={opt(age === i)}>{l}</button>)}</div></fieldset>
        <fieldset style={{ border: 0, margin: 0, padding: 0 }}><legend style={{ fontSize: 17, marginBottom: 12 }}>Who runs it?</legend><div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>{OWNER.map((l, i) => <button key={l} type="button" aria-pressed={owner === i} onClick={() => setOwner(i)} style={opt(owner === i)}>{l}</button>)}</div></fieldset>
        <fieldset style={{ border: 0, margin: 0, padding: 0 }}><legend style={{ fontSize: 17, marginBottom: 12 }}>Which partner types?</legend><div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>{TYPES.map((t) => <button key={t.key} type="button" aria-pressed={types.includes(t.key)} onClick={() => pickType(t.key)} style={opt(types.includes(t.key))}>{t.label}</button>)}</div></fieldset>
        <fieldset style={{ border: 0, margin: 0, padding: 0 }}><legend style={{ fontSize: 17, marginBottom: 12 }}>How many active partners?</legend><div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>{ACTIVE.map((l, i) => <button key={l} type="button" aria-pressed={active === i} onClick={() => setActive(i)} style={opt(active === i)}>{l}</button>)}</div></fieldset>
      </div>
      {err && <div role="alert" style={{ marginTop: 24, fontSize: 16 }}>{err}</div>}
      <div style={{ marginTop: 34, display: "flex", alignItems: "center", gap: 26, flexWrap: "wrap" }}>
        <button type="button" onClick={begin} style={btn}>Start the assessment</button>
        <span style={{ fontSize: 16, color: "#3A3B40" }}>Your answers stay private. We never ask for a company name</span>
      </div>
    </div>
  );
}

// The public page shows the questions only after a click on a Start button (or a link ending in #start).
export function AssessmentClient() {
  const [open, setOpen] = useState(false);
  const seen = useRef(false);
  const box = useRef<HTMLDivElement>(null);
  const justOpened = useRef(false);

  useEffect(() => {
    if (!seen.current) { seen.current = true; track("partner_program_assessment_opened"); }
    const show = () => { justOpened.current = true; setOpen(true); };
    if (window.location.hash === "#start") show();
    window.addEventListener(OPEN_EVENT, show);
    return () => window.removeEventListener(OPEN_EVENT, show);
  }, []);
  useEffect(() => {
    if (open && justOpened.current) { justOpened.current = false; box.current?.scrollIntoView({ block: "start", behavior: "smooth" }); }
  }, [open]);

  if (!open) return null;
  return (
    <div id="start" ref={box} className="wrap" style={{ padding: "60px var(--margin) clamp(36px,9vw,120px)", scrollMarginTop: 0 }}>
      <Flow />
    </div>
  );
}
