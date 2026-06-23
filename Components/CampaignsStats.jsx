"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function StatBox({ label, value, hexColor = "#ffffff" }) {
  return (
    <div style={{ background: "#111318", border: "1px solid #1e2329", borderRadius: "12px", padding: "16px", display: "flex", flexDirection: "column", justifyContent: "center", width: "100%" }}>
      <span style={{ color: "#8a919e", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: "monospace", marginBottom: "4px" }}>{label}</span>
      <span style={{ fontSize: "24px", fontWeight: "bold", color: hexColor }}>{value}</span>
    </div>
  );
}

export default function CampaignsStats({ campaigns = [] }) {
  const total = campaigns.length || 0;

  const activeCount = campaigns.filter((c) => c.status === "active").length;
  const completedCount = campaigns.filter((c) => c.status === "completed").length;
  const completionRate = total > 0 ? Math.round((completedCount / total) * 100) : 0;

  const statusPieData = [
    { name: "Active", value: activeCount },
    { name: "Completed", value: completedCount },
  ];
  const STATUS_COLORS = ["#a855f7", "#ffffff"]; 

  const urgentCount = campaigns.filter((c) => c.status === "active" && (c.priority?.toLowerCase() === "high" || c.priority?.toLowerCase() === "urgent")).length;
  const standardCount = activeCount - urgentCount;
  const activePriorityTotal = urgentCount + standardCount;
  const urgentRate = activePriorityTotal > 0 ? Math.round((urgentCount / activePriorityTotal) * 100) : 0;

  const priorityPieData = [
    { name: "Urgent / High", value: urgentCount },
    { name: "Standard", value: standardCount },
  ];
  const PRIORITY_COLORS = ["#ff5e00", "#3b82f6"]; 

  const workloadMap = {};
  campaigns.forEach((c) => {
    if (c.status === "active") {
      const reviewer = c.reviewer || "Unassigned";
      workloadMap[reviewer] = (workloadMap[reviewer] || 0) + 1;
    }
  });

  const barData = Object.keys(workloadMap).map((key) => ({
    reviewer: key,
    activeCampaigns: workloadMap[key],
  }));

  const activeReviewers = Object.keys(workloadMap).length;
  const workloads = Object.values(workloadMap);
  const maxWorkload = workloads.length > 0 ? Math.max(...workloads) : 0;
  const avgWorkload = activeReviewers > 0 ? (workloads.reduce((a, b) => a + b, 0) / activeReviewers).toFixed(1) : 0;

  if (!campaigns || total === 0) {
    return <div style={{ color: "#8a919e", marginTop: "32px", fontSize: "14px", fontFamily: "monospace" }}>Loading visual data...</div>;
  }

  const customTooltipStyle = {
    backgroundColor: "#050505",
    borderColor: "#1e2329",
    color: "#fff",
    borderRadius: "12px",
    fontFamily: "monospace",
    padding: "10px 14px"
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", marginTop: "32px", width: "100%" }}>
      
      {/* Top Row: Donut Charts */}
      <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", width: "100%" }}>
        
        {/* Card 1: Campaign Status */}
        <div style={{ flex: "1 1 calc(50% - 12px)", minWidth: "340px", padding: "24px", background: "#0a0a0a", border: "1px solid #1e2329", borderRadius: "16px", display: "flex", gap: "24px", alignItems: "center", flexWrap: "wrap", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.5)" }}>
          {/* FIX: Added display flex and column direction here */}
          <div style={{ flex: "1 1 200px", height: "240px", display: "flex", flexDirection: "column" }}>
            <h3 style={{ color: "#fff", fontSize: "16px", fontWeight: "bold", margin: "0 0 4px 0", letterSpacing: "0.025em" }}>Campaign Status</h3>
            <p style={{ color: "#8a919e", fontSize: "12px", fontFamily: "monospace", margin: "0 0 16px 0" }}>Active vs Completed</p>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusPieData} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={4} dataKey="value" stroke="none">
                  {statusPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={customTooltipStyle} itemStyle={{ color: "#fff", fontWeight: "bold" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ flex: "1 1 150px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <StatBox label="Total Count" value={total} hexColor="#ffffff" />
            <StatBox label="Complete %" value={`${completionRate}%`} hexColor="#00ff88" />
            <StatBox label="Active" value={activeCount} hexColor="#a855f7" />
            <StatBox label="Completed" value={completedCount} hexColor="#ffffff" />
          </div>
        </div>

        {/* Card 2: Priority Matrix */}
        <div style={{ flex: "1 1 calc(50% - 12px)", minWidth: "340px", padding: "24px", background: "#0a0a0a", border: "1px solid #1e2329", borderRadius: "16px", display: "flex", gap: "24px", alignItems: "center", flexWrap: "wrap", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.5)" }}>
          {/* FIX: Added display flex and column direction here */}
          <div style={{ flex: "1 1 200px", height: "240px", display: "flex", flexDirection: "column" }}>
            <h3 style={{ color: "#fff", fontSize: "16px", fontWeight: "bold", margin: "0 0 4px 0", letterSpacing: "0.025em" }}>Priority Matrix</h3>
            <p style={{ color: "#8a919e", fontSize: "12px", fontFamily: "monospace", margin: "0 0 16px 0" }}>Urgent Workload</p>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={priorityPieData} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={4} dataKey="value" stroke="none">
                  {priorityPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PRIORITY_COLORS[index % PRIORITY_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={customTooltipStyle} itemStyle={{ color: "#fff", fontWeight: "bold" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ flex: "1 1 150px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <StatBox label="Critical Load" value={`${urgentRate}%`} hexColor="#ff5e00" />
            <StatBox label="Urgent Tasks" value={urgentCount} hexColor="#ff5e00" />
            <StatBox label="Standard" value={standardCount} hexColor="#3b82f6" />
            <StatBox label="Active Total" value={activePriorityTotal} hexColor="#ffffff" />
          </div>
        </div>

      </div>

      {/* Bottom Row: Bar Chart */}
      <div style={{ width: "100%", padding: "24px", background: "#0a0a0a", border: "1px solid #1e2329", borderRadius: "16px", display: "flex", gap: "32px", alignItems: "center", flexWrap: "wrap", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.5)" }}>
        {/* FIX: Added display flex and column direction here */}
        <div style={{ flex: "2 1 400px", height: "240px", display: "flex", flexDirection: "column" }}>
          <h3 style={{ color: "#fff", fontSize: "16px", fontWeight: "bold", margin: "0 0 4px 0", letterSpacing: "0.025em" }}>Reviewer Load</h3>
          <p style={{ color: "#8a919e", fontSize: "12px", fontFamily: "monospace", margin: "0 0 16px 0" }}>Active Tasks per Assignee</p>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <XAxis dataKey="reviewer" stroke="#8a919e" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#8a919e" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip cursor={{ fill: "#13161c" }} contentStyle={customTooltipStyle} />
              <Bar dataKey="activeCampaigns" fill="#00ff88" radius={[6, 6, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{ flex: "1 1 200px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <StatBox label="Active Reviewers" value={activeReviewers} hexColor="#ffffff" />
          <StatBox label="Highest Workload" value={maxWorkload} hexColor="#00ff88" />
          <StatBox label="Average Load" value={avgWorkload} hexColor="#a855f7" />
        </div>
      </div>

    </div>
  );
}