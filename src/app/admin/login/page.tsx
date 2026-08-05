"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, AlertCircle, Loader2, Lock, Mail, ArrowLeft } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Authentication failed.");
        setLoading(false);
        return;
      }

      // Success -> Redirect to Admin Dashboard
      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      console.error("Login submit error:", err);
      setError("Unable to connect to authentication server. Please check your connection.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center p-4 selection:bg-[#f472b6] selection:text-black relative">
      {/* Return to Public Website */}
      <Link
        href="/"
        className="absolute top-6 left-6 text-xs text-[#9ca3af] hover:text-white flex items-center space-x-2 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to ME Public Storefront</span>
      </Link>

      <div className="w-full max-w-md bg-[#141414] border border-[#262626] rounded-2xl p-8 shadow-2xl space-y-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <h1 className="font-serif text-4xl font-bold tracking-widest text-white">
            ME
          </h1>
          <p className="text-xs uppercase tracking-[0.25em] text-[#9ca3af] font-sans">
            Micaela Ella
          </p>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-[#f472b6]/10 border border-[#f472b6]/20 text-[#f472b6] text-[10px] uppercase font-mono tracking-wider font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Authorized Admin Portal</span>
          </div>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start space-x-2.5 animate-in fade-in slide-in-from-top-2 duration-150">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#9ca3af] mb-2">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#6b7280] absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="admin@me-micaelaella.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#1c1c1c] border border-[#2a2a2a] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-[#555555] focus:outline-none focus:border-[#f472b6] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#9ca3af] mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#6b7280] absolute left-3.5 top-3.5" />
              <input
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#1c1c1c] border border-[#2a2a2a] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-[#555555] focus:outline-none focus:border-[#f472b6] transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-[#f472b6] to-[#db2777] hover:from-[#f472b6] hover:to-[#be185d] text-black font-bold text-xs uppercase tracking-widest rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <span>Sign In To Admin</span>
            )}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-[#222222]">
          <p className="text-[11px] text-[#6b7280]">
            Protected by Neon PostgreSQL server-side authorization.
          </p>
        </div>
      </div>
    </div>
  );
}
