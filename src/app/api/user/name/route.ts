import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";

const bodySchema = z.object({
  name: z.string().min(1).max(100).trim(),
});

export async function PATCH(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name } = bodySchema.parse(body);

    await connectDB();
    await User.findByIdAndUpdate(session.userId, { name });

    return NextResponse.json({ name });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid name" },
        { status: 400 }
      );
    }
    console.error(err);
    return NextResponse.json(
      { error: "Failed to update name" },
      { status: 500 }
    );
  }
}
