"use client";

import { useTransition } from "react";

export function RestaurantOrderActions({ orderId }: { orderId: string }) {
  const [pending, startTransition] = useTransition();

  const updateStatus = (status: "completed" | "canceled") => {
    startTransition(async () => {
      await fetch("/api/dashboard/orders/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status })
      });
      window.location.reload();
    });
  };

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      <button
        type="button"
        disabled={pending}
        onClick={() => updateStatus("completed")}
        className="rounded-full bg-[var(--success)] px-4 py-2 text-xs font-semibold text-white disabled:opacity-70"
      >
        {pending ? "Updating..." : "Accept"}
      </button>
      <button
        type="button"
        disabled={pending}
        onClick={() => updateStatus("canceled")}
        className="rounded-full border border-rose-200 px-4 py-2 text-xs font-semibold text-rose-700 disabled:opacity-70"
      >
        {pending ? "Updating..." : "Reject"}
      </button>
    </div>
  );
}
