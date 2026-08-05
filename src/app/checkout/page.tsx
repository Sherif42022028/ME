import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { formatPHP } from "@/lib/utils";
import { ShieldCheck, Lock, CheckCircle2 } from "lucide-react";

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-[#0d0d0d] text-[#faf9f6] flex flex-col font-sans selection:bg-[#f472b6] selection:text-black">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 md:px-8 py-12 space-y-8">
        <div>
          <h1 className="font-serif text-4xl font-bold text-white tracking-wide flex items-center space-x-3">
            <Lock className="w-6 h-6 text-[#f472b6]" />
            <span>Secure Checkout</span>
          </h1>
          <p className="text-xs text-[#9ca3af] mt-1">
            Complete your order details. Pay via GCash, Maya, or Credit Card.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Shipping Form */}
          <div className="p-6 rounded-2xl bg-[#141414] border border-[#262626] space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Shipping Destination</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-[#9ca3af] uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Camille Co"
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-2.5 text-xs text-white placeholder-[#555555]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-[#9ca3af] uppercase mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="camille@gmail.com"
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-2.5 text-xs text-white placeholder-[#555555]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-[#9ca3af] uppercase mb-1">Phone Number (For Courier)</label>
                <input
                  type="text"
                  placeholder="+63 917 123 4567"
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-2.5 text-xs text-white placeholder-[#555555]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-[#9ca3af] uppercase mb-1">Street Address</label>
                <input
                  type="text"
                  placeholder="123 Forbes Park"
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-2.5 text-xs text-white placeholder-[#555555]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-[#9ca3af] uppercase mb-1">City</label>
                  <input
                    type="text"
                    placeholder="Makati City"
                    className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-2.5 text-xs text-white placeholder-[#555555]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#9ca3af] uppercase mb-1">Province / Region</label>
                  <input
                    type="text"
                    placeholder="Metro Manila"
                    className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-2.5 text-xs text-white placeholder-[#555555]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Payment & Order Summary */}
          <div className="p-6 rounded-2xl bg-[#141414] border border-[#262626] space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Payment Method</h3>
              <div className="p-3.5 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-between text-xs">
                <span className="font-semibold text-white">GCash / Maya / PayMongo</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>

              <div className="pt-4 border-t border-[#222222] space-y-2 text-xs">
                <div className="flex justify-between text-[#9ca3af]">
                  <span>Item Subtotal</span>
                  <span className="font-mono text-white">₱28,500</span>
                </div>
                <div className="flex justify-between text-[#9ca3af]">
                  <span>Shipping Fee</span>
                  <span className="font-mono text-emerald-400">₱0 (Free)</span>
                </div>
                <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-[#222222]">
                  <span>Total Due</span>
                  <span className="font-mono text-[#f472b6]">₱28,500</span>
                </div>
              </div>
            </div>

            <button
              className="w-full py-4 bg-[#f472b6] hover:bg-[#db2777] text-black font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-xl"
            >
              Complete Order & Pay
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
