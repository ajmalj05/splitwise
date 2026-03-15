"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { label: "Home", href: "/dashboard", icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
    )},
    { label: "Tracker", href: "/dashboard/tracker", icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
    )},
    { label: "Profile", href: "/dashboard/profile", icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>
    )},
  ];

  return (
    <div style={{ position: "fixed", bottom: 25, left: 0, right: 0, padding: "0 20px", display: "flex", justifyContent: "center", zIndex: 1000 }}>
       <div style={{
        background: "#F3F4F6",
        backdropFilter: "blur(20px)",
        borderRadius: "40px",
        padding: "10px 14px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 10px 40px rgba(0,0,0,0.12)",
        width: "310px",
        border: "1px solid rgba(255,255,255,0.3)",
      }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href === "/dashboard" && pathname === "/dashboard");
          return (
            <Link key={item.href} href={item.href} style={{ textDecoration: "none" }}>
              <div style={{
                padding: isActive ? "14px 28px" : "14px",
                borderRadius: "30px",
                background: isActive ? "#6C7AE0" : "transparent",
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                boxShadow: isActive ? "0 8px 20px rgba(108, 122, 224, 0.3)" : "none",
                color: isActive ? "white" : "#64748B"
              }}>
                {item.icon}
                {isActive && (
                  <span style={{ fontSize: 13, fontWeight: 800 }}>{item.label}</span>
                )}
              </div>
            </Link>
          );
        })}
        </div>
    </div>
  );
}
