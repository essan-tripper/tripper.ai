import Link from "next/link";
import Image from "next/image";
import JournalInterest from "./JournalInterest";

const products = [
  {
    id: "magnets",
    name: "Magnets",
    image: "/merch_page/magnets.jpeg",
    href: "/magnets",
    clickable: true,
  },
  {
    id: "posters",
    name: "Posters",
    image: "/merch_page/posters.jpeg",
    href: "/posters",
    clickable: true,
  },
  {
    id: "journal",
    name: "Journal",
    image: "/merch_page/journal_incoming.jpeg",
    href: null,
    clickable: false,
  },
];

export default function MerchPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] overflow-x-hidden">
      {/* Page content */}
      <div className="pt-20 sm:pt-24 pb-16 px-4 sm:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <span className="text-[#f48b29] text-xs tracking-[0.25em] uppercase font-medium">
            Sacred Merchandise
          </span>
          <h1
            className="mt-3 text-4xl sm:text-5xl md:text-6xl font-bold text-white"
            style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}
          >
            Merch Store
          </h1>
          <p className="mt-4 text-sm sm:text-base text-white/50 max-w-lg mx-auto leading-relaxed">
            Carry the spirit of the yatra with you. Handpicked artifacts and
            keepsakes from the sacred journey.
          </p>
        </div>

        {/* 3-column product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {products.map((product) => {
            if (!product.clickable) {
              return <JournalInterest key={product.id} />;
            }

            // Magnets & Posters - clickable cards
            return (
              <Link
                key={product.id}
                href={product.href!}
                className="group relative flex flex-col cursor-pointer block"
              >
                <div className="relative overflow-hidden rounded-xl aspect-[4/5] sm:aspect-[3/4] group">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Buy Now button */}
                <div className="mt-4 flex justify-center">
                  <span className="merch-cta inline-block font-['var(--font-cinzel)'] text-sm sm:text-2xl font-semibold tracking-widest text-amber-100 px-5 py-3 rounded-4xl border border-amber-100/60 bg-black/35 backdrop-blur-sm transition-all duration-300 ease-out hover:border-amber-100 hover:bg-black/50 hover:scale-[1.03]">
                    BUY NOW
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}