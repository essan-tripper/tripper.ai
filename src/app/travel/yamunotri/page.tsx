import type { Metadata } from "next";
import TravelContent from "./travel-content";

const heroImage = "https://res.cloudinary.com/dbciv3dc2/image/upload/v1781384110/Yamunotri_w0upb1.jpg";

export const metadata: Metadata = {
  title: "Yatra to Yamunotri",
  description: "Plan a yatra to Yamunotri — how to reach, when to visit, where to stay, what to eat, and what it costs. A practical guide from Tripper by Essan.",
  openGraph: {
    title: "Yatra to Yamunotri | Tripper by Essan",
    description: "Plan a yatra to Yamunotri — how to reach, when to visit, where to stay, what to eat, and what it costs.",
    images: [{ url: heroImage }],
    type: "article",
  },
};

export default function Page() {
  return <TravelContent />;
}
