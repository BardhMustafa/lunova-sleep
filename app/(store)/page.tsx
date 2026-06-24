import Link from "next/link";
import { getActiveProducts, getFeaturedProducts } from "@/lib/products";
import { getDictionary } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";
import { ArrowRight, LeafIcon, TruckIcon, ShieldIcon, MoonIcon } from "@/components/icons";

export default async function HomePage() {
  const dict = getDictionary();
  const [featured, all] = await Promise.all([
    getFeaturedProducts(),
    getActiveProducts(),
  ]);
  const hero = featured[0] ?? all[0];

  return (
    <>
      {/* ───────────── HERO ───────────── */}
      <section className="relative overflow-hidden linen">
        <div className="container-x grid items-center gap-12 pb-16 pt-10 md:min-h-[88vh] md:grid-cols-2 md:gap-8 md:pb-24 md:pt-6">
          <div className="max-w-xl animate-fade-up">
            <span className="eyebrow">{dict.hero.eyebrow}</span>
            <h1 className="mt-6 font-serif text-5xl font-light leading-[1.05] text-ink md:text-7xl">
              {dict.hero.titlePre}{" "}
              <span className="italic text-sage-600">{dict.hero.titleEmph}</span>.
            </h1>
            <p className="mt-7 max-w-md text-lg leading-relaxed text-ink-soft">
              {dict.hero.subtitle}
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link href="/collection" className="btn-primary">
                {dict.hero.ctaExplore} <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="#story" className="btn-ghost">
                {dict.hero.ctaStory}
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-ink-muted">
              <span className="inline-flex items-center gap-2">
                <TruckIcon className="h-4 w-4 text-sage-600" /> {dict.hero.trustShipping}
              </span>
              <span className="inline-flex items-center gap-2">
                <ShieldIcon className="h-4 w-4 text-sage-600" /> {dict.hero.trustPay}
              </span>
              <span className="inline-flex items-center gap-2">
                <MoonIcon className="h-4 w-4 text-sage-600" /> {dict.hero.trustNights}
              </span>
            </div>
          </div>

          {/* Hero visual */}
          {hero && (
            <div className="relative animate-fade-in">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-sand-200 shadow-lift md:aspect-[4/4.4]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={hero.images[0]}
                  alt={hero.name}
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="absolute -bottom-5 -left-5 hidden rounded-2xl bg-sand-50 px-5 py-4 shadow-soft sm:block">
                <p className="font-serif text-lg text-ink">{hero.name}</p>
                <p className="text-xs text-ink-muted">{hero.tagline}</p>
              </div>
              <div className="absolute -right-4 top-8 hidden rounded-full bg-sage-600 px-4 py-2 text-xs font-medium text-white shadow-soft sm:block">
                {dict.hero.priceFrom} €249
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ───────────── VALUE STRIP ───────────── */}
      <section className="border-y border-ink/10 bg-sand-100">
        <div className="container-x grid gap-8 py-12 sm:grid-cols-3">
          {[
            {
              icon: <LeafIcon className="h-6 w-6" />,
              title: dict.values.v1Title,
              text: dict.values.v1Text,
            },
            {
              icon: <ShieldIcon className="h-6 w-6" />,
              title: dict.values.v2Title,
              text: dict.values.v2Text,
            },
            {
              icon: <MoonIcon className="h-6 w-6" />,
              title: dict.values.v3Title,
              text: dict.values.v3Text,
            },
          ].map((f, i) => (
            <Reveal key={f.title} delay={i * 80}>
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-sage-100 text-sage-600">
                  {f.icon}
                </div>
                <div>
                  <h3 className="font-serif text-lg text-ink">{f.title}</h3>
                  <p className="mt-1 text-sm text-ink-muted">{f.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ───────────── FEATURED COLLECTION ───────────── */}
      <section id="collection" className="container-x py-20 md:py-28">
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <div>
              <span className="eyebrow">{dict.collection.eyebrow}</span>
              <h2 className="mt-4 max-w-xl font-serif text-4xl font-light text-ink md:text-5xl">
                {dict.collection.homeTitle}
              </h2>
            </div>
            <Link
              href="/collection"
              className="inline-flex items-center gap-2 text-sm font-medium text-sage-600 hover:gap-3 transition-all"
            >
              {dict.collection.viewAll} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {all.map((p, i) => (
            <Reveal key={p.id} delay={(i % 3) * 90}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ───────────── STORY ───────────── */}
      <section id="story" className="bg-ink text-sand-100">
        <div className="container-x grid items-center gap-14 py-20 md:grid-cols-2 md:py-28">
          <Reveal>
            <div>
              <span className="text-xs font-medium uppercase tracking-brand text-sage-300">
                {dict.story.eyebrow}
              </span>
              <h2 className="mt-5 font-serif text-4xl font-light leading-tight md:text-5xl">
                {dict.story.titleLine1}
                <br />
                {dict.story.titleLine2}
              </h2>
              <p className="mt-6 max-w-md leading-relaxed text-sand-300">
                {dict.story.p1}
              </p>
              <p className="mt-4 max-w-md leading-relaxed text-sand-300">
                {dict.story.p2}
              </p>
              <Link href="/collection" className="btn-ghost mt-8 border-sand-300/30 text-sand-100 hover:border-sand-300/60 hover:bg-white/5">
                {dict.story.cta} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="grid grid-cols-2 gap-4">
              {all.slice(0, 4).map((p) => (
                <div
                  key={p.id}
                  className="aspect-square overflow-hidden rounded-2xl bg-white/5"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───────────── SIZES ───────────── */}
      <section id="sizes" className="container-x py-20 md:py-28">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <span className="eyebrow">{dict.sizes.eyebrow}</span>
            <h2 className="mt-4 font-serif text-4xl font-light text-ink md:text-5xl">
              {dict.sizes.title}
            </h2>
            <p className="mt-5 text-ink-muted">{dict.sizes.subtitle}</p>
          </div>
        </Reveal>
        <div className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { label: "90 × 200", who: dict.sizes.single },
            { label: "120 × 200", who: dict.sizes.smallDouble },
            { label: "160 × 200", who: dict.sizes.queen },
            { label: "180 × 200", who: dict.sizes.king },
          ].map((s, i) => (
            <Reveal key={s.label} delay={i * 70}>
              <div className="rounded-xl2 border border-ink/10 bg-sand-50 p-6 text-center transition-shadow hover:shadow-soft">
                <p className="font-serif text-2xl text-ink">{s.label}</p>
                <p className="mt-2 text-xs uppercase tracking-widest text-ink-muted">
                  {s.who}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ───────────── CTA ───────────── */}
      <section className="container-x pb-24">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] bg-sage-600 px-8 py-16 text-center text-white md:px-16 md:py-20">
            <div className="linen absolute inset-0 opacity-30" />
            <div className="relative">
              <h2 className="mx-auto max-w-2xl font-serif text-4xl font-light leading-tight md:text-5xl">
                {dict.ctaBanner.title}
              </h2>
              <p className="mx-auto mt-5 max-w-md text-sage-50/90">
                {dict.ctaBanner.subtitle}
              </p>
              <Link
                href="/collection"
                className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-medium text-ink transition-all hover:bg-sand-100 hover:shadow-lift"
              >
                {dict.ctaBanner.button} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
