"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Trash2, Loader2, AlertCircle } from "lucide-react";
import { formatPHP } from "@/lib/utils";

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    brand: "",
    categoryId: "",
    price: "40",
    costPrice: "15",
    size: "",
    color: "",
    condition: "EXCELLENT",
    sku: "",
    stock: "1",
    description: "",
    status: "PUBLISHED",
    images: [] as string[],
  });

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/products/${id}`);
      const data = await res.json();
      if (data.success) {
        const p = data.product;
        setForm({
          name: p.name,
          brand: p.brand,
          categoryId: p.categoryId,
          price: (p.price || 40).toString(),
          costPrice: (p.costPrice || 15).toString(),
          size: p.size,
          color: p.color,
          condition: p.condition,
          sku: p.sku,
          stock: p.stock.toString(),
          description: p.description,
          status: p.status,
          images: p.images || [],
        });
      }
    } catch (e) {
      console.error("Fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchProduct();
  }, [id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: parseFloat(form.price) || 40.0,
          costPrice: parseFloat(form.costPrice) || 15.0,
          stock: parseInt(form.stock),
          images: form.images.length > 0 ? form.images : ["/product/p1.jpg"],
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.message || "Failed to update product");
        setSaving(false);
        return;
      }

      router.push("/admin/products");
      router.refresh();
    } catch (err: any) {
      console.error("Update error:", err);
      setError("Server error updating product.");
      setSaving(false);
    }
  };

  const handleArchive = async () => {
    if (!confirm("Are you sure you want to archive this product?")) return;
    try {
      await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      router.push("/admin/products");
      router.refresh();
    } catch (e) {
      console.error("Archive error:", e);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-[#9ca3af] flex flex-col items-center space-y-3">
        <Loader2 className="w-6 h-6 text-[#f472b6] animate-spin" />
        <span className="text-xs">Fetching product from Neon DB...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link
            href="/admin/products"
            className="p-2 bg-[#181818] border border-[#2a2a2a] hover:border-[#333333] text-[#9ca3af] hover:text-white rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-serif text-3xl font-bold text-white tracking-wide">
              Edit Product Listing
            </h1>
            <p className="text-xs text-[#9ca3af] mt-0.5 font-mono">
              SKU: {form.sku}
            </p>
          </div>
        </div>

        <button
          onClick={handleArchive}
          className="px-3 py-2 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold rounded-lg transition-colors flex items-center space-x-1.5"
        >
          <Trash2 className="w-4 h-4" />
          <span>Archive Item</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="p-8 rounded-2xl bg-[#141414] border border-[#262626] space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold uppercase text-[#9ca3af] mb-2">Product Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-3 text-xs text-white focus:outline-none focus:border-[#f472b6]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-[#9ca3af] mb-2">Brand</label>
            <input
              type="text"
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
              <option value="NEW">NEW</option>
              <option value="LIKE_NEW">LIKE NEW</option>
              <option value="EXCELLENT">EXCELLENT</option>
              <option value="GOOD">GOOD</option>
              <option value="FAIR">FAIR</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-[#9ca3af] mb-2">Stock (0 = SOLD)</label>
            <input
              type="number"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
              required
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-3 text-xs text-white focus:outline-none focus:border-[#f472b6] font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-[#9ca3af] mb-2">Listing Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-3 text-xs text-white focus:outline-none focus:border-[#f472b6]"
            >
              <option value="PUBLISHED">PUBLISHED</option>
              <option value="SOLD">SOLD</option>
              <option value="DRAFT">DRAFT</option>
              <option value="ARCHIVED">ARCHIVED</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-[#9ca3af] mb-2">Editorial Description</label>
          <textarea
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
            className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-3 text-xs text-white focus:outline-none focus:border-[#f472b6]"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-3.5 px-6 bg-[#f472b6] hover:bg-[#db2777] text-black font-bold text-xs uppercase tracking-widest rounded-xl transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Updating Database Record...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Product Modifications</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
