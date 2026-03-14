import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Group } from "@/models/Group";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();

    const groupRaw = await Group.findById(id)
      .populate("createdBy", "name phone")
      .populate("memberIds", "name phone")
      .lean();

    const group = Array.isArray(groupRaw) ? null : (groupRaw as { _id: unknown; name: string; createdBy?: unknown; memberIds?: unknown[]; createdAt: Date } | null);
    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    const memberIds = group.memberIds ?? [];
    if (!memberIds.some((m: unknown) => typeof m === "object" && m && (m as { _id?: unknown })._id?.toString() === session.userId)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({
      group: {
        _id: (group._id as { toString: () => string }).toString(),
        name: group.name,
        createdBy: group.createdBy && typeof group.createdBy === "object"
          ? { _id: (group.createdBy as { _id: unknown })._id?.toString(), name: (group.createdBy as { name?: string }).name, phone: (group.createdBy as { phone?: string }).phone }
          : group.createdBy,
        memberIds: (group.memberIds || []).map((m: unknown) =>
          typeof m === "object" && m && "_id" in m
            ? { _id: (m as { _id: unknown })._id?.toString(), name: (m as { name?: string }).name, phone: (m as { phone?: string }).phone }
            : m
        ),
        createdAt: group.createdAt,
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to get group" },
      { status: 500 }
    );
  }
}
