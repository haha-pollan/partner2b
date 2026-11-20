"use client";

export function AutoForm({ children, q }: { children: React.ReactNode; q: string }) {
  return (
    <form method="get" action="/directory" onChange={(e) => e.currentTarget.requestSubmit()}>
      {q ? <input type="hidden" name="q" value={q} /> : null}
      {children}
    </form>
  );
}
