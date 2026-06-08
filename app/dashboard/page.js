"use client";
import { useApp } from "../layout";

export default function DashboardPage() {
  const { user, campaigns } = useApp();

  const active    = campaigns.filter(c => c.status === "active");
  const completed = campaigns.filter(c => c.status === "completed");
  const urgent    = active.filter(c => c.priority === "urgent" || c.priority === "high");

  const stats = [
    { label: "Active Campaigns",    value: active.length,    icon: "◉", color: "#22c00d", bg: "rgba(79,124,255,0.1)"  },
    { label: "Completed",           value: completed.length, icon: "✓", color: "#10b981", bg: "rgba(16,185,129,0.1)"  },
    { label: "Urgent / High",       value: urgent.length,    icon: "↑", color: "#f59e0b", bg: "rgba(245,158,11,0.1)"  },
    { label: "Total Campaigns",     value: campaigns.length, icon: "▦", color: "#8b5cf6", bg: "rgba(139,92,246,0.1)"  },
  ];

  const priorityColor = { urgent: "#ef4444", high: "#f59e0b", medium: "#22c00d", low: "#5a6480" };

  return (
    <div style={{ padding: 32 }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", color: "#2e3348", marginBottom: 6 }}>
          Manager Overview
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0, letterSpacing: -0.5 }}>
          Good to see you, {user?.name?.split(" ")[0]} 👋
        </h1>
      </div>

      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 36 }}>
        {stats.map((s, i) => (
          <div key={i} style={{
            background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 14, padding: "20px 22px",
            transition: "border-color 0.2s",
          }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: s.bg, display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: 17, color: s.color,
              marginBottom: 14,
            }}>{s.icon}</div>
            <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: -1, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 12, color: "#3a4055", marginTop: 4, fontWeight: 500 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Campaigns */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Active */}
        <div style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13, fontWeight: 700 }}>Recent Active Campaigns</span>
            <a href="/campaigns/active" style={{ fontSize: 12, color: "#22c00d", textDecoration: "none" }}>View all →</a>
          </div>
          {active.length === 0 ? (
            <div style={{ padding: "32px 20px", textAlign: "center", color: "#2e3348", fontSize: 13 }}>
              No active campaigns yet.<br />
              <a href="/campaigns/create" style={{ color: "#22c00d", textDecoration: "none", fontWeight: 500 }}>Create your first →</a>
            </div>
          ) : (
            active.slice(0, 4).map(c => (
              <div key={c.id} style={{ padding: "13px 20px", borderBottom: "1px solid rgba(255,255,255,0.04)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{c.title}</div>
                  <div style={{ fontSize: 11, color: "#3a4055" }}>→ {c.reviewer} · Due {c.deadline}</div>
                </div>
                <span style={{
                  fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 6,
                  color: priorityColor[c.priority] || "#5a6480",
                  background: `${priorityColor[c.priority]}18` || "rgba(90,100,128,0.1)",
                }}>
                  {c.priority?.toUpperCase()}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Completed */}
        <div style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13, fontWeight: 700 }}>Recently Completed</span>
            <a href="/campaigns/completed" style={{ fontSize: 12, color: "#22c00d", textDecoration: "none" }}>View all →</a>
          </div>
          {completed.length === 0 ? (
            <div style={{ padding: "32px 20px", textAlign: "center", color: "#2e3348", fontSize: 13 }}>
              No completed campaigns yet.
            </div>
          ) : (
            completed.slice(0, 4).map(c => (
              <div key={c.id} style={{ padding: "13px 20px", borderBottom: "1px solid rgba(255,255,255,0.04)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{c.title}</div>
                  <div style={{ fontSize: 11, color: "#3a4055" }}>Completed {new Date(c.completedAt).toLocaleDateString()}</div>
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 6, color: "#10b981", background: "rgba(16,185,129,0.12)" }}>DONE</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}