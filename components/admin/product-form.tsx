"use client";

import Link from "next/link";
import { useState } from "react";
import type { ProductView, Size } from "@/lib/types";

type Props = {
  action: (formData: FormData) => void;
  product?: ProductView;
};

const defaultSizes: Size[] = [
  { label: "90×200", price: 24900 },
  { label: "120×200", price: 29900 },
  { label: "160×200", price: 37900 },
  { label: "180×200", price: 42900 },
];

function field(label: string, child: React.ReactNode, hint?: string) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-ink-soft">
        {label}
      </label>
      {child}
      {hint && <p className="mt-1 text-xs text-ink-muted">{hint}</p>}
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-ink/15 bg-sand-50 px-4 py-2.5 text-ink outline-none transition-colors focus:border-sage-500 focus:ring-2 focus:ring-sage-200";

export function ProductForm({ action, product }: Props) {
  const [sizes, setSizes] = useState<{ label: string; euros: string }[]>(
    (product?.sizes.length ? product.sizes : defaultSizes).map((s) => ({
      label: s.label,
      euros: (s.price / 100).toString(),
    }))
  );

  const addSize = () => setSizes((s) => [...s, { label: "", euros: "" }]);
  const removeSize = (i: number) =>
    setSizes((s) => s.filter((_, idx) => idx !== i));
  const update = (i: number, key: "label" | "euros", v: string) =>
    setSizes((s) => s.map((row, idx) => (idx === i ? { ...row, [key]: v } : row)));

  return (
    <form action={action} className="space-y-8">
      {product && <input type="hidden" name="id" value={product.id} />}

      <section className="grid gap-5 rounded-xl2 border border-ink/10 bg-sand-50 p-6 sm:grid-cols-2">
        {field(
          "Name",
          <input
            name="name"
            defaultValue={product?.name}
            required
            className={inputCls}
          />
        )}
        {field(
          "Slug",
          <input
            name="slug"
            defaultValue={product?.slug}
            required
            placeholder="lunova-horizontal"
            className={inputCls}
          />,
          "URL path: /product/<slug>"
        )}
        <div className="sm:col-span-2">
          {field(
            "Tagline",
            <input
              name="tagline"
              defaultValue={product?.tagline}
              className={inputCls}
            />
          )}
        </div>
        <div className="sm:col-span-2">
          {field(
            "Description",
            <textarea
              name="description"
              defaultValue={product?.description}
              rows={4}
              className={`${inputCls} resize-none`}
            />
          )}
        </div>
        <div className="sm:col-span-2">
          {field(
            "Material",
            <input
              name="material"
              defaultValue={product?.material}
              className={inputCls}
            />
          )}
        </div>
        {field(
          "Colour name",
          <input
            name="colorName"
            defaultValue={product?.colorName}
            className={inputCls}
          />
        )}
        {field(
          "Colour swatch",
          <input
            name="colorHex"
            type="color"
            defaultValue={product?.colorHex ?? "#7A8B5C"}
            className="h-11 w-full cursor-pointer rounded-xl border border-ink/15 bg-sand-50 px-2"
          />
        )}
        <div className="sm:col-span-2">
          {field(
            "Image paths",
            <textarea
              name="images"
              defaultValue={product?.images.join("\n")}
              rows={3}
              placeholder="/products/lunova-horizontal.svg"
              className={`${inputCls} resize-none font-mono text-sm`}
            />,
            "One path per line. Drop photos in /public/products and reference them here."
          )}
        </div>
      </section>

      {/* Sizes */}
      <section className="rounded-xl2 border border-ink/10 bg-sand-50 p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="font-serif text-lg text-ink">Sizes & prices</h3>
            <p className="text-xs text-ink-muted">Prices in EUR (€).</p>
          </div>
          <button
            type="button"
            onClick={addSize}
            className="rounded-full border border-ink/15 px-3 py-1.5 text-xs text-ink-soft hover:bg-ink/5"
          >
            + Add size
          </button>
        </div>
        <div className="space-y-3">
          {sizes.map((row, i) => (
            <div key={i} className="flex items-center gap-3">
              <input
                name="sizeLabel"
                value={row.label}
                onChange={(e) => update(i, "label", e.target.value)}
                placeholder="160×200"
                className={`${inputCls} flex-1`}
              />
              <div className="relative w-40">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted">
                  €
                </span>
                <input
                  name="sizePrice"
                  value={row.euros}
                  onChange={(e) => update(i, "euros", e.target.value)}
                  inputMode="decimal"
                  placeholder="379"
                  className={`${inputCls} pl-7`}
                />
              </div>
              <button
                type="button"
                onClick={() => removeSize(i)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink-muted hover:bg-red-50 hover:text-red-600"
                aria-label="Remove size"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Settings */}
      <section className="grid gap-5 rounded-xl2 border border-ink/10 bg-sand-50 p-6 sm:grid-cols-3">
        {field(
          "Sort order",
          <input
            name="sortOrder"
            type="number"
            defaultValue={product?.sortOrder ?? 0}
            className={inputCls}
          />
        )}
        <label className="flex items-center gap-3 self-end pb-2.5">
          <input
            type="checkbox"
            name="featured"
            defaultChecked={product?.featured ?? false}
            className="h-4 w-4 accent-sage-600"
          />
          <span className="text-sm text-ink-soft">Featured on home</span>
        </label>
        <label className="flex items-center gap-3 self-end pb-2.5">
          <input
            type="checkbox"
            name="active"
            defaultChecked={product?.active ?? true}
            className="h-4 w-4 accent-sage-600"
          />
          <span className="text-sm text-ink-soft">Active (visible)</span>
        </label>
      </section>

      <div className="flex items-center gap-3">
        <button type="submit" className="btn-primary">
          {product ? "Save changes" : "Create product"}
        </button>
        <Link href="/admin/products" className="btn-ghost">
          Cancel
        </Link>
      </div>
    </form>
  );
}
