import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import CartComponent from "./CartComponent";

export const metadata: Metadata = {
  title: "Shopping Cart",
  robots: { index: false, follow: false },
};

export default function CartPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] overflow-x-hidden">
      <div className="pt-20 sm:pt-24 px-4 sm:px-8 max-w-7xl mx-auto">
        <Link
          href="/merch"
          className="inline-flex items-center gap-2 text-white/40 hover:text-amber-100 transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Merch</span>
        </Link>
      </div>
      <CartComponent />
    </main>
  );
}
