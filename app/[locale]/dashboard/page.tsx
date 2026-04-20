import Link from "next/link";
import { requireSession } from "@/lib/auth";
import { getRestaurantBundleByUserId, getRestaurantOrders } from "@/lib/data-store";
import { getTranslations, type Locale } from "@/lib/i18n";
import { AdminOrder } from "@/lib/types";

export default async function DashboardOverview({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const session = await requireSession();
  const bundle = await getRestaurantBundleByUserId(session.userId);
  const orders = await getRestaurantOrders(session.restaurantId);
  if (!bundle) {
    return null;
  }
  const pendingOrders = orders.filter((order: AdminOrder) => order.status === "pending");
  const t = getTranslations(locale);
  const summaryCards: Array<[string, string]> = [
    [t.dashboard.onboardingDone, bundle.user.subscriptionStatus],
    [t.dashboard.menuItems, String(bundle.menuItems.length)],
    [t.dashboard.tablesCount, String(bundle.tables.length)]
  ];

  return (
    <div className="space-y-6">
      {pendingOrders.length ? (
        <section className="glass rounded-[2rem] border border-[var(--success)]/25 bg-[var(--success)]/10 p-5">
          <div className="text-sm uppercase tracking-[0.25em] text-[var(--success)]">New orders</div>
          <div className="mt-2 text-xl font-bold">{pendingOrders.length} pending customer orders</div>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Latest order by {pendingOrders[0].customerName} {pendingOrders[0].tableName ? `(${pendingOrders[0].tableName})` : ""}.
          </p>
          <Link href={`/${locale}/dashboard/orders`} className="mt-4 inline-flex rounded-full bg-[var(--success)] px-5 py-2 text-sm font-semibold text-white">
            Open orders
          </Link>
        </section>
      ) : null}

      <section className="grid gap-4 md:grid-cols-3">
        {summaryCards.map(([label, value]) => (
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
