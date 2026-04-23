import Link from "next/link";
import { ForgotPasswordForm } from "@/components/forms";
import { SiteHeader } from "@/components/site-header";
import { getTranslations, type Locale } from "@/lib/i18n";

export default async function ForgotPasswordPage({
  params,
  searchParams
}: {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ email?: string }>;
}) {
  const { locale } = await params;
  const { email } = await searchParams;
  const t = getTranslations(locale);

  return (
    <div className="pb-20">
      <SiteHeader locale={locale} />
      <main className="shell pt-10">
        <div className="mx-auto max-w-xl glass rounded-[2rem] p-8">
          <div className="pill">Forgot password</div>
          <h1 className="mt-5 text-4xl font-bold">Set a new password</h1>
          <p className="mt-3 text-sm text-[var(--muted)]">Enter your new password and confirm it. Then login with the updated password.</p>
          <div className="mt-6">
            <ForgotPasswordForm locale={locale} emailFromQuery={email} />
          </div>
          <p className="mt-5 text-sm text-[var(--muted)]">
            Back to{" "}
            <Link href={`/${locale}/login`} className="font-semibold text-[var(--brand)]">
              {t.common.login}
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}

