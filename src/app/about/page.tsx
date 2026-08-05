import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { WhatsAppFloatingButton } from "@/components/public/WhatsAppFloatingButton";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;

export default async function AboutPage() {
  const founder = await prisma.founderProfile.findFirst();

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-[#0B0B0B] text-[#171717] dark:text-[#faf9f6] flex flex-col font-sans selection:bg-[#E99AB4] dark:selection:bg-[#F3A6BE] selection:text-black transition-colors duration-200">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 md:px-8 py-16 space-y-16">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-xs font-mono font-bold uppercase text-[#E99AB4] dark:text-[#F3A6BE] tracking-widest">
            Brand Archive & Founder Story
          </span>
          <h1 className="font-serif text-4xl md:text-6xl font-bold text-[#171717] dark:text-white tracking-wide">
            About ME — Mica Ella
          </h1>
          <p className="text-sm text-[#66615D] dark:text-[#d1d5db] font-sans leading-relaxed">
            Redefining sustainable luxury and pre-loved archival fashion in the Philippines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center p-8 md:p-12 rounded-3xl bg-white dark:bg-[#141414] border border-[#E8E3DD] dark:border-[#262626] shadow-sm">
          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#F5F0EB] dark:bg-[#1a1a1a] border border-[#E8E3DD] dark:border-[#2a2a2a]">
            <img
              src={founder?.image || "/CEO pic.png"}
              alt={founder?.name || "Mica Ella"}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-6">
            <div>
              <span className="text-xs font-mono text-[#E99AB4] dark:text-[#F3A6BE] uppercase font-bold tracking-wider">Founder & Curator</span>
              <h2 className="font-serif text-3xl font-bold text-[#171717] dark:text-white tracking-wide mt-1">
                {founder?.name || "Mica Ella"}
              </h2>
            </div>

            <blockquote className="font-serif italic text-lg text-[#171717] dark:text-white border-l-2 border-[#C9A45C] dark:border-[#F3A6BE] pl-4 py-1">
              "{founder?.quote || "Fashion should carry history, grace, and an unforgettable story."}"
            </blockquote>

            <p className="text-xs text-[#66615D] dark:text-[#d1d5db] leading-relaxed whitespace-pre-wrap">
              {founder?.bio || "Mica Ella is a Manila-based fashion curator and archivist with a passion for timeless, high-craftsmanship vintage and pre-loved luxury. ME was born out of a desire to redefine sustainable luxury fashion in the Philippines."}
            </p>
          </div>
        </div>
      </main>

      <WhatsAppFloatingButton />
      <Footer />
    </div>
  );
}
