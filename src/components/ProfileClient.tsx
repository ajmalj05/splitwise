"use client";

import { useRouter } from "next/navigation";

export function ProfileClient({ name, phone }: { name: string; phone: string }) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden animate-slide-up transition-shadow duration-200 hover:shadow-md">
      <div className="p-6 space-y-4">
        <div>
          <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Name</p>
          <p className="text-zinc-900 font-medium mt-1">{name || "Not set"}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Phone</p>
          <p className="text-zinc-900 font-medium mt-1">{phone}</p>
        </div>
      </div>
      <div className="border-t border-zinc-200 p-4">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full py-2.5 rounded-xl border border-zinc-300 text-zinc-700 font-medium hover:bg-zinc-50 transition"
        >
          Log out
        </button>
      </div>
    </div>
  );
}
