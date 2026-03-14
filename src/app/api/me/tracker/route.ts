import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Group } from "@/models/Group";
import { Expense } from "@/models/Expense";
import { computeBalances } from "@/lib/expense-utils";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const groups = await Group.find({ memberIds: session.userId })
      .select("_id name")
      .lean();

    const result = await Promise.all(
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
        const balance = balanceMap.get(session.userId) ?? 0;
        return {
          groupId,
          groupName: g.name,
          balance,
        };
      })
    );

    return NextResponse.json({ groups: result });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to get tracker" },
      { status: 500 }
    );
  }
}
