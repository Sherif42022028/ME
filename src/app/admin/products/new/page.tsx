"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Loader2, AlertCircle } from "lucide-react";

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    brand: "",
    categoryId: "dresses-gowns",
    price: "40",
    costPrice: "15",
    size: "S",
    color: "Black",
    condition: "EXCELLENT",
    sku: "",
    stock: "1",
    description: "",
    imageUrl: "",
    status: "PUBLISHED",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Create product request
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: parseFloat(form.price) || 40.0,
          costPrice: parseFloat(form.costPrice) || 15.0,
          stock: parseInt(form.stock),
          images: [form.imageUrl || "/product/p1.jpg"],
          categoryId: form.categoryId || "cl_cat_1",
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.message || "Failed to create product");
        setLoading(false);
        return;
      }

      router.push("/admin/products");
      router.refresh();
    } catch (err: any) {
      console.error("Create error:", err);
      setError("Server error creating product.");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center space-x-3">
        <Link
          href="/admin/products"
          className="p-2 bg-[#181818] border border-[#2a2a2a] hover:border-[#333333] text-[#9ca3af] hover:text-white rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="font-serif text-3xl font-bold text-white tracking-wide">
            Add New Product
          </h1>
          <p className="text-xs text-[#9ca3af] mt-0.5">
            Create a luxury 1-of-1 pre-loved item listing for ME — Mica Ella.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-8 rounded-2xl bg-[#141414] border border-[#262626] space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold uppercase text-[#9ca3af] mb-2">Product Name</label>
            <input
              type="text"
              placeholder="e.g. Chanel Tweed Structured Blazer"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-3 text-xs text-white focus:outline-none focus:border-[#f472b6]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-[#9ca3af] mb-2">SKU Code</label>
            <input
              type="text"
              placeholder="e.g. ME-BLZ-901"
              value={form.sku}
              onChange={(e) => setForm({ ...form, sku: e.target.value.toUpperCase() })}
              required
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-3 text-xs text-white focus:outline-none focus:border-[#f472b6] font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-[#9ca3af] mb-2">Brand</label>
            <input
              type="text"
              placeholder="e.g. Chanel, Jacquemus, Dior"
              value={form.brand}
              onChange={(e) => setForm({ ...form, brand: e.target.value })}
              required
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-3 text-xs text-white focus:outline-none focus:border-[#f472b6]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-[#9ca3af] mb-2">Selling Price in PHP (₱)</label>
            <input
              type="number"
              placeholder="40"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-3 text-xs text-white focus:outline-none focus:border-[#f472b6] font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-[#9ca3af] mb-2">Cost Price (COGS) in PHP (₱)</label>
            <input
              type="number"
              placeholder="15"
              value={form.costPrice}
              onChange={(e) => setForm({ ...form, costPrice: e.target.value })}
              required
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-3 text-xs text-white focus:outline-none focus:border-[#f472b6] font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-[#9ca3af] mb-2">Condition</label>
            <select
              value={form.condition}
              onChange={(e) => setForm({ ...form, condition: e.target.value })}
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-3 text-xs text-white focus:outline-none focus:border-[#f472b6]"
            >
              <option value="NEW">NEW (With Tags)</option>
              <option value="LIKE_NEW">LIKE NEW (Pre-owned, Pristine)</option>
              <option value="EXCELLENT">EXCELLENT (Minor Signs of Wear)</option>
              <option value="GOOD">GOOD (Gently Used)</option>
              <option value="FAIR">FAIR (Vintage Character)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-[#9ca3af] mb-2">Stock (1-of-1 Item = 1)</label>
            <input
              type="number"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
              required
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-3 text-xs text-white focus:outline-none focus:border-[#f472b6] font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-[#9ca3af] mb-2">Size</label>
            <input
              type="text"
              placeholder="e.g. S / EU 36"
              value={form.size}
              onChange={(e) => setForm({ ...form, size: e.target.value })}
              required
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-3 text-xs text-white focus:outline-none focus:border-[#f472b6]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-[#9ca3af] mb-2">Color</label>
            <input
              type="text"
              placeholder="e.g. Noir Black & Gold"
              value={form.color}
              onChange={(e) => setForm({ ...form, color: e.target.value })}
              required
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-3 text-xs text-white focus:outline-none focus:border-[#f472b6]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-[#9ca3af] mb-2">Image URL</label>
          <input
            type="url"
            placeholder="https://images.unsplash.com/photo-..."
            value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-3 text-xs text-white focus:outline-none focus:border-[#f472b6] font-mono"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-[#9ca3af] mb-2">Editorial Description</label>
          <textarea
            rows={4}
            placeholder="Detailed description of item craftsmanship, material composition, authenticity..."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
            className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-3 text-xs text-white focus:outline-none focus:border-[#f472b6]"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 px-6 bg-[#f472b6] hover:bg-[#db2777] text-black font-bold text-xs uppercase tracking-widest rounded-xl transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving Product to Database...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Publish Product Listing</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
