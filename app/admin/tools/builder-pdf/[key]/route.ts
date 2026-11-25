import { requireStaff } from "@/lib/admin/session";
import { URL as SB_URL } from "@/lib/programs";
import { PDF_BUCKET, PDF_KEY_RE, storageHeaders } from "@/lib/builder2/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Staff only: sends back the strategy PDF that was created for one Program builder user.
export async function GET(_req: Request, { params }: { params: Promise<{ key: string }> }) {
  await requireStaff();
  const { key } = await params;
  if (!PDF_KEY_RE.test(key)) return new Response("Not found", { status: 404 });
  const r = await fetch(`${SB_URL}/storage/v1/object/${PDF_BUCKET}/${key}.pdf`, { headers: storageHeaders(), cache: "no-store" });
  if (!r.ok) return new Response("This PDF was not saved.", { status: 404 });
  return new Response(r.body, { headers: { "Content-Type": "application/pdf", "Content-Disposition": `inline; filename="strategy-${key.slice(0, 8)}.pdf"`, "Cache-Control": "private, no-store" } });
}
