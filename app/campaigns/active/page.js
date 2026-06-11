"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "../../layout";

const PC = { urgent: "#ef4444", high: "#f59e0b", medium: "#22c00d", low: "#555" };

export default function ActiveCampaignsPage() {
  const { campaigns, deleteCampaign, updateCampaign, user } = useApp();
  const router = useRouter();
  
  const [search, setSearch] = useState("");
  const [editingReviewer, setEditingReviewer] = useState(null);

  const roleString = (user?.role || "admin").toLowerCase().trim();
  const isAdmin = roleString === "admin" || roleString === "manager";

  useEffect(() => {
    if (user && !isAdmin) router.push("/reviewer");
  }, [user, isAdmin, router]);

  if (!user || !isAdmin) return null;

  const active = (campaigns || [])
    .filter(c => c.status === "active")
    .filter(c => c.title?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ padding: "36px 40px", background: "#000", minHeight: "100vh" }}>
      <div style={{ marginBottom: 28 }}>
        <div className="section-label">Campaign Management</div>
        <h1 className="page-title">Active Campaigns</h1>
      </div>

      <input placeholder="Search active records…" value={search} onChange={e => setSearch(e.target.value)} style={{ width: "100%", padding: "10px 14px", background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, color: "#fff", marginBottom: 24, outline: "none" }} />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px,1fr))", gap: 16 }}>
        {active.map(c => (
          <div key={c.id} className="card-hover" style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: 24, position: "relative" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: PC[c.priority] || "#333" }} />
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>{c.title}</div>
              <button onClick={() => deleteCampaign(c.id)} className="btn-danger" style={{ width: 32, height: 32, borderRadius: 8, cursor: "pointer" }}>🗑</button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                <span>👤 {c.reviewer}</span>
                <button onClick={() => setEditingReviewer(c.id)} className="btn-ghost" style={{ padding: "3px 8px", borderRadius: 6, fontSize: 11, cursor: "pointer" }}>Change</button>
              </div>
              {editingReviewer === c.id && (
                <select value={c.reviewer} onChange={async e => { await updateCampaign(c.id, { reviewer: e.target.value }); setEditingReviewer(null); }} style={{ background: "#000", border: "1px solid #22c00d", color: "#fff", padding: 4, borderRadius: 6 }}>
                  <option value="Nutan">Nutan</option>
                  <option value="Jazee">Jazee</option>
                </select>
              )}
              <div style={{ fontSize: 13, color: "#a3a3a3" }}>💰 Budget: <span style={{ color: "#22c00d" }}>{c.budget}</span></div>
              <div style={{ fontSize: 13, color: "#a3a3a3" }}>📅 Due: {c.deadline}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}