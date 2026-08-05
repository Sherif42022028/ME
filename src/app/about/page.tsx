import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { WhatsAppFloatingButton } from "@/components/public/WhatsAppFloatingButton";
import { prisma } from "@/lib/prisma";
import { UserCheck, Sparkles, Gem } from "lucide-react";

export const revalidate = 60;

export default async function AboutPage() {
  const founder = await prisma.founderProfile.findFirst();

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-[#faf9f6] flex flex-col font-sans selection:bg-[#f472b6] selection:text-black">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 md:px-8 py-16 space-y-16">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-xs font-mono font-bold uppercase text-[#f472b6] tracking-widest">
            Brand Archive & Founder Story
          </span>
          <h1 className="font-serif text-4xl md:text-6xl font-bold text-white tracking-wide">
            About ME — Micaela Ella
          </h1>
          <p className="text-sm text-[#d1d5db] font-sans leading-relaxed">
            Redefining sustainable luxury and pre-loved archival fashion in the Philippines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center p-8 rounded-3xl bg-[#141414] border border-[#262626]">
          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#1a1a1a] border border-[#2a2a2a]">
            <img
              src={founder?.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80"}
              alt={founder?.name || "Micaela Ella"}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-6">
            <div>
              <span className="text-xs font-mono text-[#f472b6] uppercase font-bold tracking-wider">Founder & Curator</span>
              <h2 className="font-serif text-3xl font-bold text-white tracking-wide mt-1">
                {founder?.name || "Micaela Ella"}
              </h2>
            </div>

            <blockquote className="font-serif italic text-lg text-white border-l-2 border-[#f472b6] pl-4 py-1">
              "{founder?.quote || "Fashion should carry history, grace, and an unforgettable story."}"
            </blockquote>

            <p className="text-xs text-[#d1d5db] leading-relaxed whitespace-pre-wrap">
              {founder?.bio || "Micaela Ella is a Manila-based fashion curator and archivist with a passion for timeless, high-craftsmanship vintage and pre-loved luxury. ME was born out of a desire to redefine sustainable luxury fashion in the Philippines."}
            </p>
          </div>
        </div>
      </main>

      <WhatsAppFloatingButton />
      <Footer />
    </div>
  );
}
