import { ReactNode } from "react";
import { notFound } from "next/navigation";
import { DashboardShell } from "@/components/dashboard-shell";
import { requireSession } from "@/lib/auth";
import { getRestaurantBundleByUserId } from "@/lib/data-store";
import { isSupportedLocale, type Locale } from "@/lib/i18n";

export default async function DashboardLayout({
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

  const session = await requireSession();
  const bundle = await getRestaurantBundleByUserId(session.userId);
  if (!bundle) {
    notFound();
  }

  return (
    <DashboardShell locale={locale as Locale} restaurant={bundle.restaurant}>
      {children}
    </DashboardShell>
  );
}
