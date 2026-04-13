import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { updateRestaurantSettings } from "@/lib/data-store";
import { settingsSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const parsed = settingsSchema.parse(await request.json());
    const restaurant = await updateRestaurantSettings(session.restaurantId, parsed);
    return NextResponse.json({ ok: true, restaurant });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unable to save settings." },
      { status: 400 }
    );
  }
}
