import { NextResponse } from "next/server";
import { setAdminSession } from "@/lib/admin-auth";
import { ADMIN_EMAIL, ADMIN_PASSWORD } from "@/lib/admin-config";

export async function POST(request: Request) {
  try {
    const { email, password } = (await request.json()) as { email?: string; password?: string };

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return NextResponse.json({ ok: false, error: "Invalid admin credentials." }, { status: 401 });
    }

    await setAdminSession();
    return NextResponse.json({ ok: true, redirectTo: "/admin/dashboard" });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unable to login as admin." },
      { status: 400 }
    );
  }
}
