"use client";

import { useState } from "react";
import { Sidebar } from "@/components/admin/Sidebar";
import { TopHeader } from "@/components/admin/TopHeader";

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex">
      {/* Sidebar Navigation */}
      <Sidebar
        mobileOpen={mobileNavOpen}
        onCloseMobile={() => setMobileNavOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        <TopHeader onOpenMobileNav={() => setMobileNavOpen(true)} />
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto space-y-8">
          {children}
        </main>
      </div>
    </div>
  );
}
