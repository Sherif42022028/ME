import Link from "next/link";
import { formatPHP } from "@/lib/utils";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    brand: string;
    price: number;
    size: string;
    condition: string;
    images: string[];
    status: string;
    stock: number;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const isSold = false; // Products remain visible and purchasable

  const getConditionBadge = (cond: string) => {
    switch (cond) {
      case "NEW":
        return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30";
      case "LIKE_NEW":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30";
      case "EXCELLENT":
        return "bg-[#E99AB4]/15 dark:bg-[#F3A6BE]/20 text-[#E99AB4] dark:text-[#F3A6BE] border-[#E99AB4]/30 dark:border-[#F3A6BE]/30";
      default:
        return "bg-amber-500/10 text-[#C9A45C] dark:text-[#D4AF6A] border-[#C9A45C]/30 dark:border-[#D4AF6A]/30";
    }
  };

  const mainImage = product.images?.[0] || "/product/p1.jpg";

  return (
    <div className="group flex flex-col h-full bg-white dark:bg-[#111111] border border-[#E8E3DD] dark:border-[#222222] rounded-xl overflow-hidden hover:border-[#C9A45C]/40 dark:hover:border-[#333333] transition-all shadow-xs hover:shadow-md">
      {/* Image Container */}
      <Link href={`/products/${product.slug}`} className="relative aspect-[3/4] overflow-hidden bg-[#F5F0EB] dark:bg-[#181818] block">
        <img
          src={mainImage}
          alt={product.name}
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${
            isSold ? "grayscale opacity-60" : ""
          }`}
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
          <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-mono font-bold border ${getConditionBadge(product.condition)}`}>
            {product.condition?.replace("_", " ")} CONDITION
          </span>
          <span className="px-2 py-0.5 rounded text-[9px] uppercase font-mono font-bold bg-[#171717]/80 dark:bg-black/70 text-white border border-white/20">
            1-OF-1 • Size {product.size}
          </span>
        </div>

        {isSold && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-xs">
            <span className="px-4 py-1.5 bg-rose-500 text-white text-xs uppercase font-bold tracking-widest rounded">
              SOLD
            </span>
          </div>
        )}
      </Link>

      {/* Info Container */}
      <div className="p-4 flex flex-col justify-between flex-1 space-y-3">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#E99AB4] dark:text-[#F3A6BE]">
            {product.brand}
          </span>
          <Link href={`/products/${product.slug}`} className="block">
            <h3 className="text-xs font-semibold text-[#171717] dark:text-white group-hover:text-[#E99AB4] dark:group-hover:text-[#F3A6BE] transition-colors line-clamp-2 mt-0.5">
              {product.name}
            </h3>
          </Link>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-[#E8E3DD] dark:border-[#202020]">
          <span className="font-mono text-sm font-bold text-[#171717] dark:text-white">
            {formatPHP(product.price)}
          </span>
          {!isSold && (
            <Link
              href={`/products/${product.slug}`}
              className="text-[10px] uppercase font-bold text-[#C9A45C] dark:text-[#F3A6BE] hover:underline"
            >
              View Piece →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
