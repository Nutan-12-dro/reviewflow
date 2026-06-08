// ── COMPLETED CAMPAIGNS ─────────────────────────────────────────
// Save as: app/campaigns/completed/page.js

"use client";
import { useApp } from "../../layout";

export default function CompletedCampaignsPage() {
  const { campaigns } = useApp();
  const completed = campaigns.filter(c => c.status === "completed").sort((a,b) => new Date(b.completedAt) - new Date(a.completedAt));
  const priorityColor = { urgent: "#ef4444", high: "#f59e0b", medium: "#4f7cff", low: "#5a6480" };

  return (
    <div style={{ padding: 32 }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", color: "#2e3348", marginBottom: 6 }}>Records</div>
        <h1 style={{ fontSize: 26, fontWeight: 700, margin: "0 0 4px", letterSpacing: -0.5 }}>Completed Campaigns</h1>
        <p style={{ fontSize: 14, color: "#5a6480", margin: 0 }}>{completed.length} campaign{completed.length !== 1 ? "s" : ""} completed</p>
      </div>

      {completed.length === 0 ? (
        <div style={{ background: "#0a0c12", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "60px 20px", textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🏁</div>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>No completed campaigns yet</div>
          <div style={{ fontSize: 13, color: "#3a4055" }}>Mark active campaigns as complete and they'll appear here.</div>
        </div>
      ) : (
        <div style={{ background: "#0a0c12", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, overflow: "hidden" }}>
          {/* Table header */}
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", padding: "11px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", fontSize: 11, fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase", color: "#2e3348" }}>
            <span>Campaign</span><span>Reviewer</span><span>Budget</span><span>Priority</span><span>Completed</span>
          </div>
          {completed.map(c => (
            <div key={c.id} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.04)", alignItems: "center", transition: "background 0.15s" }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{c.title}</div>
                <div style={{ fontSize: 11, color: "#3a4055" }}>Created {new Date(c.createdAt).toLocaleDateString()}</div>
              </div>
              <span style={{ fontSize: 13, color: "#5a6480" }}>{c.reviewer}</span>
              <span style={{ fontSize: 13, color: "#5a6480" }}>{c.budget}</span>
              <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 6, textTransform: "uppercase", color: priorityColor[c.priority], background: `${priorityColor[c.priority]}15`, display: "inline-block" }}>
                {c.priority}
              </span>
              <span style={{ fontSize: 12, color: "#10b981" }}>{new Date(c.completedAt).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}