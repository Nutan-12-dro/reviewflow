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
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function CampaignsStats({ campaigns = [] }) {
  // 1. Process data for Pie Chart (Active vs Completed)
  const activeCount = campaigns.filter((c) => c.status === "active").length;
  const completedCount = campaigns.filter((c) => c.status === "completed").length;

  const pieData = [
    { name: "Active", value: activeCount },
    { name: "Completed", value: completedCount },
  ];

  // Colors mapping to your dashboard theme (Green for active, dark grey for completed)
  const PIE_COLORS = ["#22c00d", "#333333"]; 

  // 2. Process data for Bar Chart (Assignee Workload)
  const workloadMap = {};
  campaigns.forEach((c) => {
    // Only tracking active workload
    if (c.status === "active") {
      const reviewer = c.reviewer || "Unassigned";
      if (!workloadMap[reviewer]) {
        workloadMap[reviewer] = 0;
      }
      workloadMap[reviewer]++;
    }
  });

  const barData = Object.keys(workloadMap).map((key) => ({
    reviewer: key,
    activeCampaigns: workloadMap[key],
  }));

  // Render a clean fallback if data hasn't loaded yet
  if (!campaigns || campaigns.length === 0) {
    return <div className="text-gray-500 mt-8 text-sm">Loading visual data...</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8 w-full">
      
      {/* Pie Chart: Active vs Completed */}
      <div className="p-6 bg-[#0a0a0a] border border-[#222] rounded-xl">
        <h3 className="text-white text-lg font-semibold mb-6">Campaign Status Distribution</h3>
        {/* INLINE HEIGHT DEFINED HERE TO PREVENT INVISIBLE CHARTS */}
        <div style={{ height: "300px", width: "100%" }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: "#111", borderColor: "#333", color: "#fff", borderRadius: "8px" }}
                itemStyle={{ color: "#fff" }}
              />
              <Legend wrapperStyle={{ paddingTop: "20px" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bar Chart: Assignee Workload */}
      <div className="p-6 bg-[#0a0a0a] border border-[#222] rounded-xl">
        <h3 className="text-white text-lg font-semibold mb-6">Reviewer Workload (Active)</h3>
        {/* INLINE HEIGHT DEFINED HERE TO PREVENT INVISIBLE CHARTS */}
        <div style={{ height: "300px", width: "100%" }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="reviewer" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip
                cursor={{ fill: "#1a1a1a" }}
                contentStyle={{ backgroundColor: "#111", borderColor: "#333", color: "#fff", borderRadius: "8px" }}
              />
              {/* Using your dashboard's orange color for the bars */}
              <Bar dataKey="activeCampaigns" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}