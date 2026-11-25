"use client";
import { useFormStatus } from "react-dom";

// A button inside the review list that runs its own action and shows it is working.
export default function ActButton({ label, busy, cls, action }: { label: string; busy: string; cls: string; action: (f: FormData) => void | Promise<void> }) {
  const { pending } = useFormStatus();
  return <button type="submit" formAction={action} className={`btn btn-sm ${cls}`} disabled={pending} style={pending ? { opacity: 0.7, cursor: "progress" } : undefined}>{pending ? busy : label}</button>;
}
