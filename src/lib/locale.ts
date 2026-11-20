"use server";

import { intlConfig, type Locale, updateLocale } from "@/i18n/generated";

// Set from a Server Action, the cookie re-renders the page in the same round
// trip in the new language.
export async function changeLocale(locale: Locale) {
  if (intlConfig.locales.includes(locale)) await updateLocale(locale);
}
