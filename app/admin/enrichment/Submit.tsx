"use client";
import { useFormStatus } from "react-dom";

// Submit button that shows it is working, for actions that take a while.
export default function Submit({ label, busy, cls }: { label: string; busy: string; cls: string }) {
  const { pending } = useFormStatus();
  return <button type="submit" className={`btn btn-sm ${cls}`} disabled={pending} style={pending ? { opacity: 0.7, cursor: "progress" } : undefined}>{pending ? busy : label}</button>;
}
