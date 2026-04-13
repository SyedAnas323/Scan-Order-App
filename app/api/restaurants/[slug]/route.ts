import { NextResponse } from "next/server";
import { getRestaurantBySlug } from "@/lib/data-store";

export async function GET(_: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const bundle = await getRestaurantBySlug(slug);
  if (!bundle) {
    return NextResponse.json({ ok: false, error: "Restaurant not found." }, { status: 404 });
  }
  return NextResponse.json({ ok: true, ...bundle });
}
