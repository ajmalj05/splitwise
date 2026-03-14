"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone.replace(/\D/g, "") || phone }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Login failed");
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 pt-6 pb-12">
      <div className="w-full max-w-md mx-auto">
        <div className="bg-slate-800 rounded-b-2xl -mx-4 px-4 pt-4 pb-5 mb-6 shadow-lg animate-fade-in">
          <h1 className="text-lg font-semibold text-white text-center tracking-tight">Naasthamukk</h1>
          <p className="text-white/80 text-sm text-center mt-1">Split expenses with friends</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-8 animate-slide-up transition-shadow duration-200 hover:shadow-md">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-zinc-700 mb-2">
                Phone number
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 9876543210"
                className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
                required
              />
            </div>
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-primary-500 text-white font-semibold hover:bg-primary-600 disabled:opacity-50 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? "Continuing…" : "Continue"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
