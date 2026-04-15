import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { updateUserSubscriptionStatus } from "@/lib/data-store";
import { adminOwnerStatusSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const authorized = await isAdminAuthenticated();
    if (!authorized) {
      return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
    }

    const parsed = adminOwnerStatusSchema.parse(await request.json());
    const user = await updateUserSubscriptionStatus(parsed.userId, parsed.status);
    if (!user) {
      return NextResponse.json({ ok: false, error: "User not found." }, { status: 404 });
    }

    return NextResponse.json({ ok: true, user });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unable to update subscription status." },
      { status: 400 }
    );
  }
}
