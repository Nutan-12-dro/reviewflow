"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "../../layout";

export default function CompletedCampaignsPage() {
  const { user, campaigns } = useApp();
  const router = useRouter();

  const roleString = (user?.role || "admin").toLowerCase().trim();
  const isAdmin = roleString === "admin" || roleString === "manager";

  useEffect(() => {
    if (user && !isAdmin) router.push("/reviewer");
  }, [user, isAdmin, router]);

  if (!user || !isAdmin) return null;

  const completed = (campaigns || []).filter(c => c.status === "completed");

  return (
    <div style={{ padding: "36px 40px", background: "#000", minHeight: "100vh" }}>
      <div style={{ marginBottom: 28 }}>
        <div className="section-label">Records</div>
        <h1 className="page-title">Completed Campaigns</h1>
      </div>

      <div style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, overflow: "hidden" }}>
        {completed.map(c => (
          <div key={c.id} style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.04)", display: "flex", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>{c.title}</div>
              <div style={{ fontSize: 11, color: "#555" }}>Reviewer: {c.reviewer}</div>
            </div>
            <span style={{ color: "#22c00d", fontWeight: 600 }}>{c.budget}</span>
          </div>
        ))}
      </div>
    </div>
  );
}