import { NextResponse, type NextRequest } from "next/server";
import { URL as SB_URL, KEY as ANON } from "@/lib/programs";

const AT = "p2b_at";
const RT = "p2b_rt";

function expiry(token: string): number {
  try {
    const p = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    return Number(p.exp) * 1000;
  } catch {
    return 0;
  }
}

// Protects /admin. Keeps the session fresh by exchanging the refresh token when the access token is about to expire.
export async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith("/admin/login")) return NextResponse.next();
  const at = req.cookies.get(AT)?.value;
  const rt = req.cookies.get(RT)?.value;
  if (at && expiry(at) > Date.now() + 30_000) return NextResponse.next();

  if (rt) {
    try {
      const r = await fetch(`${SB_URL}/auth/v1/token?grant_type=refresh_token`, {
        method: "POST",
        headers: { apikey: ANON, "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: rt }),
      });
      if (r.ok) {
        const d = await r.json();
        const headers = new Headers(req.headers);
        const jar = req.cookies.getAll().filter((c) => c.name !== AT && c.name !== RT).map((c) => `${c.name}=${c.value}`);
        jar.push(`${AT}=${d.access_token}`, `${RT}=${d.refresh_token}`);
        headers.set("cookie", jar.join("; "));
        const res = NextResponse.next({ request: { headers } });
        const base = { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" as const, path: "/" };
        res.cookies.set(AT, d.access_token, { ...base, maxAge: 60 * 60 * 24 * 14 });
        res.cookies.set(RT, d.refresh_token, { ...base, maxAge: 60 * 60 * 24 * 14 });
        return res;
      }
    } catch {}
  }
  const url = req.nextUrl.clone();
  url.pathname = "/admin/login";
  url.search = "";
  const res = NextResponse.redirect(url);
  res.cookies.delete(AT);
  res.cookies.delete(RT);
  return res;
}

export const config = { matcher: ["/admin/:path*"] };
