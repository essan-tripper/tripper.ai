import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle, ShoppingBag, Package } from "lucide-react";
import { auth } from "@/lib/db/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getOrderById } from "@/lib/order-queries";

export const metadata: Metadata = {
  title: "Order Confirmation",
  robots: { index: false, follow: false },
};

export default async function OrderConfirmationPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/sign-in");

  const order = await getOrderById(id, session.user.id);

  if (!order) {
    redirect("/order");
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] overflow-x-hidden">
      <div className="pt-20 sm:pt-24 px-4 sm:px-8 max-w-4xl mx-auto pb-16">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
            <CheckCircle className="w-7 h-7 text-green-400" />
          </div>
          <div>
            <h1
              className="text-xl sm:text-2xl font-bold text-white"
              style={{ fontFamily: "var(--font-cinzel), Georgia, serif" }}
            >
              Order Placed! Thank you, {session.user.name ?? "Customer"}.
            </h1>
            <p className="text-sm text-white/50 mt-1">
              ORDER # {order.id}
            </p>
          </div>
        </div>

        <div className="w-full border border-white/[0.08] rounded-lg bg-white/[0.02] overflow-hidden mb-6">
          <div className="px-4 sm:px-6 py-3 border-b border-white/[0.06] bg-white/[0.04]">
            <p className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">
              Shipping Address
            </p>
          </div>
          <div className="px-4 sm:px-6 py-4">
            <p className="text-sm font-medium text-white">
              {order.shippingName}
            </p>
            <p className="text-sm text-white/60">
              +91 {order.shippingPhone}
            </p>
            <p className="text-sm text-white/60 mt-1">
              {order.shippingAddress}, {order.shippingCity},{" "}
              {order.shippingState} — {order.shippingPincode}
            </p>
          </div>
        </div>

        <div className="w-full border border-white/[0.08] rounded-lg bg-white/[0.02] overflow-hidden mb-6">
          <div className="px-4 sm:px-6 py-3 border-b border-white/[0.06] bg-white/[0.04]">
            <p className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">
              Order Items
            </p>
          </div>
          <div className="px-4 sm:px-6 py-4 space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-md bg-white/5 overflow-hidden shrink-0 flex items-center justify-center">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.label}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Package className="w-5 h-5 text-white/20" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {item.label}
                  </p>
                  <p className="text-xs text-white/50">
                    {item.productType === "magnet" ? "Magnet" : "Poster"} ×{" "}
                    {item.quantity}
                  </p>
                </div>
                <p className="text-sm text-white/80 shrink-0">
                  ₹{(item.price / 100).toLocaleString("en-IN")}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full border border-white/[0.08] rounded-lg bg-white/[0.02] overflow-hidden mb-10">
          <div className="px-4 sm:px-6 py-3 border-b border-white/[0.06] bg-white/[0.04]">
            <p className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">
              Order Summary
            </p>
          </div>
          <div className="px-4 sm:px-6 py-4">
            <div className="flex justify-between text-sm">
              <span className="text-white/60">
                Item(s) total: {order.items.reduce((s, i) => s + i.quantity, 0)}
              </span>
              <span className="text-white/80">
                ₹{(order.totalAmount / 100).toLocaleString("en-IN")}
              </span>
            </div>
            <div className="flex justify-between text-sm mt-2 pt-2 border-t border-white/[0.06]">
              <span className="font-semibold text-white">Total Paid</span>
              <span className="font-bold text-white">
                ₹{(order.totalAmount / 100).toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/order"
            className="inline-flex items-center justify-center gap-2 py-3 px-8 rounded-4xl bg-white/10 hover:bg-white/15 text-white font-medium text-sm transition-all cursor-pointer"
            style={{ fontFamily: "var(--font-cinzel), Georgia, serif" }}
          >
            View All Orders
          </Link>
          <Link
            href="/merch"
            className="inline-flex items-center justify-center gap-2 py-3 px-8 rounded-4xl bg-[#f48b29] hover:bg-[#e07a1f] text-black font-semibold text-sm tracking-wide transition-all duration-300 cursor-pointer"
            style={{ fontFamily: "var(--font-cinzel), Georgia, serif" }}
          >
            <ShoppingBag className="w-4 h-4" />
            Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  );
}
