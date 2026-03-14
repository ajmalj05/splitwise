"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { TrashIcon, PencilIcon } from "./icons/ui-icons";

export function ExpenseDetailActions({
  expenseId,
  groupId,
}: {
  expenseId: string;
  groupId: string;
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm("Delete this expense? This cannot be undone.")) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/expenses/${expenseId}`, { method: "DELETE" });
      if (res.ok) {
        router.push(`/dashboard/groups/${groupId}`);
        router.refresh();
      } else {
        const d = await res.json();
        alert(d.error ?? "Failed to delete");
      }
    } catch {
      alert("Something went wrong");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={handleDelete}
        disabled={deleting}
        className="p-2 rounded-full text-white/90 hover:bg-white/10 transition-all duration-200 disabled:opacity-50"
        aria-label="Delete"
      >
        <TrashIcon className="w-5 h-5" />
      </button>
      <Link
        href={`/dashboard/groups/${groupId}`}
        className="p-2 rounded-full hover:bg-white/20 text-white transition"
        aria-label="Edit expense (back to group)"
      >
        <PencilIcon className="w-5 h-5" />
      </Link>
    </div>
  );
}
