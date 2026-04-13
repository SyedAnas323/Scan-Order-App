import Link from "next/link";
import { LanguageSwitcher } from "@/components/language-switcher";
import { getTranslations, type Locale } from "@/lib/i18n";

export function SiteHeader({ locale }: { locale: Locale }) {
  const t = getTranslations(locale);

  return (
    <header className="shell flex items-center justify-between py-6">
      <Link href={`/${locale}`} className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--brand)] text-lg font-bold text-white">S</div>
        <div>
          <div className="text-lg font-bold">{t.common.appName}</div>
          <div className="text-sm text-[var(--muted)]">QR menus + WhatsApp orders</div>
        </div>
      </Link>

      <div className="flex items-center gap-3">
        <LanguageSwitcher currentLocale={locale} />
        <Link href={`/${locale}/login`} className="rounded-full border border-[var(--border)] px-4 py-2 text-sm font-semibold">
          {t.common.login}
        </Link>
        <Link href={`/${locale}/signup`} className="rounded-full bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-white">
          {t.common.getStarted}
        </Link>
      </div>
    </header>
  );
}
