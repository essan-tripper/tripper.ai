"use client";

import { useState } from "react";
import { toast } from "sonner";

type OrderItem = {
  id: string;
  productType: string;
  label: string;
  price: number;
  quantity: number;
};

type Order = {
  id: string;
  totalAmount: number;
  paymentStatus: string | null;
  deliveryStatus: string | null;
  shippingName: string | null;
  shippingPhone: string | null;
  shippingAddress: string | null;
  shippingCity: string | null;
  shippingState: string | null;
  shippingPincode: string | null;
  createdAt: Date | null;
  userEmail: string | null;
  userName: string | null;
  items: OrderItem[];
};

const statusOptions = ["pending", "shipped", "delivered", "cancelled"];

function StatusBadge({ status }: { status: string | null }) {
  const colors: Record<string, string> = {
    pending: "bg-yellow-500/20 text-yellow-400",
    processing: "bg-blue-500/20 text-blue-400",
    shipped: "bg-purple-500/20 text-purple-400",
    delivered: "bg-green-500/20 text-green-400",
    cancelled: "bg-red-500/20 text-red-400",
  };
  return (
    <span className={`text-xs px-2 py-1 rounded-full font-medium ${colors[status || ""] || "bg-white/10 text-white/60"}`}>
      {status || "—"}
    </span>
  );
}

function PaymentBadge({ status }: { status: string | null }) {
  const colors: Record<string, string> = {
    paid: "bg-green-500/20 text-green-400",
    pending: "bg-yellow-500/20 text-yellow-400",
    failed: "bg-red-500/20 text-red-400",
  };
  return (
    <span className={`text-xs px-2 py-1 rounded-full font-medium ${colors[status || ""] || "bg-white/10 text-white/60"}`}>
      {(status || "—").toUpperCase()}
    </span>
  );
}

export default function AdminOrdersTable({ orders }: { orders: Order[] }) {
  const [updating, setUpdating] = useState<string | null>(null);
  const [localOrders, setLocalOrders] = useState(orders);
  const [pendingStatuses, setPendingStatuses] = useState<Record<string, string>>({});

  function getPendingStatus(order: Order): string {
    return pendingStatuses[order.id] ?? order.deliveryStatus ?? "pending";
  }

  async function handleUpdate(orderId: string) {
    const newStatus = pendingStatuses[orderId];
    if (!newStatus) return;
    setUpdating(orderId);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, deliveryStatus: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update");
      setLocalOrders(prev => prev.map(o => o.id === orderId ? { ...o, deliveryStatus: newStatus } : o));
      setPendingStatuses(prev => {
        const next = { ...prev };
        delete next[orderId];
        return next;
      });
      toast.success("Status updated");
    } catch {
      toast.error("Failed to update status");
    } finally {
      setUpdating(null);
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-white/80">
        <thead>
          <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-white/40">
            <th className="pb-3 pr-4">Order ID</th>
            <th className="pb-3 pr-4">Customer</th>
            <th className="pb-3 pr-4">Email</th>
            <th className="pb-3 pr-4">Items</th>
            <th className="pb-3 pr-4">Total</th>
            <th className="pb-3 pr-4">Payment</th>
            <th className="pb-3 pr-4">Delivery</th>
            <th className="pb-3 pr-4">Date</th>
            <th className="pb-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {localOrders.map((order) => {
            const currentStatus = order.deliveryStatus ?? "pending";
            const pendingStatus = pendingStatuses[order.id];
            const showPending = pendingStatus !== undefined && pendingStatus !== currentStatus;

            return (
              <tr key={order.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                <td className="py-3 pr-4 font-mono text-xs text-white/50">{order.id.slice(0, 12)}...</td>
                <td className="py-3 pr-4">{order.shippingName || order.userName || "—"}</td>
                <td className="py-3 pr-4 text-white/60 text-xs">{order.userEmail || "—"}</td>
                <td className="py-3 pr-4">
                  <div className="flex flex-col gap-0.5">
                    {order.items.map((item) => (
                      <span key={item.id} className="text-xs text-white/70">{item.label} × {item.quantity}</span>
                    ))}
                  </div>
                </td>
                <td className="py-3 pr-4 font-mono">₹{(order.totalAmount / 100).toLocaleString()}</td>
                <td className="py-3 pr-4"><PaymentBadge status={order.paymentStatus} /></td>
                <td className="py-3 pr-4"><StatusBadge status={showPending ? pendingStatus : currentStatus} /></td>
                <td className="py-3 pr-4 text-xs text-white/50">
                  {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "—"}
                </td>
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <select
                      value={getPendingStatus(order)}
                      onChange={(e) => setPendingStatuses(prev => ({ ...prev, [order.id]: e.target.value }))}
                      className="bg-black/40 border border-white/20 text-white text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-[#f48b29]"
                    >
                      {statusOptions.map((s) => (
                        <option key={s} value={s} className="bg-[#1a1c1c]">{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                      ))}
                    </select>
                    {showPending && (
                      <button
                        onClick={() => handleUpdate(order.id)}
                        disabled={updating === order.id}
                        className="px-3 py-1.5 rounded-lg bg-[#f48b29] text-black text-xs font-semibold hover:bg-[#e07a1f] disabled:opacity-50 transition-all cursor-pointer whitespace-nowrap"
                      >
                        {updating === order.id ? "..." : "Update"}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
          {localOrders.length === 0 && (
            <tr>
              <td colSpan={9} className="py-12 text-center text-white/40">No orders yet</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
