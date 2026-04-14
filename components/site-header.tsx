import Link from "next/link";
import { LanguageSwitcher } from "@/components/language-switcher";
import { getTranslations, type Locale } from "@/lib/i18n";

export function SiteHeader({ locale }: { locale: Locale }) {
  const t = getTranslations(locale);

  return (
    <header className="shell flex items-center justify-between py-6">
      <Link href={`/${locale}`} className="flex items-center gap-3">
        <div className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-[1.4rem] bg-[linear-gradient(145deg,#c55b1f_0%,#8b300f_100%)] shadow-[0_14px_30px_rgba(139,48,15,0.28)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.25),transparent_45%)]" />
          <div className="relative h-8 w-8">
            <div className="absolute left-0 top-1 h-5 w-5 rounded-full border-[3px] border-white/95" />
            <div className="absolute right-0 top-0 h-4 w-4 rounded-full bg-[var(--accent)]" />
            <div className="absolute bottom-0 left-2 h-3 w-4 rounded-t-full border-t-[3px] border-white/95" />
          </div>
        </div>
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
