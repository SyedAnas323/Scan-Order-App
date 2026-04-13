"use client";

import { useState, useTransition } from "react";

type ActionState = {
  ok?: boolean;
  error?: string;
  redirectTo?: string;
  userId?: string;
};

async function submitJson(url: string, body: Record<string, unknown>) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  return (await response.json()) as ActionState;
}

export function SignupForm({ locale }: { locale: string }) {
  const [state, setState] = useState<ActionState>({});
  const [pending, startTransition] = useTransition();

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);

        startTransition(async () => {
          const result = await submitJson("/api/auth/register", {
            ownerName: form.get("ownerName"),
            restaurantName: form.get("restaurantName"),
            email: form.get("email"),
            password: form.get("password"),
            whatsappNumber: form.get("whatsappNumber")
          });

          setState(result);
          if (result.redirectTo) {
            window.location.href = `/${locale}${result.redirectTo}`;
          }
        });
      }}
    >
      <input name="ownerName" placeholder="Owner name" required className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3" />
      <input
        name="restaurantName"
        placeholder="Restaurant name"
        required
        className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3"
      />
      <input name="email" type="email" placeholder="Email" required className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3" />
      <input
        name="password"
        type="password"
        placeholder="Password"
        required
        minLength={6}
        className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3"
      />
      <input
        name="whatsappNumber"
        placeholder="923001234567"
        required
        className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3"
      />

      <button disabled={pending} className="w-full rounded-2xl bg-[var(--brand)] px-4 py-3 font-semibold text-white">
        {pending ? "Please wait..." : "Create account"}
      </button>
      {state.error ? <p className="text-sm text-red-700">{state.error}</p> : null}
    </form>
  );
}

export function LoginForm({ locale }: { locale: string }) {
  const [state, setState] = useState<ActionState>({});
  const [pending, startTransition] = useTransition();

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);

        startTransition(async () => {
          const result = await submitJson("/api/auth/login", {
            email: form.get("email"),
            password: form.get("password")
          });

          setState(result);
          if (result.redirectTo) {
            window.location.href = `/${locale}${result.redirectTo}`;
          }
        });
      }}
    >
      <input name="email" type="email" placeholder="Email" required className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3" />
      <input
        name="password"
        type="password"
        placeholder="Password"
        required
        className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3"
      />
      <button disabled={pending} className="w-full rounded-2xl bg-[var(--brand)] px-4 py-3 font-semibold text-white">
        {pending ? "Please wait..." : "Login"}
      </button>
      {state.error ? <p className="text-sm text-red-700">{state.error}</p> : null}
    </form>
  );
}
