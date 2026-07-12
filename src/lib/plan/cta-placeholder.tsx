"use client";

import { Button } from "@/components/ui/button";
import { Mail, MessageCircle } from "lucide-react";

export function CtaPlaceholder() {
  return (
    <section className="bg-[#0a0a0a] px-4 py-20 text-center">
      <div className="mx-auto max-w-2xl">
        <h2 className="mb-4 text-3xl font-bold tracking-tight text-white md:text-4xl">
          Ready to Plan Your Journey?
        </h2>
        <p className="mb-8 text-lg text-gray-400">
          Every pilgrimage is unique. Tell us about your dream trip and
          we&apos;ll craft a custom itinerary — from sacred sites to hidden
          gems.
        </p>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Button asChild>
            <a href="mailto:hello@example.com" className="inline-flex items-center gap-2 [&_svg]:!size-5" style={{ backgroundColor: "#f48b29" }}>
              <Mail />
              Email Us
            </a>
          </Button>
          {/* TODO: replace with founder's email */}
          <Button asChild>
            <a href="https://wa.me/1234567890" className="inline-flex items-center gap-2 [&_svg]:!size-5" style={{ backgroundColor: "#f48b29" }}>
              <MessageCircle />
              WhatsApp
            </a>
          </Button>
          {/* TODO: replace with founder's WhatsApp number */}
        </div>
      </div>
    </section>
  );
}
