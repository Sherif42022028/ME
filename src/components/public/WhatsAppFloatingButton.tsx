import { MessageCircle } from "lucide-react";

export function WhatsAppFloatingButton() {
  const whatsappNumber = process.env.WHATSAPP_PHONE_NUMBER || "+639999680628";
  const formattedPhone = whatsappNumber.replace(/[^0-9]/g, "");

  return (
    <a
      href={`https://wa.me/${formattedPhone}?text=${encodeURIComponent("Hi ME! I have an inquiry about a pre-loved fashion piece.")}`}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 right-6 z-50 p-3.5 rounded-full bg-[#25D366] text-black font-bold shadow-2xl hover:scale-110 transition-transform flex items-center space-x-2 group"
      title="Ask ME on WhatsApp"
    >
      <MessageCircle className="w-5 h-5 fill-current" />
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap text-xs font-sans uppercase font-bold tracking-wider">
        Ask ME on WhatsApp
      </span>
    </a>
  );
}
