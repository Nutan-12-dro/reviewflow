"use client";
import { useState, useEffect, useMemo } from "react";
import { useApp } from "../../layout"; 
import { useRouter } from "next/navigation"; 

const priorityColor = { urgent: "#ef4444", high: "#f59e0b", medium: "#22c00d", low: "#555555" };

export default function CompletedCampaignsPage() {
  const { user, campaigns } = useApp(); 
  const router = useRouter();

  useEffect(() => {
    if (user && user.role !== "admin") {
      router.push("/reviewer");
    }
  }, [user, router]);

  if (user && user.role !== "admin") {
    return null; 
  }

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

  const exportCSV = () => {
    const headers = ["Title", "Reviewer", "Priority", "Budget", "Deadline", "Completed At"];
    const rows = filtered?.map(c => [c.title, c.reviewer, c.priority, c.budget, c.deadline, c.completed_at ? new Date(c.completed_at).toLocaleDateString() : ""]);
    const csv = [headers, ...rows].map(r => r.map(v => `"${v || ""}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "completed-campaigns.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const inputStyle = { width: "100%", padding: "10px 12px", background: "#000", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, color: "#fff", fontSize: 13, outline: "none" };
  const selectStyle = { ...inputStyle, cursor: "pointer" };

  return (
    <div style={{ padding: "36px 40px", background: "#000", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div className="section-label">Records</div>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 className="page-title">Completed Campaigns</h1>
            <p style={{ fontSize: 14, color: "#555", margin: 0 }}>
              {filtered.length} of {completed.length} items found · Total budget: <strong style={{ color: "#22c00d" }}>${totalBudget.toLocaleString()}</strong>
            </p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={clearFilters} className="btn-ghost" style={{ padding: "9px 16px", borderRadius: 8, fontSize: 13, cursor: "pointer" }}>✕ Clear Filters</button>
            <button onClick={exportCSV} style={{ padding: "9px 16px", background: "rgba(34,192,13,0.1)", border: "1px solid rgba(34,192,13,0.25)", borderRadius: 8, color: "#22c00d", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>↓ Export CSV</button>
          </div>
        </div>
      </div>

      {/* Filters Form Container */}
      <div style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: 20, marginBottom: 24 }}>
        <div style={{ marginBottom: 16 }}>
          <label className="section-label">Search Context</label>
          <input placeholder="Search by campaign name or reviewer..." value={search} onChange={e => setSearch(e.target.value)} style={inputStyle} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
          <div>
            <label className="section-label">Sort By</label>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={selectStyle}>
              <option value="newest">Newest completed first</option>
              <option value="oldest">Oldest completed first</option>
              <option value="priority">By priority</option>
              <option value="az">A → Z</option>
            </select>
          </div>
          <div>
            <label className="section-label">Priority</label>
            <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)} style={selectStyle}>
              <option value="all">All priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <div>
            <label className="section-label">Reviewer</label>
            <select value={filterReviewer} onChange={e => setFilterReviewer(e.target.value)} style={selectStyle}>
              <option value="all">All reviewers</option>
              {reviewers.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className="section-label">Min Budget ($)</label>
            <input type="number" placeholder="0" value={minBudget} onChange={e => setMinBudget(e.target.value)} style={inputStyle} />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          <div>
            <label className="section-label">Max Budget ($)</label>
            <input type="number" placeholder="No limit" value={maxBudget} onChange={e => setMaxBudget(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label className="section-label">Completed From</label>
            <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} style={{ ...inputStyle, colorScheme: "dark" }} />
          </div>
          <div>
            <label className="section-label">Completed To</label>
            <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} style={{ ...inputStyle, colorScheme: "dark" }} />
          </div>
        </div>
      </div>

      {/* Structured Content Block */}
      {filtered.length === 0 ? (
        <div style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "60px 20px", textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🏁</div>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6, color: "#fff" }}>No campaigns match your filters</div>
        </div>
      ) : (
        <div style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", padding: "12px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "#555" }}>
            <span>Campaign</span>
            <span>Reviewer</span>
            <span>Budget</span>
            <span>Priority</span>
            <span>Completed Date</span>
          </div>
          {filtered.map(c => (
            <div key={c.id} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.04)", alignItems: "center", transition: "background 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.background = "#111"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#fff", marginBottom: 2 }}>{c.title}</div>
                {c.deadline && <div style={{ fontSize: 11, color: "#555" }}>Deadline: {c.deadline}</div>}
              </div>
              <span style={{ fontSize: 13, color: "#a3a3a3" }}>{c.reviewer}</span>
              <span style={{ fontSize: 13, color: "#22c00d", fontWeight: 600 }}>{c.budget}</span>
              <div>
                <span className="badge" style={{ color: priorityColor[c.priority] || "#a3a3a3", background: `${priorityColor[c.priority]}15`, border: `1px solid ${priorityColor[c.priority]}30` }}>
                  {c.priority}
                </span>
              </div>
              <span style={{ fontSize: 12, color: "#a3a3a3" }}>
                {c.completed_at ? new Date(c.completed_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}