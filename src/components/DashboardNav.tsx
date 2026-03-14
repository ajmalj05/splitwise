"use client";

import Link from "next/link";

export function DashboardNav({
  userName,
  phone,
}: {
  userName: string;
  phone: string;
}) {
  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  }

  return (
    <header className="bg-zinc-900/95 border-b border-zinc-800 sticky top-0 z-10 backdrop-blur-sm">
      <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link
          href="/dashboard"
          className="text-lg font-bold text-primary-500 hover:text-primary-400 transition"
        >
          Naasthamukk
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-sm text-zinc-400 truncate max-w-[140px]" title={phone}>
            {phone}
          </span>
          <button
            type="button"
            onClick={handleLogout}
            className="text-sm text-zinc-400 hover:text-white transition"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
