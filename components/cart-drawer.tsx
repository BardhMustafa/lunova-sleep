"use client";

import Link from "next/link";
import { useCart } from "./cart-context";
import { formatPrice } from "@/lib/format";
import { CloseIcon, MinusIcon, PlusIcon, ArrowRight } from "./icons";

export function CartDrawer() {
  const { items, isOpen, close, total, setQty, remove, count } = useCart();

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={close}
        className={`fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Panel */}
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-sand-50 shadow-lift transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!isOpen}
      >
        <div className="flex items-center justify-between border-b border-ink/10 px-6 py-5">
          <h2 className="font-serif text-lg text-ink">
            Your cart{count > 0 ? ` · ${count}` : ""}
          </h2>
          <button
            onClick={close}
            aria-label="Close cart"
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink transition-colors hover:bg-ink/5"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <p className="font-serif text-2xl text-ink">Your cart is quiet.</p>
            <p className="max-w-xs text-sm text-ink-muted">
              Add a bed you love and it will rest here until you’re ready.
            </p>
            <button onClick={close} className="btn-ghost mt-2">
              Browse the collection
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <ul className="divide-y divide-ink/10">
                {items.map((item) => (
                  <li
                    key={`${item.productId}-${item.size}`}
                    className="flex gap-4 py-4"
                  >
                    <div
                      className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-sand-200"
                      style={{ backgroundColor: item.colorHex ?? undefined }}
                    >
                      {item.image && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex flex-1 flex-col">
                      <div className="flex justify-between gap-2">
                        <div>
                          <p className="font-medium text-ink">{item.name}</p>
                          <p className="text-xs text-ink-muted">{item.size}</p>
                        </div>
                        <button
                          onClick={() => remove(item.productId, item.size)}
                          className="text-xs text-ink-muted underline-offset-2 hover:text-ink hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center gap-1 rounded-full border border-ink/15">
                          <button
                            aria-label="Decrease quantity"
                            onClick={() =>
                              setQty(item.productId, item.size, item.qty - 1)
                            }
                            className="flex h-8 w-8 items-center justify-center text-ink hover:text-sage-600"
                          >
                            <MinusIcon className="h-4 w-4" />
                          </button>
                          <span className="w-6 text-center text-sm">{item.qty}</span>
                          <button
                            aria-label="Increase quantity"
                            onClick={() =>
                              setQty(item.productId, item.size, item.qty + 1)
                            }
                            className="flex h-8 w-8 items-center justify-center text-ink hover:text-sage-600"
                          >
                            <PlusIcon className="h-4 w-4" />
                          </button>
                        </div>
                        <span className="text-sm font-medium text-ink">
                          {formatPrice(item.price * item.qty)}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-ink/10 px-6 py-5">
              <div className="flex items-center justify-between text-sm text-ink-muted">
                <span>Subtotal</span>
                <span className="text-base font-medium text-ink">
                  {formatPrice(total)}
                </span>
              </div>
              <p className="mt-1 text-xs text-ink-muted">
                Pay on delivery · free shipping · taxes included
              </p>
              <Link
                href="/checkout"
                onClick={close}
                className="btn-primary mt-4 w-full"
              >
                Place your order <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
