"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useDeferredValue, useState, useRef, useEffect } from "react";
import { Trash2, Plus, Minus, ShoppingBag, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useCartStore } from "@/lib/cart-store";
import { useSession } from "@/components/providers/auth-provider";
import LoadingLink from "@/components/LoadingLink";
import { getUserAddresses } from "@/lib/address-actions";

export default function CartComponent() {
  const router = useRouter();
  const { data: sessionData, isPending } = useSession();
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [showRerouting, setShowRerouting] = useState(false);
  const razorpayLoadedRef = useRef(false);
  const razorpayModalOpenRef = useRef(false);

  useEffect(() => {
    if (showOverlay || showRerouting) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [showOverlay, showRerouting]);

  const deferredItems = useDeferredValue(items);
  const totalItems = deferredItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = deferredItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleCheckout = useCallback(async () => {
    if (isPending || isProcessing) return;
    if (!sessionData?.user) {
      router.push("/sign-in");
      return;
    }

    setIsProcessing(true);
    setShowOverlay(true);
    razorpayModalOpenRef.current = false;

    try {
      const addresses = await getUserAddresses();
      if (addresses.length === 0) {
        router.push("/account?address=required");
        return;
      }

      const defaultAddress = addresses.find((a) => a.isDefault) ?? addresses[0];

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: deferredItems.map(({ id, productType, label, image, price, quantity }) => ({
            productType, label, image, price, quantity,
          })),
          addressId: defaultAddress.id,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      if (!razorpayLoadedRef.current) {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        await new Promise<void>((resolve, reject) => {
          script.onload = () => resolve();
          script.onerror = () => reject(new Error("Failed to load Razorpay"));
          document.body.appendChild(script);
        });
        razorpayLoadedRef.current = true;
      }

      const options = {
        key: data.key_id,
        amount: data.amount,
        currency: "INR",
        name: "Tripper.ai",
        order_id: data.razorpayOrderId,
        
        handler: async (response: any) => {
          setShowRerouting(true);
          const verifyRes = await fetch("/api/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId: data.orderId,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
            }),
          });

          if (verifyRes.ok) {
            clearCart();
            router.push(`/order/${data.orderId}`);
          } else {
            setShowRerouting(false);
            const err = await verifyRes.json();
            toast.error(err.error || "Payment verification failed");
            setIsProcessing(false);
          }
        },
        modal: {
          ondismiss: () => {
            setShowOverlay(false);
            toast.error("Payment cancelled");
            setIsProcessing(false);
          },
        },
        theme: { color: "#f48b29" },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", (response: any) => {
        setShowOverlay(false);
        toast.error(response.error?.description || "Payment failed");
        setIsProcessing(false);
      });
      razorpayModalOpenRef.current = true;
      setShowOverlay(false);
      rzp.open();
    } catch (err) {
      setShowOverlay(false);
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Something went wrong");
      setIsProcessing(false);
    }
  }, [sessionData, isPending, isProcessing, deferredItems, clearCart, router]);

  if (deferredItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
        <ShoppingBag className="w-20 h-20 text-white/10 mb-6" />
        <h1
          className="text-2xl sm:text-3xl font-bold text-white/60 mb-3"
          style={{ fontFamily: "var(--font-cinzel), Georgia, serif" }}
        >
          Your Cart is Empty
        </h1>
        <p className="text-white/30 text-sm sm:text-base mb-8 text-center max-w-md">
          Looks like you haven&apos;t added anything yet. Explore our
          collection of sacred route artwork and find something that speaks to
          you.
        </p>
        <LoadingLink href="/merch">
          <button
            className="inline-flex items-center gap-2 py-3 px-8 rounded-4xl bg-[#f48b29] hover:bg-[#e07a1f] text-black font-semibold text-sm tracking-wide transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            style={{ fontFamily: "var(--font-cinzel), Georgia, serif" }}
          >
            <ShoppingBag className="w-4 h-4" />
            Browse Merch
          </button>
        </LoadingLink>
      </div>
    );
  }

  return (
    <>
      {showOverlay && (
        <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
          <Loader2 className="w-12 h-12 animate-spin text-[#f48b29] mb-6" />
          <p className="text-white/90 text-lg sm:text-xl font-medium text-center max-w-md px-4">
            Please do not go back or refresh the page, payment in progress
          </p>
        </div>
      )}
      {showRerouting && (
        <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
          <Loader2 className="w-12 h-12 animate-spin text-[#f48b29] mb-6" />
          <p className="text-white/90 text-lg sm:text-xl font-medium text-center max-w-md px-4">
            Payment completed, rerouting
          </p>
          <p className="text-white/50 text-sm mt-2">
            Please do not refresh
          </p>
        </div>
      )}
    <div className="px-4 sm:px-8 py-8 sm:py-12 max-w-7xl mx-auto">
      <h1
        className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2"
        style={{ fontFamily: "var(--font-cinzel), Georgia, serif" }}
      >
        Your Cart
      </h1>
      <p className="text-white/40 text-sm mb-8">
        {totalItems} {totalItems === 1 ? "item" : "items"}
      </p>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        <div className="w-full lg:w-3/5 space-y-4">
          {deferredItems.map((item) => (
            <div
              key={item.id}
              className="group flex gap-4 sm:gap-6 p-4 sm:p-5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300"
            >
              <div className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-lg overflow-hidden bg-black/40 shrink-0">
                <Image
                  src={item.image}
                  alt={item.label}
                  fill
                  sizes="112px"
                  className="object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3
                      className="text-white font-semibold text-sm sm:text-base truncate"
                      style={{
                        fontFamily: "var(--font-cinzel), Georgia, serif",
                      }}
                    >
                      {item.label}
                    </h3>
                    <p className="text-white/40 text-xs sm:text-sm mt-0.5 capitalize">
                      {item.productType}
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-white/20 hover:text-red-400 transition-colors shrink-0 opacity-0 group-hover:opacity-100 focus:opacity-100"
                    aria-label={`Remove ${item.label}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-end justify-between mt-3 sm:mt-4">
                  <div className="flex items-center gap-1 border border-white/10 rounded-lg overflow-hidden">
                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.quantity - 1)
                      }
                      className="p-1.5 sm:p-2 text-white/50 hover:text-white hover:bg-white/5 transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 sm:w-10 text-center text-white text-sm sm:text-base font-medium tabular-nums">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.quantity + 1)
                      }
                      className="p-1.5 sm:p-2 text-white/50 hover:text-white hover:bg-white/5 transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="text-white font-semibold text-sm sm:text-base">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </p>
                    {item.quantity > 1 && (
                      <p className="text-white/30 text-xs">
                        ₹{item.price.toLocaleString()} each
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-end pt-2">
            <button
              onClick={clearCart}
              className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors cursor-pointer"
            >
              Clear Cart
            </button>
          </div>
        </div>

        <div className="w-full lg:w-2/5">
          <div className="sticky top-28 p-6 sm:p-8 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <h2
              className="text-lg font-semibold text-white mb-6"
              style={{ fontFamily: "var(--font-cinzel), Georgia, serif" }}
            >
              Order Summary
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-white/60">
                <span>Items ({totalItems})</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-white/60">
                <span>Shipping</span>
                <span className="text-green-400/80">Calculated at checkout</span>
              </div>
            </div>

            <div className="my-5 border-t border-white/10" />

            <div className="flex justify-between text-base">
              <span
                className="text-white font-semibold"
                style={{
                  fontFamily: "var(--font-cinzel), Georgia, serif",
                }}
              >
                Subtotal
              </span>
              <span className="text-white font-bold text-lg">
                ₹{subtotal.toLocaleString()}
              </span>
            </div>

            <p className="text-white/30 text-xs mt-2">
              Taxes and shipping calculated at checkout.
            </p>

            <button
              onClick={handleCheckout}
              disabled={isProcessing}
              className="w-full mt-6 py-4 px-8 rounded-4xl bg-[#f48b29] hover:bg-[#e07a1f] text-black font-semibold text-base tracking-wide transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer disabled:opacity-60 disabled:hover:scale-100"
              style={{ fontFamily: "var(--font-cinzel), Georgia, serif" }}
            >
              {isProcessing ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </span>
              ) : (
                "Proceed to Checkout"
              )}
            </button>

            <LoadingLink href="/merch">
              <button
                className="block text-center mt-4 text-white/30 hover:text-amber-100 text-xs tracking-wide transition-colors cursor-pointer"
              >
                Continue Shopping
              </button>
            </LoadingLink>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
