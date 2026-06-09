"use client";
import { useState, useEffect, createContext, useContext } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import "./globals.css";

export const AppContext = createContext(null);
export function useApp() { return useContext(AppContext); }

const ADMIN_NAV = [
  { path: "/dashboard",           icon: "▦", label: "Dashboard"           },
  { path: "/campaigns/create",    icon: "＋", label: "Create Campaign"     },
  { path: "/campaigns/active",    icon: "◉", label: "Active Campaigns"    },
  { path: "/campaigns/completed", icon: "✓", label: "Completed Campaigns" },
  { path: "/stats",               icon: "↗", label: "Reviewer Stats"      },
  { path: "/settings",            icon: "⚙", label: "Settings"            },
];

const REVIEWER_NAV = [
  { path: "/reviewer",           icon: "◉", label: "My Campaigns" },
  { path: "/reviewer/completed", icon: "✓", label: "Completed"    },
  { path: "/settings",           icon: "⚙", label: "Settings"     },
];

function Sidebar({ user, onSignOut }) {
  const pathname = usePathname();
  const isAdmin = user?.role === "admin";
  const NAV = isAdmin ? ADMIN_NAV : REVIEWER_NAV;

  return (
    <aside style={{ width: 248, background: "#0a0a0a", borderRight: "1px solid rgba(255,255,255,0.08)", display: "flex", flexDirection: "column", position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 100 }}>
      <div style={{ padding: "22px 20px 18px", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", gap: 11 }}>
        <div style={{ width: 32, height: 32, background: "linear-gradient(135deg, #22c00d, #059669)", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, boxShadow: "0 0 20px rgba(34,192,13,0.25)", flexShrink: 0, color: "#000000" }}>⚡</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: -0.2, lineHeight: 1.2, color: "#ffffff" }}>Campaign</div>
          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: -0.2, color: "#22c00d", lineHeight: 1.2 }}>ReviewFlow</div>
        </div>
      </div>
      <nav style={{ flex: 1, padding: "14px 10px", overflowY: "auto" }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", color: "#a3a3a3", padding: "0 10px 8px" }}>
          {isAdmin ? "Manager Panel" : "Reviewer Panel"}
        </div>
        {NAV.map(item => {
          const active = pathname === item.path;
          return (
            <Link key={item.path} href={item.path} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, marginBottom: 2, textDecoration: "none", fontSize: 13.5, fontWeight: active ? 600 : 500, color: active ? "#ffffff" : "#a3a3a3", background: active ? "rgba(34,192,13,0.12)" : "transparent", border: `1px solid ${active ? "rgba(34,192,13,0.3)" : "transparent"}`, transition: "all 0.15s" }}>
              <span style={{ fontSize: 15, width: 18, textAlign: "center", color: active ? "#22c00d" : "#a3a3a3" }}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div style={{ padding: "12px 14px", borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, flexShrink: 0, background: "linear-gradient(135deg, #22c00d, #059669)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#000000" }}>
          {user?.name?.split(" ").map(n => n[0]).join("") || user?.email?.[0]?.toUpperCase() || "U"}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "#ffffff" }}>{user?.name || user?.email}</div>
          <div style={{ fontSize: 11, color: "#22c00d", textTransform: "capitalize", fontWeight: 600 }}>{user?.role || "reviewer"}</div>
        </div>
        <button onClick={onSignOut} title="Sign out" style={{ background: "none", border: "none", color: "#a3a3a3", cursor: "pointer", fontSize: 16, padding: 4, borderRadius: 6 }}>⏻</button>
      </div>
    </aside>
  );
}

function AuthPage({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleLogin = async () => {
    setLoading(true); setError(""); setMessage("");
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError(error.message); setLoading(false); return; }
    const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single();
    onLogin({ id: data.user.id, email: data.user.email, name: profile?.full_name || data.user.email, role: profile?.role || "reviewer" });
    setLoading(false);
  };

  const handleSignup = async () => {
    setLoading(true); setError(""); setMessage("");
    if (!name.trim()) { setError("Please enter your name."); setLoading(false); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); setLoading(false); return; }
    const { error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: name } } });
    if (error) { setError(error.message); setLoading(false); return; }
    setMessage("Account created! You can now sign in.");
    setMode("login"); setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#000000" }}>
      <div style={{ width: 400, padding: "44px 38px", background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 18, boxShadow: "0 40px 100px rgba(0,0,0,0.8)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 34 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, background: "linear-gradient(135deg, #22c00d, #059669)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: "#000000" }}>⚡</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#ffffff" }}>Campaign ReviewFlow</div>
            <div style={{ fontSize: 11, color: "#a3a3a3" }}>Review Management Platform</div>
          </div>
        </div>
        <div style={{ display: "flex", background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: 4, marginBottom: 28, border: "1px solid rgba(255,255,255,0.05)" }}>
          {["login", "signup"].map(m => (
            <button key={m} onClick={() => { setMode(m); setError(""); setMessage(""); }} style={{ flex: 1, padding: "9px 0", borderRadius: 8, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", background: mode === m ? "#22c00d" : "transparent", color: mode === m ? "#000000" : "#a3a3a3" }}>
              {m === "login" ? "Sign In" : "Create Account"}
            </button>
          ))}
        </div>
        <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 6, color: "#ffffff" }}>{mode === "login" ? "Welcome back" : "Create your account"}</div>
        <div style={{ fontSize: 14, color: "#a3a3a3", marginBottom: 24 }}>{mode === "login" ? "Sign in to your dashboard" : "Set up your own username and password"}</div>
        {error   && <div style={{ fontSize: 13, color: "#f87171", background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, padding: "10px 12px", marginBottom: 14 }}>{error}</div>}
        {message && <div style={{ fontSize: 13, color: "#86efac", background: "rgba(34,197,94,0.05)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 8, padding: "10px 12px", marginBottom: 14 }}>{message}</div>}
        {mode === "signup" && <>
          <label style={{ display: "block", fontSize: 11, fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase", color: "#a3a3a3", marginBottom: 6 }}>Full Name</label>
          <input type="text" placeholder="Your full name" value={name} onChange={e => setName(e.target.value)} style={{ width: "100%", padding: "11px 14px", background: "#000000", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, color: "#ffffff", fontSize: 14, outline: "none", marginBottom: 14, boxSizing: "border-box", fontFamily: "inherit" }} />
        </>}
        <label style={{ display: "block", fontSize: 11, fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase", color: "#a3a3a3", marginBottom: 6 }}>Email</label>
        <input type="email" placeholder="you@company.com" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && (mode === "login" ? handleLogin() : handleSignup())} style={{ width: "100%", padding: "11px 14px", background: "#000000", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, color: "#ffffff", fontSize: 14, outline: "none", marginBottom: 14, boxSizing: "border-box", fontFamily: "inherit" }} />
        <label style={{ display: "block", fontSize: 11, fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase", color: "#a3a3a3", marginBottom: 6 }}>Password</label>
        <input type="password" placeholder={mode === "signup" ? "Min. 6 characters" : "••••••••"} value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && (mode === "login" ? handleLogin() : handleSignup())} style={{ width: "100%", padding: "11px 14px", background: "#000000", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, color: "#ffffff", fontSize: 14, outline: "none", marginBottom: 22, boxSizing: "border-box", fontFamily: "inherit" }} />
        <button onClick={mode === "login" ? handleLogin : handleSignup} disabled={!email || !password || loading} style={{ width: "100%", padding: 13, background: (!email || !password || loading) ? "#1f1f1f" : "#22c00d", color: (!email || !password || loading) ? "#555555" : "#000000", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: (!email || !password || loading) ? "not-allowed" : "pointer", fontFamily: "inherit" }}>
          {loading ? "Please wait…" : mode === "login" ? "Sign in →" : "Create account →"}
        </button>
        <div style={{ fontSize: 12, color: "#555555", textAlign: "center", marginTop: 18 }}>
          {mode === "login" ? "No account yet? " : "Already have an account? "}
          <span onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); setMessage(""); }} style={{ color: "#22c00d", cursor: "pointer", fontWeight: 600 }}>
            {mode === "login" ? "Create one →" : "Sign in →"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function RootLayout({ children }) {
  const [user, setUser]           = useState(null);
  const [loading, setLoading]     = useState(true);
  const [campaigns, setCampaigns] = useState([]);
  const supabase = createClient();

  // ── Load user session on mount ──────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        const { data: profile } = await supabase
          .from("profiles").select("*").eq("id", session.user.id).single();
        setUser({
          id:    session.user.id,
          email: session.user.email,
          name:  profile?.full_name || session.user.email,
          role:  profile?.role || "reviewer",
        });
      }
      setLoading(false);
    });
  }, []);

  // ── Fetch campaigns from Supabase whenever user changes ──────
  useEffect(() => {
    if (!user) return;
    fetchCampaigns();
  }, [user]);

  const fetchCampaigns = async () => {
    const { data, error } = await supabase
      .from("campaigns")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setCampaigns(data);
  };

  // ── ADD — INSERT into Supabase ───────────────────────────────
  const addCampaign = async (campaign) => {
    const { data, error } = await supabase
      .from("campaigns")
      .insert([{
        title:      campaign.title,
        reviewer:   campaign.reviewer,
        priority:   campaign.priority,
        budget:     campaign.budget,
        deadline:   campaign.deadline,
        status:     "active",
        created_by: user.id,
      }])
      .select()
      .single();
    if (!error && data) setCampaigns(prev => [data, ...prev]);
  };

  // ── COMPLETE — UPDATE status in Supabase ─────────────────────
  const completeCampaign = async (id) => {
    const now = new Date().toISOString();
    const { error } = await supabase
      .from("campaigns")
      .update({ status: "completed", completed_at: now })
      .eq("id", id);
    if (!error) {
      setCampaigns(prev =>
        prev.map(c => c.id === id ? { ...c, status: "completed", completed_at: now } : c)
      );
    }
  };

  // ── DELETE — DELETE from Supabase ────────────────────────────
  const deleteCampaign = async (id) => {
    const { error } = await supabase
      .from("campaigns")
      .delete()
      .eq("id", id);
    if (!error) setCampaigns(prev => prev.filter(c => c.id !== id));
  };

  // ── UPDATE — UPDATE any fields in Supabase ───────────────────
  const updateCampaign = async (id, updates) => {
    const { error } = await supabase
      .from("campaigns")
      .update(updates)
      .eq("id", id);
    if (!error) setCampaigns(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const handleLogin = (u) => setUser(u);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setCampaigns([]);
  };

  if (loading) {
    return (
      <html lang="en">
        <body style={{ margin: 0, background: "#000000", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
          <div style={{ color: "#22c00d", fontSize: 14 }}>Loading…</div>
        </body>
      </html>
    );
  }

  if (!user) {
    return (
      <html lang="en">
        <body style={{ margin: 0, fontFamily: "'Geist', 'Segoe UI', sans-serif", background: "#000000", color: "#ffffff" }}>
          <AuthPage onLogin={handleLogin} />
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "'Geist', 'Segoe UI', sans-serif", background: "#000000", color: "#ffffff" }}>
        <AppContext.Provider value={{ user, campaigns, addCampaign, completeCampaign, deleteCampaign, updateCampaign, fetchCampaigns }}>
          <div style={{ display: "flex", minHeight: "100vh" }}>
            <Sidebar user={user} onSignOut={handleSignOut} />
            <main style={{ marginLeft: 248, flex: 1, minHeight: "100vh", background: "#000000" }}>
              {children}
            </main>
          </div>
        </AppContext.Provider>
      </body>
    </html>
  );
}