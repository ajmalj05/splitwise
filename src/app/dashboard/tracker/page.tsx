import Link from "next/link";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Group } from "@/models/Group";
import { Expense } from "@/models/Expense";
import { Settlement } from "@/models/Settlement";
import { computeBalances } from "@/lib/expense-utils";
import { PageHeader } from "@/components/PageHeader";

export default async function TrackerPage() {
  const session = await getSession();
  if (!session) return null;

  await connectDB();

  const groups = await Group.find({ memberIds: session.userId })
    .select("_id name")
    .lean();

  const items = await Promise.all(
    (groups as unknown as { _id: unknown; name: string }[]).map(async (g) => {
      const groupId = (g._id as { toString: () => string }).toString();
      const expenses = await Expense.find({ group: groupId }).lean();
      const normalized = (expenses as unknown as { splitDetails?: Record<string, number>; payments?: { userId: unknown; amount: number }[] }[]).map((e) => ({
        splitDetails: e.splitDetails ?? {},
        payments: (e.payments || []).map((p: { userId: unknown; amount: number }) => ({
          userId: typeof p.userId === "object" && p.userId && "_id" in p.userId
            ? (p.userId as { _id: { toString: () => string } })._id?.toString()
            : String(p.userId),
          amount: p.amount,
        })),
      }));
      const balanceMap = computeBalances(normalized);
      const settlements = await Settlement.find({ group: groupId }).lean();
      for (const s of settlements as unknown as { fromUser: { toString: () => string }; toUser: { toString: () => string }; amount: number }[]) {
        const from = s.fromUser?.toString?.() ?? String(s.fromUser);
        const to = s.toUser?.toString?.() ?? String(s.toUser);
        balanceMap.set(from, (balanceMap.get(from) ?? 0) - s.amount);
        balanceMap.set(to, (balanceMap.get(to) ?? 0) + s.amount);
      }
      const balance = balanceMap.get(session.userId) ?? 0;
      return {
        groupId,
        groupName: g.name,
        balance,
      };
    })
  );

  return (
    <div className="pb-6">
      <PageHeader title="My Tracker" backHref="/dashboard" />
      {items.length === 0 ? (
        <div className="bg-white rounded-2xl border border-zinc-200 p-8 text-center shadow-sm">
          <p className="text-zinc-500">You’re not in any groups yet.</p>
          <Link href="/dashboard" className="inline-block mt-3 text-primary-600 font-medium hover:text-primary-700">
            Go to Home
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item.groupId}>
              <Link
                href={`/dashboard/groups/${item.groupId}`}
                className="block bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-primary-500/30"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-zinc-900">{item.groupName}</span>
                  <span
                    className={`font-semibold tabular-nums ${
                      item.balance > 0
                        ? "text-primary-600"
                        : item.balance < 0
                        ? "text-red-600"
                        : "text-zinc-500"
                    }`}
                  >
                    {item.balance > 0
                      ? `+ ₹${item.balance.toFixed(2)}`
                      : item.balance < 0
                      ? `- ₹${Math.abs(item.balance).toFixed(2)}`
                      : "Settled"}
                  </span>
                </div>
                <p className="text-xs text-zinc-500 mt-1">
                  {item.balance > 0 ? "You are owed" : item.balance < 0 ? "You owe" : "No balance"}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
