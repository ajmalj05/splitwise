"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BackIcon, ChevronRightIcon, CategoryFoodIcon, SettingsIcon } from "./icons/ui-icons";
import { GroupDetailClient } from "./GroupDetailClient";
import { Balances } from "./Balances";
import { SettleUpForm } from "./SettleUpForm";

type Member = { _id: string; name?: string; phone?: string };
type ExpenseItem = {
  _id: string;
  title: string;
  amount: number;
  currency: string;
  createdBy: string;
  createdAt: Date;
  receiptKey: string | null;
  splitDetails: Record<string, number>;
  payments: { userId: string; amount: number }[];
};

const AVATAR_PALETTE = [
  "#7B61FF", "#00C6A2", "#4FB3FF", "#FF914A",
  "#E96C8E", "#FFA756", "#6BCB77", "#F06292",
];

function getInitial(name?: string) {
  return name?.trim()?.[0]?.toUpperCase() ?? "?";
}

export function GroupDetailView({
  groupId,
  groupName,
  members,
  currentUserId,
  expenses,
}: {
  groupId: string;
  groupName: string;
  members: Member[];
  currentUserId: string;
  expenses: ExpenseItem[];
}) {
  const [balances, setBalances] = useState<{ userId: string; user: { name: string }; balance: number }[]>([]);
  const [tab, setTab] = useState<"settle" | "balances" | "totals" | "addMember">("totals");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/groups/${groupId}/balances`)
      .then((r) => r.json())
      .then((d) => { if (!cancelled && d.balances) setBalances(d.balances); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [groupId]);

  const myBalance = balances.find((b) => b.userId === currentUserId)?.balance ?? 0;
  const otherMembers = members.filter((m) => m._id !== currentUserId);

  function groupByMonth(items: ExpenseItem[]) {
    const map = new Map<string, ExpenseItem[]>();
    for (const e of items) {
      const d = new Date(e.createdAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(e);
    }
    return Array.from(map.keys())
      .sort((a, b) => b.localeCompare(a))
      .map((key) => {
        const [y, m] = key.split("-");
        const monthName = new Date(parseInt(y), parseInt(m) - 1).toLocaleString("default", { month: "long", year: "numeric" });
        return { key, monthName, items: map.get(key)! };
      });
  }

  function getExpenseRole(exp: ExpenseItem) {
    const myShare = exp.splitDetails[currentUserId] ?? 0;
    const myPayment = exp.payments.filter((p) => p.userId === currentUserId).reduce((s, p) => s + p.amount, 0);
    const diff = myPayment - myShare;
    if (Math.abs(diff) < 0.01) return null;
    if (diff > 0) return { type: "lent" as const, amount: diff };
    return { type: "borrowed" as const, amount: -diff };
  }

  const byMonth = groupByMonth(expenses);
  const owedBy = myBalance > 0 ? otherMembers[0] : null;
  const balanceText = loading
    ? "Loading…"
    : myBalance > 0
    ? `${owedBy?.name ?? "Someone"} owes you ₹${myBalance.toFixed(2)}`
    : myBalance < 0
    ? `You owe ₹${Math.abs(myBalance).toFixed(2)}`
    : "Settled up ✓";

  const TABS: { key: typeof tab; label: string }[] = [
    { key: "settle", label: "Settle up" },
    { key: "balances", label: "Balances" },
    { key: "totals", label: "Totals" },
    { key: "addMember", label: "Add member" },
  ];

  return (
    <div style={{ background: "#EEF2F7", minHeight: "100vh", paddingBottom: 110, fontFamily: "'Inter', sans-serif", margin: "-24px -16px" }}>
      {/* ── Soft Pastel Header Section ─────────────────── */}
      <div style={{
        background: "linear-gradient(180deg, #FFFFFF 0%, #EEF2F7 100%)",
        padding: "50px 24px 70px 24px",
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 4px 20px rgba(0,0,0,0.02)"
      }}>
        {/* Subtle Waves */}
        <div style={{ position: "absolute", bottom: -2, left: 0, right: 0, height: 100, pointerEvents: "none", opacity: 0.3 }}>
          <svg viewBox="0 0 500 150" preserveAspectRatio="none" style={{ height: "100%", width: "100%" }}>
            <path d="M0.00,49.98 C149.99,150.00 349.20,-49.98 500.00,49.98 L500.00,150.00 L0.00,150.00 Z" style={{ stroke: "none", fill: "#8FB5E8" }}></path>
          </svg>
        </div>
        <div style={{ position: "absolute", bottom: -10, left: 0, right: 0, height: 120, pointerEvents: "none", opacity: 0.2 }}>
          <svg viewBox="0 0 500 150" preserveAspectRatio="none" style={{ height: "100%", width: "100%" }}>
            <path d="M0.00,49.98 C149.99,150.00 271.49,-49.98 500.00,49.98 L500.00,150.00 L0.00,150.00 Z" style={{ stroke: "none", fill: "#AFC6E9" }}></path>
          </svg>
        </div>

        <div style={{ display: "flex", alignItems: "center", position: "relative", zIndex: 1, width: "100%" }}>
          <Link href="/dashboard" style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            width: 44, height: 44, borderRadius: "50%", background: "white",
            boxShadow: "0 8px 20px rgba(0,0,0,0.05)", textDecoration: "none",
            position: "absolute", left: 0, border: "1px solid #EDF2F7"
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6C9BD2" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </Link>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1F2937", margin: "0 auto", letterSpacing: "-0.5px", maxWidth: "60%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{groupName}</h1>
          <Link href={`/dashboard/groups/${groupId}/settings`} style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            width: 44, height: 44, borderRadius: "50%", background: "white",
            boxShadow: "0 8px 20px rgba(0,0,0,0.05)", textDecoration: "none",
            position: "absolute", right: 0, border: "1px solid #EDF2F7"
          }}>
            <SettingsIcon className="w-5 h-5 text-[#64748B]" />
          </Link>
        </div>

        {/* ── Add Expense Option at Top ── */}
        <div style={{ position: "relative", zIndex: 1, width: "100%", display: "flex", justifyContent: "center", marginTop: 28 }}>
          <Link
            href={`/dashboard/groups/${groupId}/expense/new`}
            style={{
              display: "inline-flex", alignItems: "center",
              fontWeight: 800, fontSize: 15,
              color: "white", textDecoration: "none",
              padding: "14px 28px", borderRadius: 999, whiteSpace: "nowrap",
              background: "linear-gradient(90deg, #6C9BD2 0%, #5C87C4 100%)",
              boxShadow: "0 8px 25px rgba(108, 155, 210, 0.4)",
            }}
          >
            + Add expense
          </Link>
        </div>
      </div>
       <div style={{ padding: "0 20px", marginTop: -35, position: "relative", zIndex: 1 }}>
        {/* ── Member avatars row ── */}
        <div style={{ display: "flex", justifyContent: "center", gap: 10, marginBottom: 20 }}>
          {members.slice(0, 5).map((m, i) => (
            <div
              key={m._id}
              style={{
                width: 48, height: 48, borderRadius: "50%",
                background: i === 0 ? "#FFD89B" : i === 1 ? "#BAE6FD" : "#DDD6FE",
                border: "3px solid white",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 8px 15px rgba(0,0,0,0.06)"
              }}
            >
               <span style={{ fontSize: 18, fontWeight: 900, color: "#1F2937", opacity: 0.8 }}>{getInitial(m.name)}</span>
            </div>
          ))}
          {members.length > 5 && (
            <div style={{
              width: 48, height: 48, borderRadius: "50%",
              background: "#FFFFFF", border: "3px solid white",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 8px 15px rgba(0,0,0,0.06)"
            }}>
              <span style={{ fontWeight: 800, fontSize: 14, color: "#6C9BD2" }}>
                +{members.length - 5}
              </span>
            </div>
          )}
        </div>

        {/* ── Balance Card ── */}
        <div
          className="animate-slide-up"
          style={{
            background: "linear-gradient(135deg, #6C9BD2 0%, #5C87C4 100%)",
            borderRadius: 32,
            padding: "24px 28px",
            marginBottom: 24,
            boxShadow: "0 15px 35px rgba(108, 155, 210, 0.2)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <p style={{ fontWeight: 800, fontSize: 11, color: "rgba(255,255,255,0.7)", margin: "0 0 6px 0", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Group Balance
          </p>
          <p style={{ fontWeight: 800, fontSize: 22, color: "white", margin: 0 }}>
            {balanceText}
          </p>
        </div>

        {/* ── Tab buttons row ── */}
        <div
          style={{
            display: "flex", gap: 12, marginBottom: 24,
            overflowX: "auto", overflowY: "hidden", paddingBottom: 6,
            scrollbarWidth: "none",
          }}
        >
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              style={{
                flexShrink: 0,
                fontWeight: 700, fontSize: 14,
                color: tab === key ? "#FFFFFF" : "#64748B", border: "none", cursor: "pointer",
                padding: "12px 22px", borderRadius: 999, whiteSpace: "nowrap",
                background: tab === key ? "#6C7AE0" : "#FFFFFF",
                boxShadow: tab === key ? "0 8px 20px rgba(108, 122, 224, 0.3)" : "0 4px 15px rgba(0,0,0,0.02)",
                transition: "all 0.2s ease",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div style={{ padding: "0 20px" }}>
        {/* ── Tab Content ── */}
        {tab === "settle" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <SettleUpForm
              groupId={groupId}
              members={otherMembers}
              currentUserId={currentUserId}
              onSuccess={() => {
                setTab("balances");
                fetch(`/api/groups/${groupId}/balances`)
                  .then((r) => r.json())
                  .then((d) => d.balances && setBalances(d.balances));
              }}
            />
          </div>
        )}

        {tab === "balances" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Balances groupId={groupId} />
          </div>
        )}

        {tab === "addMember" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <GroupDetailClient
              group={{ _id: groupId, name: groupName, memberIds: members }}
              currentUserId={currentUserId}
            />
          </div>
        )}

        {tab === "totals" && (
          <div>
            {expenses.length === 0 ? (
              <div
                style={{
                  background: "#FFFFFF", borderRadius: 32, padding: "50px 24px",
                  textAlign: "center", border: "1.5px dashed #E2E8F0",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.015)"
                }}
              >
                <p style={{ fontWeight: 800, fontSize: 18, color: "#1F2937", margin: "0 0 8px 0" }}>
                  No expenses yet
                </p>
                <p style={{ fontWeight: 600, fontSize: 14, color: "#6B7280", margin: 0 }}>
                  Tap &quot;+ Add expense&quot; to get started
                </p>
              </div>
            ) : (
              <>
                {byMonth.map(({ key, monthName, items }) => (
                  <div key={key} style={{ marginBottom: 12 }}>
                    {/* Month label */}
                    <div
                      style={{
                        padding: "4px 0", marginBottom: 16, borderBottom: "1.5px solid #EDF2F7"
                      }}
                    >
                      <h3 style={{ fontWeight: 800, fontSize: 12, color: "#6B7280", margin: 0, textTransform: "uppercase", letterSpacing: "0.12em" }}>
                        {monthName}
                      </h3>
                    </div>

                    {/* Expense cards */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      {items.map((exp, idx) => {
                        const role = getExpenseRole(exp);
                        const paidBy = exp.payments.length > 0
                          ? exp.payments.find((p) => p.userId === currentUserId) ? "You"
                          : members.find((m) => m._id === exp.payments[0].userId)?.name ?? "Someone"
                          : exp.createdBy;
                        const paidAmount = exp.payments.reduce((s, p) => s + p.amount, 0);
                        const date = new Date(exp.createdAt);
                        const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
                        
                        // Use a soft color palette for icons
                        const softColors = ["#E0E7FF", "#F0FDF4", "#FFF7ED", "#FDF2F8"];
                        const iconBg = softColors[idx % softColors.length];

                        return (
                          <Link
                            key={exp._id}
                            href={`/dashboard/expenses/${exp._id}`}
                            style={{
                              display: "flex", alignItems: "center", gap: 16,
                              padding: "18px 20px", textDecoration: "none",
                              background: "#FFFFFF", borderRadius: 28,
                              border: "1px solid #EDF2F7",
                              boxShadow: "0 8px 25px rgba(0,0,0,0.015)",
                              transition: "all 0.2s ease",
                            }}
                          >
                            <div style={{
                              width: 52, height: 52, borderRadius: 18,
                              background: iconBg,
                              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                            }}>
                              <CategoryFoodIcon className="w-6 h-6 text-[#6C9BD2]" />
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <p style={{ fontWeight: 800, fontSize: 16, color: "#1F2937", margin: "0 0 4px 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", letterSpacing: "-0.3px" }}>
                                {exp.title}
                              </p>
                              <p style={{ fontWeight: 600, fontSize: 13, color: "#6B7280", margin: 0 }}>
                                {role ? (
                                  <span style={{ color: role.type === "lent" ? "#10B981" : "#EF4444" }}>
                                    {role.type === "lent" ? "You lent" : "You owe"} ₹{role.amount.toFixed(2)}
                                  </span>
                                ) : (
                                  <span>{paidBy} paid ₹{paidAmount.toFixed(2)}</span>
                                )}
                              </p>
                            </div>
                            <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 10 }}>
                               <span style={{ fontSize: 12, fontWeight: 700, color: "#6B7280" }}>{dateStr}</span>
                               <ChevronRightIcon className="w-4 h-4 text-[#64748B]" />
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
      `}} />
    </div>
  );
}
