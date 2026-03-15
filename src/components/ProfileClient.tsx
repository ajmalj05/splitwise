"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageHeader } from "./PageHeader";

interface ProfileClientProps {
  user: {
    name?: string;
    phone: string;
    email?: string;
  };
}

export function ProfileClient({ user }: ProfileClientProps) {
  const router = useRouter();

  const handleLogout = async () => {
    // We can use a logout API or just clear session on client if using cookies
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  const navItems = [
    { label: "Edit profile", href: "/dashboard/profile/edit", color: "#818CF8", icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
    )},
    { label: "My Groups", href: "/dashboard", color: "#60A5FA", icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
    )},
    { label: "Friends", href: "/dashboard/friends", color: "#F472B6", icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline></svg>
    )},
    { label: "Settings", href: "/dashboard/profile/settings", color: "#94A3B8", icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.51 1V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0 1.51-1V8a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V15z"></path></svg>
    )},
  ];

  return (
    <div style={{ background: "#EEF2F7", minHeight: "100vh", paddingBottom: 110, fontFamily: "'Inter', sans-serif", margin: "-24px -16px" }}>
      {/* ── Top Gradient Header Section ─────────────────── */}
      <div style={{
        background: "linear-gradient(135deg, #8FB5E8 0%, #6C9BD2 100%)",
        height: 180,
        width: "100%",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Abstract Smooth Waves (SVG) */}
        <div style={{ position: "absolute", bottom: -2, left: 0, right: 0, height: 80, pointerEvents: "none", opacity: 0.6 }}>
          <svg viewBox="0 0 500 150" preserveAspectRatio="none" style={{ height: "100%", width: "100%" }}>
            <path d="M0.00,49.98 C149.99,150.00 349.20,-49.98 500.00,49.98 L500.00,150.00 L0.00,150.00 Z" style={{ stroke: "none", fill: "rgba(255,255,255,0.2)" }}></path>
          </svg>
        </div>
        <div style={{ position: "absolute", bottom: -10, left: 0, right: 0, height: 100, pointerEvents: "none", opacity: 0.4 }}>
          <svg viewBox="0 0 500 150" preserveAspectRatio="none" style={{ height: "100%", width: "100%" }}>
            <path d="M0.00,49.98 C149.99,150.00 271.49,-49.98 500.00,49.98 L500.00,150.00 L0.00,150.00 Z" style={{ stroke: "none", fill: "rgba(255,255,255,0.3)" }}></path>
          </svg>
        </div>
      </div>

      <div style={{ padding: "0 20px", marginTop: -80, position: "relative", zIndex: 1 }}>
        {/* Profile Card with Overlapping Avatar */}
        <div style={{
          background: "white",
          borderRadius: 40,
          padding: "60px 24px 34px 24px",
          textAlign: "center",
          boxShadow: "0 15px 35px rgba(0,0,0,0.03)",
          position: "relative",
          marginBottom: 30
        }}>
          {/* Circular Avatar */}
          <div style={{
            width: 110, height: 110,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #8FB5E8 0%, #6C9BD2 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            position: "absolute", top: -55, left: "50%", transform: "translateX(-50%)",
            border: "6px solid white",
            boxShadow: "0 10px 25px rgba(108, 155, 210, 0.2)"
          }}>
            <span style={{ fontSize: 44, fontWeight: 900, color: "white" }}>{user.name?.[0]?.toUpperCase() || "A"}</span>
          </div>

          <h2 style={{ margin: "0 0 6px 0", fontSize: 28, fontWeight: 800, color: "#1F2937", letterSpacing: "-0.5px" }}>{user.name || "Ajmal"}</h2>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#6B7280" }}>{user.phone || "1234567890"}</p>
        </div>

        {/* Action List Items */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {navItems.map((item, index) => (
            <Link key={index} href={item.href} style={{ textDecoration: "none" }}>
              <div style={{
                background: "white",
                borderRadius: 28,
                padding: "18px 22px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                boxShadow: "0 8px 20px rgba(0,0,0,0.015)",
                border: "1px solid #EDF2F7",
                transition: "transform 0.2s"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{
                    color: item.color,
                    background: `${item.color}15`,
                    width: 48,
                    height: 48,
                    borderRadius: 16,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    {item.icon}
                  </div>
                  <span style={{ fontSize: 18, fontWeight: 800, color: "#1F2937", letterSpacing: "-0.3px" }}>{item.label}</span>
                </div>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </div>
            </Link>
          ))}

          {/* Logout Button */}
          <button 
            onClick={handleLogout}
            style={{
              width: "100%",
              background: "#FFF5F5",
              borderRadius: 28,
              padding: "18px 22px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              border: "1px solid #FEE2E2",
              cursor: "pointer",
              marginTop: 10,
              outline: "none"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{
                color: "#EF4444",
                background: "rgba(239, 68, 68, 0.1)",
                width: 48,
                height: 48,
                borderRadius: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
              </div>
              <span style={{ fontSize: 18, fontWeight: 800, color: "#EF4444", letterSpacing: "-0.3px" }}>Logout</span>
            </div>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
      `}} />
    </div>
  );
}
