import Link from "next/link";
import Image from "next/image";
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
  const isSold = product.status === "SOLD" || product.stock === 0;

  const getConditionBadge = (cond: string) => {
    switch (cond) {
      case "NEW":
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
      case "LIKE_NEW":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "EXCELLENT":
        return "bg-[#f472b6]/20 text-[#f472b6] border-[#f472b6]/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  const mainImage = product.images?.[0] || "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80";

  return (
    <div className="group flex flex-col h-full bg-[#111111] border border-[#222222] rounded-xl overflow-hidden hover:border-[#333333] transition-all">
      {/* Image Container */}
      <Link href={`/products/${product.slug}`} className="relative aspect-[3/4] overflow-hidden bg-[#181818] block">
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
            {product.condition?.replace("_", " ")}
          </span>
          <span className="px-2 py-0.5 rounded text-[9px] uppercase font-mono font-bold bg-black/70 text-white border border-white/20">
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
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#f472b6]">
            {product.brand}
          </span>
          <Link href={`/products/${product.slug}`} className="block">
            <h3 className="text-xs font-semibold text-white group-hover:text-[#f472b6] transition-colors line-clamp-2 mt-0.5">
              {product.name}
            </h3>
          </Link>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-[#202020]">
          <span className="font-mono text-sm font-bold text-white">
            {formatPHP(product.price)}
          </span>
          {!isSold && (
            <Link
              href={`/products/${product.slug}`}
              className="text-[10px] uppercase font-bold text-[#f472b6] hover:underline"
            >
              View Piece →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
