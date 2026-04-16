import { notFound } from "next/navigation";
import { PublicMenu } from "@/components/public-menu";
import { getRestaurantBySlug } from "@/lib/data-store";
import { getTranslations, type Locale } from "@/lib/i18n";
import { Table } from "@/lib/types";

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

  const activeTable = safeBundle.tables.find((entry: Table) => entry.id === tableId);
  const t = getTranslations(locale);
  const menuIntro = {
    en: "Customer scans the QR, opens this menu, selects dishes, and sends the order to the restaurant on WhatsApp.",
    ur: "کسٹمر QR اسکین کرتا ہے، مینو کھولتا ہے، آئٹمز منتخب کرتا ہے اور WhatsApp پر آرڈر بھیجتا ہے۔",
    ar: "يقوم العميل بمسح QR، ويفتح القائمة، ويختار الأطباق، ثم يرسل الطلب إلى المطعم عبر WhatsApp.",
    it: "Il cliente scansiona il QR, apre questo menu, seleziona i piatti e invia l'ordine al ristorante su WhatsApp."
  }[locale];

  return (
    <main className="shell py-8">
      <div className="mb-8 max-w-3xl">
        <div className="pill">{safeBundle.restaurant.name}</div>
        <h1 className="mt-4 break-words text-3xl font-bold sm:text-4xl lg:text-5xl">{safeBundle.restaurant.name}</h1>
        <p className="mt-3 text-base text-[var(--muted)] sm:text-lg">{menuIntro}</p>
      </div>
      <PublicMenu locale={locale} restaurant={safeBundle.restaurant} categories={safeBundle.categories} menuItems={safeBundle.menuItems} table={activeTable} dictionary={t} />
    </main>
  );
}
