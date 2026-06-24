"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/cart-context";
import { useI18n } from "@/components/i18n-provider";
import { formatPrice } from "@/lib/format";
import { ArrowRight, ShieldIcon, TruckIcon } from "@/components/icons";

export default function CheckoutPage() {
  const { items, total, clear } = useCart();
  const { dict } = useI18n();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fields = [
    { name: "customerName", label: dict.checkout.fullName, type: "text", half: false, autoComplete: "name" },
    { name: "email", label: dict.checkout.email, type: "email", half: true, autoComplete: "email" },
    { name: "phone", label: dict.checkout.phone, type: "tel", half: true, autoComplete: "tel" },
    { name: "address", label: dict.checkout.address, type: "text", half: false, autoComplete: "street-address" },
    { name: "city", label: dict.checkout.city, type: "text", half: true, autoComplete: "address-level2" },
    { name: "postalCode", label: dict.checkout.postalCode, type: "text", half: true, autoComplete: "postal-code" },
    { name: "country", label: dict.checkout.country, type: "text", half: false, autoComplete: "country-name" },
  ] as const;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (items.length === 0) {
      setError(dict.checkout.errEmpty);
      return;
    }
    setSubmitting(true);
    const form = new FormData(e.currentTarget);
    const payload = {
      customerName: String(form.get("customerName") ?? ""),
      email: String(form.get("email") ?? ""),
      phone: String(form.get("phone") ?? ""),
      address: String(form.get("address") ?? ""),
      city: String(form.get("city") ?? ""),
      postalCode: String(form.get("postalCode") ?? ""),
      country: String(form.get("country") ?? ""),
      notes: String(form.get("notes") ?? ""),
      items: items.map((i) => ({
        productId: i.productId,
        size: i.size,
        qty: i.qty,
      })),
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? dict.checkout.errGeneric);
        setSubmitting(false);
        return;
      }
      clear();
      router.push(`/order-confirmed?n=${encodeURIComponent(json.orderNumber)}`);
    } catch {
      setError(dict.checkout.errNetwork);
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="container-x flex min-h-[60vh] flex-col items-center justify-center gap-5 text-center">
        <h1 className="font-serif text-4xl font-light text-ink">
          {dict.checkout.emptyTitle}
        </h1>
        <p className="max-w-sm text-ink-muted">{dict.checkout.emptyText}</p>
        <Link href="/collection" className="btn-primary">
          {dict.cart.browse} <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="container-x py-12 md:py-16">
      <h1 className="font-serif text-4xl font-light text-ink md:text-5xl">
        {dict.checkout.title}
      </h1>
      <p className="mt-3 max-w-lg text-ink-muted">{dict.checkout.subtitle}</p>

      <div className="mt-10 grid gap-12 lg:grid-cols-[1.3fr_1fr]">
        {/* Form */}
        <form onSubmit={onSubmit} className="order-2 lg:order-1">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {fields.map((f) => (
              <div key={f.name} className={f.half ? "" : "sm:col-span-2"}>
                <label
                  htmlFor={f.name}
                  className="mb-1.5 block text-sm font-medium text-ink-soft"
                >
                  {f.label}
                </label>
                <input
                  id={f.name}
                  name={f.name}
                  type={f.type}
                  autoComplete={f.autoComplete}
                  required={f.name !== "country"}
                  className="w-full rounded-xl border border-ink/15 bg-sand-50 px-4 py-3 text-ink outline-none transition-colors placeholder:text-ink-muted/60 focus:border-sage-500 focus:ring-2 focus:ring-sage-200"
                />
              </div>
            ))}
            <div className="sm:col-span-2">
              <label
                htmlFor="notes"
                className="mb-1.5 block text-sm font-medium text-ink-soft"
              >
                {dict.checkout.notes}{" "}
                <span className="text-ink-muted">{dict.checkout.optional}</span>
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                placeholder={dict.checkout.notesPlaceholder}
                className="w-full resize-none rounded-xl border border-ink/15 bg-sand-50 px-4 py-3 text-ink outline-none transition-colors placeholder:text-ink-muted/60 focus:border-sage-500 focus:ring-2 focus:ring-sage-200"
              />
            </div>
          </div>

          {error && (
            <p className="mt-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary mt-7 w-full"
          >
            {submitting ? dict.checkout.placing : dict.checkout.confirm}
            {!submitting && <ArrowRight className="h-4 w-4" />}
          </button>
          <p className="mt-3 text-center text-xs text-ink-muted">
            {dict.checkout.agree}
          </p>
        </form>

        {/* Summary */}
        <aside className="order-1 h-fit rounded-xl2 border border-ink/10 bg-sand-100 p-6 lg:order-2 lg:sticky lg:top-24">
          <h2 className="font-serif text-xl text-ink">{dict.checkout.summary}</h2>
          <ul className="mt-5 divide-y divide-ink/10">
            {items.map((i) => (
              <li key={`${i.productId}-${i.size}`} className="flex gap-4 py-4">
                <div
                  className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-sand-200"
                  style={{ backgroundColor: i.colorHex ?? undefined }}
                >
                  {i.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={i.image}
                      alt={i.name}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <div className="flex flex-1 justify-between">
                  <div>
                    <p className="text-sm font-medium text-ink">{i.name}</p>
                    <p className="text-xs text-ink-muted">
                      {i.size} · ×{i.qty}
                    </p>
                  </div>
                  <span className="text-sm text-ink">
                    {formatPrice(i.price * i.qty)}
                  </span>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-4 space-y-2 border-t border-ink/10 pt-4 text-sm">
            <div className="flex justify-between text-ink-muted">
              <span>{dict.checkout.shipping}</span>
              <span className="text-sage-600">{dict.checkout.free}</span>
            </div>
            <div className="flex justify-between text-base font-medium text-ink">
              <span>{dict.checkout.total}</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>

          <div className="mt-5 space-y-2 text-xs text-ink-muted">
            <p className="flex items-center gap-2">
              <ShieldIcon className="h-4 w-4 text-sage-600" /> {dict.checkout.payOnDelivery}
            </p>
            <p className="flex items-center gap-2">
              <TruckIcon className="h-4 w-4 text-sage-600" /> {dict.checkout.freeShipping}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
