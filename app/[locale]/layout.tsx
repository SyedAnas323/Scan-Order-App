import { ReactNode } from "react";
import { notFound } from "next/navigation";
import { getLocaleDirection, getTranslations, isSupportedLocale } from "@/lib/i18n";
import { Locale } from "@/lib/types";

export default async function LocaleLayout({
  children,
  params
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) {
    notFound();
  }

  const safeLocale = locale as Locale;
  const t = getTranslations(safeLocale);

  return (
    <div dir={getLocaleDirection(safeLocale)}>
      <a
        href={`/${locale}`}
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2"
      >
        {t.common.skipToContent}
      </a>
      {children}
    </div>
  );
}

export async function generateStaticParams() {
  return [{ locale: "en" }, { locale: "ur" }, { locale: "ar" }, { locale: "it" }];
}
