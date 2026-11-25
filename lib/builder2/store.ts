// Keeps a copy of every strategy PDF in a private Supabase Storage bucket, so the team can check what was sent.
// Best effort: if anything fails the visitor still gets their report.
import { URL as SB_URL } from "@/lib/programs";

export const PDF_BUCKET = "builder-pdfs";
export const PDF_KEY_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

const serviceKey = () => (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim().replace(/^["']|["']$/g, "");
export const storageHeaders = (extra: Record<string, string> = {}) => {
  const k = serviceKey();
  const h: Record<string, string> = { apikey: k, ...extra };
  if (!k.startsWith("sb_secret_")) h.Authorization = `Bearer ${k}`;
  return h;
};

export async function savePdf(key: string, pdf: Buffer): Promise<boolean> {
  if (!serviceKey() || !PDF_KEY_RE.test(key)) return false;
  try {
    const r = await fetch(`${SB_URL}/storage/v1/object/${PDF_BUCKET}/${key}.pdf`, {
      method: "POST", cache: "no-store",
      headers: storageHeaders({ "Content-Type": "application/pdf" }),
      body: new Uint8Array(pdf),
    });
    if (!r.ok) console.error("builder pdf save failed:", r.status);
    return r.ok;
  } catch (e) {
    console.error("builder pdf save failed:", e instanceof Error ? e.message : "");
    return false;
  }
}
