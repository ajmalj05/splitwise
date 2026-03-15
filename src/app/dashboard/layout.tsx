import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import BottomNav from "@/components/BottomNav";
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
  const user = Array.isArray(userRaw)
    ? null
    : (userRaw as { _id: { toString: () => string }; name?: string; phone: string } | null);
  if (!user) {
    redirect("/login");
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#EEF2F7",
        paddingBottom: 110,
      }}
    >
      <main
        style={{
          maxWidth: 480,
          margin: "0 auto",
          padding: "0 16px 24px 16px",
        }}
      >
        {children}
      </main>
      <BottomNav />
      <NamePopup hasName={!!user.name} userId={user._id.toString()} />
    </div>
  );
}
