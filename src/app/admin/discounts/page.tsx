"use client";

import { useState, useEffect } from "react";
import { Percent, Plus, Loader2 } from "lucide-react";
import { formatPHP } from "@/lib/utils";

export default function DiscountsPage() {
  const [discounts, setDiscounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    code: "",
    type: "PERCENTAGE",
    value: "",
    minimumOrder: "",
    usageLimit: "100",
  });

  const fetchDiscounts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/discounts");
      const data = await res.json();
      if (data.success) setDiscounts(data.discounts);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/discounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          value: parseFloat(form.value),
          minimumOrder: form.minimumOrder ? parseFloat(form.minimumOrder) : 0,
          usageLimit: parseInt(form.usageLimit),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowModal(false);
        setForm({ code: "", type: "PERCENTAGE", value: "", minimumOrder: "", usageLimit: "100" });
        fetchDiscounts();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-white tracking-wide">
            Discounts & Promo Codes
          </h1>
          <p className="text-xs text-[#9ca3af] mt-1">
            Create percentage discounts, fixed PHP vouchers, and free shipping codes.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-[#f472b6] hover:bg-[#db2777] text-black font-bold text-xs rounded-lg transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create Discount Code</span>
        </button>
      </div>

      <div className="bg-[#141414] border border-[#262626] rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-[#9ca3af] flex flex-col items-center space-y-3">
            <Loader2 className="w-6 h-6 text-[#f472b6] animate-spin" />
            <span className="text-xs">Loading promo codes...</span>
          </div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-[#1a1a1a] border-b border-[#262626] text-[#9ca3af] uppercase font-mono text-[10px]">
              <tr>
                <th className="p-4">Code</th>
                <th className="p-4">Type</th>
                <th className="p-4">Value</th>
                <th className="p-4">Min. Order</th>
                <th className="p-4">Used Count</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222222]">
              {discounts.map((d) => (
                <tr key={d.id} className="hover:bg-[#181818]">
                  <td className="p-4 font-mono font-bold text-[#f472b6]">{d.code}</td>
                  <td className="p-4 text-white uppercase">{d.type}</td>
                  <td className="p-4 font-mono font-bold text-white">
                    {d.type === "PERCENTAGE" ? `${d.value}%` : formatPHP(d.value)}
                  </td>
                  <td className="p-4 font-mono text-gray-400">{formatPHP(d.minimumOrder || 0)}</td>
                  <td className="p-4 font-mono text-emerald-400">{d.usedCount} / {d.usageLimit || "∞"}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-emerald-500/20 text-emerald-400">
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#141414] border border-[#2a2a2a] rounded-2xl p-6 w-full max-w-md space-y-4">
            <h3 className="text-lg font-serif font-bold text-white">New Discount Code</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-[#9ca3af] mb-1">Code</label>
                <input
                  type="text"
                  placeholder="e.g. VIP2026"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  required
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-2.5 text-xs text-white uppercase font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#9ca3af] mb-1">Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-2.5 text-xs text-white"
                >
                  <option value="PERCENTAGE">Percentage (%)</option>
                  <option value="FIXED_AMOUNT">Fixed Amount (₱)</option>
                  <option value="FREE_SHIPPING">Free Shipping</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#9ca3af] mb-1">Value (10 for 10% or ₱1000)</label>
                <input
                  type="number"
                  placeholder="10"
                  value={form.value}
                  onChange={(e) => setForm({ ...form, value: e.target.value })}
                  required
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-2.5 text-xs text-white font-mono"
                />
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 border border-[#2a2a2a] rounded-lg text-xs text-[#9ca3af]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#f472b6] text-black font-bold rounded-lg text-xs"
                >
                  Save Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
