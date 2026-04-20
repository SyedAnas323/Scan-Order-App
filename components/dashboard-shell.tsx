"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { LanguageSwitcher } from "@/components/language-switcher";
import { getTranslations } from "@/lib/i18n";
import { Locale, Restaurant } from "@/lib/types";

export function DashboardShell({
  locale,
  restaurant,
  children
}: {
  locale: Locale;
  restaurant: Restaurant;
  children: ReactNode;
}) {
  const t = getTranslations(locale);

  return (
    <div className="shell py-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-[2rem] border border-[var(--border)] bg-white/75 p-5">
        <div>
          <div className="text-sm uppercase tracking-[0.3em] text-[var(--muted)]">{t.common.dashboard}</div>
          <h1 className="mt-1 text-2xl font-bold sm:text-3xl">{restaurant.name}</h1>
        </div>
        <div className="flex items-center gap-3">
          <LanguageSwitcher currentLocale={locale} />
          <form
            action="/api/auth/logout"
            method="post"
            onSubmit={(event) => {
              event.preventDefault();
              fetch("/api/auth/logout", { method: "POST" }).then(() => {
                window.location.href = `/${locale}/login`;
              });
            }}
          >
            <button className="rounded-full border border-[var(--border)] px-4 py-2 text-sm font-semibold">{t.common.logout}</button>
          </form>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="glass rounded-[2rem] p-4">
          <nav className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-1">
            <Link href={`/${locale}/dashboard`} className="block rounded-2xl px-3 py-3 text-sm hover:bg-white/60 sm:px-4 sm:text-base">
              {t.common.dashboard}
            </Link>
            <Link href={`/${locale}/dashboard/menu`} className="block rounded-2xl px-3 py-3 text-sm hover:bg-white/60 sm:px-4 sm:text-base">
              {t.common.menu}
            </Link>
            <Link href={`/${locale}/dashboard/orders`} className="block rounded-2xl px-3 py-3 text-sm hover:bg-white/60 sm:px-4 sm:text-base">
              Orders
            </Link>
            <Link href={`/${locale}/dashboard/tables`} className="block rounded-2xl px-3 py-3 text-sm hover:bg-white/60 sm:px-4 sm:text-base">
              {t.common.tables}
            </Link>
            <Link href={`/${locale}/dashboard/settings`} className="block rounded-2xl px-3 py-3 text-sm hover:bg-white/60 sm:px-4 sm:text-base">
              {t.common.settings}
            </Link>
          </nav>
        </aside>
        <main>{children}</main>
      </div>
    </div>
  );
}
