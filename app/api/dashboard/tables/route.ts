import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { addTable } from "@/lib/data-store";
import { tableSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const parsed = tableSchema.parse(await request.json());
    const table = await addTable(session.restaurantId, parsed);
    return NextResponse.json({ ok: true, table });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unable to create table." },
      { status: 400 }
    );
  }
}
