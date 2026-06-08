"use client";
import { useState } from "react";
// Import your auth or navigation hooks if needed, e.g.:
// import { useApp } from "../layout"; 

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState("signin"); // signin or signup

  const handleSubmit = (e) => {
    e.preventDefault();
    // Your authentication logic here
    console.log("Submitting:", { email, password, activeTab });
  };

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#000000",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "system-ui, sans-serif",
      color: "#ffffff",
      padding: 20
    }}>
      {/* Brand Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 40 }}>
        <div style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: "bold",
          fontSize: 20,
          color: "#000000"
        }}>
          ⚡
        </div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: -0.5 }}>Campaign ReviewFlow</div>
          <div style={{ fontSize: 11, color: "#a3a3a3", marginTop: 1 }}>Review Management Platform</div>
        </div>
      </div>

      {/* Auth Card Box */}
      <div style={{
        width: "100%",
        maxWidth: 420,
        background: "#0a0a0a",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 16,
        padding: "32px 28px",
        boxShadow: "0 20px 40px rgba(0,0,0,0.4)"
      }}>
        
        {/* Top Segmented Tabs (Sign In / Create Account) */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          background: "rgba(255,255,255,0.03)",
          padding: 4,
          borderRadius: 10,
          marginBottom: 32,
          border: "1px solid rgba(255,255,255,0.04)"
        }}>
          <button 
            onClick={() => setActiveTab("signin")}
            style={{
              padding: "8px 0",
              background: activeTab === "signin" ? "#10b981" : "transparent",
              color: activeTab === "signin" ? "#000000" : "#a3a3a3",
              border: "none",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s"
            }}
          >
            Sign In
          </button>
          <button 
            onClick={() => setActiveTab("signup")}
            style={{
              padding: "8px 0",
              background: activeTab === "signup" ? "#10b981" : "transparent",
              color: activeTab === "signup" ? "#000000" : "#a3a3a3",
              border: "none",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s"
            }}
          >
            Create Account
          </button>
        </div>

        {/* Titles */}
        <h2 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 6px 0", letterSpacing: -0.5 }}>
          {activeTab === "signin" ? "Welcome back" : "Get started"}
        </h2>
        <p style={{ fontSize: 13, color: "#a3a3a3", margin: "0 0 28px 0" }}>
          {activeTab === "signin" ? "Sign in to your dashboard" : "Create your reviewer or admin profile"}
        </p>

        {/* Input Form */}
        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ 
              display: "block", 
              fontSize: 11, 
              fontWeight: 700, 
              color: "#e5e7eb", 
              textTransform: "uppercase", 
              letterSpacing: 1,
              marginBottom: 8
            }}>
              Email Address
            </label>
            <input 
              type="email" 
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                boxSizing: "border-box",
                background: "#000000",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 10,
                padding: "12px 16px",
                color: "#ffffff",
                fontSize: 14,
                outline: "none",
                transition: "border-color 0.2s"
              }}
              onFocus={(e) => e.target.style.borderColor = "#10b981"}
              onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.12)"}
              required
            />
          </div>

          {/* Password Field */}
          <div style={{ marginBottom: 28 }}>
            <label style={{ 
              display: "block", 
              fontSize: 11, 
              fontWeight: 700, 
              color: "#e5e7eb", 
              textTransform: "uppercase", 
              letterSpacing: 1,
              marginBottom: 8
            }}>
              Password
            </label>
            <input 
              type="password" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                boxSizing: "border-box",
                background: "#000000",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 10,
                padding: "12px 16px",
                color: "#ffffff",
                fontSize: 14,
                outline: "none",
                transition: "border-color 0.2s"
              }}
              onFocus={(e) => e.target.style.borderColor = "#10b981"}
              onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.12)"}
              required
            />
          </div>

          {/* Action Button */}
          <button 
            type="submit"
            style={{
              width: "100%",
              background: "#10b981",
              color: "#000000",
              border: "none",
              borderRadius: 10,
              padding: "14px 0",
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
              transition: "opacity 0.2s"
            }}
            onMouseOver={(e) => e.target.style.opacity = "0.9"}
            onMouseOut={(e) => e.target.style.opacity = "1"}
          >
            {activeTab === "signin" ? "Sign In →" : "Register Account →"}
          </button>
        </form>

        {/* Dynamic Footer Switcher Link */}
        <div style={{ textAlign: "center", marginTop: 24, fontSize: 12, color: "#a3a3a3" }}>
          {activeTab === "signin" ? (
            <>
              No account yet?{" "}
              <span 
                onClick={() => setActiveTab("signup")}
                style={{ color: "#10b981", cursor: "pointer", fontWeight: 500 }}
              >
                Create one →
              </span>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <span 
                onClick={() => setActiveTab("signin")}
                style={{ color: "#10b981", cursor: "pointer", fontWeight: 500 }}
              >
                Sign in instead ←
              </span>
            </>
          )}
        </div>

      </div>
    </div>
  );
}