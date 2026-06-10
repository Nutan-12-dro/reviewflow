"use client";
import { useState, useEffect, useMemo } from "react"; // 👈 FIXED: Added missing useState and useMemo hooks
import { useApp } from "../../layout"; 
import { useRouter } from "next/navigation"; 

// 👈 FIXED: Defined missing priorityColor reference object
const priorityColor = { urgent: "#ef4444", high: "#f59e0b", medium: "#22c00d", low: "#5a6480" };

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
  const [minBudget, setMinBudget]     = useState("");
  const [maxBudget, setMaxBudget]     = useState("");
  const [fromDate, setFromDate]       = useState("");
  const [toDate, setToDate]           = useState("");

  const completed = campaigns?.filter(c => c.status === "completed") || [];

  // Get unique reviewers for filter dropdown
  const reviewers = [...new Set((completed || []).map(c => c.reviewer))].filter(Boolean);

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

  // Total budget of filtered campaigns
  const totalBudget = filtered.reduce((sum, c) => {
    const n = parseFloat((c.budget || "0").replace(/[^0-9.]/g, ""));
    return sum + (isNaN(n) ? 0 : n);
  }, 0);

  const clearFilters = () => {
    setSearch(""); setSortBy("newest"); setFilterPriority("all");
    setFilterReviewer("all"); setMinBudget(""); setMaxBudget("");
    setFromDate(""); setToDate("");
  };

  // Export to CSV
  const exportCSV = () => {
    const headers = ["Title", "Reviewer", "Priority", "Budget", "Deadline", "Completed At"];
    const rows = filtered?.map(c => [
      c.title, c.reviewer, c.priority, c.budget, c.deadline,
      c.completed_at ? new Date(c.completed_at).toLocaleDateString() : ""
    ]);
    const csv = [headers, ...rows].map(r => r.map(v => `"${v || ""}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "completed-campaigns.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const inputStyle = { width: "100%", padding: "10px 12px", background: "#000000", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#ffffff", fontSize: 13, outline: "none", fontFamily: "inherit", boxSizing: "border-box" };
  const selectStyle = { ...inputStyle, cursor: "pointer", appearance: "none" };
  const labelStyle = { display: "block", fontSize: 10, fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase", color: "#a3a3a3", marginBottom: 6 };

  return (
    <div style={{ padding: 32, background: "#000000", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", color: "#a3a3a3", marginBottom: 6 }}>Records</div>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 700, margin: "0 0 4px", letterSpacing: -0.5, color: "#ffffff" }}>Completed Campaigns</h1>
            <p style={{ fontSize: 14, color: "#a3a3a3", margin: 0 }}>
              {filtered.length} of {completed.length} campaigns · Total budget: <strong style={{ color: "#22c00d" }}>${totalBudget.toLocaleString()}</strong>
            </p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={clearFilters} style={{ padding: "9px 16px", background: "none", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#a3a3a3", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
              ✕ Clear Filters
            </button>
            <button onClick={exportCSV} style={{ padding: "9px 16px", background: "rgba(34,192,13,0.1)", border: "1px solid rgba(34,192,13,0.3)", borderRadius: 8, color: "#22c00d", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
              ↓ Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: 20, marginBottom: 24 }}>
        {/* Search */}
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Search</label>
          <input placeholder="Search by campaign name or reviewer..." value={search} onChange={e => setSearch(e.target.value)} style={inputStyle} />
        </div>

        {/* Row 1 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
          <div>
            <label style={labelStyle}>Sort By</label>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={selectStyle}>
              <option value="newest">Newest completed first</option>
              <option value="oldest">Oldest completed first</option>
              <option value="priority">By priority</option>
              <option value="az">A → Z</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Priority</label>
            <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)} style={selectStyle}>
              <option value="all">All priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Reviewer</label>
            <select value={filterReviewer} onChange={e => setFilterReviewer(e.target.value)} style={selectStyle}>
              <option value="all">All reviewers</option>
              {reviewers.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Min Budget ($)</label>
            <input type="number" placeholder="0" value={minBudget} onChange={e => setMinBudget(e.target.value)} style={inputStyle} />
          </div>
        </div>

        {/* Row 2 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          <div>
            <label style={labelStyle}>Max Budget ($)</label>
            <input type="number" placeholder="No limit" value={maxBudget} onChange={e => setMaxBudget(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Completed From</label>
            <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} style={{ ...inputStyle, colorScheme: "dark" }} />
          </div>
          <div>
            <label style={labelStyle}>Completed To</label>
            <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} style={{ ...inputStyle, colorScheme: "dark" }} />
          </div>
        </div>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "60px 20px", textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🏁</div>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6, color: "#ffffff" }}>
            {completed.length === 0 ? "No completed campaigns yet" : "No campaigns match your filters"}
          </div>
          <div style={{ fontSize: 13, color: "#a3a3a3" }}>
            {completed.length === 0 ? "Mark active campaigns as complete and they'll appear here." : "Try adjusting your filters."}
          </div>
        </div>
      ) : (
        <div style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, overflow: "hidden" }}>
          {/* Table Header */}
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", padding: "11px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", fontSize: 11, fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase", color: "#a3a3a3" }}>
            <span>Campaign</span>
            <span>Reviewer</span>
            <span>Budget</span>
            <span>Priority</span>
            <span>Completed</span>
          </div>
          {filtered?.map(c => (
            <div key={c.id} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.04)", alignItems: "center", transition: "background 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.background = "#0f0f0f"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#ffffff", marginBottom: 2 }}>{c.title}</div>
                {c.deadline && <div style={{ fontSize: 11, color: "#a3a3a3" }}>Deadline: {c.deadline}</div>}
              </div>
              <span style={{ fontSize: 13, color: "#a3a3a3" }}>{c.reviewer}</span>
              <span style={{ fontSize: 13, color: "#22c00d", fontWeight: 600 }}>{c.budget}</span>
              <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 6, textTransform: "uppercase", color: priorityColor[c.priority] || "#a3a3a3", background: `${priorityColor[c.priority] || "#a3a3a3"}15`, display: "inline-block", border: `1px solid ${priorityColor[c.priority] || "#a3a3a3"}30` }}>
                {c.priority}
              </span>
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