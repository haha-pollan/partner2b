import { redirect } from "next/navigation";
import { getStaff } from "@/lib/admin/session";
import { LoginForm } from "./LoginForm";

export default async function LoginPage() {
  if (await getStaff()) redirect("/admin");
  return (
    <div className="adm-card adm-login cut">
      <h1>Sign in</h1>
      <p className="adm-sub">Partner2B team only.</p>
      <LoginForm />
    </div>
  );
}
