import Image from "next/image";
import Link from "next/link";
import { AddTableForm } from "@/components/dashboard-forms";
import { requireSession } from "@/lib/auth";
import { getRestaurantBundleByUserId } from "@/lib/data-store";
import { generateQrDataUrl } from "@/lib/qr";
import { Table } from "@/lib/types";

export default async function DashboardTablesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const session = await requireSession();
  const bundle = await getRestaurantBundleByUserId(session.userId);
  if (!bundle) {
    return null;
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const qrEntries = await Promise.all(
    bundle.tables.map(async (table: Table) => {
      const url = `${appUrl}/${locale}/menu/${bundle.restaurant.slug}?table=${table.id}`;
      return { table, url, qr: await generateQrDataUrl(url) };
    })
  );

  return (
    <div className="space-y-6">
      <section className="glass rounded-[2rem] p-6">
        <h2 className="text-2xl font-bold">Add tables</h2>
        <p className="mt-2 text-[var(--muted)]">Create a table record, then print the generated QR and place it on the table.</p>
        <div className="mt-4">
          <AddTableForm />
        </div>
      </section>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {qrEntries.map((entry: { table: Table; url: string; qr: string }) => (
          <article key={entry.table.id} className="glass rounded-[2rem] p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-xl font-bold">{entry.table.name}</h3>
                <p className="text-sm text-[var(--muted)]">Table number {entry.table.number}</p>
              </div>
              <Link href={`/${locale}/menu/${bundle.restaurant.slug}?table=${entry.table.id}`} target="_blank" className="rounded-full border border-[var(--border)] px-3 py-2 text-xs font-semibold">
                Preview
              </Link>
            </div>
            <div className="relative mx-auto mt-5 h-56 w-56 overflow-hidden rounded-[1.5rem] bg-white p-4">
              <Image src={entry.qr} alt={entry.table.name} fill className="object-contain p-4" />
            </div>
            <a href={entry.qr} download={`${bundle.restaurant.slug}-${entry.table.number}.png`} className="mt-5 block rounded-2xl bg-[var(--brand)] px-4 py-3 text-center font-semibold text-white">
              Download QR
            </a>
            <p className="mt-3 break-all text-xs leading-5 text-[var(--muted)]">{entry.url}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
