import type { Metadata } from "next";
import PostersComponent from "./PostersComponent";

export const metadata: Metadata = {
  title: "Cinematic Pilgrimage Posters",
  description:
    "Premium cinematic posters featuring sacred journey artwork. Designed by Essan with hyper-realistic route visuals, museum-quality prints of Kedarnath Yatra and more.",
  openGraph: {
    title: "Cinematic Pilgrimage Posters | Tripper by Essan",
    description: "Premium cinematic posters of sacred journey artwork.",
  },
};

export default function PostersPage() {
  return <PostersComponent />;
}
