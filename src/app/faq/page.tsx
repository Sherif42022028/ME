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
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-[#0B0B0B] text-[#171717] dark:text-[#faf9f6] flex flex-col font-sans selection:bg-[#E99AB4] dark:selection:bg-[#F3A6BE] selection:text-black transition-colors duration-200">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 md:px-8 py-16 space-y-10">
        <div>
          <span className="text-xs font-mono font-bold uppercase text-[#E99AB4] dark:text-[#F3A6BE] tracking-widest">
            Frequently Asked Questions
          </span>
          <h1 className="font-serif text-4xl font-bold text-[#171717] dark:text-white tracking-wide mt-1">
            FAQ & Shopping Assistance
          </h1>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-white dark:bg-[#141414] border border-[#E8E3DD] dark:border-[#262626] space-y-2 shadow-xs">
              <h3 className="text-sm font-bold text-[#171717] dark:text-white">{faq.q}</h3>
              <p className="text-xs text-[#66615D] dark:text-[#9ca3af] leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </main>

      <WhatsAppFloatingButton />
      <Footer />
    </div>
  );
}
