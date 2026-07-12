import type { Metadata } from "next";
import { Instrument_Serif, Inter, Playfair_Display } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import { Cinzel } from "next/font/google";
import { AuthProvider } from "@/components/providers/auth-provider";
import { auth } from "@/lib/db/auth";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/Navbar";
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-cinzel",  // exposes it as a CSS variable
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://tripperbyessan.com"),
  title: {
    template: "%s | Tripper by Essan",
    default: "Tripper by Essan — Spiritual Journeys in India",
  },
  description:
    "Discover the divine path to Kedarnath, Char Dham, and India's most sacred spiritual destinations. Premium pilgrimage magnets, posters, and travel resources.",
  keywords: ["pilgrimage", "Char Dham", "Kedarnath", "spiritual travel", "India travel", "pilgrimage merchandise", "travel souvenirs"],
  openGraph: {
    type: "website",
    siteName: "Tripper by Essan",
    title: "Tripper by Essan — Spiritual Journeys in India",
    description:
      "Discover the divine path to Kedarnath, Char Dham, and India's most sacred spiritual destinations. Premium pilgrimage magnets, posters, and travel resources.",
    url: "https://tripperbyessan.com",
    images: [
      {
        url: "/LOGO.png",
        width: 512,
        height: 512,
        alt: "Tripper by Essan",
      },
    ],
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tripper by Essan",
    description:
      "Discover the divine path to Kedarnath, Char Dham, and India's most sacred spiritual destinations.",
    images: ["/LOGO.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "YOUR_GOOGLE_SEARCH_CONSOLE_ID", // placeholder — replace when live
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  alternates: {
    canonical: "https://tripperbyessan.com",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Prefetch the session on the server (a cookie-cache read, no DB hit most of the time)
  // so the client hydrates with auth state on first paint — no round trip, no flash.
  const raw = await auth.api.getSession({ headers: await headers() });
  const initialSession = raw
    ? {
        user: {
          id: raw.user.id,
          name: raw.user.name,
          email: raw.user.email,
          image: raw.user.image ?? null,
        },
        session: { id: raw.session.id, userId: raw.session.userId },
      }
    : null;

  return (
    <html lang="en">
      <body
        className={`${instrumentSerif.variable} ${inter.variable} ${playfairDisplay.variable} antialiased ${cinzel.variable}`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Tripper by Essan",
              url: "https://tripperbyessan.com",
              logo: "https://tripperbyessan.com/LOGO.png",
              description:
                "Discover the divine path to Kedarnath, Char Dham, and India's most sacred spiritual destinations.",
              foundingDate: "2025",
              founder: {
                "@type": "Person",
                name: "Essan Srivastava",
              },
            }),
          }}
        />
        <SpeedInsights/>
        <Analytics/>
        <AuthProvider initialSession={initialSession}>
          <Navbar />
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
