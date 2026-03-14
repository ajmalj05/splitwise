import Link from "next/link";
import { notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Group } from "@/models/Group";
import { AddExpenseForm } from "@/components/AddExpenseForm";
import { PageHeader } from "@/components/PageHeader";
import { HeartIcon } from "@/components/icons/ui-icons";

export default async function NewExpensePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session) return null;

  const { id: groupId } = await params;
  await connectDB();

  const groupRaw = await Group.findById(groupId)
    .populate("memberIds", "name phone")
    .lean();

  const group = Array.isArray(groupRaw) ? null : groupRaw;
  if (!group) notFound();

  const groupDoc = group as unknown as { name: string; memberIds?: unknown[] };
  const groupName = groupDoc.name;
  const memberIds = (groupDoc.memberIds ?? []).map((m: unknown) =>
    typeof m === "object" && m && "_id" in m
      ? {
          _id: (m as { _id: { toString: () => string } })._id?.toString(),
          name: (m as { name?: string }).name ?? "No name",
          phone: (m as { phone?: string }).phone,
        }
      : { _id: String(m), name: "Unknown", phone: "" }
  );
  if (!memberIds.some((m) => m._id === session.userId)) notFound();

  return (
    <div className="pb-6">
      <PageHeader
        title="Add an expense"
        backHref={`/dashboard/groups/${groupId}`}
        right={
          <button type="submit" form="add-expense-form" className="text-white font-semibold text-sm hover:opacity-90 transition">
            Save
          </button>
        }
      />

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 mb-4 animate-slide-up">
        <p className="text-sm text-zinc-500 mb-2">With you and:</p>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 shrink-0">
            <HeartIcon className="w-5 h-5" />
          </div>
          <span className="font-medium text-zinc-900">{groupName}</span>
          <HeartIcon className="w-5 h-5 text-red-500 shrink-0" />
        </div>
      </div>

      <AddExpenseForm groupId={groupId} members={memberIds} groupName={groupName} />
    </div>
  );
}
