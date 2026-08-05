"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Search, Menu, X, Heart } from "lucide-react";
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
    <header className="sticky top-0 z-40 bg-[#0d0d0d]/90 backdrop-blur-md border-b border-[#222222]">
      {/* Announcement Bar */}
      <div className="bg-gradient-to-r from-[#141414] via-[#1f1f1f] to-[#141414] border-b border-[#222222] py-2 text-center text-[11px] font-sans tracking-widest text-[#f472b6] uppercase font-semibold">
        Complimentary Express Shipping Across Philippines on Orders Above ₱15,000
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-[#9ca3af] hover:text-white"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Brand Logo */}
        <Link href="/" className="group text-center md:text-left">
          <span className="font-serif text-3xl font-bold tracking-widest text-white group-hover:text-[#f472b6] transition-colors">
            ME
          </span>
          <span className="block text-[9px] uppercase tracking-[0.3em] text-[#9ca3af] -mt-1 font-sans">
            Micaela Ella
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8 text-xs uppercase tracking-widest font-semibold">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "transition-colors hover:text-[#f472b6]",
                pathname === l.href ? "text-[#f472b6] font-bold border-b border-[#f472b6] pb-0.5" : "text-[#d1d5db]"
              )}
            >
              {l.name}
            </Link>
          ))}
        </nav>

        {/* Right Actions: Search & Cart */}
        <div className="flex items-center space-x-5">
          <Link href="/shop" className="text-[#9ca3af] hover:text-white transition-colors" title="Search Products">
            <Search className="w-4 h-4" />
          </Link>
          <Link href="/cart" className="relative text-white hover:text-[#f472b6] transition-colors p-1" title="Shopping Cart">
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1.5 w-4 h-4 rounded-full bg-[#f472b6] text-black font-bold text-[10px] flex items-center justify-center font-mono">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#111111] border-b border-[#222222] px-6 py-6 space-y-4 text-xs font-semibold uppercase tracking-widest animate-in slide-in-from-top-4 duration-200">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-[#d1d5db] hover:text-[#f472b6]"
            >
              {l.name}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
