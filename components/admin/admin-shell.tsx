import Link from "next/link";
import { logoutAction } from "@/app/admin/actions";

export function AdminShell({
  active,
  children,
}: {
  active: "orders" | "products";
  children: React.ReactNode;
}) {
  const nav = [
    { key: "orders", label: "Orders", href: "/admin" },
    { key: "products", label: "Products", href: "/admin/products" },
  ] as const;

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-ink/10 bg-sand-50">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-8">
            <Link href="/admin" className="flex flex-col leading-none">
              <span className="font-serif text-lg tracking-[0.25em] text-ink">
                LUNOVA
              </span>
              <span className="text-[9px] tracking-[0.4em] text-ink-muted">
                ADMIN
              </span>
            </Link>
            <nav className="flex items-center gap-1">
              {nav.map((n) => (
                <Link
                  key={n.key}
                  href={n.href}
                  className={`rounded-full px-4 py-2 text-sm transition-colors ${
                    active === n.key
                      ? "bg-ink text-sand-50"
                      : "text-ink-soft hover:bg-ink/5"
                  }`}
                >
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="hidden text-sm text-ink-muted hover:text-sage-600 sm:inline"
            >
              View store ↗
            </Link>
            <form action={logoutAction}>
              <button className="rounded-full border border-ink/15 px-4 py-2 text-sm text-ink-soft transition-colors hover:bg-ink/5">
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        {children}
      </main>
    </div>
  );
}
