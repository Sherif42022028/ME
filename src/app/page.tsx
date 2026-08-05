import Link from "next/link";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { HeroSection } from "@/components/public/HeroSection";
import { ProductCard } from "@/components/public/ProductCard";
import { WhatsAppFloatingButton } from "@/components/public/WhatsAppFloatingButton";
import { prisma } from "@/lib/prisma";
import { ArrowRight, Sparkles, Gem } from "lucide-react";

export const revalidate = 60; // ISR 60s

export default async function PublicHomePage() {
  const featuredProducts = await prisma.product.findMany({
    where: { status: "PUBLISHED" },
    take: 6,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-[#0B0B0B] text-[#171717] dark:text-[#faf9f6] flex flex-col font-sans selection:bg-[#E99AB4] dark:selection:bg-[#F3A6BE] selection:text-black transition-colors duration-200">
      <Navbar />

      <main className="flex-1 space-y-20 pb-20">
        {/* Editorial Fashion Hero Section */}
        <HeroSection />

        {/* Featured 1-of-1 Collection */}
        <section className="max-w-7xl mx-auto px-4 md:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-mono font-bold uppercase text-[#E99AB4] dark:text-[#F3A6BE] tracking-widest flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Curated New Arrivals</span>
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#171717] dark:text-white tracking-wide mt-1">
                Featured 1-of-1 Fashion Archives
              </h2>
            </div>
            <Link
              href="/shop"
              className="text-xs font-bold text-[#C9A45C] dark:text-[#F3A6BE] hover:underline flex items-center space-x-1"
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

        {/* Editorial Founder Section (Section 9) */}
        <section className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="p-12 md:p-16 rounded-3xl bg-white dark:bg-gradient-to-r dark:from-[#141414] dark:via-[#1c1c1c] dark:to-[#141414] border border-[#E8E3DD] dark:border-[#2a2a2a] text-center space-y-6 relative overflow-hidden shadow-sm">
            <span className="text-xs font-mono uppercase font-bold tracking-[0.25em] text-[#E99AB4] dark:text-[#F3A6BE] block">
              THE WOMAN BEHIND ME
            </span>

            <h2 className="font-serif italic text-2xl md:text-4xl text-[#171717] dark:text-white max-w-3xl mx-auto leading-relaxed">
              "Fashion should carry history, grace, and an unforgettable story."
            </h2>

            {/* Thin Gold Divider */}
            <div className="w-16 h-[1.5px] bg-[#C9A45C] dark:bg-[#D4AF6A] mx-auto rounded-full" />

            <p className="text-xs uppercase tracking-[0.2em] text-[#66615D] dark:text-[#B8B8B8] font-mono font-bold">
              Mica Ella — Founder & Curator
            </p>
          </div>
        </section>
      </main>

      <WhatsAppFloatingButton />
      <Footer />
    </div>
  );
}
