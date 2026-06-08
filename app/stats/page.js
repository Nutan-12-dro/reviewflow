"use client";
import { useApp } from "../layout";

export default function StatsPage() {
  const { campaigns } = useApp();

  const reviewerMap = {};
  campaigns.forEach(c => {
    if (!c.reviewer) return;
    if (!reviewerMap[c.reviewer]) reviewerMap[c.reviewer] = { name: c.reviewer, total: 0, completed: 0, active: 0 };
    reviewerMap[c.reviewer].total++;
    if (c.status === "completed") reviewerMap[c.reviewer].completed++;
    if (c.status === "active")    reviewerMap[c.reviewer].active++;
  });
  const reviewers = Object.values(reviewerMap);

  return (
    <div style={{ padding: 32 }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", color: "#2e3348", marginBottom: 6 }}>Analytics</div>
        <h1 style={{ fontSize: 26, fontWeight: 700, margin: "0 0 4px", letterSpacing: -0.5 }}>Reviewer Stats</h1>
        <p style={{ fontSize: 14, color: "#5a6480", margin: 0 }}>Track performance across your review team</p>
      </div>

      {reviewers.length === 0 ? (
        <div style={{ background: "#0a0c12", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "60px 20px", textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📊</div>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>No data yet</div>
          <div style={{ fontSize: 13, color: "#3a4055" }}>Create campaigns and assign reviewers — stats will appear here.</div>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {reviewers.map((r, i) => {
            const pct = r.total ? Math.round((r.completed / r.total) * 100) : 0;
            const initials = r.name.split(" ").map(n => n[0]).join("");
            const colors = ["#4f7cff","#10b981","#f59e0b","#8b5cf6","#ef4444"];
            const color = colors[i % colors.length];
            return (
              <div key={i} style={{ background: "#0a0c12", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "20px 24px", display: "flex", alignItems: "center", gap: 20 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}18`, border: `1px solid ${color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color, flexShrink: 0 }}>
                  {initials}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{r.name}</div>
                  <div style={{ height: 6, background: "#141820", borderRadius: 3, marginBottom: 6 }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 3, transition: "width 0.5s" }} />
                  </div>
                  <div style={{ fontSize: 12, color: "#3a4055", display: "flex", gap: 16 }}>
                    <span>{r.total} assigned</span>
                    <span style={{ color: "#10b981" }}>{r.completed} completed</span>
                    <span style={{ color: "#4f7cff" }}>{r.active} active</span>
                    <span style={{ marginLeft: "auto", fontWeight: 600, color }}>{pct}% completion rate</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}