"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type RestaurantOption = {
  id: string;
  name: string;
  slug: string;
};

export function RestaurantMenuPicker({
  locale,
  restaurants
}: {
  locale: string;
  restaurants: RestaurantOption[];
}) {
  const router = useRouter();
  const [selectedSlug, setSelectedSlug] = useState(restaurants[0]?.slug ?? "");

  const openMenu = () => {
    if (!selectedSlug) {
      return;
    }

    router.push(`/${locale}/menu/${selectedSlug}`);
  };

  return (
    <div className="space-y-4">
      <div>
        <div className="text-sm uppercase tracking-[0.25em] text-[var(--muted)]">Browse live menus</div>
        <h2 className="mt-2 text-2xl font-bold">Select a restaurant and open its menu</h2>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
          Dropdown se restaurant choose karo aur usi waqt existing menu flow open ho jayega jahan customer items select karke order kar sakta hai.
        </p>
      </div>

      <div className="rounded-[1.6rem] border border-[var(--border)] bg-white/85 p-4 shadow-sm">
        <label className="block text-sm font-semibold text-[var(--muted)]" htmlFor="restaurant-picker">
          Restaurants list
        </label>
        <select
          id="restaurant-picker"
          value={selectedSlug}
          onChange={(event) => setSelectedSlug(event.target.value)}
          className="mt-3 w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none"
        >
          {restaurants.map((restaurant) => (
            <option key={restaurant.id} value={restaurant.slug}>
              {restaurant.name}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={openMenu}
          disabled={!selectedSlug}
          className="mt-4 w-full rounded-2xl bg-[var(--brand)] px-4 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:bg-stone-300"
        >
          Open menu and order
        </button>
      </div>
    </div>
  );
}
