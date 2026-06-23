import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getActiveProducts, getProductBySlug } from "@/lib/products";
import { AddToCart } from "@/components/add-to-cart";
import { ProductCard } from "@/components/product-card";
import { CheckIcon, LeafIcon, TruckIcon, ShieldIcon } from "@/components/icons";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) return { title: "Not found" };
  return {
    title: product.name,
    description: product.tagline,
  };
}

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await getProductBySlug(params.slug);
  if (!product || !product.active) notFound();

  const others = (await getActiveProducts())
    .filter((p) => p.id !== product.id)
    .slice(0, 3);

  return (
    <div className="container-x py-10 md:py-16">
      <nav className="mb-8 text-sm text-ink-muted">
        <Link href="/collection" className="hover:text-sage-600">
          Collection
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{product.name}</span>
      </nav>

      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Gallery */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="aspect-[4/3] overflow-hidden rounded-[2rem] bg-sand-200 shadow-soft">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.images[0]}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>
          {product.images.length > 1 && (
            <div className="mt-4 grid grid-cols-4 gap-3">
              {product.images.slice(0, 4).map((img, i) => (
                <div
                  key={i}
                  className="aspect-square overflow-hidden rounded-xl bg-sand-200"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <div className="flex items-center gap-3">
            <span
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: product.colorHex }}
            />
            <span className="eyebrow">{product.colorName}</span>
          </div>
          <h1 className="mt-4 font-serif text-4xl font-light text-ink md:text-5xl">
            {product.name}
          </h1>
          <p className="mt-3 text-lg italic text-sage-600">{product.tagline}</p>
          <p className="mt-6 leading-relaxed text-ink-soft">
            {product.description}
          </p>

          <div className="my-8 h-px bg-ink/10" />

          <AddToCart product={product} />

          <div className="mt-8 space-y-3 rounded-xl2 bg-sand-100 p-6 text-sm text-ink-soft">
            <p className="flex items-center gap-3">
              <LeafIcon className="h-5 w-5 text-sage-600" /> {product.material}
            </p>
            <p className="flex items-center gap-3">
              <TruckIcon className="h-5 w-5 text-sage-600" /> Free delivery to your
              door
            </p>
            <p className="flex items-center gap-3">
              <ShieldIcon className="h-5 w-5 text-sage-600" /> Pay on delivery — no
              card needed
            </p>
            <p className="flex items-center gap-3">
              <CheckIcon className="h-5 w-5 text-sage-600" /> 100-night comfort
              promise
            </p>
          </div>
        </div>
      </div>

      {others.length > 0 && (
        <section className="mt-24">
          <h2 className="font-serif text-3xl font-light text-ink">
            You might also rest well on
          </h2>
          <div className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
