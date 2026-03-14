import { notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Group } from "@/models/Group";
import { PageHeader } from "@/components/PageHeader";

export default async function GroupSettingsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session) return null;

  const { id } = await params;
  await connectDB();

  const groupRaw = await Group.findById(id).lean();
  const group = Array.isArray(groupRaw) ? null : (groupRaw as { name: string; memberIds?: unknown[] } | null);
  if (!group) notFound();

  const memberIds = (group.memberIds ?? []).map((m: unknown) =>
    typeof m === "object" && m && "_id" in m ? (m as { _id: { toString: () => string } })._id?.toString() : String(m)
  );
  if (!memberIds.includes(session.userId)) notFound();

  return (
    <div className="pb-6">
      <PageHeader title="Group settings" backHref={`/dashboard/groups/${id}`} />
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 animate-slide-up transition-shadow duration-200 hover:shadow-md">
        <p className="text-zinc-600 font-medium">{group.name}</p>
        <p className="text-sm text-zinc-500 mt-1">Group settings and members can be managed from the group page.</p>
      </div>
    </div>
  );
}
