import type { Metadata } from "next";
import TravelContent from "./travel-content";

const heroImage = "https://res.cloudinary.com/dbciv3dc2/image/upload/v1781384110/badri_cgzxnb.jpg";

export const metadata: Metadata = {
  title: "Yatra to Badrinath",
  description: "Plan a yatra to Badrinath — how to reach, when to visit, where to stay, what to eat, and what it costs. A practical guide from Tripper by Essan.",
  openGraph: {
    title: "Yatra to Badrinath | Tripper by Essan",
    description: "Plan a yatra to Badrinath — how to reach, when to visit, where to stay, what to eat, and what it costs.",
    images: [{ url: heroImage }],
    type: "article",
  },
};

export default function Page() {
  return <TravelContent />;
}
