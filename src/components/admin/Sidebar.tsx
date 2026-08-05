"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Layers,
  Users,
  Percent,
  TrendingUp,
  BarChart3,
  MousePointerClick,
  MessageSquare,
  Bell,
  FileText,
  UserCheck,
  Share2,
  Settings,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function Sidebar({ mobileOpen = false, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();

  const navGroups = [
    {
      group: "OVERVIEW",
      items: [
        { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
      ],
    },
    {
      group: "COMMERCE",
      items: [
        { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
        { name: "Products", href: "/admin/products", icon: Package },
        { name: "Inventory", href: "/admin/inventory", icon: Layers },
        { name: "Customers", href: "/admin/customers", icon: Users },
        { name: "Discounts", href: "/admin/discounts", icon: Percent },
      ],
    },
    {
      group: "ANALYTICS",
      items: [
        { name: "Sales", href: "/admin/analytics/sales", icon: TrendingUp },
        { name: "Traffic", href: "/admin/analytics/traffic", icon: BarChart3 },
        { name: "Conversion", href: "/admin/analytics/conversion", icon: MousePointerClick },
      ],
    },
    {
      group: "COMMUNICATION",
      items: [
        { name: "Notifications", href: "/admin/communication/notifications", icon: Bell },
      ],
    },
    {
      group: "CONTENT",
      items: [
        { name: "Homepage CMS", href: "/admin/content/homepage", icon: FileText },
        { name: "Founder Profile", href: "/admin/content/founder", icon: UserCheck },
      ],
    },
    {
      group: "SYSTEM",
      items: [
        { name: "Integrations", href: "/admin/integrations", icon: Share2 },
        { name: "Settings", href: "/admin/settings", icon: Settings },
      ],
    },
  ];

  const content = (
    <div className="flex flex-col h-full bg-[#111111] border-r border-[#222222] text-[#e5e5e5] w-64 select-none">
      {/* Brand Header */}
      <div className="p-6 border-b border-[#222222] flex items-center justify-between">
        <Link href="/admin" className="block group">
          <div className="flex items-center space-x-2">
            <span className="font-serif text-3xl font-bold tracking-widest text-white group-hover:text-[#f472b6] transition-colors">
              ME
            </span>
            <div className="h-4 w-[1px] bg-[#333333]" />
            <span className="text-xs uppercase tracking-[0.25em] text-[#9ca3af]">
              Mica Ella
            </span>
          </div>
          <p className="text-[10px] text-[#f472b6] uppercase tracking-wider mt-1 font-mono">
            Admin Dashboard
          </p>
        </Link>
        {mobileOpen && (
          <button
            onClick={onCloseMobile}
            className="p-1 text-[#9ca3af] hover:text-white rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
        {navGroups.map((group, idx) => (
          <div key={idx}>
            <h4 className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#6b7280] mb-2 px-3">
              {group.group}
            </h4>
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
                const Icon = item.icon;

                const badge = (item as any).badge;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onCloseMobile}
                    className={cn(
                      "flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all group",
                      isActive
                        ? "bg-[#1f1f1f] text-[#f472b6] font-semibold border-l-2 border-[#f472b6]"
                        : "text-[#9ca3af] hover:bg-[#1a1a1a] hover:text-white"
                    )}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className={cn("w-4 h-4 transition-colors", isActive ? "text-[#f472b6]" : "text-[#6b7280] group-hover:text-white")} />
                      <span>{item.name}</span>
                    </div>
                    {badge && (
                      <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase rounded bg-[#f472b6]/20 text-[#f472b6] border border-[#f472b6]/30">
                        {badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer / Store Badge */}
      <div className="p-4 border-t border-[#222222] bg-[#0d0d0d]">
        <div className="flex items-center justify-between text-xs text-[#9ca3af]">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Neon DB Connected</span>
          </div>
          <span className="font-mono text-[10px] text-[#6b7280]">v1.0</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block h-screen sticky top-0 z-30 shrink-0">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onCloseMobile} />
          <div className="relative z-10">{content}</div>
        </div>
      )}
    </>
  );
}
