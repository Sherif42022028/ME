"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, X, Package, ShoppingBag, User, Loader2 } from "lucide-react";
import { formatPHP } from "@/lib/utils";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GlobalSearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{
    products: any[];
    orders: any[];
    customers: any[];
  }>({ products: [], orders: [], customers: [] });

  useEffect(() => {
    if (!query || query.length < 2) {
      setResults({ products: [], orders: [], customers: [] });
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (data.success) {
          setResults(data.results);
        }
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/80 backdrop-blur-md">
      <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Search Header Input */}
        <div className="p-4 border-b border-[#2a2a2a] flex items-center space-x-3 bg-[#1a1a1a]">
          <Search className="w-5 h-5 text-[#f472b6]" />
          <input
            type="text"
            placeholder="Search orders (ME-2026-...), products (SKU/name), customers..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="flex-1 bg-transparent text-white placeholder-[#6b7280] text-sm focus:outline-none font-sans"
          />
          {loading && <Loader2 className="w-4 h-4 text-[#f472b6] animate-spin" />}
          <button onClick={onClose} className="p-1 text-[#9ca3af] hover:text-white rounded-md">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Results Display */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-6">
          {query.length >= 2 && !loading && results.products.length === 0 && results.orders.length === 0 && results.customers.length === 0 && (
            <div className="text-center py-8 text-[#9ca3af] text-sm">
              No matching records found for "{query}".
            </div>
          )}

          {/* Products Section */}
          {results.products.length > 0 && (
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#9ca3af] mb-2 flex items-center space-x-2">
                <Package className="w-3.5 h-3.5 text-[#f472b6]" />
                <span>Products ({results.products.length})</span>
              </h4>
              <div className="space-y-1">
                {results.products.map((p) => (
                  <Link
                    key={p.id}
                    href={`/admin/products/${p.id}`}
                    onClick={onClose}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-[#222222] transition-colors"
                  >
                    <div>
                      <p className="text-xs font-semibold text-white">{p.name}</p>
                      <p className="text-[10px] text-[#9ca3af] font-mono">SKU: {p.sku}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-mono font-bold text-[#f472b6]">{formatPHP(p.price)}</p>
                      <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                        {p.status}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Orders Section */}
          {results.orders.length > 0 && (
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#9ca3af] mb-2 flex items-center space-x-2">
                <ShoppingBag className="w-3.5 h-3.5 text-[#f472b6]" />
                <span>Orders ({results.orders.length})</span>
              </h4>
              <div className="space-y-1">
                {results.orders.map((o) => (
                  <Link
                    key={o.id}
                    href={`/admin/orders/${o.id}`}
                    onClick={onClose}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-[#222222] transition-colors"
                  >
                    <div>
                      <p className="text-xs font-mono font-semibold text-white">{o.orderNumber}</p>
                      <p className="text-[10px] text-[#9ca3af]">{new Date(o.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-mono font-bold text-white">{formatPHP(o.totalAmount)}</p>
                      <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-[#f472b6]/20 text-[#f472b6]">
                        {o.status}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Customers Section */}
          {results.customers.length > 0 && (
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#9ca3af] mb-2 flex items-center space-x-2">
                <User className="w-3.5 h-3.5 text-[#f472b6]" />
                <span>Customers ({results.customers.length})</span>
              </h4>
              <div className="space-y-1">
                {results.customers.map((c) => (
                  <Link
                    key={c.id}
                    href={`/admin/customers/${c.id}`}
                    onClick={onClose}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-[#222222] transition-colors"
                  >
                    <div>
                      <p className="text-xs font-semibold text-white">{c.name}</p>
                      <p className="text-[10px] text-[#9ca3af]">{c.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-mono font-bold text-emerald-400">Spent: {formatPHP(c.totalSpent)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
