"use client";
import { useEffect } from "react";

// Sends one count to /api/discovery/event. Never blocks the page and never throws.
export function track(strategyId: string, event: "page_view" | "see_more" | "form_start" | "card_click", detail?: string) {
  try {
    const body = JSON.stringify({ strategy_id: strategyId, event, detail });
    if (navigator.sendBeacon) navigator.sendBeacon("/api/discovery/event", new Blob([body], { type: "application/json" }));
    else fetch("/api/discovery/event", { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true });
  } catch { /* ignore */ }
}

export function PageView({ strategyId }: { strategyId: string }) {
  useEffect(() => { track(strategyId, "page_view"); try { localStorage.setItem("p2b_last_strategy", strategyId); } catch { /* ignore */ } }, [strategyId]);
  return null;
}

export function TrackedLink({ strategyId, detail, ...a }: { strategyId: string; detail: string } & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <a {...a} onClick={() => track(strategyId, "card_click", detail)} />;
}
