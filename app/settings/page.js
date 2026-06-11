"use client";
import { useState, useEffect } from "react";
import { useApp } from "../layout";
import { createClient } from "@/lib/supabase";

export default function SettingsPage() {
  const { user, setUser } = useApp();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState("");
  const supabase = createClient();

  useEffect(() => {
    if (user) {
      setFullName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setMessage("");
    
    const { error: profileError } = await supabase
      .from("profiles")
      .update({ full_name: fullName, email: email })
      .eq("id", user.id);

    if (!profileError) {
      setUser(prev => ({ ...prev, name: fullName, email: email }));
      setMessage("Settings saved successfully! ✅");
    } else {
      setMessage("Error updating profile configuration row. ❌");
    }
    setUpdating(false);
  };

  const inputStyle = { width: "100%", padding: "12px 14px", background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, color: "#fff", fontSize: 14, outline: "none", marginBottom: 20 };

  return (
    <div style={{ padding: "36px 40px", background: "#000", minHeight: "100vh", maxWidth: 600 }}>
      <div style={{ marginBottom: 32 }}>
        <div className="section-label">System Control</div>
        <h1 className="page-title">Settings</h1>
      </div>

      <form onSubmit={handleSave} style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 32 }}>
        <label className="section-label">Full Name</label>
        <input style={inputStyle} value={fullName} onChange={e => setFullName(e.target.value)} />

        <label className="section-label">Email Address</label>
        <input style={inputStyle} value={email} onChange={e => setEmail(e.target.value)} />

        {message && <div style={{ fontSize: 13, color: "#22c00d", marginBottom: 16 }}>{message}</div>}

        <button type="submit" disabled={updating} className="btn-primary" style={{ width: "100%", padding: 14, borderRadius: 10, fontSize: 14, cursor: "pointer" }}>
          {updating ? "Saving Changes…" : "Save Settings →"}
        </button>
      </form>
    </div>
  );
}