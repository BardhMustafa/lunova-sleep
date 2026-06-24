"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Dictionary, Locale } from "@/lib/i18n/dictionaries";

type I18nValue = { dict: Dictionary; locale: Locale };

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({
  dict,
  locale,
  children,
}: I18nValue & { children: ReactNode }) {
  return (
    <I18nContext.Provider value={{ dict, locale }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
