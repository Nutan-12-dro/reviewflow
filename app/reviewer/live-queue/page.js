"use client";

import React from "react";
import CampaignsStats from "../../../Components/CampaignsStats";

export default function ReviewerLiveQueue({ campaigns = [], currentUser = "Nutan" }) {
  const myCampaigns = campaigns.filter(c => c.reviewer === currentUser);
  const myActiveCount = myCampaigns.filter(c => c.status === "active").length;
  
  const todayStr = new Date().toDateString();
  const myCompletedToday = myCampaigns.filter(c => {
    if (c.status !== "completed") return false;
    const compDateStr = c.completed_at || c.completedAt;
    return compDateStr ? new Date(compDateStr).toDateString() === todayStr : false;
  }).length;

  return (
    <div style={{ padding: "32px", maxWidth: "1400px", margin: "0 auto", color: "#fff" }}>
      
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "bold", margin: "0 0 8px 0" }}>Reviewer Live Queue</h1>
        <p style={{ color: "#8a919e", fontSize: "14px", fontFamily: "monospace", margin: 0 }}>
          Your daily command center and team leaderboard.
        </p>
      </div>


      <div style={{ display: "flex", gap: "24px", marginBottom: "40px" }}>
        <div style={{ flex: 1, background: "linear-gradient(145deg, #111318 0%, #0a0a0a 100%)", border: "1px solid #1e2329", borderLeft: "4px solid #00ff88", borderRadius: "12px", padding: "24px" }}>
          <span style={{ color: "#8a919e", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: "monospace" }}>My Active Queue</span>
          <div style={{ fontSize: "36px", fontWeight: "bold", color: "#00ff88", marginTop: "8px" }}>
            {myActiveCount} <span style={{ fontSize: "16px", color: "#8a919e", fontWeight: "normal" }}>campaigns to review</span>
          </div>
        </div>

        <div style={{ flex: 1, background: "linear-gradient(145deg, #111318 0%, #0a0a0a 100%)", border: "1px solid #1e2329", borderLeft: "4px solid #a855f7", borderRadius: "12px", padding: "24px" }}>
          <span style={{ color: "#8a919e", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: "monospace" }}>My Clears Today</span>
          <div style={{ fontSize: "36px", fontWeight: "bold", color: "#a855f7", marginTop: "8px" }}>
            {myCompletedToday} <span style={{ fontSize: "16px", color: "#8a919e", fontWeight: "normal" }}>campaigns completed</span>
          </div>
        </div>
      </div>

      <div style={{ borderTop: "1px solid #1e2329", paddingTop: "32px" }}>
        <CampaignsStats campaigns={campaigns} />
      </div>

    </div>
  );
}