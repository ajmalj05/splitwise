import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Group } from "@/models/Group";
import { User } from "@/models/User";

const createSchema = z.object({
  name: z.string().min(1).max(100).trim(),
});

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const groups = await Group.find({
      memberIds: session.userId,
    })
      .populate("createdBy", "name phone")
      .populate("memberIds", "name phone")
      .sort({ createdAt: -1 })
      .lean();

    type G = { _id: unknown; name: string; createdBy?: unknown; memberIds?: unknown[]; createdAt: Date };
    const list = (groups as unknown as G[]).map((g) => ({
      _id: (g._id as { toString: () => string }).toString(),
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
    }));

    return NextResponse.json({ groups: list });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to list groups" },
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
    const { name } = createSchema.parse(body);

    await connectDB();
    const group = await Group.create({
      name,
      createdBy: session.userId,
      memberIds: [session.userId],
    });

    const populated = await Group.findById(group._id)
      .populate("createdBy", "name phone")
      .populate("memberIds", "name phone")
      .lean();

    const g = populated ?? group;
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
        { error: "Invalid input" },
        { status: 400 }
      );
    }
    console.error(err);
    return NextResponse.json(
      { error: "Failed to create group" },
      { status: 500 }
    );
  }
}
