import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Group } from "@/models/Group";
import { Settlement } from "@/models/Settlement";

const bodySchema = z.object({
  otherUserId: z.string(),
  amount: z.number().positive(),
  youPaidThem: z.boolean(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: groupId } = await params;
    const body = await request.json();
    const { otherUserId, amount, youPaidThem } = bodySchema.parse(body);

    await connectDB();

    const groupRaw = await Group.findById(groupId).lean();
    const group = Array.isArray(groupRaw) ? null : (groupRaw as { memberIds?: unknown[] } | null);
    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    const memberIds = (group.memberIds ?? []).map((m: unknown) =>
      typeof m === "object" && m && "_id" in m ? (m as { _id: { toString: () => string } })._id?.toString() : String(m)
    );
    if (!memberIds.includes(session.userId) || !memberIds.includes(otherUserId)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (otherUserId === session.userId) {
      return NextResponse.json({ error: "Cannot settle with yourself" }, { status: 400 });
    }

    const fromUser = youPaidThem ? session.userId : otherUserId;
    const toUser = youPaidThem ? otherUserId : session.userId;

    await Settlement.create({
      group: groupId,
      fromUser,
      toUser,
      amount,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: err.errors.map((e) => e.message).join(", ") },
        { status: 400 }
      );
    }
    console.error(err);
    return NextResponse.json(
      { error: "Failed to record settlement" },
      { status: 500 }
    );
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

    const { id: groupId } = await params;
    await connectDB();

    const groupRaw = await Group.findById(groupId).lean();
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

    const list = await Settlement.find({ group: groupId })
      .populate("fromUser", "name")
      .populate("toUser", "name")
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    const settlements = (list as unknown as { _id: unknown; fromUser: unknown; toUser: unknown; amount: number; createdAt: Date }[]).map((s) => ({
      _id: (s._id as { toString: () => string }).toString(),
      fromUserId: typeof s.fromUser === "object" && s.fromUser && "_id" in s.fromUser
        ? (s.fromUser as { _id: { toString: () => string } })._id?.toString()
        : String(s.fromUser),
      fromUserName: typeof s.fromUser === "object" && s.fromUser && "name" in s.fromUser
        ? (s.fromUser as { name?: string }).name
        : "Unknown",
      toUserId: typeof s.toUser === "object" && s.toUser && "_id" in s.toUser
        ? (s.toUser as { _id: { toString: () => string } })._id?.toString()
        : String(s.toUser),
      toUserName: typeof s.toUser === "object" && s.toUser && "name" in s.toUser
        ? (s.toUser as { name?: string }).name
        : "Unknown",
      amount: s.amount,
      createdAt: s.createdAt,
    }));

    return NextResponse.json({ settlements });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to list settlements" },
      { status: 500 }
    );
  }
}
