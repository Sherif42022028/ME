"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Filter, Eye, Download, ShoppingBag, Loader2 } from "lucide-react";
import { formatPHP, formatDateTime, downloadCSV } from "@/lib/utils";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const statuses = [
    { label: "All Orders", value: "" },
    { label: "Pending", value: "PENDING" },
    { label: "Processing", value: "PROCESSING" },
    { label: "Shipped", value: "SHIPPED" },
    { label: "Delivered", value: "DELIVERED" },
    { label: "Cancelled", value: "CANCELLED" },
  ];

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const url = `/api/admin/orders?status=${statusFilter}&search=${encodeURIComponent(search)}&page=${page}&limit=10`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
        setTotalPages(data.pagination.totalPages || 1);
      }
    } catch (e) {
      console.error("Orders fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, search, page]);

  const handleExportCSV = async () => {
    try {
      const res = await fetch("/api/admin/export?type=orders");
      const text = await res.text();
      downloadCSV(text, `ME_Orders_${Date.now()}.csv`);
    } catch (err) {
      console.error("Export error:", err);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "SHIPPED":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "PROCESSING":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "PENDING":
        return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "CANCELLED":
        return "bg-rose-500/20 text-rose-400 border-rose-500/30";
      default:
        return "bg-[#222222] text-white border-[#333333]";
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-white tracking-wide">
            Orders Management
          </h1>
          <p className="text-xs text-[#9ca3af] mt-1">
            View, track, and update order statuses with automatic history logging.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2 bg-[#f472b6] hover:bg-[#db2777] text-black font-bold text-xs rounded-lg transition-colors flex items-center space-x-2 w-fit"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-[#141414] border border-[#262626]">
        {/* Status Tabs */}
        <div className="flex items-center space-x-1 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {statuses.map((s) => (
            <button
              key={s.value}
              onClick={() => {
                setStatusFilter(s.value);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                statusFilter === s.value
                  ? "bg-[#f472b6] text-black font-bold"
                  : "text-[#9ca3af] hover:text-white hover:bg-[#1f1f1f]"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-[#6b7280] absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search order # or customer..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-[#6b7280] focus:outline-none focus:border-[#f472b6]"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-[#141414] border border-[#262626] rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-[#9ca3af] flex flex-col items-center space-y-3">
            <Loader2 className="w-6 h-6 text-[#f472b6] animate-spin" />
            <span className="text-xs">Loading orders from Neon database...</span>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center text-[#9ca3af] space-y-3">
            <ShoppingBag className="w-10 h-10 text-[#333333] mx-auto" />
            <p className="text-sm font-semibold text-white">No orders found</p>
            <p className="text-xs">Try clearing search filters or checking another status tab.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#1a1a1a] border-b border-[#262626] text-[#9ca3af] uppercase font-mono text-[10px]">
                <tr>
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Items</th>
                  <th className="p-4">Total Amount</th>
                  <th className="p-4">Payment</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222222]">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-[#181818] transition-colors">
                    <td className="p-4 font-mono font-bold text-[#f472b6]">
                      {ord.orderNumber}
                    </td>
                    <td className="p-4">
                      <p className="font-semibold text-white">{ord.customer?.name}</p>
                      <p className="text-[10px] text-[#9ca3af]">{ord.customer?.email}</p>
                    </td>
                    <td className="p-4">
                      <span className="font-mono text-white">{ord.items?.length || 0} item(s)</span>
                    </td>
                    <td className="p-4 font-mono font-bold text-white">
                      {formatPHP(ord.totalAmount)}
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded text-[10px] uppercase font-mono bg-emerald-500/20 text-emerald-400">
                        {ord.paymentStatus}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase border ${getStatusBadge(ord.status)}`}>
                        {ord.status}
                      </span>
                    </td>
                    <td className="p-4 text-[#9ca3af] whitespace-nowrap">
                      {formatDateTime(ord.createdAt)}
                    </td>
                    <td className="p-4 text-right">
                      <Link
                        href={`/admin/orders/${ord.id}`}
                        className="p-1.5 text-[#9ca3af] hover:text-[#f472b6] hover:bg-[#222222] rounded-lg transition-colors inline-block"
                        title="View Order Details"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
