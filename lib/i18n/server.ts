import { cookies } from "next/headers";
import {
  dictionaries,
  DEFAULT_LOCALE,
  type Dictionary,
  type Locale,
} from "./dictionaries";

export const LOCALE_COOKIE = "lang";

/** Reads the chosen locale from the cookie (defaults to Albanian). */
export function getLocale(): Locale {
  const value = cookies().get(LOCALE_COOKIE)?.value;
  return value === "en" || value === "sq" ? value : DEFAULT_LOCALE;
}

export function getDictionary(locale: Locale = getLocale()): Dictionary {
  return dictionaries[locale];
}
