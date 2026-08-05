import Link from "next/link";
import { Lock } from "lucide-react";

export function Footer() {
  const whatsappNumber = process.env.WHATSAPP_PHONE_NUMBER || "+639999680628";

  return (
    <footer className="bg-[#171717] border-t border-[#2a2a2a] text-[#B8B8B8] text-xs pt-16 pb-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-10">
        {/* Col 1: Brand Info */}
        <div className="md:col-span-2 space-y-4">
          <div>
            <h3 className="font-serif text-3xl font-bold tracking-widest text-white">
              ME
            </h3>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#F3A6BE] font-sans font-semibold">
              Mica Ella
            </p>
          </div>
          <p className="text-xs text-[#999999] leading-relaxed max-w-sm">
            Curated 1-of-1 pre-loved luxury fashion, vintage archival pieces, and authenticated designer collectibles in the Philippines.
          </p>
          
          {/* Subtle Gold Accent Line */}
          <div className="w-12 h-[1px] bg-[#C9A45C]" />

          <p className="text-[11px] text-[#777777] font-mono">
            © 2026 ME — Mica Ella. All rights reserved.
          </p>
        </div>

        {/* Col 2: Navigation */}
        <div className="space-y-3">
          <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white flex items-center space-x-1.5">
            <span>Navigation</span>
          </h4>
          <ul className="space-y-2 font-medium">
            <li>
              <Link href="/shop" className="hover:text-[#F3A6BE] transition-colors">
                Shop 1-of-1
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-[#F3A6BE] transition-colors">
                About ME
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-[#F3A6BE] transition-colors">
                Contact & Inquiries
              </Link>
            </li>
            <li>
              <Link href="/faq" className="hover:text-[#F3A6BE] transition-colors">
                FAQ
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Follow ME Socials */}
        <div className="space-y-3">
          <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white">
            Follow ME
          </h4>
          <ul className="space-y-2 font-medium">
            <li>
              <a
                href="https://instagram.com/micaella"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#F3A6BE] transition-colors"
              >
                Instagram
              </a>
            </li>
            <li>
              <a
                href="https://www.facebook.com/marketplace/profile/100036193924898/?product_id=1907082703308799"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#F3A6BE] transition-colors"
              >
                Facebook Marketplace
              </a>
            </li>
            <li>
              <a
                href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#F3A6BE] transition-colors font-mono"
              >
                WhatsApp: {whatsappNumber}
              </a>
            </li>
          </ul>
        </div>

        {/* Col 4: Legal & Admin Section */}
        <div className="space-y-6">
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white">
              Legal & Policies
            </h4>
            <ul className="space-y-2 font-medium">
              <li>
                <Link href="/shipping" className="hover:text-[#F3A6BE] transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-[#F3A6BE] transition-colors">
                  Returns & Authenticity
                </Link>
              </li>
            </ul>
          </div>

          {/* Subtle Admin Panel Link */}
          <div className="pt-3 border-t border-[#262626]">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#666666]">
              Administration
            </h4>
            <Link
              href="/admin"
              className="mt-1 inline-flex items-center space-x-1.5 text-[11px] text-[#888888] hover:text-[#C9A45C] transition-colors group"
            >
              <Lock className="w-3 h-3 text-[#666666] group-hover:text-[#C9A45C]" />
              <span>Admin Panel</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
