import Link from "next/link";
import { ArrowRight, Sparkles, Gem, MapPin, CheckCircle2 } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex flex-col justify-between bg-[#FAF8F5] dark:bg-[#0B0B0B] text-[#171717] dark:text-[#faf9f6] px-4 md:px-8 border-b border-[#E8E3DD] dark:border-[#222222] overflow-hidden pt-8 pb-12 transition-colors duration-200">
      {/* Background Soft Pink Ambient Glow */}
      <div className="absolute top-1/4 right-10 w-[500px] h-[500px] bg-[#E99AB4]/15 dark:bg-[#F3A6BE]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-[#F4C7D3]/20 dark:bg-[#db2777]/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Grid Content */}
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center my-auto z-10">
        {/* Left Side: Typography & CTAs (7 cols) */}
        <div className="lg:col-span-7 space-y-8 text-left">
          {/* Small Label */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#E99AB4]/10 dark:bg-[#F3A6BE]/10 border border-[#E99AB4]/30 dark:border-[#F3A6BE]/25 text-[#E99AB4] dark:text-[#F3A6BE] text-xs font-mono uppercase font-bold tracking-[0.2em]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ME — MICA ELLA</span>
          </div>

          {/* Main Headline with Thin Gold Editorial Line */}
          <div className="space-y-4">
            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#171717] dark:text-white leading-[1.05]">
              PRE-LOVED. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E99AB4] via-[#171717] to-[#E99AB4] dark:from-[#F3A6BE] dark:via-white dark:to-[#F3A6BE]">
                NEW STORIES.
              </span>
            </h1>

            {/* Thin Gold Editorial Line */}
            <div className="w-24 h-[1.5px] bg-[#C9A45C] dark:bg-[#D4AF6A] my-3 rounded-full" />
          </div>

          {/* Supporting Copy */}
          <p className="text-sm md:text-base text-[#66615D] dark:text-[#d1d5db] font-sans max-w-xl leading-relaxed">
            Curated fashion pieces, carefully chosen and ready for their next chapter. Made for your next story. Discover authenticated one-of-one luxury archives in the Philippines.
          </p>

          {/* CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            {/* Primary CTA */}
            <Link
              href="/shop"
              className="px-8 py-4 bg-[#171717] hover:bg-[#E99AB4] text-white hover:text-black dark:bg-[#F3A6BE] dark:hover:bg-[#db2777] dark:text-black font-bold text-xs uppercase tracking-[0.2em] rounded-xl transition-all shadow-md flex items-center justify-center space-x-3 group"
            >
              <span>SHOP THE COLLECTION</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            {/* Secondary CTA */}
            <Link
              href="/shop?sort=newest"
              className="px-8 py-4 bg-transparent border border-[#C9A45C] dark:border-[#D4AF6A] text-[#171717] dark:text-white hover:bg-[#C9A45C]/10 dark:hover:bg-[#D4AF6A]/10 font-semibold text-xs uppercase tracking-[0.2em] rounded-xl transition-all flex items-center justify-center space-x-2 group"
            >
              <span>EXPLORE NEW ARRIVALS</span>
              <ArrowRight className="w-4 h-4 opacity-70 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Right Side: Editorial Fashion Image Frame (5 cols) */}
        <div className="lg:col-span-5 relative flex justify-center">
          {/* Soft Pink & Gold Frame Card */}
          <div className="relative w-full max-w-md aspect-[3/4] rounded-3xl overflow-hidden border border-[#C9A45C]/30 dark:border-[#F3A6BE]/30 bg-gradient-to-tr from-[#F5F0EB] via-[#FFFFFF] to-[#FAF8F5] dark:from-[#1a1a1a] dark:via-[#141414] dark:to-[#251520] shadow-xl group">
            {/* Image */}
            <img
              src="/CEO pic.png"
              alt="Mica Ella Fashion Editorial"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
            />

            {/* Editorial Slide Element Badge */}
            <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-[#171717]/80 dark:bg-black/60 backdrop-blur-md border border-white/20 text-white font-mono text-xs font-bold tracking-wider">
              01 / 04
            </div>

            {/* Editorial Floating Tag */}
            <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/90 dark:bg-[#0d0d0d]/80 backdrop-blur-md border border-[#E8E3DD] dark:border-white/10 space-y-1 shadow-lg">
              <span className="text-[10px] font-mono font-bold uppercase text-[#E99AB4] dark:text-[#F3A6BE] tracking-widest block">
                FASHION EDITORIAL ARCHIVE
              </span>
              <p className="text-xs font-serif font-bold text-[#171717] dark:text-white tracking-wide">
                Mica Ella Signature Selection
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Hero Feature Bar (Below Hero) */}
      <div className="max-w-7xl mx-auto w-full pt-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 rounded-2xl bg-white/80 dark:bg-[#121212]/90 backdrop-blur-md border border-[#E8E3DD] dark:border-[#222222] text-xs font-mono font-bold uppercase tracking-widest shadow-xs">
          <div className="flex items-center justify-center space-x-3 text-[#171717] dark:text-[#e5e5e5]">
            <MapPin className="w-4 h-4 text-[#C9A45C] dark:text-[#D4AF6A]" />
            <span>CURATED IN THE PHILIPPINES</span>
          </div>

          <div className="flex items-center justify-center space-x-3 text-[#171717] dark:text-[#e5e5e5] border-t md:border-t-0 md:border-l border-[#E8E3DD] dark:border-[#222222] pt-3 md:pt-0">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>QUALITY CHECKED</span>
          </div>

          <div className="flex items-center justify-center space-x-3 text-[#171717] dark:text-[#e5e5e5] border-t md:border-t-0 md:border-l border-[#E8E3DD] dark:border-[#222222] pt-3 md:pt-0">
            <Gem className="w-4 h-4 text-[#E99AB4] dark:text-[#F3A6BE]" />
            <span>ONE-OF-ONE PIECES</span>
          </div>
        </div>
      </div>
    </section>
  );
}
