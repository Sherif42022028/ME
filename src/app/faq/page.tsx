import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { WhatsAppFloatingButton } from "@/components/public/WhatsAppFloatingButton";

export default function FAQPage() {
  const faqs = [
    {
      q: "Are all items 100% authentic?",
      a: "Yes. Every pre-loved luxury handbag, gown, and vintage blazer passes through rigorous authentication checks before being listed.",
    },
    {
      q: "Why is every item 1-of-1?",
      a: "Because we specialize in pre-loved and archival vintage fashion, each product listed is a single unique piece in a specific size.",
    },
    {
      q: "What payment methods do you accept?",
      a: "We accept GCash, Maya, Bank Transfer, and major Credit/Debit Cards via secure PayMongo checkout.",
    },
    {
      q: "How fast is express shipping within the Philippines?",
      a: "Orders within Metro Manila are delivered within 24-48 hours via Lalamove or express courier. Provincial shipping takes 3-5 business days.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-[#faf9f6] flex flex-col font-sans selection:bg-[#f472b6] selection:text-black">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 md:px-8 py-16 space-y-10">
        <div>
          <span className="text-xs font-mono font-bold uppercase text-[#f472b6] tracking-widest">
            Frequently Asked Questions
          </span>
          <h1 className="font-serif text-4xl font-bold text-white tracking-wide mt-1">
            FAQ & Shopping Assistance
          </h1>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-[#141414] border border-[#262626] space-y-2">
              <h3 className="text-sm font-bold text-white">{faq.q}</h3>
              <p className="text-xs text-[#9ca3af] leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </main>

      <WhatsAppFloatingButton />
      <Footer />
    </div>
  );
}
