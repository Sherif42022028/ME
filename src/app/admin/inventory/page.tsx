"use client";

import { useState, useEffect } from "react";
import { Layers, RefreshCw, Loader2, History } from "lucide-react";
import { formatDateTime } from "@/lib/utils";

export default function InventoryPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/inventory");
      const data = await res.json();
      if (data.success) {
        setLogs(data.logs);
      }
    } catch (e) {
      console.error("Logs fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-white tracking-wide">
            Inventory & Stock Audit Log
          </h1>
          <p className="text-xs text-[#9ca3af] mt-1">
            Complete audit trail of stock adjustments, 1-of-1 sales decrements, and inventory changes.
          </p>
        </div>

        <button
          onClick={fetchLogs}
          className="p-2 bg-[#181818] border border-[#2a2a2a] hover:border-[#333333] text-[#9ca3af] hover:text-white rounded-lg text-xs transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-[#f472b6]" : ""}`} />
        </button>
      </div>

      <div className="bg-[#141414] border border-[#262626] rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-[#9ca3af] flex flex-col items-center space-y-3">
            <Loader2 className="w-6 h-6 text-[#f472b6] animate-spin" />
            <span className="text-xs">Fetching inventory logs from Neon DB...</span>
          </div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center text-[#9ca3af] space-y-3">
            <History className="w-10 h-10 text-[#333333] mx-auto" />
            <p className="text-sm font-semibold text-white">No inventory log entries</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#1a1a1a] border-b border-[#262626] text-[#9ca3af] uppercase font-mono text-[10px]">
                <tr>
                  <th className="p-4">Product Name</th>
                  <th className="p-4">SKU</th>
                  <th className="p-4">Action</th>
                  <th className="p-4">Previous Stock</th>
                  <th className="p-4">New Stock</th>
                  <th className="p-4">Reason / Admin</th>
                  <th className="p-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222222]">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#181818] transition-colors">
                    <td className="p-4 font-semibold text-white">
                      {log.product?.name}
                    </td>
                    <td className="p-4 font-mono text-[#f472b6] font-bold">
                      {log.product?.sku}
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded text-[9px] uppercase font-mono bg-[#f472b6]/20 text-[#f472b6]">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-gray-400">{log.previousStock}</td>
                    <td className="p-4 font-mono text-emerald-400 font-bold">{log.newStock}</td>
                    <td className="p-4 text-[#9ca3af]">
                      <p>{log.reason}</p>
                      <p className="text-[10px] text-[#6b7280]">{log.admin?.name || "System"}</p>
                    </td>
                    <td className="p-4 font-mono text-xs text-[#9ca3af]">
                      {formatDateTime(log.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
