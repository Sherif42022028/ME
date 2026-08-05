"use client";

import { useEffect, useState } from "react";
import { ConversionFunnel } from "@/components/admin/ConversionFunnel";
import { Loader2 } from "lucide-react";

export default function ConversionAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/stats");
        const json = await res.json();
        if (json.success) setData(json);
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
        <span className="text-xs">Computing conversion rates...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-white tracking-wide">
          Conversion Analytics
        </h1>
        <p className="text-xs text-[#9ca3af] mt-1">
          Full funnel conversion metrics from website visitors to completed purchases.
        </p>
      </div>

      <ConversionFunnel data={data?.overview?.conversion} />
    </div>
  );
}
