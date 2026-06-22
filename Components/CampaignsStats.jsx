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

// Helper component for the cool data labels
function StatBox({ label, value, hexColor = "#ffffff" }) {
  return (
    <div className="bg-[#111318] border border-[#1e2329] rounded-xl p-4 flex flex-col justify-center w-full">
      <span className="text-[#8a919e] text-[10px] uppercase tracking-widest font-mono mb-1">{label}</span>
      <span className="text-2xl font-bold" style={{ color: hexColor }}>{value}</span>
    </div>
  );
}

export default function CampaignsStats({ campaigns = [] }) {
  const total = campaigns.length || 0;

  // 1. Process Status Data
  const activeCount = campaigns.filter((c) => c.status === "active").length;
  const completedCount = campaigns.filter((c) => c.status === "completed").length;
  const completionRate = total > 0 ? Math.round((completedCount / total) * 100) : 0;

  const statusPieData = [
    { name: "Active", value: activeCount },
    { name: "Completed", value: completedCount },
  ];
  const STATUS_COLORS = ["#a855f7", "#ffffff"]; // Neon Purple & White

  // 2. Process Priority Data
  const urgentCount = campaigns.filter(
    (c) => c.priority?.toLowerCase() === "high" || c.priority?.toLowerCase() === "urgent"
  ).length;
  const standardCount = total - urgentCount;
  const urgentRate = total > 0 ? Math.round((urgentCount / total) * 100) : 0;

  const priorityPieData = [
    { name: "Urgent / High", value: urgentCount },
    { name: "Standard", value: standardCount },
  ];
  const PRIORITY_COLORS = ["#ff5e00", "#3b82f6"]; // Neon Orange & Blue

  // 3. Process Reviewer Workload Data
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
    return <div className="text-[#8a919e] mt-8 text-sm font-mono tracking-wider">Loading visual data...</div>;
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
    <div className="flex flex-col gap-6 mt-8 w-full">
      
      {/* Top Row: Donut Charts (Stacked on mobile, Side-by-Side on very large screens) */}
      <div className="grid grid-cols-1 2xl:grid-cols-2 gap-6 w-full">
        
        {/* Card 1: Campaign Status */}
        <div className="p-6 bg-[#0a0a0a] border border-[#1e2329] rounded-2xl shadow-lg flex flex-col md:flex-row items-center gap-8">
          <div className="w-full md:w-1/2 h-[220px]">
            <h3 className="text-white text-md font-bold mb-1 tracking-wide">Campaign Status</h3>
            <p className="text-[#8a919e] text-xs font-mono mb-2">Active vs Completed</p>
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
          <div className="w-full md:w-1/2 grid grid-cols-2 gap-4">
            <StatBox label="Total Count" value={total} hexColor="#ffffff" />
            <StatBox label="Complete %" value={`${completionRate}%`} hexColor="#00ff88" />
            <StatBox label="Active" value={activeCount} hexColor="#a855f7" />
            <StatBox label="Completed" value={completedCount} hexColor="#ffffff" />
          </div>
        </div>

        {/* Card 2: Priority Matrix */}
        <div className="p-6 bg-[#0a0a0a] border border-[#1e2329] rounded-2xl shadow-lg flex flex-col md:flex-row items-center gap-8">
          <div className="w-full md:w-1/2 h-[220px]">
            <h3 className="text-white text-md font-bold mb-1 tracking-wide">Priority Matrix</h3>
            <p className="text-[#8a919e] text-xs font-mono mb-2">Urgent Workload</p>
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
          <div className="w-full md:w-1/2 grid grid-cols-2 gap-4">
            <StatBox label="Critical Load" value={`${urgentRate}%`} hexColor="#ff5e00" />
            <StatBox label="Urgent Tasks" value={urgentCount} hexColor="#ff5e00" />
            <StatBox label="Standard" value={standardCount} hexColor="#3b82f6" />
            <StatBox label="Total Priority" value={total} hexColor="#ffffff" />
          </div>
        </div>

      </div>

      {/* Bottom Row: Bar Chart (Full Width) */}
      <div className="p-6 bg-[#0a0a0a] border border-[#1e2329] rounded-2xl shadow-lg flex flex-col xl:flex-row items-center gap-8 w-full">
        <div className="w-full xl:w-2/3 h-[240px]">
          <h3 className="text-white text-md font-bold mb-1 tracking-wide">Reviewer Load</h3>
          <p className="text-[#8a919e] text-xs font-mono mb-4">Active Tasks per Assignee</p>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <XAxis dataKey="reviewer" stroke="#8a919e" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#8a919e" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip cursor={{ fill: "#13161c" }} contentStyle={customTooltipStyle} />
              <Bar dataKey="activeCampaigns" fill="#00ff88" radius={[6, 6, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="w-full xl:w-1/3 flex flex-col gap-4">
          <StatBox label="Active Reviewers" value={activeReviewers} hexColor="#ffffff" />
          <StatBox label="Highest Workload" value={maxWorkload} hexColor="#00ff88" />
          <StatBox label="Average Load" value={avgWorkload} hexColor="#a855f7" />
        </div>
      </div>

    </div>
  );
}