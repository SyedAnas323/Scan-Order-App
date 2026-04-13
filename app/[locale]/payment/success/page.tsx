import Link from "next/link";
import { notFound } from "next/navigation";
import { PaymentSuccess } from "@/components/payment-success";
import { SiteHeader } from "@/components/site-header";
import { getUserById } from "@/lib/data-store";
import { type Locale } from "@/lib/i18n";

export default async function PaymentSuccessPage({
  params,
  searchParams
}: {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ user?: string }>;
}) {
  const { locale } = await params;
  const { user } = await searchParams;

  if (!user) {
    notFound();
  }

  const account = await getUserById(user);
  if (!account) {
    notFound();
  }

  return (
    <div className="pb-20">
      <SiteHeader locale={locale} />
      <main className="shell pt-10">
        <div className="mx-auto max-w-3xl glass rounded-[2rem] p-8">
          <div className="pill">Payment complete</div>
          <h1 className="mt-5 text-4xl font-bold">We are activating your restaurant account</h1>
          <p className="mt-4 leading-7 text-[var(--muted)]">
            Your Paddle checkout has finished. As soon as the webhook confirms the subscription, you will be redirected to the dashboard automatically.
          </p>
          <div className="mt-8">
            <PaymentSuccess userId={account.id} locale={locale} />
          </div>
          <div className="mt-8">
            <Link href={`/${locale}/login`} className="rounded-full border border-[var(--border)] px-6 py-3 font-semibold">
              Back to login
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
