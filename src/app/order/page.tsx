import { auth } from "@/lib/db/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getOrdersWithItems } from "@/lib/order-queries";
import OrderComponent from "./OrderComponent";

export default async function OrderPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) redirect("/sign-in");

  const orders = await getOrdersWithItems(session.user.id);

  return (
    <main className="min-h-screen bg-[#0a0a0a] overflow-x-hidden">
      <div className="pt-20 sm:pt-24 px-4 sm:px-8 max-w-7xl mx-auto">
        <h1
          className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2"
          style={{ fontFamily: "var(--font-cinzel), Georgia, serif" }}
        >
          Your Orders
        </h1>
        <p className="text-white/40 text-sm mb-12">
          Track and review your past purchases
        </p>

        <OrderComponent orders={orders} />
      </div>
    </main>
  );
}
