import { RestaurantOrderActions } from "@/components/restaurant-order-actions";
import { requireSession } from "@/lib/auth";
import { getRestaurantOrders } from "@/lib/data-store";
import { AdminOrder } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

export default async function DashboardOrdersPage() {
  const session = await requireSession();
  const orders = await getRestaurantOrders(session.restaurantId);
  const pendingCount = orders.filter((order: AdminOrder) => order.status === "pending").length;

  const statusCounts: Record<AdminOrder["status"], number> = {
    pending: 0,
    accepted: 0,
    completed: 0,
    delivered: 0,
    rejected: 0,
    canceled: 0
  };
  for (const order of orders as AdminOrder[]) {
    statusCounts[order.status] += 1;
  }

  const statusBadgeClass: Record<AdminOrder["status"], string> = {
    pending: "border-amber-200 bg-amber-50 text-amber-700",
    accepted: "border-emerald-200 bg-emerald-50 text-emerald-700",
    completed: "border-sky-200 bg-sky-50 text-sky-700",
    delivered: "border-[var(--success)] bg-emerald-100 text-emerald-800",
    rejected: "border-rose-200 bg-rose-50 text-rose-700",
    canceled: "border-stone-300 bg-stone-100 text-stone-700"
  };

  return (
    <div className="space-y-6">
      <section className="glass rounded-[2rem] p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-sm uppercase tracking-[0.25em] text-[var(--muted)]">Live orders</div>
            <h2 className="mt-2 text-2xl font-bold">Customer orders</h2>
          </div>
          <div className="pill">{pendingCount} pending</div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <div className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
            Pending: {statusCounts.pending}
          </div>
          <div className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            Accepted: {statusCounts.accepted}
          </div>
          <div className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
            Completed: {statusCounts.completed}
          </div>
          <div className="rounded-full border border-[var(--success)] bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
            Delivered: {statusCounts.delivered}
          </div>
          <div className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
            Rejected: {statusCounts.rejected}
          </div>
          <div className="rounded-full border border-stone-300 bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-700">
            Canceled: {statusCounts.canceled}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        {orders.length ? (
          orders.map((order: AdminOrder) => (
            <article key={order.id} className="glass rounded-[1.8rem] p-5">
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
                <div>
                  <div className="text-xs uppercase tracking-[0.25em] text-[var(--muted)]">Customer</div>
                  <div className="mt-1 font-semibold">{order.customerName}</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-[0.25em] text-[var(--muted)]">Phone</div>
                  <div className="mt-1 font-semibold">{order.customerPhone ?? "-"}</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-[0.25em] text-[var(--muted)]">Address</div>
                  <div className="mt-1 font-semibold">{order.customerAddress ?? "-"}</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-[0.25em] text-[var(--muted)]">Table</div>
                  <div className="mt-1 font-semibold">{order.tableName ?? "-"}</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-[0.25em] text-[var(--muted)]">Status</div>
                  <div className="mt-1">
                    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase ${statusBadgeClass[order.status]}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-[0.25em] text-[var(--muted)]">Time</div>
                  <div className="mt-1 font-semibold">{new Date(order.createdAt).toLocaleString()}</div>
                </div>
              </div>

              <div className="mt-4 space-y-2 rounded-[1.2rem] border border-[var(--border)] bg-white/80 p-4">
                {order.items.map((item: AdminOrder["items"][number]) => (
                  <div key={item.id} className="flex items-center justify-between gap-3 text-sm">
                    <span>
                      {item.menuItemName} x{item.quantity}
                    </span>
                    <span className="font-semibold">{formatCurrency(item.lineTotal)}</span>
                  </div>
                ))}
                <div className="mt-2 flex items-center justify-between border-t border-[var(--border)] pt-3 text-sm font-bold">
                  <span>Total</span>
                  <span>{formatCurrency(order.totalAmount)}</span>
                </div>
              </div>

              <RestaurantOrderActions orderId={order.id} status={order.status} />
            </article>
          ))
        ) : (
          <div className="rounded-[1.4rem] border border-dashed border-[var(--border)] px-4 py-6 text-sm text-[var(--muted)]">
            No orders yet.
          </div>
        )}
      </section>
    </div>
  );
}
