import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { addMenuItem, deleteMenuItem, updateMenuItem } from "@/lib/data-store";
import { menuItemDeleteSchema, menuItemSchema } from "@/lib/validation";

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

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = (await request.json()) as Record<string, unknown>;
    const id = menuItemDeleteSchema.parse({ id: payload.id }).id;
    const parsed = menuItemSchema.parse(payload);
    const item = await updateMenuItem(session.restaurantId, id, {
      categoryId: parsed.categoryId,
      name: parsed.name,
      description: parsed.description,
      price: parsed.price,
      imageUrl: parsed.imageUrl || undefined,
      available: parsed.available,
      tags: parsed.tags ? parsed.tags.split(",").map((tag) => tag.trim()).filter(Boolean) : []
    });

    if (!item) {
      return NextResponse.json({ ok: false, error: "Menu item not found." }, { status: 404 });
    }

    return NextResponse.json({ ok: true, item });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unable to update menu item." },
      { status: 400 }
    );
  }
}

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const parsed = menuItemDeleteSchema.parse(await request.json());
    const deleted = await deleteMenuItem(session.restaurantId, parsed.id);
    if (!deleted) {
      return NextResponse.json({ ok: false, error: "Menu item not found." }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unable to delete menu item." },
      { status: 400 }
    );
  }
}
