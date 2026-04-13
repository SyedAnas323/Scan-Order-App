import { NextResponse } from "next/server";
import { setSessionCookie } from "@/lib/auth";
import { getUserById } from "@/lib/data-store";

export async function POST(request: Request) {
  try {
    const { userId } = (await request.json()) as { userId?: string };
    if (!userId) {
      return NextResponse.json({ ok: false, error: "Missing userId." }, { status: 400 });
    }

    const user = await getUserById(userId);
    if (!user) {
      return NextResponse.json({ ok: false, error: "User not found." }, { status: 404 });
    }

    if (user.subscriptionStatus !== "active") {
      return NextResponse.json({ ok: false, pending: true, error: "Subscription is not active yet." }, { status: 409 });
    }

    await setSessionCookie({ userId: user.id, restaurantId: user.restaurantId });
    return NextResponse.json({ ok: true, redirectTo: "/dashboard" });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unable to activate subscription." },
      { status: 400 }
    );
  }
}
