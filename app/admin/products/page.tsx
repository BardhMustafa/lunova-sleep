import Link from "next/link";
import { requireAuth } from "@/lib/auth";
import { getAllProducts } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import { AdminShell } from "@/components/admin/admin-shell";
import { deleteProduct, toggleProductActive } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  requireAuth();
  const products = await getAllProducts();

  return (
    <AdminShell active="products">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-ink">Products</h1>
          <p className="mt-1 text-sm text-ink-muted">
            Manage your bed collection — pricing, photos, and visibility.
          </p>
        </div>
        <Link href="/admin/products/new" className="btn-primary">
          + New product
        </Link>
      </div>

      <div className="space-y-3">
        {products.map((p) => {
          const from = p.sizes.length
            ? Math.min(...p.sizes.map((s) => s.price))
            : 0;
          return (
            <div
              key={p.id}
              className="flex flex-wrap items-center gap-4 rounded-xl2 border border-ink/10 bg-sand-50 p-4"
            >
              <div className="h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-sand-200">
                {p.images[0] && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-serif text-lg text-ink">{p.name}</span>
                  {p.featured && (
                    <span className="rounded-full bg-sage-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-sage-600">
                      Featured
                    </span>
                  )}
                  {!p.active && (
                    <span className="rounded-full bg-ink/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-ink-muted">
                      Hidden
                    </span>
                  )}
                </div>
                <p className="text-sm text-ink-muted">
                  {p.colorName} · {p.sizes.length} sizes · from{" "}
                  {formatPrice(from)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href={`/admin/products/${p.id}`}
                  className="rounded-full border border-ink/15 px-4 py-2 text-sm text-ink-soft hover:bg-ink/5"
                >
                  Edit
                </Link>
                <form action={toggleProductActive}>
                  <input type="hidden" name="id" value={p.id} />
                  <button className="rounded-full border border-ink/15 px-4 py-2 text-sm text-ink-soft hover:bg-ink/5">
                    {p.active ? "Hide" : "Show"}
                  </button>
                </form>
                <form action={deleteProduct}>
                  <input type="hidden" name="id" value={p.id} />
                  <button className="text-sm text-ink-muted hover:text-red-600">
                    Delete
                  </button>
                </form>
              </div>
            </div>
          );
        })}

        {products.length === 0 && (
          <div className="rounded-xl2 border border-dashed border-ink/15 bg-sand-50 py-16 text-center text-ink-muted">
            No products yet. Create your first bed.
          </div>
        )}
      </div>
    </AdminShell>
  );
}
