"use client";

import { 
  PieChart, Pie, Cell, 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer 
} from "recharts";

const PIE_COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"];

export default function ActiveCampaignsStats({ activeCampaigns = [] }) {
  
  // Filter by "reviewer" instead of "assignee"
  const nutanCount = activeCampaigns.filter(c => c.reviewer === "Nutan").length;
  const jazeeCount = activeCampaigns.filter(c => c.reviewer === "Jazee").length;

  // Map to "title" instead of "name"
  const campaignData = activeCampaigns.map((campaign) => ({
    name: campaign.title,
    value: 1 
  }));

  const assigneeData = [
    { name: "Nutan", count: nutanCount, fill: "#22c00d" }, // Updated to match your specific green
    { name: "Jazee", count: jazeeCount, fill: "#f59e0b" }, 
  ];

  // If there are no active campaigns, don't show the charts
  if (activeCampaigns.length === 0) return null;

  return (
    <div className="w-full bg-[#0a0a0a] border border-[#ffffff14] rounded-[14px] p-6 mb-[40px]">
      <div className="mb-6">
        <h2 className="text-white text-[15px] font-bold tracking-wide">
          Campaign Visuals
        </h2>
        <p className="text-[#555] text-xs font-medium mt-1">
          Live Tracking Data
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Side: Pie Chart */}
        <div className="bg-[#000] rounded-lg p-4 border border-[#ffffff0a]">
          <h3 className="text-[#8a919e] text-xs uppercase tracking-widest font-semibold mb-4 text-center">
            Active Campaigns
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={campaignData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                  nameKey="name"
                  className="text-[10px] fill-white focus:outline-none"
                >
                  {campaignData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name) => ["Active", name]}
                  contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #ffffff14', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Side: Bar Graph */}
        <div className="bg-[#000] rounded-lg p-4 border border-[#ffffff0a]">
          <h3 className="text-[#8a919e] text-xs uppercase tracking-widest font-semibold mb-4 text-center">
            Workload Distribution
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={assigneeData} margin={{ top: 20, right: 30, left: -20, bottom: 5 }}>
                <XAxis 
                  dataKey="name" 
                  stroke="#555" 
                  tick={{ fill: '#555', fontSize: 12 }} 
                  axisLine={false} 
                  tickLine={false} 
                />
                <YAxis 
                  stroke="#555" 
                  tick={{ fill: '#555', fontSize: 12 }} 
                  axisLine={false} 
                  tickLine={false} 
                  allowDecimals={false}
                />
                <Tooltip 
                  cursor={{ fill: '#ffffff0a' }}
                  contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #ffffff14', borderRadius: '8px', color: '#fff' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}