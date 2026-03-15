"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Group {
  _id: string;
  name: string;
  memberCount: number;
}

interface Friend {
  name: string;
  color: string;
}

interface SharedBill {
  id: string;
  friendName: string;
  amount: string;
  groupName: string;
  color: string;
}

interface DashboardClientProps {
  userName: string;
  groups: Group[];
  friends: Friend[];
  initialSharedBills: SharedBill[];
  stats: {
    groups: number;
    friends: number;
  };
}

export default function DashboardClient({ userName, groups, friends, initialSharedBills, stats }: DashboardClientProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [sharedBills, setSharedBills] = useState(initialSharedBills);

  const filteredFriends = friends.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAction = (id: string, action: 'accept' | 'reject') => {
    setSharedBills(prev => prev.filter(b => b.id !== id));
    console.log(`${action}ed bill ${id}`);
  };

  return (
    <div style={{ background: "#EEF2F7", minHeight: "100vh", padding: "20px 0 120px 0", fontFamily: "'Inter', sans-serif" }}>
      
      {/* ── Header Section ─────────────────────────── */}
      <div style={{ padding: "0 20px", marginBottom: 30 }}>
        <div style={{
          background: "linear-gradient(135deg, #8FB5E8 0%, #6C9BD2 100%)",
          borderRadius: 32, padding: "24px 28px", display: "flex", justifyContent: "space-between", alignItems: "center",
          boxShadow: "0 15px 35px rgba(108, 155, 210, 0.2)", position: "relative", overflow: "hidden"
        }}>
          {/* Abstract Shapes for Glassmorphism feel */}
          <div style={{ position: "absolute", top: -30, right: -20, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.15)", filter: "blur(20px)" }} />
          
          <div style={{ position: "relative", zIndex: 1 }}>
            <p style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "white", opacity: 0.9 }}>Good Morning 👋</p>
            <h1 style={{ margin: "4px 0 8px 0", fontSize: 28, fontWeight: 900, color: "white" }}>{userName}</h1>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "white", opacity: 0.8 }}>
              {stats.groups} Groups • {stats.friends} Friends
            </p>
          </div>
          <div style={{ 
            width: 54, height: 54, borderRadius: "50%", background: "rgba(255,255,255,0.25)", 
            backdropFilter: "blur(10px)", border: "2px solid rgba(255,255,255,0.4)",
            display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 1
          }}>
             <span style={{ fontSize: 22, fontWeight: 800, color: "white" }}>{userName[0].toUpperCase()}</span>
          </div>
        </div>
      </div>

      {/* ── Group Cards Section ────────────────────── */}
      <div style={{ overflowX: "auto", display: "flex", gap: 16, padding: "0 24px", marginBottom: 32 }} className="no-scrollbar">
        
        {/* Card 1: Add Group */}
        <Link href="/dashboard/groups/new" style={{ textDecoration: "none" }}>
          <div style={{
            width: 120, height: 210, borderRadius: 28,
            background: "linear-gradient(180deg, #6C9BD2 0%, #5C87C4 100%)",
            padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between", flexShrink: 0,
            boxShadow: "0 12px 30px rgba(108, 155, 210, 0.2)", position: "relative"
          }}>
            <div style={{ 
              transform: "rotate(-90deg) translateX(-65px)", transformOrigin: "left center",
              color: "white", fontSize: 20, fontWeight: 800, whiteSpace: "nowrap", opacity: 0.95 
            }}>
              Add Group
            </div>
            <div style={{ 
              width: 48, height: 48, borderRadius: "50%", background: "white",
              display: "flex", alignItems: "center", justifyContent: "center", alignSelf: "center",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6C9BD2" strokeWidth="4" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            </div>
          </div>
        </Link>

        {/* Dynamic Group Cards */}
        {groups.map((group, idx) => (
          <Link key={group._id} href={`/dashboard/groups/${group._id}`} style={{ textDecoration: "none" }}>
            <div style={{
              width: 210, height: 210, borderRadius: 28, 
              background: "#AFC6E9",
              padding: "24px", flexShrink: 0, display: "flex", flexDirection: "column", justifyContent: "space-between",
              boxShadow: "0 12px 30px rgba(108, 155, 210, 0.1)", position: "relative", overflow: "hidden"
            }}>
              <div style={{ position: "absolute", top: -20, right: -20, width: 90, height: 90, borderRadius: "50%", background: "rgba(255,255,255,0.25)", filter: "blur(5px)" }} />
              
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ width: 36, height: 36, background: "rgba(255,255,255,0.5)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1F2937" strokeWidth="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                </div>
                <div style={{ cursor: "pointer" }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1F2937" strokeWidth="2.5"><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/><circle cx="5" cy="12" r="1.5"/></svg>
                </div>
              </div>
              <div>
                <p style={{ margin: 0, fontSize: 13, color: "#1F2937", opacity: 0.6, fontWeight: 700 }}>Created Group</p>
                <h2 style={{ margin: "4px 0 6px 0", fontSize: 24, color: "#1F2937", fontWeight: 900, letterSpacing: "-0.02em" }}>{group.name}</h2>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#6B7280" }}>Members: {group.memberCount}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* ── Recent Friends Section ──────────────────── */}
      <div style={{ padding: "0 24px", marginBottom: 35 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: "#1F2937", margin: 0 }}>Recent Friends</h3>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        </div>

        {/* Modern Search Bar */}
        <div style={{ position: "relative", marginBottom: 28 }}>
          <input 
            type="text" 
            placeholder="Search friends..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%", padding: "18px 20px 18px 52px", borderRadius: 24, background: "white",
              border: "1px solid #E2E8F0", fontSize: 15, fontWeight: 600, color: "#1F2937",
              boxShadow: "0 10px 25px rgba(0,0,0,0.02)", outline: "none"
            }}
          />
          <div style={{ position: "absolute", left: 20, top: "50%", transform: "translateY(-50%)" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </div>
        </div>

        {/* Avatars Row */}
        <div style={{ display: "flex", gap: 24, overflowX: "auto", paddingBottom: 10 }} className="no-scrollbar">
          {filteredFriends.map((friend, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, flexShrink: 0 }}>
              <div style={{ 
                width: 68, height: 68, borderRadius: "50%", background: `linear-gradient(135deg, ${friend.color} 0%, #FFFFFF 100%)`, 
                display: "flex", alignItems: "center", justifyContent: "center", border: "3px solid white", boxShadow: "0 8px 20px rgba(0,0,0,0.05)" 
              }}>
                 <svg width="32" height="32" viewBox="0 0 24 24" fill="#A0AEC0" opacity="0.6"><circle cx="12" cy="8" r="4"/><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/></svg>
              </div>
              <span style={{ fontSize: 14, fontWeight: 700, color: "#1F2937" }}>{friend.name}</span>
            </div>
          ))}
        </div>

        {/* Action Buttons Duo */}
        <div style={{ display: "flex", gap: 14, marginTop: 24 }}>
           <Link href="/dashboard/friends/add" style={{ flex: 1, textDecoration: "none" }}>
             <button style={{
               width: "100%", padding: "16px", borderRadius: 20, background: "linear-gradient(90deg, #6C9BD2 0%, #5C87C4 100%)", color: "white",
               fontSize: 14, fontWeight: 800, border: "none", cursor: "pointer", boxShadow: "0 8px 20px rgba(108, 155, 210, 0.2)"
             }}>+ Add Friend</button>
           </Link>
           <Link href="/dashboard/friends" style={{ flex: 1, textDecoration: "none" }}>
             <button style={{
               width: "100%", padding: "16px", borderRadius: 20, background: "#8FB5E815", color: "#6C9BD2",
               fontSize: 14, fontWeight: 800, border: "2px solid #AFC6E9", cursor: "pointer"
             }}>View All</button>
           </Link>
        </div>
      </div>

      {/* ── Bill Request Section ──────────────────── */}
      <div style={{ padding: "0 24px" }}>
        <h3 style={{ fontSize: 20, fontWeight: 800, color: "#1F2937", margin: "0 0 20px 0" }}>Who&apos;s sharing the bill</h3>
        
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {sharedBills.map((bill) => (
            <div key={bill.id} style={{ 
              background: "white", borderRadius: 24, padding: "20px", display: "flex", justifyContent: "space-between", alignItems: "center",
              boxShadow: "0 10px 30px rgba(0,0,0,0.02)", border: "1px solid #EDF2F7"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 52, height: 52, borderRadius: "50%", background: bill.color, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid white", boxShadow: "0 5px 15px rgba(0,0,0,0.05)" }}>
                   <svg width="24" height="24" viewBox="0 0 24 24" fill="white" opacity="0.8"><circle cx="12" cy="8" r="4"/><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/></svg>
                </div>
                <div>
                  <span style={{ display: "block", fontSize: 16, fontWeight: 800, color: "#1F2937" }}>{bill.friendName}</span>
                  <span style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#6B7280" }}>Shared bill: <span style={{ color: "#6C9BD2" }}>{bill.amount}</span> • {bill.groupName}</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button 
                  onClick={() => handleAction(bill.id, 'reject')}
                  style={{ width: 44, height: 44, borderRadius: 14, background: "#FFF5F5", color: "#F56565", display: "flex", alignItems: "center", justifyContent: "center", border: "none", cursor: "pointer" }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
                <button 
                  onClick={() => handleAction(bill.id, 'accept')}
                  style={{ width: 44, height: 44, borderRadius: 14, background: "#F0FFF4", color: "#48BB78", display: "flex", alignItems: "center", justifyContent: "center", border: "none", cursor: "pointer" }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}
