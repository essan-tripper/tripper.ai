"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCartStore } from "@/lib/cart-store";
import { useSession } from "@/components/providers/auth-provider";

const magnetVariants = [
  { id: "kedarnath", label: "Kedarnath", image: "/magnets/kedanathmagnet.jpeg", price: 129 },
  { id: "dwarka", label: "Dwarka", image: "/magnets/dwarkamaget.jpeg", price: 129 },
  { id: "puri", label: "Puri", image: "/magnets/purimagnet.jpeg", price: 129 },
  { id: "rameshwaram", label: "Rameshwaram", image: "/magnets/rameshwarammagnet.jpeg", price: 129 },
  { id: "pack", label: "Pack of 4", image: "/magnets/combomagnets.jpeg", price: 399 },
];

const aboutItems = [
  {
    icon: "✨",
    text: "Premium Print Quality — Designed by Essan and printed on durable long-lasting papers with vibrant detail for everyday durability.",
  },
  {
    icon: "🧲",
    text: "Strong Magnetic Hold — Equipped with powerful magnets that securely hold notes, photos, postcards, and memories without slipping.",
  },
  {
    icon: "🗺️",
    text: "Cinematic Route Artwork — Each design features hyper-realistic travel-inspired map visuals crafted to feel immersive, artistic, and deeply connected to the journey itself.",
  },
  {
    icon: "🏠",
    text: "Functional Home Decor — More than just magnets — these are collectible decor pieces designed to elevate modern homes, desks, refrigerators, and memory walls.",
  },
  {
    icon: "🎁",
    text: "Perfect Collectible Keepsake — A thoughtful keepsake for travellers, pilgrims, journal lovers, and anyone connected to the beauty of exploration and self-discovery.",
  },
];

const specifications = [
  { label: "Material", value: "Premium MDF Wood + Rubber Magnet Backing" },
  { label: "Shape", value: "Rectangular" },
  { label: "Size", value: "Medium" },
  { label: "Dimensions", value: "2.5 × 3.5 inches" },
  { label: "Weight", value: "Approx. 50g" },
  { label: "Finish", value: "Glossy Premium Print" },
  { label: "Brand", value: "Tripper.Ai" },
];

export default function MagnetsComponent() {
  const router = useRouter();
  const { data: sessionData, isPending } = useSession();
  const { addItem } = useCartStore();
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [imageSrc, setImageSrc] = useState(magnetVariants[0].image);

  const handleVariantChange = (index: number) => {
    setSelectedVariant(index);
    setImageSrc(magnetVariants[index].image);
  };

  const currentVariant = magnetVariants[selectedVariant];

  const handleAddToCart = useCallback(() => {
    addItem({
      id: `magnet-${currentVariant.id}`,
      productType: "magnet",
      label: currentVariant.label,
      image: currentVariant.image,
      price: currentVariant.price,
      quantity: 1,
    });
    toast.success(`${currentVariant.label} added to cart`);
  }, [currentVariant, addItem]);

  const handleBuyNow = useCallback(() => {
    if (isPending) return;
    if (!sessionData.user) {
      router.push("/sign-in");
      return;
    }
    addItem({
      id: `magnet-${currentVariant.id}`,
      productType: "magnet",
      label: currentVariant.label,
      image: currentVariant.image,
      price: currentVariant.price,
      quantity: 1,
    });
    router.push("/cart");
  }, [currentVariant, addItem, sessionData, isPending, router]);

  return (
    <main className="min-h-screen bg-[#0a0a0a] overflow-x-hidden">
      {/* Breadcrumb */}
      <div className="pt-20 sm:pt-24 px-4 sm:px-8 max-w-7xl mx-auto">
        <Link
          href="/merch"
          className="inline-flex items-center gap-2 text-white/40 hover:text-amber-100 transition-colors text-sm"
        >
          <span>←</span>
          <span>Back to Merch</span>
        </Link>
      </div>

      {/* Product Section */}
      <div className="px-4 sm:px-8 py-8 sm:py-12 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Left: Image Display */}
          <div className="w-full lg:w-2/5">
            {/* Main Image with smooth transition */}
            <div className="relative rounded-xl overflow-hidden bg-black/40 aspect-[3/4]">
              <Image
                key={imageSrc}
                src={imageSrc}
                alt="Pilgrims Magnet"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover transition-all duration-500 ease-out"
              />
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="w-full lg:w-3/5 flex flex-col">
            {/* Category + Title */}
            <div className="mb-2">
              <span className="text-[#f48b29] text-xs tracking-[0.2em] uppercase font-medium">
                Sacred Routes Collection
              </span>
            </div>

            <h1
              className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight"
              style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}
            >
              Pilgrim&apos;s Magnet — Surreal Pilgrimage Route Artwork for Inspiration, Reflection and Aesthetics
            </h1>

            {/* Tagline */}
            <p className="mt-4 text-amber-100/80 text-sm sm:text-base italic">
              Carry a fragment of the journey with you.
            </p>

            {/* Description */}
            <p className="mt-4 text-white/60 text-sm sm:text-base leading-relaxed">
              Designed as collectible keepsakes, these magnets capture sacred routes, timeless temples,
              and the spirit of pilgrimage through cinematic map artwork inspired by India&apos;s divine
              destinations — The Four Dhams. Crafted to blend beautifully into your personal space,
              whether on your fridge, workspace, or memory wall, each magnet becomes a small reminder
              of the roads once travelled or the stories still waiting to unfold.
            </p>

            {/* Price */}
            <div className="mt-6 flex items-baseline gap-3 flex-wrap">
              <span className="text-3xl sm:text-4xl font-bold text-white transition-all duration-300">
                ₹{currentVariant.price.toLocaleString()}
              </span>
              {selectedVariant === 4 && (
                <span className="text-sm text-green-400 bg-green-400/10 px-2 py-1 rounded">
                  Best Value
                </span>
              )}
            </div>

            {/* Divider */}
            <div className="my-6 border-t border-white/10" />

            {/* Variant Selector */}
            <div>
              <h2
                className="text-sm font-medium text-white/60 mb-3 uppercase tracking-wider"
                style={{ fontFamily: "var(--font-cinzel), Georgia, serif" }}
              >
                Select Design
              </h2>
              <div className="flex flex-wrap gap-2">
                {magnetVariants.map((variant, i) => (
                  <button
                    key={variant.id}
                    onClick={() => handleVariantChange(i)}
                    className={`px-4 py-2 rounded-full text-sm font-medium tracking-wide transition-all duration-300 border ${
                      i === selectedVariant
                        ? "border-[#f48b29] text-amber-100 bg-[#f48b29]/10 shadow-[0_0_12px_rgba(244,139,41,0.3)]"
                        : "border-white/20 text-white/60 hover:border-white/40 hover:text-white/80 bg-black/20"
                    }`}
                    style={{ fontFamily: "var(--font-cinzel), Georgia, serif" }}
                  >
                    {variant.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="my-6 border-t border-white/10" />

            {/* About */}
            <div>
              <h2
                className="text-lg font-semibold text-white mb-4"
                style={{ fontFamily: "var(--font-cinzel), Georgia, serif" }}
              >
                About This Magnet
              </h2>
              <ul className="space-y-3">
                {aboutItems.map((item, i) => (
                  <li key={i} className="flex gap-3 text-sm sm:text-base text-white/70 leading-relaxed">
                    <span className="shrink-0 text-base">{item.icon}</span>
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Divider */}
            <div className="my-6 border-t border-white/10" />

            {/* Specifications */}
            <div>
              <h2
                className="text-lg font-semibold text-white mb-4"
                style={{ fontFamily: "var(--font-cinzel), Georgia, serif" }}
              >
                Specifications
              </h2>
              <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
                {specifications.map((spec) => (
                  <div key={spec.label} className="flex">
                    <span className="text-white/40 w-32 shrink-0">{spec.label}</span>
                    <span className="text-white/80">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="my-6 border-t border-white/10" />

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 py-4 px-8 rounded-4xl bg-[#f48b29] hover:bg-[#e07a1f] text-black font-semibold text-base sm:text-lg tracking-wide transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                style={{ fontFamily: "var(--font-cinzel), Georgia, serif" }}
              >
                ADD TO CART
              </button>
              <button
                onClick={handleBuyNow}
                className="merch-cta flex-1 py-4 px-8 rounded-4xl border border-amber-100/60 bg-black/35 backdrop-blur-sm text-amber-100 font-semibold text-base sm:text-lg tracking-wide transition-all duration-300 hover:border-amber-100 hover:bg-black/50 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                style={{ fontFamily: "var(--font-cinzel), Georgia, serif" }}
              >
                BUY NOW
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
