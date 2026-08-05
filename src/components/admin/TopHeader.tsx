"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Bell, Menu, LogOut, User, ShieldCheck } from "lucide-react";
import { GlobalSearchModal } from "./GlobalSearchModal";

interface TopHeaderProps {
  onOpenMobileNav?: () => void;
}

export function TopHeader({ onOpenMobileNav }: TopHeaderProps) {
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch (e) {
      console.error("Logout error:", e);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-20 bg-[#111111]/90 backdrop-blur-md border-b border-[#222222] px-4 md:px-8 py-3.5 flex items-center justify-between">
        {/* Left: Mobile Nav Toggle + Search Input Trigger */}
        <div className="flex items-center space-x-3 flex-1 max-w-md">
          <button
            onClick={onOpenMobileNav}
            className="md:hidden p-2 text-[#9ca3af] hover:text-white rounded-lg hover:bg-[#1a1a1a]"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Quick Search Button Trigger */}
          <button
            onClick={() => setSearchOpen(true)}
            className="w-full flex items-center space-x-3 px-3.5 py-2 rounded-lg bg-[#181818] border border-[#262626] text-[#9ca3af] hover:border-[#333333] hover:text-white transition-all text-xs text-left"
          >
            <Search className="w-4 h-4 text-[#f472b6]" />
            <span className="flex-1 font-sans">Search orders, products, SKUs, customers...</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-[#222222] text-[#9ca3af] rounded border border-[#333333]">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-3">
          {/* Notifications Bell Button */}
          <button
            onClick={() => router.push("/admin/communication/notifications")}
            className="relative p-2 text-[#9ca3af] hover:text-white rounded-lg hover:bg-[#1a1a1a] transition-colors"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#f472b6] animate-ping" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#f472b6]" />
          </button>

          {/* Admin User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center space-x-2.5 p-1.5 rounded-lg hover:bg-[#1a1a1a] transition-colors border border-transparent hover:border-[#2a2a2a]"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#f472b6] to-[#db2777] flex items-center justify-center text-black font-bold text-xs uppercase shadow-sm">
                ME
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-white leading-tight">Mica Ella</p>
                <p className="text-[10px] text-[#f472b6] font-mono flex items-center space-x-1">
                  <ShieldCheck className="w-3 h-3 inline" />
                  <span>Admin Owner</span>
                </p>
              </div>
            </button>

            {/* Dropdown Menu */}
            {userDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-[#141414] border border-[#2a2a2a] rounded-xl shadow-2xl py-1 text-xs text-[#e5e5e5] z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-4 py-2 border-b border-[#222222]">
                  <p className="font-semibold text-white">Mica Ella</p>
                  <p className="text-[10px] text-[#9ca3af]">mica.ella.admin@gmail.com</p>
                </div>
                <button
                  onClick={() => {
                    setUserDropdownOpen(false);
                    router.push("/admin/settings");
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-[#1f1f1f] flex items-center space-x-2 text-[#9ca3af] hover:text-white"
                >
                  <User className="w-4 h-4" />
                  <span>Account Settings</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-rose-500/10 text-rose-400 flex items-center space-x-2 border-t border-[#222222]"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Global Search Overlay */}
      <GlobalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
