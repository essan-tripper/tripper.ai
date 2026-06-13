import crypto from "crypto";
import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { orders } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { env } from "@/env";
import { aj } from "@/lib/arcjet";

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-razorpay-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 401 });
  }

  const expected = crypto
    .createHmac("sha256", env.RAZORPAY_KEY_SECRET ?? "")
    .update(rawBody)
    .digest("hex");

  if (expected !== signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const body = JSON.parse(rawBody);
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
