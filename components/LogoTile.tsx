"use client";
import { useState, type ReactNode } from "react";

// Public Brandfetch client ID (safe to expose, it is meant for browsers).
const KEY = process.env.NEXT_PUBLIC_BRANDFETCH_ID || "1idfjrajSuxh9wu3AlR";

export function LogoTile({ domain, size, fallback }: { domain: string; size: number; fallback: ReactNode }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <>{fallback}</>;
  const px = size * 2;
  const src = `https://cdn.brandfetch.io/${encodeURIComponent(domain)}/w/${px}/h/${px}/fallback/404/type/icon?c=${KEY}`;
  return (
    <div style={{ flex: `0 0 ${size}px`, width: size, height: size, background: "#fff", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" width={size} height={size} loading="lazy" style={{ objectFit: "cover", width: "100%", height: "100%" }} onError={() => setFailed(true)} />
    </div>
  );
}
