// Small OpenAI helpers for the enrichment job. Cheap model by default, JSON only.
export const ENRICH_MODEL = process.env.ENRICH_MODEL || "gpt-4.1-mini";
export const SEARCH_MODEL = process.env.ENRICH_SEARCH_MODEL || "gpt-4.1-mini";

const key = () => (process.env.OPENAI_API_KEY || "").trim();
export const llmConfigured = () => !!key();

export async function askJson<T>(system: string, user: string): Promise<T | null> {
  if (!key()) throw new Error("not_configured");
  const ctl = new AbortController(); const timer = setTimeout(() => ctl.abort(), 60_000);
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST", signal: ctl.signal,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key()}` },
      body: JSON.stringify({ model: ENRICH_MODEL, temperature: 0, max_tokens: 3500, response_format: { type: "json_object" }, messages: [{ role: "system", content: system }, { role: "user", content: user }] }),
    });
    if (!res.ok) throw new Error(`openai_${res.status}`);
    const j = await res.json();
    return JSON.parse(j.choices?.[0]?.message?.content ?? "null") as T;
  } catch (e) {
    if (e instanceof Error && e.message.startsWith("openai_")) throw e;
    return null;
  } finally { clearTimeout(timer); }
}

// One web search question. Returns the model's text answer (we ask it to answer with JSON).
export async function askWithSearch(prompt: string): Promise<string> {
  if (!key()) throw new Error("not_configured");
  const ctl = new AbortController(); const timer = setTimeout(() => ctl.abort(), 120_000);
  try {
    const res = await fetch("https://api.openai.com/v1/responses", {
      method: "POST", signal: ctl.signal,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key()}` },
      body: JSON.stringify({ model: SEARCH_MODEL, tools: [{ type: "web_search" }], input: prompt }),
    });
    if (!res.ok) throw new Error(`openai_${res.status}`);
    const j = await res.json();
    const parts: string[] = [];
    for (const o of j.output ?? []) if (o.type === "message") for (const c of o.content ?? []) if (typeof c.text === "string") parts.push(c.text);
    return parts.join("\n");
  } finally { clearTimeout(timer); }
}

export function jsonFrom(text: string): unknown {
  const m = text.match(/\{[\s\S]*\}/);
  if (!m) return null;
  try { return JSON.parse(m[0]); } catch { return null; }
}
