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
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Tripper.AI | Spiritual Journeys in India",
  description: "Discover the divine path to Kedarnath, Char Dham, and India's most sacred spiritual destinations.",
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
