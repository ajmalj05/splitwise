import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { BottomNav } from "@/components/BottomNav";
import { NamePopup } from "@/components/NamePopup";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  await connectDB();
  const userRaw = await User.findById(session.userId).lean();
  const user = Array.isArray(userRaw) ? null : (userRaw as { _id: { toString: () => string }; name?: string; phone: string } | null);
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-slate-100 pb-20">
      <main className="max-w-3xl mx-auto px-4 pt-2 pb-6">
        {children}
      </main>
      <BottomNav />
      <NamePopup
        hasName={!!user.name}
        userId={user._id.toString()}
      />
    </div>
  );
}
