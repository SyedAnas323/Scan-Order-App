import Link from "next/link";
import { ReactNode } from "react";
import { AdminLogoutButton, AdminSidebar } from "@/components/admin-panel";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="shell py-6">
      <div className="mb-6 overflow-hidden rounded-[2rem] border border-[rgba(255,255,255,0.12)] bg-[linear-gradient(135deg,#1d120f_0%,#3a2015_55%,#5b2f18_100%)] p-5 text-white shadow-[0_30px_80px_rgba(58,32,21,0.28)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-[1.6rem] border border-white/15 bg-white/10 text-xl font-bold">
              A
            </div>
            <div>
              <div className="text-sm uppercase tracking-[0.35em] text-white/60">Admin panel</div>
              <h1 className="mt-1 text-2xl font-bold sm:text-3xl">SofraQR Control Center</h1>
              <p className="mt-2 max-w-2xl text-sm text-white/70">
                Manage restaurants, review users, and control subscriptions from one protected area.
              </p>
            </div>
          </div>

          <AdminLogoutButton />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <AdminSidebar />
        <main className="space-y-6">
          {children}
          <div className="pt-2 text-sm text-[var(--muted)]">
            Public app:
            {" "}
            <Link href="/en" className="font-semibold text-[var(--brand)]">
              /en
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
