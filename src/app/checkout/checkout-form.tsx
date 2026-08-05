"use client";

import { useState } from "react";
import { MessageCircle, Loader2, Lock, ShoppingBag, ShieldCheck } from "lucide-react";

interface CheckoutFormProps {
  initialProduct?: {
    id: string;
    name: string;
    price: number;
    image: string;
  };
}

export function CheckoutForm({ initialProduct }: CheckoutFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Makati City");
  const [province, setProvince] = useState("Metro Manila");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const product = initialProduct || {
    id: "default-product",
    name: "Vintage Chanel Tweed Structured Blazer",
    price: 40,
    image: "/product/p1.jpg",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !email || !address || !city || !province) {
      setError("Please complete all required fields.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          email,
          address,
          city,
          province,
          notes,
          productId: product.id,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Failed to create order. Please try again.");
        setLoading(false);
        return;
      }

      // Order created in Neon DB with status PENDING_CONFIRMATION -> Redirect to WhatsApp!
      if (data.whatsappUrl) {
        window.location.href = data.whatsappUrl;
      } else {
        setError("WhatsApp URL generation failed.");
        setLoading(false);
      }
    } catch (err: any) {
      console.error("Checkout submission error:", err);
      setError("Connection error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Customer Information */}
      <div className="p-6 md:p-8 rounded-2xl bg-white dark:bg-[#141414] border border-[#E8E3DD] dark:border-[#262626] space-y-4 shadow-xs">
        <div className="flex items-center space-x-2 border-b border-[#E8E3DD] dark:border-[#222222] pb-3">
          <Lock className="w-4 h-4 text-[#C9A45C] dark:text-[#F3A6BE]" />
          <h3 className="text-sm font-bold text-[#171717] dark:text-white uppercase tracking-wider">
            Customer Information
          </h3>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs">
            {error}
          </div>
        )}

        <div className="space-y-3.5">
          <div>
            <label className="block text-[10px] font-bold text-[#66615D] dark:text-[#9ca3af] uppercase mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Camille Co"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#FAF8F5] dark:bg-[#1a1a1a] border border-[#E8E3DD] dark:border-[#2a2a2a] rounded-xl p-3 text-xs text-[#171717] dark:text-white placeholder-[#888888] focus:outline-none focus:border-[#E99AB4] dark:focus:border-[#F3A6BE]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-[#66615D] dark:text-[#9ca3af] uppercase mb-1">
                Phone Number *
              </label>
              <input
                type="text"
                required
                placeholder="+63 917 123 4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-[#FAF8F5] dark:bg-[#1a1a1a] border border-[#E8E3DD] dark:border-[#2a2a2a] rounded-xl p-3 text-xs text-[#171717] dark:text-white placeholder-[#888888] focus:outline-none focus:border-[#E99AB4] dark:focus:border-[#F3A6BE]"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-[#66615D] dark:text-[#9ca3af] uppercase mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                placeholder="camille@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#FAF8F5] dark:bg-[#1a1a1a] border border-[#E8E3DD] dark:border-[#2a2a2a] rounded-xl p-3 text-xs text-[#171717] dark:text-white placeholder-[#888888] focus:outline-none focus:border-[#E99AB4] dark:focus:border-[#F3A6BE]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-[#66615D] dark:text-[#9ca3af] uppercase mb-1">
              Street Address *
            </label>
            <input
              type="text"
              required
              placeholder="123 Forbes Park, Dasmariñas Village"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-[#FAF8F5] dark:bg-[#1a1a1a] border border-[#E8E3DD] dark:border-[#2a2a2a] rounded-xl p-3 text-xs text-[#171717] dark:text-white placeholder-[#888888] focus:outline-none focus:border-[#E99AB4] dark:focus:border-[#F3A6BE]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-[#66615D] dark:text-[#9ca3af] uppercase mb-1">
                City *
              </label>
              <input
                type="text"
                required
                placeholder="Makati City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-[#FAF8F5] dark:bg-[#1a1a1a] border border-[#E8E3DD] dark:border-[#2a2a2a] rounded-xl p-3 text-xs text-[#171717] dark:text-white placeholder-[#888888] focus:outline-none focus:border-[#E99AB4] dark:focus:border-[#F3A6BE]"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-[#66615D] dark:text-[#9ca3af] uppercase mb-1">
                Province / Region *
              </label>
              <input
                type="text"
                required
                placeholder="Metro Manila"
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className="w-full bg-[#FAF8F5] dark:bg-[#1a1a1a] border border-[#E8E3DD] dark:border-[#2a2a2a] rounded-xl p-3 text-xs text-[#171717] dark:text-white placeholder-[#888888] focus:outline-none focus:border-[#E99AB4] dark:focus:border-[#F3A6BE]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-[#66615D] dark:text-[#9ca3af] uppercase mb-1">
              Special Delivery Notes (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Leave with lobby concierge if unavailable"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-[#FAF8F5] dark:bg-[#1a1a1a] border border-[#E8E3DD] dark:border-[#2a2a2a] rounded-xl p-3 text-xs text-[#171717] dark:text-white placeholder-[#888888] focus:outline-none focus:border-[#E99AB4] dark:focus:border-[#F3A6BE]"
            />
          </div>
        </div>
      </div>

      {/* Order Summary & WhatsApp Action */}
      <div className="p-6 md:p-8 rounded-2xl bg-white dark:bg-[#141414] border border-[#E8E3DD] dark:border-[#262626] space-y-6 flex flex-col justify-between shadow-xs">
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#E8E3DD] dark:border-[#222222] pb-3">
            <h3 className="text-sm font-bold text-[#171717] dark:text-white uppercase tracking-wider flex items-center space-x-2">
              <ShoppingBag className="w-4 h-4 text-[#C9A45C] dark:text-[#F3A6BE]" />
              <span>Order Summary</span>
            </h3>
            <span className="text-[10px] font-mono uppercase bg-[#25D366]/10 text-[#25D366] px-2 py-0.5 rounded-full font-bold">
              WhatsApp Confirmation
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#FAF8F5] dark:bg-[#1a1a1a] border border-[#E8E3DD] dark:border-[#2a2a2a] flex items-center space-x-3">
            <img
              src={product.image}
              alt={product.name}
              className="w-12 h-14 object-cover rounded-lg border border-[#E8E3DD] dark:border-[#333]"
            />
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-semibold text-[#171717] dark:text-white truncate">
                {product.name}
              </h4>
              <p className="text-[11px] text-[#66615D] dark:text-[#9ca3af] font-mono mt-0.5">
                Qty: 1 × ₱{product.price}
              </p>
            </div>
            <span className="text-xs font-bold font-mono text-[#171717] dark:text-white">
              ₱{product.price}
            </span>
          </div>

          <div className="pt-4 border-t border-[#E8E3DD] dark:border-[#222222] space-y-2 text-xs">
            <div className="flex justify-between text-[#66615D] dark:text-[#9ca3af]">
              <span>Product Subtotal</span>
              <span className="font-mono text-[#171717] dark:text-white">₱{product.price}</span>
            </div>
            <div className="flex justify-between text-[#66615D] dark:text-[#9ca3af]">
              <span>Courier Delivery</span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400">Complimentary</span>
            </div>
            <div className="flex justify-between text-base font-bold text-[#171717] dark:text-white pt-2 border-t border-[#E8E3DD] dark:border-[#222222]">
              <span>Total Order</span>
              <span className="font-mono text-[#C9A45C] dark:text-[#F3A6BE]">₱{product.price}</span>
            </div>
          </div>
        </div>

        <div className="space-y-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#25D366] hover:bg-[#20ba5a] text-black font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-black" />
                <span>Generating Order...</span>
              </>
            ) : (
              <>
                <MessageCircle className="w-4.5 h-4.5 fill-black text-black" />
                <span>CHECK ORDER ON WHATSAPP</span>
              </>
            )}
          </button>

          <div className="flex items-center justify-center space-x-1.5 text-[10px] text-[#777777] font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Direct Order Request — No credit card required.</span>
          </div>
        </div>
      </div>
    </form>
  );
}
