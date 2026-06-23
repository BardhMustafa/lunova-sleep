import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { parseOrder } from "@/lib/types";
import { formatPrice, formatDate } from "@/lib/format";
import { AdminShell } from "@/components/admin/admin-shell";
import { OrderStatusSelect } from "@/components/admin/order-status-select";
import { deleteOrder } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  requireAuth();

  const rows = await prisma.order.findMany({ orderBy: { createdAt: "desc" } });
  const orders = rows.map(parseOrder);

  const revenue = orders
    .filter((o) => o.status !== "CANCELLED")
    .reduce((sum, o) => sum + o.total, 0);
  const pending = orders.filter((o) => o.status === "PENDING").length;
  const delivered = orders.filter((o) => o.status === "DELIVERED").length;

  const stats = [
    { label: "Total orders", value: String(orders.length) },
    { label: "Pending", value: String(pending) },
    { label: "Delivered", value: String(delivered) },
    { label: "Revenue (excl. cancelled)", value: formatPrice(revenue) },
  ];

  return (
    <AdminShell active="orders">
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-ink">Orders</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Every order placed on the store. Pay-on-delivery — update the status as
          you go.
        </p>
      </div>

      <div className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-xl2 border border-ink/10 bg-sand-50 p-5"
          >
            <p className="text-xs uppercase tracking-widest text-ink-muted">
              {s.label}
            </p>
            <p className="mt-2 font-serif text-2xl text-ink">{s.value}</p>
          </div>
        ))}
      </div>

      {orders.length === 0 ? (
        <div className="rounded-xl2 border border-dashed border-ink/15 bg-sand-50 py-20 text-center text-ink-muted">
          No orders yet. They’ll appear here as customers check out.
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div
              key={o.id}
              className="rounded-xl2 border border-ink/10 bg-sand-50 p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-serif text-lg text-ink">
                      {o.orderNumber}
                    </span>
                    <OrderStatusSelect id={o.id} status={o.status} />
                  </div>
                  <p className="mt-1 text-xs text-ink-muted">
                    {formatDate(o.createdAt)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-serif text-xl text-ink">
                    {formatPrice(o.total)}
                  </p>
                  <p className="text-xs text-ink-muted">pay on delivery</p>
                </div>
              </div>

              <div className="mt-4 grid gap-4 border-t border-ink/10 pt-4 md:grid-cols-[1.2fr_1fr_1fr]">
                <div className="text-sm">
                  <p className="font-medium text-ink">{o.customerName}</p>
                  <p className="text-ink-muted">{o.email}</p>
                  <p className="text-ink-muted">{o.phone}</p>
                </div>
                <div className="text-sm text-ink-soft">
                  <p>{o.address}</p>
                  <p>
                    {o.postalCode} {o.city}
                  </p>
                  {o.country && <p>{o.country}</p>}
                  {o.notes && (
                    <p className="mt-1 italic text-ink-muted">“{o.notes}”</p>
                  )}
                </div>
                <div className="text-sm">
                  <ul className="space-y-1">
                    {o.items.map((it, i) => (
                      <li key={i} className="flex justify-between gap-2">
                        <span className="text-ink-soft">
                          {it.name} · {it.size} ×{it.qty}
                        </span>
                        <span className="text-ink-muted">
                          {formatPrice(it.price * it.qty)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-4 flex justify-end border-t border-ink/10 pt-3">
                <form action={deleteOrder}>
                  <input type="hidden" name="id" value={o.id} />
                  <button className="text-xs text-ink-muted underline-offset-2 hover:text-red-600 hover:underline">
                    Delete order
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
