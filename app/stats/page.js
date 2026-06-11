"use client";
import { useApp } from "../layout";

export default function ReviewerStatsPage() {
  const { campaigns } = useApp();
  const allCampaigns = campaigns || [];
  const reviewers = ["Nutan", "Jazee"];

  const stats = reviewers.map(r => {
    const data = allCampaigns.filter(c => c.reviewer === r);
    const assigned = data.length;
    const active = data.filter(c => c.status === "active").length;
    const completed = data.filter(c => c.status === "completed").length;
    const rate = assigned > 0 ? Math.round((completed / assigned) * 100) : 0;

    return { name: r, assigned, active, completed, rate };
  });

  return (
    <div style={{ padding: "36px 40px", background: "#000000", minHeight: "100vh" }}>
      <div style={{ marginBottom: 32 }}>
        <div className="section-label">Analytics</div>
        <h1 className="page-title">Reviewer Stats</h1>
        <p style={{ fontSize: 14, color: "#555", marginTop: 4 }}>Track performance across your review team</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 840 }}>
        {stats.map(s => (
          <div key={s.name} style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "20px 24px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(34,192,13,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#22c00d" }}>{s.name[0]}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>{s.name}</div>
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#22c00d" }}>{s.rate}% completion rate</div>
            </div>

            {/* Premium Linear Progress Gauge Line */}
            <div style={{ width: "100%", height: 4, background: "rgba(255,255,255,0.04)", borderRadius: 2, marginBottom: 14, overflow: "hidden" }}>
              <div style={{ width: `${s.rate}%`, height: "100%", background: "#22c00d", borderRadius: 2 }} />
            </div>

            <div style={{ display: "flex", gap: 24, fontSize: 12, color: "#555" }}>
              <div>assigned: <strong style={{ color: "#fff" }}>{s.assigned}</strong></div>
              <div>completed: <strong style={{ color: "#22c00d" }}>{s.completed}</strong></div>
              <div>active: <strong style={{ color: "#f59e0b" }}>{s.active}</strong></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}