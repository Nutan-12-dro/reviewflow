"use client";
import { useApp } from "../layout";

export default function DashboardPage() {
  const { user, campaigns } = useApp();
  const isAdmin = user?.role === "admin" || user?.role === "manager";
  const visibleCampaigns = isAdmin ? campaigns : campaigns.filter(c => c.reviewer === user?.name);
  const active = visibleCampaigns.filter(c => c.status === "active");
  const completed = visibleCampaigns.filter(c => c.status === "completed");
  const urgent = active.filter(c => c.priority === "urgent" || c.priority === "high");

  const stats = [
    { label: "Active Campaigns",    value: active.length,    icon: "◉", color: "#22c00d", bg: "rgba(16,185,129,0.1)"  },
    { label: "Completed",           value: completed.length, icon: "✓", color: "#22c00d", bg: "rgba(16,185,129,0.1)"  },
    { label: "Urgent / High",       value: urgent.length,    icon: "↑", color: "#f5260b", bg: "rgba(245,158,11,0.1)"  },
    { label: "Total Campaigns",     value: visibleCampaigns.length, icon: "▦", color: "#e5e7eb", bg: "rgba(255,255,255,0.05)"  },
  ];

  const priorityColor = { urgent: "#ef4444", high: "#f59e0b", medium: "#22c00d", low: "#5a6480" };

  return (
    <div style={{ padding: 32, backgroundColor: "#000000", minHeight: "100vh", color: "#ffffff" }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", color: "#a3a3a3", marginBottom: 6 }}>
          {isAdmin ? "Manager Overview" : "Reviewer Dashboard"}
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0, letterSpacing: -0.5, color: "#ffffff" }}>
          Good to see you, {user?.name?.split(" ")[0] || "Nutan"} 👋
        </h1>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 36 }}>
        {stats.map((s, i) => (
          <div key={i} style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: "20px 22px" }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, color: s.color, marginBottom: 14 }}>{s.icon}</div>
            <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: -1, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 12, color: "#a3a3a3", marginTop: 4, fontWeight: 500 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}