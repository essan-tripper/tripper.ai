"use client";

import { useState, FormEvent } from "react";
import Image from "next/image";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export default function JournalInterest() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const res = await fetch("/api/interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }
      toast.success("Thanks! We'll keep you posted.");
      setEmail("");
      setOpen(false);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to submit");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex flex-col">
      <div className="relative overflow-hidden rounded-xl aspect-[4/5] sm:aspect-[3/4]">
        <Image
          src="/merch_page/journal_incoming.jpeg"
          alt="Journal"
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
        />
      </div>
      <div className="mt-4 flex justify-center">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button className="merch-cta inline-block font-['var(--font-cinzel)'] text-sm sm:text-2xl font-semibold tracking-widest text-amber-100 px-5 py-3 rounded-4xl border border-amber-100/60 bg-black/35 backdrop-blur-sm transition-all duration-300 ease-out hover:border-amber-100 hover:bg-black/50 hover:scale-[1.03] cursor-pointer">
              SHOW INTEREST
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Get Notified</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-1.5 rounded-lg bg-[#f48b29] text-black font-semibold text-sm tracking-wide hover:bg-[#e07a1f] disabled:opacity-50 transition-all cursor-pointer whitespace-nowrap"
              >
                {loading ? "..." : "Notify Me"}
              </button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
