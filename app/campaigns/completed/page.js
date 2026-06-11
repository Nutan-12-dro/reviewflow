"use client";
import { useState, useMemo } from "react";
import { useApp } from "../../layout"; 

const priorityColor = { urgent: "#ef4444", high: "#f59e0b", medium: "#22c00d", low: "#555555" };

export default function CompletedCampaignsPage() {
  const { campaigns } = useApp(); 

  const [search, setSearch]                 = useState("");
  const [sortBy, setSortBy]                 = useState("newest");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterReviewer, setFilterReviewer] = useState("all");
  const [minBudget, setMinBudget]           = useState("");
  const [maxBudget, setMaxBudget]           = useState("");
  const [fromDate, setFromDate]             = useState("");
  const [toDate, setToDate]                 = useState("");

  const completed = (campaigns || []).filter(c => c.status === "completed");
  const reviewers = [...new Set(completed.map(c => c.reviewer))].filter(Boolean);

  const filtered = useMemo(() => {
    return completed
      .filter(c => {
        const q = search.toLowerCase();
        if (q && !c.title?.toLowerCase().includes(q) && !c.reviewer?.toLowerCase().includes(q)) return false;
        if (filterPriority !== "all" && c.priority !== filterPriority) return false;
        if (filterReviewer !== "all" && c.reviewer !== filterReviewer) return false;
        const budget = parseFloat((c.budget || "0").replace(/[^0-9.]/g, ""));
        if (minBudget && budget < parseFloat(minBudget)) return false;
        if (maxBudget && budget > parseFloat(maxBudget)) return false;
        if (fromDate && new Date(c.completed_at) < new Date(fromDate)) return false;
        if (toDate && new Date(c.completed_at) > new Date(toDate)) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "newest")   return new Date(b.completed_at) - new Date(a.completed_at);
        if (sortBy === "oldest")   return new Date(a.completed_at) - new Date(b.completed_at);
        if (sortBy === "priority") return ["urgent","high","medium","low"].indexOf(a.priority) - ["urgent","high","medium","low"].indexOf(b.priority);
        if (sortBy === "az")       return a.title?.localeCompare(b.title);
        return 0;
      });
  }, [completed, search, sortBy, filterPriority, filterReviewer, minBudget, maxBudget, fromDate, toDate]);

  const totalBudget = filtered.reduce((sum, c) => {
    const n = parseFloat((c.budget || "0").replace(/[^0-9.]/g, ""));
    return sum + (isNaN(n) ? 0 : n);
  }, 0);

  const clearFilters = () => {
    setSearch(""); setSortBy("newest"); setFilterPriority("all");
    setFilterReviewer("all"); setMinBudget(""); setMaxBudget("");
    setFromDate(""); setToDate("");
  };

  const inputStyle = { width: "100%", padding: "10px 12px", background: "#000", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, color: "#fff", fontSize: 13, outline: "none" };

  return (
    <div style={{ padding: "36px 40px", background: "#000", minHeight: "100vh" }}>
      <div style={{ marginBottom: 28 }}>
        <div className="section-label">Records</div>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 12 }}>
          <div>
            <h1 className="page-title">Completed Campaigns</h1>
            <p style={{ fontSize: 14, color: "#555", margin: 0 }}>
              Filtered budget: <strong style={{ color: "#22c00d" }}>${totalBudget.toLocaleString()}</strong>
            </p>
          </div>
          <button onClick={clearFilters} className="btn-ghost" style={{ padding: "9px 16px", borderRadius: 8, fontSize: 13, cursor: "pointer" }}>✕ Reset</button>
        </div>
      </div>

      <div style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: 20, marginBottom: 24 }}>
        <div style={{ marginBottom: 16 }}>
          <label className="section-label">Search Context</label>
          <input placeholder="Search by name..." value={search} onChange={e => setSearch(e.target.value)} style={inputStyle} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={inputStyle}>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="priority">Priority</option>
          </select>
          <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)} style={inputStyle}>
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
          </select>
          <select value={filterReviewer} onChange={e => setFilterReviewer(e.target.value)} style={inputStyle}>
            <option value="all">All Reviewers</option>
            {reviewers.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <input type="number" placeholder="Min Budget" value={minBudget} onChange={e => setMinBudget(e.target.value)} style={inputStyle} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          <input type="number" placeholder="Max Budget" value={maxBudget} onChange={e => setMaxBudget(e.target.value)} style={inputStyle} />
          <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} style={inputStyle} />
          <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} style={inputStyle} />
        </div>
      </div>

      <div style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, overflow: "hidden" }}>
        {filtered.map(c => (
          <div key={c.id} style={{ display: "flex", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
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