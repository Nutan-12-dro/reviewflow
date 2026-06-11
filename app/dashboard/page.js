"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "../layout";
import Link from "next/link";

export default function DashboardPage() {
  const { user, campaigns } = useApp();
  const router = useRouter();

  // 🛡️ FIXED: Absolute block if user isn't fully loaded as an admin
  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/reviewer");
    }
  }, [user, router]);

  if (!user || user.role !== "admin") {
    return null; 
  }

  const allCampaigns = campaigns || [];
  const active       = allCampaigns.filter(c => c.status === "active");
  const completed    = allCampaigns.filter(c => c.status === "completed");
  const urgent       = active.filter(c => c.priority === "urgent" || c.priority === "high");

  const priorityColor = {
    urgent: "#ef4444",
    high:   "#f59e0b",
    medium: "#22c00d",
    low:    "#555555",
  };

  const stats = [
    { label: "Active Campaigns", value: active.length,    icon: "◉", color: "#22c00d", bg: "rgba(34,192,13,0.1)",    border: "rgba(34,192,13,0.2)"    },
    { label: "Completed",        value: completed.length, icon: "✓", color: "#22c00d", bg: "rgba(34,192,13,0.06)",   border: "rgba(34,192,13,0.12)"   },
    { label: "Urgent / High",    value: urgent.length,    icon: "↑", color: "#f59e0b", bg: "rgba(245,158,11,0.1)",   border: "rgba(245,158,11,0.2)"   },
    { label: "Total Campaigns",  value: allCampaigns.length, icon: "▦", color: "#a3a3a3", bg: "rgba(255,255,255,0.04)", border: "rgba(255,255,255,0.08)" },
  ];

  return (
    <div style={{ padding: "36px 40px", background: "#000", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <div className="section-label">Manager Overview</div>
        <h1 className="page-title">
          Good to see you, {user?.name?.split(" ")[0]} 👋
        </h1>
        <p style={{ fontSize: 14, color: "#555", marginTop: 4 }}>
          {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
        </p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 40 }}>
        {stats.map((s, i) => (
          <div key={i} className="card-hover" style={{
            background: "#0a0a0a",
            border: `1px solid ${s.border}`,
            borderRadius: 14,
            padding: "24px 22px",
            cursor: "default",
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: s.bg, border: `1px solid ${s.border}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18, color: s.color, marginBottom: 16,
            }}>{s.icon}</div>
            {/* 🛡️ FIXED: Swapped font-family to clean standard numbers */}
            <div className="stat-number" style={{
              fontSize: 36, fontWeight: 800, color: s.color,
              fontFamily: "'Inter', sans-serif", letterSpacing: "-0.5px", lineHeight: 1,
            }}>{s.value}</div>
            <div style={{ fontSize: 12, color: "#555", marginTop: 6, fontWeight: 500, letterSpacing: 0.2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Bottom Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Recent Active */}
        <div style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>Recent Active</span>
            <Link href="/campaigns/active" style={{ fontSize: 12, color: "#22c00d", textDecoration: "none", fontWeight: 500, display: "flex", alignItems: "center", gap: 4 }}>
              View all →
            </Link>
          </div>
          {active.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📋</div>
              <div className="empty-state-title">No active campaigns</div>
              <div className="empty-state-sub">
                <Link href="/campaigns/create" style={{ color: "#22c00d", textDecoration: "none" }}>Create your first →</Link>
              </div>
            </div>
          ) : (
            active.slice(0, 5).map(c => (
              <div key={c.id} style={{
                padding: "13px 20px",
                borderBottom: "1px solid rgba(255,255,255,0.04)",
                display: "flex", justifyContent: "space-between", alignItems: "center",
                transition: "background 0.15s",
              }}
                onMouseEnter={e => e.currentTarget.style.background = "#111"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#fff", marginBottom: 3 }}>{c.title}</div>
                  <div style={{ fontSize: 11, color: "#555" }}>→ {c.reviewer} · Due {c.deadline}</div>
                </div>
                <span className="badge" style={{
                  color: priorityColor[c.priority] || "#555",
                  background: `${priorityColor[c.priority] || "#555"}15`,
                  border: `1px solid ${priorityColor[c.priority] || "#555"}30`,
                }}>{c.priority}</span>
              </div>
            ))
          )}
        </div>

        {/* Recently Completed */}
        <div style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>Recently Completed</span>
            <Link href="/campaigns/completed" style={{ fontSize: 12, color: "#22c00d", textDecoration: "none", fontWeight: 500 }}>
              View all →
            </Link>
          </div>
          {completed.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🏁</div>
              <div className="empty-state-title">No completed campaigns</div>
              <div className="empty-state-sub">Mark active campaigns as complete</div>
            </div>
          ) : (
            completed.slice(0, 5).map(c => (
              <div key={c.id} style={{
                padding: "13px 20px",
                borderBottom: "1px solid rgba(255,255,255,0.04)",
                display: "flex", justifyContent: "space-between", alignItems: "center",
                transition: "background 0.15s",
              }}
                onMouseEnter={e => e.currentTarget.style.background = "#111"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#fff", marginBottom: 3 }}>{c.title}</div>
                  <div style={{ fontSize: 11, color: "#555" }}>
                    Completed {c.completed_at ? new Date(c.completed_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—"}
                  </div>
                </div>
                <span className="badge" style={{ color: "#22c00d", background: "rgba(34,192,13,0.1)", border: "1px solid rgba(34,192,13,0.2)" }}>DONE</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}