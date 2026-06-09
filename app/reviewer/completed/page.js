"use client";
import { useApp } from "../../layout";

export default function ReviewerCompletedPage() {
  const { user, campaigns } = useApp();
  const completed = campaigns.filter(c =>
    c.status === "completed" &&
    c.reviewer?.toLowerCase() === user?.name?.toLowerCase()
  ).sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));

  return (
    <div style={{ padding: 32, background: "#000000", minHeight: "100vh" }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", color: "#a3a3a3", marginBottom: 6 }}>Your Records</div>
        <h1 style={{ fontSize: 26, fontWeight: 700, margin: "0 0 4px", letterSpacing: -0.5, color: "#ffffff" }}>Completed Campaigns</h1>
        <p style={{ fontSize: 14, color: "#a3a3a3", margin: 0 }}>{completed.length} campaign{completed.length !== 1 ? "s" : ""} completed by you</p>
      </div>

      {completed.length === 0 ? (
        <div style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "60px 20px", textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🏁</div>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6, color: "#ffffff" }}>No completed campaigns yet</div>
          <div style={{ fontSize: 13, color: "#a3a3a3" }}>Mark campaigns as reviewed and they'll appear here.</div>
        </div>
      ) : (
        <div style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", padding: "11px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", fontSize: 11, fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase", color: "#a3a3a3" }}>
            <span>Campaign</span><span>Budget</span><span>Priority</span><span>Completed</span>
          </div>
          {completed.map(c => (
            <div key={c.id} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.04)", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#ffffff" }}>{c.title}</div>
                {c.notes && <div style={{ fontSize: 12, color: "#a3a3a3", marginTop: 2, fontStyle: "italic" }}>"{c.notes}"</div>}
              </div>
              <span style={{ fontSize: 13, color: "#a3a3a3" }}>{c.budget}</span>
              <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 6, textTransform: "uppercase", color: "#22c00d", background: "rgba(34,192,13,0.1)", display: "inline-block" }}>{c.priority}</span>
              <span style={{ fontSize: 12, color: "#22c00d" }}>{new Date(c.completedAt).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}