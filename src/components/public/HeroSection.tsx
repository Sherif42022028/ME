import Link from "next/link";
import { ArrowRight, Sparkles, ShieldCheck, Gem, MapPin, CheckCircle2 } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex flex-col justify-between bg-gradient-to-b from-[#141414] via-[#0d0d0d] to-[#0d0d0d] px-4 md:px-8 border-b border-[#222222] overflow-hidden pt-8 pb-12">
      {/* Background Soft Pink Glow */}
      <div className="absolute top-1/4 right-10 w-[500px] h-[500px] bg-[#f472b6]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-[#db2777]/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Grid Content */}
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center my-auto z-10">
        {/* Left Side: Typography & CTAs (7 cols) */}
        <div className="lg:col-span-7 space-y-8 text-left">
          {/* Small Label */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#f472b6]/10 border border-[#f472b6]/25 text-[#f472b6] text-xs font-mono uppercase font-bold tracking-[0.2em]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ME — MICA ELLA</span>
          </div>

          {/* Main Headline */}
          <div className="space-y-2">
            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-[1.05]">
              PRE-LOVED. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f472b6] via-white to-[#f472b6]">
                NEW STORIES.
              </span>
            </h1>
          </div>

          {/* Supporting Copy */}
          <p className="text-sm md:text-base text-[#d1d5db] font-sans max-w-xl leading-relaxed">
            Curated fashion pieces, carefully chosen and ready for their next chapter. Made for your next story. Discover authenticated one-of-one luxury archives in the Philippines.
          </p>

          {/* CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <Link
              href="/shop"
              className="px-8 py-4 bg-[#f472b6] hover:bg-[#db2777] text-black font-bold text-xs uppercase tracking-[0.2em] rounded-xl transition-all shadow-[0_0_30px_-5px_rgba(244,114,182,0.4)] flex items-center justify-center space-x-3 group"
            >
              <span>SHOP THE COLLECTION</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/shop?sort=newest"
              className="px-8 py-4 bg-[#181818] border border-[#2a2a2a] hover:border-[#f472b6]/50 text-white hover:text-[#f472b6] font-semibold text-xs uppercase tracking-[0.2em] rounded-xl transition-all flex items-center justify-center space-x-2 group"
            >
              <span>EXPLORE NEW ARRIVALS</span>
              <ArrowRight className="w-4 h-4 opacity-70 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Right Side: Editorial Fashion Image Frame (5 cols) */}
        <div className="lg:col-span-5 relative flex justify-center">
          {/* Soft Pink Frame Card */}
          <div className="relative w-full max-w-md aspect-[3/4] rounded-3xl overflow-hidden border border-[#f472b6]/30 bg-gradient-to-tr from-[#1a1a1a] via-[#141414] to-[#251520] shadow-[0_0_50px_-10px_rgba(244,114,182,0.2)] group">
            {/* Image */}
            <img
              src="/CEO pic.png"
              alt="Micaela Ella Fashion Editorial"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
            />

            {/* Editorial Slide Element Badge */}
            <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white font-mono text-xs font-bold tracking-wider">
              01 / 04
            </div>

            {/* Editorial Floating Tag */}
            <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-[#0d0d0d]/80 backdrop-blur-md border border-white/10 space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase text-[#f472b6] tracking-widest block">
                FASHION EDITORIAL ARCHIVE
              </span>
              <p className="text-xs font-serif font-bold text-white tracking-wide">
                Mica Ella Signature Selection
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Hero Feature Bar (Below Hero) */}
      <div className="max-w-7xl mx-auto w-full pt-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 rounded-2xl bg-[#121212]/90 backdrop-blur-md border border-[#222222] text-xs font-mono font-bold uppercase tracking-widest">
          <div className="flex items-center justify-center space-x-3 text-[#e5e5e5]">
            <MapPin className="w-4 h-4 text-[#f472b6]" />
            <span>CURATED IN THE PHILIPPINES</span>
          </div>

          <div className="flex items-center justify-center space-x-3 text-[#e5e5e5] border-t md:border-t-0 md:border-l border-[#222222] pt-3 md:pt-0">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>QUALITY CHECKED</span>
          </div>

          <div className="flex items-center justify-center space-x-3 text-[#e5e5e5] border-t md:border-t-0 md:border-l border-[#222222] pt-3 md:pt-0">
            <Gem className="w-4 h-4 text-[#f472b6]" />
            <span>ONE-OF-ONE PIECES</span>
          </div>
        </div>
      </div>
    </section>
  );
}
