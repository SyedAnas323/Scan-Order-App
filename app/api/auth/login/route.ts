import { NextResponse } from "next/server";
import { authenticateUser } from "@/lib/data-store";
import { setSessionCookie } from "@/lib/auth";
import { loginSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const parsed = loginSchema.parse(await request.json());
    const user = await authenticateUser(parsed.email, parsed.password);

    if (!user) {
      return NextResponse.json({ ok: false, error: "Invalid credentials or inactive subscription." }, { status: 401 });
    }

    await setSessionCookie({ userId: user.id, restaurantId: user.restaurantId });
    return NextResponse.json({ ok: true, redirectTo: "/dashboard" });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unable to login." },
      { status: 400 }
    );
  }
}
