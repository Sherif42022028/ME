import { Users, Eye, ShoppingCart, CreditCard, CheckCircle2 } from "lucide-react";

interface FunnelData {
  visitors: number;
  productViews: number;
  addToCart: number;
  checkoutStarted: number;
  completedPurchases: number;
  rate: number;
}

export function ConversionFunnel({ data }: { data: FunnelData }) {
  const steps = [
    {
      label: "Website Visitors",
      count: data.visitors,
      icon: Users,
      color: "from-purple-500/20 to-purple-500/5 text-purple-400 border-purple-500/30",
    },
    {
      label: "Product Views",
      count: data.productViews,
      icon: Eye,
      conversionFromPrev: data.visitors > 0 ? ((data.productViews / data.visitors) * 100).toFixed(1) : "0",
      color: "from-blue-500/20 to-blue-500/5 text-blue-400 border-blue-500/30",
    },
    {
      label: "Add to Cart",
      count: data.addToCart,
      icon: ShoppingCart,
      conversionFromPrev: data.productViews > 0 ? ((data.addToCart / data.productViews) * 100).toFixed(1) : "0",
      color: "from-amber-500/20 to-amber-500/5 text-amber-400 border-amber-500/30",
    },
    {
      label: "Checkout Started",
      count: data.checkoutStarted,
      icon: CreditCard,
      conversionFromPrev: data.addToCart > 0 ? ((data.checkoutStarted / data.addToCart) * 100).toFixed(1) : "0",
      color: "from-pink-500/20 to-pink-500/5 text-[#f472b6] border-[#f472b6]/30",
    },
    {
      label: "Completed Purchases",
      count: data.completedPurchases,
      icon: CheckCircle2,
      conversionFromPrev: data.checkoutStarted > 0 ? ((data.completedPurchases / data.checkoutStarted) * 100).toFixed(1) : "0",
      color: "from-emerald-500/20 to-emerald-500/5 text-emerald-400 border-emerald-500/30",
    },
  ];

  return (
    <div className="p-6 rounded-xl bg-[#141414] border border-[#262626] space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-serif font-bold text-white tracking-wide">
            Conversion Funnel
          </h3>
          <p className="text-xs text-[#9ca3af]">
            Step-by-step visitor conversion tracking calculated from database analytics events.
          </p>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#6b7280]">Overall Conversion</span>
          <p className="text-2xl font-bold font-mono text-emerald-400">{data.rate}%</p>
        </div>
      </div>

      <div className="space-y-3">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const pctWidth = data.visitors > 0 ? Math.max(12, Math.round((step.count / data.visitors) * 100)) : 100;

          return (
            <div key={idx} className="relative">
              <div
                className={`p-3.5 rounded-lg border bg-gradient-to-r ${step.color} transition-all relative overflow-hidden`}
                style={{ width: `${pctWidth}%` }}
              >
                <div className="flex items-center justify-between whitespace-nowrap">
                  <div className="flex items-center space-x-2.5">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="text-xs font-semibold text-white">{step.label}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-xs font-mono font-bold text-white">{step.count.toLocaleString()}</span>
                    {step.conversionFromPrev && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/40 text-[#e5e5e5]">
                        {step.conversionFromPrev}% conv.
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
