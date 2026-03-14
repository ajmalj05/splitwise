"use client";

import { useState } from "react";

type Member = { _id: string; name?: string; phone?: string };

export function GroupDetailClient({
  group,
  currentUserId,
}: {
  group: {
    _id: string;
    name: string;
    memberIds: Member[];
  };
  currentUserId: string;
}) {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState<Member[]>(group.memberIds);

  async function handleAddMember(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await fetch(`/api/groups/${group._id}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone.replace(/\D/g, "") || phone }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to add member");
        return;
      }
      setMembers(data.group.memberIds);
      setPhone("");
      setSuccess("Member added.");
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mb-8">
      <h1 className="text-xl font-semibold text-zinc-900 mb-4">{group.name}</h1>
      <div className="bg-white rounded-xl border border-zinc-200 p-4 mb-4 shadow-sm">
        <h2 className="text-sm font-medium text-zinc-700 mb-3">Members</h2>
        <ul className="space-y-2 mb-4">
          {members.map((m) => (
            <li key={m._id} className="text-sm text-zinc-600">
              {m.name || "No name"} {m._id === currentUserId && <span className="text-primary-600 font-medium">(you)</span>} · {m.phone}
            </li>
          ))}
        </ul>
        <form onSubmit={handleAddMember} className="flex flex-wrap items-end gap-2">
          <div className="flex-1 min-w-[140px]">
            <label htmlFor="member-phone" className="sr-only">Phone</label>
            <input
              id="member-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone number to add"
              className="w-full px-3 py-2.5 rounded-lg bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder-zinc-400 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-3 py-2.5 rounded-lg bg-zinc-100 text-zinc-700 text-sm font-medium hover:bg-zinc-200 disabled:opacity-50 transition"
          >
            {loading ? "Adding…" : "Add member"}
          </button>
        </form>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        {success && <p className="mt-2 text-sm text-primary-600">{success}</p>}
      </div>
    </div>
  );
}
