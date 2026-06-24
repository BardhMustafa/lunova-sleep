import Link from "next/link";
import type { ProductView } from "@/lib/types";
import { formatPrice } from "@/lib/format";

export function ProductCard({ product }: { product: ProductView }) {
  const from = product.sizes.length
    ? Math.min(...product.sizes.map((s) => s.price))
    : 0;
  const image = product.images[0];

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group flex flex-col"
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl2 bg-sand-200">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          // Fallback when the product has no image in the database — still
          // on-brand, driven by the product's own colour.
          <div
            className="flex h-full w-full items-center justify-center transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            style={{
              background: `linear-gradient(135deg, ${product.colorHex}22, ${product.colorHex}66)`,
            }}
          >
            <span className="font-serif text-2xl text-ink/40">
              {product.name}
            </span>
          </div>
        )}
        <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-sand-50/85 px-3 py-1 text-xs text-ink-soft backdrop-blur">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: product.colorHex }}
          />
          {product.colorName}
        </span>
      </div>
      <div className="mt-5 flex items-baseline justify-between gap-4">
        <h3 className="font-serif text-xl text-ink">{product.name}</h3>
        <span className="whitespace-nowrap text-sm text-ink-muted">
          from {formatPrice(from)}
        </span>
      </div>
      <p className="mt-1 text-sm text-ink-muted">{product.tagline}</p>
      <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-sage-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        View bed →
      </span>
    </Link>
  );
}
