import type { Metadata } from "next";
import MagnetsComponent from "./MagnetsComponent";

export const metadata: Metadata = {
  title: "Pilgrimage Magnets",
  description:
    "Premium magnetic souvenirs from Kedarnath, Dwarka, Puri, Rameshwaram, Badrinath, Gangotri, and Yamunotri. Cinematic route artwork, strong magnetic hold, collectible home decor.",
  openGraph: {
    title: "Pilgrimage Magnets | Tripper by Essan",
    description: "Premium magnetic souvenirs from Char Dham and sacred shrines.",
  },
};

export default function MagnetsPage() {
  return <MagnetsComponent />;
}
