import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { orders, orderItems, addresses } from "@/lib/db/schema";
import { auth } from "@/lib/db/auth";
import { headers } from "next/headers";
import { nanoid } from "nanoid";
import { and, eq } from "drizzle-orm";
import { env } from "@/env";
import { razorpay } from "@/lib/razorpay";
import { aj } from "@/lib/arcjet";
import { slidingWindow } from "@arcjet/next";
import { z } from "zod";
import { checkoutProducts } from "@/lib/products";

const checkoutItemSchema = z.object({
  id: z.string().min(1),
  quantity: z.number().int().positive().max(100),
});

const checkoutBodySchema = z.object({
  items: z.array(checkoutItemSchema).min(1),
  addressId: z.string().min(1),
});

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ajDecision = await aj.withRule(
    slidingWindow({ mode: "DRY_RUN", interval: 60, max: 10 })
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
  const parsedBody = checkoutBodySchema.safeParse(body);
  if (!parsedBody.success) {
    return NextResponse.json({ error: "Invalid checkout data" }, { status: 400 });
  }

  const { items: requestedItems, addressId } = parsedBody.data;
  const items = requestedItems.map((item) => {
    const product = checkoutProducts.get(item.id);
    return product ? { ...product, quantity: item.quantity } : null;
  });

  if (items.some((item) => item === null)) {
    return NextResponse.json({ error: "Invalid product" }, { status: 400 });
  }

  const validItems = items.filter(
    (item): item is NonNullable<(typeof items)[number]> => item !== null
  );

  const address = await db
    .select()
    .from(addresses)
    .where(and(eq(addresses.id, addressId), eq(addresses.userId, session.user.id)))
    .limit(1);

  if (address.length === 0) {
    return NextResponse.json({ error: "Address not found" }, { status: 400 });
  }

  const addr = address[0];

  const totalAmount = validItems.reduce(
    (sum: number, item) =>
      sum + item.price * item.quantity,
    0
  );

  if (totalAmount < 1) {
    return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
  }

  const amountPaise = totalAmount * 100;
  const adminEmails = (env.ADMIN_EMAILS || "")
    .split(",")
    .map(e => e.trim().toLowerCase());
  const razorpayAmount =
    session.user.email &&
    adminEmails.includes(session.user.email.toLowerCase())
      ? 100
      : amountPaise;
  const orderId = `ord_${nanoid(16)}`;

  await db.insert(orders).values({
    id: orderId,
    userId: session.user.id,
    paymentStatus: "pending",
    deliveryStatus: "processing",
    totalAmount: amountPaise,
    shippingName: addr.name,
    shippingPhone: addr.phone,
    shippingAddress: addr.address,
    shippingCity: addr.city,
    shippingState: addr.state,
    shippingPincode: addr.pincode,
    shippingCountry: addr.country,
  });

  const orderItemsData = validItems.map(
    (item) => ({
      id: `oi_${nanoid(16)}`,
      orderId,
      productType: item.productType,
      label: item.label,
      image: item.image,
      price: item.price,
      quantity: item.quantity,
    })
  );
  await db.insert(orderItems).values(orderItemsData);

  const rzpOrder = await razorpay.orders.create({
    amount: razorpayAmount,
    currency: "INR",
    receipt: orderId,
  });

  await db
    .update(orders)
    .set({ razorpayOrderId: rzpOrder.id, updatedAt: new Date() })
    .where(eq(orders.id, orderId));

  return NextResponse.json({
    orderId,
    razorpayOrderId: rzpOrder.id,
    amount: razorpayAmount,
    key_id: env.RAZORPAY_KEY_ID,
  });
}
