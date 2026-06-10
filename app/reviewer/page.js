"use client";
import { useState } from "react";
import { useApp } from "../layout";

const priorityColor = { urgent: "#ef4444", high: "#f59e0b", medium: "#22c00d", low: "#a3a3a3" };

export default function ReviewerPage() {
  const { user, campaigns, completeCampaign } = useApp();
  const [confirmId, setConfirmId] = useState(null);
  const [notes, setNotes] = useState("");

  const myCampaigns = campaigns.filter(c =>
    c.status === "active" &&
    c.reviewer?.toLowerCase() === user?.name?.toLowerCase()
  );

  const handleComplete = (id) => {
    completeCampaign(id);
    setConfirmId(null);
    setNotes("");
  };

  return (
    <div style={{ padding: 32, background: "#000000", minHeight: "100vh" }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", color: "#a3a3a3", marginBottom: 6 }}>Reviewer Panel</div>
        <h1 style={{ fontSize: 26, fontWeight: 700, margin: "0 0 6px", letterSpacing: -0.5, color: "#ffffff" }}>
          Hey {user?.name?.split(" ")[0]} 👋
        </h1>
        <p style={{ fontSize: 14, color: "#a3a3a3", margin: 0 }}>
          You have <strong style={{ color: "#22c00d" }}>{myCampaigns.length}</strong> campaign{myCampaigns.length !== 1 ? "s" : ""} assigned to you
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 28 }}>
        {[
          { label: "Assigned to me", value: myCampaigns.length, color: "#22c00d", icon: "◉" },
          { label: "Urgent / High", value: myCampaigns.filter(c => c.priority === "urgent" || c.priority === "high").length, color: "#f59e0b", icon: "↑" },
          { label: "Completed", value: campaigns.filter(c => c.status === "completed" && c.reviewer?.toLowerCase() === user?.name?.toLowerCase()).length, color: "#22c00d", icon: "✓" },
        ].map((s, i) => (
          <div key={i} style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "18px 20px" }}>
            <div style={{ fontSize: 22, marginBottom: 10, color: s.color }}>{s.icon}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 12, color: "#a3a3a3", marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Campaign Cards */}
      {myCampaigns.length === 0 ? (
        <div style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "60px 20px", textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🎉</div>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6, color: "#ffffff" }}>All caught up!</div>
          <div style={{ fontSize: 13, color: "#a3a3a3" }}>No campaigns assigned to you right now.</div>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
          {myCampaigns.map(c => (
            <div key={c.id} style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: 22, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: priorityColor[c.priority] || "#a3a3a3" }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div style={{ fontSize: 15, fontWeight: 700, flex: 1, paddingRight: 10, color: "#ffffff" }}>{c.title}</div>
                <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 6, textTransform: "uppercase", color: priorityColor[c.priority], background: `${priorityColor[c.priority]}18`, border: `1px solid ${priorityColor[c.priority]}30`, flexShrink: 0 }}>{c.priority}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 16 }}>
                <div style={{ fontSize: 12, color: "#a3a3a3" }}>💰 {c.budget}</div>
                <div style={{ fontSize: 12, color: "#a3a3a3" }}>📅 Due {c.deadline}</div>
              </div>
              <div style={{ height: 1, background: "rgba(255,255,255,0.06)", marginBottom: 14 }} />
              <button onClick={() => setConfirmId(c.id)} style={{ width: "100%", padding: "9px 0", background: "rgba(34,192,13,0.1)", color: "#22c00d", border: "1px solid rgba(34,192,13,0.25)", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                ✓ Mark as Reviewed
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Confirm Modal */}
      {confirmId && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: 28, width: 400, maxWidth: "100%" }}>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 10, color: "#ffffff" }}>Mark as Reviewed?</div>
            <div style={{ fontSize: 14, color: "#a3a3a3", marginBottom: 16 }}>Add an optional note before completing.</div>
            <textarea
              placeholder="e.g. Reviewed and approved..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              style={{ width: "100%", padding: "10px 12px", background: "#000000", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#ffffff", fontSize: 14, resize: "vertical", minHeight: 80, outline: "none", fontFamily: "inherit", boxSizing: "border-box", marginBottom: 16 }}
            />
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => { setConfirmId(null); setNotes(""); }} style={{ padding: "9px 18px", background: "none", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#a3a3a3", fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
              <button onClick={() => handleComplete(confirmId)} style={{ padding: "9px 18px", background: "#22c00d", border: "none", borderRadius: 10, color: "#000000", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>✓ Complete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}