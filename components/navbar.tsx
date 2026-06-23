"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "./cart-context";
import { CartIcon } from "./icons";

export function Navbar() {
  const { count, open } = useCart();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-sand-50/85 backdrop-blur-md border-b border-ink/5"
          : "bg-transparent"
      }`}
    >
      <nav className="container-x flex h-16 items-center justify-between md:h-20">
        <Link href="/" className="group flex flex-col leading-none">
          <span className="font-serif text-xl tracking-[0.3em] text-ink md:text-2xl">
            LUNOVA
          </span>
          <span className="text-[10px] tracking-[0.45em] text-ink-muted">
            SLEEP
          </span>
        </Link>

        <div className="hidden items-center gap-9 text-sm text-ink-soft md:flex">
          <Link href="/collection" className="transition-colors hover:text-sage-600">
            Collection
          </Link>
          <Link href="/#story" className="transition-colors hover:text-sage-600">
            Our story
          </Link>
          <Link href="/#sizes" className="transition-colors hover:text-sage-600">
            Sizes
          </Link>
          <Link href="/#contact" className="transition-colors hover:text-sage-600">
            Contact
          </Link>
        </div>

        <button
          onClick={open}
          aria-label="Open cart"
          className="relative flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-ink/5"
        >
          <CartIcon className="h-5 w-5" />
          {count > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-sage-600 text-[10px] font-semibold text-white">
              {count}
            </span>
          )}
        </button>
      </nav>
    </header>
  );
}
