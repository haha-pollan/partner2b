"use client";

export function AutoForm({ children, q, action = "/directory" }: { children: React.ReactNode; q: string; action?: string }) {
  return (
    <form method="get" action={action} onChange={(e) => e.currentTarget.requestSubmit()}>
      {q ? <input type="hidden" name="q" value={q} /> : null}
      {children}
    </form>
  );
}
