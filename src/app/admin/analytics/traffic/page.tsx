"use client";

import { useEffect, useState } from "react";
import { BarChart3, Globe, Share2, Loader2 } from "lucide-react";

export default function TrafficAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [sources, setSources] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/stats");
        const json = await res.json();
        if (json.success) {
          setSources(json.trafficSources || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="p-12 text-center text-[#9ca3af] flex flex-col items-center space-y-3">
        <Loader2 className="w-6 h-6 text-[#f472b6] animate-spin" />
        <span className="text-xs">Loading website traffic event logs...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-white tracking-wide">
          Website Traffic & Social Sources
        </h1>
        <p className="text-xs text-[#9ca3af] mt-1">
          First-party analytics event tracking across Instagram, Facebook, Direct, and WhatsApp clicks.
        </p>
      </div>

      <div className="p-6 rounded-xl bg-[#141414] border border-[#262626] space-y-4">
        <h3 className="text-base font-serif font-bold text-white flex items-center space-x-2">
          <Globe className="w-4 h-4 text-[#f472b6]" />
          <span>Traffic Channels Breakdown</span>
        </h3>

        <div className="space-y-4">
          {sources.map((src, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-white">{src.name}</span>
                <span className="font-mono text-[#f472b6]">{src.count} events ({src.percentage}%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#1a1a1a] overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#f472b6] to-[#db2777] rounded-full"
                  style={{ width: `${src.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
