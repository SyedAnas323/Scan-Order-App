import { NextResponse } from "next/server";
import { createPendingRestaurant } from "@/lib/data-store";
import { registerSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const parsed = registerSchema.parse(await request.json());
    const user = await createPendingRestaurant(parsed);
    return NextResponse.json({ ok: true, redirectTo: `/onboarding?user=${user.id}` });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unable to create account." },
      { status: 400 }
    );
  }
}
