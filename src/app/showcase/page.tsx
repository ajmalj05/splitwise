"use client";

import React from "react";

/* ── Components ───────────────────────────────────── */

/** Mobile Phone Frame Component */
interface PhoneFrameProps {
  children: React.ReactNode;
}

const PhoneFrame: React.FC<PhoneFrameProps> = ({ children }) => {
  return (
    <div
      style={{
        width: 320,
        height: 650,
        backgroundColor: "#111827", // Dark Navy
        borderRadius: 44,
        padding: 9,
        position: "relative",
        boxShadow: "0 50px 100px -20px rgba(0,0,0,0.3), 0 30px 60px -30px rgba(0,0,0,0.4)",
        border: "1px solid rgba(255,255,255,0.1)",
        overflow: "hidden",
      }}
    >
      {/* Glossy Bezel Detail */}
      <div style={{ position: "absolute", inset: 0, borderRadius: 44, border: "2px solid rgba(255,255,255,0.05)", pointerEvents: "none" }} />
      
      {/* Top Notch */}
      <div
        style={{
          width: 140,
          height: 28,
          backgroundColor: "#111827",
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          borderBottomLeftRadius: 18,
          borderBottomRightRadius: 18,
          zIndex: 10,
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <div style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: "#1F2937" }} />
      </div>
      
      {/* Screen Content Container */}
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#FFFFFF",
          borderRadius: 35,
          overflow: "hidden",
          position: "relative",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Status Bar */}
        <div
          style={{
            padding: "14px 24px 5px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: 12, fontWeight: 700, color: "#111827", fontFamily: "sans-serif" }}>09:41</span>
          <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
            <svg width="14" height="10" viewBox="0 0 16 10" fill="none"><rect x="0" y="0" width="16" height="10" rx="2" fill="#111827" opacity="0.2"/><rect x="1" y="1" width="10" height="8" rx="1.5" fill="#111827"/></svg>
            <div style={{ width: 14, height: 4, borderRadius: 1, backgroundColor: "#111827", transform: "skewX(-20deg)" }} />
            <div style={{ width: 4, height: 4, borderRadius: "50%", backgroundColor: "#111827" }} />
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};

/** Embossed Credit Card Component */
interface GroupCardProps {
  name: string;
  memberText: string;
  balanceLabel: string;
  balanceValue: string;
  balanceLabel2: string;
  balanceValue2: string;
  cardNumber: string;
  avatars: number;
}

const GroupCard: React.FC<GroupCardProps> = ({
  name,
  memberText,
  balanceLabel,
  balanceValue,
  balanceLabel2,
  balanceValue2,
  cardNumber,
  avatars,
}) => {
  return (
    <div
      style={{
        width: "100%",
        borderRadius: 20,
        background: "linear-gradient(135deg, #32B5E8 0%, #5E73D6 100%)",
        padding: "18px 20px",
        color: "white",
        position: "relative",
        boxShadow: "0 15px 35px rgba(50, 181, 232, 0.25), inset 0 1px 1px rgba(255,255,255,0.3)",
        marginBottom: 16,
        fontFamily: "Montserrat, sans-serif",
      }}
    >
      {/* Card Glare */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "100%", background: "linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 40%)", pointerEvents: "none", borderRadius: 20 }} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 800, margin: 0, textShadow: "0 1px 2px rgba(0,0,0,0.1)" }}>{name}</h3>
          <span style={{ fontSize: 11, fontWeight: 500, opacity: 0.9 }}>{memberText}</span>
        </div>
        <div style={{ width: 34, height: 26, background: "rgba(255,255,255,0.25)", borderRadius: 6, padding: "4px 6px", border: "1px solid rgba(255,255,255,0.4)" }}>
          <div style={{ width: "100%", height: "100%", border: "1px solid rgba(255,255,255,0.5)", borderRadius: 2 }} />
        </div>
      </div>
      
      <div style={{ marginBottom: 15 }}>
        <div style={{ fontSize: 13, letterSpacing: 2, fontWeight: 700, textShadow: "0 1px 3px rgba(0,0,0,0.2)", opacity: 0.8 }}>{cardNumber}</div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 9, opacity: 0.7, fontWeight: 600 }}>02/20</div>
        </div>
        <div style={{ display: "flex", gap: -8 }}>
          {Array.from({ length: avatars }).map((_, i) => (
            <div
              key={i}
              style={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                backgroundColor: "#E2E8F0",
                border: "1px solid white",
                marginLeft: i === 0 ? 0 : -10,
                zIndex: avatars - i,
                overflow: "hidden"
              }}
            >
               <div style={{ width: "100%", height: "100%", background: `hsl(${i * 120}, 70%, 70%)` }} />
            </div>
          ))}
        </div>
      </div>

      {/* Balance Detail */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.2)", paddingTop: 12, display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
          <span style={{ fontWeight: 500, opacity: 0.8 }}>{balanceLabel}</span>
          <span style={{ fontWeight: 800, color: "#111827" }}>{balanceValue}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
           <span style={{ fontWeight: 500, opacity: 0.8 }}>{balanceLabel2}</span>
           <span style={{ fontWeight: 800, opacity: 0.6, color: "#111827" }}>{balanceValue2}</span>
        </div>
      </div>
    </div>
  );
};

/** Progress Bar Component */
const GradientProgress = ({ gradient }: { gradient: string }) => (
  <div style={{ width: "100%", height: 7, backgroundColor: "#F1F5F9", borderRadius: 4, overflow: "hidden" }}>
    <div style={{ width: "65%", height: "100%", background: gradient, borderRadius: 4 }} />
  </div>
);

/* ── Main Page ───────────────────────────────────── */

export default function ShowcasePage() {
  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "#C3D0E8", // Refined Light Periwinkle
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 20px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background Ornaments */}
      {/* Forest Green Circle */}
      <div
        style={{
          position: "absolute",
          width: 580,
          height: 580,
          borderRadius: "50%",
          background: "#1D5C4F", // Deep Forest Green
          left: "-5%",
          top: "12%",
          border: "2px solid #C3D0E8",
          zIndex: 0,
        }}
      />
      {/* Royal Blue Circle */}
      <div
        style={{
          position: "absolute",
          width: 650,
          height: 650,
          borderRadius: "50%",
          background: "#2B54D4", // Royal Blue
          right: "-8%",
          bottom: "10%",
          border: "2px solid #C3D0E8",
          zIndex: 0,
        }}
      />
      
      {/* Decorative Line Patterns */}
      <svg style={{ position: "absolute", left: "10%", bottom: "20%", opacity: 0.4 }} width="150" height="150" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" stroke="white" strokeWidth="1" fill="none" opacity="0.3" />
        <circle cx="50" cy="50" r="30" stroke="white" strokeWidth="0.5" fill="none" opacity="0.5" />
      </svg>

      {/* Side-by-side Phones */}
      <div
        style={{
          display: "flex",
          gap: 60,
          zIndex: 2,
          alignItems: "center",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {/* Left Phone: Home View */}
        <PhoneFrame>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "white" }}>
            {/* Header */}
            <div style={{ padding: "10px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h1 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 24, fontWeight: 800, color: "#111827" }}>Home</h1>
              <div 
                style={{ 
                  background: "linear-gradient(90deg, #32B5E8 0%, #5E73D6 100%)", 
                  color: "white", 
                  fontSize: 12, 
                  fontWeight: 700, 
                  padding: "8px 16px", 
                  borderRadius: 20,
                  boxShadow: "0 4px 12px rgba(94, 115, 214, 0.3)"
                }}
              >
                + Create group
              </div>
            </div>

            <div style={{ padding: "0 20px", overflowY: "auto", flex: 1 }}>
               <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "15px 0 12px" }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#111827", opacity: 0.5, letterSpacing: 0.5 }}>YOUR GROUPS</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#32B5E8" }}>+ New</span>
               </div>

               <GroupCard 
                  name="ijnb"
                  memberText="1 member"
                  balanceLabel="You get back"
                  balanceValue="--"
                  balanceLabel2="You are owed"
                  balanceValue2="--"
                  cardNumber="•••• •••• •••• 1234"
                  avatars={1}
               />
               <GroupCard 
                  name="CHURCH OF GOD..."
                  memberText="1 member"
                  balanceLabel="You get back"
                  balanceValue="--"
                  balanceLabel2="You are owed"
                  balanceValue2="--"
                  cardNumber="•••• •••• •••• 5678"
                  avatars={3}
               />
               <GroupCard 
                  name="test"
                  memberText="1 member"
                  balanceLabel="You get back"
                  balanceValue="--"
                  balanceLabel2="You are owed"
                  balanceValue2="--"
                  cardNumber="•••• •••• •••• 9012"
                  avatars={2}
               />
            </div>

            {/* Bottom Nav */}
            <div style={{ height: 65, borderTop: "1px solid #F1F5F9", display: "flex", justifyContent: "space-around", alignItems: "center", paddingBottom: 10 }}>
               <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <div style={{ width: 32, height: 32, backgroundColor: "#E0F2FE", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ width: 14, height: 14, border: "2px solid #32B5E8", borderRadius: 3 }} />
                  </div>
               </div>
               <div style={{ opacity: 0.3 }}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2"><path d="M12 20v-8m0 0V4m0 8h8m-8 0H4"/></svg></div>
               <div style={{ opacity: 0.3 }}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2"><circle cx="12" cy="7" r="4"/><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/></svg></div>
            </div>
          </div>
        </PhoneFrame>

        {/* Right Phone: Group Details */}
        <PhoneFrame>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "white", padding: "0 25px" }}>
            {/* Header */}
            <div style={{ paddingTop: 15, display: "flex", alignItems: "center", gap: 12, marginBottom: 25 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  background: "linear-gradient(135deg, #32B5E8 0%, #5E73D6 100%)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 10px rgba(94, 115, 214, 0.2)"
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <span style={{ fontSize: 18, fontWeight: 800, color: "#111827", fontFamily: "Montserrat" }}>Group Details</span>
            </div>

            <h2 style={{ fontSize: 24, fontWeight: 800, color: "#111827", margin: "0 0 4px 0", lineHeight: 1.2 }}>CHURCH OF GOD...</h2>
            <p style={{ fontSize: 14, fontWeight: 500, color: "#8892A3", marginBottom: 30 }}>Expenses & Shares</p>

            {/* People List */}
            {[
              { name: "Hannah", amount: "$ 5.00", grad: "linear-gradient(90deg, #32B5E8 0%, #2DD4BF 100%)", color: "#BAE6FD" },
              { name: "Lisa", amount: "$ 8.00", grad: "linear-gradient(90deg, #5E73D6 0%, #818CF8 100%)", color: "#DDD6FE" },
              { name: "Karo", amount: "$ 3.00", grad: "linear-gradient(90deg, #32B5E8 0%, #A78BFA 100%)", color: "#E0F2FE" }
            ].map((p, i) => (
              <div key={i} style={{ marginBottom: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: "50%", backgroundColor: p.color }} />
                    <span style={{ fontWeight: 700, color: "#111827", fontSize: 15 }}>{p.name}</span>
                  </div>
                  <span style={{ fontWeight: 800, color: "#111827", fontSize: 15 }}>{p.amount}</span>
                </div>
                <GradientProgress gradient={p.grad} />
              </div>
            ))}

            {/* Sticky Total */}
            <div
              style={{
                marginTop: "auto",
                padding: "25px 0 40px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderTop: "1.5px solid #F1F5F9",
              }}
            >
              <span style={{ fontWeight: 800, fontSize: 22, color: "#111827" }}>Total</span>
              <span style={{ fontWeight: 800, fontSize: 22, color: "#111827" }}>$35.00</span>
            </div>
          </div>
        </PhoneFrame>
      </div>

      {/* App Logo Footer */}
      <div style={{ position: "relative", marginTop: 60, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div
          style={{
            width: 38,
            height: 38,
            padding: 8,
            background: "linear-gradient(135deg, #32B5E8 0%, #5E73D6 100%)",
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 8px 16px rgba(94, 115, 214, 0.4)"
          }}
        >
           <div style={{ color: "white", fontSize: 16, fontWeight: 900, fontFamily: "Montserrat" }}>CS</div>
        </div>
        {/* Star Detail */}
        <div style={{ position: "absolute", right: -150, top: 10, color: "white", fontSize: 24 }}>✦</div>
      </div>
    </div>
  );
}
