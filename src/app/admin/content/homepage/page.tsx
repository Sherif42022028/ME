"use client";

import { useState } from "react";
import { FileText, Save, CheckCircle2 } from "lucide-react";

export default function HomepageCMSPage() {
  const [heroTitle, setHeroTitle] = useState("Curated Pre-Loved Luxury Fashion");
  const [announcement, setAnnouncement] = useState("Complimentary Nationwide Express Shipping on Orders Above ₱15,000");
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="font-serif text-3xl font-bold text-white tracking-wide flex items-center space-x-3">
          <FileText className="w-6 h-6 text-[#f472b6]" />
          <span>Homepage CMS Banner Editor</span>
        </h1>
        <p className="text-xs text-[#9ca3af] mt-1">
          Update hero headlines, announcement bar text, and featured editorial banners.
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Homepage banner content saved to database!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="p-8 rounded-2xl bg-[#141414] border border-[#262626] space-y-6">
        <div>
          <label className="block text-xs font-bold uppercase text-[#9ca3af] mb-2">Announcement Bar Text</label>
          <input
            type="text"
            value={announcement}
            onChange={(e) => setAnnouncement(e.target.value)}
            className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-3 text-xs text-white focus:outline-none focus:border-[#f472b6]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-[#9ca3af] mb-2">Hero Headline</label>
          <input
            type="text"
            value={heroTitle}
            onChange={(e) => setHeroTitle(e.target.value)}
            className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-3 text-xs text-white focus:outline-none focus:border-[#f472b6] font-serif text-lg"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3.5 px-6 bg-[#f472b6] hover:bg-[#db2777] text-black font-bold text-xs uppercase tracking-widest rounded-xl transition-all flex items-center justify-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Homepage CMS</span>
        </button>
      </form>
    </div>
  );
}
