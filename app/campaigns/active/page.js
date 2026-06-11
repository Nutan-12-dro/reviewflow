"use client";
import { useState, useEffect } from "react";
import { useApp } from "../../layout";

const PC = { urgent: "#ef4444", high: "#f59e0b", medium: "#22c00d", low: "#555" };

export default function ActiveCampaignsPage() {
  const { campaigns, completeCampaign, deleteCampaign, updateCampaign } = useApp();
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);

  const active = (campaigns || []).filter(c => c.status === "active" && 
    (c.title?.toLowerCase().includes(search.toLowerCase()) || c.reviewer?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={{ padding: "36px 40px", background: "#000", minHeight: "100vh" }}>
      <div style={{ marginBottom: 28 }}>
        <div className="section-label">Campaign Management</div>
        <h1 className="page-title">Active Campaigns</h1>
        <p style={{ fontSize: 14, color: "#555", marginTop: 4 }}>{active.length} campaign in progress</p>
      </div>

      <input 
        placeholder="Search campaigns or reviewers..." 
        value={search} 
        onChange={e => setSearch(e.target.value)} 
        style={{ width: "100%", maxWith: 520, padding: "12px 16px", background: "#0d0d0d", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, color: "#fff", marginBottom: 24, outline: "none" }} 
      />

      <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 520 }}>
        {active.map(c => (
          <div key={c.id} className="card-hover" style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: 24, position: "relative" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: PC[c.priority] || "#333" }} />
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>{c.title}</div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <button onClick={() => deleteCampaign(c.id)} style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, padding: "6px 10px", color: "#ef4444", cursor: "pointer" }}>🗑</button>
                <span className="badge" style={{ color: PC[c.priority], background: `${PC[c.priority]}15`, border: `1px solid ${PC[c.priority]}30` }}>{c.priority?.toUpperCase()}</span>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13 }}>
                <div style={{ color: "#a3a3a3", display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ color: "#3b82f6" }}>👤</span>
                  {editingId === c.id ? (
                    <select value={c.reviewer} onChange={async e => { await updateCampaign(c.id, { reviewer: e.target.value }); setEditingId(null); }} style={{ background: "#000", border: "1px solid #22c00d", color: "#fff", borderRadius: 6, padding: "2px 6px" }}>
                      <option value="Nutan">Nutan</option>
                      <option value="Jazee">Jazee</option>
                    </select>
                  ) : <span>{c.reviewer}</span>}
                </div>
                {editingId !== c.id && (
                  <button onClick={() => setEditingId(c.id)} className="btn-ghost" style={{ fontSize: 11, padding: "4px 8px", borderRadius: 6, color: "#22c00d" }}>↺ Change</button>
                )}
              </div>
              <div style={{ fontSize: 13, color: "#a3a3a3" }}>💰 <span style={{ marginLeft: 6 }}>{c.budget}</span></div>
              <div style={{ fontSize: 13, color: "#a3a3a3" }}>📅 <span style={{ marginLeft: 6 }}>Due {c.deadline}</span></div>
            </div>

            <button onClick={() => completeCampaign(c.id)} className="btn-primary" style={{ width: "100%", padding: "10px 0", borderRadius: 8, fontSize: 13 }}>✓ Mark as Complete</button>
          </div>
        ))}
      </div>
    </div>
  );
}