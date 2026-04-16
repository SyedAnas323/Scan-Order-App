import Link from "next/link";
import { redirect } from "next/navigation";
import { requireSession } from "@/lib/auth";
import { getRestaurantBundleByUserId, hasSeenWelcome, markWelcomeSeen } from "@/lib/data-store";
import { Locale } from "@/lib/types";

export default async function WelcomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const session = await requireSession();
  const bundle = await getRestaurantBundleByUserId(session.userId);

  if (!bundle) {
    redirect(`/${locale}/login`);
  }

  const seen = await hasSeenWelcome(session.userId);
  if (seen) {
    redirect(`/${locale}/dashboard`);
  }

  await markWelcomeSeen({
    userId: bundle.user.id,
    actorName: bundle.user.name,
    restaurantId: bundle.restaurant.id
  });

  return (
    <main className="shell py-6 sm:py-10 lg:py-12">
      <div className="relative mx-auto overflow-hidden rounded-[2rem] border border-[rgba(58,32,21,0.08)] bg-[linear-gradient(135deg,#fffaf3_0%,#f2d7a4_42%,#fff5e9_100%)] shadow-[0_30px_90px_rgba(60,35,15,0.12)] sm:rounded-[2.5rem]">
        <div className="welcome-sparkles" />
        <div className="welcome-orb welcome-orb--one" />
        <div className="welcome-orb welcome-orb--two" />
        <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="relative p-5 sm:p-7 md:p-10 lg:p-12">
            <div className="pill">Welcome aboard</div>
            <h1 className="mt-5 text-3xl font-bold leading-[1.02] sm:text-4xl lg:mt-6 lg:text-5xl lg:leading-[0.95]">Your restaurant space is ready to grow</h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--muted)] sm:text-lg sm:leading-8 lg:mt-6">
              Welcome {bundle.user.name}. Your restaurant <span className="font-semibold text-[var(--brand-dark)]">{bundle.restaurant.name}</span> is now inside SofraQR.
              Start by setting up your menu, adding tables, and sharing your dedicated QR menu link with customers.
            </p>

            <div className="mt-8 overflow-hidden rounded-[2rem] border border-[rgba(127,46,13,0.08)] bg-white/88 shadow-[0_18px_40px_rgba(60,35,15,0.08)]">
              <div className="bg-[linear-gradient(135deg,#2a160c_0%,#4a2512_100%)] px-4 py-4 text-white sm:px-5">
                <div className="text-xs uppercase tracking-[0.35em] text-white/55">Restaurant spotlight</div>
                <div className="mt-2 text-2xl font-bold">{bundle.restaurant.name}</div>
                <div className="mt-2 text-sm text-white/70">Your live menu will be opened by customers through this dedicated QR destination.</div>
              </div>
              <div className="grid gap-4 p-4 sm:p-5 md:grid-cols-2">
                <div className="rounded-[1.4rem] bg-[var(--surface)] p-4">
                  <div className="text-xs uppercase tracking-[0.25em] text-[var(--muted)]">Public menu URL</div>
                  <div className="mt-2 text-lg font-bold">{bundle.restaurant.slug}</div>
                </div>
                <div className="rounded-[1.4rem] bg-[var(--surface)] p-4">
                  <div className="text-xs uppercase tracking-[0.25em] text-[var(--muted)]">WhatsApp line</div>
                  <div className="mt-2 text-lg font-bold">{bundle.restaurant.whatsappNumber}</div>
                </div>
              </div>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <div className="rounded-[1.6rem] bg-white/80 p-4 shadow-sm">
                <div className="text-xs uppercase tracking-[0.25em] text-[var(--muted)]">Restaurant</div>
                <div className="mt-2 text-lg font-bold">{bundle.restaurant.name}</div>
              </div>
              <div className="rounded-[1.6rem] bg-white/80 p-4 shadow-sm">
                <div className="text-xs uppercase tracking-[0.25em] text-[var(--muted)]">Public menu URL</div>
                <div className="mt-2 text-lg font-bold">{bundle.restaurant.slug}</div>
              </div>
              <div className="rounded-[1.6rem] bg-white/80 p-4 shadow-sm">
                <div className="text-xs uppercase tracking-[0.25em] text-[var(--muted)]">Current status</div>
                <div className="mt-2 text-lg font-bold capitalize">{bundle.user.subscriptionStatus}</div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3 sm:mt-10 sm:gap-4">
              <Link href={`/${locale}/dashboard`} className="rounded-full bg-[var(--brand)] px-5 py-3 text-sm font-semibold text-white sm:px-6 sm:text-base">
                Continue to dashboard
              </Link>
              <Link href={`/${locale}/menu/${bundle.restaurant.slug}`} target="_blank" className="rounded-full border border-[var(--border)] px-5 py-3 text-sm font-semibold sm:px-6 sm:text-base">
                Preview live menu
              </Link>
            </div>
          </div>

          <div className="relative bg-[#2a160c] p-5 text-white sm:p-7 md:p-10 lg:p-12">
            <div className="text-sm uppercase tracking-[0.35em] text-white/60">First steps</div>
            <div className="mt-5 rounded-[1.5rem] border border-white/10 bg-white/8 p-4">
              <div className="text-xs uppercase tracking-[0.3em] text-white/45">Quick launch</div>
              <div className="mt-2 text-lg font-semibold">Menu, QR, WhatsApp. Everything starts from this dashboard.</div>
            </div>
            <div className="mt-6 space-y-4">
              {[
                "Add your menu categories and menu items.",
                "Create tables and download their QR codes.",
                "Open your public menu and test a WhatsApp order."
              ].map((step, index) => (
                <div key={step} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                  <div className="text-xs uppercase tracking-[0.25em] text-white/45">Step 0{index + 1}</div>
                  <div className="mt-2 text-lg font-semibold">{step}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
