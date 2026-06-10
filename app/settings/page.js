"use client";
import { useState } from "react";
import { useApp } from "../layout";

export default function SettingsPage() {
  const { user } = useApp();
  const [saved, setSaved] = useState(false);
  const [notifs, setNotifs] = useState(true);
  const [emailDigest, setEmailDigest] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const Toggle = ({ on, onToggle }) => (
    <div onClick={onToggle} style={{ width: 40, height: 22, borderRadius: 20, background: on ? "#22c00d" : "#141820", border: `1px solid ${on ? "#22c00d" : "rgba(255,255,255,0.08)"}`, position: "relative", cursor: "pointer", transition: "all 0.2s", flexShrink: 0 }}>
      <div style={{ width: 16, height: 16, background: "white", borderRadius: "50%", position: "absolute", top: 2, left: on ? 20 : 2, transition: "left 0.2s", boxShadow: "0 2px 4px rgba(0,0,0,0.3)" }} />
    </div>
  );

  return (
    <div style={{ padding: 32, maxWidth: 600 }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", color: "#2e3348", marginBottom: 6 }}>Configuration</div>
        <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0, letterSpacing: -0.5 }}>Settings</h1>
      </div>

      {/* Profile */}
      <div style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: 24, marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 18, color: "#c7d2fe" }}>Profile</div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: "linear-gradient(135deg, #22c00d, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, color: "white" }}>
            {user?.name?.split(" ").map(n => n[0]).join("") || "U"}
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>{user?.name}</div>
            <div style={{ fontSize: 12, color: "#3a4055", marginTop: 2, textTransform: "capitalize" }}>{user?.role}</div>
          </div>
        </div>
        <label style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase", color: "#5a6480", marginBottom: 6 }}>Display Name</label>
        <input defaultValue={user?.name} style={{ width: "100%", padding: "11px 14px", background: "#0f1118", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, color: "#e8eaf2", fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit", marginBottom: 14 }} />
        <label style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase", color: "#5a6480", marginBottom: 6 }}>Email</label>
        <input defaultValue={user?.email || "admin@reviewflow.com"} style={{ width: "100%", padding: "11px 14px", background: "#0f1118", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, color: "#e8eaf2", fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }} />
      </div>

      {/* Notifications */}
      <div style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: 24, marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 18, color: "#c7d2fe" }}>Notifications</div>
        {[
          { label: "Push notifications", sub: "Get notified when campaigns are updated", val: notifs, set: setNotifs },
          { label: "Email digest",       sub: "Weekly summary of campaign activity",      val: emailDigest, set: setEmailDigest },
        ].map((s, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: i === 0 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 2 }}>{s.label}</div>
              <div style={{ fontSize: 12, color: "#3a4055" }}>{s.sub}</div>
            </div>
            <Toggle on={s.val} onToggle={() => s.set(!s.val)} />
          </div>
        ))}
      </div>

      {/* SECURITY BOX AREA */}
      <div style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: 24, marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, color: "#c7d2fe" }}>Security</div>
        <div style={{ fontSize: 13, color: "#3a4055", padding: "12px 14px", background: "#0f1118", borderRadius: 8, border: "1px solid rgba(255,255,255,0.04)" }}>
          🔐 Password Management and Two-Factor Authentication (2FA) are securely managed via Supabase Cloud.
        </div>
      </div>

      <button onClick={handleSave} style={{ padding: "12px 28px", background: saved ? "#10b981" : "linear-gradient(135deg, #22c00d, #6366f1)", color: "white", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s" }}>
        {saved ? "✓ Saved!" : "Save Changes"}
      </button>
    </div>
  );
}