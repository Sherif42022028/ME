import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { Lock, CheckCircle2 } from "lucide-react";

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-[#0B0B0B] text-[#171717] dark:text-[#faf9f6] flex flex-col font-sans selection:bg-[#E99AB4] dark:selection:bg-[#F3A6BE] selection:text-black transition-colors duration-200">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 md:px-8 py-12 space-y-8">
        <div>
          <h1 className="font-serif text-4xl font-bold text-[#171717] dark:text-white tracking-wide flex items-center space-x-3">
            <Lock className="w-6 h-6 text-[#C9A45C] dark:text-[#F3A6BE]" />
            <span>Secure Checkout</span>
          </h1>
          <p className="text-xs text-[#66615D] dark:text-[#9ca3af] mt-1">
            Complete your order details. Pay via GCash, Maya, or Credit Card.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Shipping Form */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#141414] border border-[#E8E3DD] dark:border-[#262626] space-y-4 shadow-xs">
            <h3 className="text-sm font-bold text-[#171717] dark:text-white uppercase tracking-wider">Shipping Destination</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-[#66615D] dark:text-[#9ca3af] uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Camille Co"
                  className="w-full bg-[#FAF8F5] dark:bg-[#1a1a1a] border border-[#E8E3DD] dark:border-[#2a2a2a] rounded-lg p-2.5 text-xs text-[#171717] dark:text-white placeholder-[#888888]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-[#66615D] dark:text-[#9ca3af] uppercase mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="camille@gmail.com"
                  className="w-full bg-[#FAF8F5] dark:bg-[#1a1a1a] border border-[#E8E3DD] dark:border-[#2a2a2a] rounded-lg p-2.5 text-xs text-[#171717] dark:text-white placeholder-[#888888]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-[#66615D] dark:text-[#9ca3af] uppercase mb-1">Phone Number (For Courier)</label>
                <input
                  type="text"
                  placeholder="+63 917 123 4567"
                  className="w-full bg-[#FAF8F5] dark:bg-[#1a1a1a] border border-[#E8E3DD] dark:border-[#2a2a2a] rounded-lg p-2.5 text-xs text-[#171717] dark:text-white placeholder-[#888888]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-[#66615D] dark:text-[#9ca3af] uppercase mb-1">Street Address</label>
                <input
                  type="text"
                  placeholder="123 Forbes Park"
                  className="w-full bg-[#FAF8F5] dark:bg-[#1a1a1a] border border-[#E8E3DD] dark:border-[#2a2a2a] rounded-lg p-2.5 text-xs text-[#171717] dark:text-white placeholder-[#888888]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-[#66615D] dark:text-[#9ca3af] uppercase mb-1">City</label>
                  <input
                    type="text"
                    placeholder="Makati City"
                    className="w-full bg-[#FAF8F5] dark:bg-[#1a1a1a] border border-[#E8E3DD] dark:border-[#2a2a2a] rounded-lg p-2.5 text-xs text-[#171717] dark:text-white placeholder-[#888888]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#66615D] dark:text-[#9ca3af] uppercase mb-1">Province / Region</label>
                  <input
                    type="text"
                    placeholder="Metro Manila"
                    className="w-full bg-[#FAF8F5] dark:bg-[#1a1a1a] border border-[#E8E3DD] dark:border-[#2a2a2a] rounded-lg p-2.5 text-xs text-[#171717] dark:text-white placeholder-[#888888]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Payment & Order Summary */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#141414] border border-[#E8E3DD] dark:border-[#262626] space-y-6 flex flex-col justify-between shadow-xs">
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-[#171717] dark:text-white uppercase tracking-wider">Payment Method</h3>
              <div className="p-3.5 rounded-xl bg-[#FAF8F5] dark:bg-[#1a1a1a] border border-[#E8E3DD] dark:border-[#2a2a2a] flex items-center justify-between text-xs">
                <span className="font-semibold text-[#171717] dark:text-white">GCash / Maya / PayMongo</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>

              <div className="pt-4 border-t border-[#E8E3DD] dark:border-[#222222] space-y-2 text-xs">
                <div className="flex justify-between text-[#66615D] dark:text-[#9ca3af]">
                  <span>Item Subtotal</span>
                  <span className="font-mono text-[#171717] dark:text-white">₱28,500</span>
                </div>
                <div className="flex justify-between text-[#66615D] dark:text-[#9ca3af]">
                  <span>Shipping Fee</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400">₱0 (Free)</span>
                </div>
                <div className="flex justify-between text-base font-bold text-[#171717] dark:text-white pt-2 border-t border-[#E8E3DD] dark:border-[#222222]">
                  <span>Total Due</span>
                  <span className="font-mono text-[#C9A45C] dark:text-[#F3A6BE]">₱28,500</span>
                </div>
              </div>
            </div>

            <button
              className="w-full py-4 bg-[#171717] hover:bg-[#E99AB4] text-white hover:text-black dark:bg-[#F3A6BE] dark:hover:bg-[#db2777] dark:text-black font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md"
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
