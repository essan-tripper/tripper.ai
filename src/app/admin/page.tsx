import { auth } from "@/lib/db/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db/client";
import { orders, orderItems, user, interestEmails } from "@/lib/db/schema";
import { eq, desc, isNull } from "drizzle-orm";
import AdminDashboard from "./AdminDashboard";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "").split(",").map(e => e.trim().toLowerCase());

export default async function AdminPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
    query: { disableCookieCache: true },
  });
  
  if (!session?.user?.email || !ADMIN_EMAILS.includes(session.user.email.toLowerCase())) {
    redirect("/sign-in");
  }

  const [orderRows, interestList, noOrderUsers] = await Promise.all([
    db.select({
      id: orders.id,
      totalAmount: orders.totalAmount,
      paymentStatus: orders.paymentStatus,
      deliveryStatus: orders.deliveryStatus,
      shippingName: orders.shippingName,
      shippingPhone: orders.shippingPhone,
      shippingAddress: orders.shippingAddress,
      shippingCity: orders.shippingCity,
      shippingState: orders.shippingState,
      shippingPincode: orders.shippingPincode,
      createdAt: orders.createdAt,
      userEmail: user.email,
      userName: user.name,
      itemId: orderItems.id,
      itemProductType: orderItems.productType,
      itemLabel: orderItems.label,
      itemPrice: orderItems.price,
      itemQuantity: orderItems.quantity,
    })
      .from(orders)
      .leftJoin(user, eq(orders.userId, user.id))
      .leftJoin(orderItems, eq(orders.id, orderItems.orderId))
      .orderBy(desc(orders.createdAt)),
    db.select({
      id: interestEmails.id,
      email: interestEmails.email,
      createdAt: interestEmails.createdAt,
    })
      .from(interestEmails)
      .orderBy(desc(interestEmails.createdAt)),
    db.select({
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    })
      .from(user)
      .leftJoin(orders, eq(orders.userId, user.id))
      .where(isNull(orders.id))
      .orderBy(desc(user.createdAt)),
  ]);

  const orderMap = new Map<string, any>();
  for (const row of orderRows) {
    if (!orderMap.has(row.id)) {
      orderMap.set(row.id, {
        id: row.id,
        totalAmount: row.totalAmount,
        paymentStatus: row.paymentStatus,
        deliveryStatus: row.deliveryStatus,
        shippingName: row.shippingName,
        shippingPhone: row.shippingPhone,
        shippingAddress: row.shippingAddress,
        shippingCity: row.shippingCity,
        shippingState: row.shippingState,
        shippingPincode: row.shippingPincode,
        createdAt: row.createdAt,
        userEmail: row.userEmail,
        userName: row.userName,
        items: [],
      });
    }
    if (row.itemId) {
      orderMap.get(row.id).items.push({
        id: row.itemId,
        productType: row.itemProductType,
        label: row.itemLabel,
        price: row.itemPrice,
        quantity: row.itemQuantity,
      });
    }
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] pt-20 px-4 sm:px-8 pb-16">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <span className="text-[#f48b29] text-xs tracking-[0.2em] uppercase font-medium">Admin</span>
          <h1 className="text-3xl font-bold text-white mt-1 font-serif">Dashboard</h1>
        </div>
        <AdminDashboard
          orders={Array.from(orderMap.values())}
          interestEmails={interestList}
          noOrderUsers={noOrderUsers}
        />
      </div>
    </main>
  );
}
