"use client";

import { useEffect, useState } from "react";

type Status = "waiting" | "ready" | "error";

export function PaymentSuccess({ userId, locale }: { userId: string; locale: string }) {
  const [status, setStatus] = useState<Status>("waiting");
  const [message, setMessage] = useState("We are confirming your subscription with Paddle.");

  useEffect(() => {
    let cancelled = false;
    let attempts = 0;

    async function poll() {
      while (!cancelled && attempts < 20) {
        attempts += 1;

        try {
          const statusResponse = await fetch(`/api/payment/status?user=${encodeURIComponent(userId)}`, {
            cache: "no-store"
          });
          const statusPayload = (await statusResponse.json()) as { subscriptionStatus?: string };

          if (statusPayload.subscriptionStatus === "active") {
            const activateResponse = await fetch("/api/payment/activate", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ userId })
            });

            const activatePayload = (await activateResponse.json()) as { redirectTo?: string; error?: string };

            if (activateResponse.ok && activatePayload.redirectTo) {
              if (!cancelled) {
                setStatus("ready");
                setMessage("Subscription confirmed. Redirecting to your dashboard...");
                window.location.href = `/${locale}${activatePayload.redirectTo}`;
              }
              return;
            }

            if (!cancelled) {
              setStatus("error");
              setMessage(activatePayload.error || "Unable to complete login after payment.");
            }
            return;
          }
        } catch {
          if (!cancelled) {
            setMessage("Still waiting for confirmation from Paddle...");
          }
        }

        await new Promise((resolve) => window.setTimeout(resolve, 2000));
      }

      if (!cancelled) {
        setStatus("error");
        setMessage("Payment succeeded, but webhook confirmation is still pending. Please refresh in a few seconds.");
      }
    }

    void poll();

    return () => {
      cancelled = true;
    };
  }, [locale, userId]);

  return (
    <div className="rounded-[1.6rem] border border-[var(--border)] bg-white/75 p-5">
      <div className="text-sm uppercase tracking-[0.25em] text-[var(--muted)]">
        {status === "error" ? "Pending action" : "Processing"}
      </div>
      <p className="mt-3 text-base leading-7">{message}</p>
    </div>
  );
}
