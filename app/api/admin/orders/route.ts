import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, isAdminCookieAuthorized } from "@/lib/admin-auth";
import { getAdminOrders } from "@/lib/data-store";

export async function GET(request: NextRequest) {
  const isAuthorized = isAdminCookieAuthorized(request.cookies.get(ADMIN_COOKIE_NAME)?.value);
  if (!isAuthorized) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const limitParam = Number(request.nextUrl.searchParams.get("limit") ?? "100");
  const limit = Number.isFinite(limitParam) ? limitParam : 100;

  try {
    const orders = await getAdminOrders(limit);
    return NextResponse.json({
      ok: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unable to load orders." },
      { status: 500 }
    );
  }
}

