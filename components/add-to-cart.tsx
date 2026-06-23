"use client";

import { useState } from "react";
import { useCart } from "./cart-context";
import { formatPrice } from "@/lib/format";
import type { ProductView } from "@/lib/types";
import { MinusIcon, PlusIcon, CartIcon } from "./icons";

export function AddToCart({ product }: { product: ProductView }) {
  const { add } = useCart();
  const [sizeIdx, setSizeIdx] = useState(0);
  const [qty, setQty] = useState(1);

  const size = product.sizes[sizeIdx];
  if (!size) return null;

  return (
    <div className="space-y-7">
      <div>
        <div className="mb-3 flex items-center justify-between">
          <span className="eyebrow">Choose your size</span>
          <span className="text-xs text-ink-muted">cm · W × L</span>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {product.sizes.map((s, i) => {
            const active = i === sizeIdx;
            return (
              <button
                key={s.label}
                onClick={() => setSizeIdx(i)}
                className={`flex flex-col items-center rounded-xl border px-3 py-3 text-center transition-all ${
                  active
                    ? "border-sage-500 bg-sage-50 shadow-soft"
                    : "border-ink/15 hover:border-ink/35"
                }`}
              >
                <span className="text-sm font-medium text-ink">{s.label}</span>
                <span className="mt-0.5 text-xs text-ink-muted">
                  {formatPrice(s.price)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 rounded-full border border-ink/15">
          <button
            aria-label="Decrease quantity"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="flex h-11 w-11 items-center justify-center text-ink hover:text-sage-600"
          >
            <MinusIcon className="h-4 w-4" />
          </button>
          <span className="w-8 text-center text-sm font-medium">{qty}</span>
          <button
            aria-label="Increase quantity"
            onClick={() => setQty((q) => q + 1)}
            className="flex h-11 w-11 items-center justify-center text-ink hover:text-sage-600"
          >
            <PlusIcon className="h-4 w-4" />
          </button>
        </div>

        <button
          onClick={() =>
            add({
              productId: product.id,
              slug: product.slug,
              name: product.name,
              size: size.label,
              price: size.price,
              qty,
              image: product.images[0],
              colorHex: product.colorHex,
            })
          }
          className="btn-primary flex-1"
        >
          <CartIcon className="h-5 w-5" />
          Add to cart · {formatPrice(size.price * qty)}
        </button>
      </div>

      <p className="text-xs text-ink-muted">
        No payment now — you pay on delivery. Free shipping, taxes included.
      </p>
    </div>
  );
}
