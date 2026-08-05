"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Users, Search, Eye, Download, Loader2 } from "lucide-react";
import { formatPHP, formatDate, downloadCSV } from "@/lib/utils";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/customers?search=${encodeURIComponent(search)}`);
      const data = await res.json();
      if (data.success) {
        setCustomers(data.customers);
      }
    } catch (e) {
      console.error("Fetch customers error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [search]);

  const handleExportCSV = async () => {
    try {
      const res = await fetch("/api/admin/export?type=customers");
      const text = await res.text();
      downloadCSV(text, `ME_Customers_${Date.now()}.csv`);
    } catch (err) {
      console.error("Export error:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-white tracking-wide">
            Customer Profiles & Lifetime Value
          </h1>
          <p className="text-xs text-[#9ca3af] mt-1">
            Real customer spending data, order counts, and profiles calculated from database records.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2 bg-[#f472b6] hover:bg-[#db2777] text-black font-bold text-xs rounded-lg transition-colors flex items-center space-x-2 w-fit"
        >
          <Download className="w-4 h-4" />
          <span>Export Customers CSV</span>
        </button>
      </div>

      <div className="p-4 rounded-xl bg-[#141414] border border-[#262626]">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-[#6b7280] absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by customer name, email, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-[#6b7280] focus:outline-none focus:border-[#f472b6]"
          />
        </div>
      </div>

      <div className="bg-[#141414] border border-[#262626] rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-[#9ca3af] flex flex-col items-center space-y-3">
            <Loader2 className="w-6 h-6 text-[#f472b6] animate-spin" />
            <span className="text-xs">Loading customer records from Neon DB...</span>
          </div>
        ) : customers.length === 0 ? (
          <div className="p-12 text-center text-[#9ca3af] space-y-3">
            <Users className="w-10 h-10 text-[#333333] mx-auto" />
            <p className="text-sm font-semibold text-white">No customers found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#1a1a1a] border-b border-[#262626] text-[#9ca3af] uppercase font-mono text-[10px]">
                <tr>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Phone Number</th>
                  <th className="p-4">Orders Count</th>
                  <th className="p-4">Total Lifetime Spent</th>
                  <th className="p-4">Customer Since</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222222]">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-[#181818] transition-colors">
                    <td className="p-4">
                      <p className="font-semibold text-white">{c.name}</p>
                      <p className="text-[10px] text-[#9ca3af]">{c.email}</p>
                    </td>
                    <td className="p-4 font-mono text-[#e5e5e5]">{c.phone || "N/A"}</td>
                    <td className="p-4 font-mono text-white">{c.orderCount} order(s)</td>
                    <td className="p-4 font-mono font-bold text-emerald-400">
                      {formatPHP(c.totalSpent)}
                    </td>
                    <td className="p-4 text-[#9ca3af] font-mono">
                      {formatDate(c.createdAt)}
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
