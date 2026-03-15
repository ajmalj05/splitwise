import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");

    if (!query || query.length < 3) {
      return NextResponse.json({ users: [] });
    }

    await connectDB();
    
    // Search by phone or email (logic assumes 'query' is used for both)
    // Avoid returning the current user in search results
    const users = await User.find({
      $and: [
        { _id: { $ne: session.userId } },
        {
          $or: [
            { phone: { $regex: query, $options: "i" } },
            { name: { $regex: query, $options: "i" } }
          ]
        }
      ]
    })
    .select("_id name phone")
    .limit(10)
    .lean();

    return NextResponse.json({ users });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to search users" }, { status: 500 });
  }
}
