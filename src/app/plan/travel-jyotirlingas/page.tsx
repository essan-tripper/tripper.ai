import type { Metadata } from "next";
import TravelJyotirlingasPage from "./TravelJyotirlingasPage";

export const metadata: Metadata = {
  title: "Travel the 12 Jyotirlingas",
  description:
    "Follow the 12 Jyotirlingas in canonical pilgrimage order — a parallax journey across India on an interactive map.",
  openGraph: {
    title: "Travel the 12 Jyotirlingas | Tripper by Essan",
    description:
      "Follow the 12 Jyotirlingas in canonical pilgrimage order on an interactive map.",
    type: "website",
  },
};

export default function Page() {
  return <TravelJyotirlingasPage />;
}
