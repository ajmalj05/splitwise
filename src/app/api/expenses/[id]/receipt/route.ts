import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Expense } from "@/models/Expense";
import { Group } from "@/models/Group";
import { uploadReceipt, getReceiptStream } from "@/lib/minio";
import { randomUUID } from "crypto";

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

    const expenseRaw = await Expense.findById(expenseId).lean();
    const expense = Array.isArray(expenseRaw) ? null : (expenseRaw as { receiptKey?: string; group?: unknown } | null);
    if (!expense?.receiptKey) {
      return NextResponse.json({ error: "No receipt" }, { status: 404 });
    }

    const groupRaw = await Group.findById(expense.group).lean();
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

    const { stream, contentType } = await getReceiptStream(expense.receiptKey);
    return new NextResponse(stream as unknown as ReadableStream, {
      headers: {
        "Content-Type": contentType ?? "image/jpeg",
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to get receipt" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: expenseId } = await params;
    await connectDB();

    const expense = await Expense.findById(expenseId);
    if (!expense) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    const groupRaw = await Group.findById(expense.group).lean();
    const groupDoc = Array.isArray(groupRaw) ? null : (groupRaw as { memberIds?: unknown[] } | null);
    if (!groupDoc) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }
    const memberIds = (groupDoc.memberIds ?? []).map((m: unknown) =>
      typeof m === "object" && m && "_id" in m ? (m as { _id: { toString: () => string } })._id?.toString() : String(m)
    );
    if (!memberIds.includes(session.userId)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file || !file.size) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf"];
    if (!allowed.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Use image or PDF." },
        { status: 400 }
      );
    }

    const ext = file.name.split(".").pop() ?? "jpg";
    const key = `receipts/${expenseId}/${randomUUID()}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    await uploadReceipt(key, buffer, file.type);

    expense.receiptKey = key;
    await expense.save();

    return NextResponse.json({ receiptKey: key });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to upload receipt" },
      { status: 500 }
    );
  }
}
