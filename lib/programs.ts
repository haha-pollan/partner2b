export type Program = {
  id: number;
  slug: string;
  company: string;
  product_note: string | null;
  product_category: string;
  program_types: string[];
  primary_type: string;
  commission_models: string[];
  feature_tags: string[];
  region: string;
  program_url: string;
  domain: string | null;
  description: string | null;
  tiers: string[];
  benefits: string[];
  verification_status: string;
  verified_at: string | null;
};

// The publishable key is designed to be public. Row level security in Supabase
// lets it read published programs only.
const URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://lfqtbjlanbrodvvcodjq.supabase.co";
const KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY ?? "sb_publishable_jKho5opr89qNGDzkBUhy_w_gAPZmmQO";

const COLS =
  "id,slug,company,product_note,product_category,program_types,primary_type,commission_models,feature_tags,region,program_url,domain,description,tiers,benefits,verification_status,verified_at";

export async function getPrograms(): Promise<Program[]> {
  const res = await fetch(`${URL}/rest/v1/programs?select=${COLS}&published=eq.true&order=company.asc&limit=1000`, {
    headers: { apikey: KEY },
    next: { revalidate: 600 },
  });
  if (!res.ok) throw new Error(`Supabase error ${res.status}`);
  return (await res.json()) as Program[];
}

export async function getProgram(slug: string): Promise<Program | undefined> {
  const all = await getPrograms();
  return all.find((p) => p.slug === slug);
}

export function commissionLabel(p: Program): string {
  const m = p.commission_models.filter((x) => x !== "Not published");
  return m.length ? m.join(", ") : "Not published";
}

export function verifiedLabel(p: Program): string {
  if (p.verification_status === "verified" && p.verified_at) {
    return new Date(p.verified_at).toLocaleDateString("en-GB", { month: "short", year: "numeric" });
  }
  return "Not yet";
}
