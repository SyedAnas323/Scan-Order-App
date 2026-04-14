import Link from "next/link";
import { requireSession } from "@/lib/auth";
import { getRestaurantBundleByUserId } from "@/lib/data-store";
import { getTranslations, type Locale } from "@/lib/i18n";

export default async function DashboardOverview({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const session = await requireSession();
  const bundle = await getRestaurantBundleByUserId(session.userId);
  if (!bundle) {
    return null;
  }
  const t = getTranslations(locale);

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        {[
          [t.dashboard.onboardingDone, bundle.user.subscriptionStatus],
          [t.dashboard.menuItems, String(bundle.menuItems.length)],
          [t.dashboard.tablesCount, String(bundle.tables.length)]
        ].map(([label, value]: [string, string]) => (
          <article key={label} className="glass rounded-[2rem] p-5">
            <div className="text-sm uppercase tracking-[0.25em] text-[var(--muted)]">{label}</div>
            <div className="mt-3 text-3xl font-bold">{value}</div>
          </article>
        ))}
      </section>

      <section className="glass rounded-[2rem] p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-sm uppercase tracking-[0.25em] text-[var(--muted)]">{t.dashboard.dedicatedUrl}</div>
            <div className="mt-2 text-2xl font-bold">{bundle.restaurant.slug}</div>
            <p className="mt-2 text-[var(--muted)]">{t.dashboard.setupHint}</p>
          </div>
          <Link href={`/${locale}/menu/${bundle.restaurant.slug}`} target="_blank" className="rounded-full bg-[var(--brand)] px-5 py-3 font-semibold text-white">
            View live menu
          </Link>
        </div>
      </section>
    </div>
  );
}
