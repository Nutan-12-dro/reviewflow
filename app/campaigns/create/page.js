"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "../../layout";

const REVIEWERS = ["Nutan", "Jazee"];
const PRIORITIES = ["urgent", "high", "medium", "low"];
const priorityColors = { urgent: "#ef4444", high: "#f59e0b", medium: "#22c00d", low: "#5a6480" };

export default function CreateCampaignPage() {
  const { addCampaign } = useApp();
  const router = useRouter();

  const [form, setForm] = useState({
    title:    "",
    reviewer: "",
    priority: "medium",
    budget:   "",
    deadline: "",
  });
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
    background: "#0f1118",
    border: `1px solid ${errors[key] ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.07)"}`,
    borderRadius: 10, color: "#e8eaf2", fontSize: 14,
    outline: "none", boxSizing: "border-box", fontFamily: "inherit",
    transition: "border-color 0.15s",
  });

  const labelStyle = {
    display: "block", fontSize: 11, fontWeight: 700,
    letterSpacing: 0.6, textTransform: "uppercase",
    color: "#5a6480", marginBottom: 7,
  };

  if (submitted) {
    return (
      <div style={{ padding: 32, display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
          <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Campaign Created!</div>
          <div style={{ fontSize: 14, color: "#5a6480" }}>Redirecting to Active Campaigns…</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 32, maxWidth: 640 }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", color: "#2e3348", marginBottom: 6 }}>
          Campaign Management
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 700, margin: "0 0 6px", letterSpacing: -0.5 }}>Create Campaign</h1>
        <p style={{ fontSize: 14, color: "#5a6480", margin: 0 }}>Fill in the details below. The campaign will appear in Active Campaigns immediately.</p>
      </div>

      {/* Form Card */}
      <div style={{
        background: "#0a0a0a",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 16, padding: 28,
      }}>
        {/* Title */}
        <div style={{ marginBottom: 22 }}>
          <label style={labelStyle}>Campaign Title</label>
          <input
            style={inputStyle("title")}
            placeholder="e.g. Summer Sale 2026 — Nike"
            value={form.title}
            onChange={e => set("title", e.target.value)}
          />
          {errors.title && <div style={{ fontSize: 12, color: "#f87171", marginTop: 5 }}>⚠ {errors.title}</div>}
        </div>

        {/* Reviewer */}
        <div style={{ marginBottom: 22 }}>
          <label style={labelStyle}>Assigned Reviewer</label>
          <select
            style={{ ...inputStyle("reviewer"), appearance: "none", cursor: "pointer" }}
            value={form.reviewer}
            onChange={e => set("reviewer", e.target.value)}
          >
            <option value="">Select a reviewer…</option>
            {REVIEWERS.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          {errors.reviewer && <div style={{ fontSize: 12, color: "#f87171", marginTop: 5 }}>⚠ {errors.reviewer}</div>}
        </div>

        {/* Priority + Budget row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 22 }}>
          <div>
            <label style={labelStyle}>Priority</label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {PRIORITIES.map(p => (
                <button
                  key={p}
                  onClick={() => set("priority", p)}
                  style={{
                    padding: "8px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600,
                    cursor: "pointer", border: "1px solid",
                    fontFamily: "inherit", textTransform: "capitalize",
                    borderColor: form.priority === p ? priorityColors[p] : "rgba(255,255,255,0.07)",
                    background: form.priority === p ? `${priorityColors[p]}18` : "#0f1118",
                    color: form.priority === p ? priorityColors[p] : "#5a6480",
                    transition: "all 0.15s",
                  }}
                >{p}</button>
              ))}
            </div>
          </div>

          <div>
            <label style={labelStyle}>Budget</label>
            <input
              style={inputStyle("budget")}
              placeholder="e.g. $5,000"
              value={form.budget}
              onChange={e => set("budget", e.target.value)}
            />
            {errors.budget && <div style={{ fontSize: 12, color: "#f87171", marginTop: 5 }}>⚠ {errors.budget}</div>}
          </div>
        </div>

        {/* Deadline */}
        <div style={{ marginBottom: 28 }}>
          <label style={labelStyle}>Deadline</label>
          <input
            type="date"
            style={{ ...inputStyle("deadline"), colorScheme: "dark" }}
            value={form.deadline}
            onChange={e => set("deadline", e.target.value)}
          />
          {errors.deadline && <div style={{ fontSize: 12, color: "#f87171", marginTop: 5 }}>⚠ {errors.deadline}</div>}
        </div>

        {/* Preview */}
        {form.title && (
          <div style={{
            background: "#0f1118", border: "1px solid rgba(255,255,255,0.05)",
            borderRadius: 10, padding: "14px 16px", marginBottom: 24,
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase", color: "#2e3348", marginBottom: 10 }}>Preview</div>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{form.title}</div>
            <div style={{ fontSize: 12, color: "#5a6480", display: "flex", gap: 16, flexWrap: "wrap" }}>
              {form.reviewer && <span>👤 {form.reviewer}</span>}
              {form.budget   && <span>💰 {form.budget}</span>}
              {form.deadline && <span>📅 {form.deadline}</span>}
              <span style={{ color: priorityColors[form.priority], fontWeight: 600, textTransform: "capitalize" }}>
                ↑ {form.priority}
              </span>
            </div>
          </div>
        )}

       {/* Submit */}
<button
  type="submit" /* <--- ADD THIS LINE HERE */
  style={{
    width: "100%", padding: 13,
    background: "linear-gradient(135deg, #22c00d, #6366f1)",
    color: "white", border: "none", borderRadius: 10,
    fontSize: 14, fontWeight: 600, cursor: "pointer",
    fontFamily: "inherit",
    boxShadow: "0 4px 20px rgba(79,124,255,0.3)",
    transition: "all 0.2s",
  }}
>
  Create Campaign →
</button>
      </div>
    </div>
  );
}