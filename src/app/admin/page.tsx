"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  ArrowRight,
  AlertTriangle,
  RefreshCw,
  TrendingUp,
  Download,
} from "lucide-react";
import { KpiCard } from "@/components/admin/KpiCard";
import { RevenueChart } from "@/components/admin/RevenueChart";
import { ConversionFunnel } from "@/components/admin/ConversionFunnel";
import { formatPHP, downloadCSV } from "@/lib/utils";

export default function OverviewDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rangePreset, setRangePreset] = useState("30d");
  const [data, setData] = useState<any>(null);

  const fetchStats = async (range: string = rangePreset) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/stats?range=${range}`);
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
    fetchStats(rangePreset);
  }, [rangePreset]);

  const handleExportCSV = async () => {
    try {
      const res = await fetch("/api/admin/export?type=orders");
      const text = await res.text();
      downloadCSV(text, `ME_Orders_Export_${Date.now()}.csv`);
    } catch (err) {
      console.error("Export error:", err);
    }
  };

  if (loading && !data) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-[#1a1a1a] rounded w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-[#141414] border border-[#222222] rounded-xl" />
          ))}
        </div>
        <div className="h-80 bg-[#141414] border border-[#222222] rounded-xl" />
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
          onClick={() => fetchStats(rangePreset)}
          className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-xs font-bold inline-flex items-center space-x-2"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry Connection</span>
        </button>
      </div>
    );
  }

  const overview = data?.overview;

  return (
    <div className="space-y-8">
      {/* Top Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-white tracking-wide">
            Dashboard Overview
          </h1>
          <p className="text-xs text-[#9ca3af] mt-1">
            Real-time business performance for <strong className="text-white">ME — Mica Ella</strong> calculated strictly from Neon PostgreSQL database records.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => fetchStats(rangePreset)}
            className="p-2 bg-[#181818] border border-[#2a2a2a] hover:border-[#333333] text-[#9ca3af] hover:text-white rounded-lg text-xs transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-[#f472b6]" : ""}`} />
          </button>
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-[#f472b6] hover:bg-[#db2777] text-black font-bold text-xs rounded-lg transition-colors flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export Orders CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="This Month Revenue"
          value={formatPHP(overview?.revenue?.month || 0)}
          subValue={`Today: ${formatPHP(overview?.revenue?.today || 0)}`}
          growth={overview?.revenue?.growthPercentage}
          icon={DollarSign}
        />
        <KpiCard
          title="Active Orders"
          value={overview?.orders?.total || 0}
          subValue={`${overview?.orders?.pending || 0} pending • ${overview?.orders?.shipped || 0} shipped`}
          icon={ShoppingBag}
        />
        <KpiCard
          title="Total Customers"
          value={overview?.customers?.total || 0}
          subValue={`+${overview?.customers?.newThisMonth || 0} new this month`}
          icon={Users}
        />
        <KpiCard
          title="Available Inventory"
          value={overview?.products?.available || 0}
          subValue={`${overview?.products?.lowStock || 0} 1-of-1 low stock`}
          icon={Package}
        />
      </div>

      {/* Revenue Chart Section */}
      <RevenueChart
        data={data?.timeline?.chartData || []}
        selectedRange={rangePreset}
        onRangeChange={setRangePreset}
        totalRevenue={data?.timeline?.totalRevenue || 0}
        totalOrders={data?.timeline?.totalOrders || 0}
        averageOrderValue={data?.timeline?.averageOrderValue || 0}
      />

      {/* Conversion Funnel & Inventory Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ConversionFunnel data={overview?.conversion} />
        </div>

        {/* Low Stock Alerts & Quick Navigation Widget */}
        <div className="p-6 rounded-xl bg-[#141414] border border-[#262626] flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-serif font-bold text-white flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-[#f472b6]" />
                <span>1-of-1 Inventory Alerts</span>
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#f472b6]/20 text-[#f472b6] font-bold">
                {overview?.products?.lowStock || 0} Low Stock
              </span>
            </div>

            <p className="text-xs text-[#9ca3af]">
              Second-hand items have single-unit stock (<code className="text-white">stock = 1</code>). Once sold, items automatically transition to <strong className="text-white">SOLD</strong> status.
            </p>

            <div className="p-3.5 rounded-lg bg-[#181818] border border-[#262626] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#9ca3af]">Total Products:</span>
                <span className="font-mono text-white font-bold">{overview?.products?.total}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#9ca3af]">Available for Purchase:</span>
                <span className="font-mono text-emerald-400 font-bold">{overview?.products?.available}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#9ca3af]">Items Sold:</span>
                <span className="font-mono text-[#f472b6] font-bold">{overview?.products?.sold}</span>
              </div>
            </div>
          </div>

          <Link
            href="/admin/inventory"
            className="w-full py-2.5 px-4 bg-[#1a1a1a] hover:bg-[#222222] border border-[#2a2a2a] text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-between group"
          >
            <span>Manage Inventory Stock</span>
            <ArrowRight className="w-4 h-4 text-[#f472b6] group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
