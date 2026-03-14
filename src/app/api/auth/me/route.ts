import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    await connectDB();
    const user = await User.findById(session.userId).lean();
    if (!user || Array.isArray(user)) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const u = user as unknown as { _id: { toString: () => string }; phone: string; name?: string; createdAt: Date };
    return NextResponse.json({
      user: {
        _id: u._id.toString(),
        phone: u.phone,
        name: u.name ?? null,
        createdAt: u.createdAt,
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to get user" },
      { status: 500 }
    );
  }
}
