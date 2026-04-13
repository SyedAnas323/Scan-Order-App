import { SignupForm } from "@/components/forms";
import { SiteHeader } from "@/components/site-header";
import { getTranslations, type Locale } from "@/lib/i18n";

export default async function SignupPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = getTranslations(locale);

  return (
    <div className="pb-20">
      <SiteHeader locale={locale} />
      <main className="shell pt-10">
        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1fr_0.9fr]">
          <section className="glass rounded-[2rem] p-8">
            <div className="pill">{t.auth.signupTitle}</div>
            <h1 className="mt-5 text-4xl font-bold">{t.auth.welcome}</h1>
            <p className="mt-4 max-w-xl leading-7 text-[var(--muted)]">{t.auth.paymentNote}</p>
            <div className="mt-8">
              <SignupForm locale={locale} />
            </div>
          </section>
          <section className="glass rounded-[2rem] p-8">
            <div className="text-sm uppercase tracking-[0.3em] text-[var(--muted)]">Included</div>
            <div className="mt-4 space-y-4">
              {[
                "Restaurant dedicated URL",
                "Table-wise QR generation",
                "Mobile menu in multiple languages",
                "WhatsApp order handoff",
                "Monthly recurring billing with Paddle"
              ].map((item) => (
                <div key={item} className="rounded-[1.4rem] border border-[var(--border)] bg-white/70 px-4 py-4 font-medium">
                  {item}
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
