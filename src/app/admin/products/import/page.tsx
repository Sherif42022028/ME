"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCw, FolderDown, CheckSquare, Square, Save, Sparkles, Loader2, PackageCheck } from "lucide-react";
import { formatPHP } from "@/lib/utils";

export default function ProductImportPage() {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string[]>([]);
  const [drafts, setDrafts] = useState<any[]>([]);
  const [creating, setCreating] = useState(false);

  const fetchScan = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/products/import");
      const data = await res.json();
      if (data.success) {
        setImages(data.images);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScan();
  }, []);

  const toggleSelect = (filename: string) => {
    if (selected.includes(filename)) {
      setSelected(selected.filter((f) => f !== filename));
    } else {
      setSelected([...selected, filename]);
    }
  };

  const handleCreateDraft = async () => {
    if (selected.length === 0) return;
    setCreating(true);
    try {
      const res = await fetch("/api/admin/products/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filenames: selected,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setDrafts([data.product, ...drafts]);
        setSelected([]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link
            href="/admin/products"
            className="p-2 bg-[#181818] border border-[#2a2a2a] hover:border-[#333333] text-[#9ca3af] hover:text-white rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-serif text-3xl font-bold text-white tracking-wide flex items-center space-x-3">
              <FolderDown className="w-6 h-6 text-[#f472b6]" />
              <span>Product Image Folder Importer</span>
            </h1>
            <p className="text-xs text-[#9ca3af] mt-0.5">
              Scan local product assets folder (<code className="text-white">d:\ME\product</code>), group images, and generate 1-of-1 product drafts.
            </p>
          </div>
        </div>

        <button
          onClick={fetchScan}
          className="p-2.5 bg-[#181818] border border-[#2a2a2a] hover:border-[#333333] text-[#9ca3af] hover:text-white rounded-lg text-xs transition-colors flex items-center space-x-2"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-[#f472b6]" : ""}`} />
          <span>Rescan Asset Folder</span>
        </button>
      </div>

      {/* Control Actions Bar */}
      <div className="p-4 rounded-xl bg-[#141414] border border-[#262626] flex items-center justify-between">
        <span className="text-xs text-[#9ca3af]">
          Selected: <strong className="text-white font-mono">{selected.length} image(s)</strong>
        </span>

        <button
          onClick={handleCreateDraft}
          disabled={selected.length === 0 || creating}
          className="px-4 py-2 bg-[#f472b6] hover:bg-[#db2777] text-black font-bold text-xs uppercase tracking-widest rounded-lg transition-colors flex items-center space-x-2 disabled:opacity-50"
        >
          {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          <span>Group & Create Product Draft</span>
        </button>
      </div>

      {/* Detected Images Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          Detected Image Assets ({images.length})
        </h3>

        {loading ? (
          <div className="p-12 text-center text-[#9ca3af] flex flex-col items-center space-y-3">
            <Loader2 className="w-6 h-6 text-[#f472b6] animate-spin" />
            <span className="text-xs">Scanning d:\ME\product asset directory...</span>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
            {images.map((img) => {
              const isSelected = selected.includes(img.filename);
              return (
                <div
                  key={img.filename}
                  onClick={() => toggleSelect(img.filename)}
                  className={`group relative aspect-[3/4] rounded-xl overflow-hidden bg-[#181818] border cursor-pointer transition-all ${
                    isSelected ? "border-[#f472b6] ring-2 ring-[#f472b6]/50 scale-102" : "border-[#262626] hover:border-[#333333]"
                  }`}
                >
                  <img src={img.url} alt={img.filename} className="w-full h-full object-cover" />
                  
                  <div className="absolute top-2 right-2 p-1 rounded-md bg-black/60 backdrop-blur-xs text-white">
                    {isSelected ? <CheckSquare className="w-4 h-4 text-[#f472b6]" /> : <Square className="w-4 h-4 text-gray-400" />}
                  </div>

                  <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-black via-black/70 to-transparent text-[10px] text-[#e5e5e5] font-mono truncate">
                    {img.filename}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Newly Created Drafts List */}
      {drafts.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-[#222222]">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
            <PackageCheck className="w-4 h-4 text-[#f472b6]" />
            <span>Generated Product Drafts ({drafts.length})</span>
          </h3>

          <div className="space-y-3">
            {drafts.map((d) => (
              <div key={d.id} className="p-4 rounded-xl bg-[#141414] border border-[#262626] flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img src={d.images[0]} alt={d.name} className="w-12 h-16 object-cover rounded-lg bg-[#181818]" />
                  <div>
                    <p className="text-xs font-semibold text-white">{d.name}</p>
                    <p className="text-[10px] text-[#9ca3af] font-mono">SKU: {d.sku} • Stock: {d.stock}</p>
                    <span className="px-2 py-0.5 rounded text-[9px] uppercase font-bold bg-amber-500/20 text-amber-400 font-mono inline-block mt-1">
                      {d.status}
                    </span>
                  </div>
                </div>

                <Link
                  href={`/admin/products/${d.id}`}
                  className="px-3.5 py-2 bg-[#181818] border border-[#2a2a2a] hover:border-[#333333] text-white text-xs font-semibold rounded-lg transition-colors"
                >
                  Edit & Publish Item →
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
