"use client";

import { useRouter } from "next/navigation";
import type { Locale } from "@/i18n/generated";
import { changeLocale } from "@/lib/locale";

const NAMES: Record<Locale, string> = { en: "English", pt: "Português" };

/**
 * The language, as links to each language's address (`/`, and `/pt`, which
 * is always Portuguese: src/proxy.ts), so crawlers find both. A click sets the
 * cookie with a Server Action, then moves to that address: through the router,
 * since the proxy maps the subdomain's `/` to the line, which a redirect from
 * the action would skip.
 */
export function Languages({
  current,
  label,
}: {
  current: Locale;
  label: string;
}) {
  const router = useRouter();
  return (
    <nav aria-label={label} className="ml-auto flex gap-4">
      {(Object.keys(NAMES) as Locale[]).map((locale) => {
        const href = locale === "pt" ? "/pt" : "/";
        return (
          <a
            key={locale}
            href={href}
            lang={locale}
            hrefLang={locale}
            aria-current={locale === current}
            className="text-muted-foreground transition-colors hover:text-foreground aria-[current=true]:text-foreground"
            onClick={async (event) => {
              event.preventDefault();
              await changeLocale(locale);
              router.replace(href, { scroll: false });
            }}
          >
            {NAMES[locale]}
          </a>
        );
      })}
    </nav>
  );
}
