import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { orders, orderItems, addresses } from "@/lib/db/schema";
import { auth } from "@/lib/db/auth";
import { headers } from "next/headers";
import { nanoid } from "nanoid";
import { eq } from "drizzle-orm";
import { aj } from "@/lib/arcjet";
import { slidingWindow } from "@arcjet/next";

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
    // fail open
  }

  const body = await request.json();
  const { items, addressId } = body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  const address = await db
    .select()
    .from(addresses)
    .where(eq(addresses.id, addressId))
    .limit(1);

  if (address.length === 0) {
    return NextResponse.json({ error: "Address not found" }, { status: 400 });
  }

  const addr = address[0];
  const totalAmount = items.reduce(
    (sum: number, item: { price: number; quantity: number }) =>
      sum + item.price * item.quantity,
    0
  );

  const orderId = `ord_${nanoid(16)}`;

  await db.insert(orders).values({
    id: orderId,
    userId: session.user.id,
    paymentStatus: "pending",
    deliveryStatus: "processing",
    totalAmount,
    shippingName: addr.name,
    shippingPhone: addr.phone,
    shippingAddress: addr.address,
    shippingCity: addr.city,
    shippingState: addr.state,
    shippingPincode: addr.pincode,
    shippingCountry: addr.country,
  });

  const orderItemsData = items.map(
    (item: { productType: "magnet" | "poster"; label: string; image: string; price: number; quantity: number }) => ({
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

  // Simulate 5-second payment processing
  await new Promise((resolve) => setTimeout(resolve, 5000));

  await db
    .update(orders)
    .set({ paymentStatus: "completed", updatedAt: new Date() })
    .where(eq(orders.id, orderId));

  return NextResponse.json({ success: true, orderId });
}
