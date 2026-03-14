import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Group } from "@/models/Group";
import { User } from "@/models/User";
import mongoose from "mongoose";

const bodySchema = z.object({
  phone: z.string().min(10).max(15),
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
    const { phone } = bodySchema.parse(body);
    const normalizedPhone = phone.replace(/\D/g, "");

    await connectDB();

    const group = await Group.findById(groupId);
    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    const memberIds = group.memberIds.map((o: mongoose.Types.ObjectId) => o.toString());
    if (!memberIds.includes(session.userId)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const user = await User.findOne({ phone: normalizedPhone });
    if (!user) {
      return NextResponse.json(
        { error: "This number is not registered" },
        { status: 404 }
      );
    }

    const userIdStr = user._id.toString();
    if (memberIds.includes(userIdStr)) {
      return NextResponse.json(
        { error: "Member already in group" },
        { status: 400 }
      );
    }

    group.memberIds.push(user._id as mongoose.Types.ObjectId);
    await group.save();

    const updated = await Group.findById(groupId)
      .populate("createdBy", "name phone")
      .populate("memberIds", "name phone")
      .lean();

    const g = updated ?? group;
    return NextResponse.json({
      group: {
        _id: g._id.toString(),
        name: g.name,
        createdBy: g.createdBy && typeof g.createdBy === "object"
          ? { _id: (g.createdBy as { _id: unknown })._id?.toString(), name: (g.createdBy as { name?: string }).name, phone: (g.createdBy as { phone?: string }).phone }
          : g.createdBy,
        memberIds: (g.memberIds || []).map((m: unknown) =>
          typeof m === "object" && m && "_id" in m
            ? { _id: (m as { _id: unknown })._id?.toString(), name: (m as { name?: string }).name, phone: (m as { phone?: string }).phone }
            : m
        ),
        createdAt: g.createdAt,
      },
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid phone number" },
        { status: 400 }
      );
    }
    console.error(err);
    return NextResponse.json(
      { error: "Failed to add member" },
      { status: 500 }
    );
  }
}
