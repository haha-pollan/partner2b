"use client";
import { useEffect, useState } from "react";

// Shows "Open my results" only for visitors who already have a result on this device.
export default function OpenMine({ link }: { link?: boolean }) {
  const [id, setId] = useState("");
  useEffect(() => { try { const v = localStorage.getItem("p2b_last_strategy") || ""; if (/^[0-9a-f-]{36}$/.test(v)) setId(v); } catch { /* ignore */ } }, []);
  if (!id) return null;
  return <a className={link ? "fplink" : "btn btn-s"} href={`/find-partners/${id}`}>Open my results</a>;
}
