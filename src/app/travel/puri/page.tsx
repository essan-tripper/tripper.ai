import type { Metadata } from "next";
import TravelContent from "./travel-content";

const heroImage = "https://res.cloudinary.com/dbciv3dc2/image/upload/v1781384110/Jagannath_ths5zz.jpg";

export const metadata: Metadata = {
  title: "Yatra to Puri",
  description: "Plan a yatra to Puri — how to reach, when to visit, where to stay, what to eat, and what it costs. A practical guide from Tripper by Essan.",
  openGraph: {
    title: "Yatra to Puri | Tripper by Essan",
    description: "Plan a yatra to Puri — how to reach, when to visit, where to stay, what to eat, and what it costs.",
    images: [{ url: heroImage }],
    type: "article",
  },
};

export default function Page() {
  return <TravelContent />;
}
