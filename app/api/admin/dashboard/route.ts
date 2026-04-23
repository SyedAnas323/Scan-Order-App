import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, isAdminCookieAuthorized } from "@/lib/admin-auth";
import { getAdminDashboardData, getAdminSummary } from "@/lib/data-store";

export async function GET(request: NextRequest) {
  const isAuthorized = isAdminCookieAuthorized(request.cookies.get(ADMIN_COOKIE_NAME)?.value);
  if (!isAuthorized) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [summary, dashboard] = await Promise.all([getAdminSummary(), getAdminDashboardData()]);

    return NextResponse.json({
      ok: true,
      summary,
      dashboard,
      recentOrders: dashboard.recentOrders,
      recentActivity: dashboard.recentActivity,
      signupRequests: dashboard.signupRequests
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unable to load dashboard data." },
      { status: 500 }
    );
  }
}

