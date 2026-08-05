import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  title: string;
  value: string | number;
  subValue?: string;
  growth?: number;
  growthLabel?: string;
  icon?: React.ElementType;
  className?: string;
}

export function KpiCard({
  title,
  value,
  subValue,
  growth,
  growthLabel = "vs previous period",
  icon: Icon,
  className,
}: KpiCardProps) {
  const isPositive = growth !== undefined && growth > 0;
  const isNegative = growth !== undefined && growth < 0;

  return (
    <div className={cn("p-5 rounded-xl bg-[#141414] border border-[#262626] hover:border-[#333333] transition-all", className)}>
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#9ca3af]">
          {title}
        </span>
        {Icon && <Icon className="w-4 h-4 text-[#f472b6]" />}
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <h3 className="text-2xl font-bold font-sans text-white tracking-tight">
          {value}
        </h3>
        {subValue && <span className="text-xs text-[#9ca3af] font-mono">{subValue}</span>}
      </div>

      {growth !== undefined && (
        <div className="mt-3 flex items-center space-x-1.5 text-xs">
          {isPositive ? (
            <span className="flex items-center font-semibold text-emerald-400">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
              +{growth}%
            </span>
          ) : isNegative ? (
            <span className="flex items-center font-semibold text-rose-400">
              <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
              {growth}%
            </span>
          ) : (
            <span className="flex items-center text-[#9ca3af]">
              <Minus className="w-3.5 h-3.5 mr-0.5" />
              0%
            </span>
          )}
          <span className="text-[10px] text-[#6b7280]">{growthLabel}</span>
        </div>
      )}
    </div>
  );
}
