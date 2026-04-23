import { AdminStatusActions } from "@/components/admin-panel";
import { getAdminDashboardData, getAdminRestaurants, getAdminSummary } from "@/lib/data-store";
import { formatCurrency } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const summary = await getAdminSummary();
  const restaurants = await getAdminRestaurants();
  const dashboard = await getAdminDashboardData();

  const statusCounts = dashboard.recentOrders.reduce(
    (acc, order) => {
      acc[order.status] += 1;
      return acc;
    },
    {
      pending: 0,
      accepted: 0,
      completed: 0,
      delivered: 0,
      rejected: 0,
      canceled: 0
    } as Record<(typeof dashboard.recentOrders)[number]["status"], number>
  );

  const statusBadgeClass: Record<(typeof dashboard.recentOrders)[number]["status"], string> = {
    pending: "border-amber-200 bg-amber-50 text-amber-700",
    accepted: "border-emerald-200 bg-emerald-50 text-emerald-700",
    completed: "border-sky-200 bg-sky-50 text-sky-700",
    delivered: "border-[var(--success)] bg-emerald-100 text-emerald-800",
    rejected: "border-rose-200 bg-rose-50 text-rose-700",
    canceled: "border-stone-300 bg-stone-100 text-stone-700"
  };

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
        <div className="mt-4 flex flex-wrap gap-2">
          <div className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">Pending: {statusCounts.pending}</div>
          <div className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Accepted: {statusCounts.accepted}</div>
          <div className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">Completed: {statusCounts.completed}</div>
          <div className="rounded-full border border-[var(--success)] bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">Delivered: {statusCounts.delivered}</div>
          <div className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">Rejected: {statusCounts.rejected}</div>
          <div className="rounded-full border border-stone-300 bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-700">Canceled: {statusCounts.canceled}</div>
        </div>
        <div className="mt-6 space-y-4">
          {dashboard.recentOrders.length ? (
            dashboard.recentOrders.map((order) => (
              <article key={order.id} className="rounded-[1.4rem] border border-[var(--border)] bg-[var(--surface)] p-4">
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
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
                    <div className="mt-1">
                      <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase ${statusBadgeClass[order.status]}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Time</div>
                    <div className="mt-1 font-semibold">{new Date(order.createdAt).toLocaleString()}</div>
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
