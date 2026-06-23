import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { LoginForm } from "./login-form";

export default function AdminLoginPage() {
  if (isAuthenticated()) redirect("/admin");

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center leading-none">
          <span className="font-serif text-3xl tracking-[0.3em] text-ink">
            LUNOVA
          </span>
          <span className="text-[10px] tracking-[0.45em] text-ink-muted">
            SLEEP · ADMIN
          </span>
        </div>
        <div className="rounded-xl2 border border-ink/10 bg-sand-50 p-8 shadow-soft">
          <h1 className="mb-1 font-serif text-2xl text-ink">Welcome back</h1>
          <p className="mb-6 text-sm text-ink-muted">
            Sign in to manage orders and products.
          </p>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
