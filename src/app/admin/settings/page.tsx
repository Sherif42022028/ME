"use client";

import { useState } from "react";
import { Settings, Shield, CheckCircle2, Lock } from "lucide-react";

export default function SettingsPage() {
  const [storeName, setStoreName] = useState("ME — Mica Ella");
  const [currency, setCurrency] = useState("PHP (₱)");
  const [adminEmail, setAdminEmail] = useState("mica.ella.admin@gmail.com");
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
          <Settings className="w-6 h-6 text-[#f472b6]" />
          <span>System & Store Settings</span>
        </h1>
        <p className="text-xs text-[#9ca3af] mt-1">
          Manage general store parameters, currency, and administrator security.
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Settings saved successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="p-8 rounded-2xl bg-[#141414] border border-[#262626] space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold uppercase text-[#9ca3af] mb-2">Store Name</label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-3 text-xs text-white focus:outline-none focus:border-[#f472b6]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-[#9ca3af] mb-2">Store Currency</label>
            <input
              type="text"
              value={currency}
              disabled
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-3 text-xs text-white opacity-70 cursor-not-allowed font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-[#9ca3af] mb-2">Configured Admin Email</label>
            <input
              type="email"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-3 text-xs text-white focus:outline-none focus:border-[#f472b6]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-[#9ca3af] mb-2">Target Market</label>
            <input
              type="text"
              value="Philippines"
              disabled
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-3 text-xs text-white opacity-70 cursor-not-allowed"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 px-6 bg-[#f472b6] hover:bg-[#db2777] text-black font-bold text-xs uppercase tracking-widest rounded-xl transition-all flex items-center justify-center space-x-2"
        >
          <Shield className="w-4 h-4" />
          <span>Save Store Configuration</span>
        </button>
      </form>
    </div>
  );
}
