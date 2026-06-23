import type { Metadata } from "next";
import { getActiveProducts } from "@/lib/products";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "The Collection",
  description: "Five simple, good-looking beds — each in four sizes.",
};

export const dynamic = "force-dynamic";

export default async function CollectionPage() {
  const products = await getActiveProducts();

  return (
    <div className="container-x py-16 md:py-24">
      <header className="max-w-2xl">
        <span className="eyebrow">The collection</span>
        <h1 className="mt-4 font-serif text-5xl font-light text-ink md:text-6xl">
          Five beds, made simple.
        </h1>
        <p className="mt-5 text-lg text-ink-soft">
          Each Lunova model comes in four sizes and is paid for on delivery.
          Quietly beautiful, honestly priced.
        </p>
      </header>

      <div className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p, i) => (
          <Reveal key={p.id} delay={(i % 3) * 90}>
            <ProductCard product={p} />
          </Reveal>
        ))}
      </div>

      {products.length === 0 && (
        <p className="mt-16 text-center text-ink-muted">
          No beds available right now. Please check back soon.
        </p>
      )}
    </div>
  );
}
