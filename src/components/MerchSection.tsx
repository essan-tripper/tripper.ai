import Link from "next/link";
import Image from "next/image";

export default function MerchSection() {
  return (
    <section
      className="relative w-full overflow-hidden h-[80vh] min-h-[600px] max-h-[900px] md:h-[85vh]"
      aria-label="Merch Store"
    >
      {/* Background images — desktop + mobile */}
      <Image
        src="/merch/merch_image_background_desktop.jpeg"
        alt="Mystical merch collection featuring Shiva's Journal and sacred treks"
        fill
        priority
        sizes="100vw"
        className="hidden md:block object-cover object-center"
      />
      <Image
        src="/merch/merch_image_background_mobile.jpeg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="md:hidden object-cover object-center"
      />

      {/* Mobile gradient overlay for legibility */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 via-black/30 to-transparent md:hidden"
      />

      {/* Desktop side gradient for text legibility */}
      <div
        aria-hidden="true"
        className="absolute inset-y-0 right-0 w-1/2 hidden md:block bg-linear-to-l from-black/40 via-black/15 to-transparent"
      />

      {/* Text overlay — bottom on mobile, right side on desktop */}
      <div className="relative z-10 h-full flex flex-col items-center justify-end pb-12 px-6 text-center md:flex-row md:justify-end md:items-center md:pb-0 md:pr-[6%] md:pr-16 md:text-left">
        <div className="flex flex-col items-center gap-6 md:items-start animate-fadeInUp">
          <h1
            className="font-['var(--font-cinzel)'] text-4xl sm:text-5xl md:text-6xl lg:text-[55px] font-semibold text-amber-100 tracking-wider drop-shadow-lg -translate-y-13"
            style={{ animationDelay: "0ms" }}
          >
            MERCH STORE
          </h1>

          <Link
            href="/merch"
            className="merch-cta group relative inline-block font-['var(--font-cinzel)'] text-sm sm:text-2xl font-semibold tracking-widest text-amber-100 px-5 py-3 rounded-4xl border border-amber-100/60 bg-black/35 backdrop-blur-sm transition-all duration-300 ease-out hover:border-amber-100 hover:bg-black/50 hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-100/70 animate-fadeIn translate-x-0 -translate-y-10 md:translate-x-35 md:-translate-y-11"
            style={{ animationDelay: "200ms" }}
          >
            SHOP NOW
            <span
              aria-hidden="true"
              className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}