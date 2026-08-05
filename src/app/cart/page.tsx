import Link from "next/link";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { formatPHP } from "@/lib/utils";
import { ShoppingBag, ArrowRight, Trash2 } from "lucide-react";

export default function CartPage() {
  const item = {
    name: "Vintage Chanel Tweed Structured Blazer",
    sku: "ME-BLZ-001",
    price: 28500,
    size: "S / EU 36",
    color: "Black & Gold",
    image: "/product/p1.jpg",
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-[#faf9f6] flex flex-col font-sans selection:bg-[#f472b6] selection:text-black">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 md:px-8 py-12 space-y-8">
        <div>
          <h1 className="font-serif text-4xl font-bold text-white tracking-wide">
            Shopping Bag
          </h1>
          <p className="text-xs text-[#9ca3af] mt-1">
            Review your 1-of-1 pre-loved items before proceeding to checkout.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#141414] border border-[#262626] space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#222222]">
            <div className="flex items-center space-x-4">
              <img src={item.image} alt={item.name} className="w-16 h-20 object-cover rounded-lg bg-[#181818]" />
              <div>
                <h3 className="text-sm font-semibold text-white">{item.name}</h3>
                <p className="text-[10px] text-[#9ca3af] font-mono">SKU: {item.sku} • Size: {item.size}</p>
                <p className="text-xs font-bold font-mono text-[#f472b6] mt-1">{formatPHP(item.price)}</p>
              </div>
            </div>
            <button className="text-[#9ca3af] hover:text-rose-400 p-2">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3 text-xs pt-2">
            <div className="flex justify-between text-[#9ca3af]">
              <span>Subtotal</span>
              <span className="font-mono text-white">{formatPHP(item.price)}</span>
            </div>
            <div className="flex justify-between text-[#9ca3af]">
              <span>Estimated Express Shipping (Philippines)</span>
              <span className="font-mono text-emerald-400">COMPLIMENTARY</span>
            </div>
            <div className="flex justify-between text-base font-bold text-white pt-3 border-t border-[#222222]">
              <span>Total</span>
              <span className="font-mono text-[#f472b6]">{formatPHP(item.price)}</span>
            </div>
          </div>

          <Link
            href="/checkout"
            className="w-full py-4 bg-[#f472b6] hover:bg-[#db2777] text-black font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-xl flex items-center justify-center space-x-2"
          >
            <span>Proceed To Secure Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
