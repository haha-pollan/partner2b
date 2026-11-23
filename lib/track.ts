"use client";
import posthog from "posthog-js";

// Thin wrapper around the PostHog instance started in components/PostHog.tsx (cookieless, in-memory).
// Never pass an email, a name or any free text here.
export function track(event: string, props?: Record<string, string | number | boolean>) {
  try {
    if (typeof window === "undefined" || !posthog.__loaded) return;
    posthog.capture(event, props);
  } catch { /* analytics must never break a page */ }
}
