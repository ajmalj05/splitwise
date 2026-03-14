"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BackIcon, ChevronRightIcon, CategoryFoodIcon, SettingsIcon } from "./icons/ui-icons";
import { GroupDetailClient } from "./GroupDetailClient";
import { Balances } from "./Balances";
import { SettleUpForm } from "./SettleUpForm";

type Member = { _id: string; name?: string; phone?: string };
type ExpenseItem = {
  _id: string;
  title: string;
  amount: number;
  currency: string;
  createdBy: string;
  createdAt: Date;
  receiptKey: string | null;
  splitDetails: Record<string, number>;
  payments: { userId: string; amount: number }[];
};

export function GroupDetailView({
  groupId,
  groupName,
  members,
  currentUserId,
  expenses,
}: {
  groupId: string;
  groupName: string;
  members: Member[];
  currentUserId: string;
  expenses: ExpenseItem[];
}) {
  const [balances, setBalances] = useState<{ userId: string; user: { name: string }; balance: number }[]>([]);
  const [tab, setTab] = useState<"settle" | "balances" | "totals" | "addMember">("totals");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/groups/${groupId}/balances`)
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled && d.balances) setBalances(d.balances);
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [groupId]);

  const myBalance = balances.find((b) => b.userId === currentUserId)?.balance ?? 0;
  const otherMembers = members.filter((m) => m._id !== currentUserId);

  function groupByMonth(items: ExpenseItem[]) {
    const map = new Map<string, ExpenseItem[]>();
    for (const e of items) {
      const d = new Date(e.createdAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(e);
    }
    const keys = Array.from(map.keys()).sort((a, b) => b.localeCompare(a));
    return keys.map((key) => {
      const [y, m] = key.split("-");
      const monthName = new Date(parseInt(y), parseInt(m) - 1).toLocaleString("default", { month: "long", year: "numeric" });
      return { key, monthName, items: map.get(key)! };
    });
  }

  function getExpenseRole(exp: ExpenseItem): { type: "lent" | "borrowed"; amount: number } | null {
    const myShare = exp.splitDetails[currentUserId] ?? 0;
    const myPayment = exp.payments.filter((p) => p.userId === currentUserId).reduce((s, p) => s + p.amount, 0);
    const diff = myPayment - myShare;
    if (Math.abs(diff) < 0.01) return null;
    if (diff > 0) return { type: "lent", amount: diff };
    return { type: "borrowed", amount: -diff };
  }

  const byMonth = groupByMonth(expenses);

  const owedBy = myBalance > 0 ? otherMembers[0] : null;
  const balanceText = loading
    ? "Loading…"
    : myBalance > 0
    ? `${owedBy?.name ?? "Someone"} owes you`
    : myBalance < 0
    ? `You owe ₹${Math.abs(myBalance).toFixed(2)}`
    : "Settled up";

  return (
    <div className="pb-6">
      {/* Same header as all pages - dark slate */}
      <header className="bg-slate-800 rounded-b-2xl -mx-4 px-4 pt-4 pb-5 mb-4 shadow-lg animate-fade-in">
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="p-2 -ml-2 rounded-full text-white/90 hover:bg-white/10 text-white transition-all duration-200">
            <BackIcon className="w-6 h-6" />
          </Link>
          <h1 className="text-lg font-semibold text-white tracking-tight">{groupName}</h1>
          <Link href={`/dashboard/groups/${groupId}/settings`} className="p-2 rounded-full text-white/90 hover:bg-white/10 transition-all duration-200" aria-label="Settings">
            <SettingsIcon className="w-6 h-6" />
          </Link>
        </div>
      </header>
      {/* Balance below header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm px-4 py-3 mb-4 animate-slide-up transition-all duration-200 hover:shadow-md">
        <p className="text-sm text-zinc-600">
          {balanceText}
          {myBalance > 0 && <span className="text-emerald-600 font-semibold"> ₹{myBalance.toFixed(2)}</span>}
        </p>
      </div>

      {/* Scrollable row of buttons: Settle up, Balances, Totals, Add expense, Add member */}
      <div className="flex gap-2 mb-4 overflow-x-auto overflow-y-hidden pb-1 -mx-4 px-4 scroll-smooth">
        <button
          type="button"
          onClick={() => setTab("settle")}
          className={`flex-shrink-0 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all duration-200 bg-white border whitespace-nowrap ${
            tab === "settle"
              ? "border-slate-300 shadow-md text-slate-900"
              : "border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
          }`}
        >
          Settle up
        </button>
        <button
          type="button"
          onClick={() => setTab("balances")}
          className={`flex-shrink-0 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all duration-200 bg-white border whitespace-nowrap ${
            tab === "balances"
              ? "border-slate-300 shadow-md text-slate-900"
              : "border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
          }`}
        >
          Balances
        </button>
        <button
          type="button"
          onClick={() => setTab("totals")}
          className={`flex-shrink-0 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all duration-200 bg-white border whitespace-nowrap ${
            tab === "totals"
              ? "border-slate-300 shadow-md text-slate-900"
              : "border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
          }`}
        >
          Totals
        </button>
        <Link
          href={`/dashboard/groups/${groupId}/expense/new`}
          className="flex-shrink-0 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all duration-200 bg-primary-500 text-white border border-transparent whitespace-nowrap hover:bg-primary-600 hover:scale-[1.02] active:scale-[0.98]"
        >
          Add expense
        </Link>
        <button
          type="button"
          onClick={() => setTab("addMember")}
          className={`flex-shrink-0 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all duration-200 bg-white border whitespace-nowrap ${
            tab === "addMember"
              ? "border-slate-300 shadow-md text-slate-900"
              : "border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
          }`}
        >
          Add member
        </button>
      </div>

      {tab === "settle" && (
        <div className="space-y-4">
          <SettleUpForm
            groupId={groupId}
            members={otherMembers}
            currentUserId={currentUserId}
            onSuccess={() => {
              setTab("balances");
              fetch(`/api/groups/${groupId}/balances`)
                .then((r) => r.json())
                .then((d) => d.balances && setBalances(d.balances));
            }}
          />
        </div>
      )}

      {tab === "balances" && (
        <div className="space-y-4">
          <Balances groupId={groupId} />
        </div>
      )}

      {tab === "addMember" && (
        <div className="space-y-4">
          <GroupDetailClient
            group={{ _id: groupId, name: groupName, memberIds: members }}
            currentUserId={currentUserId}
          />
        </div>
      )}

      {/* Expense list: show below when Totals is selected */}
      {tab === "totals" && (
        <div className="space-y-0">
          {expenses.length === 0 ? (
            <p className="text-slate-500 text-sm py-4">No expenses yet. Tap &quot;Add expense&quot; to add one.</p>
          ) : (
            <>
              {byMonth.map(({ key, monthName, items }) => (
                <div key={key}>
                  <div className="bg-slate-200/80 px-4 py-2 mb-1">
                    <h3 className="text-sm font-semibold text-slate-700">{monthName}</h3>
                  </div>
                  <ul className="space-y-0">
                    {items.map((exp) => {
                      const role = getExpenseRole(exp);
                      const paidBy = exp.payments.length > 0
                        ? exp.payments.find((p) => p.userId === currentUserId)
                          ? "You"
                          : members.find((m) => m._id === exp.payments[0].userId)?.name ?? "Someone"
                        : exp.createdBy;
                      const paidAmount = exp.payments.reduce((s, p) => s + p.amount, 0);
                      const date = new Date(exp.createdAt);
                      const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
                      return (
                        <li key={exp._id}>
                          <Link
                            href={`/dashboard/expenses/${exp._id}`}
                            className="flex items-center gap-3 bg-white border-b border-slate-100 px-4 py-3 hover:bg-slate-50 transition-colors duration-200"
                          >
                            <div className="w-10 shrink-0 text-xs font-medium text-slate-500 uppercase">
                              {dateStr}
                            </div>
                            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 shrink-0">
                              <CategoryFoodIcon className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-slate-900 truncate">{exp.title}</p>
                              <p className="text-xs text-slate-500">
                                {paidBy} paid ₹{paidAmount.toFixed(2)}
                              </p>
                            </div>
                            <div className="text-right shrink-0 flex items-center gap-1">
                              {role && (
                                <span className={role.type === "lent" ? "text-emerald-600 font-medium text-sm" : "text-red-600 font-medium text-sm"}>
                                  {role.type === "lent" ? "you lent" : "you borrowed"} ₹{role.amount.toFixed(2)}
                                </span>
                              )}
                              <ChevronRightIcon className="w-5 h-5 text-slate-400" />
                            </div>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
