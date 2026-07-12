"use client";

import Image from "next/image";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, Minus } from "lucide-react";
import { toast } from "sonner";
import { useCartStore } from "@/lib/cart-store";
import { useSession } from "@/components/providers/auth-provider";
import { ProductZoom } from "@/components/ProductZoom";

const images = [
  "https://res.cloudinary.com/dbciv3dc2/image/upload/v1783888332/Posters1_cv871p.jpg",
  "https://res.cloudinary.com/dbciv3dc2/image/upload/v1783888329/Posters2_zzkfle.jpg",
  "https://res.cloudinary.com/dbciv3dc2/image/upload/v1783888330/Posters3_yssmt5.jpg",
  "https://res.cloudinary.com/dbciv3dc2/image/upload/v1783888333/Posters4_onk14a.jpg",
  "https://res.cloudinary.com/dbciv3dc2/image/upload/v1783888332/Posters5_pw7gtq.jpg",
  "https://res.cloudinary.com/dbciv3dc2/image/upload/v1783888327/Posters6_npipve.jpg",
];

const aboutItems = [
  {
    icon: "✨",
    text: "Premium Quality — Designed by Essan and printed with rich cinematic detailing, vibrant colors, and sharp contrasts for an immersive premium finish and a frame built to last.",
  },
  {
    icon: "🏔️",
    text: "Cinematic Pilgrimage Artwork — Features a hyper-realistic surreal route visual inspired by the sacred Kedarnath Yatra, blending spiritual storytelling with modern artistic aesthetics.",
  },
  {
    icon: "🖼️",
    text: "Premium Wall Decor — Created to complement modern interiors, creative workspaces, meditation corners, and travel-inspired rooms with a dark luxury aesthetic.",
  },
  {
    icon: "🎁",
    text: "Meaningful Collectible — A thoughtful keepsake for travellers, pilgrims, spiritual seekers, and lovers of cinematic map artwork.",
  },
  {
    icon: "🌌",
    text: "Designed to Inspire — Every detail is crafted to evoke wonder, reflection, and the feeling of standing at the beginning of a life-changing journey.",
  },
];

const specifications = [
  { label: "Brand", value: "Tripper.Ai" },
  { label: "Colour", value: "Neelkanth" },
  { label: "Product Dimensions", value: "14L x 9.5W Inch" },
  { label: "Shape", value: "Rectangular" },
  { label: "Mounting Type", value: "Wall Mount / Table Top" },
  { label: "Frame Material", value: "Premium Synthetic Frame" },
  { label: "Paper Weight", value: "300 GSM" },
  { label: "Print Technology", value: "Ultra HD Pigment" },
];

export default function PostersComponent() {
  const router = useRouter();
  const { data: sessionData, isPending } = useSession();
  const { items, addItem, updateQuantity } = useCartStore();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const posterId = "poster-kedarnath";
  const cartItem = items.find((i) => i.id === posterId);

  const handleAddToCart = useCallback(() => {
    addItem({
      id: posterId,
      productType: "poster",
      label: "Surreal Pilgrimage Route Poster",
      image: "https://res.cloudinary.com/dbciv3dc2/image/upload/v1783888332/Posters1_cv871p.jpg",
      price: 1299,
      quantity: 1,
    });
    toast.success("Poster added to cart");
  }, [addItem]);

  const handleBuyNow = useCallback(() => {
    if (isPending) return;
    if (!sessionData.user) {
      router.push("/sign-in");
      return;
    }
    addItem({
      id: posterId,
      productType: "poster",
      label: "Surreal Pilgrimage Route Poster",
      image: "https://res.cloudinary.com/dbciv3dc2/image/upload/v1783888332/Posters1_cv871p.jpg",
      price: 1299,
      quantity: 1,
    });
    router.push("/cart");
  }, [addItem, sessionData, isPending, router]);

  return (
    <main className="min-h-screen bg-[#0a0a0a] overflow-x-hidden pt-14 md:pt-16">
      {/* Product Section */}
      <div className="px-4 sm:px-8 py-8 sm:py-12 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Left: Image Carousel */}
          <div className="w-full lg:w-2/5">
            {/* Main Image */}
            <ProductZoom
              src={images[selectedIndex]}
              alt="Surreal Pilgrimage Route Poster"
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="mb-4"
            />

            {/* Thumbnail row */}
            <div className="flex gap-3 justify-center flex-wrap">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedIndex(i)}
                  className={`relative rounded-lg overflow-hidden border-2 transition-all duration-200 w-16 h-16 sm:w-[70px] sm:h-[70px] ${
                    i === selectedIndex
                      ? "border-[#f48b29] scale-105"
                      : "border-white/10 hover:border-white/30"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`Preview ${i + 1}`}
                    fill
                    sizes="70px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="w-full lg:w-3/5 flex flex-col">
            {/* Category + Title */}
            <div className="mb-2">
              <span className="text-[#f48b29] text-xs tracking-[0.2em] uppercase font-medium">
                Sacred Routes Collection — Kedarnath Edition
              </span>
            </div>

            <h1
              className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight"
              style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}
            >
              Surreal Pilgrimage Route Poster for Inspiration, Reflection and Aesthetics | Perfect for rooms, workspaces, studios, meditation corners, and travel walls.
            </h1>

            {/* Tagline */}
            <p className="mt-4 text-amber-100/80 text-sm sm:text-base italic">
              A Trek That Will Change Your Life.
            </p>

            {/* Description */}
            <p className="mt-4 text-white/60 text-sm sm:text-base leading-relaxed">
              Designed as a cinematic visual keepsake, this artwork captures the emotional beauty of the
              sacred Kedarnath journey from start to summit. It all begins from the peaceful ghats of
              Rishikesh and ends in the divine silence of the Himalayas. Blending surreal landscapes,
              glowing pilgrimage routes, timeless temples, and spiritual storytelling, the poster transforms
              sacred geography into an immersive visual experience inspired by the real places and path
              toward self-discovery.
            </p>

            {/* Price */}
            <div className="mt-6 flex items-baseline gap-3 flex-wrap">
              <span className="text-3xl sm:text-4xl font-bold text-white">
                ₹1,299
              </span>
              <span className="text-lg text-white/40 line-through">₹1,499</span>
              <span className="text-sm text-green-400 bg-green-400/10 px-2 py-1 rounded">
                13% off
              </span>
            </div>

            {/* Divider */}
            <div className="my-6 border-t border-white/10" />

            {/* About */}
            <div>
              <h2
                className="text-lg font-semibold text-white mb-4"
                style={{ fontFamily: "var(--font-cinzel), Georgia, serif" }}
              >
                About This Poster
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
              {cartItem ? (
                <div
                  className="flex-1 inline-flex items-center justify-center gap-4 py-4 px-8 rounded-4xl bg-[#f48b29] text-black font-semibold text-base sm:text-lg tracking-wide"
                  style={{ fontFamily: "var(--font-cinzel), Georgia, serif" }}
                >
                  <button
                    onClick={() => updateQuantity(posterId, cartItem.quantity - 1)}
                    className="hover:scale-110 transition-transform cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="w-8 text-center tabular-nums">{cartItem.quantity}</span>
                  <button
                    onClick={() => updateQuantity(posterId, cartItem.quantity + 1)}
                    className="hover:scale-110 transition-transform cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-4 px-8 rounded-4xl bg-[#f48b29] hover:bg-[#e07a1f] text-black font-semibold text-base sm:text-lg tracking-wide transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                  style={{ fontFamily: "var(--font-cinzel), Georgia, serif" }}
                >
                  ADD TO CART
                </button>
              )}
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
