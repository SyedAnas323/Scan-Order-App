import Link from "next/link";
import { LoginForm } from "@/components/forms";
import { SiteHeader } from "@/components/site-header";
import { getTranslations, type Locale } from "@/lib/i18n";

export default async function LoginPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = getTranslations(locale);

  return (
    <div className="pb-20">
      <SiteHeader locale={locale} />
      <main className="shell pt-10">
        <div className="mx-auto max-w-xl glass rounded-[2rem] p-8">
          <div className="pill">{t.auth.welcome}</div>
          <h1 className="mt-5 text-4xl font-bold">{t.auth.loginTitle}</h1>
          <p className="mt-3 text-[var(--muted)]">Demo login: demo@sofraqr.com / demo1234</p>
          <div className="mt-6">
            <LoginForm locale={locale} />
          </div>
          <p className="mt-5 text-sm text-[var(--muted)]">
            Need a new restaurant?{" "}
            <Link href={`/${locale}/signup`} className="font-semibold text-[var(--brand)]">
              {t.common.signup}
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
