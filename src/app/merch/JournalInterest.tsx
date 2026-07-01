"use client";

import { useState, FormEvent } from "react";
import Image from "next/image";
import { toast } from "sonner";

export default function JournalInterest() {
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

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
      setShowForm(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to submit");
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
        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="merch-cta inline-block font-['var(--font-cinzel)'] text-sm sm:text-2xl font-semibold tracking-widest text-amber-100 px-5 py-3 rounded-4xl border border-amber-100/60 bg-black/35 backdrop-blur-sm transition-all duration-300 ease-out hover:border-amber-100 hover:bg-black/50 hover:scale-[1.03] cursor-pointer"
          >
            SHOW INTEREST
          </button>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-xs">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="flex-1 px-4 py-3 rounded-4xl bg-black/40 border border-white/20 text-white text-sm placeholder:text-white/40 focus:outline-none focus:border-[#f48b29] transition-colors"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-3 rounded-4xl bg-[#f48b29] text-black font-semibold text-sm tracking-wide hover:bg-[#e07a1f] disabled:opacity-50 transition-all cursor-pointer"
            >
              {loading ? "..." : "GO"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
