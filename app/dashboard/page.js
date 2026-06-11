"use client";
import { useState, useEffect } from "react";
import { useApp } from "../layout";
import Link from "next/link";

export default function DashboardPage() {
  const { user, campaigns } = useApp();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const allCampaigns = campaigns || [];
  const active       = allCampaigns.filter(c => c.status === "active");
  const completed    = allCampaigns.filter(c => c.status === "completed");
  const urgent       = active.filter(c => c.priority === "urgent" || c.priority === "high");

  const priorityColor = { urgent: "#ef4444", high: "#f59e0b", medium: "#22c00d", low: "#555555" };

  const stats = [
    { label: "Active Campaigns", value: active.length,    icon: "◉", color: "#22c00d", bg: "rgba(34,192,13,0.1)",    border: "rgba(34,192,13,0.2)"    },
    { label: "Completed",        value: completed.length, icon: "✓", color: "#22c00d", bg: "rgba(34,192,13,0.06)",   border: "rgba(34,192,13,0.12)"   },
    { label: "Urgent / High",    value: urgent.length,    icon: "↑", color: "#f59e0b", bg: "rgba(245,158,11,0.1)",   border: "rgba(245,158,11,0.2)"   },
    { label: "Total Campaigns",  value: allCampaigns.length, icon: "▦", color: "#a3a3a3", bg: "rgba(255,255,255,0.04)", border: "rgba(255,255,255,0.08)" },
  ];

  if (!mounted) return null;

  return (
    <div style={{ padding: "36px 40px", background: "#000", minHeight: "100vh" }}>
      <div style={{ marginBottom: 36 }}>
        <div className="section-label">Manager Overview</div>
        <h1 className="page-title">Good to see you, {user?.name || "Nutan"} 👋</h1>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 40 }}>
        {stats.map((s, i) => (
          <div key={i} className="card-hover" style={{ background: "#0a0a0a", border: `1px solid ${s.border}`, borderRadius: 14, padding: "24px 22px" }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: s.bg, border: `1px solid ${s.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: s.color, marginBottom: 16 }}>{s.icon}</div>
            <div style={{ fontSize: 36, fontWeight: 800, color: s.color, fontFamily: "'Inter', sans-serif", letterSpacing: "-0.5px", lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 12, color: "#555", marginTop: 6, fontWeight: 500 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>Recent Active</span>
            <Link href="/campaigns/active" style={{ fontSize: 12, color: "#22c00d", textDecoration: "none" }}>View all →</Link>
          </div>
          {active.length === 0 ? (
            <div className="empty-state"><div className="empty-state-title">No active campaigns</div></div>
          ) : (
            active.slice(0, 5).map(c => (
              <div key={c.id} style={{ padding: "13px 20px", borderBottom: "1px solid rgba(255,255,255,0.04)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{c.title}</div>
                  <div style={{ fontSize: 11, color: "#555" }}>→ {c.reviewer} · Due {c.deadline}</div>
                </div>
                <span className="badge" style={{ color: priorityColor[c.priority] || "#555", background: `${priorityColor[c.priority] || "#555"}15` }}>{c.priority}</span>
              </div>
            ))
          )}
        </div>

        <div style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>Recently Completed</span>
            <Link href="/campaigns/completed" style={{ fontSize: 12, color: "#22c00d", textDecoration: "none" }}>View all →</Link>
          </div>
          {completed.length === 0 ? (
            <div className="empty-state"><div className="empty-state-title">No completed campaigns</div></div>
          ) : (
            completed.slice(0, 5).map(c => (
              <div key={c.id} style={{ padding: "13px 20px", borderBottom: "1px solid rgba(255,255,255,0.04)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{c.title}</div>
                  <div style={{ fontSize: 11, color: "#555" }}>Completed</div>
                </div>
                <span className="badge" style={{ color: "#22c00d", background: "rgba(34,192,13,0.1)" }}>DONE</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}