import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Expense } from "@/models/Expense";
import { Group } from "@/models/Group";
import { User } from "@/models/User";
import { Settlement } from "@/models/Settlement";
import { computeBalances } from "@/lib/expense-utils";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: groupId } = await params;
    await connectDB();

    const groupRaw = await Group.findById(groupId)
      .populate("memberIds", "name phone")
      .lean();
    const group = Array.isArray(groupRaw) ? null : (groupRaw as { memberIds?: unknown[] } | null);
    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    const memberIds = (group.memberIds ?? []).map((m: unknown) =>
      typeof m === "object" && m && "_id" in m ? (m as { _id: { toString: () => string } })._id?.toString() : String(m)
    );
    if (!memberIds.includes(session.userId)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const expenses = await Expense.find({ group: groupId }).lean();
    const normalized = expenses.map((e) => ({
      splitDetails: e.splitDetails ?? {},
      payments: (e.payments || []).map((p: { userId: unknown; amount: number }) => ({
        userId: typeof p.userId === "object" && p.userId && "_id" in p.userId
          ? (p.userId as { _id: { toString: () => string } })._id?.toString()
          : String(p.userId),
        amount: p.amount,
      })),
    }));

    const expenseBalanceMap = computeBalances(normalized);

    const settlements = await Settlement.find({ group: groupId }).lean();
    for (const s of settlements as unknown as { fromUser: { toString: () => string }; toUser: { toString: () => string }; amount: number }[]) {
      const from = s.fromUser?.toString?.() ?? String(s.fromUser);
      const to = s.toUser?.toString?.() ?? String(s.toUser);
      const amt = s.amount;
      expenseBalanceMap.set(from, (expenseBalanceMap.get(from) ?? 0) - amt);
      expenseBalanceMap.set(to, (expenseBalanceMap.get(to) ?? 0) + amt);
    }

    const userIds = Array.from(new Set([...memberIds, ...Array.from(expenseBalanceMap.keys())]));
    const users = await User.find({ _id: { $in: userIds } })
      .select("_id name phone")
      .lean();

    const userMap = new Map(
      (users as unknown as { _id: { toString: () => string }; name?: string; phone: string }[]).map((u) => [
        u._id.toString(),
        { _id: u._id.toString(), name: u.name ?? "Unknown", phone: u.phone },
      ])
    );

    const balances = userIds.map((userId) => ({
      userId,
      user: userMap.get(userId) ?? { _id: userId, name: "Unknown", phone: "" },
      balance: expenseBalanceMap.get(userId) ?? 0,
    }));

    return NextResponse.json({ balances });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to get balances" },
      { status: 500 }
    );
  }
}
