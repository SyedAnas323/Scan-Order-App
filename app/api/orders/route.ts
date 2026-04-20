import { NextResponse } from "next/server";
import { createCustomerOrder } from "@/lib/data-store";
import { customerOrderSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const parsed = customerOrderSchema.parse(await request.json());
    const order = await createCustomerOrder({
      restaurantId: parsed.restaurantId,
      tableId: parsed.tableId,
      customerName: parsed.customerName,
      customerPhone: parsed.customerPhone,
      customerAddress: parsed.customerAddress || undefined,
      source: parsed.source ?? "whatsapp",
      items: parsed.items
    });

    if (!order) {
      return NextResponse.json({ ok: false, error: "Unable to create order." }, { status: 400 });
    }

    return NextResponse.json({ ok: true, order });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unable to create order." },
      { status: 400 }
    );
  }
}
