"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";

export default function AddFriendPage() {
  const [query, setQuery] = useState("");
  const [searchBy, setSearchBy] = useState<'username' | 'phone' | 'email'>('username');
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSearch = async () => {
    if (!query) return;
    setIsSearching(true);
    setResult(null);
    try {
      const res = await fetch(`/api/users/search?query=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data.users && data.users.length > 0) {
        // For simplicity, just show the first result for now
        const user = data.users[0];
        setResult({
          ...user,
          color: ["#FFD89B", "#BAE6FD", "#DDD6FE", "#FED7AA", "#E9D5FF"][Math.floor(Math.random() * 5)]
        });
      } else {
        alert("No users found");
      }
    } catch (err) {
      console.error(err);
      alert("Search failed");
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddFriend = async () => {
    if (!result) return;
    try {
      const res = await fetch("/api/friends", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ friendId: result._id })
      });
      const data = await res.json();
      if (data.success) {
        alert("Friend added!");
        window.location.href = "/dashboard/friends";
      } else {
        alert(data.error || "Failed to add friend");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to add friend");
    }
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
          <Link href="/dashboard/friends" style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            width: 44, height: 44, borderRadius: "50%", background: "white",
            boxShadow: "0 8px 20px rgba(0,0,0,0.05)", textDecoration: "none",
            position: "absolute", left: 0, border: "1px solid #EDF2F7"
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6C9BD2" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </Link>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1F2937", margin: "0 auto", letterSpacing: "-0.5px" }}>Add Friend</h1>
        </div>
      </div>

      <div style={{ padding: "0 20px", marginTop: -35, position: "relative", zIndex: 1 }}>
        {/* Search Type Selector */}
        <div style={{ 
          display: "flex", gap: 10, marginBottom: 24, 
          background: "white", padding: 6, borderRadius: 20,
          boxShadow: "0 8px 25px rgba(0,0,0,0.02)", border: "1px solid #EDF2F7"
        }}>
          {(['username', 'phone', 'email'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setSearchBy(type)}
              style={{
                flex: 1, padding: "12px", borderRadius: 16, fontSize: 13, fontWeight: 800,
                background: searchBy === type ? "linear-gradient(135deg, #8FB5E8 0%, #6C9BD2 100%)" : "transparent",
                color: searchBy === type ? "white" : "#64748B",
                border: "none", cursor: "pointer", transition: "all 0.2s"
              }}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div style={{ position: "relative", marginBottom: 20 }}>
          <input 
            type="text" 
            placeholder={`Enter ${searchBy}...`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
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

        <button 
          onClick={handleSearch}
          disabled={!query || isSearching}
          style={{
            width: "100%", padding: "18px", borderRadius: 20, 
            background: "linear-gradient(135deg, #8FB5E8 0%, #6C9BD2 100%)", 
            color: "white", fontSize: 16, fontWeight: 800, border: "none", cursor: "pointer",
            boxShadow: "0 10px 25px rgba(108, 155, 210, 0.2)", opacity: !query || isSearching ? 0.6 : 1,
            transition: "all 0.2s"
          }}
        >
          {isSearching ? "Searching..." : "Search Friend"}
        </button>

        {/* Search Result */}
        {result && (
          <div style={{
            marginTop: 32, background: "white", borderRadius: 32, padding: "30px 24px", textAlign: "center",
            boxShadow: "0 15px 40px rgba(0,0,0,0.03)", border: "1px solid #EDF2F7"
          }}>
            <div style={{ 
              width: 90, height: 90, borderRadius: "50%", 
              background: `linear-gradient(135deg, ${result.color} 0%, #FFFFFF 170%)`, 
              display: "flex", alignItems: "center", justifyContent: "center", 
              margin: "0 auto 20px auto", border: "4px solid white", 
              boxShadow: "0 10px 25px rgba(0,0,0,0.08)" 
            }}>
               <span style={{ fontSize: 32, fontWeight: 900, color: "#1F2937", opacity: 0.8 }}>{result.name?.[0]?.toUpperCase()}</span>
            </div>
            <h3 style={{ margin: "0 0 6px 0", fontSize: 24, fontWeight: 800, color: "#1F2937", letterSpacing: "-0.5px" }}>{result.name}</h3>
            <p style={{ margin: "0 0 28px 0", fontSize: 14, fontWeight: 600, color: "#6B7280" }}>{result.phone || result.email}</p>
            
            <button 
              onClick={handleAddFriend}
              style={{
                width: "100%", padding: "16px", borderRadius: 18, 
                background: "#F0FDF4", color: "#10B981",
                fontSize: 15, fontWeight: 800, border: "1px solid #DCFCE7", cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              Add as Friend
            </button>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
      `}} />
    </div>
  );
}
