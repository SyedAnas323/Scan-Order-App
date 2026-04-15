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
        <section className="grid gap-10 py-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:py-20">
          <div>
            <div className="pill">{t.landing.badge}</div>
            <h1 className="section-title mt-6 max-w-4xl">{t.landing.headline}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">{t.landing.subheadline}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href={`/${locale}/signup`} className="rounded-full bg-[var(--brand)] px-6 py-3 font-semibold text-white">
                {t.common.signup}
              </Link>
              <Link href={`/${locale}/login`} className="rounded-full border border-[var(--border)] px-6 py-3 font-semibold">
                {t.common.login}
              </Link>
            </div>
          </div>

          <div className="glass rounded-[2rem] p-6">
            <div className="rounded-[1.8rem] bg-[linear-gradient(135deg,#fffaf3_0%,#f2d7a4_100%)] p-5">
              <div className="rounded-[1.5rem] bg-[#2d170b] p-4 text-white">
                <div className="text-sm uppercase tracking-[0.3em] text-white/60">Scan to order</div>
                <div className="mt-3 text-2xl font-bold">{restaurants[0]?.name ?? "Restaurant menu"}</div>
                <div className="mt-2 text-sm text-white/70">{restaurants.length} restaurants available for instant menu browsing</div>
              </div>
              <div className="mt-4 grid gap-3">
                {[t.landing.stat1, t.landing.stat2, t.landing.stat3].map((stat) => (
                  <div key={stat} className="rounded-[1.4rem] bg-white p-4 text-sm font-semibold shadow-sm">
                    {stat}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
