"use client";
import { useActionState } from "react";
import { login, type LoginState } from "../actions";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});
  return (
    <form action={action} className="adm-box" style={{ background: "transparent", padding: 0 }}>
      <label htmlFor="email">Email</label>
      <input id="email" name="email" type="email" autoComplete="username" required className="field" />
      <label htmlFor="password">Password</label>
      <input id="password" name="password" type="password" autoComplete="current-password" required className="field" />
      <button type="submit" disabled={pending} className="btn btn-p" style={{ marginTop: 18 }}>{pending ? "Signing in..." : "Sign in"}</button>
      {state.error && <p className="adm-err" role="alert">{state.error}</p>}
    </form>
  );
}
