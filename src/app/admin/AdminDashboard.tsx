"use client";

import { useState } from "react";
import AdminOrdersTable from "./AdminOrdersTable";
import InterestTab from "./InterestTab";
import AccountsTab from "./AccountsTab";

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

type InterestEmail = {
  id: string;
  email: string;
  createdAt: Date | null;
};

type NoOrderUser = {
  id: string;
  name: string | null;
  email: string | null;
  createdAt: Date | null;
};

const tabs = [
  { id: "orders", label: "Orders" },
  { id: "interest", label: "Interest" },
  { id: "accounts", label: "Accounts" },
];

export default function AdminDashboard({
  orders,
  interestEmails,
  noOrderUsers,
}: {
  orders: Order[];
  interestEmails: InterestEmail[];
  noOrderUsers: NoOrderUser[];
}) {
  const [activeTab, setActiveTab] = useState("orders");

  return (
    <div>
      <div className="flex gap-1 mb-6 border-b border-white/10">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2.5 text-sm font-medium transition-all rounded-t-lg ${
              activeTab === tab.id
                ? "text-[#f48b29] border-b-2 border-[#f48b29]"
                : "text-white/50 hover:text-white/80"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "orders" && <AdminOrdersTable orders={orders} />}
      {activeTab === "interest" && <InterestTab emails={interestEmails} />}
      {activeTab === "accounts" && <AccountsTab users={noOrderUsers} />}
    </div>
  );
}
