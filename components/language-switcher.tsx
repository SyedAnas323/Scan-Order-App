"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { supportedLocales } from "@/lib/i18n";
import { Locale } from "@/lib/types";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ currentLocale }: { currentLocale: Locale }) {
  const pathname = usePathname();
  const suffix = pathname.replace(/^\/(en|ur|ar|it)/, "") || "";

  return (
    <div className="flex items-center gap-2">
      {supportedLocales.map((locale) => (
        <Link
          key={locale}
          href={`/${locale}${suffix}`}
          className={cn(
            "rounded-full border px-3 py-1 text-sm transition",
            currentLocale === locale ? "border-[var(--brand)] bg-[var(--brand)] text-white" : "border-[var(--border)] bg-white/70"
          )}
        >
          {locale.toUpperCase()}
        </Link>
      ))}
    </div>
  );
}
