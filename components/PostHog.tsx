"use client";
import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";

// The project token is a write-only public key, safe in browser code.
const KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY ?? "phc_mztCzGaNWd2RS5jaPkBVW2kgG2RpUFimKV4P8WMgFpe9";

function Pageview() {
  const pathname = usePathname();
  const params = useSearchParams();
  useEffect(() => {
    if (!posthog.__loaded) return;
    const qs = params?.toString();
    posthog.capture("$pageview", { $current_url: window.location.origin + pathname + (qs ? `?${qs}` : "") });
  }, [pathname, params]);
  return null;
}

export function PostHog() {
  useEffect(() => {
    if (posthog.__loaded) return;
    posthog.init(KEY, {
      api_host: "/ingest",
      ui_host: "https://eu.posthog.com",
      // No cookies and nothing stored on the visitor's device
      cookieless_mode: "always",
      persistence: "memory",
      person_profiles: "identified_only",
      disable_session_recording: true,
      capture_pageview: false,
      capture_pageleave: true,
    });
  }, []);
  return <Suspense fallback={null}><Pageview /></Suspense>;
}
