"use client";
import { useState } from "react";
import { useApp } from "../../layout";

const priorityColor  = { urgent: "#ef4444", high: "#f59e0b", medium: "#22c00d", low: "#5a6480" };
const priorityOrder  = { urgent: 0, high: 1, medium: 2, low: 3 };

export default function ActiveCampaignsPage() {
  const { campaigns, completeCampaign, deleteCampaign, user } = useApp();
  const [confirmId, setConfirmId] = useState(null);
  const [search, setSearch]       = useState("");
  const [sortBy, setSortBy]       = useState("newest");

  const active = campaigns
    .filter(c => c.status === "active")
    .filter(c => c.title.toLowerCase().includes(search.toLowerCase()) || c.reviewer?.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "newest")   return b.id - a.id;
      if (sortBy === "oldest")   return a.id - b.id;
      if (sortBy === "priority") return priorityOrder[a.priority] - priorityOrder[b.priority];
      if (sortBy === "deadline") return new Date(a.deadline) - new Date(b.deadline);
      return 0;
    });

  const handleComplete = (id) => {
    completeCampaign(id);
    setConfirmId(null);
  };

  return (
    <div style={{ padding: 32 }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", color: "#2e3348", marginBottom: 6 }}>Campaign Management</div>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 700, margin: "0 0 4px", letterSpacing: -0.5 }}>Active Campaigns</h1>
            <p style={{ fontSize: 14, color: "#5a6480", margin: 0 }}>{active.length} campaign{active.length !== 1 ? "s" : ""} in progress</p>
          </div>
          <a href="/campaigns/create" style={{
            padding: "10px 18px", background: "linear-gradient(135deg, #22c00d, #6366f1)",
            color: "white", borderRadius: 10, fontSize: 13, fontWeight: 600,
            textDecoration: "none", boxShadow: "0 4px 16px rgba(79,124,255,0.3)",
          }}>＋ New Campaign</a>
        </div>
      </div>

      {/* Toolbar */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, alignItems: "center" }}>
        <input
          placeholder="Search campaigns or reviewers…"
          value={search} onChange={e => setSearch(e.target.value)}
          style={{
            flex: 1, padding: "10px 14px", background: "#0a0a0a",
            border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10,
            color: "#e8eaf2", fontSize: 13, outline: "none", fontFamily: "inherit",
          }}
        />
        <select
          value={sortBy} onChange={e => setSortBy(e.target.value)}
          style={{
            padding: "10px 14px", background: "#0a0a0a",
            border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10,
            color: "#e8eaf2", fontSize: 13, outline: "none",
            fontFamily: "inherit", cursor: "pointer",
          }}
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="priority">By priority</option>
          <option value="deadline">By deadline</option>
        </select>
      </div>

      {/* Empty state */}
      {active.length === 0 && (
        <div style={{
          background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 14, padding: "60px 20px", textAlign: "center",
        }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>
            {search ? "No campaigns match your search" : "No active campaigns yet"}
          </div>
          <div style={{ fontSize: 13, color: "#3a4055", marginBottom: 20 }}>
            {search ? "Try a different search term" : "Create your first campaign to get started"}
          </div>
          {!search && (
            <a href="/campaigns/create" style={{ color: "#22c00d", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
              Create Campaign →
            </a>
          )}
        </div>
      )}

      {/* Campaign Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
        {active.map(c => (
          <div key={c.id} style={{
            background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 14, padding: 22, transition: "border-color 0.2s",
            position: "relative", overflow: "hidden",
          }}>
            {user?.role === "admin" && (
  <button
    onClick={() => deleteCampaign(c.id)}
    title="Delete Campaign"
    style={{ 
      position: "absolute", 
      top: 16, 
      right: 16, 
      background: "rgba(239, 68, 68, 0.1)", 
      color: "#ef4444", 
      border: "1px solid rgba(239, 68, 68, 0.2)", 
      borderRadius: 8, 
      width: 32, 
      height: 32, 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center", 
      cursor: "pointer", 
      transition: "all 0.2s" 
    }}
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
      <line x1="10" y1="11" x2="10" y2="17"></line>
      <line x1="14" y1="11" x2="14" y2="17"></line>
    </svg>
  </button>
)}
            {/* Priority stripe */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: priorityColor[c.priority] || "#2e3348", opacity: 0.7 }} />

            {/* Top row */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div style={{ flex: 1, paddingRight: 10 }}>
                <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 3, lineHeight: 1.3 }}>{c.title}</div>
              </div>
              <span style={{
                fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 6,
                textTransform: "uppercase", flexShrink: 0,
                color: priorityColor[c.priority] || "#5a6480",
                background: `${priorityColor[c.priority]}15` || "rgba(90,100,128,0.1)",
                border: `1px solid ${priorityColor[c.priority]}30`,
              }}>{c.priority}</span>
            </div>

            {/* Meta */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
              <div style={{ display: "flex", gap: 6, alignItems: "center", fontSize: 12, color: "#5a6480" }}>
                <span>👤</span>
                <span>{c.reviewer}</span>
              </div>
              <div style={{ display: "flex", gap: 6, alignItems: "center", fontSize: 12, color: "#5a6480" }}>
                <span>💰</span>
                <span>{c.budget}</span>
              </div>
              <div style={{ display: "flex", gap: 6, alignItems: "center", fontSize: 12, color: "#5a6480" }}>
                <span>📅</span>
                <span>Due {c.deadline}</span>
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: "rgba(255,255,255,0.05)", marginBottom: 14 }} />

            {/* Actions */}
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => setConfirmId(c.id)}
                style={{
                  flex: 1, padding: "8px 0",
                  background: "rgba(16,185,129,0.1)", color: "#10b981",
                  border: "1px solid rgba(16,185,129,0.25)", borderRadius: 8,
                  fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                  transition: "all 0.15s",
                }}
              >✓ Mark Complete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Confirm Modal */}
      {confirmId && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 28, width: 380, maxWidth: "100%" }}>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>Mark as Complete?</div>
            <div style={{ fontSize: 14, color: "#5a6480", marginBottom: 24 }}>
              This campaign will move to Completed Campaigns. This action can't be undone.
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => setConfirmId(null)} style={{ padding: "9px 18px", background: "none", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, color: "#5a6480", fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>
                Cancel
              </button>
              <button onClick={() => handleComplete(confirmId)} style={{ padding: "9px 18px", background: "#10b981", border: "none", borderRadius: 10, color: "white", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                ✓ Yes, Complete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}