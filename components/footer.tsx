import Link from "next/link";

export function Footer() {
  return (
    <footer id="contact" className="border-t border-ink/10 bg-sand-100">
      <div className="container-x grid gap-12 py-16 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <div className="flex flex-col leading-none">
            <span className="font-serif text-2xl tracking-[0.3em] text-ink">
              LUNOVA
            </span>
            <span className="text-[10px] tracking-[0.45em] text-ink-muted">
              SLEEP
            </span>
          </div>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-ink-muted">
            Simple, good-looking beds for real life — designed for the kind of
            rest you feel the next morning.
          </p>
        </div>

        <div>
          <h4 className="eyebrow mb-4">Explore</h4>
          <ul className="space-y-3 text-sm text-ink-soft">
            <li>
              <Link href="/collection" className="hover:text-sage-600">
                The collection
              </Link>
            </li>
            <li>
              <Link href="/#story" className="hover:text-sage-600">
                Our story
              </Link>
            </li>
            <li>
              <Link href="/#sizes" className="hover:text-sage-600">
                Sizes & fit
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="eyebrow mb-4">Get in touch</h4>
          <ul className="space-y-3 text-sm text-ink-soft">
            <li>
              <a href="mailto:hello@lunovasleep.com" className="hover:text-sage-600">
                hello@lunovasleep.com
              </a>
            </li>
            <li>Pay on delivery, everywhere we ship.</li>
            <li>
              <Link href="/admin" className="text-ink-muted hover:text-sage-600">
                Store login
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-ink/10">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-6 text-xs text-ink-muted md:flex-row">
          <p>© {new Date().getFullYear()} Lunova Sleep. All rights reserved.</p>
          <p>Made for good mornings.</p>
        </div>
      </div>
    </footer>
  );
}
