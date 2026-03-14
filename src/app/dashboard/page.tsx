import Link from "next/link";
import { connectDB } from "@/lib/db";
import { Group } from "@/models/Group";
import { getSession } from "@/lib/auth";
import { PageHeader } from "@/components/PageHeader";
import { GroupIcon, ChevronRightIcon } from "@/components/icons/ui-icons";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) return null;

  await connectDB();
  const groups = await Group.find({ memberIds: session.userId })
    .populate("createdBy", "name")
    .populate("memberIds", "name phone")
    .sort({ createdAt: -1 })
    .lean();

  const groupList = groups as unknown as { _id: { toString: () => string }; name: string; memberIds?: unknown[] }[];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Home"
        right={
          <Link href="/dashboard/groups/new" className="text-white font-semibold text-sm hover:opacity-90 transition-all duration-200">
            Create group
          </Link>
        }
      />

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Your groups</h2>
          {groupList.length > 0 && (
            <Link
              href="/dashboard/groups/new"
              className="text-sm font-medium text-primary-600 hover:text-primary-700 transition"
            >
              + New
            </Link>
          )}
        </div>

        {groupList.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden text-center py-10 px-6">
            <div className="w-16 h-16 rounded-2xl bg-primary-100 flex items-center justify-center text-primary-600 mx-auto mb-4">
              <GroupIcon className="w-8 h-8" />
            </div>
            <p className="text-slate-600 font-medium">No groups yet</p>
            <p className="text-slate-500 text-sm mt-1">Create a group to split expenses with friends</p>
            <Link
              href="/dashboard/groups/new"
              className="inline-block mt-5 px-5 py-2.5 rounded-xl bg-primary-500 text-white font-semibold text-sm hover:bg-primary-600 transition-all duration-200"
            >
              Create your first group
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {groupList.map((g) => (
              <Link
                key={g._id.toString()}
                href={`/dashboard/groups/${g._id.toString()}`}
                className="block bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:border-primary-300 active:scale-[0.99]"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center text-primary-600 shrink-0">
                    <GroupIcon className="w-6 h-6" />
                  </div>
                  <ChevronRightIcon className="w-5 h-5 text-slate-400 shrink-0 mt-1" />
                </div>
                <h3 className="font-semibold text-slate-900 mt-3 truncate">{g.name}</h3>
                <p className="text-sm text-slate-500 mt-1">
                  {(g.memberIds?.length ?? 0)} member{(g.memberIds?.length ?? 0) === 1 ? "" : "s"}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
