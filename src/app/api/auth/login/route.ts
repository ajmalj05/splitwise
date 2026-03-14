import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { createSession, setSessionCookie } from "@/lib/auth";
import { z } from "zod";

const bodySchema = z.object({
  phone: z.string().min(10).max(15),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone } = bodySchema.parse(body);
    const normalizedPhone = phone.replace(/\D/g, "");

    await connectDB();

    let user = await User.findOne({ phone: normalizedPhone });
    if (!user) {
      user = await User.create({
        phone: normalizedPhone,
      });
    }

    const token = await createSession({
      userId: user._id.toString(),
      phone: user.phone,
    });
    await setSessionCookie(token);

    return NextResponse.json({
      user: {
        _id: user._id.toString(),
        phone: user.phone,
        name: user.name ?? null,
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
      { error: "Login failed" },
      { status: 500 }
    );
  }
}
