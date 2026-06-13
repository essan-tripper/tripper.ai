import { db } from "@/lib/db/client";
import { orders, orderItems } from "@/lib/db/schema";
import { eq, desc, and } from "drizzle-orm";

export type OrderWithItems = {
  id: string;
  totalAmount: number;
  paymentStatus: string | null;
  deliveryStatus: string | null;
  createdAt: string | null;
  shippingName: string | null;
  shippingPhone: string | null;
  shippingAddress: string | null;
  shippingCity: string | null;
  shippingState: string | null;
  shippingPincode: string | null;
  items: {
    id: string;
    productType: string;
    label: string;
    image: string;
    price: number;
    quantity: number;
  }[];
};

function groupOrderRows(rows: any[]) {
  const orderMap = new Map<string, OrderWithItems>();

  for (const row of rows) {
    if (!orderMap.has(row.id)) {
      orderMap.set(row.id, {
        id: row.id,
        totalAmount: row.totalAmount,
        paymentStatus: row.paymentStatus ?? null,
        deliveryStatus: row.deliveryStatus ?? null,
        createdAt: row.createdAt ? row.createdAt.toISOString() : null,
        shippingName: row.shippingName ?? null,
        shippingPhone: row.shippingPhone ?? null,
        shippingAddress: row.shippingAddress ?? null,
        shippingCity: row.shippingCity ?? null,
        shippingState: row.shippingState ?? null,
        shippingPincode: row.shippingPincode ?? null,
        items: [],
      });
    }
    if (row.itemId) {
      orderMap.get(row.id)!.items.push({
        id: row.itemId,
        productType: row.productType!,
        label: row.label!,
        image: row.image!,
        price: row.price!,
        quantity: row.quantity!,
      });
    }
  }

  return Array.from(orderMap.values());
}

export async function getOrdersWithItems(userId: string): Promise<OrderWithItems[]> {
  const rows = await db
    .select({
      id: orders.id,
      totalAmount: orders.totalAmount,
      paymentStatus: orders.paymentStatus,
      deliveryStatus: orders.deliveryStatus,
      createdAt: orders.createdAt,
      shippingName: orders.shippingName,
      shippingPhone: orders.shippingPhone,
      shippingAddress: orders.shippingAddress,
      shippingCity: orders.shippingCity,
      shippingState: orders.shippingState,
      shippingPincode: orders.shippingPincode,
      itemId: orderItems.id,
      productType: orderItems.productType,
      label: orderItems.label,
      image: orderItems.image,
      price: orderItems.price,
      quantity: orderItems.quantity,
    })
    .from(orders)
    .leftJoin(orderItems, eq(orders.id, orderItems.orderId))
    .where(eq(orders.userId, userId))
    .orderBy(desc(orders.createdAt));

  return groupOrderRows(rows);
}

export async function getOrderById(id: string, userId: string): Promise<OrderWithItems | null> {
  const rows = await db
    .select({
      id: orders.id,
      totalAmount: orders.totalAmount,
      paymentStatus: orders.paymentStatus,
      deliveryStatus: orders.deliveryStatus,
      createdAt: orders.createdAt,
      shippingName: orders.shippingName,
      shippingPhone: orders.shippingPhone,
      shippingAddress: orders.shippingAddress,
      shippingCity: orders.shippingCity,
      shippingState: orders.shippingState,
      shippingPincode: orders.shippingPincode,
      itemId: orderItems.id,
      productType: orderItems.productType,
      label: orderItems.label,
      image: orderItems.image,
      price: orderItems.price,
      quantity: orderItems.quantity,
    })
    .from(orders)
    .leftJoin(orderItems, eq(orders.id, orderItems.orderId))
    .where(and(eq(orders.id, id), eq(orders.userId, userId)));

  const results = groupOrderRows(rows);
  return results[0] ?? null;
}

export async function getPastProducts(userId: string) {
  return db
    .select({
      label: orderItems.label,
      image: orderItems.image,
      price: orderItems.price,
      productType: orderItems.productType,
    })
    .from(orderItems)
    .innerJoin(orders, eq(orders.id, orderItems.orderId))
        .where(and(eq(orders.userId, userId), eq(orders.deliveryStatus, "delivered")))
    .groupBy(orderItems.label, orderItems.image, orderItems.price, orderItems.productType);
}
