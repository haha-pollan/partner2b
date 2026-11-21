import { MASTER_PROMPT } from "./prompt";
import type { Intake } from "./intake";
import { buildEconomics } from "./economics";

export const MODEL = process.env.OPENAI_MODEL || "gpt-4.1";

export function buildPrompt(intake: Intake, vertical: string, acvAverage: number) {
  const data = { ...intake, vertical, acvAverage };
  const pack = buildEconomics(intake, vertical, acvAverage);
  return MASTER_PROMPT.replace("{{intakeData}}", JSON.stringify(data, null, 2)).replace("{{economicsPack}}", JSON.stringify(pack, null, 2)).replace("{{previousOutputs}}", "(none)");
}

// Streams the completion so the connection stays alive, and returns the full text.
export async function generateStrategy(intake: Intake, vertical: string, acvAverage: number, signal: AbortSignal): Promise<string> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("not_configured");
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST", signal,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: MODEL, stream: true, max_completion_tokens: 16000,
      messages: [
        { role: "system", content: buildPrompt(intake, vertical, acvAverage) },
        { role: "user", content: "Write the partner program strategy now, following the output rules exactly." },
      ],
    }),
  });
  if (!res.ok || !res.body) {
    let code = "";
    try { const j = await res.json(); code = String(j?.error?.code || j?.error?.type || ""); } catch { /* no body */ }
    throw new Error(`openai_${res.status}${code ? "_" + code : ""}`);
  }
  const reader = res.body.getReader(); const dec = new TextDecoder();
  let buf = "", out = "";
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += dec.decode(value, { stream: true });
    let i: number;
    while ((i = buf.indexOf("\n")) >= 0) {
      const line = buf.slice(0, i).trim(); buf = buf.slice(i + 1);
      if (!line.startsWith("data:")) continue;
      const d = line.slice(5).trim();
      if (d === "[DONE]") continue;
      try { out += JSON.parse(d).choices?.[0]?.delta?.content ?? ""; } catch { /* partial line */ }
    }
  }
  return out;
}
