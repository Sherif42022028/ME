"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  DollarSign,
  ShoppingBag,
  TrendingUp,
  Package,
  RefreshCw,
  AlertTriangle,
  ArrowRight,
  PieChart,
  Activity,
} from "lucide-react";
import { KpiCard } from "@/components/admin/KpiCard";
import { formatPHP } from "@/lib/utils";

export default function OverviewDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/stats");
      const json = await res.json();
      if (json.success) {
        setData(json);
      } else {
        setError(json.message || "Failed to load dashboard metrics");
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError("Network error fetching stats from Neon database");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading && !data) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-[#1a1a1a] rounded w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-[#141414] border border-[#222222] rounded-xl" />
          ))}
        </div>
        <div className="h-48 bg-[#141414] border border-[#222222] rounded-xl" />
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="p-8 rounded-xl bg-rose-500/10 border border-rose-500/20 text-center space-y-4">
        <AlertTriangle className="w-10 h-10 text-rose-400 mx-auto" />
        <h3 className="text-lg font-bold text-white">Database Error</h3>
        <p className="text-xs text-rose-300 max-w-md mx-auto">{error}</p>
        <button
          onClick={fetchStats}
          className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-xs font-bold inline-flex items-center space-x-2"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry Connection</span>
        </button>
      </div>
    );
  }

  const overview = data?.overview;
  const financial = overview?.financial;
  const orders = overview?.orders;
  const checkout = overview?.checkout;
  const products = overview?.products;

  return (
    <div className="space-y-8">
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-white tracking-wide">
            ME ADMIN
          </h1>
          <p className="text-xs text-[#9ca3af] mt-1">
            Real business financials & order status calculated from Neon PostgreSQL.
          </p>
        </div>

        <button
          onClick={fetchStats}
          className="px-3.5 py-2 bg-[#181818] border border-[#2a2a2a] hover:border-[#333333] text-[#9ca3af] hover:text-white rounded-lg text-xs transition-colors flex items-center space-x-2 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[#f472b6]" : ""}`} />
          <span>Refresh Metrics</span>
        </button>
      </div>

      {/* Main KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Revenue"
          value={formatPHP(financial?.revenue || 0)}
          subValue="Confirmed Sales Only"
          icon={DollarSign}
        />
        <KpiCard
          title="Sales"
          value={orders?.confirmedSales || 0}
          subValue={`${orders?.pendingConfirmation || 0} pending confirmation`}
          icon={ShoppingBag}
        />
        <KpiCard
          title="Net Profit"
          value={formatPHP(financial?.netProfit || 0)}
          subValue={`Margin: ${financial?.profitMargin || 0}%`}
          icon={TrendingUp}
        />
        <KpiCard
          title="Products"
          value={products?.total || 0}
          subValue="Catalog Active"
          icon={Package}
        />
      </div>

      {/* Financial Model & Conversion Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Financial Breakdown */}
        <div className="p-6 rounded-xl bg-[#141414] border border-[#262626] space-y-4">
          <div className="flex items-center justify-between border-b border-[#222222] pb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <PieChart className="w-4 h-4 text-[#f472b6]" />
              <span>Financial Profit Model</span>
            </h3>
            <span className="text-[10px] font-mono uppercase text-[#9ca3af]">Neon DB</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1.5 border-b border-[#1f1f1f]">
              <span className="text-[#9ca3af]">Confirmed Revenue</span>
              <span className="font-mono text-white font-bold">{formatPHP(financial?.revenue || 0)}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[#1f1f1f]">
              <span className="text-[#9ca3af]">Cost of Goods Sold (COGS)</span>
              <span className="font-mono text-rose-400 font-semibold">− {formatPHP(financial?.cogs || 0)}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[#1f1f1f]">
              <span className="text-[#9ca3af]">Gross Profit</span>
              <span className="font-mono text-emerald-400 font-bold">{formatPHP(financial?.grossProfit || 0)}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[#1f1f1f]">
              <span className="text-[#9ca3af]">Operating Expenses</span>
              <span className="font-mono text-rose-400 font-semibold">− {formatPHP(financial?.operatingExpenses || 0)}</span>
            </div>
            <div className="flex justify-between py-2 border-t border-[#2a2a2a] text-sm font-bold">
              <span className="text-white">Net Business Profit</span>
              <span className="font-mono text-[#f472b6]">{formatPHP(financial?.netProfit || 0)}</span>
            </div>
          </div>
        </div>

        {/* WhatsApp Checkout Conversion Funnel */}
        <div className="p-6 rounded-xl bg-[#141414] border border-[#262626] space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#222222] pb-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                <Activity className="w-4 h-4 text-[#25D366]" />
                <span>WhatsApp Checkout Funnel</span>
              </h3>
              <span className="text-[10px] font-mono uppercase bg-[#25D366]/10 text-[#25D366] px-2 py-0.5 rounded font-bold">
                WhatsApp Flow
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-lg bg-[#181818] border border-[#262626]">
                <span className="text-[10px] uppercase font-mono text-[#9ca3af] block">Checkout Initiated</span>
                <span className="font-mono text-xl font-bold text-white mt-1 block">{checkout?.initiated || 0}</span>
              </div>
              <div className="p-3.5 rounded-lg bg-[#181818] border border-[#262626]">
                <span className="text-[10px] uppercase font-mono text-[#9ca3af] block">Confirmed Sales</span>
                <span className="font-mono text-xl font-bold text-[#25D366] mt-1 block">{checkout?.confirmedSales || 0}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-[#181818] border border-[#262626] flex items-center justify-between text-xs">
              <span className="text-[#9ca3af]">Confirmation Rate:</span>
              <span className="font-mono font-bold text-white">{checkout?.confirmationRate || 0}%</span>
            </div>
          </div>

          <Link
            href="/admin/orders"
            className="w-full py-2.5 px-4 bg-[#1a1a1a] hover:bg-[#222222] border border-[#2a2a2a] text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-between group mt-4"
          >
            <span>Manage Orders & Confirm Sales</span>
            <ArrowRight className="w-4 h-4 text-[#f472b6] group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Sales Overview Section */}
      <div className="p-6 rounded-xl bg-[#141414] border border-[#262626] space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-[#222222] pb-3">
          Sales Overview
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          <div className="p-3.5 rounded-lg bg-[#181818] border border-[#262626]">
            <span className="text-[10px] font-mono text-[#9ca3af] block">Pending</span>
            <span className="font-mono text-lg font-bold text-amber-400 mt-1 block">{orders?.pendingConfirmation || 0}</span>
          </div>
          <div className="p-3.5 rounded-lg bg-[#181818] border border-[#262626]">
            <span className="text-[10px] font-mono text-[#9ca3af] block">Confirmed</span>
            <span className="font-mono text-lg font-bold text-emerald-400 mt-1 block">{orders?.confirmed || 0}</span>
          </div>
          <div className="p-3.5 rounded-lg bg-[#181818] border border-[#262626]">
            <span className="text-[10px] font-mono text-[#9ca3af] block">Processing</span>
            <span className="font-mono text-lg font-bold text-blue-400 mt-1 block">{orders?.processing || 0}</span>
          </div>
          <div className="p-3.5 rounded-lg bg-[#181818] border border-[#262626]">
            <span className="text-[10px] font-mono text-[#9ca3af] block">Shipped</span>
            <span className="font-mono text-lg font-bold text-purple-400 mt-1 block">{orders?.shipped || 0}</span>
          </div>
          <div className="p-3.5 rounded-lg bg-[#181818] border border-[#262626]">
            <span className="text-[10px] font-mono text-[#9ca3af] block">Delivered</span>
            <span className="font-mono text-lg font-bold text-[#f472b6] mt-1 block">{orders?.delivered || 0}</span>
          </div>
          <div className="p-3.5 rounded-lg bg-[#181818] border border-[#262626]">
            <span className="text-[10px] font-mono text-[#9ca3af] block">Cancelled</span>
            <span className="font-mono text-lg font-bold text-[#6b7280] mt-1 block">{orders?.cancelled || 0}</span>
          </div>
        </div>
      </div>

      {/* Recent Orders Overview */}
      <div className="p-6 rounded-xl bg-[#141414] border border-[#262626] space-y-4">
        <div className="flex items-center justify-between border-b border-[#222222] pb-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Recent Orders
          </h3>
          <Link href="/admin/orders" className="text-xs text-[#f472b6] hover:underline font-semibold">
            View All Orders →
          </Link>
        </div>

        <div className="text-center py-10 text-xs text-[#6b7280]">
          No orders yet.
        </div>
      </div>
    </div>
  );
}
