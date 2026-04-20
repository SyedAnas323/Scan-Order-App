import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getUserById, updateRestaurantOrderStatus } from "@/lib/data-store";
import { restaurantOrderStatusSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const parsed = restaurantOrderStatusSchema.parse(await request.json());
    const user = await getUserById(session.userId);
    const actorName = user?.name ?? "Restaurant Owner";

    const order = await updateRestaurantOrderStatus(session.restaurantId, parsed.orderId, parsed.status, actorName);
    if (!order) {
      return NextResponse.json({ ok: false, error: "Order not found." }, { status: 404 });
    }

    return NextResponse.json({ ok: true, order });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unable to update order status." },
      { status: 400 }
    );
  }
}
