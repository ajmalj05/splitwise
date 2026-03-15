"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarIcon, GroupIcon, CameraIcon, PencilIcon, CurrencyIcon, CategoryFoodIcon } from "./icons/ui-icons";

type Member = { _id: string; name?: string; phone?: string };
type SplitType = "equal" | "unequal" | "percentage";

export function AddExpenseForm({
  groupId,
  members,
  formId = "add-expense-form",
  groupName,
}: {
  groupId: string;
  members: Member[];
  formId?: string;
  groupName?: string;
}) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [currency] = useState("INR");
  const [splitType, setSplitType] = useState<SplitType>("equal");
  const [payments, setPayments] = useState<{ userId: string; amount: string }[]>([
    { userId: members[0]?._id ?? "", amount: "" },
  ]);
  const [splitDetails, setSplitDetails] = useState<Record<string, string>>({});
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const amountNum = parseFloat(amount) || 0;

  function addPayer() {
    setPayments((p) => [...p, { userId: members[0]?._id ?? "", amount: "" }]);
  }

  function removePayer(i: number) {
    setPayments((p) => p.filter((_, idx) => idx !== i));
  }

  function updatePayer(i: number, field: "userId" | "amount", value: string) {
    setPayments((p) => {
      const next = [...p];
      next[i] = { ...next[i], [field]: value };
      return next;
    });
  }

  function updateSplitDetail(userId: string, value: string) {
    setSplitDetails((s) => ({ ...s, [userId]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const amountVal = amountNum;
    if (amountVal <= 0) {
      setError("Amount must be positive.");
      setLoading(false);
      return;
    }

    const paymentList = payments
      .filter((p) => p.userId && p.amount && parseFloat(p.amount) > 0)
      .map((p) => ({ userId: p.userId, amount: parseFloat(p.amount) }));
    const paymentTotal = paymentList.reduce((s, p) => s + p.amount, 0);
    if (Math.abs(paymentTotal - amountVal) > 0.02) {
      setError("Paid-by amounts must sum to the expense amount.");
      setLoading(false);
      return;
    }

    let details: Record<string, number> = {};
    if (splitType === "equal") {
      members.forEach((m) => (details[m._id] = Math.round((amountVal / members.length) * 100) / 100));
      const diff = amountVal - Object.values(details).reduce((a, b) => a + b, 0);
      if (members[0]) details[members[0]._id] = (details[members[0]._id] ?? 0) + diff;
    } else if (splitType === "unequal") {
      for (const m of members) {
        const v = parseFloat(splitDetails[m._id] ?? "0") || 0;
        details[m._id] = Math.round(v * 100) / 100;
      }
      const total = Object.values(details).reduce((a, b) => a + b, 0);
      if (Math.abs(total - amountVal) > 0.02) {
        setError("Split amounts must sum to the expense amount.");
        setLoading(false);
        return;
      }
    } else {
      for (const m of members) {
        const pct = parseFloat(splitDetails[m._id] ?? "0") || 0;
        details[m._id] = Math.round((amountVal * (pct / 100)) * 100) / 100;
      }
      const total = Object.values(details).reduce((a, b) => a + b, 0);
      const pctSum = members.reduce((s, m) => s + (parseFloat(splitDetails[m._id] ?? "0") || 0), 0);
      if (Math.abs(pctSum - 100) > 0.02) {
        setError("Percentages must sum to 100.");
        setLoading(false);
        return;
      }
      const diff = amountVal - total;
      if (members[0] && Math.abs(diff) > 0.01) details[members[0]._id] = (details[members[0]._id] ?? 0) + diff;
    }

    try {
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          groupId,
          title: title.trim(),
          amount: amountVal,
          currency,
          splitType,
          splitDetails: details,
          payments: paymentList,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to create expense");
        setLoading(false);
        return;
      }

      const expenseId = data.expense?._id;
      if (expenseId && receiptFile && receiptFile.size > 0) {
        const formData = new FormData();
        formData.set("file", receiptFile);
        await fetch(`/api/expenses/${expenseId}/receipt`, {
          method: "POST",
          body: formData,
        });
      }

      router.push(`/dashboard/groups/${groupId}`);
      router.refresh();
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const perPerson = members.length > 0 ? amountNum / members.length : 0;

  return (
    <form id={formId} onSubmit={handleSubmit} className="space-y-6 max-w-lg">
      {/* Category/description row - reference: pink square icon + input */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-[#AFC6E9] flex items-center justify-center text-[#1F2937] shrink-0 border border-[#8FB5E8]">
          <CategoryFoodIcon className="w-6 h-6" />
        </div>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Taxi, Dinner"
          className="flex-1 px-4 py-3 border-b-2 border-zinc-200 focus:border-[#6C9BD2] outline-none bg-transparent text-[#1F2937] placeholder-zinc-400 font-medium"
          required
        />
      </div>
      {/* Amount - reference: grey $ box + large input with mint underline */}
      <div className="flex items-center gap-2 border-b-2 border-zinc-200 focus-within:border-[#6C9BD2] transition-colors pb-2">
        <span className="text-zinc-500 font-medium bg-zinc-100 px-3 py-2.5 rounded-lg shrink-0 flex items-center justify-center">
          <CurrencyIcon className="w-5 h-5" />
        </span>
        <input
          type="number"
          step="0.01"
          min="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          className="flex-1 bg-transparent text-[#1F2937] text-xl font-semibold outline-none py-1 placeholder-zinc-400"
          required
        />
      </div>
      {/* Paid by you and split equally - reference pill */}
      <div className="rounded-xl bg-zinc-100 px-4 py-2.5 text-sm text-zinc-600">
        Paid by you and split equally
        {amountNum > 0 && members.length > 0 && (
          <span className="block text-xs text-[#6B7280] mt-0.5">(₹{perPerson.toFixed(2)}/person)</span>
        )}
      </div>

      <div className="flex items-center gap-4 text-sm text-zinc-500 flex-wrap">
        <span className="flex items-center gap-1.5">
          <CalendarIcon className="w-4 h-4 text-blue-500" />
          Today
        </span>
        <span className="flex items-center gap-1.5">
          <GroupIcon className="w-4 h-4 text-amber-500" />
          {groupName ?? "Group"}
        </span>
        <span className="flex items-center gap-1.5">
          <CameraIcon className="w-4 h-4 text-violet-500" />
          Receipt
        </span>
        <span className="flex items-center gap-1.5">
          <PencilIcon className="w-4 h-4 text-[#6C7AE0]" />
          Note
        </span>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-2">Paid by</label>
        <p className="text-xs text-zinc-500 mb-3">Add who paid and how much. Total must equal the expense amount.</p>
        {payments.map((p, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <select
              value={p.userId}
              onChange={(e) => updatePayer(i, "userId", e.target.value)}
              className="flex-1 px-3 py-2.5 rounded-lg bg-white border border-zinc-200 text-[#1F2937] text-sm focus:ring-2 focus:ring-[#6C9BD2] outline-none"
            >
              {members.map((m) => (
                <option key={m._id} value={m._id}>{m.name || m.phone}</option>
              ))}
            </select>
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="Amount"
              value={p.amount}
              onChange={(e) => updatePayer(i, "amount", e.target.value)}
              className="w-28 px-3 py-2.5 rounded-lg bg-white border border-zinc-200 text-[#1F2937] text-sm focus:ring-2 focus:ring-[#6C9BD2] outline-none"
            />
            {payments.length > 1 && (
              <button
                type="button"
                onClick={() => removePayer(i)}
                className="text-zinc-400 hover:text-red-600 transition"
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={addPayer} className="text-sm text-[#6C9BD2] hover:text-[#5C87C4] transition">
          + Add another payer
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-2">Split</label>
        <div className="flex gap-4 mb-4">
          {(["equal", "unequal", "percentage"] as const).map((t) => (
            <label key={t} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="splitType"
                checked={splitType === t}
                onChange={() => setSplitType(t)}
                className="accent-[#6C9BD2]"
              />
              <span className="text-sm text-zinc-700 capitalize">{t}</span>
            </label>
          ))}
        </div>
        {splitType === "unequal" && (
          <div className="space-y-2">
            <p className="text-xs text-zinc-500">Enter amount per person (must sum to {amountNum.toFixed(2)})</p>
            {members.map((m) => (
              <div key={m._id} className="flex items-center gap-2">
                <span className="w-32 text-sm text-zinc-600 truncate">{m.name || m.phone}</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={splitDetails[m._id] ?? ""}
                  onChange={(e) => updateSplitDetail(m._id, e.target.value)}
                  placeholder="0"
                  className="flex-1 px-3 py-2 rounded-lg bg-white border border-zinc-200 text-zinc-900 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                />
              </div>
            ))}
          </div>
        )}
        {splitType === "percentage" && (
          <div className="space-y-2">
            <p className="text-xs text-zinc-500">Enter percentage per person (must sum to 100)</p>
            {members.map((m) => (
              <div key={m._id} className="flex items-center gap-2">
                <span className="w-32 text-sm text-zinc-600 truncate">{m.name || m.phone}</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={splitDetails[m._id] ?? ""}
                  onChange={(e) => updateSplitDetail(m._id, e.target.value)}
                  placeholder="0"
                  className="flex-1 px-3 py-2 rounded-lg bg-white border border-zinc-200 text-zinc-900 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                />
                <span className="text-zinc-500">%</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-2">Receipt (optional)</label>
        <input
          type="file"
          accept="image/*,application/pdf"
          onChange={(e) => setReceiptFile(e.target.files?.[0] ?? null)}
          className="w-full text-sm text-zinc-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border file:border-zinc-300 file:bg-zinc-100 file:text-zinc-700"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="px-5 py-3 rounded-xl bg-[#6C9BD2] text-white font-semibold hover:bg-[#5C87C4] disabled:opacity-50 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
      >
        {loading ? "Saving…" : "Add expense"}
      </button>
    </form>
  );
}
