import { RestaurantsTable } from "@/components/admin-panel";
import { getAdminRestaurants } from "@/lib/data-store";

export default async function AdminRestaurantsPage() {
  const restaurants = await getAdminRestaurants();

  return (
    <section className="rounded-[2rem] border border-[rgba(58,32,21,0.08)] bg-white/90 p-6 shadow-[0_25px_60px_rgba(58,32,21,0.08)]">
      <div>
        <div className="text-sm uppercase tracking-[0.25em] text-[var(--muted)]">Restaurants directory</div>
        <h2 className="mt-2 text-2xl font-bold">All restaurants</h2>
      </div>
      <div className="mt-6">
        <RestaurantsTable rows={restaurants} />
      </div>
    </section>
  );
}
