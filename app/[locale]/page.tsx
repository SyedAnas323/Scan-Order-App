import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { getPublicRestaurants } from "@/lib/data-store";
import { getTranslations, type Locale } from "@/lib/i18n";

export default async function LandingPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = getTranslations(locale);
  const restaurants = await getPublicRestaurants();

  return (
    <div className="pb-16">
      <SiteHeader locale={locale} />
      <main id="content" className="shell">
        <section className="relative overflow-hidden rounded-[2.2rem] border border-[rgba(58,32,21,0.08)] bg-[linear-gradient(140deg,#fff9f2_0%,#f4dec0_44%,#fff4e7_100%)] px-6 py-8 shadow-[0_30px_80px_rgba(58,32,21,0.14)] sm:px-10 sm:py-10 lg:px-12 lg:py-14">
          <div className="absolute -top-20 -right-20 h-56 w-56 rounded-full bg-[radial-gradient(circle,_rgba(179,75,30,0.26),_transparent_70%)]" />
          <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-[radial-gradient(circle,_rgba(240,195,107,0.28),_transparent_70%)]" />
          <div className="relative">
            <div className="pill">{t.landing.badge}</div>
            <h1 className="section-title mt-6 max-w-5xl">{t.landing.headline}</h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-[var(--muted)]">{t.landing.subheadline}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={`/${locale}/signup`}
                className="rounded-full bg-[var(--brand)] px-7 py-3 font-semibold text-white shadow-[0_14px_30px_rgba(179,75,30,0.28)]"
              >
                {t.common.signup}
              </Link>
              <Link href={`/${locale}/login`} className="rounded-full border border-[var(--border)] bg-white/85 px-7 py-3 font-semibold">
                {t.common.login}
              </Link>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-[1.2rem] border border-[var(--border)] bg-white/85 p-4">
                <div className="text-xs uppercase tracking-[0.25em] text-[var(--muted)]">Live restaurants</div>
                <div className="mt-2 text-2xl font-bold">{restaurants.length}</div>
              </div>
              {[t.landing.stat1, t.landing.stat2].map((item) => (
                <div key={item} className="rounded-[1.2rem] border border-[var(--border)] bg-white/85 p-4 text-sm font-semibold">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
