import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { addMenuItem } from "@/lib/data-store";
import { menuItemSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const parsed = menuItemSchema.parse(await request.json());
    const item = await addMenuItem(session.restaurantId, {
      categoryId: parsed.categoryId,
      name: parsed.name,
      description: parsed.description,
      price: parsed.price,
      imageUrl: parsed.imageUrl || undefined,
      available: parsed.available,
      tags: parsed.tags ? parsed.tags.split(",").map((tag) => tag.trim()).filter(Boolean) : []
    });

    return NextResponse.json({ ok: true, item });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unable to create menu item." },
      { status: 400 }
    );
  }
}
