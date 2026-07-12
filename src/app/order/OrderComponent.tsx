"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Package, ShoppingBag } from "lucide-react";

type OrderItem = {
  id: string;
  productType: string;
  label: string;
  image: string;
  price: number;
  quantity: number;
};

type OrderWithItems = {
  id: string;
  totalAmount: number;
  paymentStatus: string | null;
  deliveryStatus: string | null;
  createdAt: string | null;
  items: OrderItem[];
};

export default function OrderComponent({ orders }: { orders: OrderWithItems[] }) {
  const [activeTab, setActiveTab] = useState<"orders" | "buy-again">("orders");

  const filteredOrders =
    activeTab === "buy-again"
      ? orders.filter((o) => o.deliveryStatus === "delivered")
      : orders;

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] px-4">
        <Package className="w-20 h-20 text-white/10 mb-6" />
        <h2
          className="text-xl sm:text-2xl font-bold text-white/60 mb-3"
          style={{ fontFamily: "var(--font-cinzel), Georgia, serif" }}
        >
          No orders yet
        </h2>
        <p className="text-white/30 text-sm sm:text-base mb-8 text-center max-w-md">
          Your orders will appear here once you complete a purchase. Start
          exploring our collection of sacred route artwork.
        </p>
        <Link
          href="/merch"
          className="inline-flex items-center gap-2 py-3 px-8 rounded-4xl bg-[#f48b29] hover:bg-[#e07a1f] text-black font-semibold text-sm tracking-wide transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          style={{ fontFamily: "var(--font-cinzel), Georgia, serif" }}
        >
          <ShoppingBag className="w-4 h-4" />
          Browse Merch
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-2 border-b border-white/10 pb-0">
        <button
          onClick={() => setActiveTab("orders")}
          className={`px-6 py-2.5 text-sm font-medium rounded-t-lg transition-colors cursor-pointer ${
            activeTab === "orders"
              ? "bg-[#f48b29] text-black"
              : "bg-white/10 text-white/70 hover:text-white"
          }`}
        >
          Orders
        </button>
        <button
          onClick={() => setActiveTab("buy-again")}
          className={`px-6 py-2.5 text-sm font-medium rounded-t-lg transition-colors cursor-pointer ${
            activeTab === "buy-again"
              ? "bg-[#f48b29] text-black"
              : "bg-white/10 text-white/70 hover:text-white"
          }`}
        >
          Buy Again
        </button>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[30vh] px-4">
          <p className="text-white/40 text-sm">
            {activeTab === "buy-again"
              ? "No delivered orders to re-purchase yet."
              : "No orders found."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="w-full border border-white/[0.08] rounded-lg bg-white/[0.02] overflow-hidden"
            >
              <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 bg-white/[0.04] px-4 sm:px-6 py-3 border-b border-white/[0.06]">
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">
                    ORDER PLACED
                  </p>
                  <p className="text-sm text-white/80">
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "—"}
                  </p>
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">
                    TOTAL
                  </p>
                  <p className="text-sm text-white/80">
                    ₹{(order.totalAmount / 100).toLocaleString("en-IN")}
                  </p>
                </div>
                <div className="min-w-0 text-right">
                  <p className="text-[11px] font-semibold text-white/40 uppercase tracking-wider break-all">
                    ORDER # {order.id.slice(0, 12)}...
                  </p>
                  <div className="flex gap-3 mt-0.5 justify-end">
                    <Link
                      href={`/order/${order.id}`}
                      className="text-xs text-[#f48b29] hover:text-[#e07a1f] transition-colors cursor-pointer"
                    >
                      View order details
                    </Link>
                    <span className="text-xs text-white/30 cursor-default">
                      Invoice ▾
                    </span>
                  </div>
                </div>
              </div>

              <div className="px-4 sm:px-6 py-4 space-y-3">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3"
                  >
                    <div className="w-12 h-12 rounded-md bg-white/5 overflow-hidden shrink-0 flex items-center justify-center">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.label}
                          width={48}
                          height={48}
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
          ))}
        </div>
      )}
    </div>
  );
}
