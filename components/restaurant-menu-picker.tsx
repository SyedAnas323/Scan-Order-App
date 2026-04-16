"use client";

import Link from "next/link";

type RestaurantOption = {
  id: string;
  name: string;
  slug: string;
  address?: string | null;
  logoUrl?: string | null;
};

export function RestaurantMenuPicker({
  locale,
  restaurants
}: {
  locale: string;
  restaurants: RestaurantOption[];
}) {
  return (
    <div className="space-y-4">
      <div>
        <div className="text-sm uppercase tracking-[0.25em] text-[var(--muted)]">Browse live menus</div>
        <h2 className="mt-2 text-2xl font-bold">Choose a restaurant and view its menu</h2>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
          Each restaurant appears as a card. The thumbnail is loaded from `logoUrl`, and clicking `View Menu` takes customers directly to the ordering flow.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {restaurants.map((restaurant) => (
          <article
            key={restaurant.id}
            className="overflow-hidden rounded-[1.8rem] border border-[var(--border)] bg-white/90 shadow-[0_18px_45px_rgba(60,35,15,0.08)]"
          >
            {restaurant.logoUrl ? (
              <div className="h-52 w-full overflow-hidden bg-stone-100">
                <img src={restaurant.logoUrl} alt={restaurant.name} className="h-full w-full object-cover" />
              </div>
            ) : (
              <div className="flex h-52 items-end bg-[linear-gradient(135deg,#402113_0%,#8b4218_60%,#f0c36b_100%)] p-6 text-white">
                <div>
                  <div className="text-xs uppercase tracking-[0.35em] text-white/60">Featured restaurant</div>
                  <div className="mt-2 text-3xl font-bold">{restaurant.name}</div>
                </div>
              </div>
            )}

            <div className="p-5">
              <h3 className="text-2xl font-bold">{restaurant.name}</h3>
              <p className="mt-3 min-h-14 text-sm leading-6 text-[var(--muted)]">
                {restaurant.address?.trim()
                  ? restaurant.address
                  : `Browse ${restaurant.name}'s digital menu, select items, and continue to the WhatsApp order flow.`}
              </p>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <div className="rounded-full bg-[var(--surface)] px-3 py-2 text-xs font-semibold text-[var(--brand-dark)]">
                  Live menu
                </div>
                <Link
                  href={`/${locale}/menu/${restaurant.slug}`}
                  className="rounded-full bg-[var(--brand)] px-5 py-3 text-sm font-semibold text-white"
                >
                  View Menu
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
