

export default function Footer() {
  return (
    <footer id="reachus" className="bg-[#1a1c1c] text-white py-8 sm:py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-10">
          <div className="sm:col-span-2 md:col-span-2">
            <div className="text-2xl sm:text-3xl mb-4 sm:mb-6 tracking-wide" style={{ fontFamily: "var(--font-instrument-serif), serif" }}>
              <span className="text-[#f48b29]">Trip</span><span className="text-white">पर</span>
            </div>
            <p className="text-white/70 max-w-lg leading-relaxed mb-4 sm:mb-6 text-sm sm:text-base">
              At Tripपर, we create products that inspire you for the journey. They are designed to become part of your trip, not just proof that you were there. They guide you, let you document, and later remind quietly of moments that were your personal stories worth keeping forever.
              <br /><br />
              Because some souvenirs are not bought after the adventure ends. They are the companions that travel beside you.
            </p>
            <div className="flex gap-3 sm:gap-4 mt-2">
              <a
                href="https://www.instagram.com/tripper.ai/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 sm:w-10 sm:h-10 bg-white/10 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-[#f48b29] transition-all duration-300 shadow-sm"
                aria-label="Instagram"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3 sm:mb-4 text-white text-sm sm:text-base">Quick Links</h4>
            <ul className="space-y-2 sm:space-y-3">
              {["About Us", "Destinations", "Packages", "Contact"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-white/60 hover:text-[#f48b29] transition-colors text-sm sm:text-base">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>


        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <p className="text-white/50 text-xs sm:text-sm">
            &copy; 2026 Tripper.AI. All rights reserved.
          </p>
          <div className="flex gap-4 sm:gap-6">
            <a href="#" className="text-white/50 hover:text-white text-xs sm:text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-white/50 hover:text-white text-xs sm:text-sm transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}