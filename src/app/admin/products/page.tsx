"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Search, Package, Edit, Trash2, Eye, Download, Loader2 } from "lucide-react";
import { formatPHP, downloadCSV } from "@/lib/utils";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const url = `/api/admin/products?status=${statusFilter}&search=${encodeURIComponent(search)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (e) {
      console.error("Products fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search, statusFilter]);

  const handleExportCSV = async () => {
    try {
      const res = await fetch("/api/admin/export?type=products");
      const text = await res.text();
      downloadCSV(text, `ME_Products_${Date.now()}.csv`);
    } catch (err) {
      console.error("Export error:", err);
    }
  };

  const getConditionBadge = (cond: string) => {
    switch (cond) {
      case "NEW":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "LIKE_NEW":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "EXCELLENT":
        return "bg-[#f472b6]/20 text-[#f472b6] border-[#f472b6]/30";
      case "GOOD":
        return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-white tracking-wide">
            Product Catalog
          </h1>
          <p className="text-xs text-[#9ca3af] mt-1">
            Manage luxury 1-of-1 pre-loved fashion items, stock status, and measurements.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#333333] text-white text-xs font-semibold rounded-lg transition-colors flex items-center space-x-2"
          >
            <Download className="w-4 h-4 text-[#f472b6]" />
            <span>Export CSV</span>
          </button>
          <Link
            href="/admin/products/new"
            className="px-4 py-2 bg-[#f472b6] hover:bg-[#db2777] text-black font-bold text-xs rounded-lg transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </Link>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-[#141414] border border-[#262626]">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setStatusFilter("")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              statusFilter === "" ? "bg-[#f472b6] text-black font-bold" : "text-[#9ca3af] hover:text-white"
            }`}
          >
            All Items
          </button>
          <button
            onClick={() => setStatusFilter("PUBLISHED")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              statusFilter === "PUBLISHED" ? "bg-[#f472b6] text-black font-bold" : "text-[#9ca3af] hover:text-white"
            }`}
          >
            Published
          </button>
          <button
            onClick={() => setStatusFilter("SOLD")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              statusFilter === "SOLD" ? "bg-[#f472b6] text-black font-bold" : "text-[#9ca3af] hover:text-white"
            }`}
          >
            Sold
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-[#6b7280] absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search SKU, brand, or name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-[#6b7280] focus:outline-none focus:border-[#f472b6]"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-[#141414] border border-[#262626] rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-[#9ca3af] flex flex-col items-center space-y-3">
            <Loader2 className="w-6 h-6 text-[#f472b6] animate-spin" />
            <span className="text-xs">Loading products catalog from Neon DB...</span>
          </div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center text-[#9ca3af] space-y-3">
            <Package className="w-10 h-10 text-[#333333] mx-auto" />
            <p className="text-sm font-semibold text-white">No products found</p>
            <p className="text-xs">Create your first product using the "Add New Product" button.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#1a1a1a] border-b border-[#262626] text-[#9ca3af] uppercase font-mono text-[10px]">
                <tr>
                  <th className="p-4">SKU</th>
                  <th className="p-4">Product</th>
                  <th className="p-4">Brand</th>
                  <th className="p-4">Price (PHP)</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4">Condition</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222222]">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-[#181818] transition-colors">
                    <td className="p-4 font-mono font-bold text-[#f472b6]">
                      {p.sku}
                    </td>
                    <td className="p-4">
                      <p className="font-semibold text-white">{p.name}</p>
                      <p className="text-[10px] text-[#9ca3af] font-sans">{p.category?.name} • Size: {p.size}</p>
                    </td>
                    <td className="p-4 text-[#e5e5e5] font-medium">{p.brand}</td>
                    <td className="p-4 font-mono font-bold text-white">
                      {formatPHP(p.price)}
                    </td>
                    <td className="p-4">
                      <span className={`font-mono font-bold ${p.stock === 0 ? "text-rose-400" : "text-emerald-400"}`}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-mono border ${getConditionBadge(p.condition)}`}>
                        {p.condition?.replace("_", " ")}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded text-[10px] uppercase font-bold ${
                        p.status === "SOLD" ? "bg-rose-500/20 text-rose-400" : "bg-emerald-500/20 text-emerald-400"
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <Link
                        href={`/admin/products/${p.id}`}
                        className="p-1.5 text-[#9ca3af] hover:text-white hover:bg-[#222222] rounded-lg transition-colors inline-block"
                        title="Edit Product"
                      >
                        <Edit className="w-4 h-4" />
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
