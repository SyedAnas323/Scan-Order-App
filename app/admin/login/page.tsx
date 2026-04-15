import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/admin-panel";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export default async function AdminLoginPage() {
  const authenticated = await isAdminAuthenticated();
  if (authenticated) {
    redirect("/admin/dashboard");
  }

  return (
    <main className="shell py-16">
      <div className="mx-auto max-w-xl rounded-[2.2rem] border border-[rgba(58,32,21,0.08)] bg-white/90 p-8 shadow-[0_25px_60px_rgba(58,32,21,0.08)]">
        <div className="pill">Private admin access</div>
        <h1 className="mt-5 text-4xl font-bold">Admin login</h1>
        <p className="mt-3 text-[var(--muted)]">
          This login is only for platform admin. Restaurant owners and customers cannot access these routes.
        </p>
        <div className="mt-6">
          <AdminLoginForm />
        </div>
      </div>
    </main>
  );
}
