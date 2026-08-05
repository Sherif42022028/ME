import Link from "next/link";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { HeroSection } from "@/components/public/HeroSection";
import { ProductCard } from "@/components/public/ProductCard";
import { WhatsAppFloatingButton } from "@/components/public/WhatsAppFloatingButton";
import { prisma } from "@/lib/prisma";
import { ArrowRight, ShieldCheck, Gem, RefreshCw } from "lucide-react";

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
        {/* Editorial Fashion Hero Section */}
        <HeroSection />

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
              — Mica Ella, Founder & Curator
            </p>
          </div>
        </section>
      </main>

      <WhatsAppFloatingButton />
      <Footer />
    </div>
  );
}
