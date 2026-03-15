"use client";

import { useState, useEffect } from "react";

export function NamePopup({
  hasName,
  userId,
}: {
  hasName: boolean;
  userId: string;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!hasName && userId) setOpen(true);
  }, [hasName, userId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/user/name", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });
      if (res.ok) {
        setOpen(false);
        window.location.reload();
      }
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 50,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "rgba(0,0,0,0.45)", padding: 24,
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        className="animate-slide-up"
        style={{
          background: "#FF9EB7",
          borderRadius: 24, padding: "28px 24px",
          maxWidth: 360, width: "100%",
          boxShadow: "0 24px 64px rgba(0,0,0,0.25)",
          position: "relative", overflow: "hidden",
        }}
      >
        {/* Shine */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "40%",
          borderRadius: "24px 24px 0 0",
          background: "linear-gradient(180deg, rgba(255,255,255,0.2) 0%, transparent 100%)",
          pointerEvents: "none",
        }} />

        <h2
          style={{
            fontFamily: "Montserrat, sans-serif", fontWeight: 800, fontSize: 20,
            color: "white", margin: "0 0 6px 0",
          }}
        >
          What should we call you?
        </h2>
        <p
          style={{
            fontFamily: "Montserrat, sans-serif", fontWeight: 500, fontSize: 13,
            color: "rgba(255,255,255,0.8)", margin: "0 0 20px 0", lineHeight: 1.5,
          }}
        >
          Enter your name so friends can recognize you in groups.
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            style={{
              width: "100%", boxSizing: "border-box",
              background: "rgba(255,255,255,0.88)",
              border: "1.5px solid rgba(255,255,255,0.5)",
              borderRadius: 14, padding: "13px 18px",
              fontFamily: "Montserrat, sans-serif", fontWeight: 500, fontSize: 15,
              color: "#4A1A20", outline: "none",
            }}
            required
            autoFocus
          />
          <button
            type="submit"
            disabled={loading}
            className="btn-cta"
            style={{
              border: "none", cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 15,
            }}
          >
            {loading ? "Saving…" : "Save"}
          </button>
        </form>
      </div>
    </div>
  );
}
