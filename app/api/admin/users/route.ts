import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, isAdminCookieAuthorized } from "@/lib/admin-auth";
import { getAdminUsers } from "@/lib/data-store";

export async function GET(request: NextRequest) {
  const isAuthorized = isAdminCookieAuthorized(request.cookies.get(ADMIN_COOKIE_NAME)?.value);
  if (!isAuthorized) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const rows = await getAdminUsers();
    return NextResponse.json({
      ok: true,
      count: rows.length,
      rows
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unable to load admin users." },
      { status: 500 }
    );
  }
}

