import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import mongoose from "mongoose";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(session.userId).populate("friends", "_id name phone").lean();
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const friendsList = (user as any).friends || [];
    return NextResponse.json({ friends: friendsList });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to list friends" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { friendId } = await request.json();
    if (!friendId) {
      return NextResponse.json({ error: "Friend ID required" }, { status: 400 });
    }

    await connectDB();

    // Check if user already exists in friends
    const user = await User.findById(session.userId);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    if (user.friends?.includes(new mongoose.Types.ObjectId(friendId))) {
      return NextResponse.json({ error: "User is already a friend" }, { status: 400 });
    }

    // Add friend (to both sides for simplicity in this bill-sharing app)
    await User.findByIdAndUpdate(session.userId, {
      $addToSet: { friends: friendId }
    });
    
    await User.findByIdAndUpdate(friendId, {
      $addToSet: { friends: session.userId }
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to add friend" }, { status: 500 });
  }
}
