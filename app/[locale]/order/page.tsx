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
      <main className="shell pt-6 sm:pt-8 lg:pt-10">
        <div className="mx-auto max-w-6xl rounded-[1.6rem] border border-[var(--border)] bg-white/85 p-4 shadow-[0_24px_90px_rgba(60,35,15,0.08)] sm:rounded-[2rem] sm:p-6">
          {restaurants.length ? (
            <RestaurantMenuPicker
              locale={locale}
              restaurants={restaurants.map((restaurant) => ({
                id: restaurant.id,
                name: restaurant.name,
                slug: restaurant.slug,
                address: restaurant.address,
                logoUrl: restaurant.logoUrl,
                bannerUrl: restaurant.bannerUrl,
                whatsappNumber: restaurant.whatsappNumber,
                menuUrl: `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/${locale}/menu/${restaurant.slug}`
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
