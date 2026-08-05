"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Search, Menu, X, Heart } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(1);

  const links = [
    { name: "Home", href: "/" },
    { name: "Shop 1-of-1", href: "/shop" },
    { name: "About ME", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "FAQ", href: "/faq" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 dark:bg-[#0B0B0B]/90 backdrop-blur-md border-b border-[#E8E3DD] dark:border-[#222222] transition-colors duration-200">
      {/* Announcement Bar */}
      <div className="bg-gradient-to-r from-[#F5F0EB] via-[#FAF8F5] to-[#F5F0EB] dark:from-[#141414] dark:via-[#1f1f1f] dark:to-[#141414] border-b border-[#E8E3DD] dark:border-[#222222] py-2 text-center text-[11px] font-sans tracking-widest text-[#E99AB4] dark:text-[#F3A6BE] uppercase font-semibold">
        Complimentary Express Shipping Across Philippines on Orders Above ₱15,000
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-[#66615D] dark:text-[#9ca3af] hover:text-[#171717] dark:hover:text-white"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Brand Logo */}
        <Link href="/" className="group text-center md:text-left">
          <span className="font-serif text-3xl font-bold tracking-widest text-[#171717] dark:text-white group-hover:text-[#E99AB4] dark:group-hover:text-[#F3A6BE] transition-colors">
            ME
          </span>
          <span className="block text-[9px] uppercase tracking-[0.3em] text-[#66615D] dark:text-[#9ca3af] -mt-1 font-sans">
            Mica Ella
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8 text-xs uppercase tracking-widest font-semibold">
          {links.map((l) => {
            const isActive = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "relative py-1 transition-colors hover:text-[#E99AB4] dark:hover:text-[#F3A6BE]",
                  isActive ? "text-[#171717] dark:text-white font-bold" : "text-[#66615D] dark:text-[#d1d5db]"
                )}
              >
                <span>{l.name}</span>
                {/* Gold active indicator */}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C9A45C] dark:bg-[#D4AF6A] rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions: Search, Theme Toggle, & Cart */}
        <div className="flex items-center space-x-4">
          <ThemeToggle />

          <Link href="/shop" className="text-[#66615D] dark:text-[#9ca3af] hover:text-[#171717] dark:hover:text-white transition-colors" title="Search Products">
            <Search className="w-4 h-4" />
          </Link>

          <Link href="/cart" className="relative text-[#171717] dark:text-white hover:text-[#E99AB4] dark:hover:text-[#F3A6BE] transition-colors p-1" title="Shopping Bag">
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1.5 w-4 h-4 rounded-full bg-[#E99AB4] dark:bg-[#F3A6BE] text-black font-bold text-[10px] flex items-center justify-center font-mono">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FAF8F5] dark:bg-[#111111] border-b border-[#E8E3DD] dark:border-[#222222] px-6 py-6 space-y-4 text-xs font-semibold uppercase tracking-widest animate-in slide-in-from-top-4 duration-200">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-[#171717] dark:text-[#d1d5db] hover:text-[#E99AB4] dark:hover:text-[#F3A6BE]"
            >
              {l.name}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
