"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";

interface Friend {
  _id: string;
  name: string;
  phone: string;
  color: string;
}

import { useEffect } from "react";

export default function FriendsListPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/friends")
      .then(res => res.json())
      .then(data => {
        if (data.friends) {
          setFriends(data.friends.map((f: any) => ({
            ...f,
            color: ["#FFD89B", "#BAE6FD", "#DDD6FE", "#FED7AA", "#E9D5FF"][Math.floor(Math.random() * 5)]
          })));
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filteredFriends = friends.filter(f => 
    (f.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.phone.includes(searchQuery)
  );

  const removeFriend = (id: string) => {
    // Logic to call API to remove friend if 
    setFriends(friends.filter(f => f._id !== id));
  };

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
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1F2937", margin: "0 auto", letterSpacing: "-0.5px" }}>My Friends</h1>
        </div>
      </div>

      <div style={{ padding: "0 20px", marginTop: -35, position: "relative", zIndex: 1 }}>
        {/* Search Bar */}
        <div style={{ position: "relative", marginBottom: 24 }}>
          <input 
            type="text" 
            placeholder="Search friends..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%", padding: "18px 20px 18px 52px", borderRadius: 24, background: "white",
              border: "1px solid #EDF2F7", fontSize: 16, fontWeight: 600, color: "#1F2937",
              boxShadow: "0 8px 25px rgba(0,0,0,0.02)", outline: "none",
              fontFamily: "'Inter', sans-serif"
            }}
          />
          <div style={{ position: "absolute", left: 20, top: "50%", transform: "translateY(-50%)" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="3"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {filteredFriends.map((f) => (
            <div key={f._id} style={{
              background: "white", borderRadius: 28, padding: "18px 20px", display: "flex", justifyContent: "space-between", alignItems: "center",
              boxShadow: "0 8px 25px rgba(0,0,0,0.015)", border: "1px solid #EDF2F7"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ 
                  width: 56, height: 56, borderRadius: "50%", 
                  background: `linear-gradient(135deg, ${f.color} 0%, #FFFFFF 170%)`, 
                  display: "flex", alignItems: "center", justifyContent: "center", 
                  border: "3px solid white",
                  boxShadow: "0 8px 15px rgba(0,0,0,0.05)"
                }}>
                   <span style={{ fontSize: 20, fontWeight: 900, color: "#1F2937", opacity: 0.8 }}>{f.name?.[0]?.toUpperCase()}</span>
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#1F2937", letterSpacing: "-0.3px" }}>{f.name}</h4>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#6B7280" }}>{f.phone}</p>
                </div>
              </div>
              <button 
                onClick={() => removeFriend(f._id)}
                style={{
                  padding: "10px 18px", borderRadius: 14, background: "#FFF5F5", color: "#EF4444",
                  fontSize: 13, fontWeight: 800, border: "1px solid #FEE2E2", cursor: "pointer",
                  outline: "none"
                }}
              >
                Remove
              </button>
            </div>
          ))}
          {filteredFriends.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
               <p style={{ fontSize: 16, color: "#64748B", fontWeight: 700 }}>No friends found</p>
            </div>
          )}
        </div>
      </div>

      {/* Floating Add Button */}
      <Link href="/dashboard/friends/add">
        <div style={{
          position: "fixed", bottom: 100, right: 24, width: 60, height: 60, borderRadius: "50%",
          background: "linear-gradient(135deg, #8FB5E8 0%, #6C9BD2 100%)", 
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 12px 30px rgba(108, 155, 210, 0.2)", cursor: "pointer", zIndex: 100
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        </div>
      </Link>

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
      `}} />
    </div>
  );
}
