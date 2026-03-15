import Link from "next/link";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Group } from "@/models/Group";
import { Expense } from "@/models/Expense";
import { Settlement } from "@/models/Settlement";
import { computeBalances } from "@/lib/expense-utils";
import { PageHeader } from "@/components/PageHeader";

export default async function TrackerPage() {
  const session = await getSession();
  if (!session) return null;

  await connectDB();

  const groups = await Group.find({ memberIds: session.userId })
    .select("_id name")
    .lean();

  const items = await Promise.all(
    (groups as unknown as { _id: unknown; name: string }[]).map(async (g) => {
      const groupId = (g._id as { toString: () => string }).toString();
      const expenses = await Expense.find({ group: groupId }).lean();
      const normalized = (expenses as unknown as { splitDetails?: Record<string, number>; payments?: { userId: unknown; amount: number }[] }[]).map((e) => ({
        splitDetails: e.splitDetails ?? {},
        payments: (e.payments || []).map((p: { userId: unknown; amount: number }) => ({
          userId:
            typeof p.userId === "object" && p.userId && "_id" in p.userId
              ? (p.userId as { _id: { toString: () => string } })._id?.toString()
              : String(p.userId),
          amount: p.amount,
        })),
      }));
      const balanceMap = computeBalances(normalized);
      const settlements = await Settlement.find({ group: groupId }).lean();
      for (const s of settlements as unknown as { fromUser: { toString: () => string }; toUser: { toString: () => string }; amount: number }[]) {
        const from = s.fromUser?.toString?.() ?? String(s.fromUser);
        const to = s.toUser?.toString?.() ?? String(s.toUser);
        balanceMap.set(from, (balanceMap.get(from) ?? 0) - s.amount);
        balanceMap.set(to, (balanceMap.get(to) ?? 0) + s.amount);
      }
      const balance = balanceMap.get(session.userId) ?? 0;
      return { groupId, groupName: g.name, balance };
    })
  );

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
        {/* Very Subtle Waves (Lighter) */}
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
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1F2937", margin: "0 auto", letterSpacing: "-0.5px" }}>My Tracker</h1>
        </div>
      </div>

      <div style={{ padding: "0 22px", marginTop: -35 }}>
        {items.length === 0 ? (
          <div style={{ background: "white", borderRadius: 32, padding: "60px 40px", textAlign: "center", boxShadow: "0 10px 40px rgba(0,0,0,0.02)", border: "1px solid #EDF2F7", marginTop: 40 }}>
             <p style={{ fontSize: 18, fontWeight: 800, color: "#1F2937", margin: "0 0 8px 0" }}>No groups yet</p>
             <p style={{ fontSize: 14, color: "#6B7280", margin: "0 0 24px 0" }}>Create a group to start tracking balances.</p>
             <Link href="/dashboard" style={{ display: "inline-block", padding: "14px 32px", borderRadius: 16, background: "linear-gradient(90deg, #8FB5E8 0%, #6C9BD2 100%)", color: "white", textDecoration: "none", fontWeight: 800, boxShadow: "0 8px 20px rgba(108, 155, 210, 0.2)" }}>Go Home</Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {items.map((item, index) => {
              const isSettled = Math.abs(item.balance) < 0.01;
              
              // Soft Pastel Accent Colors (Icon Backgrounds)
               const accentColors = [
                "#6C9BD2", // Primary Blue
                "#AFC6E9", // Light Blue
                "#8FB5E8", // Muted Blue
                "#6C7AE0", // Active Indigo (Muted)
                "#5C87C4", // Deep Blue
              ];
              const accentColor = accentColors[index % accentColors.length];

              return (
                <Link key={item.groupId} href={`/dashboard/groups/${item.groupId}`} style={{ textDecoration: "none" }}>
                  <div style={{
                    background: "white",
                    borderRadius: 28,
                    padding: "20px 22px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.015)",
                    border: "1px solid #EDF2F7",
                    position: "relative",
                    overflow: "hidden"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                      {/* Soft Icon Accent */}
                      <div style={{
                        width: 48, height: 48, borderRadius: 16,
                        background: `${accentColor}15`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: accentColor
                      }}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                      </div>

                      <div>
                        <h4 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: "#1F2937", letterSpacing: "-0.3px" }}>{item.groupName}</h4>
                        <p style={{ margin: "2px 0 0 0", fontSize: 13, fontWeight: 600, color: "#6B7280" }}>
                          Perfectly settled
                        </p>
                      </div>
                    </div>

                    <div style={{ textAlign: "right" }}>
                      <span style={{ fontSize: 16, fontWeight: 800, color: "#34D399", display: "flex", alignItems: "center", gap: 6 }}>
                        Settled <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
      `}} />
    </div>
  );
}
