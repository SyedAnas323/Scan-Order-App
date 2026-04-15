import { NextResponse } from "next/server";
import { isAdminCookieAuthorized } from "@/lib/admin-auth";
import { deleteUserById } from "@/lib/data-store";

export async function POST(request: Request) {
  try {
    const authorized = isAdminCookieAuthorized(request.headers.get("cookie")?.match(/sofraqr_admin=([^;]+)/)?.[1] ?? null);
    if (!authorized) {
      return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
    }

    const { userId } = (await request.json()) as { userId?: string };
    if (!userId) {
      return NextResponse.json({ ok: false, error: "Missing userId." }, { status: 400 });
    }

    const deleted = await deleteUserById(userId);
    if (!deleted) {
      return NextResponse.json({ ok: false, error: "User not found or cannot be deleted." }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unable to delete user." },
      { status: 400 }
    );
  }
}
