"use client";

import { useTransition } from "react";
import { OrderStatus } from "@/lib/types";

export function RestaurantOrderActions({ orderId, status }: { orderId: string; status: OrderStatus }) {
  const [pending, startTransition] = useTransition();

  const updateStatus = (nextStatus: "accepted" | "completed" | "delivered" | "rejected" | "canceled") => {
    startTransition(async () => {
      await fetch("/api/dashboard/orders/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: nextStatus })
      });
      window.location.reload();
    });
  };

  const actions: Array<{
    label: string;
    value: "accepted" | "completed" | "delivered" | "rejected" | "canceled";
    tone: "green" | "blue" | "amber" | "red" | "stone";
  }> = [
    { label: "Accept", value: "accepted", tone: "green" },
    { label: "Complete", value: "completed", tone: "blue" },
    { label: "Delivered", value: "delivered", tone: "amber" },
    { label: "Reject", value: "rejected", tone: "red" },
    { label: "Cancel", value: "canceled", tone: "stone" }
  ];

  const toneClass: Record<"green" | "blue" | "amber" | "red" | "stone", string> = {
    green: "border-emerald-200 text-emerald-700 hover:bg-emerald-50",
    blue: "border-sky-200 text-sky-700 hover:bg-sky-50",
    amber: "border-amber-200 text-amber-700 hover:bg-amber-50",
    red: "border-rose-200 text-rose-700 hover:bg-rose-50",
    stone: "border-stone-300 text-stone-700 hover:bg-stone-100"
  };

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {actions.map((action) => {
        const isActive = status === action.value;
        return (
          <button
            key={action.value}
            type="button"
            disabled={pending || isActive}
            onClick={() => updateStatus(action.value)}
            className={`rounded-full border px-4 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-70 ${
              isActive ? "border-[var(--success)] bg-[var(--success)] text-white" : `bg-white ${toneClass[action.tone]}`
            }`}
          >
            {isActive ? `${action.label} Selected` : action.label}
          </button>
        );
      })}
    </div>
  );
}

