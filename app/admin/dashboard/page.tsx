import { AdminStatusActions } from "@/components/admin-panel";
import { getAdminDashboardData, getAdminRestaurants, getAdminSummary } from "@/lib/data-store";
import { formatCurrency } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const summary = await getAdminSummary();
  const restaurants = await getAdminRestaurants();
  const dashboard = await getAdminDashboardData();

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-[2rem] border border-[rgba(58,32,21,0.08)] bg-white/90 p-5 shadow-[0_25px_60px_rgba(58,32,21,0.08)]">
          <div className="text-sm uppercase tracking-[0.25em] text-[var(--muted)]">Total restaurants</div>
          <div className="mt-3 text-4xl font-bold">{summary.restaurantCount}</div>
        </article>
        <article className="rounded-[2rem] border border-[rgba(58,32,21,0.08)] bg-white/90 p-5 shadow-[0_25px_60px_rgba(58,32,21,0.08)]">
          <div className="text-sm uppercase tracking-[0.25em] text-[var(--muted)]">Total users</div>
          <div className="mt-3 text-4xl font-bold">{summary.userCount}</div>
        </article>
      </section>

      <section className="rounded-[2rem] border border-[rgba(58,32,21,0.08)] bg-white/90 p-6 shadow-[0_25px_60px_rgba(58,32,21,0.08)]">
        <div>
          <div className="text-sm uppercase tracking-[0.25em] text-[var(--muted)]">Orders</div>
          <h2 className="mt-2 text-2xl font-bold">Recent customer orders (read-only)</h2>
        </div>
        <div className="mt-6 space-y-4">
          {dashboard.recentOrders.length ? (
            dashboard.recentOrders.map((order) => (
              <article key={order.id} className="rounded-[1.4rem] border border-[var(--border)] bg-[var(--surface)] p-4">
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
                  <div>
                    <div className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Restaurant</div>
                    <div className="mt-1 font-semibold">{order.restaurantName}</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Customer</div>
                    <div className="mt-1 font-semibold">{order.customerName}</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Phone</div>
                    <div className="mt-1 font-semibold">{order.customerPhone ?? "-"}</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Table</div>
                    <div className="mt-1 font-semibold">{order.tableName ?? "-"}</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Status</div>
                    <div className="mt-1 font-semibold capitalize">{order.status}</div>
                  </div>
                </div>
                <div className="mt-3 text-sm text-[var(--muted)]">{order.customerAddress ?? "No address provided"}</div>
                <div className="mt-3 space-y-1 text-sm">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-3">
                      <span>
                        {item.menuItemName} x{item.quantity}
                      </span>
                      <span>{formatCurrency(item.lineTotal)}</span>
                    </div>
                  ))}
                  <div className="mt-2 flex items-center justify-between border-t border-[var(--border)] pt-2 font-semibold">
                    <span>Total</span>
                    <span>{formatCurrency(order.totalAmount)}</span>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-[1.4rem] border border-dashed border-[var(--border)] px-4 py-5 text-sm text-[var(--muted)]">
              No recent orders.
            </div>
          )}
        </div>
      </section>

      <section className="rounded-[2rem] border border-[rgba(58,32,21,0.08)] bg-white/90 p-6 shadow-[0_25px_60px_rgba(58,32,21,0.08)]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-sm uppercase tracking-[0.25em] text-[var(--muted)]">Restaurants</div>
            <h2 className="mt-2 text-2xl font-bold">All restaurants with subscription status</h2>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {restaurants.map((row) => (
            <article key={row.restaurant.id} className="rounded-[1.6rem] border border-[var(--border)] bg-white p-5 shadow-[0_12px_30px_rgba(58,32,21,0.06)]">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div>
                  <div className="text-xs uppercase tracking-[0.25em] text-[var(--muted)]">Restaurant</div>
                  <div className="mt-1 font-semibold">{row.restaurant.name}</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-[0.25em] text-[var(--muted)]">Owner</div>
                  <div className="mt-1 font-semibold">{row.owner.name}</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-[0.25em] text-[var(--muted)]">Status</div>
                  <div className="mt-1 font-semibold">{row.owner.subscriptionStatus.toUpperCase()}</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-[0.25em] text-[var(--muted)]">Slug</div>
                  <div className="mt-1 font-semibold">{row.restaurant.slug}</div>
                </div>
              </div>
              <div className="mt-5 rounded-[1.4rem] border border-[var(--border)] bg-[var(--surface)] p-4">
                <div className="mb-3 text-xs uppercase tracking-[0.25em] text-[var(--muted)]">Change subscription status</div>
                <AdminStatusActions user={row.owner} />
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
