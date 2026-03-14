import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Expense } from "@/models/Expense";
import { Group } from "@/models/Group";
import { validateAndNormalizeSplit, validatePayments } from "@/lib/expense-utils";
import type { SplitType } from "@/types";
import mongoose from "mongoose";

const paymentSchema = z.object({
  userId: z.string(),
  amount: z.number().nonnegative(),
});

const createSchema = z.object({
  groupId: z.string(),
  title: z.string().min(1).max(200).trim(),
  amount: z.number().positive(),
  currency: z.string().length(3).optional().default("INR"),
  splitType: z.enum(["equal", "unequal", "percentage"]),
  splitDetails: z.record(z.string(), z.number()).optional().default({}),
  payments: z.array(paymentSchema),
});

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const groupId = searchParams.get("groupId");
    if (!groupId) {
      return NextResponse.json({ error: "groupId required" }, { status: 400 });
    }

    await connectDB();
    const groupRaw = await Group.findById(groupId).lean();
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

    const expenses = await Expense.find({ group: groupId })
      .populate("createdBy", "name phone")
      .populate("payments.userId", "name phone")
      .sort({ createdAt: -1 })
      .lean();

    type E = { _id: unknown; group?: unknown; title: string; amount: number; currency: string; splitType: string; splitDetails?: Record<string, number>; payments?: { userId: unknown; amount: number }[]; receiptKey?: string; createdBy?: unknown; createdAt: Date };
    const list = (expenses as unknown as E[]).map((e) => ({
      _id: (e._id as { toString: () => string }).toString(),
      group: e.group != null && typeof (e.group as { toString?: () => string }).toString === "function" ? (e.group as { toString: () => string }).toString() : undefined,
      title: e.title,
      amount: e.amount,
      currency: e.currency,
      splitType: e.splitType,
      splitDetails: e.splitDetails ?? {},
      payments: (e.payments || []).map((p: { userId: unknown; amount: number }) => ({
        userId: typeof p.userId === "object" && p.userId && "_id" in p.userId
          ? (p.userId as { _id: { toString: () => string } })._id?.toString()
          : (p.userId as { toString?: () => string })?.toString?.(),
        amount: p.amount,
      })),
      receiptKey: e.receiptKey ?? null,
      createdBy: e.createdBy && typeof e.createdBy === "object" && "_id" in e.createdBy
        ? { _id: (e.createdBy as { _id: unknown })._id?.toString(), name: (e.createdBy as { name?: string }).name, phone: (e.createdBy as { phone?: string }).phone }
        : (e.createdBy as { toString?: () => string })?.toString?.(),
      createdAt: e.createdAt,
    }));

    return NextResponse.json({ expenses: list });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to list expenses" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const data = createSchema.parse(body);

    await connectDB();
    const groupRaw = await Group.findById(data.groupId).lean();
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

    validatePayments(data.payments, data.amount);

    const splitDetails = validateAndNormalizeSplit(
      data.amount,
      data.splitType as SplitType,
      data.splitDetails,
      memberIds
    );

    const expense = await Expense.create({
      group: data.groupId,
      title: data.title,
      amount: data.amount,
      currency: data.currency,
      splitType: data.splitType,
      splitDetails,
      payments: data.payments.map((p) => ({
        userId: p.userId,
        amount: p.amount,
      })),
      createdBy: session.userId,
    });

    const populated = await Expense.findById(expense._id)
      .populate("createdBy", "name phone")
      .populate("payments.userId", "name phone")
      .lean();

    const e = populated ?? expense;
    const payments = (e.payments || []).map((p: { userId: unknown; amount: number }) => ({
      userId: typeof p.userId === "object" && p.userId && "_id" in p.userId
        ? (p.userId as { _id: { toString: () => string } })._id?.toString()
        : (p.userId as mongoose.Types.ObjectId)?.toString(),
      amount: p.amount,
    }));

    return NextResponse.json({
      expense: {
        _id: e._id.toString(),
        group: e.group?.toString(),
        title: e.title,
        amount: e.amount,
        currency: e.currency,
        splitType: e.splitType,
        splitDetails: e.splitDetails ?? {},
        payments,
        receiptKey: e.receiptKey ?? null,
        createdBy: e.createdBy && typeof e.createdBy === "object" && "_id" in e.createdBy
          ? { _id: (e.createdBy as { _id: unknown })._id?.toString(), name: (e.createdBy as { name?: string }).name, phone: (e.createdBy as { phone?: string }).phone }
          : e.createdBy?.toString(),
        createdAt: e.createdAt,
      },
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: err.errors.map((e) => e.message).join(", ") },
        { status: 400 }
      );
    }
    if (err instanceof Error && (err.message.includes("sum") || err.message.includes("Split") || err.message.includes("Percentages"))) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json(
      { error: "Failed to create expense" },
      { status: 500 }
    );
  }
}
