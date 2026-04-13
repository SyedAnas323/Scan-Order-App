import { notFound } from "next/navigation";
import { PublicMenu } from "@/components/public-menu";
import { getRestaurantBySlug } from "@/lib/data-store";
import { getTranslations, type Locale } from "@/lib/i18n";

export default async function PublicMenuPage({
  params,
  searchParams
}: {
  params: Promise<{ locale: Locale; slug: string }>;
  searchParams: Promise<{ table?: string }>;
}) {
  const { locale, slug } = await params;
  const { table: tableId } = await searchParams;
  const bundle = await getRestaurantBySlug(slug);
  if (!bundle) {
    notFound();
  }

  const safeBundle = bundle;

  const activeTable = safeBundle.tables.find((entry) => entry.id === tableId);
  const t = getTranslations(locale);

  return (
    <main className="shell py-8">
      <div className="mb-8 max-w-3xl">
        <div className="pill">{safeBundle.restaurant.name}</div>
        <h1 className="mt-4 text-5xl font-bold">{safeBundle.restaurant.name}</h1>
        <p className="mt-3 text-lg text-[var(--muted)]">
          Customer scans the QR, opens this menu, selects dishes, and sends the order to the restaurant on WhatsApp.
        </p>
      </div>
      <PublicMenu restaurant={safeBundle.restaurant} categories={safeBundle.categories} menuItems={safeBundle.menuItems} table={activeTable} dictionary={t} />
    </main>
  );
}
