"use client";

import Link from "next/link";

type RestaurantOption = {
  id: string;
  name: string;
  slug: string;
  address?: string | null;
  logoUrl?: string | null;
  bannerUrl?: string | null;
  whatsappNumber?: string | null;
  menuUrl: string;
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
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">Tap any card to open the restaurant menu flow.</p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {restaurants.map((restaurant) => (
          <article
            key={restaurant.id}
            className="overflow-hidden rounded-[1.8rem] border border-[var(--border)] bg-white/90 shadow-[0_18px_45px_rgba(60,35,15,0.08)]"
          >
            <div className="relative h-44 bg-[linear-gradient(135deg,#402113_0%,#8b4218_58%,#f0c36b_100%)]">
              {restaurant.bannerUrl ? (
                <img src={restaurant.bannerUrl} alt={`${restaurant.name} banner`} className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full bg-[linear-gradient(135deg,#402113_0%,#8b4218_58%,#f0c36b_100%)]" />
              )}
              <div className="absolute left-6 top-6 text-4xl font-bold text-white">{restaurant.name}</div>

              <div className="absolute -bottom-10 left-6 h-20 w-20 rounded-full border-4 border-white bg-[#f3efe8] shadow-[0_10px_25px_rgba(0,0,0,0.12)]">
                {restaurant.logoUrl ? (
                  <img src={restaurant.logoUrl} alt={`${restaurant.name} logo`} className="h-full w-full rounded-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-[var(--brand-dark)]">
                    {restaurant.name.slice(0, 1).toUpperCase()}
                  </div>
                )}
              </div>
            </div>

            <div className="p-5 pt-14">
              <h3 className="text-[2rem] leading-none font-bold">{restaurant.name}</h3>
              <div className="mt-5 space-y-2 text-sm leading-6 text-[var(--muted)]">
                <p>{restaurant.address?.trim() ? restaurant.address : "Address not added yet."}</p>
                <p>{restaurant.whatsappNumber?.trim() ? restaurant.whatsappNumber : "Phone not added yet."}</p>
                <p className="break-all">{restaurant.menuUrl}</p>
              </div>

              <div className="mt-6 flex justify-end">
                <Link
                  href={`/${locale}/menu/${restaurant.slug}`}
                  className="rounded-full bg-[var(--brand)] px-8 py-3 text-lg font-semibold text-white"
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
