"use client";

import { useRef, useState } from "react";

declare global {
  interface Window {
    Paddle?: {
      Environment?: {
        set(environment: "sandbox" | "production"): void;
      };
      Initialize(options: {
        token: string;
      }): void;
      Checkout: {
        open(options: {
          items: Array<{ priceId: string; quantity: number }>;
          customer?: { email?: string };
          customData?: { userId: string };
          settings?: {
            displayMode?: "overlay";
            variant?: "one-page" | "multi-page";
            theme?: "light" | "dark";
            successUrl?: string;
          };
        }): void;
      };
    };
  }
}

function loadPaddleScript() {
  return new Promise<void>((resolve, reject) => {
    if (window.Paddle) {
      resolve();
      return;
    }

    const existing = document.querySelector<HTMLScriptElement>('script[data-paddle="true"]');
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Failed to load Paddle.js")), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://cdn.paddle.com/paddle/v2/paddle.js";
    script.async = true;
    script.dataset.paddle = "true";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Paddle.js"));
    document.head.appendChild(script);
  });
}

export function PaymentButton({
  userId,
  locale,
  email
}: {
  userId: string;
  locale: string;
  email?: string;
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const initialized = useRef(false);

  return (
    <div className="space-y-3">
      <button
        onClick={async () => {
          const token = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
          const priceId = process.env.NEXT_PUBLIC_PADDLE_PRICE_ID;
          const appUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;

          if (!token || !priceId) {
            setError("Paddle environment values are missing.");
            return;
          }

          setPending(true);
          setError(null);

          try {
            await loadPaddleScript();

            if (!window.Paddle) {
              throw new Error("Paddle.js is unavailable.");
            }

            if (!initialized.current) {
              window.Paddle.Initialize({ token });
              initialized.current = true;
            }

            window.Paddle.Checkout.open({
              items: [{ priceId, quantity: 1 }],
              customer: { email },
              customData: { userId },
              settings: {
                displayMode: "overlay",
                variant: "one-page",
                theme: "light",
                successUrl: `${appUrl}/${locale}/payment/success?user=${encodeURIComponent(userId)}`
              }
            });
          } catch (caughtError) {
            setError(caughtError instanceof Error ? caughtError.message : "Unable to open Paddle checkout.");
          } finally {
            setPending(false);
          }
        }}
        disabled={pending}
        className="rounded-full bg-[var(--brand)] px-6 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
      >
        {pending ? "Opening Paddle..." : "Start Paddle checkout"}
      </button>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
    </div>
  );
}
