import crypto from "crypto";
import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { orders } from "@/lib/db/schema";
import { auth } from "@/lib/db/auth";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { env } from "@/env";
import { aj } from "@/lib/arcjet";
import { slidingWindow } from "@arcjet/next";

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

  const body = await request.json();
  const { orderId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = body;

  if (!orderId || !razorpayPaymentId || !razorpayOrderId || !razorpaySignature) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const generated = crypto
    .createHmac("sha256", env.RAZORPAY_KEY_SECRET ?? "")
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");

  if (generated !== razorpaySignature) {
    return NextResponse.json({ error: "Signature mismatch" }, { status: 400 });
  }

  await db
    .update(orders)
    .set({
      paymentStatus: "completed",
      razorpayPaymentId,
      updatedAt: new Date(),
    })
    .where(eq(orders.id, orderId));

  return NextResponse.json({ success: true });
}
