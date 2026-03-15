"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/* ─── SVG Illustrations ─────────────────────────── */

/** Screen 1 – Illustration (using exact image) */
function OnboardingIllustration() {
  return (
    <img 
      src="/assets/onboarding.png" 
      alt="Onboarding" 
      style={{ 
        width: "100%", 
        maxWidth: 320, 
        height: "auto",
        display: "block",
        margin: "0 auto"
      }} 
    />
  );
}

/** Screen 2 – Logo (using exact image) */
function CSLogo() {
  return (
    <img 
      src="/assets/logo.png" 
      alt="Logo" 
      style={{ 
        width: 80, 
        height: 80, 
        objectFit: "contain" 
      }} 
    />
  );
}

/** Screen 3 – Two people presenting charts */
function ChartsIllustration() {
  return (
    <svg viewBox="0 0 260 180" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", maxWidth: 260, height: 180 }}>
      {/* Large screen / board */}
      <rect x="50" y="20" width="160" height="110" rx="10" fill="white" stroke="#C8DFF9" strokeWidth="2" />
      <rect x="50" y="20" width="160" height="18" rx="10" fill="#4A8FE8" />
      {/* Chart bars */}
      <rect x="70" y="105" width="18" height="20" rx="3" fill="#5BA3F0" />
      <rect x="95" y="85" width="18" height="40" rx="3" fill="#3374D1" />
      <rect x="120" y="65" width="18" height="60" rx="3" fill="#5BA3F0" />
      <rect x="145" y="75" width="18" height="50" rx="3" fill="#2A9D8F" />
      <rect x="170" y="55" width="18" height="70" rx="3" fill="#3374D1" />
      {/* Chart line */}
      <polyline points="79,100 104,80 129,60 154,70 179,50" stroke="#2A9D8F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* Dots on line */}
      <circle cx="79" cy="100" r="4" fill="#2A9D8F" />
      <circle cx="104" cy="80" r="4" fill="#2A9D8F" />
      <circle cx="129" cy="60" r="4" fill="#2A9D8F" />
      <circle cx="154" cy="70" r="4" fill="#2A9D8F" />
      <circle cx="179" cy="50" r="4" fill="#2A9D8F" />
      {/* Board stand */}
      <rect x="123" y="130" width="14" height="16" rx="3" fill="#C8DFF9" />
      <rect x="108" y="144" width="44" height="6" rx="3" fill="#C8DFF9" />

      {/* Man (left) */}
      <circle cx="36" cy="78" r="12" fill="#FDDCB5" />
      <ellipse cx="36" cy="68" rx="10" ry="6" fill="#3D2B1F" />
      <rect x="24" y="90" width="24" height="36" rx="7" fill="#4A8FE8" />
      <rect x="24" y="90" width="10" height="36" rx="5" fill="#3374D1" />
      <rect x="26" y="124" width="9" height="22" rx="4" fill="#2E5FAA" />
      <rect x="39" y="124" width="9" height="22" rx="4" fill="#2E5FAA" />
      {/* Pointing arm */}
      <path d="M48 100 Q60 92 68 85" stroke="#FDDCB5" strokeWidth="7" strokeLinecap="round" fill="none" />
      <circle cx="70" cy="84" r="5" fill="#FDDCB5" />

      {/* Woman (right) */}
      <circle cx="224" cy="78" r="12" fill="#FDDCB5" />
      {/* Hair */}
      <ellipse cx="224" cy="67" rx="13" ry="8" fill="#2C1810" />
      <ellipse cx="218" cy="72" rx="6" ry="10" fill="#2C1810" />
      <rect x="212" y="90" width="24" height="36" rx="7" fill="#2A9D8F" />
      <rect x="226" y="90" width="10" height="36" rx="5" fill="#1D7A6E" />
      {/* Skirt hint */}
      <rect x="214" y="118" width="22" height="10" rx="5" fill="#E0F7F4" />
      <rect x="214" y="124" width="9" height="22" rx="4" fill="#2E5FAA" />
      <rect x="227" y="124" width="9" height="22" rx="4" fill="#2E5FAA" />
      {/* Pointing arm */}
      <path d="M212 100 Q200 92 192 85" stroke="#FDDCB5" strokeWidth="7" strokeLinecap="round" fill="none" />
      <circle cx="190" cy="84" r="5" fill="#FDDCB5" />
    </svg>
  );
}

/* ─── Pager Dots ─────────────────────────────────── */
function PagerDots({ current = 0, total = 3 }: { current?: number; total?: number }) {
  return (
    <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 20 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            width: i === current ? 24 : 8,
            height: 8,
            borderRadius: 999,
            background: i === current
              ? "linear-gradient(90deg,#5BA3F0,#2A9D8F)"
              : "rgba(74,143,232,0.25)",
            transition: "all 0.3s ease",
          }}
        />
      ))}
    </div>
  );
}

/* ─── Numeric Keypad ─────────────────────────────── */
const KEYS = [
  ["1", "2\nABC", "3\nDEF"],
  ["4\nGHI", "5\nJKL", "6\nMNO"],
  ["7\nPQRS", "8\nTUV", "9\nWXYZ"],
  ["", "0", "⌫"],
];

function NumericKeypad({ onKey }: { onKey: (k: string) => void }) {
  return (
    <div
      style={{
        background: "#F2F5FA",
        borderTop: "1px solid #E0EAF5",
        padding: "8px 0 12px",
      }}
    >
      {KEYS.map((row, ri) => (
        <div key={ri} style={{ display: "flex" }}>
          {row.map((key, ki) => {
            const [main, sub] = key.split("\n");
            return (
              <button
                key={ki}
                onClick={() => key && onKey(main)}
                style={{
                  flex: 1,
                  height: 56,
                  background: key ? "white" : "transparent",
                  border: "none",
                  borderRadius: 8,
                  margin: "3px 4px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: key ? "pointer" : "default",
                  boxShadow: key ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                  transition: "background 0.15s",
                }}
                onMouseDown={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = key
                    ? "#E8F0FE"
                    : "transparent";
                }}
                onMouseUp={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = key
                    ? "white"
                    : "transparent";
                }}
              >
                <span
                  style={{
                    fontSize: main === "⌫" ? 22 : 20,
                    fontWeight: 500,
                    color: "#1A2A4A",
                    fontFamily: "Montserrat, sans-serif",
                    lineHeight: 1,
                  }}
                >
                  {main}
                </span>
                {sub && (
                  <span
                    style={{
                      fontSize: 9,
                      color: "#6B7FA8",
                      fontFamily: "Montserrat, sans-serif",
                      letterSpacing: "0.08em",
                      marginTop: 2,
                    }}
                  >
                    {sub}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

/* ─── Gradient Button ────────────────────────────── */
function GradientButton({
  children,
  onClick,
  disabled,
  type = "button",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        width: "100%",
        padding: "15px 0",
        borderRadius: 14,
        border: "none",
        background: disabled
          ? "#B5D0F5"
          : "linear-gradient(90deg, #5BA3F0 0%, #2A9D8F 100%)",
        color: "white",
        fontFamily: "Montserrat, sans-serif",
        fontWeight: 700,
        fontSize: 16,
        cursor: disabled ? "not-allowed" : "pointer",
        boxShadow: disabled ? "none" : "0 6px 20px rgba(51,116,209,0.38)",
        transition: "all 0.2s ease",
        letterSpacing: "0.02em",
      }}
    >
      {children}
    </button>
  );
}

/* ─── Screen 1: Onboarding ──────────────────────── */
function OnboardingScreen({ onNext }: { onNext: () => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "white", justifyContent: "center", textAlign: "center" }}>
      {/* Illustration area */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 24px",
          marginBottom: 20,
        }}
      >
        <OnboardingIllustration />
      </div>

      {/* Text + CTA */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", width: "100%", maxWidth: 320, padding: "0 20px" }}>
        <h1
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontSize: 28,
            fontWeight: 800,
            color: "#111827", // Dark Navy
            textAlign: "center",
            margin: "40px 0 10px 0",
            lineHeight: 1.2,
          }}
        >
          Manage your Bills
        </h1>
        <p
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontSize: 15,
            color: "#8892A3", // Medium Gray
            textAlign: "center",
            marginBottom: 50,
            lineHeight: 1.5,
          }}
        >
          Manage your bill into easy to share bills with your friends and anyone
        </p>

        <button
          onClick={onNext}
          style={{
            width: "100%",
            height: 52,
            background: "linear-gradient(90deg, #32B5E8 0%, #5E73D6 100%)", // Brand Gradient
            borderRadius: 26,
            color: "white",
            border: "none",
            fontFamily: "Montserrat, sans-serif",
            fontSize: 16,
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 8px 16px rgba(94, 115, 214, 0.3)",
          }}
        >
          Next
        </button>
      </div>
      <PagerDots current={0} total={3} />
    </div>
  );
}

/* ─── Screen 2: Login ───────────────────────────── */
function LoginScreen({
  phone,
  setPhone,
  onSubmit,
  loading,
  error,
}: {
  phone: string;
  setPhone: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  error: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "white",
        padding: "0 28px",
      }}
    >
      {/* Logo */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          paddingTop: 40,
          paddingBottom: 20,
        }}
      >
        <CSLogo />
      </div>

      {/* Heading */}
      <h1
        style={{
          fontFamily: "Montserrat, sans-serif",
          fontSize: 26,
          fontWeight: 800,
          color: "#111827", // Dark Navy
          marginBottom: 8,
          textAlign: "center",
        }}
      >
        Login
      </h1>
      <p
        style={{
          fontFamily: "Montserrat, sans-serif",
          fontSize: 14,
          color: "#8892A3", // Medium Gray
          marginBottom: 40,
          textAlign: "center",
          fontWeight: 500,
        }}
      >
        Enter Your Phone Number To Login
      </p>

      {/* Phone input */}
      <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ marginBottom: 25, width: "100%" }}>
          <label
            style={{
              display: "block",
              fontFamily: "Montserrat, sans-serif",
              fontSize: 12,
              fontWeight: 700,
              color: "#8892A3", // Medium Gray
              marginBottom: 8,
              marginLeft: 4,
            }}
          >
            Mobile Number
          </label>
          <div style={{ display: "flex", alignItems: "center", border: "1.5px solid #C8DFF9", borderRadius: 10 }}>
            <span
              style={{
                padding: "14px 12px",
                fontFamily: "Montserrat, sans-serif",
                fontSize: 15,
                fontWeight: 600,
                color: "#1A2A4A",
                borderRight: "1.5px solid #C8DFF9",
                userSelect: "none",
              }}
            >
              +91
            </span>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="9876543210"
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                padding: "14px 14px",
                fontFamily: "Montserrat, sans-serif",
                fontSize: 15,
                fontWeight: 500,
                color: "#1A2A4A",
                background: "transparent",
              }}
              required
            />
          </div>
        </div>

        {error && (
          <p
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: 13,
              color: "#E53935",
              background: "#FFF0F0",
              padding: "8px 14px",
              borderRadius: 8,
              margin: 0,
            }}
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          onClick={onSubmit}
          disabled={loading}
          style={{
            width: "100%",
            height: 52,
            background: loading
              ? "#B5D0F5"
              : "linear-gradient(90deg, #32B5E8 0%, #5E73D6 100%)", // Brand Gradient
            borderRadius: 26,
            color: "white",
            border: "none",
            fontFamily: "Montserrat, sans-serif",
            fontSize: 16,
            fontWeight: 700,
            cursor: loading ? "default" : "pointer",
            boxShadow: loading ? "none" : "0 8px 16px rgba(94, 115, 214, 0.3)",
            transition: "all 0.2s ease",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Verifying…" : "Done"}
        </button>
      </form>

      {/* OTP resend */}
      <p
        style={{
          fontFamily: "Montserrat, sans-serif",
          fontSize: 13,
          color: "#8892A3", // Medium Gray
          textAlign: "center",
          marginTop: 16,
        }}
      >
        Don&apos;t Receive OTP Code?{" "}
        <span style={{ color: "#32B5E8", fontWeight: 700, cursor: "pointer" }}>
          Resend Code
        </span>
      </p>

      {/* Divider */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 15,
          margin: "20px 0",
        }}
      >
        <div style={{ height: 1, flex: 1, backgroundColor: "#E2E8F0" }} />
        <span
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontSize: 13,
            fontWeight: 700,
            color: "#8892A3", // Medium Gray
          }}
        >
          Or Login with
        </span>
        <div style={{ height: 1, flex: 1, backgroundColor: "#E2E8F0" }} />
      </div>

      {/* Social icons */}
      <div style={{ display: "flex", justifyContent: "center", gap: 20 }}>
        {/* Google */}
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            border: "1.5px solid #E0EAF5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            background: "white",
            boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
          }}
        >
          <svg viewBox="0 0 48 48" width="24" height="24">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
        </div>
        {/* Facebook */}
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            border: "1.5px solid #E0EAF5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            background: "white",
            boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
          }}
        >
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        </div>
        {/* Apple */}
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            border: "1.5px solid #E0EAF5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            background: "white",
            boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
          }}
        >
          <svg viewBox="0 0 814 1000" width="22" height="22">
            <path fill="#000000" d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105.3-57.8-155.3-127.4C46 790.7 0 663 0 541.8c0-207.5 135.4-317.3 269-317.3 70.1 0 128.4 46.4 172.5 46.4 42.8 0 109.9-49 192.5-49 30.8 0 107 2.6 160.9 107.6-.5.3-67.8 39-67.8 132.4zm-230.5-209.4c31.3-37.5 54.3-89.7 54.3-141.9 0-7.1-.6-14.3-1.9-20.1-51.6 1.9-113.4 34.4-150.4 80.1-28.5 32.8-55.1 83.7-55.1 136.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 46.5 0 102.8-31.4 137.6-73z"/>
          </svg>
        </div>
      </div>

      <PagerDots current={1} total={3} />
    </div>
  );
}

/* ─── Screen 3: PIN Verification ─────────────────── */
function PinScreen({ phone }: { phone: string }) {
  const [pin, setPin] = useState(["", "", "", ""]);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  function handleKey(k: string) {
    if (k === "⌫") {
      setPin((prev) => {
        const next = [...prev];
        const lastFilled = next.map((v, i) => (v ? i : -1)).filter((i) => i >= 0).pop();
        if (lastFilled !== undefined) next[lastFilled] = "";
        return next;
      });
    } else {
      setPin((prev) => {
        const next = [...prev];
        const firstEmpty = next.findIndex((v) => !v);
        if (firstEmpty >= 0) next[firstEmpty] = k;
        return next;
      });
    }
  }

  async function handleDone() {
    const fullPin = pin.join("");
    if (fullPin.length < 4) return;
    setLoading(true);
    try {
      const cleanPhone = phone.replace(/\D/g, "");
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: cleanPhone || phone, pin: fullPin }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error ?? "Login failed");
        setPin(["", "", "", ""]);
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const filled = pin.filter(Boolean).length;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "white" }}>
      {/* Illustration + greeting */}
      <div style={{ padding: "24px 24px 0", textAlign: "center" }}>
        <ChartsIllustration />
        <h2
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 800,
            fontSize: 20,
            color: "#1A2A4A",
            margin: "12px 0 4px",
          }}
        >
          Welcome Sooraj KV
        </h2>
        <p
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontSize: 13,
            color: "#6B7FA8",
            margin: "0 0 20px",
          }}
        >
          Enter your 4 digit pin
        </p>

        {/* PIN circles */}
        <div style={{ display: "flex", gap: 14, justifyContent: "center", marginBottom: 14 }}>
          {pin.map((v, i) => (
            <div
              key={i}
              style={{
                width: 52,
                height: 52,
                borderRadius: "50%",
                border: `2px solid ${v ? "#4A8FE8" : "#C8DFF9"}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 700,
                fontSize: 22,
                color: "#1A2A4A",
                background: v ? "rgba(74,143,232,0.08)" : "white",
                transition: "all 0.15s ease",
              }}
            >
              {v}
            </div>
          ))}
        </div>

        {/* Edit mobile */}
        <p
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontSize: 12,
            color: "#4A8FE8",
            cursor: "pointer",
            marginBottom: 16,
            fontWeight: 600,
          }}
        >
          Edit Mobile Number?
        </p>

        {/* Done button */}
        <div style={{ padding: "0 4px" }}>
          <button
            onClick={handleDone}
            disabled={filled < 4 || loading}
            style={{
              width: "100%",
              height: 52,
              background: loading
                ? "#B5D0F5"
                : "linear-gradient(90deg, #32B5E8 0%, #5E73D6 100%)", // Brand Gradient
              borderRadius: 26,
              color: "white",
              border: "none",
              fontFamily: "Montserrat, sans-serif",
              fontSize: 16,
              fontWeight: 700,
              cursor: loading ? "default" : "pointer",
              boxShadow: loading ? "none" : "0 8px 16px rgba(94, 115, 214, 0.3)",
              marginTop: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Verifying…" : "Done"}
          </button>
        </div>
      </div>

      {/* Keypad */}
      <div style={{ marginTop: "auto" }}>
        <NumericKeypad onKey={handleKey} />
      </div>
    </div>
  );
}

/* ─── Main Login Page ────────────────────────────── */
export default function LoginPage() {
  const router = useRouter();
  const [screen, setScreen] = useState<0 | 1 | 2>(0);
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLoginSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const cleanPhone = phone.replace(/\D/g, "");
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: cleanPhone || phone }),
      });
      const data = await res.json();
      if (!res.ok) {
        // If API requires a PIN step, move to screen 3
        if (data.requirePin || res.status === 202) {
          setScreen(2);
          return;
        }
        setError(data.error ?? "Login failed");
        return;
      }
      // Logged in directly (no PIN step)
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #E8F2FF 0%, #EAF7F5 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 16px",
      }}
    >
      {/* Phone frame */}
      <div
        style={{
          width: "100%",
          maxWidth: 390,
          minHeight: 720,
          background: "white",
          borderRadius: 32,
          boxShadow: "0 24px 80px rgba(74,143,232,0.2), 0 4px 20px rgba(0,0,0,0.08)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        {/* No status bar - removed as requested */}

        {/* Screen content */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {screen === 0 && <OnboardingScreen onNext={() => setScreen(1)} />}
          {screen === 1 && (
            <LoginScreen
              phone={phone}
              setPhone={setPhone}
              onSubmit={handleLoginSubmit}
              loading={loading}
              error={error}
            />
          )}
          {screen === 2 && <PinScreen phone={phone} />}
        </div>
      </div>
    </div>
  );
}
