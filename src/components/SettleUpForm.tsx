"use client";

import { useState } from "react";
import { CalendarIcon, GroupIcon, CameraIcon, PencilIcon, ArrowRightIcon } from "./icons/ui-icons";

type Member = { _id: string; name?: string; phone?: string };

export function SettleUpForm({
  groupId,
  members,
  currentUserId,
  onSuccess,
}: {
  groupId: string;
  members: Member[];
  currentUserId: string;
  onSuccess: () => void;
}) {
  const [paidByMe, setPaidByMe] = useState(true);
  const [toUserId, setToUserId] = useState(members[0]?._id ?? "");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) {
      setError("Enter a valid amount");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/groups/${groupId}/settlements`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          otherUserId: toUserId,
          amount: amt,
          youPaidThem: paidByMe,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to save");
        return;
      }
      setAmount("");
      onSuccess();
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (members.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-zinc-200 p-6 text-center text-zinc-500">
        Add at least one member to the group to settle up.
      </div>
    );
  }

  const otherName = members.find((m) => m._id === toUserId)?.name ?? members.find((m) => m._id === toUserId)?.phone ?? "Someone";

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden animate-slide-up transition-shadow duration-200 hover:shadow-md">
      <div className="p-6">
        {/* Two avatars with arrow - reference Settle up screen */}
        <div className="flex justify-center items-center gap-3 mb-2">
          <div className="w-14 h-14 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-sm shrink-0">
            You
          </div>
          <div className="flex items-center text-zinc-400 shrink-0">
            <ArrowRightIcon className="w-6 h-6" />
          </div>
          <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-sm shrink-0">
            {members.find((m) => m._id === toUserId)?.name?.slice(0, 1) ?? "?"}
          </div>
        </div>
        <p className="text-center text-sm text-zinc-500 mb-6">
          {paidByMe ? `You paid ${otherName}` : `${otherName} paid you`}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPaidByMe(true)}
              className={`flex-1 py-2 rounded-xl text-sm font-medium transition ${
                paidByMe ? "bg-primary-500 text-white" : "bg-zinc-100 text-zinc-600"
              }`}
            >
              You paid
            </button>
            <button
              type="button"
              onClick={() => setPaidByMe(false)}
              className={`flex-1 py-2 rounded-xl text-sm font-medium transition ${
                !paidByMe ? "bg-primary-500 text-white" : "bg-zinc-100 text-zinc-600"
              }`}
            >
              They paid you
            </button>
          </div>

          {paidByMe ? (
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Paid to</label>
              <select
                value={toUserId}
                onChange={(e) => setToUserId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 focus:ring-2 focus:ring-teal-500 outline-none"
              >
                {members.map((m) => (
                  <option key={m._id} value={m._id}>{m.name || m.phone}</option>
                ))}
              </select>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Received from</label>
              <select
                value={toUserId}
                onChange={(e) => setToUserId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 focus:ring-2 focus:ring-teal-500 outline-none"
              >
                {members.map((m) => (
                  <option key={m._id} value={m._id}>{m.name || m.phone}</option>
                ))}
              </select>
            </div>
          )}

          {/* Amount with $ and teal underline - reference */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Amount (₹)</label>
            <div className="flex items-center gap-2 border-b-2 border-zinc-200 focus-within:border-teal-500 transition-colors pb-2">
              <span className="text-zinc-500 font-medium bg-zinc-50 px-3 py-2 rounded-lg">₹</span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="flex-1 bg-transparent text-zinc-900 text-xl font-semibold outline-none placeholder-zinc-400 py-1"
                required
              />
            </div>
          </div>

          {/* Icon row: Calendar Today, Group, Camera, Pencil - reference */}
          <div className="flex items-center gap-4 text-sm text-zinc-500 flex-wrap">
            <span className="flex items-center gap-1.5">
              <CalendarIcon className="w-4 h-4 text-blue-500" />
              Today
            </span>
            <span className="flex items-center gap-1.5">
              <GroupIcon className="w-4 h-4 text-amber-500" />
              This group
            </span>
            <span className="flex items-center gap-1.5">
              <CameraIcon className="w-4 h-4 text-violet-500" />
            </span>
            <span className="flex items-center gap-1.5">
              <PencilIcon className="w-4 h-4 text-teal-500" />
            </span>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

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
