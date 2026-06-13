import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { orders } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { aj } from "@/lib/arcjet";

export async function POST(request: Request) {
  const body = await request.json();
  const event = body.event;

  const ajDecision = await aj.protect(request);

  if (ajDecision.isDenied()) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (ajDecision.isErrored()) {
    console.error("Arcjet error:", ajDecision.reason);
  }

  if (event === "payment.captured") {
    const payment = body.payload.payment.entity;
    const razorpayOrderId = payment.order_id;
    const razorpayPaymentId = payment.id;

    const existing = await db
      .select()
      .from(orders)
      .where(eq(orders.razorpayOrderId, razorpayOrderId))
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(orders)
        .set({
          paymentStatus: "completed",
          razorpayPaymentId,
          updatedAt: new Date(),
        })
        .where(eq(orders.razorpayOrderId, razorpayOrderId));
    }
  }

  return NextResponse.json({ received: true });
}
