import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Travel Page Bundle",
  description:
    "Build a stunning faceless travel Instagram page using AI prompts. No photography, no followers needed — just the right prompts. Includes viral reel templates, carousel prompts, and more.",
  openGraph: {
    title: "AI Travel Page Bundle | Tripper by Essan",
    description: "Build a faceless travel Instagram page using AI prompts.",
  },
};

export default function CourseLayout({ children }: { children: React.ReactNode }) {
  return children;
}
