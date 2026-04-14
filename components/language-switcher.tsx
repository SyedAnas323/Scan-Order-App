"use client";

import { usePathname } from "next/navigation";
import { supportedLocales } from "@/lib/i18n";
import { Locale } from "@/lib/types";

export function LanguageSwitcher({ currentLocale }: { currentLocale: Locale }) {
  const pathname = usePathname();
  const suffix = pathname.replace(/^\/(en|ur|ar|it)/, "") || "";

  return (
    <label className="relative block">
      <span className="sr-only">Language</span>
      <select
        value={currentLocale}
        onChange={(event) => {
          window.location.href = `/${event.target.value}${suffix}`;
        }}
        className="appearance-none rounded-full border border-[var(--border)] bg-white/85 px-4 py-2 pr-10 text-sm font-semibold text-[var(--foreground)] outline-none"
      >
        {supportedLocales.map((locale) => (
          <option key={locale} value={locale}>
            {locale === "en" ? "English" : locale === "ur" ? "Urdu" : locale === "ar" ? "Arabic" : "Italian"}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[var(--muted)]">v</span>
    </label>
  );
}
