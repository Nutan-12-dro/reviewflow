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
  // 1. Process data for Status Pie Chart (Active vs Completed)
  const activeCount = campaigns.filter((c) => c.status === "active").length;
  const completedCount = campaigns.filter((c) => c.status === "completed").length;

  const statusPieData = [
    { name: "Active", value: activeCount },
    { name: "Completed", value: completedCount },
  ];
  const STATUS_COLORS = ["#22c00d", "#333333"]; // Green and Dark Grey

  // 2. Process data for Priority Pie Chart (Urgent vs Standard)
  // To make a proper pie chart, we split the Total into "Urgent" and "Standard"
  const urgentCount = campaigns.filter(
    (c) => c.priority?.toLowerCase() === "high" || c.priority?.toLowerCase() === "urgent"
  ).length;
  const standardCount = campaigns.length - urgentCount;

  const priorityPieData = [
    { name: "Urgent / High", value: urgentCount },
    { name: "Standard", value: standardCount },
  ];
  const PRIORITY_COLORS = ["#f59e0b", "#333333"]; // Orange and Dark Grey

  // 3. Process data for Bar Chart (Assignee Workload)
  const workloadMap = {};
  campaigns.forEach((c) => {
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

  if (!campaigns || campaigns.length === 0) {
    return <div className="text-gray-500 mt-8 text-sm">Loading visual data...</div>;
  }

  return (
    // Updated to grid-cols-3 so all three charts sit perfectly side-by-side on large screens
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8 w-full">
      
      {/* Pie Chart 1: Active vs Completed */}
      <div className="p-6 bg-[#0a0a0a] border border-[#222] rounded-xl">
        <h3 className="text-white text-lg font-semibold mb-6">Campaign Status</h3>
        <div style={{ height: "300px", width: "100%" }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusPieData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {statusPieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
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

      {/* Pie Chart 2: Urgent vs Standard */}
      <div className="p-6 bg-[#0a0a0a] border border-[#222] rounded-xl">
        <h3 className="text-white text-lg font-semibold mb-6">Priority Distribution</h3>
        <div style={{ height: "300px", width: "100%" }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={priorityPieData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {priorityPieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PRIORITY_COLORS[index % PRIORITY_COLORS.length]} />
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
        <div style={{ height: "300px", width: "100%" }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="reviewer" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip
                cursor={{ fill: "#1a1a1a" }}
                contentStyle={{ backgroundColor: "#111", borderColor: "#333", color: "#fff", borderRadius: "8px" }}
              />
              <Bar dataKey="activeCampaigns" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}