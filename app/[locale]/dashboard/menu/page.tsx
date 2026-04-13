import Image from "next/image";
import { AddCategoryForm, AddMenuItemForm } from "@/components/dashboard-forms";
import { requireSession } from "@/lib/auth";
import { getRestaurantBundleByUserId } from "@/lib/data-store";
import { formatCurrency } from "@/lib/utils";

export default async function DashboardMenuPage() {
  const session = await requireSession();
  const bundle = await getRestaurantBundleByUserId(session.userId);
  if (!bundle) {
    return null;
  }

  return (
    <div className="space-y-6">
      <section className="glass rounded-[2rem] p-6">
        <h2 className="text-2xl font-bold">Create categories</h2>
        <div className="mt-4">
          <AddCategoryForm />
        </div>
      </section>
      <section className="glass rounded-[2rem] p-6">
        <h2 className="text-2xl font-bold">Add menu item</h2>
        <div className="mt-4">
          <AddMenuItemForm categories={bundle.categories} />
        </div>
      </section>
      <section className="space-y-4">
        {bundle.categories.map((category) => {
          const items = bundle.menuItems.filter((item) => item.categoryId === category.id);
          return (
            <article key={category.id} className="glass rounded-[2rem] p-6">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-2xl font-bold">{category.name}</h3>
                <span className="pill">{items.length} items</span>
              </div>
              <div className="mt-4 grid gap-4">
                {items.length ? (
                  items.map((item) => (
                    <div key={item.id} className="grid gap-4 rounded-[1.5rem] bg-white/75 p-4 md:grid-cols-[120px_1fr_auto] md:items-center">
                      <div className="relative min-h-28 overflow-hidden rounded-[1.2rem]">
                        {item.imageUrl ? <Image src={item.imageUrl} alt={item.name} fill className="object-cover" /> : <div className="flex h-full items-center justify-center bg-[var(--accent)]/30 font-semibold">{item.name}</div>}
                      </div>
                      <div>
                        <div className="text-lg font-bold">{item.name}</div>
                        <p className="mt-1 text-sm text-[var(--muted)]">{item.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">{formatCurrency(item.price, bundle.restaurant.currency)}</div>
                        <div className="mt-2 text-sm text-[var(--muted)]">{item.available ? "Available" : "Unavailable"}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-[1.4rem] border border-dashed border-[var(--border)] px-4 py-6 text-sm text-[var(--muted)]">No items in this category yet.</div>
                )}
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
