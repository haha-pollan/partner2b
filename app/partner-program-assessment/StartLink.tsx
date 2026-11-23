"use client";
import type { CSSProperties, ReactNode } from "react";

// A button on the public page that opens the assessment. The questions stay hidden until someone clicks.
export const OPEN_EVENT = "p2b-assessment-open";

export function StartLink({ className, style, children }: { className?: string; style?: CSSProperties; children: ReactNode }) {
  return (
    <a
      href="#start"
      className={className}
      style={style}
      onClick={(e) => {
        e.preventDefault();
        window.dispatchEvent(new Event(OPEN_EVENT));
      }}
    >
      {children}
    </a>
  );
}
