import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-[#0d0d0d] text-[#faf9f6] flex flex-col font-sans selection:bg-[#f472b6] selection:text-black">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 md:px-8 py-16 space-y-6">
        <h1 className="font-serif text-4xl font-bold text-white tracking-wide">
          Returns & Authenticity Guarantee
        </h1>
        <div className="p-8 rounded-2xl bg-[#141414] border border-[#262626] space-y-4 text-xs text-[#d1d5db] leading-relaxed">
          <p>
            Due to the 1-of-1 nature of pre-loved luxury fashion items, all sales are final once delivered unless an item fails authenticity inspection.
          </p>
          <h3 className="text-sm font-bold text-white uppercase pt-2">Lifetime Authenticity Money-Back Guarantee</h3>
          <p>
            If any item purchased from ME — Mica Ella is proven unauthentic by an accredited third-party authenticator, we issue a 100% full refund immediately.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
