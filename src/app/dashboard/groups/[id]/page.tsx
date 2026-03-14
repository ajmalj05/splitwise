import { notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Group } from "@/models/Group";
import { Expense } from "@/models/Expense";
import { GroupDetailView } from "@/components/GroupDetailView";

export default async function GroupPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session) return null;

  const { id } = await params;
  await connectDB();

  const groupRaw = await Group.findById(id)
    .populate("createdBy", "name phone")
    .populate("memberIds", "name phone")
    .lean();

  const group = Array.isArray(groupRaw) ? null : groupRaw;
  if (!group) notFound();

  const groupDoc = group as unknown as { memberIds?: unknown[]; _id: unknown; name: string; createdBy?: unknown; createdAt: Date };
  const memberIds = (groupDoc.memberIds ?? []).map((m: unknown) =>
    typeof m === "object" && m && "_id" in m ? (m as { _id: { toString: () => string } })._id?.toString() : String(m)
  );
  if (!memberIds.includes(session.userId)) notFound();

  const expenses = await Expense.find({ group: id })
    .populate("createdBy", "name")
    .populate("payments.userId", "name")
    .sort({ createdAt: -1 })
    .lean();

  const groupData = {
    _id: (groupDoc._id as { toString: () => string }).toString(),
    name: groupDoc.name,
    memberIds: (groupDoc.memberIds || []).map((m: unknown) =>
      typeof m === "object" && m && "_id" in m
        ? { _id: (m as { _id: unknown })._id?.toString() ?? "", name: (m as { name?: string }).name ?? "No name", phone: (m as { phone?: string }).phone ?? "" }
        : { _id: String(m), name: "Unknown", phone: "" }
    ),
  };

  type Exp = { _id: unknown; title: string; amount: number; currency: string; splitType: string; splitDetails?: Record<string, number>; payments?: { userId: unknown; amount: number }[]; receiptKey?: string; createdBy?: unknown; createdAt: Date };
  const expenseList = (expenses as unknown as Exp[]).map((e) => ({
    _id: (e._id as { toString: () => string }).toString(),
    title: e.title,
    amount: e.amount,
    currency: e.currency,
    splitType: e.splitType,
    splitDetails: e.splitDetails ?? {},
    payments: (e.payments || []).map((p: { userId: unknown; amount: number }) => ({
      userId: typeof p.userId === "object" && p.userId && "_id" in p.userId
        ? (p.userId as { _id: { toString: () => string } })._id?.toString()
        : String(p.userId),
      amount: p.amount,
    })),
    receiptKey: e.receiptKey ?? null,
    createdBy: (e.createdBy && typeof e.createdBy === "object" && "name" in e.createdBy
      ? (e.createdBy as { name?: string }).name
      : "Unknown") ?? "Unknown",
    createdAt: e.createdAt,
  }));

  return (
    <GroupDetailView
      groupId={groupData._id}
      groupName={groupData.name}
      members={groupData.memberIds}
      currentUserId={session.userId}
      expenses={expenseList}
    />
  );
}
