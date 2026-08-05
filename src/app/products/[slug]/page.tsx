import { notFound } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { WhatsAppFloatingButton } from "@/components/public/WhatsAppFloatingButton";
import { prisma } from "@/lib/prisma";
import { formatPHP } from "@/lib/utils";
import { ShieldCheck, MessageCircle, ShoppingBag, ArrowLeft, Gem } from "lucide-react";

export const revalidate = 30;

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!product) {
    notFound();
  }

  const isSold = product.status === "SOLD" || product.stock === 0;
  const whatsappNumber = process.env.WHATSAPP_PHONE_NUMBER || "+639999680628";
  const formattedPhone = whatsappNumber.replace(/[^0-9]/g, "");

  const waMessage = `Hi ME! I'm interested in the ${product.name}.\nProduct ID: ${product.sku}\nPrice: ${formatPHP(product.price)}\nIs it still available?`;

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-[#faf9f6] flex flex-col font-sans selection:bg-[#f472b6] selection:text-black">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-10 space-y-8">
        <Link
          href="/shop"
          className="inline-flex items-center space-x-2 text-xs text-[#9ca3af] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalog</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left: Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#141414] border border-[#262626]">
              <img
                src={product.images[0] || "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80"}
                alt={product.name}
                className={`w-full h-full object-cover ${isSold ? "grayscale opacity-60" : ""}`}
              />
              {isSold && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-xs">
                  <span className="px-6 py-2 bg-rose-500 text-white text-sm uppercase font-bold tracking-widest rounded-lg">
                    SOLD
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right: Product Info & Actions */}
          <div className="space-y-8">
            <div>
              <div className="flex items-center space-x-3">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#f472b6]">
                  {product.brand}
                </span>
                <span className="text-xs text-[#6b7280]">/</span>
                <span className="text-xs text-[#9ca3af] font-mono">SKU: {product.sku}</span>
              </div>

              <h1 className="font-serif text-3xl md:text-4xl font-bold text-white tracking-wide mt-2">
                {product.name}
              </h1>

              <p className="font-mono text-2xl font-bold text-[#f472b6] mt-3">
                {formatPHP(product.price)}
              </p>
            </div>

            {/* Badges */}
            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-[#141414] border border-[#262626] text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#6b7280]">Condition</span>
                <p className="font-semibold text-white mt-0.5">{product.condition?.replace("_", " ")}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#6b7280]">Size</span>
                <p className="font-semibold text-white mt-0.5">{product.size}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#6b7280]">Color</span>
                <p className="font-semibold text-white mt-0.5">{product.color}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#6b7280]">Availability</span>
                <p className="font-semibold text-emerald-400 mt-0.5">{isSold ? "SOLD" : "1-OF-1 IN STOCK"}</p>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#9ca3af]">Editorial Description</h3>
              <p className="text-xs text-[#d1d5db] leading-relaxed whitespace-pre-wrap">{product.description}</p>
            </div>

            {/* CTAs */}
            {!isSold ? (
              <div className="space-y-3 pt-2">
                <Link
                  href="/cart"
                  className="w-full py-4 bg-[#f472b6] hover:bg-[#db2777] text-black font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-xl flex items-center justify-center space-x-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add To Shopping Bag</span>
                </Link>

                <a
                  href={`https://wa.me/${formattedPhone}?text=${encodeURIComponent(waMessage)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-4 bg-[#25D366] hover:bg-[#20ba5a] text-black font-bold text-xs uppercase tracking-widest rounded-xl transition-all flex items-center justify-center space-x-2"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Ask About This Item On WhatsApp</span>
                </a>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs text-center font-bold">
                This exclusive 1-of-1 archival piece has been sold.
              </div>
            )}

            <div className="pt-4 border-t border-[#222222] flex items-center space-x-3 text-xs text-[#9ca3af]">
              <ShieldCheck className="w-5 h-5 text-[#f472b6] shrink-0" />
              <span>100% Authenticity Verified & Guaranteed by ME Archives</span>
            </div>
          </div>
        </div>
      </main>

      <WhatsAppFloatingButton />
      <Footer />
    </div>
  );
}
