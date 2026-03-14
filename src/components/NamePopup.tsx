"use client";

import { useState, useEffect } from "react";

export function NamePopup({
  hasName,
  userId,
}: {
  hasName: boolean;
  userId: string;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!hasName && userId) setOpen(true);
  }, [hasName, userId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/user/name", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });
      if (res.ok) {
        setOpen(false);
        window.location.reload();
      }
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-xl max-w-sm w-full p-6">
        <h2 className="text-lg font-semibold text-zinc-900 mb-2">
          What should we call you?
        </h2>
        <p className="text-sm text-zinc-500 mb-4">
          Enter your name so friends can recognize you in groups.
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none mb-4"
            required
            autoFocus
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-primary-500 text-white font-semibold hover:bg-primary-600 disabled:opacity-50 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            {loading ? "Saving…" : "Save"}
          </button>
        </form>
      </div>
    </div>
  );
}
