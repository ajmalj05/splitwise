import { notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Expense } from "@/models/Expense";
import { Group } from "@/models/Group";
import { User } from "@/models/User";
import { CategoryFoodIcon, HomeIcon } from "@/components/icons/ui-icons";
import { PageHeader } from "@/components/PageHeader";
import { ExpenseDetailActions } from "@/components/ExpenseDetailActions";

export default async function ExpenseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session) return null;

  const { id: expenseId } = await params;
  await connectDB();

  const expenseRaw = await Expense.findById(expenseId)
    .populate("createdBy", "name")
    .populate("payments.userId", "name")
    .lean();

  const expense = Array.isArray(expenseRaw) ? null : expenseRaw;
  if (!expense) notFound();

  const expenseDoc = expense as unknown as { group: unknown };
  const group = await Group.findById(expenseDoc.group)
    .populate("memberIds", "name")
    .lean();

  const groupDoc = Array.isArray(group) ? null : (group as { memberIds?: unknown[]; name: string } | null);
  if (!groupDoc) notFound();

  const memberIds = (groupDoc.memberIds ?? []).map((m: unknown) =>
    typeof m === "object" && m && "_id" in m ? (m as { _id: { toString: () => string } })._id?.toString() : String(m)
  );
  if (!memberIds.includes(session.userId)) notFound();

  const users = await User.find({ _id: { $in: memberIds } })
    .select("_id name")
    .lean();
  const userMap = new Map(
    (users as { _id: { toString: () => string }; name?: string }[]).map((u) => [u._id.toString(), u.name ?? "Unknown"])
  );

  const e = expense as unknown as {
    _id: unknown;
    group: unknown;
    title: string;
    amount: number;
    currency: string;
    splitDetails: Record<string, number>;
    payments: { userId: unknown; amount: number }[];
    receiptKey?: string;
    createdBy: unknown;
    createdAt: Date;
  };
  const groupName = groupDoc.name;
  const payments = (e.payments || []).map((p: { userId: unknown; amount: number }) => ({
    userId: typeof p.userId === "object" && p.userId && "_id" in p.userId
      ? (p.userId as { _id: { toString: () => string } })._id?.toString()
      : String(p.userId),
    userName: typeof p.userId === "object" && p.userId && "name" in p.userId
      ? (p.userId as { name?: string }).name
      : "Unknown",
    amount: p.amount,
  }));
  const createdByName = e.createdBy && typeof e.createdBy === "object" && "name" in e.createdBy
    ? (e.createdBy as { name?: string }).name
    : "Unknown";

  const groupIdStr = (e.group as { toString: () => string }).toString();
  const expenseDate = new Date(e.createdAt);

  return (
    <div className="pb-6">
      <PageHeader
        title="Details"
        backHref={`/dashboard/groups/${groupIdStr}`}
        right={<ExpenseDetailActions expenseId={(e._id as { toString: () => string }).toString()} groupId={groupIdStr} />}
      />

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden animate-slide-up transition-shadow duration-200 hover:shadow-md">
        {/* Expense summary: square icon, title, amount, group tag, receipt thumb (reference) */}
        <div className="p-6 flex items-start gap-4">
          <div className="shrink-0 flex flex-col gap-2">
            <div className="w-14 h-14 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-600 border border-zinc-200">
              <CategoryFoodIcon className="w-7 h-7" />
            </div>
            {e.receiptKey && (
              <a
                href={`/api/expenses/${(e._id as { toString: () => string }).toString()}/receipt`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-14 h-18 rounded border border-zinc-200 overflow-hidden bg-zinc-50"
              >
                <span className="text-[10px] text-zinc-500 p-1 block">Receipt</span>
              </a>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-zinc-900">{e.title}</h2>
            <p className="text-2xl font-bold text-zinc-900 mt-0.5">
              {e.currency} {e.amount.toFixed(2)}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-zinc-200 text-sm text-zinc-600">
                <HomeIcon className="w-4 h-4" />
                {groupName}
              </span>
            </div>
            <p className="text-sm text-zinc-500 mt-3">
              {expenseDate.toLocaleDateString()}
            </p>
            <p className="text-sm text-zinc-500">
              Added by {createdByName} on {new Date(e.createdAt).toLocaleDateString()}
            </p>
            <p className="text-sm text-zinc-500">
              Last updated by {createdByName} on {new Date(e.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Payment & split - payer then who owes (reference) */}
        <div className="border-t border-zinc-200 p-6">
          <h3 className="text-sm font-semibold text-zinc-800 mb-3">Payment & split</h3>
          {payments.map((p) => (
            <div key={p.userId} className="flex items-center gap-3 py-2">
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-semibold text-sm shrink-0">
                {(p.userName ?? "?").slice(0, 1)}
              </div>
              <span className="text-zinc-900 font-medium">
                {p.userName ?? "Someone"} paid {e.currency} {p.amount.toFixed(2)}
              </span>
            </div>
          ))}
          <div className="mt-4 pl-6 border-l-2 border-zinc-200 space-y-3">
            {Object.entries(e.splitDetails || {}).map(([userId, share]) => (
              <div key={userId} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-zinc-200 flex items-center justify-center text-zinc-600 font-medium text-xs shrink-0">
                  {(userMap.get(userId) ?? "?").slice(0, 1)}
                </div>
                <span className="text-zinc-700 text-sm">
                  {userId === session.userId ? "You" : userMap.get(userId)} owe {e.currency} {share.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Spending by category (reference) */}
        <div className="border-t border-zinc-200 p-6">
          <div className="bg-zinc-100 -mx-6 px-6 py-2 mb-3">
            <h3 className="text-sm font-bold text-zinc-800">Spending by category</h3>
          </div>
          <p className="text-sm text-zinc-600 mb-3">{groupName} :: Dining out</p>
          <div className="flex items-end gap-6">
            <div className="flex-1 text-center min-w-0">
              <div className="h-2 bg-zinc-200 rounded-t max-w-[56px] mx-auto w-full" />
              <p className="text-xs text-zinc-500 mt-1">May</p>
              <p className="text-xs font-medium text-zinc-700">₹0.00</p>
            </div>
            <div className="flex-1 text-center min-w-0">
              <div className="bg-primary-200 rounded-t max-w-[56px] mx-auto w-full h-14" />
              <p className="text-xs text-zinc-500 mt-1">June</p>
              <p className="text-xs font-medium text-zinc-700">₹{e.amount.toFixed(2)}</p>
            </div>
            <div className="flex-1 text-center min-w-0">
              <div className="h-2 bg-zinc-200 rounded-t max-w-[56px] mx-auto w-full" />
              <p className="text-xs text-zinc-500 mt-1">July</p>
              <p className="text-xs font-medium text-zinc-700">₹0.00</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
