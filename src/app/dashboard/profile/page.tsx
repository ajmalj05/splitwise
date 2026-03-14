import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { ProfileClient } from "@/components/ProfileClient";
import { PageHeader } from "@/components/PageHeader";

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) return null;

  await connectDB();
  const userRaw = await User.findById(session.userId).lean();
  const user = Array.isArray(userRaw) ? null : (userRaw as { name?: string; phone: string } | null);
  if (!user) return null;

  return (
    <div className="pb-6">
      <PageHeader title="Profile" backHref="/dashboard" />
      <ProfileClient
        name={user.name ?? ""}
        phone={user.phone}
      />
    </div>
  );
}
