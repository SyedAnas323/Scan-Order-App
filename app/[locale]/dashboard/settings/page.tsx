import { SettingsForm } from "@/components/dashboard-forms";
import { requireSession } from "@/lib/auth";
import { getRestaurantBundleByUserId } from "@/lib/data-store";

export default async function DashboardSettingsPage() {
  const session = await requireSession();
  const bundle = await getRestaurantBundleByUserId(session.userId);
  if (!bundle) {
    return null;
  }

  return (
    <div className="glass rounded-[2rem] p-6">
      <h2 className="text-2xl font-bold">Restaurant settings</h2>
      <p className="mt-2 text-[var(--muted)]">Set WhatsApp number, currency, address, and default language for the public menu.</p>
      <div className="mt-5">
        <SettingsForm restaurant={bundle.restaurant} />
      </div>
    </div>
  );
}
