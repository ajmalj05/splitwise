import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { Group } from "@/models/Group";
import DashboardClient from "@/components/DashboardClient";

/* ── Dashboard Page ────────────────────────────────── */
export default async function DashboardPage() {
  const session = await getSession();
  if (!session) return null;

  // Fetch real user
  const user = await User.findById(session.userId).lean() as { name?: string; phone: string } | null;
  const userName = user?.name || user?.phone || "User";

  // Fetch real groups
  const groupsRaw = await Group.find({ memberIds: session.userId })
    .sort({ createdAt: -1 })
    .lean();

  const groups = (groupsRaw as any[]).map(g => ({
    _id: g._id.toString(),
    name: g.name,
    memberCount: g.memberIds?.length || 0
  }));

  // Fetch real friends
  const userFull = await User.findById(session.userId)
    .populate("friends", "name phone")
    .lean();
  
  const friends = ((userFull as any)?.friends || []).map((f: any) => ({
    _id: f._id.toString(),
    name: f.name || f.phone,
    color: ["#FFD89B", "#BAE6FD", "#DDD6FE", "#FED7AA", "#E9D5FF"][Math.floor(Math.random() * 5)]
  }));

  // Fetch real shared bills (where I owe someone)
  // Logic: I am in splitDetails, but I am not the one who created it
  const { Expense } = await import("@/models/Expense");
  const sharedBillsRaw = await Expense.find({
    [`splitDetails.${session.userId}`]: { $exists: true },
    createdBy: { $ne: session.userId }
  })
  .populate("createdBy", "name phone")
  .populate("group", "name")
  .limit(5)
  .sort({ createdAt: -1 })
  .lean();

  const initialSharedBills = (sharedBillsRaw as any[]).map(b => ({
    id: b._id.toString(),
    friendName: b.createdBy?.name || b.createdBy?.phone || "Someone",
    amount: `₹${b.splitDetails[session.userId]}`,
    groupName: b.group?.name || "Group",
    color: ["#BAE6FD", "#FFD89B", "#DDD6FE"][Math.floor(Math.random() * 3)]
  }));

  const friendCount = friends.length;

  return (
    <DashboardClient 
      userName={userName}
      groups={groups}
      friends={friends}
      initialSharedBills={initialSharedBills}
      stats={{
        groups: groups.length,
        friends: friendCount
      }}
    />
  );
}
