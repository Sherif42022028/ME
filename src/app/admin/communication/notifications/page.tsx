"use client";

import { useEffect, useState } from "react";
import { Bell, ShoppingBag, AlertTriangle, MessageSquare, CheckCircle2 } from "lucide-react";
import { formatDateTime } from "@/lib/utils";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([
    {
      id: "notif-1",
      type: "WHATSAPP",
      title: "New WhatsApp Inquiry",
      message: 'Camille Co: "Hi ME! Is the Vintage Chanel Blazer still available?"',
      link: "/admin/communication/whatsapp",
      read: false,
      createdAt: new Date(),
    },
    {
      id: "notif-2",
      type: "STOCK",
      title: "1-of-1 Low Stock Warning",
      message: "Jacquemus Le Chiquito Moyen Pink Leather Bag stock reached 1 unit.",
      link: "/admin/inventory",
      read: false,
      createdAt: new Date(Date.now() - 3600000),
    },
    {
      id: "notif-3",
      type: "ORDER",
      title: "New Customer Order Received",
      message: "Order ME-2026-1004 placed by Isabelle Daza (₱16,650).",
      link: "/admin/orders",
      read: true,
      createdAt: new Date(Date.now() - 7200000),
    },
  ]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="font-serif text-3xl font-bold text-white tracking-wide">
          Notifications Center
        </h1>
        <p className="text-xs text-[#9ca3af] mt-1">
          Real-time admin alerts for new orders, stock decrements, and WhatsApp customer messages.
        </p>
      </div>

      <div className="p-6 rounded-xl bg-[#141414] border border-[#262626] divide-y divide-[#222222]">
        {notifications.map((n) => (
          <div key={n.id} className="py-4 flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className="p-2 rounded-lg bg-[#f472b6]/10 border border-[#f472b6]/20 text-[#f472b6] shrink-0 mt-0.5">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">{n.title}</h4>
                <p className="text-xs text-[#9ca3af] mt-0.5">{n.message}</p>
                <span className="text-[10px] text-[#6b7280] font-mono mt-1 block">
                  {formatDateTime(n.createdAt)}
                </span>
              </div>
            </div>
            {!n.read && (
              <span className="px-2 py-0.5 rounded text-[9px] uppercase font-bold bg-[#f472b6] text-black">
                Unread
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
