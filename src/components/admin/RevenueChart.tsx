"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatPHP } from "@/lib/utils";

interface RevenueChartProps {
  data: Array<{
    date: string;
    revenue: number;
    ordersCount: number;
    aov: number;
  }>;
  selectedRange: string;
  onRangeChange: (range: string) => void;
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
}

export function RevenueChart({
  data,
  selectedRange,
  onRangeChange,
  totalRevenue,
  totalOrders,
  averageOrderValue,
}: RevenueChartProps) {
  const ranges = [
    { label: "7 Days", value: "7d" },
    { label: "30 Days", value: "30d" },
    { label: "90 Days", value: "90d" },
    { label: "1 Year", value: "1y" },
  ];

  return (
    <div className="p-6 rounded-xl bg-[#141414] border border-[#262626] space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-serif font-bold text-white tracking-wide">
            Revenue Analytics
          </h3>
          <p className="text-xs text-[#9ca3af] mt-0.5">
            Interactive daily sales performance calculated from Neon PostgreSQL database records.
          </p>
        </div>

        {/* Date Range Buttons */}
        <div className="flex items-center space-x-1 p-1 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a]">
          {ranges.map((r) => (
            <button
              key={r.value}
              onClick={() => onRangeChange(r.value)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                selectedRange === r.value
                  ? "bg-[#f472b6] text-black font-bold shadow-sm"
                  : "text-[#9ca3af] hover:text-white"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary KPI Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-[#222222]">
        <div>
          <span className="text-[10px] uppercase font-bold text-[#6b7280]">Total Period Revenue</span>
          <p className="text-xl font-bold font-mono text-[#f472b6]">{formatPHP(totalRevenue)}</p>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-[#6b7280]">Completed Orders</span>
          <p className="text-xl font-bold font-mono text-white">{totalOrders}</p>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-[#6b7280]">Average Order Value (AOV)</span>
          <p className="text-xl font-bold font-mono text-emerald-400">{formatPHP(averageOrderValue)}</p>
        </div>
      </div>

      {/* Recharts Area Chart */}
      <div className="h-72 w-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f472b6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#f472b6" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#222222" />
            <XAxis
              dataKey="date"
              stroke="#6b7280"
              fontSize={10}
              tickFormatter={(val) => val.split("-").slice(1).join("/")}
            />
            <YAxis
              stroke="#6b7280"
              fontSize={10}
              tickFormatter={(val) => `₱${(val / 1000).toFixed(0)}k`}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const dataPoint = payload[0].payload;
                  return (
                    <div className="bg-[#1a1a1a] border border-[#333333] p-3 rounded-lg shadow-xl text-xs space-y-1">
                      <p className="text-[#9ca3af] font-mono">{label}</p>
                      <p className="text-[#f472b6] font-bold">Revenue: {formatPHP(dataPoint.revenue)}</p>
                      <p className="text-white">Orders: {dataPoint.ordersCount}</p>
                      <p className="text-emerald-400 font-mono">AOV: {formatPHP(dataPoint.aov)}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#f472b6"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorRevenue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
