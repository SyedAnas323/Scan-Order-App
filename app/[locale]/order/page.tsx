import { RestaurantMenuPicker } from "@/components/restaurant-menu-picker";
import { SiteHeader } from "@/components/site-header";
import { getPublicRestaurants } from "@/lib/data-store";
import { Locale } from "@/lib/types";

export default async function OrderPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const restaurants = await getPublicRestaurants();

  return (
    <div className="pb-16">
      <SiteHeader locale={locale} />
      <main className="shell pt-10">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-[var(--border)] bg-white/85 p-6 shadow-[0_24px_90px_rgba(60,35,15,0.08)]">
          {restaurants.length ? (
            <RestaurantMenuPicker
              locale={locale}
              restaurants={restaurants.map((restaurant) => ({
                id: restaurant.id,
                name: restaurant.name,
                slug: restaurant.slug
              }))}
            />
          ) : (
            <div className="rounded-[1.4rem] border border-dashed border-[var(--border)] bg-[var(--surface)] px-4 py-6 text-sm text-[var(--muted)]">
              No restaurants are available right now.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
