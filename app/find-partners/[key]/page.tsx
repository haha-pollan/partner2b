import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { adminConfigured, db } from "@/lib/admin/session";
import { previewFor } from "@/lib/discovery/preview";
import { PDF_KEY_RE } from "@/lib/builder2/store";
import View from "./View";

export const dynamic = "force-dynamic";
export const maxDuration = 120;
export const metadata: Metadata = { title: "Find your partners | Partner2B", robots: { index: false, follow: false } };

export default async function Page({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  if (!PDF_KEY_RE.test(key) || !adminConfigured()) notFound();
  const r = await db(`builder_strategies?id=eq.${key}&select=*&limit=1`);
  const rows = r.ok ? await r.json() : [];
  if (!rows[0]) notFound();
  const preview = await previewFor(rows[0]);
  return <View preview={preview} strategyId={key} />;
}
