"use client";

import React from "react";

export default function ReviewerStats({ reviewersData = [] }) {
  // If you don't pass data directly, you can map your campaigns here just like before.
  // For demonstration based on your image, here is the shaped data:
  const stats = reviewersData.length > 0 ? reviewersData : [
    { name: "Nutan", initial: "N", assigned: 17, completed: 5, active: 12, rate: 29 },
    { name: "Jazee", initial: "J", assigned: 8, completed: 0, active: 8, rate: 0 },
  ];

  // Sort reviewers so the highest completion rate is at the top (True Leaderboard style)
  const sortedStats = [...stats].sort((a, b) => b.rate - a.rate);

  return (
    <div style={{ padding: "32px", maxWidth: "1200px", margin: "0 auto", color: "#fff" }}>
      
      {/* Header */}
      <div style={{ marginBottom: "40px", borderBottom: "1px solid #1e2329", paddingBottom: "20px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: "bold", margin: "0 0 8px 0", display: "flex", alignItems: "center", gap: "12px" }}>
          Reviewer Stats <span style={{ fontSize: "24px" }}>📊</span>
        </h1>
        <p style={{ color: "#8a919e", fontSize: "14px", fontFamily: "monospace", margin: 0 }}>
          Live campaign completion rates and active assignments.
        </p>
      </div>

      {/* Leaderboard Cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {sortedStats.map((reviewer, index) => {
          // Top performer gets the crown!
          const isTopDog = index === 0 && reviewer.rate > 0;

          return (
            <div 
              key={reviewer.name}
              style={{
                background: "linear-gradient(145deg, #111318 0%, #0a0a0a 100%)",
                border: isTopDog ? "1px solid #00ff88" : "1px solid #1e2329",
                borderRadius: "16px",
                padding: "24px",
                display: "flex",
                alignItems: "center",
                gap: "32px",
                boxShadow: isTopDog ? "0 0 20px rgba(0, 255, 136, 0.1)" : "none",
                transition: "transform 0.2s ease",
              }}
            >
              
              {/* 1. Avatar & Name Block */}
              <div style={{ display: "flex", alignItems: "center", gap: "16px", width: "220px" }}>
                <div style={{ 
                  width: "48px", 
                  height: "48px", 
                  borderRadius: "12px", 
                  background: isTopDog ? "rgba(0, 255, 136, 0.1)" : "#1e2329", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  fontSize: "20px", 
                  fontWeight: "bold", 
                  color: isTopDog ? "#00ff88" : "#fff" 
                }}>
                  {reviewer.initial}
                </div>
                <div>
                  <div style={{ fontSize: "18px", fontWeight: "bold", display: "flex", alignItems: "center", gap: "8px" }}>
                    {reviewer.name}
                    {isTopDog && <span title="Top Performer" style={{ fontSize: "20px" }}>👑</span>}
                  </div>
                  <div style={{ fontSize: "12px", color: "#8a919e", fontFamily: "monospace", marginTop: "4px" }}>
                    Rank #{index + 1}
                  </div>
                </div>
              </div>

              {/* 2. Sleek Progress Bar */}
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                  <span style={{ fontSize: "13px", color: "#8a919e", textTransform: "uppercase", letterSpacing: "1px" }}>Completion Rate</span>
                  <span style={{ fontSize: "14px", fontWeight: "bold", color: reviewer.rate > 0 ? "#00ff88" : "#8a919e" }}>
                    {reviewer.rate}%
                  </span>
                </div>
                <div style={{ height: "8px", background: "#1e2329", borderRadius: "10px", overflow: "hidden" }}>
                  <div 
                    style={{ 
                      width: `${reviewer.rate}%`, 
                      height: "100%", 
                      background: isTopDog ? "linear-gradient(90deg, #00cc6a, #00ff88)" : "#fff", 
                      borderRadius: "10px",
                      transition: "width 1s ease-in-out"
                    }} 
                  />
                </div>
              </div>

              {/* 3. Stat Pills */}
              <div style={{ display: "flex", gap: "12px", width: "300px", justifyContent: "flex-end" }}>
                <div style={{ background: "#15181e", padding: "10px 16px", borderRadius: "8px", textAlign: "center", border: "1px solid #1e2329" }}>
                  <div style={{ fontSize: "11px", color: "#8a919e", marginBottom: "4px" }}>ASSIGNED</div>
                  <div style={{ fontSize: "16px", fontWeight: "bold", color: "#fff" }}>{reviewer.assigned}</div>
                </div>
                <div style={{ background: "#15181e", padding: "10px 16px", borderRadius: "8px", textAlign: "center", border: "1px solid #1e2329" }}>
                  <div style={{ fontSize: "11px", color: "#8a919e", marginBottom: "4px" }}>ACTIVE</div>
                  <div style={{ fontSize: "16px", fontWeight: "bold", color: "#a855f7" }}>{reviewer.active}</div>
                </div>
                <div style={{ background: "#15181e", padding: "10px 16px", borderRadius: "8px", textAlign: "center", border: "1px solid #1e2329" }}>
                  <div style={{ fontSize: "11px", color: "#8a919e", marginBottom: "4px" }}>CLEARED</div>
                  <div style={{ fontSize: "16px", fontWeight: "bold", color: "#00ff88" }}>{reviewer.completed}</div>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}