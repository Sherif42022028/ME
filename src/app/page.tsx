import Link from "next/link";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { ProductCard } from "@/components/public/ProductCard";
import { WhatsAppFloatingButton } from "@/components/public/WhatsAppFloatingButton";
import { prisma } from "@/lib/prisma";
import { ArrowRight, ShieldCheck, Sparkles, Gem, RefreshCw } from "lucide-react";

export const revalidate = 60; // ISR 60s

export default async function PublicHomePage() {
  const featuredProducts = await prisma.product.findMany({
    where: { status: "PUBLISHED" },
    take: 6,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-[#faf9f6] flex flex-col font-sans selection:bg-[#f472b6] selection:text-black">
      <Navbar />

      <main className="flex-1 space-y-20 pb-20">
        {/* Editorial Hero Section */}
        <section className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-b from-[#141414] via-[#0d0d0d] to-[#0d0d0d] px-4 md:px-8 border-b border-[#222222]">
          <div className="max-w-4xl text-center space-y-6 z-10 py-16">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#f472b6]/10 border border-[#f472b6]/20 text-[#f472b6] text-xs font-mono uppercase font-bold tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Pre-Loved Luxury & Vintage Archival Fashion</span>
            </div>

            <h1 className="font-serif text-5xl md:text-7xl font-bold tracking-tight text-white leading-tight">
              ME — Micaela Ella
            </h1>

            <p className="text-sm md:text-base text-[#d1d5db] font-sans max-w-2xl mx-auto leading-relaxed">
              Curated one-of-one luxury pieces, authenticated vintage Chanel, Dior, and Jacquemus archives handpicked for the discerning fashion collector in the Philippines.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/shop"
                className="w-full sm:w-auto px-8 py-4 bg-[#f472b6] hover:bg-[#db2777] text-black font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-xl flex items-center justify-center space-x-3 group"
              >
                <span>Explore 1-of-1 Catalog</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/about"
                className="w-full sm:w-auto px-8 py-4 bg-[#181818] border border-[#2a2a2a] hover:border-[#333333] text-white font-semibold text-xs uppercase tracking-widest rounded-xl transition-colors"
              >
                <span>About Micaela Ella</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Brand Value Props */}
        <section className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8 rounded-2xl bg-[#121212] border border-[#222222]">
            <div className="flex items-start space-x-4">
              <div className="p-3 rounded-xl bg-[#f472b6]/10 text-[#f472b6] shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">100% Authenticity Guaranteed</h3>
                <p className="text-xs text-[#9ca3af] mt-1">Every item undergoes double-stage hardware & material verification.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="p-3 rounded-xl bg-[#f472b6]/10 text-[#f472b6] shrink-0">
                <Gem className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Exclusive 1-of-1 Inventory</h3>
                <p className="text-xs text-[#9ca3af] mt-1">Single-unit archival pieces. Once an item is purchased, it is gone forever.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="p-3 rounded-xl bg-[#f472b6]/10 text-[#f472b6] shrink-0">
                <RefreshCw className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Express Nationwide Delivery</h3>
                <p className="text-xs text-[#9ca3af] mt-1">Insured Lalamove & J&T express shipping across Manila & provinces.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured 1-of-1 Collection */}
        <section className="max-w-7xl mx-auto px-4 md:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-mono font-bold uppercase text-[#f472b6] tracking-widest">
                Curated New Arrivals
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-white tracking-wide mt-1">
                Featured 1-of-1 Fashion Archives
              </h2>
            </div>
            <Link
              href="/shop"
              className="text-xs font-bold text-[#f472b6] hover:underline flex items-center space-x-1"
            >
              <span>View All Pieces ({featuredProducts.length})</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Editorial Founder Quote Banner */}
        <section className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="p-12 rounded-3xl bg-gradient-to-r from-[#141414] via-[#1c1c1c] to-[#141414] border border-[#2a2a2a] text-center space-y-6 relative overflow-hidden">
            <h2 className="font-serif italic text-2xl md:text-4xl text-white max-w-3xl mx-auto leading-relaxed">
              "Fashion should carry history, grace, and an unforgettable story."
            </h2>
            <p className="text-xs uppercase tracking-[0.25em] text-[#f472b6] font-mono font-bold">
              — Micaela Ella, Founder & Curator
            </p>
          </div>
        </section>
      </main>

      <WhatsAppFloatingButton />
      <Footer />
    </div>
  );
}
