"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/app/layout";

const REVIEWERS = ["Nutan", "Jazee"];
const PRIORITIES = ["urgent", "high", "medium", "low"];
const priorityColors = { urgent: "#ef4444", high: "#f59e0b", medium: "#22c00d", low: "#555555" };

export default function CreateCampaignPage() {
  const { user, addCampaign } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (user && user.role !== "admin") {
      router.push("/reviewer");
    }
  }, [user, router]);

  if (user && user.role !== "admin") {
    return null; 
  }

  const [form, setForm] = useState({ title: "", reviewer: "", priority: "medium", budget: "", deadline: "" });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const set = (key, val) => {
    setForm(prev => ({ ...prev, [key]: val }));
    setErrors(prev => ({ ...prev, [key]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim())    e.title    = "Campaign title is required";
    if (!form.reviewer)        e.reviewer = "Please assign a reviewer";
    if (!form.budget.trim())   e.budget   = "Budget is required";
    if (!form.deadline)        e.deadline = "Deadline is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    addCampaign(form);
    setSubmitted(true);
    setTimeout(() => router.push("/campaigns/active"), 1200);
  };

  const inputStyle = (key) => ({
    width: "100%", padding: "12px 14px",
    background: "#0a0a0a",
    border: `1px solid ${errors[key] ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.08)"}`,
    borderRadius: 10, color: "#ffffff", fontSize: 14,
    outline: "none", boxSizing: "border-box", fontFamily: "inherit",
  });

  if (submitted) {
    return (
      <div style={{ padding: 32, display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
          <div className="font-display" style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Campaign Created!</div>
          <div style={{ fontSize: 14, color: "#a3a3a3" }}>Redirecting to Active Campaigns…</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "36px 40px", background: "#000", minHeight: "100vh", maxWidth: 720 }}>
      <div style={{ marginBottom: 32 }}>
        <div className="section-label">Campaign Management</div>
        <h1 className="page-title">Create Campaign</h1>
        <p style={{ fontSize: 14, color: "#555", marginTop: 4 }}>Fill in the fields below to dispatch a new active campaign item.</p>
      </div>

      <div style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 32 }}>
        <div style={{ marginBottom: 24 }}>
          <label className="section-label">Campaign Title</label>
          <input className="input-focus" style={inputStyle("title")} placeholder="e.g. Citadel Show Clipping" value={form.title} onChange={e => set("title", e.target.value)} />
          {errors.title && <div style={{ fontSize: 12, color: "#ef4444", marginTop: 6 }}>⚠ {errors.title}</div>}
        </div>

        <div style={{ marginBottom: 24 }}>
          <label className="section-label">Assigned Reviewer</label>
          <select style={inputStyle("reviewer")} value={form.reviewer} onChange={e => set("reviewer", e.target.value)}>
            <option value="">Select a reviewer…</option>
            {REVIEWERS.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          {errors.reviewer && <div style={{ fontSize: 12, color: "#ef4444", marginTop: 6 }}>⚠ {errors.reviewer}</div>}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
          <div>
            <label className="section-label">Priority</label>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {PRIORITIES.map(p => (
                <button key={p} type="button" onClick={() => set("priority", p)}
                  style={{
                    padding: "8px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", border: "1px solid", fontFamily: "inherit", textTransform: "capitalize",
                    borderColor: form.priority === p ? priorityColors[p] : "rgba(255,255,255,0.08)",
                    background: form.priority === p ? `${priorityColors[p]}15` : "#0a0a0a",
                    color: form.priority === p ? priorityColors[p] : "#555555",
                  }}>{p}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="section-label">Budget</label>
            <input style={inputStyle("budget")} placeholder="e.g. $6,000" value={form.budget} onChange={e => set("budget", e.target.value)} />
            {errors.budget && <div style={{ fontSize: 12, color: "#ef4444", marginTop: 6 }}>⚠ {errors.budget}</div>}
          </div>
        </div>

        <div style={{ marginBottom: 32 }}>
          <label className="section-label">Deadline</label>
          <input type="date" style={{ ...inputStyle("deadline"), colorScheme: "dark" }} value={form.deadline} onChange={e => set("deadline", e.target.value)} />
          {errors.deadline && <div style={{ fontSize: 12, color: "#ef4444", marginTop: 6 }}>⚠ {errors.deadline}</div>}
        </div>

        <button type="button" onClick={handleSubmit} className="btn-primary" style={{ width: "100%", padding: 14, borderRadius: 10, fontSize: 14, cursor: "pointer" }}>
          Create Campaign →
        </button>
      </div>
    </div>
  );
}