import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  robots: { index: false, follow: false },
};

export default function PrivacyPolicyPage() {
  return (
    <main className="bg-white text-[#1a1a1a] min-h-screen">
      <div className="max-w-[720px] mx-auto px-6 py-12 pb-20">
        {/* Hero */}
        <div className="border-b border-[#e5e5e5] pb-8 mb-10">
          <p className="text-[11px] tracking-[0.18em] uppercase text-[#888] mb-3">
            Legal · Privacy
          </p>
          <h1 className="font-serif text-[28px] font-medium text-[#1a1a1a] leading-tight mb-2">
            Privacy Policy
          </h1>
          <p className="text-sm text-[#555] leading-relaxed">
            How Tripper collects, uses, and protects your information when you
            use our website and purchase our products.
          </p>
          <div className="flex gap-6 flex-wrap mt-4">
            <span className="flex items-center gap-1.5 text-xs text-[#888]">
              <CalendarIcon /> Effective: 14 June 2026
            </span>
            <span className="flex items-center gap-1.5 text-xs text-[#888]">
              <ClockIcon /> 2 min read
            </span>
            <span className="flex items-center gap-1.5 text-xs text-[#888]">
              <MapPinIcon /> Prayagraj, India
            </span>
          </div>
        </div>

        {/* TOC */}
        <div className="bg-[#f7f7f7] rounded-xl p-5 mb-10">
          <p className="text-[11px] tracking-[0.12em] uppercase text-[#888] mb-3">
            Contents
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-0.5">
            {tocItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="text-xs text-[#555] no-underline flex items-center gap-1.5 py-1 hover:text-[#1a1a1a]"
                >
                  {item.icon}
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Section 01 */}
        <Section num="01" id="s1" title="Information we collect" icon={<DatabaseIcon />}>
          <p>When you interact with Tripper — whether browsing our site, purchasing products, or following us on Instagram — we may collect the following:</p>
          <ul className="list-none my-2 mb-3 p-0">
            <Bullet>Name, email address, and delivery address when you place an order</Bullet>
            <Bullet>Payment information processed securely through our payment partners</Bullet>
            <Bullet>Device and browser data collected automatically when you visit our site</Bullet>
            <Bullet>Communications you send us via email or Instagram</Bullet>
          </ul>
          <p>We do not collect more than we need. We never ask for information unrelated to your order or experience.</p>
        </Section>

        {/* Section 02 */}
        <Section num="02" id="s2" title="How we use your information" icon={<ChartIcon />}>
          <p>Your information is used to:</p>
          <ul className="list-none my-2 mb-3 p-0">
            <Bullet>Process and fulfil your orders and send shipping updates</Bullet>
            <Bullet>Respond to your questions and support requests</Bullet>
            <Bullet>Improve our website, products, and content based on usage patterns</Bullet>
            <Bullet>Send occasional updates about new products or pilgrimage content, only if you opt in</Bullet>
          </ul>
          <Highlight>
            We will never use your information to send unsolicited marketing or sell it to advertisers.
          </Highlight>
        </Section>

        {/* Section 03 */}
        <Section num="03" id="s3" title="Sharing your data" icon={<ShareIcon />}>
          <p>We share your data only when necessary to deliver our services:</p>
          <ul className="list-none my-2 mb-3 p-0">
            <Bullet>Courier and shipping partners receive your delivery address to fulfil orders</Bullet>
            <Bullet>Payment processors handle your payment details under their own security standards</Bullet>
            <Bullet>Analytics tools (such as Vercel Analytics) may collect anonymised usage data</Bullet>
          </ul>
          <p>We do not sell, rent, or trade your personal data with any third party for commercial purposes.</p>
        </Section>

        {/* Section 04 */}
        <Section num="04" id="s4" title="Orders & payments" icon={<CartIcon />}>
          <p>All orders placed on Tripper are processed through secure payment gateways. We do not store your full card details on our servers. Order history may be retained for up to 3 years for accounting and customer support purposes, as required under Indian business regulations.</p>
        </Section>

        {/* Section 05 */}
        <Section num="05" id="s5" title="Cookies" icon={<CookieIcon />}>
          <p>Our website uses essential cookies to remember your cart and preferences. We may also use analytics cookies to understand how visitors navigate the site. You can disable cookies in your browser settings at any time, though some site features may not function correctly as a result.</p>
        </Section>

        {/* Section 06 */}
        <Section num="06" id="s6" title="Your rights" icon={<ShieldIcon />}>
          <p>You have the right to:</p>
          <ul className="list-none my-2 mb-3 p-0">
            <Bullet>Access the personal data we hold about you</Bullet>
            <Bullet>Request correction of inaccurate information</Bullet>
            <Bullet>Request deletion of your data, subject to legal retention requirements</Bullet>
            <Bullet>Withdraw consent for marketing communications at any time</Bullet>
          </ul>
          <p>To exercise any of these rights, reach out to us directly at the contact below.</p>
        </Section>

        {/* Section 07 */}
        <Section num="07" id="s7" title="Data security" icon={<LockIcon />}>
          <p>Tripper is hosted on Vercel with HTTPS encryption on all pages. We take reasonable technical and organisational measures to protect your data from unauthorised access. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.</p>
        </Section>

        {/* Section 08 */}
        <Section num="08" id="s8" title="Contact us" icon={<MailIcon />}>
          <p>If you have questions about this policy or how your data is handled, please get in touch:</p>
          <div className="bg-white border border-[#e5e5e5] rounded-xl p-5 mt-4">
            <ContactRow icon={<UserIcon />}>Essan Srivastava · Founder</ContactRow>
            <ContactRow icon={<MailIcon />}>
              <a href="mailto:srivastava.essan@gmail.com" className="text-[#555] no-underline hover:text-[#1a1a1a]">
                srivastava.essan@gmail.com
              </a>
            </ContactRow>
            <ContactRow icon={<MapPinIcon />}>Prayagraj, Uttar Pradesh, India</ContactRow>
            <ContactRow icon={<InstagramIcon />}>
              <a href="https://www.instagram.com/tripper.ai/" target="_blank" className="text-[#555] no-underline hover:text-[#1a1a1a]">
                @tripper.ai
              </a>
            </ContactRow>
          </div>
        </Section>

        {/* Footer */}
        <div className="border-t border-[#e5e5e5] pt-6 mt-12 flex justify-between items-center flex-wrap gap-3">
          <span className="font-serif text-base font-medium text-[#1a1a1a]">Tripper</span>
          <span className="text-xs text-[#aaa]">
            This policy may be updated. The current version is always at trippar.ai/privacy
          </span>
        </div>
      </div>
    </main>
  );
}

/* ------------------------------------------------------------------ */
/* Sub-components                                                       */
/* ------------------------------------------------------------------ */

function Section({
  num,
  id,
  title,
  icon,
  children,
}: {
  num: string;
  id: string;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div id={id} className="mb-10">
      <div className="flex items-center gap-2.5 pb-2 mb-4 border-b border-[#e5e5e5]">
        <span className="text-[11px] text-[#aaa] min-w-[20px]">{num}</span>
        <h2 className="text-base font-medium text-[#1a1a1a]">{title}</h2>
        <span className="ml-auto text-[#aaa]">{icon}</span>
      </div>
      <div className="text-sm text-[#555] leading-relaxed space-y-3">{children}</div>
    </div>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2 py-0.5">
      <PointIcon />
      <span className="text-sm text-[#555] leading-relaxed flex-1">{children}</span>
    </li>
  );
}

function Highlight({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#f7f7f7] border-l-2 border-[#ccc] px-4 py-3 text-sm text-[#555] leading-relaxed">
      {children}
    </div>
  );
}

function ContactRow({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5 text-sm text-[#555] py-1.5">
      <span className="text-[#aaa] shrink-0">{icon}</span>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Inline SVG Icons                                                    */
/* ------------------------------------------------------------------ */

function CalendarIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function DatabaseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}

function CookieIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
      <circle cx="8" cy="8" r="2" fill="currentColor" />
      <circle cx="16" cy="9" r="1.5" fill="currentColor" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function PointIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-1 shrink-0 text-[#aaa]">
      <circle cx="12" cy="12" r="2" fill="currentColor" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

const tocItems = [
  { href: "#s1", label: "Information we collect", icon: <DatabaseIcon /> },
  { href: "#s2", label: "How we use it", icon: <ChartIcon /> },
  { href: "#s3", label: "Sharing your data", icon: <ShareIcon /> },
  { href: "#s4", label: "Orders & payments", icon: <CartIcon /> },
  { href: "#s5", label: "Cookies", icon: <CookieIcon /> },
  { href: "#s6", label: "Your rights", icon: <ShieldIcon /> },
  { href: "#s7", label: "Data security", icon: <LockIcon /> },
  { href: "#s8", label: "Contact us", icon: <MailIcon /> },
];
