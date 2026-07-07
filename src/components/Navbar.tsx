"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Menu, LogOut, ShoppingBag, Package, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { useSession } from "@/components/providers/auth-provider";
import { authClient } from "@/lib/db/auth-client";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Home", href: "/", icon: null },
  { label: "Merch", href: "/merch", icon: ShoppingBag },
  { label: "Order", href: "/order", icon: Package },
  { label: "Cart", href: "/cart", icon: ShoppingBag },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data, isPending } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHomePage = pathname === "/";
  const isAuthPage = pathname === "/sign-in" || pathname === "/sign-up";
  const isCoursePage = pathname === "/course";
  const showTransparent = (isHomePage || isAuthPage || isCoursePage) && !isScrolled;

  async function handleSignOut() {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  }

  const userInitial = data?.user?.email?.charAt(0)?.toUpperCase() ?? "?";

  return (
    <>
      {/* Desktop navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "hidden md:flex fixed top-0 left-0 right-0 z-50 h-16 transition-colors duration-500",
          showTransparent ? "bg-transparent" : "bg-black/60 backdrop-blur-md"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 lg:px-8 w-full flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-start">
            <span className="flex flex-col items-center leading-tight" style={{ fontFamily: "var(--font-instrument-serif), serif" }}>
              <span className="text-3xl font-serif text-[#f48b29] tracking-wide">Tripper</span>
              <span className="text-[10px] text-white tracking-[2px] uppercase">BYESSAN</span>
            </span>
          </Link>

          {/* Nav links */}
          <div className="flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={cn(
                    "text-sm font-medium transition-colors duration-300",
                    isActive
                      ? "text-[#f48b29]"
                      : "text-white/90 hover:text-[#f48b29]"
                  )}
                >
                  <span className="flex items-center gap-1.5">
                    {link.label}
                    {link.label === "Merch" && (
                      <span className="text-[10px] font-bold text-white bg-red-500 px-1.5 py-0.5 rounded-full animate-pulse">
                        SALE
                      </span>
                    )}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Auth area */}
          <div>
            {isPending ? null : data?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer size-8">
                    <AvatarFallback className="bg-[#f48b29] text-white text-xs font-semibold">
                      {userInitial}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="bg-[#1a1c1c] border border-white/10 text-white min-w-[220px] p-2"
                >
                  <div className="flex items-center gap-3 px-2 py-2.5">
                    <Avatar className="size-8">
                      <AvatarFallback className="bg-[#f48b29] text-white text-xs font-semibold">
                        {userInitial}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-white/60 truncate">
                      {data.user.email}
                    </span>
                  </div>
                  <DropdownMenuSeparator className="-mx-2 my-1.5 bg-white/5" />
                  <DropdownMenuItem
                    onClick={() => router.push("/account")}
                    className="cursor-pointer transition-all duration-200 hover:bg-white/[0.07] hover:text-[#f48b29]"
                  >
                    <User className="w-4 h-4 mr-2 transition-colors duration-200 group-hover:text-[#f48b29]" />
                    My Account
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="-mx-2 my-1.5 bg-white/5" />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="text-red-400 hover:text-red-300 hover:bg-white/[0.07] cursor-pointer transition-all duration-200"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/sign-in">
                <Button className="bg-[#f48b29] hover:bg-[#924c00] text-white rounded-lg px-4 py-2 text-sm font-medium shadow-[0_4px_14px_rgba(244,139,41,0.35)] hover:shadow-[0_6px_20px_rgba(244,139,41,0.45)] transition-all duration-300 cursor-pointer">
                  Get Started
                </Button>
              </Link>
            )}
          </div>
        </div>
      </motion.nav>

      {/* Mobile navbar */}
      <nav className="md:hidden fixed top-0 left-0 right-0 z-50 h-14 bg-black/60 backdrop-blur-md flex items-center justify-between px-4">
        <Link href="/" className="flex items-start">
          <span className="flex flex-col items-center leading-tight" style={{ fontFamily: "var(--font-instrument-serif), serif" }}>
            <span className="text-2xl font-serif text-[#f48b29] tracking-wide">Tripper</span>
            <span className="text-[10px] text-white tracking-[2px] uppercase">BYESSAN</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {isPending ? null : data?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer size-7">
                  <AvatarFallback className="bg-[#f48b29] text-white text-[10px] font-semibold">
                    {userInitial}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-[#1a1c1c] border border-white/10 text-white min-w-[200px] p-2"
              >
                <div className="flex items-center gap-3 px-2 py-2.5">
                  <Avatar className="size-7">
                    <AvatarFallback className="bg-[#f48b29] text-white text-[10px] font-semibold">
                      {userInitial}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-white/60 truncate">
                    {data.user.email}
                  </span>
                </div>
                <DropdownMenuSeparator className="-mx-2 my-1.5 bg-white/5" />
                <DropdownMenuItem
                  onClick={() => router.push("/account")}
                  className="cursor-pointer transition-all duration-200 hover:bg-white/[0.07] hover:text-[#f48b29] text-sm"
                >
                  <User className="w-3.5 h-3.5 mr-2 transition-colors duration-200 group-hover:text-[#f48b29]" />
                  My Account
                </DropdownMenuItem>
                <DropdownMenuSeparator className="-mx-2 my-1.5 bg-white/5" />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="text-red-400 hover:text-red-300 hover:bg-white/[0.07] cursor-pointer transition-all duration-200 text-sm"
                >
                  <LogOut className="w-3.5 h-3.5 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/sign-in">
              <Button className="bg-[#f48b29] hover:bg-[#924c00] text-white rounded-lg px-3 py-1.5 text-xs font-medium shadow-[0_4px_14px_rgba(244,139,41,0.35)] transition-all duration-300 cursor-pointer h-auto">
                Get Started
              </Button>
            </Link>
          )}

          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-white/80 hover:text-white"
              >
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="bg-[#1a1c1c] border-white/10 text-white pt-14"
            >
              <SheetHeader>
                <SheetTitle className="text-white/80 text-base font-serif">
                  Menu
                </SheetTitle>
              </SheetHeader>

              <div className="flex flex-col gap-1 mt-6">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <SheetClose key={link.label} asChild>
                      <Link
                        href={link.href}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200",
                          isActive
                            ? "text-[#f48b29] bg-white/5"
                            : "text-white/70 hover:text-white hover:bg-white/5"
                        )}
                      >
                        <span className="flex items-center gap-1.5">
                          {link.label}
                          {link.label === "Merch" && (
                            <span className="text-[10px] font-bold text-white bg-red-500 px-1.5 py-0.5 rounded-full">
                              SALE
                            </span>
                          )}
                        </span>
                      </Link>
                    </SheetClose>
                  );
                })}
              </div>

              {/* Bottom area */}
              <div className="mt-auto pt-8 border-t border-white/10 space-y-1">
                {data?.user && (
                  <div className="px-4 py-2 text-xs text-white/50 truncate">
                    {data.user.email}
                  </div>
                )}
                {data?.user ? (
                  <>
                    <SheetClose asChild>
                      <Link
                        href="/account"
                        className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-white/80 hover:text-[#f48b29] hover:bg-white/5 transition-colors"
                      >
                        <User className="w-4 h-4" />
                        My Account
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-white/5 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </SheetClose>
                  </>
                ) : (
                  <SheetClose asChild>
                    <Link href="/sign-in">
                      <Button className="w-full bg-[#f48b29] hover:bg-[#924c00] text-white rounded-lg py-2.5 text-sm font-medium">
                        Get Started
                      </Button>
                    </Link>
                  </SheetClose>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </>
  );
}
