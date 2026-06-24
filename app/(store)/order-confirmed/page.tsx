import Link from "next/link";
import { CheckIcon, ArrowRight } from "@/components/icons";
import { getDictionary } from "@/lib/i18n/server";

export const metadata = { title: "Order confirmed" };
export const dynamic = "force-dynamic";

export default function OrderConfirmedPage({
  searchParams,
}: {
  searchParams: { n?: string };
}) {
  const dict = getDictionary();
  const orderNumber = searchParams.n;

  return (
    <div className="container-x flex min-h-[70vh] flex-col items-center justify-center py-16 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-sage-100 text-sage-600">
        <CheckIcon className="h-10 w-10" />
      </div>
      <h1 className="mt-8 font-serif text-4xl font-light text-ink md:text-5xl">
        {dict.confirmed.title}
      </h1>
      <p className="mt-5 max-w-md text-ink-soft">{dict.confirmed.text}</p>

      {orderNumber && (
        <div className="mt-8 rounded-xl2 border border-ink/10 bg-sand-100 px-8 py-5">
          <p className="text-xs uppercase tracking-widest text-ink-muted">
            {dict.confirmed.orderNumber}
          </p>
          <p className="mt-1 font-serif text-2xl text-ink">{orderNumber}</p>
        </div>
      )}

      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <Link href="/" className="btn-primary">
          {dict.confirmed.backHome} <ArrowRight className="h-4 w-4" />
        </Link>
        <Link href="/collection" className="btn-ghost">
          {dict.confirmed.keepBrowsing}
        </Link>
      </div>
    </div>
  );
}
