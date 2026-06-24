"use client";

import { useRouter } from "next/navigation";
import { useI18n } from "./i18n-provider";
import type { Locale } from "@/lib/i18n/dictionaries";

export function LanguageSwitcher() {
  const router = useRouter();
  const { locale } = useI18n();

  function choose(next: Locale) {
    if (next === locale) return;
    document.cookie = `lang=${next};path=/;max-age=31536000;samesite=lax`;
    router.refresh();
  }

  const options: { code: Locale; label: string }[] = [
    { code: "sq", label: "SQ" },
    { code: "en", label: "EN" },
  ];

  return (
    <div className="flex items-center rounded-full border border-ink/15 p-0.5 text-xs">
      {options.map((o) => (
        <button
          key={o.code}
          onClick={() => choose(o.code)}
          aria-pressed={locale === o.code}
          className={`rounded-full px-2.5 py-1 font-medium transition-colors ${
            locale === o.code
              ? "bg-ink text-sand-50"
              : "text-ink-muted hover:text-ink"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
