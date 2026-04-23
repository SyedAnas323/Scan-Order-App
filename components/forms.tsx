"use client";

import Link from "next/link";
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

function PasswordField({
  name,
  placeholder,
  minLength
}: {
  name: string;
  placeholder: string;
  minLength?: number;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        name={name}
        type={visible ? "text" : "password"}
        placeholder={placeholder}
        required
        minLength={minLength}
        className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 pr-14"
      />
      <button
        type="button"
        aria-label={visible ? "Hide password" : "Show password"}
        onClick={() => setVisible((current) => !current)}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-[var(--border)] bg-white px-3 py-1 text-xs font-semibold text-[var(--muted)]"
      >
        {visible ? "Hide" : "Show"}
      </button>
    </div>
  );
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
      <PasswordField name="password" placeholder="Password" minLength={6} />
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
  const [email, setEmail] = useState("");

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
      <input
        name="email"
        type="email"
        placeholder="Email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3"
      />
      <PasswordField name="password" placeholder="Password" />
      <div className="flex justify-end">
        <Link
          href={email.trim() ? `/${locale}/forgot-password?email=${encodeURIComponent(email.trim())}` : `/${locale}/forgot-password`}
          className="text-sm font-semibold text-[var(--brand)]"
        >
          Forgot password?
        </Link>
      </div>
      <button disabled={pending} className="w-full rounded-2xl bg-[var(--brand)] px-4 py-3 font-semibold text-white">
        {pending ? "Please wait..." : "Login"}
      </button>
      {state.error ? <p className="text-sm text-red-700">{state.error}</p> : null}
    </form>
  );
}

export function ForgotPasswordForm({ locale, emailFromQuery }: { locale: string; emailFromQuery?: string }) {
  const [state, setState] = useState<ActionState>({});
  const [pending, startTransition] = useTransition();
  const [email, setEmail] = useState(emailFromQuery ?? "");
  const hasQueryEmail = Boolean(emailFromQuery?.trim());

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);

        startTransition(async () => {
          const result = await submitJson("/api/auth/forgot-password", {
            email: email.trim(),
            password: form.get("password"),
            confirmPassword: form.get("confirmPassword")
          });

          setState(result);
          if (result.ok) {
            window.location.href = `/${locale}/login`;
          }
        });
      }}
    >
      {hasQueryEmail ? (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--muted)]">
          Resetting password for: <span className="font-semibold text-[var(--foreground)]">{email}</span>
        </div>
      ) : (
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3"
        />
      )}
      <PasswordField name="password" placeholder="New password" minLength={6} />
      <PasswordField name="confirmPassword" placeholder="Confirm password" minLength={6} />
      <button disabled={pending} className="w-full rounded-2xl bg-[var(--brand)] px-4 py-3 font-semibold text-white">
        {pending ? "Updating..." : "Update password"}
      </button>
      {state.error ? <p className="text-sm text-red-700">{state.error}</p> : null}
    </form>
  );
}
