import crypto from "crypto";
import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { orders } from "@/lib/db/schema";
import { auth } from "@/lib/db/auth";
import { headers } from "next/headers";
import { and, eq } from "drizzle-orm";
import { env } from "@/env";
import { aj } from "@/lib/arcjet";
import { slidingWindow } from "@arcjet/next";
import { razorpay } from "@/lib/razorpay";

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ajDecision = await aj.withRule(
    slidingWindow({ mode: "DRY_RUN", interval: 60, max: 20 })
  ).protect(request);

  if (ajDecision.isDenied()) {
    if (ajDecision.reason.isRateLimit()) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (ajDecision.isErrored()) {
    console.error("Arcjet error:", ajDecision.reason);
  }

  const body = await request.json().catch(() => null);
  const { orderId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = body ?? {};

  if (
    typeof orderId !== "string" ||
    typeof razorpayPaymentId !== "string" ||
    typeof razorpayOrderId !== "string" ||
    typeof razorpaySignature !== "string"
  ) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const localOrders = await db
    .select()
    .from(orders)
    .where(and(eq(orders.id, orderId), eq(orders.userId, session.user.id)))
    .limit(1);
  const localOrder = localOrders[0];

  if (!localOrder || localOrder.razorpayOrderId !== razorpayOrderId) {
    return NextResponse.json({ error: "Order verification failed" }, { status: 400 });
  }

  if (
    localOrder.paymentStatus !== "pending" &&
    !(localOrder.paymentStatus === "completed" && localOrder.razorpayPaymentId === razorpayPaymentId)
  ) {
    return NextResponse.json({ error: "Order is not payable" }, { status: 400 });
  }

  const generated = crypto
    .createHmac("sha256", env.RAZORPAY_KEY_SECRET ?? "")
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");

  if (generated !== razorpaySignature) {
    return NextResponse.json({ error: "Signature mismatch" }, { status: 400 });
  }

  try {
    const razorpayOrder = await razorpay.orders.fetch(razorpayOrderId);
    const razorpayPayment = await razorpay.payments.fetch(razorpayPaymentId);

    if (
      razorpayOrder.id !== razorpayOrderId ||
      razorpayOrder.status !== "paid" ||
      razorpayPayment.order_id !== razorpayOrderId ||
      razorpayPayment.status !== "captured"
    ) {
      return NextResponse.json({ error: "Payment is not completed" }, { status: 400 });
    }
  } catch (error) {
    console.error("Razorpay verification error:", error);
    return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
  }

  if (localOrder.paymentStatus === "completed") {
    return NextResponse.json({ success: true });
  }

  await db
    .update(orders)
    .set({
      paymentStatus: "completed",
      razorpayPaymentId,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(orders.id, orderId),
        eq(orders.userId, session.user.id),
        eq(orders.paymentStatus, "pending")
      )
    );

  return NextResponse.json({ success: true });
}
