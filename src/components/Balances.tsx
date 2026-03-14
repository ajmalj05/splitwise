"use client";

import { useState, useEffect } from "react";

type Balance = {
  userId: string;
  user: { _id: string; name: string; phone: string };
  balance: number;
};

export function Balances({ groupId }: { groupId: string }) {
  const [balances, setBalances] = useState<Balance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/groups/${groupId}/balances`);
        const data = await res.json();
        if (!cancelled && res.ok) setBalances(data.balances ?? []);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [groupId]);

  if (loading) return <p className="text-sm text-zinc-500">Loading balances…</p>;
  if (balances.length === 0) return null;

  const debtors = balances.filter((b) => b.balance < -0.01);
  const creditors = balances.filter((b) => b.balance > 0.01);
  if (debtors.length === 0 && creditors.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 mb-6 shadow-sm transition-shadow duration-200 hover:shadow-md">
        <h2 className="text-sm font-medium text-zinc-700 mb-2">Balances</h2>
        <p className="text-sm text-zinc-500">Everyone is settled up.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 mb-6 shadow-sm transition-shadow duration-200 hover:shadow-md">
      <h2 className="text-sm font-medium text-zinc-700 mb-3">Balances</h2>
      <ul className="space-y-2 text-sm">
        {debtors.map((d) => (
          <li key={d.userId} className="text-zinc-700">
            <span className="font-medium text-zinc-900">{d.user.name}</span> owes{" "}
            <span className="text-red-600 font-medium">₹{Math.abs(d.balance).toFixed(2)}</span>
          </li>
        ))}
        {creditors.map((c) => (
          <li key={c.userId} className="text-zinc-700">
            <span className="font-medium text-zinc-900">{c.user.name}</span> is owed{" "}
            <span className="text-primary-600 font-medium">₹{c.balance.toFixed(2)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
