import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { WhatsAppFloatingButton } from "@/components/public/WhatsAppFloatingButton";
import { MessageCircle, Mail, MapPin, Phone } from "lucide-react";

export default function ContactPage() {
  const whatsappNumber = process.env.WHATSAPP_PHONE_NUMBER || "+639999680628";
  const formattedPhone = whatsappNumber.replace(/[^0-9]/g, "");

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-[#faf9f6] flex flex-col font-sans selection:bg-[#f472b6] selection:text-black">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 md:px-8 py-16 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-mono font-bold uppercase text-[#f472b6] tracking-widest">
            Get In Touch
          </span>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-white tracking-wide">
            Contact ME — Mica Ella
          </h1>
          <p className="text-xs text-[#9ca3af] max-w-md mx-auto">
            Have questions about a 1-of-1 archival piece, size measurements, or express delivery? We'd love to assist.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Direct WhatsApp Box */}
          <div className="p-8 rounded-2xl bg-[#141414] border border-[#262626] space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-[#25D366]/10 text-[#25D366] w-fit">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Instant WhatsApp Concierge</h3>
              <p className="text-xs text-[#9ca3af]">
                Chat directly with Mica Ella and our styling team for instant product availability and sizing advice.
              </p>
              <p className="text-sm font-mono font-bold text-[#25D366]">{whatsappNumber}</p>
            </div>

            <a
              href={`https://wa.me/${formattedPhone}?text=${encodeURIComponent("Hi ME! I have an inquiry.")}`}
              target="_blank"
              rel="noreferrer"
              className="w-full py-3.5 bg-[#25D366] hover:bg-[#20ba5a] text-black font-bold text-xs uppercase tracking-widest rounded-xl transition-all text-center block"
            >
              Open WhatsApp Chat
            </a>
          </div>

          {/* Social & Email Box */}
          <div className="p-8 rounded-2xl bg-[#141414] border border-[#262626] space-y-6">
            <h3 className="text-lg font-bold text-white">Official Brand Channels</h3>
            
            <div className="space-y-4 text-xs">
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-[#f472b6]" />
                <div>
                  <span className="text-[#6b7280] block text-[10px] uppercase font-mono">Customer Support Email</span>
                  <a href="mailto:contact@micaelaella.com" className="text-white hover:underline">
                    contact@micaelaella.com
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-[#f472b6]" />
                <div>
                  <span className="text-[#6b7280] block text-[10px] uppercase font-mono">Location & Archive Studio</span>
                  <span className="text-white">Makati City, Metro Manila, Philippines</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <WhatsAppFloatingButton />
      <Footer />
    </div>
  );
}
