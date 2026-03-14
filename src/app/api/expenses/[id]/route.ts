import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Expense } from "@/models/Expense";
import { Group } from "@/models/Group";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: expenseId } = await params;
    await connectDB();

    const expense = await Expense.findById(expenseId).lean();
    if (!expense || Array.isArray(expense)) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    const e = expense as unknown as { group: unknown; createdBy: unknown };
    const groupRaw = await Group.findById(e.group).lean();
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

    await Expense.findByIdAndDelete(expenseId);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to delete expense" }, { status: 500 });
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: expenseId } = await params;
    await connectDB();

    const expenseRaw = await Expense.findById(expenseId)
      .populate("createdBy", "name")
      .populate("payments.userId", "name")
      .lean();

    const expense = Array.isArray(expenseRaw) ? null : expenseRaw;
    if (!expense) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    const expenseDoc = expense as unknown as { group: unknown };
    const groupRaw = await Group.findById(expenseDoc.group)
      .populate("memberIds", "name")
      .lean();

    const group = Array.isArray(groupRaw) ? null : (groupRaw as { memberIds?: unknown[]; name: string } | null);
    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    const memberIds = (group.memberIds ?? []).map((m: unknown) =>
      typeof m === "object" && m && "_id" in m ? (m as { _id: { toString: () => string } })._id?.toString() : String(m)
    );
    if (!memberIds.includes(session.userId)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const e = expense as unknown as {
      _id: unknown;
      group: unknown;
      title: string;
      amount: number;
      currency: string;
      splitType: string;
      splitDetails: Record<string, number>;
      payments: { userId: unknown; amount: number }[];
      receiptKey?: string;
      createdBy: unknown;
      createdAt: Date;
    };

    return NextResponse.json({
      expense: {
        _id: (e._id as { toString: () => string }).toString(),
        groupId: (e.group as { toString: () => string })?.toString(),
        groupName: group.name,
        title: e.title,
        amount: e.amount,
        currency: e.currency,
        splitType: e.splitType,
        splitDetails: e.splitDetails ?? {},
        payments: (e.payments || []).map((p: { userId: unknown; amount: number }) => ({
          userId: typeof p.userId === "object" && p.userId && "_id" in p.userId
            ? (p.userId as { _id: { toString: () => string } })._id?.toString()
            : String(p.userId),
          userName: typeof p.userId === "object" && p.userId && "name" in p.userId
            ? (p.userId as { name?: string }).name
            : "Unknown",
          amount: p.amount,
        })),
        receiptKey: e.receiptKey ?? null,
        createdBy: e.createdBy && typeof e.createdBy === "object" && "name" in e.createdBy
          ? (e.createdBy as { name?: string }).name
          : "Unknown",
        createdAt: e.createdAt,
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to get expense" },
      { status: 500 }
    );
  }
}
