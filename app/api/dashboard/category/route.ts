import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { addCategory } from "@/lib/data-store";
import { categorySchema } from "@/lib/validation";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const parsed = categorySchema.parse(await request.json());
    const category = await addCategory(session.restaurantId, parsed.name);
    return NextResponse.json({ ok: true, category });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unable to create category." },
      { status: 400 }
    );
  }
}
