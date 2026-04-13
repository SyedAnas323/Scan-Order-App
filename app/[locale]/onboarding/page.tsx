import Link from "next/link";
import { notFound } from "next/navigation";
import { PaymentButton } from "@/components/payment-button";
import { SiteHeader } from "@/components/site-header";
import { readData } from "@/lib/data-store";
import { getTranslations, type Locale } from "@/lib/i18n";

export default async function OnboardingPage({
  params,
  searchParams
}: {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ user?: string }>;
}) {
  const { locale } = await params;
  const { user } = await searchParams;
  const t = getTranslations(locale);
  const data = await readData();
  const account = data.users.find((entry) => entry.id === user);

  if (!account) {
    notFound();
  }

  const safeAccount = account;

  return (
    <div className="pb-20">
      <SiteHeader locale={locale} />
      <main className="shell pt-10">
        <div className="mx-auto max-w-3xl glass rounded-[2rem] p-8">
          <div className="pill">{t.auth.payNow}</div>
          <h1 className="mt-5 text-4xl font-bold">Complete your subscription to activate the restaurant dashboard</h1>
          <p className="mt-4 leading-7 text-[var(--muted)]">
            This local MVP includes a Paddle-ready activation step. Replace the simulated button with your live Paddle checkout and keep the webhook endpoint for activation.
          </p>
          <div className="mt-8 rounded-[1.7rem] bg-[#25130a] p-6 text-white">
            <div className="text-sm uppercase tracking-[0.25em] text-white/60">Starter plan</div>
            <div className="mt-2 text-5xl font-bold">$29</div>
            <div className="mt-2 text-white/70">per month • billed with Paddle</div>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <PaymentButton userId={safeAccount.id} locale={locale} />
            <Link href={`/${locale}/login`} className="rounded-full border border-[var(--border)] px-6 py-3 font-semibold">
              Back to login
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
