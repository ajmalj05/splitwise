"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";

export default function NewGroupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to create group");
        return;
      }
      router.push(`/dashboard/groups/${data.group._id}`);
      router.refresh();
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

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
        {/* Very Subtle Waves */}
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
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1F2937", margin: "0 auto", letterSpacing: "-0.5px" }}>Create Group</h1>
        </div>
      </div>

      <div style={{ padding: "0 20px", marginTop: -35, position: "relative", zIndex: 1 }}>
        <div
          className="animate-slide-up"
          style={{
            background: "#FFFFFF",
            borderRadius: 32,
            padding: "32px 24px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.02)",
            border: "1.5px solid #F1F5F9",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              <label
                htmlFor="groupName"
                style={{
                  display: "block",
                  fontWeight: 800, fontSize: 11,
                   color: "#6B7280",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em", marginBottom: 10,
                }}
              >
                Group name
              </label>
              <input
                id="groupName"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Trip to Goa"
                style={{
                  width: "100%", boxSizing: "border-box",
                  background: "#F8FAFC",
                  border: "1.5px solid #E2E8F0",
                  borderRadius: 18, padding: "18px 20px",
                  fontWeight: 600, fontSize: 16,
                   color: "#1F2937",
                  outline: "none",
                  transition: "all 0.2s ease",
                }}
                required
              />
            </div>

            {error && (
              <p
                style={{
                  fontWeight: 600, fontSize: 13,
                  color: "#EF4444",
                  background: "#FEF2F2", padding: "12px 16px", borderRadius: 12,
                  border: "1px solid #FEE2E2",
                }}
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: 8, border: "none", cursor: loading ? "not-allowed" : "pointer",
                fontWeight: 800, fontSize: 16,
                background: "linear-gradient(90deg, #8FB5E8 0%, #6C9BD2 100%)",
                color: "white",
                padding: "18px 24px",
                borderRadius: 18,
                boxShadow: "0 10px 25px rgba(108, 155, 210, 0.2)",
                transition: "transform 0.2s ease",
              }}
            >
              {loading ? "Creating…" : "Create Group"}
            </button>
          </form>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
      `}} />
    </div>
  );
}
