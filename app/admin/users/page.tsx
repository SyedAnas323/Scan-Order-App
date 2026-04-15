import { UsersTable } from "@/components/admin-panel";
import { getAdminUsers } from "@/lib/data-store";

export default async function AdminUsersPage() {
  const users = await getAdminUsers();

  return (
    <section className="rounded-[2rem] border border-[rgba(58,32,21,0.08)] bg-white/90 p-6 shadow-[0_25px_60px_rgba(58,32,21,0.08)]">
      <div>
        <div className="text-sm uppercase tracking-[0.25em] text-[var(--muted)]">Users management</div>
        <h2 className="mt-2 text-2xl font-bold">All users</h2>
      </div>
      <div className="mt-6">
        <UsersTable rows={users} />
      </div>
    </section>
  );
}
