"use client";


import { useState } from "react";
import { authClient } from "@/lib/db/auth-client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Spinner } from "@/components/ui/spinner";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);

    const { error } = await authClient.signUp.email({
      email,
      password,
      name,
    });

    if (error) {
      setError(error.message ?? "Something went wrong");
      setIsLoading(false);
      return;
    }

    router.push("/account");
    router.refresh();
  }

  async function handleGoogleSignUp() {
    setGoogleLoading(true);
    await authClient.signIn.social({ provider: "google" });
    setGoogleLoading(false);
  }

  return (
    <main className="flex-grow min-h-screen relative flex items-center justify-center py-20 bg-[#1a1c1c] text-white overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBErZkyRL3rjsYVMagEeLTpn4--HC5yRuU8FKc8rAJft5cRpdncCQGR_ROSplYSBTlMpJUj1rIOt5MPKUZ2f-UeK2buVrgc9fJ2yT5FpMdldfU62GkkN1tRVibI9fOQ5qz2cyBxnJmPGRStwrf0IP1Wd0SHoIoTg7FGfV3sy2PmEy6R51sjJ7QuRUhbE_rKO3X5Ve29HcYUGIeSZ0klBYYk3kvoRiMPYg8B3d8GPzmGK12ecm0niyPAz_yURw6D2ERlFbd6SIFTp18"
          alt="Atmospheric Background"
          fill
          className="object-cover opacity-30 grayscale"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1c1c] via-transparent to-[#1a1c1c]"></div>
      </div>

      <div className="relative z-10 w-full max-w-xl px-4 mt-1">
        <div className="bg-[#1a1a1a]/70 backdrop-blur-xl border border-white/10 rounded-xl p-8 md:p-10 flex flex-col items-center shadow-xl">
          <div className="mb-8 text-center">
            <h1 className="text-4xl md:text-5xl text-[#f48b29] mb-2 font-serif" style={{ fontFamily: "var(--font-instrument-serif), serif" }}>Create Account</h1>
            <p className="text-white/70">Begin your spiritual quest.</p>
          </div>

          <div className="w-full">
            <button
              onClick={handleGoogleSignUp}
              disabled={googleLoading}
              className="w-full flex items-center justify-center gap-3 border border-white/20 text-white/80 hover:bg-white/5 bg-transparent font-medium text-base py-4 rounded-lg transition-all cursor-pointer disabled:opacity-60"
              type="button"
            >
              {googleLoading ? (
                <Spinner className="size-5 text-white/80" />
              ) : (
                <Image src="/google-logo.svg" width={20} height={20} alt="Google" />
              )}
              <span>{googleLoading ? "Redirecting..." : "Sign up with Google"}</span>
            </button>
          </div>

          <div className="w-full flex items-center gap-4 my-6">
            <div className="h-[1px] flex-grow bg-white/10"></div>
            <span className="text-xs font-semibold tracking-wider text-white/50 uppercase">Or sign up with email</span>
            <div className="h-[1px] flex-grow bg-white/10"></div>
          </div>

          <form onSubmit={handleSubmit} className="w-full space-y-5">
            <div className="space-y-2 relative group">
              <label className="text-xs font-semibold tracking-wider text-white/70 block ml-1 transition-colors group-focus-within:text-[#f48b29]" htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Pilgrim"
                className="w-full bg-[#0e0e0e] border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#f48b29] focus:ring-1 focus:ring-[#f48b29] transition-all"
                required
              />
            </div>

            <div className="space-y-2 relative group">
              <label className="text-xs font-semibold tracking-wider text-white/70 block ml-1 transition-colors group-focus-within:text-[#f48b29]" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="yatra@spirit.com"
                className="w-full bg-[#0e0e0e] border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#f48b29] focus:ring-1 focus:ring-[#f48b29] transition-all"
                required
              />
            </div>

            <div className="space-y-2 relative group">
              <label className="text-xs font-semibold tracking-wider text-white/70 block ml-1 transition-colors group-focus-within:text-[#f48b29]" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#0e0e0e] border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#f48b29] focus:ring-1 focus:ring-[#f48b29] transition-all"
                required
              />
            </div>

            <div className="space-y-2 relative group">
              <label className="text-xs font-semibold tracking-wider text-white/70 block ml-1 transition-colors group-focus-within:text-[#f48b29]" htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#0e0e0e] border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#f48b29] focus:ring-1 focus:ring-[#f48b29] transition-all"
                required
              />
            </div>

            {error && <p className="text-red-400 text-sm text-center">{error}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full border border-white/20 text-white/80 font-medium text-sm py-2.5 rounded-lg hover:bg-white/5 active:scale-[0.98] transition-all disabled:opacity-70"
            >
              {isLoading ? "Creating account..." : "Create with Email"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-white/70 text-sm">
              Already have an account?{" "}
              <Link href="/sign-in" className="text-[#f48b29] font-bold hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
      
    </main>
  );
}
