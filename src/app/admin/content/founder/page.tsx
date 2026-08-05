"use client";

import { useState, useEffect } from "react";
import { UserCheck, Save, Loader2, AlertCircle } from "lucide-react";

export default function FounderCMSPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "Micaela Ella",
    bio: "Micaela Ella is a Manila-based fashion curator and archivist with a passion for timeless, high-craftsmanship vintage and pre-loved luxury. ME was born out of a desire to redefine sustainable luxury fashion in the Philippines.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80",
    quote: "Fashion should carry history, grace, and an unforgettable story.",
    published: true,
  });

  const fetchFounder = async () => {
    try {
      const res = await fetch("/api/admin/content");
      const data = await res.json();
      if (data.success && data.founder) {
        setForm({
          name: data.founder.name,
          bio: data.founder.bio,
          image: data.founder.image,
          quote: data.founder.quote || "",
          published: data.founder.published,
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFounder();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "founder",
          founderData: form,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setMessage("Founder profile updated successfully in Neon database!");
      }
    } catch (e) {
      console.error(e);
      setMessage("Error updating profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-[#9ca3af] flex flex-col items-center space-y-3">
        <Loader2 className="w-6 h-6 text-[#f472b6] animate-spin" />
        <span className="text-xs">Loading Founder Profile from Neon DB...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="font-serif text-3xl font-bold text-white tracking-wide flex items-center space-x-3">
          <UserCheck className="w-6 h-6 text-[#f472b6]" />
          <span>Founder Profile Management</span>
        </h1>
        <p className="text-xs text-[#9ca3af] mt-1">
          Manage the public biography, editorial imagery, and brand quotes for <strong className="text-white">Micaela Ella</strong>.
        </p>
      </div>

      {message && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
          {message}
        </div>
      )}

      <form onSubmit={handleSave} className="p-8 rounded-2xl bg-[#141414] border border-[#262626] space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold uppercase text-[#9ca3af] mb-2">Founder Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-3 text-xs text-white focus:outline-none focus:border-[#f472b6]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-[#9ca3af] mb-2">Editorial Portrait Image URL</label>
            <input
              type="url"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              required
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-3 text-xs text-white focus:outline-none focus:border-[#f472b6] font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-[#9ca3af] mb-2">Editorial Quote</label>
          <input
            type="text"
            value={form.quote}
            onChange={(e) => setForm({ ...form, quote: e.target.value })}
            className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-3 text-xs text-white focus:outline-none focus:border-[#f472b6] font-serif italic"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-[#9ca3af] mb-2">Biography</label>
          <textarea
            rows={5}
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            required
            className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-3 text-xs text-white focus:outline-none focus:border-[#f472b6]"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-3.5 px-6 bg-[#f472b6] hover:bg-[#db2777] text-black font-bold text-xs uppercase tracking-widest rounded-xl transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Save Profile Changes</span>
        </button>
      </form>
    </div>
  );
}
