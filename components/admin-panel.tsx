"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { ADMIN_EMAIL } from "@/lib/admin-config";
import { User } from "@/lib/types";

type ActionState = {
  ok?: boolean;
  error?: string;
  redirectTo?: string;
};

type AdminUserRow = {
  user: User;
  restaurant: {
    name: string;
    slug: string;
  } | null;
  createdAt: string;
};

type AdminRestaurantRow = {
  restaurant: {
    id: string;
    name: string;
    slug: string;
    whatsappNumber: string;
    currency: string;
    defaultLocale: string;
    address: string;
  };
  owner: User;
  createdAt: string;
};

async function postJson(url: string, body: Record<string, unknown>) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  return (await response.json()) as ActionState;
}

export function AdminLoginForm() {
  const [state, setState] = useState<ActionState>({});
  const [pending, startTransition] = useTransition();

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);

        startTransition(async () => {
          const result = await postJson("/api/admin/auth/login", {
            email: form.get("email"),
            password: form.get("password")
          });

          setState(result);
          if (result.redirectTo) {
            window.location.href = result.redirectTo;
          }
        });
      }}
    >
      <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-4 text-sm text-[var(--muted)]">
        Admin email: <span className="font-semibold text-[var(--ink)]">{ADMIN_EMAIL}</span>
      </div>
      <input name="email" type="email" placeholder="Admin email" required className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3" />
      <input name="password" type="password" placeholder="Password" required className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3" />
      <button disabled={pending} className="w-full rounded-2xl bg-[var(--brand)] px-4 py-3 font-semibold text-white">
        {pending ? "Signing in..." : "Open admin dashboard"}
      </button>
      {state.error ? <p className="text-sm text-red-700">{state.error}</p> : null}
    </form>
  );
}

export function AdminSidebar() {
  return (
    <aside className="rounded-[2rem] border border-[rgba(58,32,21,0.08)] bg-white/90 p-4 shadow-[0_25px_60px_rgba(58,32,21,0.08)]">
      <div className="mb-4 rounded-[1.5rem] bg-[var(--surface)] p-4">
        <div className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">Admin Access</div>
        <div className="mt-2 text-lg font-bold">Private Control Center</div>
        <p className="mt-2 text-sm text-[var(--muted)]">Only the admin account can open these routes and manage platform data.</p>
      </div>
      <nav className="space-y-2">
        <Link href="/admin/dashboard" className="block rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 font-semibold hover:bg-white">
          Dashboard
        </Link>
        <Link href="/admin/users" className="block rounded-2xl px-4 py-3 hover:bg-white/60">
          Users
        </Link>
        <Link href="/admin/restaurants" className="block rounded-2xl px-4 py-3 hover:bg-white/60">
          Restaurants
        </Link>
      </nav>
    </aside>
  );
}

export function AdminLogoutButton() {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      onClick={() => {
        startTransition(async () => {
          await fetch("/api/admin/auth/logout", { method: "POST" });
          window.location.href = "/admin/login";
        });
      }}
      className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white"
    >
      {pending ? "Signing out..." : "Logout"}
    </button>
  );
}

export function AdminStatusActions({ user }: { user: User }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const updateStatus = (status: User["subscriptionStatus"]) => {
    startTransition(async () => {
      const result = await postJson("/api/admin/users/status", {
        userId: user.id,
        status
      });

      if (result.ok) {
        window.location.reload();
        return;
      }

      setError(result.error || "Unable to update status.");
    });
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {(["pending", "active", "canceled"] as const).map((status) => (
          <button
            key={status}
            type="button"
            disabled={pending}
            onClick={() => updateStatus(status)}
            className={user.subscriptionStatus === status ? "rounded-full bg-[var(--brand)] px-3 py-2 text-xs font-semibold text-white" : "rounded-full border border-[var(--border)] px-3 py-2 text-xs font-semibold"}
          >
            {status.toUpperCase()}
          </button>
        ))}
      </div>
      {error ? <p className="text-xs text-red-700">{error}</p> : null}
    </div>
  );
}

export function DeleteUserButton({ userId }: { userId: string }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  return (
    <div className="space-y-2">
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          startTransition(async () => {
            const result = await postJson("/api/admin/users/delete", { userId });
            if (result.ok) {
              window.location.reload();
              return;
            }

            setError(result.error || "Unable to delete user.");
          });
        }}
        className="rounded-full border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-700"
      >
        {pending ? "Deleting..." : "Delete user"}
      </button>
      {error ? <p className="text-xs text-red-700">{error}</p> : null}
    </div>
  );
}

export function UsersTable({ rows }: { rows: AdminUserRow[] }) {
  return (
    <div className="space-y-4">
      {rows.map((row) => (
        <article key={row.user.id} className="rounded-[1.6rem] border border-[var(--border)] bg-white p-5 shadow-[0_12px_30px_rgba(58,32,21,0.06)]">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div>
                <div className="text-xs uppercase tracking-[0.25em] text-[var(--muted)]">Name</div>
                <div className="mt-1 font-semibold">{row.user.name}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.25em] text-[var(--muted)]">Email</div>
                <div className="mt-1 font-semibold">{row.user.email}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.25em] text-[var(--muted)]">Restaurant</div>
                <div className="mt-1 font-semibold">{row.restaurant?.name ?? "No restaurant"}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.25em] text-[var(--muted)]">Status</div>
                <div className="mt-1 font-semibold">{row.user.subscriptionStatus.toUpperCase()}</div>
              </div>
            </div>
            <div className="min-w-[280px] space-y-3 rounded-[1.4rem] border border-[var(--border)] bg-[var(--surface)] p-4">
              <AdminStatusActions user={row.user} />
              <DeleteUserButton userId={row.user.id} />
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

export function RestaurantsTable({ rows }: { rows: AdminRestaurantRow[] }) {
  return (
    <div className="space-y-4">
      {rows.map((row) => (
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
              <div className="text-xs uppercase tracking-[0.25em] text-[var(--muted)]">Subscription</div>
              <div className="mt-1 font-semibold">{row.owner.subscriptionStatus.toUpperCase()}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.25em] text-[var(--muted)]">Slug</div>
              <div className="mt-1 font-semibold">{row.restaurant.slug}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.25em] text-[var(--muted)]">WhatsApp</div>
              <div className="mt-1 font-semibold">{row.restaurant.whatsappNumber}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.25em] text-[var(--muted)]">Currency</div>
              <div className="mt-1 font-semibold">{row.restaurant.currency}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.25em] text-[var(--muted)]">Locale</div>
              <div className="mt-1 font-semibold">{row.restaurant.defaultLocale}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.25em] text-[var(--muted)]">Address</div>
              <div className="mt-1 font-semibold">{row.restaurant.address || "No address set"}</div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
